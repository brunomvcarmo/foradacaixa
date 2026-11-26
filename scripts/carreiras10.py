"""Fora da Caixa — perguntas de carreiras dos últimos 10 anos (2015/16 a 2024/25) → carreiras10.json (categoria "ligas").

Fonte: a mesma de scripts/nacionalidades.py (Transfermarkt, salimt/football-datasets, out. 2025).
Conferido contra os dados oficiais da Premier League (FPL, arquivo vaastav): de 2015/16 em diante o número de jogadores
de cada época bate certo (antes disso faltam jogadores, por isso não se usam épocas anteriores).
- "Um jogador que jogou nas 4 maiores ligas / em X e em Y" (entrou em campo no campeonato);
- "Um jogador que jogou pelo <clube A> e pelo <clube B>" (equipa principal, qualquer competição);
- "Um <posição> <nacionalidade> que o <clube> contratou em definitivo" (verão de 2015 ao verão de 2025; sem empréstimos
  nem subidas da formação). Se faltar o perfil (nacionalidade/posição) de alguém contratado pelo clube, o clube fica de fora.
Uso: python3 scripts/carreiras10.py
"""
import csv, itertools, json, os, re, sys
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import nacionalidades as N
import transferencias as TR

SAIDA = os.path.join(N.AQUI, '..', 'carreiras10.json')
EP10 = ['15/16', '16/17', '17/18', '18/19', '19/20', '20/21', '21/22', '22/23', '23/24', '24/25']
PER = 'entre 2015/16 e 2024/25'
SUB = 'Segundo o Transfermarkt'
INI_TR = '2015-07-01'
GRANDES4 = ['GB1', 'ES1', 'IT1', 'L1']
CLUBES2 = ['Benfica', 'FC Porto', 'Sporting', 'Braga', 'Real Madrid', 'Barcelona', 'Atlético de Madrid', 'Sevilha', 'Valência', 'Villarreal',
           'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Juventus', 'Milan', 'Inter', 'Roma', 'Napoli',
           'Lazio', 'Bayern', 'Borussia Dortmund', 'PSG', 'Monaco', 'Marseille', 'Lyon', 'Ajax', 'Wolverhampton', 'Everton', 'West Ham', 'Galatasaray',
           'Fenerbahçe', 'Beşiktaş']
CLUBES_NAC = ['Benfica', 'FC Porto', 'Sporting', 'Braga', 'Vitória de Guimarães', 'Real Madrid', 'Barcelona', 'Atlético de Madrid', 'Sevilha',
              'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Wolverhampton', 'Juventus', 'Milan', 'Inter',
              'Roma', 'Napoli', 'Bayern', 'Borussia Dortmund', 'PSG', 'Monaco', 'Lyon', 'Marseille', 'Ajax']
POS = {'Goalkeeper': ('guarda-redes', 'Um guarda-redes'), 'Defender': ('defesa', 'Um defesa'), 'Midfield': ('médio', 'Um médio'), 'Attack': ('avançado', 'Um avançado')}
# jogadores sem perfil nos dados, identificados com certeza pela transferência (nome, nacionalidade, posição)
PERFIL_MANUAL = {'1057316': ('Franco Mastantuono', 'Argentina', 'Attack'), '163053': ('Mame Thiam', 'Senegal', 'Attack'),
                 '222830': ('Danilo Pantić', 'Serbia', 'Midfield'), '34159': ('Eduardo', 'Portugal', 'Goalkeeper'), '743598': ('Ângelo', 'Brazil', 'Attack'),
                 '45124': ('Medhi Benatia', 'Morocco', 'Defender'), '620477': ('Kaio Jorge', 'Brazil', 'Attack'), '39151': ('Augusto Fernández', 'Argentina', 'Midfield'),
                 '660735': ('Federico Gattoni', 'Argentina', 'Defender'), '26721': ('Lucas Biglia', 'Argentina', 'Midfield'), '18900': ('Hatem Ben Arfa', 'France', 'Attack'),
                 '146805': ('Majeed Waris', 'Ghana', 'Attack'), '291941': ('Carraça', 'Portugal', 'Defender'), '4357': ('Klaas-Jan Huntelaar', 'Netherlands', 'Attack'),
                 '923667': ('Joeri Heerkens', 'Netherlands', 'Midfield')}
LIGA_EM = {'GB1': 'na Premier League', 'ES1': 'na Liga espanhola', 'IT1': 'na Serie A', 'L1': 'na Bundesliga', 'FR1': 'na Ligue 1', 'PO1': 'na Liga Portuguesa'}


# equipas B/juniores do próprio clube com nomes que não contêm o do clube (subir da formação não é contratar)
PROPRIA = {'Barcelona': ['barca'], 'Manchester United': ['man utd'], 'Manchester City': ['man city'], 'Tottenham': ['spurs'],
           'Real Madrid': ['rm castilla', 'real madrid'], 'Wolverhampton': ['wolves'], 'Atlético de Madrid': ['atl. madrid', 'atletico madrid', 'atletico b'],
           'PSG': ['paris sg', 'psg'], 'Juventus': ['juve'], 'Bayern': ['bayern'], 'Borussia Dortmund': ['bvb', 'dortmund'], 'Sporting': ['sporting'],
           'Benfica': ['benfica'], 'FC Porto': ['fc porto', 'porto'], 'Vitória de Guimarães': ['guimaraes', 'vitoria'], 'Lyon': ['olymp. lyon', 'lyon'],
           'Marseille': ['olymp. marseille', 'marseille'], 'Ajax': ['ajax', 'jong ajax']}


def formacao(c, de_nome, chaves):
    n = N.norm(de_nome)
    return bool(chaves & set(n.split())) or any(n.startswith(a) for a in PROPRIA.get(c, []))


def de(c):   # "do Benfica", "da Juventus"
    return ('da ' if c in N.FEM else 'do ') + c


def pelo(c):
    return ('pela ' if c in N.FEM else 'pelo ') + c


def main():
    N.baixar()
    fperf = os.path.join(N.CACHE, 'perf.csv')
    liga = defaultdict(lambda: defaultdict(int))        # pid → liga → jogos
    clube = defaultdict(lambda: defaultdict(int))       # pid → clube → jogos (equipa principal, todas as competições)
    nome_tm, linhas = {}, []
    with open(fperf, encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['competition_id'] in N.LIGAS: nome_tm[r['team_id']] = r['team_name']
            if r['season_name'] not in EP10: continue
            try: n = int(float(r['nb_on_pitch'] or 0))
            except ValueError: continue
            if n <= 0: continue
            linhas.append((r['player_id'], r['competition_id'], r['team_id'], n))
    for pid, comp, tid, n in linhas:
        if comp in N.LIGAS: liga[pid][comp] += n
        if tid in nome_tm: clube[pid][N.CLUBE.get(nome_tm[tid], nome_tm[tid])] += n
    ids_clube = defaultdict(set)
    for tid, nm in nome_tm.items(): ids_clube[N.CLUBE.get(nm, nm)].add(tid)
    falta = [c for c in CLUBES2 + CLUBES_NAC if not ids_clube[c]]
    if falta: sys.exit('clubes sem id: ' + ', '.join(falta))
    nome, nac, pos = {}, {}, {}
    with open(os.path.join(N.CACHE, 'prof.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f):
            nome[r['player_id']] = re.sub(r'\s*\(\d+\)$', '', r['player_name']).strip() or N.nome_do_slug(r['player_id'], r['player_slug'], r['name_in_home_country'])
            nac[r['player_id']] = r['citizenship'].split('  ')[0].strip()
            pos[r['player_id']] = r['main_position']
    for pid, (nm, na, po) in PERFIL_MANUAL.items(): nome[pid], nac[pid], pos[pid] = nm, na, po
    perguntas, vistos = [], set()

    def junta(qid, txt, sub, itens, mn=5, mx=60):
        """itens: [(pid, detalhe, peso)] — da mais óbvia (mais peso) para a mais rara"""
        if qid in vistos: return
        if any(p not in nome for p, _, _ in itens): print('  sem nome:', qid); return
        r, ja = [], set()
        for p, t, _ in sorted(itens, key=lambda x: -x[2]):
            k = N.norm(nome[p])
            if k not in ja: ja.add(k); r.append([nome[p], t])
        if mn <= len(r) <= mx: vistos.add(qid); perguntas.append({'id': qid, 'cat': 'ligas', 'tipo': 'jogador', 'txt': txt, 'sub': sub, 'r': r})

    # --- ligas ---
    def ligas_q(qid, txt, quais, minimo=None, mx=60):
        minimo = minimo or len(quais)
        sel = [p for p, d in liga.items() if sum(1 for l in quais if d.get(l)) >= minimo]
        junta(qid, txt, f'{SUB}: entrou em campo no campeonato, épocas de 2015/16 a 2024/25',
              [(p, ' · '.join(f'{N.LIGAS[l][0]} {liga[p][l]}' for l in quais if liga[p].get(l)), sum(liga[p].values())) for p in sel], mx=mx)
    ligas_q('c10-4ligas', f'Um jogador que jogou nas 4 maiores ligas (Premier League, Liga espanhola, Serie A e Bundesliga) {PER}', GRANDES4)
    ligas_q('c10-5ligas', f'Um jogador que jogou nas 5 grandes ligas (Inglaterra, Espanha, Itália, Alemanha e França) {PER}', GRANDES4 + ['FR1'])
    ligas_q('c10-3de4', f'Um jogador que jogou em pelo menos 3 das 4 maiores ligas (Premier League, Liga espanhola, Serie A, Bundesliga) {PER}', GRANDES4, 3, mx=150)
    for a, b in itertools.combinations(['GB1', 'ES1', 'IT1', 'L1', 'FR1', 'PO1'], 2):
        ligas_q(f'c10-l-{a}-{b}', f'Um jogador que jogou {LIGA_EM[a]} e {LIGA_EM[b]} {PER}', [a, b], mx=150)

    # --- dois clubes ---
    for a, b in itertools.combinations(CLUBES2, 2):
        sel = [p for p, d in clube.items() if d.get(a) and d.get(b)]
        junta(f'c10-2c-{N.norm(a)[:10]}-{N.norm(b)[:10]}', f'Um jogador que jogou {pelo(a)} e {pelo(b)} {PER}',
              f'{SUB}: entrou em campo pela equipa principal dos dois clubes (qualquer competição), épocas de 2015/16 a 2024/25',
              [(p, f'{a} {clube[p][a]} jogos · {b} {clube[p][b]}', clube[p][a] + clube[p][b]) for p in sel], mx=40)

    # --- nacionalidade (e posição) de quem o clube contratou ---
    T, ja = [], set()
    with open(os.path.join(N.CACHE, 'transf.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['transfer_type'] != 'Transfer' or not INI_TR <= r['transfer_date'] <= TR.FIM: continue
            k = (r['player_id'], r['transfer_date'], r['to_team_id'])
            if k in ja: continue
            ja.add(k)
            try: v = float(r['transfer_fee'] or 0)
            except ValueError: v = 0
            T.append(r | {'v': v})
    for c in CLUBES_NAC:
        chaves = {w for t in ids_clube[c] for w in N.norm(nome_tm[t]).split() if len(w) > 3 and w not in ('club', 'futbol', 'football', 'sport', 'clube')}
        ch = [t for t in T if t['to_team_id'] in ids_clube[c] and t['from_team_id'] not in ids_clube[c] and not formacao(c, t['from_team_name'], chaves)]
        sem = {t['player_id'] for t in ch if t['player_id'] not in nac or not nac[t['player_id']] or pos.get(t['player_id']) not in POS}
        if sem: print('  fora (sem perfil):', c, sorted(sem)); continue
        por = defaultdict(list)
        for t in ch:
            det = (f"{TR.m(t['v'])}" if t['v'] > 0 else 'sem valor pago') + f" · {t['transfer_date'][:4]} · de: {N.CLUBE.get(t['from_team_name'], t['from_team_name'])}"
            por[nac[t['player_id']]].append((t['player_id'], det, t['v'] + 1, pos[t['player_id']]))
        sub = f'{SUB}: transferências definitivas (pagas ou a custo zero) do verão de 2015 ao verão de 2025; sem empréstimos nem subidas da formação; nacionalidade desportiva'
        art = 'a' if c in N.FEM else 'o'
        for n, lst in por.items():
            if n not in N.ADJ: continue
            adj = N.ADJ[n]
            pids = {p for p, *_ in lst}
            if 6 <= len(pids) <= 40:
                junta(f'c10-nac-{N.norm(c)[:10]}-{N.norm(n)[:10]}', f'Um jogador {adj} que {art} {c} contratou em definitivo entre 2015 e 2025', sub, [x[:3] for x in lst], mn=6, mx=40)
            if len(pids) >= 12:   # muitos: também por posição
                for pk, (pn, um) in POS.items():
                    sl = [x[:3] for x in lst if x[3] == pk]
                    junta(f'c10-nacp-{N.norm(c)[:10]}-{N.norm(n)[:10]}-{pk[:3].lower()}', f'{um} {adj} que {art} {c} contratou em definitivo entre 2015 e 2025',
                          sub + '; posição principal no Transfermarkt', sl, mn=5, mx=40)
    with open(SAIDA, 'w', encoding='utf8', newline='\n') as f:
        json.dump({'fonte': 'Transfermarkt (salimt/football-datasets, out. 2025)', 'perguntas': perguntas}, f, ensure_ascii=False, separators=(',', ':'))
    from collections import Counter
    print(len(perguntas), 'perguntas', Counter(q['id'].split('-')[1] for q in perguntas))


if __name__ == '__main__':
    main()
