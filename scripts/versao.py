"""Marca uma versão nova do jogo (correr antes de cada publicação): escreve a mesma marca em versao.txt e no index.html
(APP_VER). Os telemóveis com a página antiga aberta veem a diferença e recarregam sozinhos.
Os outros ficheiros (.js e .json grandes) levam ?v=<impressão digital do conteúdo> (FV no index.html): só voltam a ser
descarregados quando mudam, não a cada publicação.
Uso (a partir da raiz):  python3 scripts/versao.py"""
import hashlib, json, re, time
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
v = time.strftime('%Y%m%d%H%M%S', time.gmtime())
p = ROOT / 'index.html'; s = p.read_text(encoding='utf-8')
s = re.sub(r"const APP_VER = '[^']*';", f"const APP_VER = '{v}';", s, count=1)
FICH = ['perguntas.js', 'perguntas2.js', 'perguntas3.js', 'emblemas.js', 'modos.js', 'visual.js', 'historia.json', 'selecoes.json',
        'nacionalidades.json', 'transferencias.json', 'carreiras.json', 'maisoumenos.json', 'bolaouro.json', 'estatisticas.json']
fv = {f: hashlib.md5((ROOT / f).read_bytes()).hexdigest()[:10] for f in FICH}
s = re.sub(r'((?:perguntas\d?|modos|emblemas|visual)\.js)\?v=[^"]*"', lambda m: f'{m.group(1)}?v={fv[m.group(1)]}"', s)
s = re.sub(r"const FV = \{[^}]*\};", lambda m: 'const FV = ' + json.dumps(fv, separators=(',', ':')) + ';', s, count=1)
p.write_text(s, encoding='utf-8', newline='\n')
(ROOT / 'versao.txt').write_text(v + '\n', encoding='utf-8', newline='\n')
print('versão', v)
