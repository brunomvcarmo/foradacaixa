"""Fora da Caixa — dados dos modos "Quem é?" (carreiras) e "Mais ou menos" (valores para comparar).

Fonte: a mesma de scripts/nacionalidades.py e scripts/transferencias.py (Transfermarkt, outubro de 2025).

carreiras.json — para cada jogador conhecido, os clubes por onde passou (equipas principais, por ordem;
  empréstimos marcados), a nacionalidade e a posição. "Conhecido" = pelo menos 250 jogos nas 6 grandes ligas
  (Inglaterra, Espanha, Itália, Alemanha, França, Portugal) ou uma transferência de 30 M€ ou mais, e pelo menos 3 clubes.
maisoumenos.json — temas com {nome, valor, detalhe}: a transferência mais cara de cada jogador (15 M€ ou mais)
  e os golos em cada liga de 2019/20 a 2024/25 (10 ou mais; as mesmas épocas, conferidas, de nacionalidades.py).

Uso: python3 scripts/modos.py
"""
import csv, json, os, re, sys
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import nacionalidades as N
import transferencias as TR   # (acrescenta os ficheiros das transferências a N.FICH)
N.FICH['teams'] = N.RAW + 'team_details/team_details.csv'

AQUI = N.AQUI
GRANDES = {'GB1', 'ES1', 'IT1', 'L1', 'FR1', 'PO1'}
JOVEM = re.compile(r"(\bU\d\d\b|U-?\d\d|Sub-?\d\d|Under \d\d|Yth\.?|Youth|Juniors?\b|Jgd|\bB$|\bII$|\bIII$|Reserves?|Primavera|Academy|\bC$)", re.I)
FORA = {'Without Club', 'Retired', 'Career break', 'Unknown', 'Ban', 'Unattached', 'Free agent', 'Own Youth'}
POS = {'Goalkeeper': 'guarda-redes', 'Defender': 'defesa', 'Midfield': 'médio', 'Attack': 'avançado'}
NAC_PT = {k: v for k, v in N.ADJ.items()}


def main():
    N.baixar()
    fperf, fprof, ftr = (os.path.join(N.CACHE, k + '.csv') for k in ('perf', 'prof', 'transf'))
    nome_tm, jogos_g, golos_liga = {}, defaultdict(int), defaultdict(lambda: defaultdict(lambda: [0, 0]))
    with open(fperf, encoding='utf8') as f:
        for r in csv.DictReader(f):
            try: n = int(float(r['nb_on_pitch'] or 0)); g = int(float(r['goals'] or 0))
            except ValueError: continue
            if r['competition_id'] in N.LIGAS: nome_tm[r['team_id']] = r['team_name']
            if n <= 0: continue
            if r['competition_id'] in GRANDES: jogos_g[r['player_id']] += n
            if r['season_name'] in N.EPOCAS and r['competition_id'] in N.LIGAS:
                golos_liga[r['competition_id']][r['player_id']][0] += g; golos_liga[r['competition_id']][r['player_id']][1] += n
    equipas = {}
    with open(os.path.join(N.CACHE, 'teams.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f):
            equipas[r['club_id']] = re.sub(r'\s*\(\d+\)$', '', r['club_name']).strip()
    def clube(tid, curto):
        if nome_tm.get(tid) in N.CLUBE: return N.CLUBE[nome_tm[tid]]
        return curto or equipas.get(tid) or ''
    prof = {}
    with open(fprof, encoding='utf8') as f:
        for r in csv.DictReader(f):
            nm = re.sub(r'\s*\(\d+\)$', '', r['player_name']).strip() or N.nome_do_slug(r['player_id'], r['player_slug'], r['name_in_home_country'])
            prof[r['player_id']] = (nm, r['citizenship'].split('  ')[0].strip(), POS.get(r['main_position'], ''))
    trans = defaultdict(list)
    with open(ftr, encoding='utf8') as f:
        for r in csv.DictReader(f): trans[r['player_id']].append(r)

    # ---------- carreiras ----------
    car, nomes = [], set()
    for pid, rs in trans.items():
        if pid not in prof: continue
        fee = max((float(r['transfer_fee'] or 0) for r in rs if r['transfer_type'] == 'Transfer'), default=0)
        if jogos_g[pid] < 250 and fee < 30e6: continue
        rs.sort(key=lambda r: (r['transfer_date'], r['transfer_type'] == 'Return from loan'))
        cam = []
        def poe(tid, nome, ano, emp):
            if not nome or nome in FORA or JOVEM.search(nome): return
            c = clube(tid, nome)
            if cam and cam[-1][0] == c:
                if not emp: cam[-1][2] = False
                return
            cam.append([c, ano, emp])
        for r in rs:
            if r['transfer_type'] == 'Return from loan': continue
            if not cam: poe(r['from_team_id'], r['from_team_name'], r['transfer_date'][:4], False)
            poe(r['to_team_id'], r['to_team_name'], r['transfer_date'][:4], r['transfer_type'] == 'Loan')
        if len({c for c, _, _ in cam}) < 3: continue
        nm, nac, pos = prof[pid]
        k = N.norm(nm)
        if k in nomes: continue   # dois jogadores com o mesmo nome: fica o primeiro (raro)
        nomes.add(k)
        car.append({'n': nm, 'nac': NAC_PT.get(nac, nac), 'pos': pos, 'j': jogos_g[pid], 'f': round(fee / 1e6), 'c': [[c, int(a) if a.isdigit() else 0, 1 if e else 0] for c, a, e in cam]})
    car.sort(key=lambda x: -x['j'])
    # ---------- mais ou menos ----------
    temas = []
    caras = {}
    for pid, rs in trans.items():
        if pid not in prof: continue
        for r in rs:
            if r['transfer_type'] != 'Transfer' or r['transfer_date'] > TR.FIM: continue
            v = float(r['transfer_fee'] or 0)
            if v >= 15e6 and v > caras.get(pid, (0,))[0]:
                caras[pid] = (v, f"{clube(r['from_team_id'], r['from_team_name'])} → {clube(r['to_team_id'], r['to_team_name'])}, {N.epoca_longa(r['season_name'])}")
    temas.append({'id': 'fee', 'nome': 'Transferências', 'ic': '💰', 'pergunta': 'custou', 'unid': 'M€',
                  'sub': 'A transferência mais cara de cada jogador (está sempre escrita: de onde, para onde e quando) · valor do Transfermarkt, até ao verão de 2025',
                  'itens': sorted([[prof[p][0], round(v / 1e6, 1), d] for p, (v, d) in caras.items()], key=lambda x: -x[1])})
    for liga, (lnome, na) in N.LIGAS.items():
        if liga in ('NL1', 'BE1', 'SC1', 'TR1'): continue
        it = [[prof[p][0], g, f'{n} jogos'] for p, (g, n) in golos_liga[liga].items() if g >= 10 and p in prof]
        temas.append({'id': 'g' + liga, 'nome': f'Golos {na}', 'ic': '⚽', 'pergunta': 'marcou', 'unid': 'golos',
                      'sub': f'Golos {na} de 2019/20 a 2024/25', 'itens': sorted(it, key=lambda x: -x[1])})
    for nome, dados in (('carreiras.json', {'fonte': 'Transfermarkt (out. 2025)', 'jogadores': car}),
                        ('maisoumenos.json', {'fonte': 'Transfermarkt (out. 2025)', 'temas': temas})):
        with open(os.path.join(AQUI, '..', nome), 'w', encoding='utf8', newline='\n') as f:
            json.dump(dados, f, ensure_ascii=False, separators=(',', ':'))
    print('carreiras', len(car), '· temas', [(t['id'], len(t['itens'])) for t in temas])


if __name__ == '__main__':
    main()
