"""Perguntas sobre seleções (Mundiais, Europeus, Copa América e os jogos de Portugal) para o jogo "Fora da Caixa".
Fonte: martj42/international_results (todos os jogos de seleções desde 1872, com os marcadores; nas fases finais
de Mundiais, Europeus e Copa América todos os golos têm marcador — o script confirma isso antes de gerar).
Escreve selecoes.json. Correr outra vez depois de uma fase final ou no fim de cada ano (o Portugal-por-ano muda).
Uso (a partir da raiz):  python3 scripts/selecoes.py   ·   Windows: py -X utf8 scripts/selecoes.py"""
import csv, io, json, time, urllib.request
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'selecoes.json'
BASE = 'https://raw.githubusercontent.com/martj42/international_results/master'
UA = {'User-Agent': 'Mozilla/5.0', 'Accept': '*/*'}

PT = {'Albania': 'Albânia', 'Algeria': 'Argélia', 'Andorra': 'Andorra', 'Angola': 'Angola', 'Argentina': 'Argentina', 'Armenia': 'Arménia',
      'Australia': 'Austrália', 'Austria': 'Áustria', 'Azerbaijan': 'Azerbaijão', 'Belgium': 'Bélgica', 'Bolivia': 'Bolívia',
      'Bosnia and Herzegovina': 'Bósnia', 'Brazil': 'Brasil', 'Bulgaria': 'Bulgária', 'Cameroon': 'Camarões', 'Canada': 'Canadá',
      'Cape Verde': 'Cabo Verde', 'Chile': 'Chile', 'China': 'China', 'Colombia': 'Colômbia', 'Costa Rica': 'Costa Rica', 'Croatia': 'Croácia',
      'Cuba': 'Cuba', 'Curaçao': 'Curaçau', 'Cyprus': 'Chipre', 'Czech Republic': 'Chéquia', 'Czechoslovakia': 'Checoslováquia',
      'DR Congo': 'RD Congo', 'Denmark': 'Dinamarca', 'Ecuador': 'Equador', 'Egypt': 'Egito', 'El Salvador': 'El Salvador',
      'England': 'Inglaterra', 'Estonia': 'Estónia', 'Faroe Islands': 'Ilhas Faroé', 'Finland': 'Finlândia', 'France': 'França',
      'Gabon': 'Gabão', 'Georgia': 'Geórgia', 'German DR': 'RDA', 'Germany': 'Alemanha', 'Ghana': 'Gana', 'Gibraltar': 'Gibraltar',
      'Greece': 'Grécia', 'Haiti': 'Haiti', 'Honduras': 'Honduras', 'Hungary': 'Hungria', 'Iceland': 'Islândia', 'Indonesia': 'Indonésia',
      'Iran': 'Irão', 'Iraq': 'Iraque', 'Israel': 'Israel', 'Italy': 'Itália', 'Ivory Coast': 'Costa do Marfim', 'Jamaica': 'Jamaica',
      'Japan': 'Japão', 'Jordan': 'Jordânia', 'Kazakhstan': 'Cazaquistão', 'Kuwait': 'Kuwait', 'Latvia': 'Letónia', 'Liechtenstein': 'Listenstaine',
      'Lithuania': 'Lituânia', 'Luxembourg': 'Luxemburgo', 'Malta': 'Malta', 'Mexico': 'México', 'Moldova': 'Moldávia', 'Morocco': 'Marrocos',
      'Mozambique': 'Moçambique', 'Netherlands': 'Países Baixos', 'New Zealand': 'Nova Zelândia', 'Nigeria': 'Nigéria', 'North Korea': 'Coreia do Norte',
      'North Macedonia': 'Macedónia do Norte', 'Northern Ireland': 'Irlanda do Norte', 'Norway': 'Noruega', 'Panama': 'Panamá', 'Paraguay': 'Paraguai',
      'Peru': 'Peru', 'Poland': 'Polónia', 'Portugal': 'Portugal', 'Qatar': 'Catar', 'Republic of Ireland': 'Irlanda', 'Romania': 'Roménia',
      'Russia': 'Rússia', 'Saudi Arabia': 'Arábia Saudita', 'Scotland': 'Escócia', 'Senegal': 'Senegal', 'Serbia': 'Sérvia', 'Slovakia': 'Eslováquia',
      'Slovenia': 'Eslovénia', 'South Africa': 'África do Sul', 'South Korea': 'Coreia do Sul', 'Spain': 'Espanha', 'Sweden': 'Suécia',
      'Switzerland': 'Suíça', 'Togo': 'Togo', 'Trinidad and Tobago': 'Trindade e Tobago', 'Tunisia': 'Tunísia', 'Turkey': 'Turquia',
      'Ukraine': 'Ucrânia', 'United Arab Emirates': 'Emirados Árabes Unidos', 'United States': 'Estados Unidos', 'Uruguay': 'Uruguai',
      'Uzbekistan': 'Usbequistão', 'Venezuela': 'Venezuela', 'Wales': 'País de Gales', 'Yugoslavia': 'Jugoslávia',
      'Belarus': 'Bielorrússia', 'Montenegro': 'Montenegro', 'Kosovo': 'Kosovo', 'San Marino': 'São Marinho', 'Mali': 'Mali',
      'Guinea-Bissau': 'Guiné-Bissau', 'São Tomé and Príncipe': 'São Tomé e Príncipe', 'East Timor': 'Timor-Leste'}
# o mesmo nome da base de dados com outro país conforme a época
def pais(t, date):
    if t == 'Russia' and date < '1992': return 'União Soviética'
    if t == 'Serbia' and '2003' <= date < '2006-07-15': return 'Sérvia e Montenegro'
    if t == 'Czech Republic' and date < '1993': return 'Checoslováquia'
    return PT.get(t)

# nomes de jogadores escritos como no resto do jogo
NOMES = {'Eder': 'Éder', 'Eusebio': 'Eusébio', 'Pepe': 'Pepe', 'Ronaldo': 'Ronaldo Nazário'}
# marcadores por seleção só em fases finais recentes e de seleções conhecidas (as antigas têm perguntas gerais, ver 6)
CONHECIDAS = {'Portugal', 'Brasil', 'Argentina', 'Alemanha', 'França', 'Espanha', 'Itália', 'Inglaterra', 'Países Baixos', 'Bélgica', 'Croácia',
              'Uruguai', 'Suíça', 'Dinamarca', 'Suécia', 'Polónia', 'México', 'Estados Unidos', 'Colômbia', 'Marrocos', 'Japão', 'Coreia do Sul',
              'Senegal', 'Gana', 'Chile', 'Rússia', 'Turquia', 'Grécia', 'Áustria', 'Escócia', 'País de Gales', 'Sérvia', 'Ucrânia', 'Chéquia', 'República Checa'}
def recente(tour, ano, p):
    if tour == 'FIFA World Cup': return ano >= '2002' and p in CONHECIDAS
    if tour == 'UEFA Euro': return ano >= '2004' and p in CONHECIDAS
    return ano >= '2015' and p in ('Brasil', 'Argentina')   # Copa América
# participantes destas fases finais já estão escritos à mão em perguntas2.js
JA_ESCRITAS = {('FIFA World Cup', '2010'), ('FIFA World Cup', '2014'), ('FIFA World Cup', '2018'), ('FIFA World Cup', '2022'), ('UEFA Euro', '2016'), ('UEFA Euro', '2021'), ('UEFA Euro', '2024')}
TORNEIOS = {'FIFA World Cup': 'Mundial', 'UEFA Euro': 'Euro', 'Copa América': 'Copa América'}
def edicao(tour, year):
    if tour == 'UEFA Euro' and year == '2021': return 'Euro 2020', ' (jogado em 2021)'
    return f'{TORNEIOS[tour]} {year}', ''
def do_(p):   # "pela França", "pelo Brasil", "por Portugal"
    sem = {'Portugal', 'Angola', 'Cuba', 'Israel', 'Malta', 'Andorra', 'Mali', 'Moçambique', 'Montenegro', 'Kosovo', 'Gibraltar', 'Chipre', 'Timor-Leste', 'Cabo Verde', 'São Marinho', 'Curaçau', 'Haiti', 'Honduras', 'Marrocos', 'Camarões', 'El Salvador', 'Trindade e Tobago', 'São Tomé e Príncipe', 'Ilhas Faroé', 'Emirados Árabes Unidos', 'Estados Unidos', 'Países Baixos'}
    plural = {'Estados Unidos': 'pelos', 'Países Baixos': 'pelos', 'Emirados Árabes Unidos': 'pelos', 'Camarões': 'pelos', 'Ilhas Faroé': 'pelas'}
    if p in plural: return f'{plural[p]} {p}'
    if p in sem: return f'por {p}'
    fem = p.endswith('a') or p.endswith('ia') or p in ('Grécia', 'Croácia', 'Suíça', 'Irlanda', 'Escócia', 'Turquia', 'Hungria', 'Itália', 'Argélia', 'Chéquia', 'Costa do Marfim', 'Coreia do Sul', 'Coreia do Norte', 'Nova Zelândia', 'Jugoslávia', 'Checoslováquia', 'União Soviética', 'RDA', 'Irlanda do Norte', 'Macedónia do Norte', 'Arábia Saudita', 'Áustria', 'Bósnia', 'África do Sul', 'Sérvia e Montenegro', 'RD Congo', 'Tunísia', 'Nigéria')
    if p in ('Canadá', 'Panamá', 'Peru', 'Paraguai', 'Uruguai', 'Brasil', 'Chile', 'Equador', 'Japão', 'Irão', 'Iraque', 'Egito', 'México', 'Senegal', 'Gana', 'Catar', 'Kuwait', 'País de Gales', 'Togo', 'Gabão', 'Luxemburgo', 'Usbequistão', 'Azerbaijão', 'Cazaquistão', 'Listenstaine'): fem = False
    return ('pela ' if fem else 'pelo ') + p


def get(url):
    for k in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180) as r: return r.read().decode('utf-8')
        except Exception as e:
            if k == 3: raise RuntimeError(f'falhou {url}: {e}')
            time.sleep(3 + 4 * k)


def main():
    R = list(csv.DictReader(io.StringIO(get(f'{BASE}/results.csv'))))
    G = list(csv.DictReader(io.StringIO(get(f'{BASE}/goalscorers.csv'))))
    R = [r for r in R if r['home_score'] not in ('', 'NA')]
    key = lambda r: (r['date'], r['home_team'], r['away_team'])
    gk = Counter(key(g) for g in G)
    for tour in TORNEIOS:   # só se os marcadores estiverem completos
        ms = [r for r in R if r['tournament'] == tour]
        assert all(gk[key(r)] == int(r['home_score']) + int(r['away_score']) for r in ms), f'marcadores incompletos em {tour}'
    match = {key(r): r for r in R}
    # fama: jogadores pelos golos em fases finais; seleções pelos jogos em fases finais
    fama_j = Counter(NOMES.get(g['scorer'], g['scorer']) for g in G if g['own_goal'] != 'TRUE' and match.get(key(g), {}).get('tournament') in TORNEIOS)
    fama_p = Counter()
    for r in R:
        if r['tournament'] in TORNEIOS:
            for t in (r['home_team'], r['away_team']): fama_p[pais(t, r['date'])] += {'FIFA World Cup': 3, 'UEFA Euro': 2, 'Copa América': 1}[r['tournament']]
    perguntas = []
    def add(pid, cat, tipo, txt, sub, itens, mn=4, mx=45):
        if not (mn <= len(itens) <= mx): return
        fama = fama_j if tipo == 'jogador' else fama_p
        itens = sorted(itens, key=lambda x: (-x[2], -fama[x[0]], x[0]))
        perguntas.append({'id': pid, 'cat': cat, 'tipo': tipo, 'txt': txt, 'sub': sub, 'r': [[n, s] for n, s, _ in itens]})

    # 1. marcadores de cada seleção em cada fase final
    golos = defaultdict(Counter)   # (torneio, ano, seleção) -> jogador -> golos
    for g in G:
        m = match.get(key(g))
        if not m or m['tournament'] not in TORNEIOS or g['own_goal'] == 'TRUE': continue
        p = pais(g['team'], g['date'])
        if p: golos[(m['tournament'], m['date'][:4], p)][NOMES.get(g['scorer'], g['scorer'])] += 1
    for (tour, ano, p), c in sorted(golos.items()):
        if not recente(tour, ano, p): continue   # nas fases finais antigas ninguém sabe quem marcou pela Coreia: ver as perguntas gerais (6)
        ed, nota = edicao(tour, ano)
        itens = [(n, f'{v} golo' + ('s' if v > 1 else ''), v) for n, v in c.items()]
        add(f's-{tour[:4]}-{ano}-{p}', 'portugal' if p == 'Portugal' else 'mundo', 'jogador', f'Um jogador que marcou {do_(p)} {"na" if tour == "Copa América" else "no"} {ed}', f'Golos na fase final{nota} (autogolos não contam)', itens, mn=2 if p == 'Portugal' else 4)
    # 2. Portugal: marcadores em todos os Mundiais / todos os Europeus
    for tour in ('FIFA World Cup', 'UEFA Euro'):
        c = Counter()
        for (t, ano, p), cc in golos.items():
            if t == tour and p == 'Portugal': c.update(cc)
        nome = 'num Mundial' if tour == 'FIFA World Cup' else 'num Europeu'
        add(f's-pt-{tour[:4]}-todos', 'portugal', 'jogador', f'Um jogador que marcou por Portugal {nome}', 'Fases finais, de sempre (autogolos não contam)', [(n, f'{v} golo' + ('s' if v > 1 else ''), v) for n, v in c.items()], mx=60)
    # 3. seleções que cada uma das grandes defrontou / venceu em fases finais
    grandes = ['Brasil', 'Alemanha', 'Argentina', 'Itália', 'França', 'Espanha', 'Inglaterra', 'Países Baixos', 'Uruguai', 'Portugal', 'Bélgica', 'Croácia']
    for tour in ('FIFA World Cup', 'UEFA Euro'):
        nome = 'num Mundial' if tour == 'FIFA World Cup' else 'num Europeu'
        for gp in grandes:
            ven = Counter(); per = Counter()
            for r in R:
                if r['tournament'] != tour: continue
                h, a = pais(r['home_team'], r['date']), pais(r['away_team'], r['date']); hs, as_ = int(r['home_score']), int(r['away_score'])
                if gp not in (h, a) or None in (h, a): continue
                adv = a if h == gp else h; meu, dele = (hs, as_) if h == gp else (as_, hs)
                if meu > dele: ven[adv] += 1
                if meu < dele: per[adv] += 1
            cat = 'portugal' if gp == 'Portugal' else 'mundo'
            pre = 'a ' if gp in ('Alemanha', 'Argentina', 'Itália', 'França', 'Espanha', 'Inglaterra', 'Bélgica', 'Croácia') else 'o ' if gp in ('Brasil', 'Uruguai') else 'os ' if gp == 'Países Baixos' else ''
            add(f's-ven-{tour[:4]}-{gp}', cat, 'pais', f'Uma seleção que {pre}{gp} venceu {nome}', 'Fases finais, de sempre (prolongamento conta; desempates por penáltis não contam como vitória)', [(n, f'{v} vitória' + ('s' if v > 1 else ''), v) for n, v in ven.items()], mx=50)
            add(f's-per-{tour[:4]}-{gp}', cat, 'pais', f'Uma seleção que venceu {pre}{gp} {nome}', 'Fases finais, de sempre (prolongamento conta; desempates por penáltis não contam como vitória)', [(n, f'{v} vez' + ('es' if v > 1 else ''), v) for n, v in per.items()], mn=3, mx=50)
    # 4. Portugal ano a ano: seleções que venceu e que defrontou (todos os jogos, incluindo particulares)
    for ano in range(1990, int(max(r['date'] for r in R)[:4]) + 1):
        ven, jog = Counter(), Counter()
        for r in R:
            if not r['date'].startswith(str(ano)) or 'Portugal' not in (r['home_team'], r['away_team']): continue
            h, a = r['home_team'], r['away_team']; adv = pais(a if h == 'Portugal' else h, r['date'])
            if not adv: continue
            meu, dele = (int(r['home_score']), int(r['away_score'])) if h == 'Portugal' else (int(r['away_score']), int(r['home_score']))
            jog[adv] += 1
            if meu > dele: ven[adv] += 1
        add(f's-pt-ven-{ano}', 'portugal', 'pais', f'Uma seleção que Portugal venceu em {ano}', 'Todos os jogos desse ano, incluindo particulares', [(n, f'{v} vitória' + ('s' if v > 1 else ''), v) for n, v in ven.items()], mn=3)
        add(f's-pt-jog-{ano}', 'portugal', 'pais', f'Uma seleção que Portugal defrontou em {ano}', 'Todos os jogos desse ano, incluindo particulares', [(n, f'{v} jogo' + ('s' if v > 1 else ''), v) for n, v in jog.items()], mn=5)
    # 5. participantes de cada fase final (que ainda não estão escritas à mão)
    for tour in TORNEIOS:
        for ano in sorted({r['date'][:4] for r in R if r['tournament'] == tour}):
            if tour == 'Copa América' and ano < '2015': continue
            ps = Counter()
            for r in R:
                if r['tournament'] == tour and r['date'].startswith(ano):
                    for t in (r['home_team'], r['away_team']): ps[pais(t, r['date'])] += 1
            if None in ps or (tour, ano) in JA_ESCRITAS: continue
            ed, nota = edicao(tour, ano)
            add(f's-part-{tour[:4]}-{ano}', 'mundo', 'pais', f'Uma seleção que jogou {"a" if tour == "Copa América" else "o"} {ed}', f'As seleções da fase final{nota}', [(n, f'{v} jogo' + ('s' if v > 1 else ''), fama_p[n]) for n, v in ps.items()], mn=4, mx=48)
    # 6. fases finais antigas: perguntas gerais (nomes famosos, não marcadores de cada seleção)
    for tour in ('FIFA World Cup', 'UEFA Euro'):
        anos = sorted({r['date'][:4] for r in R if r['tournament'] == tour})
        for ano in anos:
            ed, nota = edicao(tour, ano)
            ms = [r for r in R if r['tournament'] == tour and r['date'].startswith(ano)]
            ven = Counter()
            for r in ms:
                hs, as_ = int(r['home_score']), int(r['away_score'])
                if hs != as_: ven[pais(r['home_team'] if hs > as_ else r['away_team'], r['date'])] += 1
            if None not in ven:
                add(f's-ganhou-{tour[:4]}-{ano}', 'mundo', 'pais', f'Uma seleção que ganhou pelo menos um jogo no {ed}', f'Fase final{nota} (desempates por penáltis não contam)', [(n, f'{v} vitória' + ('s' if v > 1 else ''), fama_p[n]) for n, v in ven.items()], mn=4, mx=26)
            tot = Counter()
            for (t, a, p), c in golos.items():
                if t == tour and a == ano:
                    for n, v in c.items(): tot[(n, p)] += v
            for lim in (4, 3):
                top = [(n, f'{v} golos · {p}', v) for (n, p), v in tot.items() if v >= lim]
                if 3 <= len(top) <= 14:
                    add(f's-top-{tour[:4]}-{ano}', 'mundo', 'jogador', f'Um jogador que marcou {lim} ou mais golos no {ed}', f'Fase final{nota} (autogolos não contam)', top, mn=3, mx=14); break
    data = {'fonte': 'martj42/international_results', 'perguntas': perguntas}
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8', newline='\n')
    print(f'selecoes.json: {len(perguntas)} perguntas ({OUT.stat().st_size // 1024} KB)', Counter(q["cat"] for q in perguntas))


if __name__ == '__main__':
    main()
