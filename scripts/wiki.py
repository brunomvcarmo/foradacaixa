"""Ajuda para ler páginas da Wikipédia inglesa (texto da página, wikitext), com cache em /tmp/fdc-wiki (ou FDC_WIKI).
Poucos pedidos, um de cada vez, com User-Agent próprio (a Wikipédia limita os pedidos)."""
import json, os, re, time, urllib.error, urllib.parse, urllib.request

CACHE = os.environ.get('FDC_WIKI', '/tmp/fdc-wiki')
UA = {'User-Agent': 'FdcQuizDataBot/1.0 (quiz data, low volume)'}


def wikitext(titulo, _n=0):
    os.makedirs(CACHE, exist_ok=True)
    f = os.path.join(CACHE, re.sub(r'[^\w.-]+', '_', titulo) + '.txt')
    if os.path.exists(f): return open(f, encoding='utf8').read()
    u = 'https://en.wikipedia.org/w/index.php?' + urllib.parse.urlencode({'title': titulo.replace(' ', '_'), 'action': 'raw'})
    for k in range(6):
        try:
            t = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40).read().decode('utf8'); break
        except urllib.error.HTTPError as e:
            if e.code == 404: raise SystemExit(f'Wikipédia: a página não existe: {titulo}')
            print('  (a tentar outra vez)', titulo, e); time.sleep(10 * (k + 1))
        except Exception as e:
            print('  (a tentar outra vez)', titulo, e); time.sleep(10 * (k + 1))
    else: raise SystemExit('não consegui ler ' + titulo)
    m = re.match(r'\s*#REDIRECT\s*\[\[([^\]|#]+)', t, flags=re.I)
    if m and _n < 3: t = wikitext(m.group(1), _n + 1)
    open(f, 'w', encoding='utf8').write(t); time.sleep(1)
    return t


def tira_modelos(c, nomes=('efn', 'refn', 'sfn', 'cn', 'citation needed', 'ref label', 'note', 'efn-ua', 'efn-lr', 'notetag', 'dagger', 'double-dagger')):
    """tira os modelos {{nome …}} (mesmo com outros modelos e ligações lá dentro)"""
    out, i = [], 0
    while True:
        m = re.search(r'\{\{\s*(' + '|'.join(re.escape(n) for n in nomes) + r')\s*[|}]', c[i:], flags=re.I)
        if not m: out.append(c[i:]); break
        a = i + m.start(); out.append(c[i:a]); d, j = 0, a
        while j < len(c):
            if c.startswith('{{', j): d += 1; j += 2; continue
            if c.startswith('}}', j):
                d -= 1; j += 2
                if d == 0: break
                continue
            j += 1
        i = j
    return ''.join(out)


def limpa(c):
    """texto de uma célula: tira referências, modelos de bandeira, ligações e formatação"""
    c = tira_modelos(c)
    c = re.sub(r'<br\s*/?>', ', ', c, flags=re.I); c = re.sub(r'^\s*\|', '', c)
    c = re.sub(r'<ref[^>]*/>', '', c); c = re.sub(r'<ref[^>]*>.*?</ref>', '', c, flags=re.S); c = re.sub(r'<!--.*?-->', '', c, flags=re.S)
    c = re.sub(r'\{\{(?:sortname)\|([^|}]*)\|([^|}]*)(?:\|[^}]*)?\}\}', r'\1 \2', c, flags=re.I)
    c = re.sub(r'\{\{(?:flagicon|flag|fb|fbicon|flagathlete|flagdeco|fb-rt|nft)\|[^{}]*\}\}', '', c, flags=re.I)
    for _ in range(3):
        c = re.sub(r'\{\{(?:nowrap|nobr|center|small|nowrap begin|hs|ntsh)\|([^{}]*)\}\}', r'\1', c, flags=re.I)
        c = re.sub(r'\{\{sort\|[^|{}]*\|([^{}]*)\}\}', r'\1', c, flags=re.I)
    c = re.sub(r'\{\{[^{}]*\}\}', '', c); c = re.sub(r'\{\{[^{}]*\}\}', '', c)
    c = re.sub(r'\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', r'\1', c)
    c = re.sub(r"'''?", '', c); c = re.sub(r'<[^>]+>', '', c)
    return re.sub(r'\s+', ' ', c).replace('&nbsp;', ' ').strip(' *†‡§#^')


def ligacao(c):
    """o nome da página da 1.ª ligação da célula (ex.: [[Cristiano Ronaldo|Ronaldo]] → Cristiano Ronaldo)"""
    m = re.search(r'\{\{sortname\|([^|}]*)\|([^|}]*)(?:\|([^|}]*))?', c, flags=re.I)
    if m: return (m.group(3) or f'{m.group(1)} {m.group(2)}').strip()
    m = re.search(r'\[\[([^|\]#]+)', c)
    return re.sub(r'\s*\((?:footballer|soccer)[^)]*\)', '', m.group(1)).strip() if m else limpa(c)


def tabelas(t):
    """todas as tabelas wikitable: lista de linhas, cada linha = lista de células (texto cru)"""
    out = []
    for m in re.finditer(r'\{\|(.*?)\n\|\}', t, flags=re.S):
        corpo, linhas = m.group(1), []
        for bl in re.split(r'\n\|-[^\n]*', corpo)[1:]:
            cel = []
            for ln in bl.strip('\n').split('\n'):
                if ln.startswith('|+'): continue
                if ln.startswith('!') or ln.startswith('|'):
                    sep = '!!' if ln.startswith('!') else '||'
                    for c in ln[1:].split(sep):
                        c = c.split('|', 1)[1] if re.match(r'^\s*(?:style|class|scope|rowspan|colspan|align|data-sort-value|bgcolor|width)\s*=', c) and '|' in c and '[[' not in c.split('|', 1)[0] else c
                        cel.append(c.strip())
                elif cel: cel[-1] += '\n' + ln
            if cel: linhas.append(cel)
        out.append(linhas)
    return out
