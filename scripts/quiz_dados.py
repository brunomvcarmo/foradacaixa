"""Perguntas da Premier League do jogo "Fora da Caixa": estatísticas da época de todos os jogadores.
Descarrega os CSV públicos do projeto FPL-Elo-Insights (cópia das estatísticas oficiais da Premier League)
e escreve dados.json (compacto). Corre sozinho na GitHub Action .github/workflows/dados.yml.
Uso (a partir da raiz):  Linux/Mac: python3 scripts/quiz_dados.py   ·   Windows: py -X utf8 scripts/quiz_dados.py"""
import csv, io, json, sys, time, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dados.json'
REPO = 'https://raw.githubusercontent.com/olbauday/FPL-Elo-Insights/main/data'
UA = {'User-Agent': 'Mozilla/5.0 (fpl-app)', 'Accept': '*/*'}
POS = {'Goalkeeper': 'gk', 'Defender': 'def', 'Midfielder': 'mid', 'Forward': 'fwd'}


def season():
    """Época atual (a partir de julho conta a nova); se ainda não houver dados dela, fica a anterior."""
    now = datetime.now(timezone.utc); y = now.year if now.month >= 7 else now.year - 1
    for a in (y, y - 1):
        try:
            urllib.request.urlopen(urllib.request.Request(f'{REPO}/{a}-{a + 1}/teams.csv', headers=UA), timeout=60).read(100)
            return a
        except Exception:
            continue
    raise RuntimeError('não encontrei os dados da época')


def csv_rows(base, name):
    for k in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(f'{base}/{name}.csv', headers=UA), timeout=120) as r:
                return list(csv.DictReader(io.StringIO(r.read().decode('utf-8'))))
        except Exception as e:
            if k == 3: raise RuntimeError(f'falhou {name}.csv: {e}')
            time.sleep(3 + 4 * k)


def num(x):
    try: return float(x)
    except (TypeError, ValueError): return 0.0


def main():
    y = season(); base = f'{REPO}/{y}-{y + 1}'
    teams = {t['code']: t for t in csv_rows(base, 'teams')}
    team_id = {code: int(t['id']) for code, t in teams.items()}
    players = {int(p['player_id']): p for p in csv_rows(base, 'players')}
    stats = csv_rows(base, 'playerstats')
    gws = sorted({int(r['gw']) for r in stats if r.get('gw')})
    last = gws[-1] if gws else 0
    by = {}
    for r in stats:   # valores acumulados da época, uma linha por jornada
        by.setdefault(int(r['id']), {})[int(r['gw'])] = r
    keys = ['goals_scored', 'assists', 'total_points', 'minutes', 'clean_sheets']
    out = []
    for pid, rows in sorted(by.items()):
        p = players.get(pid)
        if not p or p.get('team_code') not in team_id: continue
        cur = rows[max(rows)]
        series = {k: [] for k in keys}
        prev = {k: 0 for k in keys}
        for g in range(1, last + 1):
            r = rows.get(g)
            for k in keys:
                v = int(num(r[k])) if r else prev[k]
                series[k].append(v - prev[k]); prev[k] = v
        out.append([
            pid, cur['web_name'], f"{p['first_name']} {p['second_name']}".strip(), team_id[p['team_code']], POS.get(p['position'], 'mid'),
            round(num(cur['selected_by_percent']), 1), round(num(cur['now_cost']), 1),
            int(num(cur['minutes'])), int(num(cur['starts'])), int(num(cur['total_points'])),
            int(num(cur['goals_scored'])), int(num(cur['assists'])), int(num(cur['clean_sheets'])),
            int(num(cur['yellow_cards'])), int(num(cur['red_cards'])), int(num(cur['saves'])),
            int(num(cur['penalties_saved'])), int(num(cur['penalties_missed'])), int(num(cur['own_goals'])), int(num(cur['bonus'])),
            series['goals_scored'], series['assists'], series['total_points'], series['minutes'],
        ])
    data = {
        'gerado': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%MZ'),
        'epoca': f'{y}/{(y + 1) % 100:02d}',
        'jornada': last,
        'equipas': {int(t['id']): [t['name'], t['short_name']] for t in teams.values()},
        'campos': ['id', 'nome', 'completo', 'equipa', 'pos', 'popular', 'preco', 'minutos', 'titular', 'pontos',
                   'golos', 'assist', 'cs', 'amarelos', 'vermelhos', 'defesas', 'penDef', 'penFalh', 'autogolos', 'bonus',
                   'jGolos', 'jAssist', 'jPontos', 'jMinutos'],
        'jogadores': out,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8', newline='\n')
    print(f'dados.json: época {y}/{y + 1}, {len(out)} jogadores, até à J{last} ({OUT.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
