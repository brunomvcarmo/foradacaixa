"""Fora da Caixa — perguntas tiradas de listas completas da Wikipédia inglesa → listas.json.

- golos: jogadores com 100 ou mais golos na Premier League, Liga espanhola, Serie A, Bundesliga e Ligue 1 (listas "100 or more");
- internacionalizações: jogadores com 100 ou mais jogos pela seleção (List of men's footballers with 100 or more international caps);
- Benfica e FC Porto: jogadores com 100 ou mais jogos oficiais (List of S.L. Benfica players / List of FC Porto players);
- competições europeias: clubes de cada país que jogaram a fase principal da Liga dos Campeões (desde 1992/93) e da Liga Europa (desde 2009/10)
  (as páginas "clubs performance comparison": não contam as pré-eliminatórias);
- vice-campeões de Portugal, Espanha, Inglaterra, Itália, Alemanha (Bundesliga) e França (Ligue 1);
- equipa do ano da Premier League (PFA Team of the Year) por posição e por década.
As páginas ficam guardadas em /tmp/fdc-wiki (scripts/wiki.py). Uso: python3 scripts/wikilistas.py
"""
import json, os, re, sys
from collections import defaultdict
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wiki
from wiki import limpa, tabelas, wikitext

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(AQUI, '..', 'listas.json')
DATA = 'novembro de 2026'
SUBW = f'Segundo a Wikipédia ({DATA})'

# nomes dos clubes como no resto do jogo
CLUBE = {
    'Sporting CP': 'Sporting', 'Sporting Clube de Portugal': 'Sporting', 'Porto': 'FC Porto', 'F.C. Porto': 'FC Porto', 'S.C. Braga': 'Braga', 'Sporting de Braga': 'Braga',
    'Vitória de Guimarães': 'Vitória de Guimarães', 'Vitória S.C.': 'Vitória de Guimarães', 'Vitória de Setúbal': 'Vitória de Setúbal', 'Belenenses': 'Belenenses',
    'C.F. Os Belenenses': 'Belenenses', 'Boavista F.C.': 'Boavista', 'Académica de Coimbra': 'Académica', 'Académica': 'Académica', 'Marítimo': 'Marítimo',
    'Nacional': 'Nacional', 'Paços de Ferreira': 'Paços de Ferreira', 'Rio Ave': 'Rio Ave', 'Estoril': 'Estoril', 'Gil Vicente': 'Gil Vicente', 'Arouca': 'Arouca',
    'Atlético Madrid': 'Atlético de Madrid', 'Athletic Bilbao': 'Athletic Bilbao', 'Sevilla': 'Sevilha', 'Valencia': 'Valência', 'Real Betis': 'Betis',
    'Deportivo La Coruña': 'Deportivo da Corunha', 'Celta Vigo': 'Celta de Vigo', 'Espanyol': 'Espanyol', 'Madrid FC': 'Real Madrid', 'Madrid': 'Real Madrid',
    'Racing Santander': 'Racing de Santander', 'Real Zaragoza': 'Zaragoza', 'Sporting Gijón': 'Sporting de Gijón', 'Real Oviedo': 'Oviedo',
    'Internazionale': 'Inter', 'Inter Milan': 'Inter', 'Ambrosiana-Inter': 'Inter', 'Ambrosiana': 'Inter', 'AC Milan': 'Milan', 'Milan': 'Milan',
    'Juventus': 'Juventus', 'Roma': 'Roma', 'Lazio': 'Lazio', 'Napoli': 'Napoli', 'Fiorentina': 'Fiorentina', 'Torino': 'Torino', 'Sampdoria': 'Sampdoria',
    'Bayern Munich': 'Bayern', 'FC Bayern Munich': 'Bayern', 'Borussia Dortmund': 'Borussia Dortmund', 'Bayer Leverkusen': 'Bayer Leverkusen',
    'Borussia Mönchengladbach': 'Borussia Mönchengladbach', 'Schalke 04': 'Schalke 04', 'FC Schalke 04': 'Schalke 04', 'VfB Stuttgart': 'Estugarda',
    'Werder Bremen': 'Werder Bremen', 'Hamburger SV': 'Hamburgo', '1. FC Köln': 'Colónia', 'Köln': 'Colónia', 'VfL Wolfsburg': 'Wolfsburgo', 'Wolfsburg': 'Wolfsburgo',
    'RB Leipzig': 'RB Leipzig', 'Eintracht Frankfurt': 'Eintracht Frankfurt', 'Hertha BSC': 'Hertha Berlim', '1. FC Kaiserslautern': 'Kaiserslautern',
    'Kaiserslautern': 'Kaiserslautern', '1. FC Nürnberg': 'Nuremberga', 'Nuremberg': 'Nuremberga', 'TSV 1860 Munich': '1860 Munique', 'MSV Duisburg': 'Duisburg',
    'Paris Saint-Germain': 'PSG', 'Marseille': 'Marseille', 'Olympique de Marseille': 'Marseille', 'Lyon': 'Lyon', 'Olympique Lyonnais': 'Lyon', 'Monaco': 'Monaco',
    'AS Monaco': 'Monaco', 'Lille': 'Lille', 'Nice': 'Nice', 'Bordeaux': 'Bordeaux', 'Saint-Étienne': 'Saint-Étienne', 'Nantes': 'Nantes', 'Rennes': 'Rennes',
    'Lens': 'Lens', 'Strasbourg': 'Strasbourg', 'Reims': 'Reims', 'Stade de Reims': 'Reims', 'Toulouse': 'Toulouse', 'Montpellier': 'Montpellier', 'Auxerre': 'Auxerre',
    'Manchester United': 'Manchester United', 'Manchester City': 'Manchester City', 'Liverpool': 'Liverpool', 'Chelsea': 'Chelsea', 'Arsenal': 'Arsenal',
    'Tottenham Hotspur': 'Tottenham', 'Newcastle United': 'Newcastle', 'Wolverhampton Wanderers': 'Wolverhampton', 'Leicester City': 'Leicester',
    'Leeds United': 'Leeds', 'West Ham United': 'West Ham', 'Everton': 'Everton', 'Aston Villa': 'Aston Villa', 'Blackburn Rovers': 'Blackburn Rovers',
    'Nottingham Forest': 'Nottingham Forest', 'Ipswich Town': 'Ipswich Town', 'Southampton': 'Southampton', 'Derby County': 'Derby County',
    'Ajax': 'Ajax', 'AFC Ajax': 'Ajax', 'PSV Eindhoven': 'PSV', 'PSV': 'PSV', 'Feyenoord': 'Feyenoord', 'AZ': 'AZ Alkmaar', 'AZ Alkmaar': 'AZ Alkmaar',
    'Galatasaray': 'Galatasaray', 'Fenerbahçe': 'Fenerbahçe', 'Beşiktaş': 'Beşiktaş', 'Trabzonspor': 'Trabzonspor', 'İstanbul Başakşehir': 'İstanbul Başakşehir',
    'Basel': 'Basileia', 'Celtic': 'Celtic', 'Rangers': 'Rangers', 'Club Brugge': 'Club Brugge', 'Anderlecht': 'Anderlecht', 'Olympiacos': 'Olympiacos',
    'Panathinaikos': 'Panathinaikos', 'AEK Athens': 'AEK Atenas', 'PAOK': 'PAOK', 'Shakhtar Donetsk': 'Shakhtar Donetsk', 'Dynamo Kyiv': 'Dínamo de Kiev',
    'Red Bull Salzburg': 'Salzburgo', 'TSG Hoffenheim': 'Hoffenheim', 'Hoffenheim': 'Hoffenheim', 'Deportivo A Coruña': 'Deportivo da Corunha', 'Atlético Aviación': 'Atlético de Madrid', 'FC Augsburg': 'Augsburg', 'SC Freiburg': 'Freiburg', 'Mainz 05': 'Mainz', 'Union Berlin': 'Union Berlim', 'Antwerp': 'Antuérpia', 'Brighton & Hove Albion': 'Brighton', 'Copenhagen': 'Copenhaga', 'Legia Warsaw': 'Legia Varsóvia', 'Dynamo Moscow': 'Dínamo de Moscovo', 'Lokomotiv Moscow': 'Lokomotiv Moscovo', 'Meidericher SV': 'Duisburg', 'Zenit Saint Petersburg': 'Zenit', 'CSKA Moscow': 'CSKA Moscovo', 'Spartak Moscow': 'Spartak Moscovo',
}


def clube(nm):
    nm = re.sub(r'\s*\(\d+\)\s*$', '', limpa(nm)).strip()
    return CLUBE.get(nm, nm)


def num(c):
    m = re.match(r'\s*(\d+)', limpa(c))
    return int(m.group(1)) if m else None


def pais(c):
    m = re.search(r'\{\{(?:fb|flagicon|flag|fbicon|flagathlete|fb-rt|nft)\|([A-Z]{3})', c)
    return m.group(1) if m else None


PAIS = {   # código FIFA → (nome, adjetivo, "da seleção de …")
    'POR': ('Portugal', 'português', 'de Portugal'), 'ESP': ('Espanha', 'espanhol', 'de Espanha'), 'ENG': ('Inglaterra', 'inglês', 'de Inglaterra'),
    'ITA': ('Itália', 'italiano', 'de Itália'), 'GER': ('Alemanha', 'alemão', 'da Alemanha'), 'FRA': ('França', 'francês', 'de França'),
    'NED': ('Países Baixos', 'neerlandês', 'dos Países Baixos'), 'BEL': ('Bélgica', 'belga', 'da Bélgica'), 'BRA': ('Brasil', 'brasileiro', 'do Brasil'),
    'ARG': ('Argentina', 'argentino', 'da Argentina'), 'URU': ('Uruguai', 'uruguaio', 'do Uruguai'), 'MEX': ('México', 'mexicano', 'do México'),
    'USA': ('Estados Unidos', 'norte-americano', 'dos Estados Unidos'), 'CRO': ('Croácia', 'croata', 'da Croácia'), 'SRB': ('Sérvia', 'sérvio', 'da Sérvia'),
    'DEN': ('Dinamarca', 'dinamarquês', 'da Dinamarca'), 'SWE': ('Suécia', 'sueco', 'da Suécia'), 'NOR': ('Noruega', 'norueguês', 'da Noruega'),
    'POL': ('Polónia', 'polaco', 'da Polónia'), 'SUI': ('Suíça', 'suíço', 'da Suíça'), 'AUT': ('Áustria', 'austríaco', 'da Áustria'),
    'SCO': ('Escócia', 'escocês', 'da Escócia'), 'WAL': ('País de Gales', 'galês', 'do País de Gales'), 'IRL': ('Irlanda', 'irlandês', 'da Irlanda'),
    'NIR': ('Irlanda do Norte', 'norte-irlandês', 'da Irlanda do Norte'), 'GRE': ('Grécia', 'grego', 'da Grécia'), 'TUR': ('Turquia', 'turco', 'da Turquia'),
    'RUS': ('Rússia', 'russo', 'da Rússia'), 'UKR': ('Ucrânia', 'ucraniano', 'da Ucrânia'), 'CZE': ('Chéquia', 'checo', 'da Chéquia'),
    'SVK': ('Eslováquia', 'eslovaco', 'da Eslováquia'), 'SVN': ('Eslovénia', 'esloveno', 'da Eslovénia'), 'HUN': ('Hungria', 'húngaro', 'da Hungria'),
    'ROU': ('Roménia', 'romeno', 'da Roménia'), 'BUL': ('Bulgária', 'búlgaro', 'da Bulgária'), 'FIN': ('Finlândia', 'finlandês', 'da Finlândia'),
    'ISL': ('Islândia', 'islandês', 'da Islândia'), 'ISR': ('Israel', 'israelita', 'de Israel'), 'CHI': ('Chile', 'chileno', 'do Chile'),
    'COL': ('Colômbia', 'colombiano', 'da Colômbia'), 'PAR': ('Paraguai', 'paraguaio', 'do Paraguai'), 'PER': ('Peru', 'peruano', 'do Peru'),
    'ECU': ('Equador', 'equatoriano', 'do Equador'), 'VEN': ('Venezuela', 'venezuelano', 'da Venezuela'), 'BOL': ('Bolívia', 'boliviano', 'da Bolívia'),
    'JPN': ('Japão', 'japonês', 'do Japão'), 'KOR': ('Coreia do Sul', 'sul-coreano', 'da Coreia do Sul'), 'AUS': ('Austrália', 'australiano', 'da Austrália'),
    'KSA': ('Arábia Saudita', 'saudita', 'da Arábia Saudita'), 'IRN': ('Irão', 'iraniano', 'do Irão'), 'EGY': ('Egito', 'egípcio', 'do Egito'),
    'NGA': ('Nigéria', 'nigeriano', 'da Nigéria'), 'CMR': ('Camarões', 'camaronês', 'dos Camarões'), 'CIV': ('Costa do Marfim', 'costa-marfinense', 'da Costa do Marfim'),
    'GHA': ('Gana', 'ganês', 'do Gana'), 'SEN': ('Senegal', 'senegalês', 'do Senegal'), 'MAR': ('Marrocos', 'marroquino', 'de Marrocos'),
    'ALG': ('Argélia', 'argelino', 'da Argélia'), 'TUN': ('Tunísia', 'tunisino', 'da Tunísia'), 'RSA': ('África do Sul', 'sul-africano', 'da África do Sul'),
    'FRY': ('Jugoslávia', 'jugoslavo', 'da Jugoslávia'), 'YUG': ('Jugoslávia', 'jugoslavo', 'da Jugoslávia'), 'URS': ('União Soviética', 'soviético', 'da União Soviética'),
    'TCH': ('Checoslováquia', 'checoslovaco', 'da Checoslováquia'), 'SCG': ('Sérvia e Montenegro', 'sérvio', 'da Sérvia e Montenegro'), 'FRG': ('Alemanha', 'alemão', 'da Alemanha'),
    'CAN': ('Canadá', 'canadiano', 'do Canadá'), 'CRC': ('Costa Rica', 'costa-riquenho', 'da Costa Rica'), 'ANG': ('Angola', 'angolano', 'de Angola'),
    'CPV': ('Cabo Verde', 'cabo-verdiano', 'de Cabo Verde'), 'BIH': ('Bósnia e Herzegovina', 'bósnio', 'da Bósnia e Herzegovina'),
    'MKD': ('Macedónia do Norte', 'macedónio', 'da Macedónia do Norte'), 'MNE': ('Montenegro', 'montenegrino', 'do Montenegro'),
    'ALB': ('Albânia', 'albanês', 'da Albânia'), 'GEO': ('Geórgia', 'georgiano', 'da Geórgia'), 'LUX': ('Luxemburgo', 'luxemburguês', 'do Luxemburgo'),
    'CYP': ('Chipre', 'cipriota', 'do Chipre'), 'EST': ('Estónia', 'estónio', 'da Estónia'), 'LVA': ('Letónia', 'letão', 'da Letónia'), 'LTU': ('Lituânia', 'lituano', 'da Lituânia'),
}
PAISES_UP = {'SPAIN': 'ESP', 'ENGLAND': 'ENG', 'ITALY': 'ITA', 'GERMANY': 'GER', 'FRANCE': 'FRA', 'PORTUGAL': 'POR', 'NETHERLANDS': 'NED', 'BELGIUM': 'BEL',
             'TURKEY': 'TUR', 'GREECE': 'GRE', 'RUSSIA': 'RUS', 'UKRAINE': 'UKR', 'SCOTLAND': 'SCO', 'SWITZERLAND': 'SUI', 'AUSTRIA': 'AUT', 'DENMARK': 'DEN',
             'CZECH REPUBLIC': 'CZE', 'CROATIA': 'CRO', 'SERBIA': 'SRB', 'NORWAY': 'NOR', 'SWEDEN': 'SWE', 'POLAND': 'POL', 'ROMANIA': 'ROU', 'ISRAEL': 'ISR',
             'CYPRUS': 'CYP', 'BULGARIA': 'BUL', 'HUNGARY': 'HUN'}
POSICAO = {'GK': ('guarda-redes', 'Um guarda-redes'), 'DF': ('defesa', 'Um defesa'), 'MF': ('médio', 'Um médio'), 'FW': ('avançado', 'Um avançado')}

perguntas, vistos = [], set()


def junta(qid, cat, tipo, txt, sub, r, mn=5, mx=80):
    """r: [(nome, detalhe)] já pela ordem (mais óbvia primeiro); sem nomes repetidos"""
    out, ja = [], set()
    for n, t in r:
        k = wiki_norm(n)
        if k and k not in ja: ja.add(k); out.append([n, t])
    if qid in vistos: sys.exit('id repetido: ' + qid)
    if mn <= len(out) <= mx:
        vistos.add(qid); perguntas.append({'id': qid, 'cat': cat, 'tipo': tipo, 'txt': txt, 'sub': sub, 'r': out}); return True
    print(f'  fora ({len(out)} respostas): {qid}')
    return False


def wiki_norm(s):
    import unicodedata
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower().strip()


def limiares(qid, cat, txt, sub, itens, lims, unid, mn=8, mx=45):
    """itens: [(nome, valor, extra)] → para cada limite (do maior para o menor) a 1.ª lista com tamanho jeitoso; devolve o limite usado"""
    for lim in lims:
        sel = sorted([x for x in itens if x[1] >= lim], key=lambda x: -x[1])
        if mn <= len(sel) <= mx:
            junta(qid.format(lim=lim), cat, 'jogador', txt.format(lim=lim), sub, [(n, f'{v} {unid}' + (f' · {e}' if e else '')) for n, v, e in sel], mn=mn, mx=mx)
            return lim


# ---------------------------------------------------------------- golos por liga
def golos():
    LISTAS = [('List of footballers with 100 or more Premier League goals', 'na Premier League', 'pl', 'ENG', 'inglês'),
              ('List of La Liga top scorers', 'na Liga espanhola', 'es', 'ESP', 'espanhol'),
              ('List of Serie A players with 100 or more goals', 'na Serie A italiana', 'it', 'ITA', 'italiano'),
              ('List of Bundesliga top scorers', 'na Bundesliga', 'de', 'GER', 'alemão'),
              ('List of Ligue 1 top scorers', 'na Ligue 1 francesa', 'fr', 'FRA', 'francês')]
    for tit, na, cod, casa, adj in LISTAS:
        rows = tabelas(wikitext(tit))[0]
        itens = []
        for row in rows:
            i = 0 if not re.fullmatch(r'\s*\d+\s*', limpa(row[0]) or 'x') else 1
            if i >= len(row) or '[[' not in row[i] and 'sortname' not in row[i]: continue
            ex = next((re.search(r'#expr:\s*(\d+)\s*/\s*(\d+)', x) for x in row if '#expr' in x), None)
            if not ex: sys.exit(f'sem golos/jogos: {tit} {row}')
            g, a = int(ex.group(1)), int(ex.group(2))
            if not g or g < 100: continue
            nome = limpa(re.sub(r'\{\{efn[^}]*\}\}', '', row[i]))
            itens.append((nome, g, a, pais(row[i])))
        assert len(itens) > 30, (tit, len(itens))
        if cod == 'de': casa = {'GER', 'FRG', 'GDR'}
        else: casa = {casa}
        print(tit, len(itens), 'jogadores com 100+')
        base = [(n, g, f'{a} jogos' if a else '') for n, g, a, p in itens]
        sub = f'{SUBW}: golos só no campeonato, desde sempre'
        junta(f'wl-g100-{cod}', 'ligas', 'jogador', f'Um jogador com pelo menos 100 golos {na} (em toda a história)', sub,
              [(n, f'{g} golos' + (f' · {e}' if e else '')) for n, g, e in sorted(base, key=lambda x: -x[1])], mn=8, mx=110)
        limiares(f'wl-g-{cod}-{{lim}}', 'ligas', f'Um jogador com pelo menos {{lim}} golos {na} (em toda a história)', sub, base, [250, 200, 180, 160, 150, 140, 130, 120], 'golos', mn=10, mx=40)
        fora = [(n, g, e) for (n, g, e), (_, _, _, p) in zip(base, itens) if p and p not in casa]
        sem = [n for n, g, a, p in itens if not p]
        if sem: print('  sem bandeira:', sem[:5])
        elif len(fora) >= 6:
            junta(f'wl-g100f-{cod}', 'ligas', 'jogador', f'Um jogador não {adj} com pelo menos 100 golos {na}', sub + ' (nacionalidade pela seleção)',
                  [(n, f'{g} golos') for n, g, e in sorted(fora, key=lambda x: -x[1])], mn=6, mx=80)


# ---------------------------------------------------------------- internacionalizações
def caps():
    rows = tabelas(wikitext("List of men's footballers with 100 or more international caps"))[1]
    itens, ult = [], None
    for row in rows:
        if re.fullmatch(r'\d+', limpa(row[0]) or 'x'):
            row = row[1:]; c = num(row[3]) if len(row) > 3 else None
            if c: ult = c
        if not row or '[[' not in row[0]: continue
        p = pais(row[1]) if len(row) > 1 else None
        itens.append((limpa(row[0]), p, ult))
    print('internacionais 100+:', len(itens))
    assert len(itens) > 600 and all(c for _, _, c in itens)
    por = defaultdict(list)
    for n, p, c in itens: por[p].append((n, c))
    sub = f'{SUBW}: jogos oficiais pela seleção principal'
    for p, lst in sorted(por.items(), key=lambda kv: -len(kv[1])):
        if p not in PAIS: continue
        nm, adj, da = PAIS[p]
        lst.sort(key=lambda x: -x[1])
        if len(lst) >= 5:
            junta(f'wl-caps-{p.lower()}', 'mundo', 'jogador', f'Um jogador com 100 ou mais jogos pela seleção {da}', sub, [(n, f'{c} jogos') for n, c in lst], mx=60)
    tot = sorted([(n, c, PAIS.get(p, (p,))[0]) for n, p, c in itens], key=lambda x: -x[1])
    limiares('wl-caps-{lim}', 'mundo', 'Um jogador com pelo menos {lim} jogos pela sua seleção', sub, tot, [200, 190, 180, 175, 170, 165, 160, 150], 'jogos', mn=12, mx=45)
    eu = [x for x, (n, p, c) in zip(tot, sorted(itens, key=lambda x: -x[2])) if True]


# ---------------------------------------------------------------- Benfica e FC Porto
def clubes_pt():
    for tit, c, art, ia, ig in [('List of S.L. Benfica players', 'Benfica', 'o', 5, 6), ('List of FC Porto players', 'FC Porto', 'o', 3, 4)]:
        rows = max(tabelas(wikitext(tit)), key=len)
        itens = []
        for row in rows:
            if len(row) <= ig or 'sortname' not in row[0] and '[[' not in row[0]: continue
            ap, gl = num(row[ia]), num(row[ig])
            pos = re.sub(r'\{\{sort\|\d+\|(\w+)\}\}', r'\1', row[1]).strip()
            if not ap: continue
            nac = next((pais(x) for x in row if pais(x)), None)
            itens.append((limpa(row[0]), ap, gl or 0, pos, nac, limpa(row[2])))
        print(c, len(itens), 'jogadores com 100+ jogos')
        assert len(itens) > 150 and min(x[1] for x in itens) >= 100
        sub = f'{SUBW}: jogos oficiais pela equipa principal (todas as competições)'
        base = [(n, a, f'{g} golos · {anos}') for n, a, g, pos, nac, anos in itens]
        limiares(f'wl-{c[:3].lower()}-j{{lim}}', 'portugal', f'Um jogador com pelo menos {{lim}} jogos oficiais pelo {c}', sub, base, [400, 350, 300, 280, 250], 'jogos', mn=12, mx=45)
        limiares(f'wl-{c[:3].lower()}-jb{{lim}}', 'portugal', f'Um jogador com pelo menos {{lim}} jogos oficiais pelo {c}', sub, base, [200, 180, 150], 'jogos', mn=46, mx=110)
        estr = [(n, a, f'{PAIS.get(nac, (nac,))[0]} · {anos}') for n, a, g, pos, nac, anos in itens if nac and nac != 'POR']
        limiares(f'wl-{c[:3].lower()}-e{{lim}}', 'portugal', f'Um jogador estrangeiro com pelo menos {{lim}} jogos oficiais pelo {c}', sub + ' (nacionalidade pela seleção)', estr,
                 [250, 200, 180, 150, 120, 100], 'jogos', mn=10, mx=45)
        for p in ('BRA', 'ARG', 'URU'):
            lst = sorted([(n, f'{a} jogos · {anos}') for n, a, g, pos, nac, anos in itens if nac == p], key=lambda x: -int(x[1].split()[0]))
            junta(f'wl-{c[:3].lower()}-{p.lower()}', 'portugal', 'jogador', f'Um {PAIS[p][1]} com pelo menos 100 jogos oficiais pelo {c}', sub + ' (nacionalidade pela seleção)', lst, mn=5, mx=40)
        gol = [(n, g, f'{a} jogos · {anos}') for n, a, g, pos, nac, anos in itens]
        limiares(f'wl-{c[:3].lower()}-g{{lim}}', 'portugal', f'Um jogador que marcou pelo menos {{lim}} golos pelo {c}', sub, gol, [150, 120, 100, 80, 70, 60, 50], 'golos', mn=10, mx=40)
        for pk, (pn, um) in POSICAO.items():
            lst = sorted([(n, a, anos) for n, a, g, pos, nac, anos in itens if pos == pk], key=lambda x: -x[1])
            if pk == 'GK':
                junta(f'wl-{c[:3].lower()}-gk', 'portugal', 'jogador', f'Um guarda-redes com pelo menos 100 jogos oficiais pelo {c}', sub, [(n, f'{a} jogos · {anos}') for n, a, anos in lst], mn=5, mx=40)
            else:
                limiares(f'wl-{c[:3].lower()}-{pk.lower()}{{lim}}', 'portugal', f'{um} com pelo menos {{lim}} jogos oficiais pelo {c}', sub, lst, [300, 250, 200, 180, 150], 'jogos', mn=10, mx=40)


# ---------------------------------------------------------------- competições europeias
def europa():
    for tit, comp, desde, cod in [('UEFA Champions League clubs performance comparison', 'a fase principal (grupos ou liga) da Liga dos Campeões', '1992/93', 'lc'),
                                  ('UEFA Europa League clubs performance comparison', 'a fase principal (grupos ou liga) da Liga Europa', '2009/10', 'le')]:
        tb = [t for t in tabelas(wikitext(tit)) if t and 'Clubs' in limpa(t[0][1] if len(t[0]) > 1 else '')][0]
        por, p = defaultdict(list), None
        for row in tb[1:]:
            k = next((j for j in range(min(2, len(row))) if re.search(r'\(\d+\)\s*$', limpa(row[j]))), None)
            if k is None: continue
            m = re.match(r'([A-Z][A-Z .\-&]+?)\s*\((\d+)\)', limpa(row[k]))
            if m and m.group(1) == m.group(1).upper() and len(m.group(1)) > 3: p = PAISES_UP.get(m.group(1).strip()); continue
            m = re.match(r'(.+?)\s*\((\d+)\)\s*$', limpa(row[k]))
            if not m or not p: continue
            row = row[k - 1:] if k else [''] + row
            res = [limpa(x) for x in row[2:]]
            fez = sum(1 for x in res if x and x not in ('•', ''))
            melhor = 'campeão' if 'C' in res else 'finalista' if 'F' in res else ''
            por[p].append((clube(m.group(1)), int(m.group(2)), melhor))
        print(comp, {k: len(v) for k, v in por.items()})
        for p, lst in por.items():
            if p not in PAIS: continue
            nm, adj, _ = PAIS[p]
            lst.sort(key=lambda x: -x[1])
            junta(f'wl-{cod}-{p.lower()}', 'mundo', 'clube', f'Um clube {adj} que já jogou {comp}', f'{SUBW}: desde {desde}, sem contar as pré-eliminatórias (até 2025/26)',
                  [(c, f'{n} participaç{"ões" if n > 1 else "ão"}' + (f' · {mel}' if mel else '')) for c, n, mel in lst], mn=5, mx=60)


# ---------------------------------------------------------------- vice-campeões
def vices():
    def tab(tit, minlin):
        return [t for t in tabelas(wikitext(tit)) if len(t) >= minlin]
    CFG = [('List of Portuguese football champions', 'Liga Portuguesa', 'portugal', 'desde 1934/35', 90, 2, 4, None),
           ('List of Spanish football champions', 'Liga espanhola', 'mundo', 'desde 1929', 90, 1, 3, None),
           ('List of Italian football champions', 'Serie A italiana', 'mundo', 'desde 1929/30 (Serie A)', 90, 1, 2, None),
           ('List of English football champions', 'Premier League', 'mundo', 'desde 1992/93', 120, 2, 3, 1992),
           ('List of English football champions', 'liga inglesa (1.ª divisão, incluindo a Premier League)', 'mundo', 'desde 1888/89', 120, 2, 3, None),
           ('List of German football champions', 'Bundesliga', 'mundo', 'desde 1963/64 (Bundesliga)', 60, 1, 3, 1963),
           ('List of French football champions', 'Ligue 1 francesa (campeonato profissional)', 'mundo', 'desde 1932/33', 110, 2, 3, 1932)]
    for tit, liga, cat, desde, minlin, ic, iv, ano0 in CFG:
        t = tab(tit, minlin)[0]
        vice, camp = defaultdict(list), set()
        for row in t:
            ep = next((limpa(x) for x in row[:2] if re.match(r'\d{4}', limpa(x))), None)
            if not ep: continue
            y = int(ep[:4])
            if ano0 and y < ano0: continue
            cells = row[row.index(next(x for x in row if limpa(x) == ep)) + 1:]
            cl = [x for x in cells if limpa(x) and not re.fullmatch(r'[\d–\-\s:.]+(?:\s*\(.*\))?', limpa(x))]
            if len(cl) < 2: continue
            ch, vi = cl[0], cl[1]
            if not limpa(vi) or not limpa(ch) or 'N/A' in vi: continue
            for v in limpa(vi).split('/'): vice[clube(v)].append(ep)
            camp.add(clube(ch))
        print(liga, len(vice), 'vice-campeões', sorted(vice)[:40])
        lst = sorted(vice.items(), key=lambda kv: (-len(kv[1]), kv[0]))
        junta(f'wl-vice-{wiki_norm(liga)[:10]}', cat, 'clube', f'Um clube que já foi vice-campeão da {liga}' if not liga.startswith('liga') else f'Um clube que já foi vice-campeão da {liga}',
              f'{SUBW}: {desde} até 2025/26', [(c, f'{len(e)}× · a última em {e[-1]}') for c, e in lst], mn=5, mx=60)
        nunca = [(c, e) for c, e in lst if c not in camp]
        junta(f'wl-vicen-{wiki_norm(liga)[:10]}', cat, 'clube', f'Um clube que já foi vice-campeão da {liga} mas nunca foi campeão',
              f'{SUBW}: {desde} até 2025/26', [(c, f'{len(e)}× vice ({", ".join(e[:3])}{"…" if len(e) > 3 else ""})') for c, e in nunca], mn=5, mx=60)


# ---------------------------------------------------------------- equipa do ano da Premier League (PFA)
def pfa():
    por = defaultdict(list)   # (posição, década) → [(nome, época, clube)]
    for tit in ['PFA Team of the Year (1990s)', 'PFA Team of the Year (2000s)', 'PFA Team of the Year (2010s)', 'PFA Team of the Year (2020s)']:
        w = wikitext(tit)
        for m in re.finditer(r'\n===\s*(\d{4})[–-](\d{2,4})\s*===(.*?)(?=\n===[^=]|\Z)', w, flags=re.S):
            ano, bloco = int(m.group(1)), m.group(3)
            sec = re.search(r'====\s*(Premier League|Premiership|FA Premier League|First Division)\s*====\s*(\{\|.*?\n\|\})', bloco, flags=re.S)
            if not sec or ano < 1992: continue
            rows = [r for r in tabelas(sec.group(2))[0] if limpa(r[0]) in POSICAO]
            if len(rows) != 11: print('  PFA', ano, 'linhas', len(rows)); continue
            for row in rows:
                pos = limpa(row[0]); nome = limpa(row[1]); cl = clube(row[2])
                por[(pos, ano // 10 * 10)].append((nome, f'{ano}/{str(ano + 1)[2:]}', cl)); por[(pos, 0)].append((nome, f'{ano}/{str(ano + 1)[2:]}', cl))
    anos = sorted({e for v in por.values() for _, e, _ in v})
    print('PFA épocas', anos[0], '→', anos[-1], len(anos))
    sub = f'{SUBW}: equipa do ano da PFA (votada pelos jogadores), só a da Premier League'
    for (pos, dec), lst in por.items():
        pn, um = POSICAO[pos]
        cont = defaultdict(list)
        for n, e, c in lst: cont[n].append((e, c))
        r = [(n, f'{len(v)}× · {v[0][0]} ({v[0][1]})' + (f' … {v[-1][0]}' if len(v) > 1 else '')) for n, v in sorted(cont.items(), key=lambda kv: -len(kv[1]))]
        if dec == 0:
            junta(f'wl-pfa-{pos.lower()}', 'historia', 'jogador', f'{um} que entrou na equipa do ano da Premier League (PFA)', sub + f', de {anos[0]} a {anos[-1]}', r, mn=5, mx=90)
        else:
            fim = min(dec + 9, int(anos[-1][:4]))
            junta(f'wl-pfa-{pos.lower()}-{dec}', 'historia', 'jogador', f'{um} que entrou na equipa do ano da Premier League (PFA) entre {max(dec, 1992)}/{str(max(dec, 1992) + 1)[2:]} e {fim}/{str(fim + 1)[2:]}',
                  sub, r, mn=5, mx=60)


def main():
    golos(); caps(); clubes_pt(); europa(); vices(); pfa()
    with open(SAIDA, 'w', encoding='utf8', newline='\n') as f:
        json.dump({'fonte': f'Wikipédia inglesa ({DATA})', 'perguntas': perguntas}, f, ensure_ascii=False, separators=(',', ':'))
    from collections import Counter
    print(len(perguntas), 'perguntas', Counter(q['id'].split('-')[1] for q in perguntas))


if __name__ == '__main__':
    main()
