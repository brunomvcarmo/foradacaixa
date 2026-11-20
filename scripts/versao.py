"""Marca uma versão nova do jogo (correr antes de cada publicação): escreve a mesma marca em versao.txt e no index.html
(APP_VER e ?v= dos ficheiros de perguntas). Os telemóveis com a página antiga aberta veem a diferença e recarregam sozinhos.
Uso (a partir da raiz):  python3 scripts/versao.py"""
import re, time
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
v = time.strftime('%Y%m%d%H%M%S', time.gmtime())
p = ROOT / 'index.html'; s = p.read_text(encoding='utf-8')
s = re.sub(r"const APP_VER = '[^']*';", f"const APP_VER = '{v}';", s, count=1)
s = re.sub(r'(perguntas\d?\.js)\?v=[^"]*"', rf'\1?v={v}"', s)
p.write_text(s, encoding='utf-8', newline='\n')
(ROOT / 'versao.txt').write_text(v + '\n', encoding='utf-8', newline='\n')
print('versão', v)
