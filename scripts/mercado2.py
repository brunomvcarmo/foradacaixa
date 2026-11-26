"""Fora da Caixa — mais perguntas de transferências → mercado2.json (categoria "mercado").

Fonte: a mesma de scripts/transferencias.py (Transfermarkt, salimt/football-datasets, out. 2025).
- "Um jogador que o <clube> contratou em definitivo" entre o verão de 2020 e o verão de 2025 (pago ou a custo zero; sem empréstimos,
  sem regressos de empréstimo e sem subidas das equipas B/juniores do próprio clube);
- "Um jogador que esteve emprestado ao <clube>" (de 2015/16 a 2025/26, mercado de verão de 2025 incluído);
- "Um jogador cujas transferências somam pelo menos X M€" (todas as transferências definitivas pagas até ao verão de 2025).
Se faltar o nome de algum jogador que devia ser resposta, a pergunta não entra (nunca falta uma resposta certa).
Uso: python3 scripts/mercado2.py
"""
import csv, json, os, re, sys
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import nacionalidades as N
import transferencias as TR   # (junta os ficheiros das transferências e dos colegas a N.FICH)

SAIDA = os.path.join(N.AQUI, '..', 'mercado2.json')
INI5, FIM = '2020-07-01', TR.FIM
INI_EMP = '2015-07-01'
CLUBES = ['Benfica', 'FC Porto', 'Sporting', 'Braga', 'Vitória de Guimarães', 'Real Madrid', 'Barcelona', 'Atlético de Madrid', 'Manchester United', 'Manchester City',
          'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Newcastle', 'Juventus', 'Milan', 'Inter', 'Napoli', 'Roma', 'Bayern', 'Borussia Dortmund', 'PSG', 'Ajax']
SUB = 'Segundo o Transfermarkt'
# jogadores sem nome nos dados, identificados com certeza pela carreira (o resto das perguntas sem nome fica de fora)
NOME_MANUAL = {'75287': 'Seydou Doumbia', '45124': 'Medhi Benatia', '146805': 'Majeed Waris'}


def main():
    N.baixar()
    fperf = os.path.join(N.CACHE, 'perf.csv')
    nome_tm = {}
    with open(fperf, encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['competition_id'] in TR.LIGAS: nome_tm[r['team_id']] = r['team_name']
    ids = defaultdict(set)
    for tid, n in nome_tm.items():
        if n in N.CLUBE: ids[N.CLUBE[n]].add(tid)
    nome = {}
    with open(os.path.join(N.CACHE, 'prof.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f):
            nome[r['player_id']] = re.sub(r'\s*\(\d+\)$', '', r['player_name']).strip() or N.nome_do_slug(r['player_id'], r['player_slug'], r['name_in_home_country'])
    nome.update(NOME_MANUAL)
    with open(os.path.join(N.CACHE, 'mates.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['teammate_player_id'] not in nome and r['teammate_player_name']: nome[r['teammate_player_id']] = r['teammate_player_name'].strip()
    T, ja = [], set()
    with open(os.path.join(N.CACHE, 'transf.csv'), encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['transfer_type'] not in ('Transfer', 'Loan') or r['transfer_date'] > FIM: continue
            k = (r['player_id'], r['transfer_date'], r['to_team_id'], r['transfer_type'])
            if k in ja: continue
            ja.add(k)
            try: v = float(r['transfer_fee'] or 0)
            except ValueError: v = 0
            T.append(r | {'v': v})
    print('movimentos', len(T))
    perguntas, sem_nome = [], 0

    def junta(qid, txt, sub, itens, mn=8, mx=60):
        """itens: [(pid, texto)] já pela ordem (mais óbvia primeiro)"""
        nonlocal sem_nome
        if any(not nome.get(p) for p, _ in itens): sem_nome += 1; print('  sem nome:', qid); return
        r, vistos = [], set()
        for p, t in itens:
            k = N.norm(nome[p])
            if k not in vistos: vistos.add(k); r.append([nome[p], t])
        if mn <= len(r) <= mx: perguntas.append({'id': qid, 'cat': 'mercado', 'tipo': 'jogador', 'txt': txt, 'sub': sub, 'r': r})
        else: print('  fora (', len(r), 'respostas):', qid)

    nclube = lambda tid, nm: N.CLUBE.get(nome_tm.get(tid, ''), nm)
    def do_clube(c, nm):   # equipas B/juniores do próprio clube (o nome do Transfermarkt contém o do clube)
        chaves = {w for t in ids[c] for w in N.norm(nome_tm[t]).split() if len(w) > 3 and w not in ('club', 'futbol', 'football', 'sport', 'clube')}
        return bool(chaves & set(N.norm(nm).split()))

    for c in CLUBES:
        if not ids[c]: print('  sem id:', c); continue
        art = 'a' if c in N.FEM else 'o'
        # contratações em definitivo nos últimos 5 anos
        ch = [t for t in T if t['transfer_type'] == 'Transfer' and t['to_team_id'] in ids[c] and t['from_team_id'] not in ids[c]
              and INI5 <= t['transfer_date'] and not do_clube(c, t['from_team_name'])]
        ch.sort(key=lambda t: (-t['v'], t['transfer_date']))
        txt = lambda t: (f"{TR.m(t['v'])} · " if t['v'] > 0 else 'a custo zero · ') + f"de: {nclube(t['from_team_id'], t['from_team_name'])} ({t['transfer_date'][:4]})"
        junta(f'm2-chega-{N.norm(c)[:14]}', f'Um jogador que {art} {c} contratou em definitivo entre o verão de 2020 e o verão de 2025',
              f'{SUB}; inclui transferências a custo zero, não inclui empréstimos nem subidas da formação', [(t['player_id'], txt(t)) for t in ch], mx=70)
        # empréstimos ao clube
        em = [t for t in T if t['transfer_type'] == 'Loan' and t['to_team_id'] in ids[c] and t['from_team_id'] not in ids[c] and INI_EMP <= t['transfer_date']
              and not do_clube(c, t['from_team_name'])]
        em.sort(key=lambda t: t['transfer_date'], reverse=True)
        junta(f'm2-emp-{N.norm(c)[:14]}', f'Um jogador que esteve emprestado {"à" if art == "a" else "ao"} {c} (de 2015/16 a 2025/26)',
              f'{SUB}; empréstimos vindos de outros clubes, até ao mercado de verão de 2025', [(t['player_id'], f"emprestado por: {nclube(t['from_team_id'], t['from_team_name'])} ({t['transfer_date'][:4]})") for t in em], mn=6)
    # valor somado de todas as transferências de cada jogador
    soma, n_tr = defaultdict(float), defaultdict(int)
    for t in T:
        if t['transfer_type'] == 'Transfer' and t['v'] > 0: soma[t['player_id']] += t['v']; n_tr[t['player_id']] += 1
    for lim in (200, 150, 100):
        sel = sorted([p for p, v in soma.items() if v >= lim * 1e6], key=lambda p: -soma[p])
        if 12 <= len(sel) <= 90:
            junta(f'm2-soma-{lim}', f'Um jogador cujas transferências somam pelo menos {lim} milhões de euros',
                  f'{SUB}: soma de todas as transferências definitivas pagas da carreira, até ao verão de 2025', [(p, f'{TR.m(soma[p])} em {n_tr[p]} transferência' + ('s' if n_tr[p] > 1 else '')) for p in sel], mn=12, mx=90)
    with open(SAIDA, 'w', encoding='utf8', newline='\n') as f:
        json.dump({'fonte': 'Transfermarkt (salimt/football-datasets, out. 2025)', 'perguntas': perguntas}, f, ensure_ascii=False, separators=(',', ':'))
    print(len(perguntas), 'perguntas · sem nome (fora):', sem_nome)


if __name__ == '__main__':
    main()
