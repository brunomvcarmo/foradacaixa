"""Fora da Caixa — transferências a custo zero → custozero.json (categoria "mercado").

Fonte: as listas de transferências de verão da Wikipédia inglesa ("List of English/Spanish/Italian/French/Portuguese football
transfers summer <ano>"), verões de 2021 a 2025: conta quem chegou a um clube do primeiro escalão com o valor "Free"
(fim de contrato, jogador livre). A Bundesliga fica de fora (a página alemã não tem tabela de valores), tal como os anos em que a página
da Liga espanhola ou da Ligue 1 só lista os plantéis (sem o valor de cada transferência).
Que clubes estavam no primeiro escalão em cada época: dados do Transfermarkt (os mesmos de scripts/nacionalidades.py).
Uso: python3 scripts/custozero.py
"""
import csv, json, os, re, sys, unicodedata
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wiki
from wiki import limpa, tabelas, wikitext
import nacionalidades as N

SAIDA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'custozero.json')
ANOS = [2021, 2022, 2023, 2024, 2025]
LIGAS = {'GB1': ('English', 'Premier League', 'da Premier League'), 'ES1': ('Spanish', 'Liga espanhola', 'da Liga espanhola'),
         'IT1': ('Italian', 'Serie A', 'da Serie A italiana'), 'FR1': ('French', 'Ligue 1', 'da Ligue 1 francesa'),
         'PO1': ('Portuguese', 'Liga Portuguesa', 'da Liga Portuguesa')}
FIFA = {'POR': 'Portugal', 'BRA': 'Brazil', 'ARG': 'Argentina', 'ESP': 'Spain', 'FRA': 'France', 'ENG': 'England', 'GER': 'Germany', 'ITA': 'Italy',
        'NED': 'Netherlands', 'BEL': 'Belgium', 'URU': 'Uruguay', 'COL': 'Colombia', 'SEN': 'Senegal', 'CIV': "Cote d'Ivoire", 'NGA': 'Nigeria',
        'MAR': 'Morocco', 'CRO': 'Croatia', 'SRB': 'Serbia', 'SCO': 'Scotland', 'WAL': 'Wales', 'IRL': 'Ireland', 'CMR': 'Cameroon', 'GHA': 'Ghana',
        'USA': 'United States', 'MEX': 'Mexico', 'JPN': 'Japan', 'DEN': 'Denmark', 'SWE': 'Sweden', 'NOR': 'Norway', 'POL': 'Poland', 'SUI': 'Switzerland',
        'AUT': 'Austria', 'GRE': 'Greece', 'TUR': 'Türkiye', 'ALG': 'Algeria', 'ANG': 'Angola', 'CPV': 'Cape Verde', 'GNB': 'Guinea-Bissau', 'MLI': 'Mali'}
PARAR = {'fc', 'afc', 'cf', 'ac', 'as', 'ss', 'ssc', 'us', 'sc', 'calcio', 'club', 'de', 'football', 'futebol', 'clube', 'cd', 'ud', 'rc', 'rcd', 'sad', 'sl',
         'sporting', 'f', 'c', 'the', 'ogc', 'losc', 'stade', 'olympique', 'fk', 'hsc', 'acf', 'bc', 'cfc', 'sco', 'fco', 'estac', 'aj', 'cs', 'gd', 'ca', 'csd'}
B_TEAM = re.compile(r'\b(B|II|U\d\d|Castilla|Next Gen|Primavera|Atl[eè]tic|Reserves|Academy)\b')


def tok(s):
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower()
    s = re.sub(r'[^a-z0-9 ]+', ' ', s)
    return {w for w in s.split() if w not in PARAR and not re.fullmatch(r'\d{2,4}', w)}


def main():
    # clubes de cada liga por época (nomes do Transfermarkt)
    eq = defaultdict(set)
    with open(os.path.join(N.CACHE, 'perf.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['competition_id'] in LIGAS: eq[(r['competition_id'], r['season_name'])].add(r['team_name'])
    def na_liga(L, ano, cel):
        if re.search(r'\{\{flag', cel) or B_TEAM.search(limpa(cel)): return None
        links = re.findall(r'\[\[([^\]]+)\]\]', cel)
        t = set().union(*[tok(x.replace('|', ' ')) for x in links]) if links else tok(limpa(cel))
        ep = f'{ano % 100:02d}/{(ano + 1) % 100:02d}'
        cand = [c for c in eq[(L, ep)] if tok(c) and tok(c) <= t]
        if len(cand) > 1: cand = [c for c in cand if tok(c) == max((tok(x) for x in cand), key=len)]
        return N.CLUBE.get(cand[0], cand[0]) if cand else None

    # fama (para ordenar as respostas da mais óbvia para a mais rara): jogos de campeonato nas ligas principais
    fama, nm = defaultdict(int), {}
    with open(os.path.join(N.CACHE, 'prof.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f): nm[r['player_id']] = N.norm(re.sub(r'\s*\(\d+\)$', '', r['player_name']).strip())
    with open(os.path.join(N.CACHE, 'perf.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['competition_id'] in N.LIGAS or r['competition_id'] == 'CL':
                try: fama[nm.get(r['player_id'], '')] += int(float(r['nb_on_pitch'] or 0)) * (3 if r['competition_id'] in ('GB1', 'ES1', 'IT1', 'L1', 'FR1', 'CL') else 1)
                except ValueError: pass
    livres = defaultdict(list)   # (liga, ano) → [(jogador, país, clube, de)]
    for L, (pal, lnome, da) in LIGAS.items():
        for ano in ANOS:
            try: w = wikitext(f'List of {pal} football transfers summer {ano}')
            except SystemExit as e: print('  sem página:', L, ano); continue
            linhas = []
            if L == 'ES1':   # uma secção por clube da Liga: "==== In ====" com data, jogador, de, tipo, valor
                liga = re.split(r'\n==\s*(?:Segunda Divisi[oó]n|See also|References)\s*==', w)[0]
                for m in re.finditer(r'\n(=+)\s*([^=\n]+?)\s*\1\s*\n=+\s*In\s*=+\s*\n(\{\|.*?\n\|\})', liga, flags=re.S):
                    cl = m.group(2)
                    for row in tabelas(m.group(3))[0]:
                        if len(row) >= 5: linhas.append((row[1], row[2], f'[[{cl}]]', row[4]))
            else:
                for t in tabelas(w):
                    for row in t:
                        if len(row) >= 5 and not ('[[' in row[0] and 'flag' in row[0]): linhas.append(tuple(row[1:5]))
                        elif len(row) >= 4: linhas.append(tuple(row[0:4]))
            n = 0
            for jog, de, para, fee in linhas:
                fz = limpa(fee).lower()
                if 'free' not in fz or 'loan' in fz: continue
                cl = na_liga(L, ano, para) if L != 'ES1' else para.strip('[]')
                if not cl: continue
                lk = [x for x in re.findall(r'\[\[([^\]]+)\]\]', jog)]
                nome = limpa('[[' + lk[0] + ']]') if lk else limpa(jog)
                p = re.search(r'\{\{(?:flagicon|flagg\|cxx|fb|flag)\|([A-Z]{3})', jog)
                nome = re.sub(r'\|.*$', '', nome).strip()
                if not nome: continue
                de = limpa(de)
                de = 'sem clube' if not de or re.search(r'unattached|free agent|without club|released', de, re.I) else de
                livres[(L, ano)].append((nome, p.group(1) if p else None, N.CLUBE.get(cl, cl), de)); n += 1
            livres[(L, ano)].sort(key=lambda x: -fama.get(N.norm(x[0]), 0))
            print(L, ano, 'livres', n, '·', ', '.join(f'{x[0]} ({x[2]})' for x in livres[(L, ano)][:12]))
    perguntas = []
    def junta(qid, txt, sub, r, mn=6, mx=90):
        out, ja = [], set()
        for a, b in r:
            k = N.norm(a)
            if k not in ja: ja.add(k); out.append([a, b])
        if mn <= len(out) <= mx: perguntas.append({'id': qid, 'cat': 'mercado', 'tipo': 'jogador', 'txt': txt, 'sub': sub, 'r': out})
        else: print(f'  fora ({len(out)}):', qid)
    SUB = 'Segundo as listas de transferências da Wikipédia: chegou com o valor "livre" (fim de contrato ou sem clube); não conta empréstimos'
    for L, (pal, lnome, da) in LIGAS.items():
        anos = [a for a in ANOS if (L, a) in livres]
        for a in anos:
            junta(f'cz-{L}-{a}', f'Um jogador que chegou a custo zero a um clube {da} no verão de {a}', SUB, [(n, f'{c} · de: {d}') for n, p, c, d in livres[(L, a)]])
        if len(anos) < len(ANOS): continue
        por = defaultdict(list)
        for a in anos:
            for n, p, c, d in livres[(L, a)]: por[p].append((n, f'{a} · {c} · de: {d}'))
        for p, lst in por.items():
            if p not in FIFA or FIFA[p] not in N.ADJ or p == {'GB1': 'ENG', 'ES1': 'ESP', 'IT1': 'ITA', 'FR1': 'FRA', 'PO1': 'POR'}[L]: continue
            junta(f'cz-{L}-n-{p.lower()}', f'Um jogador {N.ADJ[FIFA[p]]} que chegou a custo zero a um clube {da} (verões de 2021 a 2025)', SUB + '; nacionalidade pela bandeira da lista', lst, mn=5, mx=60)
    # portugueses em todas as ligas juntas (menos a portuguesa)
    pt = [(n, f'{a} · {c} ({LIGAS[L][1]}) · de: {d}') for (L, a), v in livres.items() if L != 'PO1' for n, p, c, d in v if p == 'POR']
    junta('cz-pt-fora', 'Um português que chegou a custo zero a um clube da Premier League, Liga espanhola, Serie A ou Ligue 1 (verões de 2021 a 2025)', SUB, pt, mn=5)
    with open(SAIDA, 'w', encoding='utf8', newline='\n') as f:
        json.dump({'fonte': 'Wikipédia inglesa (listas de transferências de verão, 2021 a 2025)', 'perguntas': perguntas}, f, ensure_ascii=False, separators=(',', ':'))
    print(len(perguntas), 'perguntas')
    for q in perguntas: print(' ', q['id'], len(q['r']), ', '.join(a for a, b in q['r'][:7]))


if __name__ == '__main__':
    main()
