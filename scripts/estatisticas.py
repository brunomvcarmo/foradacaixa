"""Fora da Caixa — perguntas de estatísticas: golos, assistências, golos de penálti e jogos sem sofrer, por liga e época
→ estatisticas.json (categoria "ligas", Jogadores pelo mundo).

Fonte: a mesma de scripts/nacionalidades.py (Transfermarkt, salimt/football-datasets, out. 2025), só as épocas
2019/20 a 2024/25 (as mesmas que foram conferidas contra os dados oficiais da Premier League). Conferido à mão:
Salah 19/22/23/19/18/29 golos na Premier League, Kane 30 (22/23) e 36 na Bundesliga (23/24), Haaland, Messi.
Para cada pergunta escolhe-se o maior limite redondo que dê uma lista jeitosa (de 8 a 40 respostas).
Respostas da mais óbvia (o número maior) para a mais rara.
Uso: python3 scripts/estatisticas.py   (usa os ficheiros em /tmp/fdc-tm, descarrega-os se faltarem)
"""
import csv, json, os, re, sys
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import nacionalidades as N

SAIDA = os.path.join(N.AQUI, '..', 'estatisticas.json')
LIGAS = {'GB1': 'na Premier League', 'ES1': 'na Liga espanhola', 'IT1': 'na Serie A italiana', 'L1': 'na Bundesliga',
         'FR1': 'na Ligue 1 francesa', 'PO1': 'na Liga Portuguesa', 'TR1': 'na Liga turca', 'NL1': 'na Eredivisie (Países Baixos)'}
CINCO = ['GB1', 'ES1', 'IT1', 'L1', 'FR1']
SUB = 'Segundo o Transfermarkt, só jogos do campeonato'
FONTE_EP = 'de 2019/20 a 2024/25'


def main():
    fperf, fprof = N.baixar()
    nome, gr = {}, set()
    with open(fprof, encoding='utf8') as f:
        for r in csv.DictReader(f):
            nome[r['player_id']] = re.sub(r'\s*\(\d+\)$', '', r['player_name']).strip() or N.nome_do_slug(r['player_id'], r['player_slug'], r['name_in_home_country'])
            if r['main_position'] == 'Goalkeeper': gr.add(r['player_id'])
    # (jogador, competição, época) → golos, assistências, penáltis, sem sofrer, jogos
    S = defaultdict(lambda: [0, 0, 0, 0, 0])
    with open(fperf, encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['season_name'] not in N.EPOCAS: continue
            comp = r['competition_id']
            if comp not in LIGAS and comp != 'CL': continue
            try: n = int(float(r['nb_on_pitch'] or 0))
            except ValueError: continue
            if n <= 0: continue
            v = S[(r['player_id'], comp, r['season_name'])]
            v[0] += int(float(r['goals'] or 0)); v[1] += int(float(r['assists'] or 0)); v[2] += int(float(r['penalty_goals'] or 0))
            v[3] += int(float(r['clean_sheets'] or 0)); v[4] += n
    perguntas, sem_nome = [], 0
    def soma(comps, eps, k, so_gr=False):
        t = defaultdict(int)
        for (p, c, e), v in S.items():
            if c in comps and e in eps and (not so_gr or p in gr): t[p] += v[k]
        return t
    def faz(qid, frase, t, unid, limites, mn=8, mx=40, sub=SUB):
        nonlocal sem_nome
        for lim in limites:
            sel = {p: v for p, v in t.items() if v >= lim}
            if mn <= len(sel) <= mx:
                if any(not nome.get(p) for p in sel): sem_nome += 1; return
                r, vistos = [], set()
                for p, v in sorted(sel.items(), key=lambda x: -x[1]):
                    k = N.norm(nome[p])
                    if k in vistos: continue   # dois jogadores com o mesmo nome: fica o primeiro
                    vistos.add(k); r.append([nome[p], f'{v} {unid}' if v != 1 else f'1 {unid[:-1]}'])
                if len(r) >= 5: perguntas.append({'id': qid.format(lim=lim), 'cat': 'ligas', 'tipo': 'jogador', 'txt': frase.format(lim=lim), 'sub': sub, 'r': r})
                return
    EP = N.EPOCAS
    for L, na in LIGAS.items():
        faz(f'st-g-{L}-{{lim}}', f'Um jogador com pelo menos {{lim}} golos {na} {FONTE_EP}', soma([L], EP, 0), 'golos', [150, 120, 100, 90, 80, 70, 60, 50, 45, 40, 35, 30, 25])
        faz(f'st-a-{L}-{{lim}}', f'Um jogador com pelo menos {{lim}} assistências {na} {FONTE_EP}', soma([L], EP, 1), 'assistências', [60, 50, 45, 40, 35, 30, 25, 20])
        faz(f'st-p-{L}-{{lim}}', f'Um jogador que marcou pelo menos {{lim}} golos de penálti {na} {FONTE_EP}', soma([L], EP, 2), 'penáltis', [30, 25, 20, 15, 12, 10, 8])
        faz(f'st-cs-{L}-{{lim}}', f'Um guarda-redes com pelo menos {{lim}} jogos sem sofrer golos {na} {FONTE_EP}', soma([L], EP, 3, True), 'jogos', [80, 70, 60, 50, 45, 40, 35, 30], mn=6)
        for e in EP:
            ep = N.epoca_longa(e)
            faz(f'st-ge-{L}-{e[:2]}-{{lim}}', f'Um jogador que marcou {{lim}} ou mais golos {na} {ep}', soma([L], [e], 0), 'golos', [25, 20, 18, 15, 12, 10], mn=6, mx=25)
            faz(f'st-ae-{L}-{e[:2]}-{{lim}}', f'Um jogador com {{lim}} ou mais assistências {na} {ep}', soma([L], [e], 1), 'assistências', [15, 12, 10, 9, 8, 7], mn=6, mx=25)
    # as 5 grandes ligas juntas
    faz('st-g5-{lim}', f'Um jogador com pelo menos {{lim}} golos nas 5 grandes ligas (Inglaterra, Espanha, Itália, Alemanha, França) {FONTE_EP}', soma(CINCO, EP, 0), 'golos', [150, 140, 130, 120, 110, 100, 90, 80], mn=10)
    faz('st-a5-{lim}', f'Um jogador com pelo menos {{lim}} assistências nas 5 grandes ligas {FONTE_EP}', soma(CINCO, EP, 1), 'assistências', [70, 60, 55, 50, 45], mn=10)
    # Liga dos Campeões (só a fase principal, sem pré-eliminatórias)
    SUBC = 'Segundo o Transfermarkt, fase principal da Liga dos Campeões (sem pré-eliminatórias)'
    faz('st-gcl-{lim}', f'Um jogador com pelo menos {{lim}} golos na Liga dos Campeões {FONTE_EP}', soma(['CL'], EP, 0), 'golos', [40, 30, 25, 20, 18, 15], sub=SUBC)
    faz('st-acl-{lim}', f'Um jogador com pelo menos {{lim}} assistências na Liga dos Campeões {FONTE_EP}', soma(['CL'], EP, 1), 'assistências', [20, 15, 12, 10, 9, 8], sub=SUBC)
    for e in EP:
        faz(f'st-gcle-{e[:2]}-{{lim}}', f'Um jogador que marcou {{lim}} ou mais golos na Liga dos Campeões {N.epoca_longa(e)}', soma(['CL'], [e], 0), 'golos', [10, 8, 7, 6, 5], mn=6, mx=25, sub=SUBC)
    with open(SAIDA, 'w', encoding='utf8', newline='\n') as f:
        json.dump({'fonte': 'Transfermarkt (salimt/football-datasets, out. 2025)', 'perguntas': perguntas}, f, ensure_ascii=False, separators=(',', ':'))
    print(len(perguntas), 'perguntas · sem nome (fora):', sem_nome)


if __name__ == '__main__':
    main()
