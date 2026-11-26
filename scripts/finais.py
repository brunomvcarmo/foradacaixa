"""Fora da Caixa — perguntas de quem ganhou finais → finais.json.

Escalações de cada final na Wikipédia inglesa (páginas "<ano> UEFA Champions League final", "<ano> UEFA Cup final",
"<ano> UEFA Europa League final", "<ano> FIFA World Cup final", "UEFA Euro <ano> final"): conta quem ENTROU EM CAMPO
(titulares e suplentes que entraram, {{subon}}) pela equipa que ganhou. Nas finais a duas mãos da Taça UEFA (até 1997) conta
quem jogou pelo menos uma das mãos. Vencedores das finais europeias tirados das listas de finais da Wikipédia; Mundiais e Euros escritos à mão.
- ganhou a final da Liga dos Campeões e a da Liga Europa/Taça UEFA; a da Liga dos Campeões e a do Mundial; a da LC e a do Euro;
- ganhou a final da Liga dos Campeões por dois clubes diferentes; ganhou 3 ou mais finais da LC; portugueses que ganharam a final da LC.
Uso: python3 scripts/finais.py
"""
import json, os, re, sys
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wiki
from wiki import limpa, tabelas, wikitext
from wikilistas import clube, PAIS

SAIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'finais.json')
ANOS_EU = range(1993, 2027)       # finais de 1992/93 a 2025/26
MUNDIAIS = {1994: 'Brazil', 1998: 'France', 2002: 'Brazil', 2006: 'Italy', 2010: 'Spain', 2014: 'Germany', 2018: 'France', 2022: 'Argentina'}
EUROS = {1996: 'Germany', 2000: 'France', 2004: 'Greece', 2008: 'Spain', 2012: 'Spain', 2016: 'Portugal', 2020: 'Italy', 2024: 'Spain'}
ALIAS = {'internazionale': 'inter milan', 'inter': 'inter milan', 'psg': 'paris saint-germain', 'man united': 'manchester united'}


def norm(s):
    s = wiki.wiki_norm(limpa(s)) if hasattr(wiki, 'wiki_norm') else limpa(s).lower()
    import unicodedata
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower()
    s = re.sub(r'\b(fc|cf|ac|sl|afc|sc|calcio)\b', '', s); s = re.sub(r'[,.]', ' ', s); s = re.sub(r'\s+', ' ', s).strip()
    return ALIAS.get(s, s)


def vencedores(titulo):
    t = max(tabelas(wikitext(titulo)), key=len)
    out = {}
    for row in t:
        ep = limpa(row[0])
        m = re.match(r'(\d{4})[–-](\d{2})', ep)
        if not m or len(row) < 3: continue
        ano = int(m.group(1)) + 1
        w = limpa(row[2])
        if w and ano not in out: out[ano] = w
    return out


def escalacoes(titulo):
    """[(nome da equipa, [(jogador, código do país)])] — um bloco por equipa e por jogo; só quem entrou em campo"""
    w = wikitext(titulo)
    titulos = [limpa(m.group(1)) for m in re.finditer(r'\n\s*\|\s*title\s*=\s*([^\n]*)', w)][1:]
    blocos, cur, subs = [], None, False
    for ln in w.split('\n'):
        if re.match(r'\|\s*GK\s*\|\|', ln) and cur is None: cur, subs = [], False
        if cur is None: continue
        if re.search(r"Substitutes?:", ln): subs = True; continue
        if re.search(r"Substitutions:", ln): subs = 'usados'; continue
        if re.search(r"(Manager|Head coach|Coach):", ln): blocos.append(cur); cur = None; continue
        ln = re.sub(r'\{\{abbr\|([A-Z]{1,3})\|[^}]*\}\}', r'\1', ln)
        m = re.match(r'\|\s*[A-Z]{1,3}\s*\|\|', ln)
        if not m: continue
        links = [x for x in re.findall(r'\[\[([^\]]+)\]\]', ln) if not x.lower().startswith('captain')]
        if not links: continue
        nome = limpa('[[' + links[0] + ']]')
        p = re.search(r'\{\{flagicon\|([A-Z]{3})', ln)
        if not subs or subs == 'usados' or '{{subon' in ln.lower(): cur.append((nome, p.group(1) if p else None))
    if len(blocos) != len(titulos):
        equipas = [limpa(m.group(1)) for m in re.finditer(r'\n\s*\|\s*team[12]\s*=\s*([^\n]*)', w)]
        equipas = [e for e in equipas if e]
        if len(blocos) == len(equipas): titulos = equipas
        elif len(blocos) == 2 and len(equipas) >= 2 and len(set(equipas)) == 2: titulos = equipas[:2]
        else: sys.exit(f'{titulo}: {len(blocos)} escalações, {len(titulos)} títulos e {len(equipas)} equipas')
    for b in blocos:
        if not 11 <= len(b) <= 18: sys.exit(f'{titulo}: escalação com {len(b)} jogadores')
    return list(zip(titulos, blocos))


def ganhou(titulo, vencedor):
    """jogadores (nome, país) da equipa que ganhou, em todos os jogos da final"""
    esc = escalacoes(titulo)
    v = norm(vencedor)
    ok = [b for t, b in esc if norm(t) == v or v in norm(t) or norm(t) in v]
    if not ok or len(ok) * 2 != len(esc): sys.exit(f'{titulo}: não sei qual é o vencedor ({vencedor}) entre {[t for t, _ in esc]}')
    out = {}
    for b in ok:
        for n, p in b: out.setdefault(n, p)
    return out


def main():
    lc_v, le_v = vencedores('List of European Cup and UEFA Champions League finals'), vencedores('List of UEFA Cup and Europa League finals')
    LC, LE, WC, EU = defaultdict(list), defaultdict(list), defaultdict(list), defaultdict(list)   # jogador → [(ano, clube)]
    pais = {}
    for a in ANOS_EU:
        for n, p in ganhou(f'{a} UEFA Champions League final', lc_v[a]).items(): LC[n].append((a, clube(lc_v[a]))); pais.setdefault(n, p)
        t = f'{a} UEFA Cup final' if a <= 2009 else f'{a} UEFA Europa League final'
        for n, p in ganhou(t, le_v[a]).items(): LE[n].append((a, clube(le_v[a]))); pais.setdefault(n, p)
    for a, v in MUNDIAIS.items():
        for n, p in ganhou(f'{a} FIFA World Cup final', v).items(): WC[n].append((a, v))
    for a, v in EUROS.items():
        for n, p in ganhou(f'UEFA Euro {a} final', v).items(): EU[n].append((a, v))
    print('vencedores LC', len(LC), 'LE', len(LE), 'Mundial', len(WC), 'Euro', len(EU))
    perguntas = []
    ep = lambda a: f'{a - 1}/{str(a)[2:]}'
    SUB = 'Segundo as escalações da Wikipédia: conta quem entrou em campo na final (titular ou suplente utilizado) pela equipa que ganhou'
    def junta(qid, cat, txt, sub, r, mn=5, mx=80):
        if mn <= len(r) <= mx: perguntas.append({'id': qid, 'cat': cat, 'tipo': 'jogador', 'txt': txt, 'sub': sub, 'r': r})
        else: print(f'  fora ({len(r)}):', qid)
    fmt = lambda v: ', '.join(f'{ep(a)} {c}' for a, c in v)
    fmt_s = lambda v: ', '.join(f'{a}' for a, c in v)
    def ambos(qid, txt, A, B, sub, fa, fb):
        r = [(n, f'{fa(A[n])} · {fb(B[n])}') for n in A if n in B]
        r.sort(key=lambda x: -(len(A[x[0]]) + len(B[x[0]])))
        junta(qid, 'mundo', txt, sub, [list(x) for x in r])
    ambos('fin-lc-le', 'Um jogador que ganhou a final da Liga dos Campeões e a da Liga Europa (ou Taça UEFA)', LC, LE,
          SUB + '; finais de 1992/93 a 2025/26 nas duas competições', fmt, fmt)
    ambos('fin-lc-wc', 'Um jogador que ganhou a final da Liga dos Campeões e a final de um Mundial', LC, WC,
          SUB + '; finais da Liga dos Campeões de 1992/93 a 2025/26, Mundiais de 1994 a 2022', fmt, lambda v: 'Mundial ' + ', '.join(f'{a} ({PAIS_PT.get(c, c)})' for a, c in v))
    ambos('fin-lc-eu', 'Um jogador que ganhou a final da Liga dos Campeões e a final de um Europeu', LC, EU,
          SUB + '; finais da Liga dos Campeões de 1992/93 a 2025/26, Europeus de 1996 a 2024', fmt, lambda v: 'Euro ' + ', '.join(f'{a} ({PAIS_PT.get(c, c)})' for a, c in v))
    ambos('fin-le-wc', 'Um jogador que ganhou a final da Liga Europa (ou Taça UEFA) e a final de um Mundial', LE, WC,
          SUB + '; finais da Liga Europa/Taça UEFA de 1992/93 a 2025/26, Mundiais de 1994 a 2022', fmt, lambda v: 'Mundial ' + ', '.join(f'{a} ({PAIS_PT.get(c, c)})' for a, c in v))
    ambos('fin-wc-eu', 'Um jogador que ganhou a final de um Mundial e a de um Europeu', WC, EU,
          SUB + '; Mundiais de 1994 a 2022, Europeus de 1996 a 2024', lambda v: 'Mundial ' + fmt_s(v), lambda v: 'Euro ' + fmt_s(v))
    dois = [(n, fmt(v)) for n, v in LC.items() if len({c for _, c in v}) >= 2]
    junta('fin-lc-2clubes', 'mundo', 'Um jogador que ganhou a final da Liga dos Campeões por dois clubes diferentes', SUB + '; finais de 1992/93 a 2025/26',
          [list(x) for x in sorted(dois, key=lambda x: -len(LC[x[0]]))])
    tres = [(n, fmt(v)) for n, v in LC.items() if len(v) >= 3]
    junta('fin-lc-3', 'mundo', 'Um jogador que ganhou pelo menos 3 finais da Liga dos Campeões (a jogar)', SUB + '; finais de 1992/93 a 2025/26',
          [list(x) for x in sorted(tres, key=lambda x: -len(LC[x[0]]))])
    for cod, adj in [('POR', 'português'), ('BRA', 'brasileiro'), ('ESP', 'espanhol'), ('FRA', 'francês'), ('ARG', 'argentino'), ('NED', 'neerlandês'), ('ITA', 'italiano'), ('ENG', 'inglês'), ('GER', 'alemão')]:
        lst = [(n, fmt(v)) for n, v in LC.items() if pais.get(n) == cod]
        junta(f'fin-lc-{cod.lower()}', 'mundo', f'Um jogador {adj} que ganhou a final da Liga dos Campeões', SUB + '; finais de 1992/93 a 2025/26; nacionalidade pela bandeira da escalação',
              [list(x) for x in sorted(lst, key=lambda x: (-len(LC[x[0]]), -LC[x[0]][-1][0]))], mx=60)
        lst = [(n, fmt(v)) for n, v in LE.items() if pais.get(n) == cod]
        junta(f'fin-le-{cod.lower()}', 'mundo', f'Um jogador {adj} que ganhou a final da Liga Europa (ou Taça UEFA)', SUB + '; finais de 1992/93 a 2025/26; nacionalidade pela bandeira da escalação',
              [list(x) for x in sorted(lst, key=lambda x: (-len(LE[x[0]]), -LE[x[0]][-1][0]))], mx=60)
    with open(SAIDA, 'w', encoding='utf8', newline='\n') as f:
        json.dump({'fonte': 'Wikipédia inglesa (escalações das finais, nov. 2026)', 'perguntas': perguntas}, f, ensure_ascii=False, separators=(',', ':'))
    print(len(perguntas), 'perguntas')
    for q in perguntas: print(' ', q['id'], len(q['r']), ', '.join(a for a, b in q['r'][:8]))


PAIS_PT = {'Brazil': 'Brasil', 'France': 'França', 'Italy': 'Itália', 'Spain': 'Espanha', 'Germany': 'Alemanha', 'Argentina': 'Argentina', 'Greece': 'Grécia', 'Portugal': 'Portugal'}

if __name__ == '__main__':
    main()
