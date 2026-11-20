"""Fora da Caixa — perguntas "jogadores da nacionalidade X que jogaram na liga Y / no clube Z".

Fonte: salimt/football-datasets (dados do Transfermarkt, recolhidos em outubro de 2025): perfis
(nacionalidades) e jogos de cada jogador por época, competição e clube. Conferido contra os dados
oficiais da Premier League: de 2019/20 em diante falta menos de 1% dos jogadores (antes falta mais),
por isso só se usam as épocas 2019/20 a 2024/25 (todas acabadas: os factos já não mudam).

"Jogou" = entrou em campo pelo menos uma vez. Nacionalidade = qualquer uma das que o Transfermarkt
lhe dá (nacionalidade desportiva). Respostas da mais óbvia (mais jogos) para a mais rara.

Uso: python3 scripts/nacionalidades.py  →  escreve nacionalidades.json (os ficheiros descarregados
ficam em /tmp/fdc-tm, ou na pasta da variável FDC_TM). Só é preciso voltar a correr para mudar as perguntas.
"""
import csv, json, os, re, sys, unicodedata, urllib.request
from collections import defaultdict

AQUI = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.join(AQUI, '..', 'nacionalidades.json')
CACHE = os.environ.get('FDC_TM', '/tmp/fdc-tm')
RAW = 'https://raw.githubusercontent.com/salimt/football-datasets/main/datalake/transfermarkt/'
LFS = 'https://media.githubusercontent.com/media/salimt/football-datasets/main/datalake/transfermarkt/'
FICH = {'perf': LFS + 'player_performances/player_performances.csv', 'prof': RAW + 'player_profiles/player_profiles.csv'}

EPOCAS = ['19/20', '20/21', '21/22', '22/23', '23/24', '24/25']
PERIODO = 'de 2019/20 a 2024/25'
def epoca_longa(s): return f'20{s[:2]}/{s[3:]}'

LIGAS = {   # id do Transfermarkt → (nome, "na …")
    'GB1': ('Premier League', 'na Premier League'), 'ES1': ('Liga espanhola', 'na Liga espanhola'),
    'IT1': ('Serie A', 'na Serie A italiana'), 'L1': ('Bundesliga', 'na Bundesliga'),
    'FR1': ('Ligue 1', 'na Ligue 1 francesa'), 'PO1': ('Liga Portuguesa', 'na Liga Portuguesa'),
    'TR1': ('Liga turca', 'na Liga turca'), 'NL1': ('Eredivisie', 'na Eredivisie (Países Baixos)'),
    'BE1': ('Liga belga', 'na Liga belga'), 'SC1': ('Liga escocesa', 'na Liga escocesa'),
}
GRANDES = ['GB1', 'ES1', 'IT1', 'L1', 'FR1', 'TR1']   # perguntas época a época dos portugueses lá fora

# nacionalidade (como no Transfermarkt) → adjetivo
ADJ = {
    'Portugal': 'português', 'Brazil': 'brasileiro', 'Argentina': 'argentino', 'Spain': 'espanhol', 'France': 'francês',
    'England': 'inglês', 'Germany': 'alemão', 'Italy': 'italiano', 'Netherlands': 'neerlandês', 'Belgium': 'belga',
    'Uruguay': 'uruguaio', 'Colombia': 'colombiano', 'Mexico': 'mexicano', 'Japan': 'japonês', 'United States': 'norte-americano',
    'Serbia': 'sérvio', 'Croatia': 'croata', 'Nigeria': 'nigeriano', 'Senegal': 'senegalês', "Cote d'Ivoire": 'costa-marfinense',
    'Ghana': 'ganês', 'Cameroon': 'camaronês', 'Morocco': 'marroquino', 'Algeria': 'argelino', 'Angola': 'angolano',
    'Cape Verde': 'cabo-verdiano', 'Guinea-Bissau': 'guineense (Guiné-Bissau)', 'Mozambique': 'moçambicano', 'Denmark': 'dinamarquês',
    'Sweden': 'sueco', 'Norway': 'norueguês', 'Poland': 'polaco', 'Switzerland': 'suíço', 'Austria': 'austríaco',
    'Scotland': 'escocês', 'Wales': 'galês', 'Ireland': 'irlandês', 'Greece': 'grego', 'Türkiye': 'turco', 'Ukraine': 'ucraniano',
    'Korea, South': 'sul-coreano', 'Iran': 'iraniano', 'Australia': 'australiano', 'Canada': 'canadiano', 'Chile': 'chileno',
    'Paraguay': 'paraguaio', 'Ecuador': 'equatoriano', 'Venezuela': 'venezuelano', 'Czech Republic': 'checo', 'DR Congo': 'congolês (RD Congo)',
    'Mali': 'maliano', 'Egypt': 'egípcio', 'Tunisia': 'tunisino', 'Bosnia-Herzegovina': 'bósnio', 'Georgia': 'georgiano', 'Jamaica': 'jamaicano',
    'Suriname': 'surinamês', 'Albania': 'albanês', 'Kosovo': 'kosovar', 'Northern Ireland': 'norte-irlandês', 'Guinea': 'guineense (Guiné-Conacri)',
    'Romania': 'romeno', 'Slovenia': 'esloveno', 'Slovakia': 'eslovaco', 'Hungary': 'húngaro', 'Russia': 'russo', 'Iceland': 'islandês', 'Finland': 'finlandês',
    'Peru': 'peruano', 'Costa Rica': 'costa-riquenho', 'Israel': 'israelita', 'Burkina Faso': 'burquinense', 'The Gambia': 'gambiano', 'Togo': 'togolês',
    'Curacao': 'curaçauense', 'Bulgaria': 'búlgaro', 'North Macedonia': 'macedónio', 'Montenegro': 'montenegrino', 'South Africa': 'sul-africano',
}
CASA = {'GB1': {'England'}, 'ES1': {'Spain'}, 'IT1': {'Italy'}, 'L1': {'Germany'}, 'FR1': {'France'}, 'PO1': {'Portugal'},
        'TR1': {'Türkiye'}, 'NL1': {'Netherlands'}, 'BE1': {'Belgium'}, 'SC1': {'Scotland'}}

# nomes dos clubes como no resto do jogo (o script para se aparecer um clube sem nome aqui)
CLUBE = {
    # Inglaterra
    'AFC Bournemouth': 'Bournemouth', 'Arsenal FC': 'Arsenal', 'Aston Villa': 'Aston Villa', 'Brentford FC': 'Brentford',
    'Brighton & Hove Albion': 'Brighton', 'Burnley FC': 'Burnley', 'Chelsea FC': 'Chelsea', 'Crystal Palace': 'Crystal Palace',
    'Everton FC': 'Everton', 'Fulham FC': 'Fulham', 'Ipswich Town': 'Ipswich Town', 'Leeds United': 'Leeds', 'Leicester City': 'Leicester',
    'Liverpool FC': 'Liverpool', 'Luton Town': 'Luton Town', 'Manchester City': 'Manchester City', 'Manchester United': 'Manchester United',
    'Newcastle United': 'Newcastle', 'Norwich City': 'Norwich City', 'Nottingham Forest': 'Nottingham Forest', 'Sheffield United': 'Sheffield United',
    'Southampton FC': 'Southampton', 'Tottenham Hotspur': 'Tottenham', 'Watford FC': 'Watford', 'West Bromwich Albion': 'West Bromwich Albion',
    'West Ham United': 'West Ham', 'Wolverhampton Wanderers': 'Wolverhampton',
    # Espanha
    'Athletic Bilbao': 'Athletic Bilbao', 'Atlético de Madrid': 'Atlético de Madrid', 'CA Osasuna': 'Osasuna', 'CD Leganés': 'Leganés',
    'Celta de Vigo': 'Celta de Vigo', 'Cádiz CF': 'Cádiz', 'Deportivo Alavés': 'Alavés', 'Elche CF': 'Elche', 'FC Barcelona': 'Barcelona',
    'Getafe CF': 'Getafe', 'Girona FC': 'Girona', 'Granada CF': 'Granada', 'Levante UD': 'Levante', 'RCD Espanyol Barcelona': 'Espanyol',
    'RCD Mallorca': 'Mallorca', 'Rayo Vallecano': 'Rayo Vallecano', 'Real Betis Balompié': 'Betis', 'Real Madrid': 'Real Madrid',
    'Real Sociedad': 'Real Sociedad', 'Real Valladolid CF': 'Real Valladolid', 'SD Eibar': 'Eibar', 'SD Huesca': 'Huesca', 'Sevilla FC': 'Sevilha',
    'UD Almería': 'Almería', 'UD Las Palmas': 'Las Palmas', 'Valencia CF': 'Valência', 'Villarreal CF': 'Villarreal',
    # Itália
    'AC Milan': 'Milan', 'AC Monza': 'Monza', 'ACF Fiorentina': 'Fiorentina', 'AS Roma': 'Roma', 'Atalanta BC': 'Atalanta',
    'Benevento Calcio': 'Benevento', 'Bologna FC 1909': 'Bologna', 'Brescia Calcio (- 2025)': 'Brescia', 'Cagliari Calcio': 'Cagliari',
    'Como 1907': 'Como', 'FC Crotone': 'Crotone', 'FC Empoli': 'Empoli', 'Frosinone Calcio': 'Frosinone', 'Genoa CFC': 'Genoa',
    'Hellas Verona': 'Hellas Verona', 'Inter Milan': 'Inter', 'Juventus FC': 'Juventus', 'Parma Calcio 1913': 'Parma', 'SPAL': 'SPAL',
    'SS Lazio': 'Lazio', 'SSC Napoli': 'Napoli', 'Spezia Calcio': 'Spezia', 'Torino FC': 'Torino', 'UC Sampdoria': 'Sampdoria',
    'US Cremonese': 'Cremonese', 'US Lecce': 'Lecce', 'US Salernitana 1919': 'Salernitana', 'US Sassuolo': 'Sassuolo', 'Udinese Calcio': 'Udinese',
    'Venezia FC': 'Venezia',
    # Alemanha
    '1.FC Heidenheim 1846': 'Heidenheim', '1.FC Köln': 'Colónia', '1.FC Union Berlin': 'Union Berlim', '1.FSV Mainz 05': 'Mainz',
    'Arminia Bielefeld': 'Arminia Bielefeld', 'Bayer 04 Leverkusen': 'Bayer Leverkusen', 'Bayern Munich': 'Bayern', 'Borussia Dortmund': 'Borussia Dortmund',
    'Borussia Mönchengladbach': 'Borussia Mönchengladbach', 'Eintracht Frankfurt': 'Eintracht Frankfurt', 'FC Augsburg': 'Augsburg',
    'FC Schalke 04': 'Schalke 04', 'FC St. Pauli': 'St. Pauli', 'Fortuna Düsseldorf': 'Fortuna Düsseldorf', 'Hertha BSC': 'Hertha Berlim',
    'Holstein Kiel': 'Holstein Kiel', 'RB Leipzig': 'RB Leipzig', 'SC Freiburg': 'Freiburg', 'SC Paderborn 07': 'Paderborn',
    'SV Darmstadt 98': 'Darmstadt', 'SV Werder Bremen': 'Werder Bremen', 'SpVgg Greuther Fürth': 'Greuther Fürth', 'TSG 1899 Hoffenheim': 'Hoffenheim',
    'VfB Stuttgart': 'Estugarda', 'VfL Bochum': 'Bochum', 'VfL Wolfsburg': 'Wolfsburgo',
    # França
    'AC Ajaccio': 'Ajaccio', 'AJ Auxerre': 'Auxerre', 'AS Monaco': 'Monaco', 'AS Saint-Étienne': 'Saint-Étienne', 'Amiens SC': 'Amiens',
    'Angers SCO': 'Angers', 'Clermont Foot 63': 'Clermont', 'Dijon FCO': 'Dijon', 'ESTAC Troyes': 'Troyes', 'FC Girondins Bordeaux': 'Bordeaux',
    'FC Lorient': 'Lorient', 'FC Metz': 'Metz', 'FC Nantes': 'Nantes', 'FC Toulouse': 'Toulouse', 'LOSC Lille': 'Lille', 'Le Havre AC': 'Le Havre',
    'Montpellier HSC': 'Montpellier', 'Nîmes Olympique': 'Nîmes', 'OGC Nice': 'Nice', 'Olympique Lyon': 'Lyon', 'Olympique Marseille': 'Marseille',
    'Paris Saint-Germain': 'PSG', 'RC Lens': 'Lens', 'RC Strasbourg Alsace': 'Strasbourg', 'Stade Brestois 29': 'Brest', 'Stade Reims': 'Reims',
    'Stade Rennais FC': 'Rennes',
    # Portugal
    'Avs Futebol': 'AVS', 'B SAD': 'Belenenses SAD', 'Boavista FC': 'Boavista', 'CD Nacional': 'Nacional', 'CD Santa Clara': 'Santa Clara',
    'CD Tondela': 'Tondela', 'CF Estrela Amadora': 'Estrela da Amadora', 'CS Marítimo': 'Marítimo', 'Casa Pia AC': 'Casa Pia',
    'Desportivo Aves (- 2020)': 'Desportivo das Aves', 'FC Arouca': 'Arouca', 'FC Famalicão': 'Famalicão', 'FC Paços de Ferreira': 'Paços de Ferreira',
    'FC Porto': 'FC Porto', 'FC Vizela': 'Vizela', 'GD Chaves': 'Chaves', 'GD Estoril Praia': 'Estoril', 'Gil Vicente FC': 'Gil Vicente',
    'Moreirense FC': 'Moreirense', 'Portimonense SAD': 'Portimonense', 'Rio Ave FC': 'Rio Ave', 'SC Braga': 'Braga', 'SC Farense': 'Farense',
    'SL Benfica': 'Benfica', 'Sporting CP': 'Sporting', 'Vitória Guimarães SC': 'Vitória de Guimarães', 'Vitória Setúbal FC': 'Vitória de Setúbal',
    # Turquia
    'Adana Demirspor': 'Adana Demirspor', 'Alanyaspor': 'Alanyaspor', 'Altay SK': 'Altay', 'Antalyaspor': 'Antalyaspor', 'Basaksehir FK': 'İstanbul Başakşehir',
    'Besiktas JK': 'Beşiktaş', 'Bodrum FK': 'Bodrum', 'Büyüksehir Belediye Erzurumspor': 'Erzurumspor', 'Caykur Rizespor': 'Rizespor',
    'Denizlispor': 'Denizlispor', 'Eyüpspor': 'Eyüpspor', 'Fatih Karagümrük': 'Karagümrük', 'Fenerbahce': 'Fenerbahçe', 'Galatasaray': 'Galatasaray',
    'Gaziantep FK': 'Gaziantep', 'Genclerbirligi Ankara': 'Gençlerbirliği', 'Giresunspor': 'Giresunspor', 'Göztepe': 'Göztepe', 'Hatayspor': 'Hatayspor',
    'Istanbulspor': 'İstanbulspor', 'Kasimpasa': 'Kasımpaşa', 'Kayserispor': 'Kayserispor', 'Konyaspor': 'Konyaspor', 'MKE Ankaragücü': 'Ankaragücü',
    'Pendikspor': 'Pendikspor', 'Samsunspor': 'Samsunspor', 'Sivasspor': 'Sivasspor', 'Trabzonspor': 'Trabzonspor', 'Yeni Malatyaspor': 'Yeni Malatyaspor',
    'Ümraniyespor': 'Ümraniyespor',
    # Países Baixos
    'ADO Den Haag': 'ADO Den Haag', 'AZ Alkmaar': 'AZ Alkmaar', 'Ajax Amsterdam': 'Ajax', 'Almere City FC': 'Almere City', 'Excelsior Rotterdam': 'Excelsior',
    'FC Emmen': 'Emmen', 'FC Groningen': 'Groningen', 'FC Utrecht': 'Utrecht', 'FC Volendam': 'Volendam', 'Feyenoord Rotterdam': 'Feyenoord',
    'Fortuna Sittard': 'Fortuna Sittard', 'Go Ahead Eagles': 'Go Ahead Eagles', 'Heracles Almelo': 'Heracles', 'NAC Breda': 'NAC Breda',
    'NEC Nijmegen': 'NEC Nijmegen', 'PEC Zwolle': 'PEC Zwolle', 'PSV Eindhoven': 'PSV', 'RKC Waalwijk': 'RKC Waalwijk', 'SC Cambuur Leeuwarden': 'Cambuur',
    'SC Heerenveen': 'Heerenveen', 'Sparta Rotterdam': 'Sparta Roterdão', 'Twente Enschede FC': 'Twente', 'VVV-Venlo': 'VVV-Venlo', 'Vitesse Arnhem': 'Vitesse',
    'Willem II Tilburg': 'Willem II',
    # Bélgica
    'Beerschot VA': 'Beerschot', 'Cercle Brugge': 'Cercle Brugge', 'Club Brugge KV': 'Club Brugge', 'FCV Dender EH': 'Dender', 'KAA Gent': 'Gent',
    'KAS Eupen': 'Eupen', 'KRC Genk': 'Genk', 'KV Kortrijk': 'Kortrijk', 'KV Mechelen': 'Mechelen', 'KV Oostende (-2024)': 'Oostende', 'KVC Westerlo': 'Westerlo',
    'KVRS Waasland - SK Beveren': 'Waasland-Beveren', 'Oud-Heverlee Leuven': 'OH Leuven', 'RFC Seraing': 'Seraing', 'RSC Anderlecht': 'Anderlecht',
    'RWD Molenbeek': 'RWD Molenbeek', 'Royal Antwerp FC': 'Antuérpia', 'Royal Charleroi SC': 'Charleroi', 'Royal Excel Mouscron (-2022)': 'Mouscron',
    'Sint-Truidense VV': 'Sint-Truiden', 'Standard Liège': 'Standard Liège', 'Union Saint-Gilloise': 'Union Saint-Gilloise', 'Zulte Waregem': 'Zulte Waregem',
    # Escócia
    'Aberdeen FC': 'Aberdeen', 'Celtic FC': 'Celtic', 'Dundee FC': 'Dundee', 'Dundee United FC': 'Dundee United', 'Hamilton Academical FC': 'Hamilton',
    'Heart of Midlothian FC': 'Hearts', 'Hibernian FC': 'Hibernian', 'Kilmarnock FC': 'Kilmarnock', 'Livingston FC': 'Livingston', 'Motherwell FC': 'Motherwell',
    'Rangers FC': 'Rangers', 'Ross County FC': 'Ross County', 'St. Johnstone FC': 'St Johnstone', 'St. Mirren FC': 'St Mirren',
}
# clubes com perguntas "um jogador <nacionalidade> que jogou no <clube>" (e o artigo)
FEM = {'Juventus', 'Roma', 'Lazio', 'Fiorentina', 'Atalanta', 'Real Sociedad', 'Sampdoria', 'Udinese'}
CLUBES_Q = ['Benfica', 'FC Porto', 'Sporting', 'Braga', 'Vitória de Guimarães',
            'Manchester United', 'Manchester City', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Wolverhampton', 'Newcastle', 'West Ham', 'Everton',
            'Aston Villa', 'Leicester', 'Fulham', 'Nottingham Forest', 'Real Madrid', 'Barcelona', 'Atlético de Madrid', 'Sevilha', 'Valência', 'Villarreal',
            'Betis', 'Real Sociedad', 'Juventus', 'Milan', 'Inter', 'Roma', 'Napoli', 'Lazio', 'Atalanta', 'Fiorentina', 'Bayern', 'Borussia Dortmund',
            'RB Leipzig', 'Bayer Leverkusen', 'Eintracht Frankfurt', 'Wolfsburgo', 'PSG', 'Marseille', 'Lyon', 'Monaco', 'Lille', 'Nice', 'Rennes', 'Nantes',
            'Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor', 'Ajax', 'PSV', 'Feyenoord', 'AZ Alkmaar', 'Club Brugge', 'Anderlecht', 'Celtic', 'Rangers']
NAT_CLUBE_MAX = 6
# nas perguntas por liga, só as nacionalidades mais conhecidas (e nas ligas mais pequenas só portugueses e brasileiros)
NAC_LIGA = {'Portugal', 'Brazil', 'Argentina', 'Spain', 'France', 'England', 'Germany', 'Italy', 'Netherlands', 'Belgium', 'Uruguay', 'Colombia',
            'Mexico', 'Japan', 'United States', 'Serbia', 'Croatia', 'Nigeria', 'Senegal', "Cote d'Ivoire", 'Ghana', 'Cameroon', 'Morocco', 'Algeria',
            'Angola', 'Cape Verde', 'Guinea-Bissau', 'Mozambique', 'Denmark', 'Sweden', 'Norway', 'Poland', 'Switzerland', 'Austria', 'Scotland',
            'Wales', 'Ireland', 'Greece', 'Türkiye', 'Ukraine', 'Korea, South', 'Australia', 'Canada', 'Chile', 'Paraguay', 'Ecuador', 'Czech Republic'}
LIGAS_PEQ = {'NL1', 'BE1', 'SC1'}
NAC_GOLO = {'Portugal', 'Brazil', 'Argentina', 'France', 'Spain', 'England', 'Netherlands', 'Uruguay', 'Colombia', 'Nigeria', 'Senegal', 'Morocco', 'Germany', 'Italy'}          # no máximo 6 nacionalidades por clube
MIN, MAX = 5, 150          # respostas por pergunta


def norm(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower().strip()


# nos nomes com apóstrofo (N'Golo Kanté, O'Neill, D'Ambrosio…) o Transfermarkt deixou o nome vazio: refaz-se a partir do endereço
NOME_FIXO = {'225083': "N'Golo Kanté", '157501': "M'Baye Niang", '60573': "Yann M'Vila", '241119': "Clinton N'Jie", '41242': "David N'Gog",
             '55769': "Danilo D'Ambrosio", '215679': 'Georges-Kévin Nkoudou', '33465': "Raïs M'Bolhi", '263294': "Serge N'Guessan", '60577': "Nicolas N'Koulou",
             '354814': 'Mbala Nzola', '406634': "Matt O'Riley", '186337': "Stephen O'Donnell", '102961': 'Soki Nzinga', '134455': 'Steve Mbida'}
PREF = {'o': "O'", 'd': "D'", 'n': "N'", 'm': "M'"}
def nome_do_slug(pid, slug, casa):
    if pid in NOME_FIXO: return NOME_FIXO[pid]
    pal = {re.sub(r"[’'`]", '', w).lower(): w for w in re.split(r'\s+', casa or '') if re.search(r"[’']", w)}
    out = []
    for t in slug.split('-'):
        if t in pal: out.append(pal[t].replace('’', "'")); continue
        w = t.capitalize()
        if len(t) > 3 and t[0] in 'nm' and t[1] not in 'aeiouy': w = PREF[t[0]] + t[1:].capitalize()
        elif len(t) > 4 and t[0] == 'o' and t[1] not in 'aeiou': w = "O'" + t[1:].capitalize()
        elif len(t) > 4 and t[0] == 'd' and t[1] in 'aeiou' and t[1:3] not in ('av',): w = "D'" + t[1:].capitalize()
        out.append(w)
    return ' '.join(out)


def baixar():
    os.makedirs(CACHE, exist_ok=True)
    for k, url in FICH.items():
        dest = os.path.join(CACHE, k + '.csv')
        if not os.path.exists(dest) or os.path.getsize(dest) < 1000:
            print('a descarregar', url)
            urllib.request.urlretrieve(url, dest)
        with open(dest, encoding='utf8') as f:
            if f.readline().startswith('version https://git-lfs'):
                sys.exit(f'{dest}: veio o ponteiro do Git LFS em vez dos dados')
    return os.path.join(CACHE, 'perf.csv'), os.path.join(CACHE, 'prof.csv')


def main():
    fperf, fprof = baixar()
    # jogos por (jogador, época, competição, clube)
    jog = defaultdict(lambda: [0, 0])          # (pid, liga, clube) → [jogos, golos] nas épocas todas
    jog_ep = defaultdict(lambda: [0, 0])       # (pid, liga, época) → [jogos, golos]
    clube_liga = {}                            # id do clube (equipa principal) → nome do Transfermarkt
    linhas = []
    with open(fperf, encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['season_name'] not in EPOCAS: continue
            try: n = int(float(r['nb_on_pitch'] or 0)); g = int(float(r['goals'] or 0))
            except ValueError: continue
            if n <= 0: continue
            linhas.append((r['player_id'], r['season_name'], r['competition_id'], r['team_id'], n, g))
            if r['competition_id'] in LIGAS: clube_liga[r['team_id']] = r['team_name']
    falta = sorted({n for n in clube_liga.values() if n not in CLUBE})
    if falta: sys.exit('Clubes sem nome em CLUBE: ' + ', '.join(falta))
    em_clube = defaultdict(lambda: [0, 0])     # (pid, clube) → todas as competições pela equipa principal
    for pid, ep, comp, tid, n, g in linhas:
        if comp in LIGAS:
            c = CLUBE[clube_liga[tid]]
            jog[(pid, comp, c)][0] += n; jog[(pid, comp, c)][1] += g
            jog_ep[(pid, comp, ep)][0] += n; jog_ep[(pid, comp, ep)][1] += g
        if tid in clube_liga:
            c = CLUBE[clube_liga[tid]]; em_clube[(pid, c)][0] += n; em_clube[(pid, c)][1] += g
    ids = {k[0] for k in jog} | {k[0] for k in em_clube}
    nome, nacs = {}, {}
    with open(fprof, encoding='utf8') as f:
        for r in csv.DictReader(f):
            if r['player_id'] in ids:
                nome[r['player_id']] = re.sub(r'\s*\(\d+\)$', '', r['player_name']).strip() or nome_do_slug(r['player_id'], r['player_slug'], r['name_in_home_country'])
                nacs[r['player_id']] = (r['citizenship'].split('  ')[0].strip(),)   # só a principal (a 1.ª, a desportiva)
    print('jogadores', len(ids), 'sem perfil', len(ids - set(nome)))

    perguntas, vistos = [], set()
    def lista(tot):   # {pid: [jogos, golos]} → respostas ordenadas, sem nomes repetidos
        out, ja = [], set()
        for pid, (n, g) in sorted(tot.items(), key=lambda kv: (-kv[1][0], -kv[1][1], nome.get(kv[0], ''))):
            if pid not in nome: continue
            k = norm(nome[pid])
            if k in ja: continue
            ja.add(k); out.append([nome[pid], f'{n} jogo{"s" if n != 1 else ""} · {g} golo{"s" if g != 1 else ""}'])
        return out
    def junta(qid, txt, sub, r, tipo='jogador'):
        if qid in vistos or not MIN <= len(r) <= MAX: return False
        vistos.add(qid); perguntas.append({'id': qid, 'cat': 'ligas', 'tipo': tipo, 'txt': txt, 'sub': sub, 'r': r}); return True

    # por liga: totais por jogador (e por época)
    por_liga = defaultdict(lambda: defaultdict(lambda: [0, 0]))
    for (pid, comp, c), (n, g) in jog.items():
        por_liga[comp][pid][0] += n; por_liga[comp][pid][1] += g
    por_ep = defaultdict(lambda: defaultdict(lambda: [0, 0]))
    for (pid, comp, ep), (n, g) in jog_ep.items():
        por_ep[(comp, ep)][pid][0] += n; por_ep[(comp, ep)][pid][1] += g

    def de_nac(tot, nac): return {p: v for p, v in tot.items() if nac in nacs.get(p, ())}
    sub_l = lambda liga: f'Entrou em campo pelo menos uma vez {LIGAS[liga][1]}, {PERIODO} (nacionalidade desportiva)'
    for liga, (lnome, na) in LIGAS.items():
        for nac, adj in ADJ.items():
            if nac in CASA[liga] or nac not in NAC_LIGA or (liga in LIGAS_PEQ and nac not in ('Portugal', 'Brazil')): continue
            tot = de_nac(por_liga[liga], nac)
            junta(f'nac-{liga}-{norm(nac)[:12]}', f'Um jogador {adj} que jogou {na}', sub_l(liga), lista(tot))
            golo = {p: v for p, v in tot.items() if v[1] > 0}
            if nac in NAC_GOLO and len(golo) >= 8 and len(tot) > len(golo) + 3:
                junta(f'nacg-{liga}-{norm(nac)[:12]}', f'Um jogador {adj} que marcou {na}', f'Pelo menos um golo {LIGAS[liga][1]}, {PERIODO} (nacionalidade desportiva)', lista(golo))
            if len(tot) > MAX or nac == 'Portugal' and liga in GRANDES:   # muitos (ou portugueses nas grandes ligas): época a época
                for ep in EPOCAS:
                    t2 = de_nac(por_ep[(liga, ep)], nac)
                    junta(f'nace-{liga}-{norm(nac)[:12]}-{ep[:2]}', f'Um jogador {adj} que jogou {na} em {epoca_longa(ep)}',
                          f'Entrou em campo pelo menos uma vez {LIGAS[liga][1]} na época {epoca_longa(ep)} (nacionalidade desportiva)', lista(t2))

    # por clube
    por_clube = defaultdict(dict)
    for (pid, c), v in em_clube.items(): por_clube[c][pid] = v
    liga_do = {}
    for (pid, comp, c) in jog: liga_do[c] = comp
    for c in CLUBES_Q:
        if c not in por_clube: sys.exit(f'Clube sem jogos: {c}')
        casa = CASA[liga_do[c]]
        cand = []
        for nac, adj in ADJ.items():
            if nac in casa: continue
            tot = de_nac(por_clube[c], nac)
            if MIN <= len(tot) <= MAX: cand.append((nac == 'Portugal', len(tot), nac, adj, tot))
        cand.sort(key=lambda x: (not x[0], -x[1]))
        art = 'na' if c in FEM else 'no'
        for _, _, nac, adj, tot in cand[:NAT_CLUBE_MAX]:
            junta(f'nacc-{norm(c)[:14]}-{norm(nac)[:12]}', f'Um jogador {adj} que jogou {art} {c}',
                  f'Jogou pelo menos um jogo oficial pela equipa principal, {PERIODO} (nacionalidade desportiva)', lista(tot))

    # clubes de cada liga onde jogaram portugueses (e brasileiros, argentinos)
    for nac, adj, plural in [('Portugal', 'português', 'portugueses'), ('Brazil', 'brasileiro', 'brasileiros'), ('Argentina', 'argentino', 'argentinos')]:
        for liga, (lnome, na) in LIGAS.items():
            if nac in CASA[liga]: continue
            conta = defaultdict(lambda: [0, 0])
            for (pid, comp, c), (n, g) in jog.items():
                if comp == liga and nac in nacs.get(pid, ()): conta[c][0] += 1; conta[c][1] += n
            r = [[c, f'{k} jogador{"es" if k != 1 else ""} {plural if k != 1 else adj}'] for c, (k, n) in sorted(conta.items(), key=lambda kv: (-kv[1][0], -kv[1][1], kv[0]))]
            junta(f'nacl-{liga}-{norm(nac)[:12]}', f'Um clube da {lnome} onde jogou um {adj}',
                  f'Pelo menos um jogo {LIGAS[liga][1]} por esse clube, {PERIODO}', r, tipo='clube')

    with open(SAIDA, 'w', encoding='utf8', newline='\n') as f:
        json.dump({'fonte': 'Transfermarkt (salimt/football-datasets, out. 2025)', 'epocas': PERIODO, 'perguntas': perguntas}, f, ensure_ascii=False, separators=(',', ':'))
    tipos = defaultdict(int)
    for q in perguntas: tipos[q['id'].split('-')[0]] += 1
    print(len(perguntas), 'perguntas', dict(tipos), '· respostas', sum(len(q['r']) for q in perguntas), '· 12+ respostas', sum(len(q['r']) >= 12 for q in perguntas))


if __name__ == '__main__':
    main()
