"""Fora da Caixa — envia as notificações que a app pôs na fila (GitHub Action push.yml, de 10 em 10 minutos).

A app escreve cada aviso em ligas/<id>/pushfila/<chave> = {para, titulo, texto, url, criado} (duelos, taça, desafios).
Cada telemóvel que ligou as notificações (ecrã Eu) está em ligas/<id>/push/<nome>/<chave> = {endpoint, keys:{p256dh, auth}}.
Este script manda cada aviso para os telemóveis da pessoa (Web Push, RFC 8291 + VAPID RFC 8292) e apaga-o da fila.
Avisos com mais de 12 h deitam-se fora; telemóveis que já não existem (404/410) saem da lista.

Precisa do segredo VAPID_PRIVATE (chave privada, base64url de 32 bytes) nas definições do repositório:
Settings → Secrets and variables → Actions → New repository secret. A chave pública correspondente está no index.html
(PUSH_CHAVE). Só usa a biblioteca padrão + cryptography.
Uso: VAPID_PRIVATE=... python3 scripts/push.py      (FDC_DB=<endereço> para testar com outra base de dados)
"""
import base64, hashlib, hmac, json, os, re, struct, sys, time, urllib.error, urllib.parse, urllib.request
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

AQUI = os.path.dirname(os.path.abspath(__file__))
LIGA_ID = 'amigos'
SUB = 'https://brunomvcarmo.github.io/foradacaixa/'   # contacto do remetente (VAPID "sub")
VALIDADE = 12 * 3600


def b64d(s): return base64.urlsafe_b64decode(s + '=' * (-len(s) % 4))
def b64e(b): return base64.urlsafe_b64encode(b).rstrip(b'=').decode()


def endereco_db():
    if os.environ.get('FDC_DB'): return os.environ['FDC_DB'].rstrip('/')
    html = open(os.path.join(AQUI, '..', 'index.html'), encoding='utf8').read()
    return re.search(r"db:\s*'([^']+)'", html).group(1).rstrip('/')


DB = endereco_db()
def url(caminho): return f'{DB}/ligas/{LIGA_ID}/{caminho}.json'
def pedir(metodo, caminho, corpo=None):
    req = urllib.request.Request(url(caminho), method=metodo, data=None if corpo is None else json.dumps(corpo).encode())
    with urllib.request.urlopen(req, timeout=20) as r: return json.loads(r.read() or b'null')


def hkdf(salt, ikm, info, n):
    prk = hmac.new(salt, ikm, hashlib.sha256).digest()
    return hmac.new(prk, info + b'\x01', hashlib.sha256).digest()[:n]


def encriptar(texto, p256dh, auth):
    """RFC 8291 (aes128gcm): devolve o corpo do pedido."""
    ua_pub = b64d(p256dh); segredo = b64d(auth)
    eph = ec.generate_private_key(ec.SECP256R1())
    as_pub = eph.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
    partilhado = eph.exchange(ec.ECDH(), ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(), ua_pub))
    ikm = hkdf(segredo, partilhado, b'WebPush: info\x00' + ua_pub + as_pub, 32)
    salt = os.urandom(16)
    cek = hkdf(salt, ikm, b'Content-Encoding: aes128gcm\x00', 16)
    nonce = hkdf(salt, ikm, b'Content-Encoding: nonce\x00', 12)
    cifrado = AESGCM(cek).encrypt(nonce, texto + b'\x02', None)
    return salt + struct.pack('>I', 4096) + bytes([len(as_pub)]) + as_pub + cifrado


def vapid(endpoint, chave):
    """RFC 8292: cabeçalho Authorization com um JWT ES256 assinado pela chave privada."""
    u = urllib.parse.urlparse(endpoint)
    cab = b64e(json.dumps({'typ': 'JWT', 'alg': 'ES256'}).encode())
    corpo = b64e(json.dumps({'aud': f'{u.scheme}://{u.netloc}', 'exp': int(time.time()) + 12 * 3600, 'sub': SUB}).encode())
    r, s = decode_dss_signature(chave.sign(f'{cab}.{corpo}'.encode(), ec.ECDSA(hashes.SHA256())))
    jwt = f'{cab}.{corpo}.{b64e(r.to_bytes(32, "big") + s.to_bytes(32, "big"))}'
    pub = chave.public_key().public_bytes(serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
    return f'vapid t={jwt}, k={b64e(pub)}'


def enviar(sub, dados, chave):
    corpo = encriptar(json.dumps(dados, ensure_ascii=False).encode(), sub['keys']['p256dh'], sub['keys']['auth'])
    req = urllib.request.Request(sub['endpoint'], data=corpo, method='POST', headers={
        'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', 'TTL': str(VALIDADE), 'Urgency': 'normal',
        'Authorization': vapid(sub['endpoint'], chave)})
    try:
        with urllib.request.urlopen(req, timeout=20) as r: return r.status
    except urllib.error.HTTPError as e: return e.code


def main():
    priv = re.sub(r'[\s"\'`]', '', os.environ.get('VAPID_PRIVATE', ''))   # sem espaços, quebras de linha nem aspas coladas por engano
    priv = priv.split('=', 1)[1] if priv.upper().startswith('VAPID_PRIVATE=') else priv
    if not priv:
        print('Falta o segredo VAPID_PRIVATE: as notificações não são enviadas (ver o início deste ficheiro).'); return
    try: bruto = b64d(priv)
    except Exception: bruto = b''
    if len(bruto) != 32:   # não falha a Action (senão o GitHub manda um e-mail a cada 10 min): só avisa no registo
        print(f'O segredo VAPID_PRIVATE não é uma chave privada válida: tem {len(priv)} caracteres (devia ter 43)'
              + (' — parece a chave PÚBLICA (87 caracteres, começa por B)' if len(bruto) == 65 else '') + '. As notificações não são enviadas.')
        return
    chave = ec.derive_private_key(int.from_bytes(bruto, 'big'), ec.SECP256R1())
    fila = pedir('GET', 'pushfila') or {}
    if not fila: print('fila vazia'); return
    subs = pedir('GET', 'push') or {}
    agora = time.time() * 1000
    for k, av in sorted(fila.items(), key=lambda x: (x[1] or {}).get('criado', 0)):
        pedir('DELETE', f'pushfila/{k}')   # primeiro apaga: um aviso nunca vai duas vezes
        if not av or agora - av.get('criado', 0) > VALIDADE * 1000: continue
        para = av.get('para'); tel = (subs.get(para) or {})
        dados = {'titulo': av.get('titulo', 'Fora da Caixa'), 'texto': av.get('texto', ''), 'url': av.get('url', './'), 'tag': av.get('tag')}
        for sk, sub in list(tel.items()):
            try: st = enviar(sub, dados, chave)
            except Exception as e: print('erro', para, type(e).__name__, e); continue
            print(para, sk[:8], st, av.get('titulo'))
            if st in (404, 410): pedir('DELETE', f'push/{para}/{sk}')   # telemóvel que já não existe
    print('enviados', len(fila))


if __name__ == '__main__':
    main()
