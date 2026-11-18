"""Perguntas das épocas passadas da Premier League (2016/17 a 2024/25) para o jogo "Fora da Caixa".
Fonte: dados oficiais da FPL arquivados no projeto público vaastav/Fantasy-Premier-League (um ficheiro por jornada,
com a equipa de cada jogador em cada jogo — quem mudou de clube a meio da época conta pelo clube certo).
A resposta "óbvia" é a do jogador mais popular nessa época (percentagem de adeptos que o escolheram).
Escreve historia.json. Só é preciso correr outra vez para juntar uma época nova (as passadas não mudam).
Uso (a partir da raiz):  python3 scripts/historia_pl.py   ·   Windows: py -X utf8 scripts/historia_pl.py"""
import csv, io, json, time, urllib.request
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'historia.json'
BASE = 'https://raw.githubusercontent.com/vaastav/Fantasy-Premier-League/master/data'
UA = {'User-Agent': 'Mozilla/5.0', 'Accept': '*/*'}
EPOCAS = ['2016-17', '2017-18', '2018-19', '2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2024-25', '2025-26']   # os últimos 10 anos
# nomes dos clubes como no banco de perguntas (perguntas.js)
NOMES = {'Man City': 'Manchester City', 'Man Utd': 'Manchester United', 'Spurs': 'Tottenham', "Nott'm Forest": 'Nottingham Forest',
         'Sheffield Utd': 'Sheffield United', 'Wolves': 'Wolverhampton', 'West Brom': 'West Bromwich Albion', 'Leicester': 'Leicester',
         'Newcastle': 'Newcastle', 'Brighton': 'Brighton', 'Huddersfield': 'Huddersfield Town', 'Cardiff': 'Cardiff City',
         'Swansea': 'Swansea City', 'Stoke': 'Stoke City', 'Hull': 'Hull City', 'Norwich': 'Norwich City', 'Luton': 'Luton Town',
         'Ipswich': 'Ipswich Town', 'Middlesbrough': 'Middlesbrough', 'Sunderland': 'Sunderland'}


# nomes por extenso dos grandes marcadores (o nome curto da FPL nem sempre serve numa pergunta)
NOME_JOGADOR = {'108823': 'Dele Alli', '85971': 'Son Heung-min', '165809': 'Bernardo Silva', '194634': 'Diogo Jota', '102057': 'Raúl Jiménez',
                '66749': 'Romelu Lukaku', '205651': 'Gabriel Jesus', '212319': 'Richarlison', '141746': 'Bruno Fernandes', '444145': 'Gabriel Martinelli'}


def get(url):
    for k in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180) as r:
                return r.read().decode('utf-8', errors='replace')
        except Exception as e:
            if k == 3: raise RuntimeError(f'falhou {url}: {e}')
            time.sleep(3 + 4 * k)


def rows(url): return list(csv.DictReader(io.StringIO(get(url))))
def num(x):
    try: return float(x)
    except (TypeError, ValueError): return 0.0
def pl(n, s, p=None): return f'1 {s}' if n == 1 else f'{n} {p or s + "s"}'
def do(t): return 'do ' + t if not t.startswith(('Brighton', 'Leicester')) else 'do ' + t


def main():
    master = defaultdict(dict)
    for r in rows(f'{BASE}/master_team_list.csv'):
        master[r['season']][int(r['team'])] = r['team_name']
    jogadores, perguntas = {}, []
    contra = defaultdict(Counter)   # código do jogador → clube adversário → golos (todas as épocas)
    soma = defaultdict(Counter)     # código do jogador → golos, assistências, jogos sem sofrer (GR), golos numa época (máx.)
    pelo = defaultdict(Counter)     # (clube) → código do jogador → golos por esse clube
    pos_c = {}
    nome_curto = {}
    GRANDES6 = ['Liverpool', 'Manchester City', 'Arsenal', 'Chelsea', 'Manchester United', 'Tottenham']
    for ep in EPOCAS:
        label = f'{ep[:4]}/{ep[5:]}'
        teams = dict(master.get(ep, {}))
        if not teams:
            teams = {int(t['id']): t['name'] for t in rows(f'{BASE}/{ep}/teams.csv')}
        teams = {k: NOMES.get(v, v) for k, v in teams.items()}
        raw = {int(p['id']): p for p in rows(f'{BASE}/{ep}/players_raw.csv')}
        gw = rows(f'{BASE}/{ep}/gws/merged_gw.csv')
        # equipa de cada linha: coluna "team" (épocas recentes) ou deduzida do jogo (casa/fora + adversário)
        home, away = {}, {}
        for r in gw:
            if r['was_home'] in ('True', 'true', '1'): away[r['fixture']] = int(r['opponent_team'])
            else: home[r['fixture']] = int(r['opponent_team'])
        name2id = {v: k for k, v in teams.items()}
        st = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))   # jogador → equipa → estatística
        hat = set(); tot = defaultdict(lambda: defaultdict(int)); vs = defaultdict(Counter); vs_grande = defaultdict(Counter)
        for r in gw:
            el = int(r['element'])
            if r.get('team') and NOMES.get(r['team'], r['team']) in name2id: t = name2id[NOMES.get(r['team'], r['team'])]
            else: t = home.get(r['fixture']) if r['was_home'] in ('True', 'true', '1') else away.get(r['fixture'])
            if t is None: continue
            m = int(num(r['minutes'])); g = int(num(r['goals_scored'])); a = int(num(r['assists']))
            s = st[el][t]
            s['jogos'] += m > 0; s['golos'] += g; s['assist'] += a
            for k in ('red_cards', 'own_goals', 'penalties_missed', 'clean_sheets'):
                tot[el][k] += int(num(r[k])) if (k != 'clean_sheets' or m >= 60) else 0
            tot[el]['golos'] += g; tot[el]['assist'] += a; tot[el]['pontos'] += int(num(r['total_points']))
            if g >= 3: hat.add(el)
            if g > 0:
                adv = teams.get(int(num(r['opponent_team'])))
                if adv:
                    vs[el][adv] += g
                    if adv in GRANDES6: vs_grande[adv][el] += g
        fama = {el: num(p['selected_by_percent']) + num(p['total_points']) / 1000 for el, p in raw.items()}
        pos = {el: int(num(p['element_type'])) for el, p in raw.items()}
        code = {el: str(p['code']) for el, p in raw.items()}
        for el, p in raw.items():
            if el in st: jogadores[code[el]] = [p['web_name'], f"{p['first_name']} {p['second_name']}".strip()]
            if el in vs: contra[code[el]].update(vs[el]); nome_curto[code[el]] = (p['first_name'], p['second_name'], p['web_name'])
        for el in tot:
            if el not in code: continue
            c = code[el]; soma[c]['golos'] += tot[el]['golos']; soma[c]['assist'] += tot[el]['assist']; soma[c]['cs'] += tot[el]['clean_sheets']
            soma[c]['melhor'] = max(soma[c]['melhor'], tot[el]['golos']); soma[c]['epocas'] += 1; pos_c[c] = pos.get(el)
            if tot[el]['golos'] >= 20: soma[c][f'ep20:{label}'] = tot[el]['golos']
        for el, d in st.items():
            if el in code:
                for t, x in d.items():
                    if x['golos']: pelo[teams[t]][code[el]] += x['golos']

        def q(qid, txt, sub, items):
            items = [(el, s) for el, s in items if el in raw]
            items.sort(key=lambda x: -fama[x[0]])
            perguntas.append({'id': f'h{label}-{qid}', 'ep': label, 'txt': txt, 'sub': sub,
                              'r': [[code[el], s] for el, s in items]})

        sub = f'Premier League {label}'
        for t, tn in sorted(teams.items()):
            g = [(el, pl(d[t]['golos'], 'golo')) for el, d in st.items() if d[t]['golos'] > 0]
            if 5 <= len(g) <= 30: q(f'gol{t}', f'Um jogador que marcou pelo {tn} na Premier League {label}', sub + ' (autogolos não contam)', g)
            a = [(el, pl(d[t]['assist'], 'assistência')) for el, d in st.items() if d[t]['assist'] > 0]
            if 5 <= len(a) <= 30: q(f'ass{t}', f'Um jogador que fez uma assistência pelo {tn} na Premier League {label}', sub + ' (estatísticas oficiais da liga)', a)
            j = [(el, pl(d[t]['jogos'], 'jogo')) for el, d in st.items() if d[t]['jogos'] >= 25]
            if 5 <= len(j) <= 30: q(f'jog{t}', f'Um jogador que fez pelo menos 25 jogos pelo {tn} na Premier League {label}', sub + ' (titular ou suplente utilizado)', j)
        allg = [(el, pl(d['golos'], 'golo')) for el, d in tot.items() if d['golos'] >= 10]
        if len(allg) >= 5: q('g10', f'Um jogador que marcou 10 ou mais golos na Premier League {label}', sub, allg)
        alla = [(el, pl(d['assist'], 'assistência')) for el, d in tot.items() if d['assist'] >= 8]
        if len(alla) >= 5: q('a8', f'Um jogador com 8 ou mais assistências na Premier League {label}', sub + ' (estatísticas oficiais da liga)', alla)
        red = [(el, pl(d['red_cards'], 'vermelho')) for el, d in tot.items() if d['red_cards'] > 0]
        if len(red) >= 5: q('verm', f'Um jogador que foi expulso na Premier League {label}', sub + ' (cartão vermelho direto ou 2.º amarelo)', red)
        og = [(el, pl(d['own_goals'], 'autogolo')) for el, d in tot.items() if d['own_goals'] > 0]
        if len(og) >= 5: q('og', f'Um jogador que marcou um autogolo na Premier League {label}', sub, og)
        pm = [(el, f"{pl(d['penalties_missed'], 'penálti')} falhado{'s' if d['penalties_missed'] > 1 else ''}") for el, d in tot.items() if d['penalties_missed'] > 0]
        if len(pm) >= 5: q('penf', f'Um jogador que falhou um penálti na Premier League {label}', sub, pm)
        ht = [(el, 'hat-trick') for el in hat]
        if len(ht) >= 5: q('hat', f'Um jogador que marcou 3 ou mais golos num só jogo da Premier League {label}', sub, ht)
        gk = [(el, pl(d['clean_sheets'], 'jogo') + ' sem sofrer') for el, d in tot.items() if pos.get(el) == 1 and d['clean_sheets'] >= 10]
        if len(gk) >= 5: q('gk10', f'Um guarda-redes com 10 ou mais jogos sem sofrer golos na Premier League {label}', sub, gk)
        df = [(el, pl(d['golos'], 'golo')) for el, d in tot.items() if pos.get(el) == 2 and d['golos'] >= 3]
        if len(df) >= 5: q('def3', f'Um defesa que marcou 3 ou mais golos na Premier League {label}', sub + ' (posição oficial do jogador)', df)
        # clubes da época (os mais óbvios são os que somaram mais pontos FPL, ou seja, as equipas mais fortes)
        forca = defaultdict(int)
        for el, d in st.items():
            for t in d: forca[t] += d[t]['golos']
        clubs = sorted(teams, key=lambda t: -forca[t])
        perguntas.append({'id': f'h{label}-clubes', 'ep': label, 'tipo': 'clube', 'txt': f'Um clube que jogou na Premier League {label}', 'sub': 'As 20 equipas dessa época', 'r': [[teams[t], ''] for t in clubs]})
        # jogadores que marcaram contra cada um dos 6 grandes nesta época (muitas respostas)
        for adv, cnt in vs_grande.items():
            itens = [(el, f'{v} golo' + ('s' if v > 1 else '')) for el, v in cnt.items() if el in raw]
            if 5 <= len(itens) <= 45:
                q('vs-' + adv.replace(' ', ''), f'Um jogador que marcou contra o {adv} na Premier League {label}', f'Premier League {label} (autogolos não contam)', itens)
        print(label, len([x for x in perguntas if x['ep'] == label]), 'perguntas')
    # ---------- os últimos 10 anos juntos ----------
    ULT = f"{EPOCAS[0][:4]}/{EPOCAS[0][5:]} a {EPOCAS[-1][:4]}/{EPOCAS[-1][5:]}"
    def agreg(qid, txt, sub, itens):
        itens = sorted(itens, key=lambda x: -x[2])
        if 5 <= len(itens) <= 45: perguntas.append({'id': f'h10-{qid}', 'ep': '10anos', 'txt': txt, 'sub': sub, 'r': [[c, st] for c, st, _ in itens]})
    for lim in (40, 60, 80, 100):
        agreg(f'golos{lim}', f'Um jogador com pelo menos {lim} golos na Premier League nos últimos 10 anos', f'Épocas {ULT}', [(c, f"{v['golos']} golos", v['golos']) for c, v in soma.items() if v['golos'] >= lim])
    for lim in (30, 40, 50):
        agreg(f'assist{lim}', f'Um jogador com pelo menos {lim} assistências na Premier League nos últimos 10 anos', f'Épocas {ULT} (assistências oficiais da liga)', [(c, f"{v['assist']} assistências", v['assist']) for c, v in soma.items() if v['assist'] >= lim])
    ep20 = [(c, ', '.join(f"{k[5:]}: {v[k]}" for k in v if k.startswith('ep20:')), v['melhor']) for c, v in soma.items() if v['melhor'] >= 20]
    agreg('epoca20', 'Um jogador que marcou 20 ou mais golos numa só época da Premier League nos últimos 10 anos', f'Épocas {ULT}', ep20)
    for lim in (60, 50, 40):
        gr = [(c, f"{v['cs']} jogos sem sofrer", v['cs']) for c, v in soma.items() if pos_c.get(c) == 1 and v['cs'] >= lim]
        if 5 <= len(gr) <= 20: agreg(f'gr{lim}', f'Um guarda-redes com pelo menos {lim} jogos sem sofrer golos na Premier League nos últimos 10 anos', f'Épocas {ULT} (jogos em que jogou 60 minutos ou mais)', gr); break
    for clube, cnt in sorted(pelo.items()):
        for lim in (10, 15, 20, 25, 30, 40):   # o limite mais baixo que dê uma lista jeitosa (mais respostas = mais "Fora da Caixa")
            itens = [(c, f'{v} golos', v) for c, v in cnt.items() if v >= lim]
            if 5 <= len(itens) <= 20:
                agreg(f'pelo-{clube.replace(" ", "")}', f'Um jogador com pelo menos {lim} golos pelo {clube} na Premier League nos últimos 10 anos', f'Épocas {ULT} (só os golos pelo {clube})', itens); break
    print('últimos 10 anos:', len([q for q in perguntas if q['id'].startswith('h10-')]), 'perguntas')
    # clubes contra os quais cada um dos grandes marcadores marcou, em todas as épocas juntas (muitas respostas)
    PREST = {'Liverpool': 9, 'Manchester City': 9, 'Arsenal': 8, 'Chelsea': 8, 'Manchester United': 8, 'Tottenham': 7, 'Newcastle': 5, 'Everton': 5, 'West Ham': 4, 'Leicester': 4, 'Aston Villa': 4}
    for c, cnt in contra.items():
        if sum(cnt.values()) < 40 or len(cnt) < 12: continue
        first, second, web = nome_curto[c]
        nome = NOME_JOGADOR.get(c) or (web if first.split()[0] in web else f"{first.split()[0]} {web.split('.')[-1]}")
        r = sorted(cnt.items(), key=lambda x: (-x[1], -PREST.get(x[0], 0), x[0]))
        perguntas.append({'id': f'hcontra-{c}', 'ep': '2016-2025', 'tipo': 'clube', 'txt': f'Um clube contra o qual {nome} marcou na Premier League',
                          'sub': f'Épocas {EPOCAS[0][:4]}/{EPOCAS[0][5:]} a {EPOCAS[-1][:4]}/{EPOCAS[-1][5:]} (só jogos da Premier League)', 'r': [[t, f'{v} golo' + ('s' if v > 1 else '')] for t, v in r]})
        print(f'  contra: {nome} ({sum(cnt.values())} golos, {len(cnt)} clubes)')
    data = {'fonte': 'FPL oficial (arquivo vaastav/Fantasy-Premier-League)', 'jogadores': jogadores, 'perguntas': perguntas}
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8', newline='\n')
    print(f'historia.json: {len(perguntas)} perguntas, {len(jogadores)} jogadores ({OUT.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
