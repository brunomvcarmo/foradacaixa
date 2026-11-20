"""Fora da Caixa — perguntas de transferências (categoria "mercado").

Fonte: salimt/football-datasets (Transfermarkt, outubro de 2025): histórico de transferências com o valor
pago. Usa os mesmos ficheiros e nomes de clubes de scripts/nacionalidades.py.

Regras (iguais às outras perguntas):
- só transferências definitivas ("Transfer"; empréstimos não contam), valor segundo o Transfermarkt;
- épocas fechadas: as perguntas por época vão de 2015/16 a 2024/25; as de "sempre" vão até ao mercado
  de verão de 2025 (os dados acabam em outubro de 2025);
- se alguma transferência que devia ser resposta não tiver o nome do jogador nos dados, a pergunta não entra
  (assim nunca falta uma resposta certa);
- respostas da mais óbvia (mais cara) para a mais rara.

Uso: python3 scripts/transferencias.py  →  escreve transferencias.json
"""
import csv, json, os, sys
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import nacionalidades as N

SAIDA = os.path.join(N.AQUI, '..', 'transferencias.json')
N.FICH['transf'] = N.LFS + 'transfer_history/transfer_history.csv'
N.FICH['mates'] = N.RAW + 'player_teammates_played_with/player_teammates_played_with.csv'   # nomes de quem não tem perfil
EPOCAS = ['15/16', '16/17', '17/18', '18/19', '19/20', '20/21', '21/22', '22/23', '23/24', '24/25']
FIM = '2025-09-30'   # fim do mercado de verão de 2025
LIGAS = dict(N.LIGAS, SA1=('Liga saudita', 'na Liga saudita'))
LIGAS_EP = ['GB1', 'ES1', 'IT1', 'L1', 'FR1', 'PO1', 'TR1', 'NL1', 'SA1']
# milhões de euros. Nunca abaixo de 10: nas transferências grandes os dados batem certo com o que se sabe
# (Benfica, FC Porto, Sporting, as mais caras de sempre), nas pequenas não há como confirmar que estão todas.
LIMIARES = [100, 80, 60, 50, 40, 30, 25, 20, 15, 12, 10]
MIN, MAX = 5, 60


def m(v):   # 127200000 → "127,2 M€"
    x = v / 1e6
    return (f'{x:.0f}' if abs(x - round(x)) < .05 else f'{x:.1f}'.replace('.', ',')) + ' M€'


def main():
    N.baixar()
    fperf, fprof, ftr = (os.path.join(N.CACHE, k + '.csv') for k in ('perf', 'prof', 'transf'))
    # clube → liga em cada época (pelos jogos) e nome do clube como no jogo
    liga_de, nome_tm = {}, {}
    with open(fperf, encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['competition_id'] in LIGAS:
                liga_de[(r['team_id'], r['season_name'])] = r['competition_id']; nome_tm[r['team_id']] = r['team_name']
    def clube(tid, curto): return N.CLUBE.get(nome_tm.get(tid, ''), curto)
    nome, nac = {}, {}
    with open(fprof, encoding='utf8') as f:
        for r in csv.DictReader(f):
            nome[r['player_id']] = (N.re.sub(r'\s*\(\d+\)$', '', r['player_name']).strip()
                                    or N.nome_do_slug(r['player_id'], r['player_slug'], r['name_in_home_country']))
            nac[r['player_id']] = r['citizenship'].split('  ')[0].strip()
    with open(os.path.join(N.CACHE, 'mates.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['teammate_player_id'] not in nome and r['teammate_player_name']: nome[r['teammate_player_id']] = r['teammate_player_name'].strip()
    T, ja = [], set()
    with open(ftr, encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['transfer_type'] != 'Transfer': continue
            try: v = float(r['transfer_fee'] or 0)
            except ValueError: continue
            if v < 1e6 or r['transfer_date'] > FIM: continue
            k = (r['player_id'], r['transfer_date'], r['to_team_id'])
            if k in ja: continue
            ja.add(k)
            T.append({'pid': r['player_id'], 'ep': r['season_name'], 'v': v, 'de': r['from_team_id'], 'para': r['to_team_id'],
                      'txt': f"{m(v)} · {clube(r['from_team_id'], r['from_team_name'])} → {clube(r['to_team_id'], r['to_team_name'])} ({N.epoca_longa(r['season_name'])})",
                      'liga_para': liga_de.get((r['to_team_id'], r['season_name'])), 'liga_de': liga_de.get((r['from_team_id'], r['season_name']))})
    print('transferências pagas', len(T))

    perguntas, sem_nome = [], 0
    def junta(qid, txt, sub, lst, todos=None):
        nonlocal sem_nome   # todos: as transferências de onde se escolheu (nas perguntas por nacionalidade, sem perfil não se sabe a nacionalidade)
        if any(t['pid'] not in nome or not nome[t['pid']] for t in lst) or (todos and any(t['pid'] not in nac for t in todos)): sem_nome += 1; return False
        melhor = {}
        for t in sorted(lst, key=lambda t: -t['v']):   # cada jogador uma vez, pela transferência mais cara
            k = N.norm(nome[t['pid']])
            if k not in melhor: melhor[k] = [nome[t['pid']], t['txt']]
        r = list(melhor.values())
        if not MIN <= len(r) <= MAX: return False
        perguntas.append({'id': qid, 'cat': 'mercado', 'tipo': 'jogador', 'txt': txt, 'sub': sub, 'r': r}); return True
    def por_limiar(qid, lst, fazer, hi=40, todos=None):   # o maior limiar redondo com 12 a hi respostas (ou, se não houver, com 8 ou mais)
        for lo in (12, 8, MIN):
            for x in LIMIARES:
                sel = [t for t in lst if t['v'] >= x * 1e6]
                if lo <= len({t['pid'] for t in sel}) <= hi:
                    txt, sub = fazer(x)
                    if junta(f'{qid}-{x}', txt, sub, sel, todos and [t for t in todos if t['v'] >= x * 1e6]): return True
        return False
    SUB = 'Transferência definitiva (empréstimos não contam), valor segundo o Transfermarkt'

    # 1) as mais caras de sempre
    for x in (100, 80, 60):
        junta(f'merc-sempre-{x}', f'Um jogador que custou pelo menos {x} milhões de euros numa transferência', f'{SUB}, até ao verão de 2025',
              [t for t in T if t['v'] >= x * 1e6])
    # 2) contratações de cada liga em cada época
    for liga in LIGAS_EP:
        nm_l = LIGAS[liga][0]
        for ep in EPOCAS:
            lst = [t for t in T if t['ep'] == ep and t['liga_para'] == liga and t['liga_de'] != liga]
            por_limiar(f'merc-{liga}-{ep[:2]}', lst, lambda x, ep=ep, nm_l=nm_l: (
                f'Um jogador que um clube da {nm_l} contratou por pelo menos {x} M€ em {N.epoca_longa(ep)}',
                f'Vindo de fora da {nm_l}, na época {N.epoca_longa(ep)} (mercado de verão e de inverno). {SUB}'))
            dentro = [t for t in T if t['ep'] == ep and t['liga_para'] == liga]
            if liga in ('GB1', 'PO1'):   # contando também as transferências dentro da liga
                por_limiar(f'mercT-{liga}-{ep[:2]}', dentro, lambda x, ep=ep, nm_l=nm_l: (
                    f'Uma contratação de pelo menos {x} M€ de um clube da {nm_l} em {N.epoca_longa(ep)}',
                    f'Inclui transferências entre clubes da {nm_l}. {SUB}'))
    # 3) vendas e compras de clubes (de sempre, até ao verão de 2025)
    ids = defaultdict(set)
    for tid, n in nome_tm.items():
        if n in N.CLUBE: ids[N.CLUBE[n]].add(tid)
    VENDAS = ['Benfica', 'FC Porto', 'Sporting', 'Braga', 'Vitória de Guimarães', 'Ajax', 'Borussia Dortmund', 'Monaco', 'Lyon', 'Lille', 'Southampton', 'Leicester', 'Brighton', 'RB Leipzig', 'Bayer Leverkusen', 'Eintracht Frankfurt', 'Atalanta', 'Sevilha', 'Villarreal']
    COMPRAS = ['Benfica', 'FC Porto', 'Sporting', 'Braga', 'Real Madrid', 'Barcelona', 'Atlético de Madrid', 'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea',
               'Arsenal', 'Tottenham', 'Newcastle', 'Aston Villa', 'West Ham', 'Juventus', 'Milan', 'Inter', 'Napoli', 'Roma', 'Bayern', 'Borussia Dortmund', 'PSG', 'Marseille', 'Al-Hilal']
    for c in VENDAS:
        art = 'a' if c in N.FEM else 'o'
        por_limiar(f'mercV-{N.norm(c)[:14]}', [t for t in T if t['de'] in ids[c]], lambda x, c=c, art=art: (
            f'Um jogador que {art} {c} vendeu por pelo menos {x} M€', f'{SUB}, até ao verão de 2025'), hi=45)
    for c in COMPRAS:
        art = 'a' if c in N.FEM else 'o'
        tids = ids[c] or {t['para'] for t in T if c in t['txt'].split(' → ')[-1]}
        por_limiar(f'mercC-{N.norm(c)[:14]}', [t for t in T if t['para'] in tids], lambda x, c=c, art=art: (
            f'Um jogador que {art} {c} comprou por pelo menos {x} M€', f'{SUB}, até ao verão de 2025'), hi=45)
    # 4) os mais caros de cada nacionalidade
    for pais, adj in [('Portugal', 'português'), ('Brazil', 'brasileiro'), ('Argentina', 'argentino'), ('France', 'francês'), ('England', 'inglês'),
                      ('Spain', 'espanhol'), ('Germany', 'alemão'), ('Netherlands', 'neerlandês'), ('Belgium', 'belga'), ('Italy', 'italiano'),
                      ('Uruguay', 'uruguaio'), ('Colombia', 'colombiano'), ('Nigeria', 'nigeriano'), ('Senegal', 'senegalês'), ('Croatia', 'croata'), ('Serbia', 'sérvio')]:
        por_limiar(f'mercN-{N.norm(pais)[:10]}', [t for t in T if nac.get(t['pid']) == pais], lambda x, adj=adj: (
            f'Um jogador {adj} que custou pelo menos {x} M€ numa transferência', f'Nacionalidade desportiva. {SUB}, até ao verão de 2025'), hi=45, todos=T)

    with open(SAIDA, 'w', encoding='utf8', newline='\n') as f:
        json.dump({'fonte': 'Transfermarkt (salimt/football-datasets, out. 2025)', 'perguntas': perguntas}, f, ensure_ascii=False, separators=(',', ':'))
    tipos = defaultdict(int)
    for q in perguntas: tipos[q['id'].split('-')[0]] += 1
    print(len(perguntas), 'perguntas', dict(tipos), '· sem nome (fora):', sem_nome, '· 12+ respostas', sum(len(q['r']) >= 12 for q in perguntas))


if __name__ == '__main__':
    main()
