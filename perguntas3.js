// =====================================================================================
// Fora da Caixa — perguntas de outras ligas e de carreiras (junta-se ao BANCO de perguntas.js).
// Mesmas regras: só factos de que se tem a certeza, listas completas, pelo menos 5 respostas,
// respostas da mais óbvia para a mais rara. Carreiras de quem ainda joga levam um limite de data.
// =====================================================================================
(function () {
  const B = window.BANCO, A = window.ALIASES, X = window.EXTRAS;
  const add = (id, cat, tipo, txt, sub, r) => B.push({id, cat, tipo, txt, sub, r});

  // ---------- carreiras (categoria 'ligas' = Jogadores pelo mundo): clubes onde jogaram (equipa principal; empréstimos contam) ----------
  const CJ = [
    // portugueses que andaram por várias ligas
    ['nani', 'Nani', 'portugal', ['Manchester United', 'Sporting', 'Valência', 'Lazio', 'Fenerbahçe', 'Orlando City', 'Venezia', 'Melbourne Victory', 'Adana Demirspor', 'Estrela da Amadora'], 'Até 2024'],
    ['meireles', 'Raul Meireles', 'portugal', ['FC Porto', 'Liverpool', 'Chelsea', 'Fenerbahçe', 'Boavista', 'Desportivo das Aves']],
    ['bosingwa', 'José Bosingwa', 'portugal', ['Chelsea', 'FC Porto', 'Boavista', 'QPR', 'Trabzonspor', 'Freamunde']],
    ['tiago', 'Tiago Mendes', 'portugal', ['Chelsea', 'Atlético de Madrid', 'Benfica', 'Juventus', 'Lyon', 'Braga']],
    ['maniche', 'Maniche', 'portugal', ['FC Porto', 'Benfica', 'Chelsea', 'Atlético de Madrid', 'Inter', 'Sporting', 'Dínamo Moscovo', 'Colónia', 'Alverca']],
    ['coentrao', 'Fábio Coentrão', 'portugal', ['Real Madrid', 'Benfica', 'Sporting', 'Monaco', 'Rio Ave', 'Zaragoza', 'Nacional']],
    ['joaomario', 'João Mário (o médio)', 'portugal', ['Sporting', 'Inter', 'Benfica', 'West Ham', 'Lokomotiv Moscovo', 'Vitória de Setúbal'], 'Até 2022/23'],
    ['couto', 'Fernando Couto', 'portugal', ['FC Porto', 'Barcelona', 'Lazio', 'Parma', 'Braga', 'Académica', 'Famalicão']],
    ['paulosousa', 'Paulo Sousa', 'portugal', ['Juventus', 'Benfica', 'Sporting', 'Borussia Dortmund', 'Inter', 'Parma', 'Panathinaikos', 'Espanyol']],
    ['abelxavier', 'Abel Xavier', 'portugal', ['Benfica', 'Liverpool', 'Everton', 'Roma', 'Galatasaray', 'PSV', 'Middlesbrough', 'LA Galaxy', 'Hannover', 'Real Oviedo', 'Bari', 'Estrela da Amadora']],
    ['sergioconc', 'Sérgio Conceição (como jogador)', 'portugal', ['FC Porto', 'Lazio', 'Inter', 'Parma', 'Standard Liège', 'PAOK', 'Penafiel', 'Leça', 'Felgueiras', 'Al-Qadsia']],
    ['renato', 'Renato Sanches', 'portugal', ['Benfica', 'Bayern', 'PSG', 'Lille', 'Roma', 'Swansea City'], 'Até 2023/24'],
    ['andresilva', 'André Silva (o avançado)', 'portugal', ['FC Porto', 'Milan', 'Eintracht Frankfurt', 'RB Leipzig', 'Sevilha', 'Real Sociedad'], 'Até 2023/24'],
    ['guedes', 'Gonçalo Guedes', 'portugal', ['Benfica', 'Valência', 'PSG', 'Wolverhampton', 'Villarreal'], 'Até 2023/24'],
    // estrangeiros
    ['etoo', "Samuel Eto'o", 'mundo', ['Barcelona', 'Inter', 'Chelsea', 'Real Madrid', 'Everton', 'Mallorca', 'Anzhi', 'Sampdoria', 'Espanyol', 'Leganés', 'Antalyaspor', 'Konyaspor', 'Qatar SC']],
    ['falcao', 'Radamel Falcao', 'mundo', ['Atlético de Madrid', 'FC Porto', 'Monaco', 'Manchester United', 'Chelsea', 'River Plate', 'Galatasaray', 'Rayo Vallecano', 'Millonarios', 'Lanceros Boyacá']],
    ['james', 'James Rodríguez', 'mundo', ['Real Madrid', 'FC Porto', 'Bayern', 'Monaco', 'Everton', 'São Paulo', 'Olympiacos', 'Rayo Vallecano', 'Banfield', 'Al-Rayyan', 'Envigado', 'León'], 'Até 2024/25'],
    ['higuain', 'Gonzalo Higuaín', 'mundo', ['Real Madrid', 'Juventus', 'Napoli', 'Milan', 'Chelsea', 'River Plate', 'Inter Miami']],
    ['seedorf', 'Clarence Seedorf', 'mundo', ['Milan', 'Real Madrid', 'Ajax', 'Inter', 'Sampdoria', 'Botafogo']],
    ['davids', 'Edgar Davids', 'mundo', ['Juventus', 'Ajax', 'Milan', 'Barcelona', 'Inter', 'Tottenham', 'Crystal Palace', 'Barnet']],
    ['kluivert', 'Patrick Kluivert', 'mundo', ['Barcelona', 'Ajax', 'Milan', 'Newcastle', 'Valência', 'PSV', 'Lille']],
    ['vannistel', 'Ruud van Nistelrooy', 'mundo', ['Manchester United', 'Real Madrid', 'PSV', 'Hamburgo', 'Málaga', 'Heerenveen', 'Den Bosch']],
    ['robben', 'Arjen Robben', 'mundo', ['Bayern', 'Chelsea', 'Real Madrid', 'PSV', 'Groningen']],
    ['sneijder', 'Wesley Sneijder', 'mundo', ['Inter', 'Real Madrid', 'Ajax', 'Galatasaray', 'Nice', 'Al-Gharafa']],
    ['anelka', 'Nicolas Anelka', 'mundo', ['Arsenal', 'Chelsea', 'Real Madrid', 'PSG', 'Liverpool', 'Manchester City', 'Juventus', 'Fenerbahçe', 'Bolton', 'West Bromwich Albion', 'Shanghai Shenhua', 'Mumbai City']],
    ['torres', 'Fernando Torres', 'mundo', ['Atlético de Madrid', 'Liverpool', 'Chelsea', 'Milan', 'Sagan Tosu']],
    ['villa', 'David Villa', 'mundo', ['Barcelona', 'Valência', 'Atlético de Madrid', 'Sporting de Gijón', 'Zaragoza', 'New York City', 'Melbourne City', 'Vissel Kobe']],
    ['xabialonso', 'Xabi Alonso (como jogador)', 'mundo', ['Real Madrid', 'Liverpool', 'Bayern', 'Real Sociedad', 'Eibar']],
    ['fabregas', 'Cesc Fàbregas', 'mundo', ['Barcelona', 'Arsenal', 'Chelsea', 'Monaco', 'Como']],
    ['owen', 'Michael Owen', 'mundo', ['Liverpool', 'Real Madrid', 'Manchester United', 'Newcastle', 'Stoke City']],
    ['lampard', 'Frank Lampard (como jogador)', 'mundo', ['Chelsea', 'West Ham', 'Manchester City', 'New York City', 'Swansea City']],
    ['balotelli', 'Mario Balotelli', 'mundo', ['Inter', 'Manchester City', 'Milan', 'Liverpool', 'Marseille', 'Nice', 'Brescia', 'Monza', 'Genoa', 'Adana Demirspor', 'Sion', 'Lumezzane'], 'Até 2024'],
    ['alexis', 'Alexis Sánchez', 'mundo', ['Barcelona', 'Arsenal', 'Manchester United', 'Inter', 'Udinese', 'Marseille', 'River Plate', 'Colo-Colo', 'Cobreloa'], 'Até 2024'],
    ['cavani', 'Edinson Cavani', 'mundo', ['PSG', 'Napoli', 'Manchester United', 'Valência', 'Palermo', 'Boca Juniors', 'Danubio'], 'Até 2024'],
    ['tevez', 'Carlos Tevez', 'mundo', ['Manchester United', 'Manchester City', 'Juventus', 'Boca Juniors', 'West Ham', 'Corinthians', 'Shanghai Shenhua']],
    ['mascherano', 'Javier Mascherano', 'mundo', ['Barcelona', 'Liverpool', 'West Ham', 'River Plate', 'Corinthians', 'Estudiantes', 'Hebei China Fortune']],
    ['veron', 'Juan Sebastián Verón', 'mundo', ['Manchester United', 'Lazio', 'Inter', 'Chelsea', 'Parma', 'Sampdoria', 'Estudiantes', 'Boca Juniors']],
    ['crespo', 'Hernán Crespo', 'mundo', ['Chelsea', 'Inter', 'Milan', 'Lazio', 'Parma', 'River Plate', 'Genoa']],
    ['batistuta', 'Gabriel Batistuta', 'mundo', ['Fiorentina', 'Roma', 'Inter', 'Boca Juniors', 'River Plate', "Newell's Old Boys", 'Al-Arabi']],
    ['danialves', 'Dani Alves', 'mundo', ['Barcelona', 'Juventus', 'PSG', 'Sevilha', 'São Paulo', 'Bahia', 'Pumas']],
    ['robinho', 'Robinho', 'mundo', ['Real Madrid', 'Milan', 'Manchester City', 'Santos', 'Atlético Mineiro', 'Guangzhou Evergrande', 'Sivasspor', 'İstanbul Başakşehir']],
    ['forlan', 'Diego Forlán', 'mundo', ['Atlético de Madrid', 'Manchester United', 'Villarreal', 'Inter', 'Independiente', 'Internacional', 'Peñarol', 'Cerezo Osaka', 'Mumbai City', 'Kitchee']],
    ['adebayor', 'Emmanuel Adebayor', 'mundo', ['Arsenal', 'Manchester City', 'Real Madrid', 'Tottenham', 'Monaco', 'Crystal Palace', 'Metz', 'İstanbul Başakşehir', 'Kayserispor', 'Olimpia']],
    ['kpboateng', 'Kevin-Prince Boateng', 'mundo', ['Milan', 'Barcelona', 'Borussia Dortmund', 'Tottenham', 'Schalke 04', 'Eintracht Frankfurt', 'Fiorentina', 'Beşiktaş', 'Hertha Berlim', 'Las Palmas', 'Sassuolo', 'Monza', 'Portsmouth']],
    ['morientes', 'Fernando Morientes', 'mundo', ['Real Madrid', 'Liverpool', 'Valência', 'Monaco', 'Marseille', 'Zaragoza', 'Albacete']],
    ['laudrup', 'Michael Laudrup', 'mundo', ['Barcelona', 'Real Madrid', 'Juventus', 'Ajax', 'Lazio', 'Brøndby', 'Vissel Kobe', 'Kjøbenhavns Boldklub']],
    ['hagi', 'Gheorghe Hagi', 'mundo', ['Real Madrid', 'Barcelona', 'Galatasaray', 'Steaua Bucareste', 'Brescia', 'Farul Constança', 'Sportul Studențesc']],
    ['klinsmann', 'Jürgen Klinsmann (como jogador)', 'mundo', ['Bayern', 'Inter', 'Tottenham', 'Monaco', 'Estugarda', 'Sampdoria', 'Stuttgarter Kickers', 'Orange County Blue Star']],
    ['desailly', 'Marcel Desailly', 'mundo', ['Milan', 'Chelsea', 'Marseille', 'Nantes', 'Al-Gharafa', 'Qatar SC']],
    ['djorkaeff', 'Youri Djorkaeff', 'mundo', ['Inter', 'PSG', 'Monaco', 'Kaiserslautern', 'Bolton', 'Blackburn Rovers', 'Strasbourg', 'Grenoble', 'New York Red Bulls']],
    ['vieira', 'Patrick Vieira (como jogador)', 'mundo', ['Arsenal', 'Juventus', 'Inter', 'Manchester City', 'Milan', 'Cannes']],
    ['makelele', 'Claude Makélélé', 'mundo', ['Real Madrid', 'Chelsea', 'PSG', 'Marseille', 'Nantes', 'Celta de Vigo']],
    ['gullit', 'Ruud Gullit (como jogador)', 'mundo', ['Milan', 'Chelsea', 'PSV', 'Feyenoord', 'Sampdoria', 'Haarlem']],
    ['romario', 'Romário', 'mundo', ['Barcelona', 'PSV', 'Flamengo', 'Vasco da Gama', 'Valência', 'Fluminense', 'Al-Sadd', 'Miami FC', 'Adelaide United', 'América-RJ']],
  ];
  CJ.forEach(([k, quem, cat, r, ate]) => add(`car3-${k}`, 'ligas', 'clube', `Um clube em que ${quem} jogou`, `Na equipa principal (empréstimos contam)${ate ? ', ' + ate.toLowerCase() : ''}`, r));

  // ---------- carreiras de treinadores (clubes, como treinador principal) ----------
  const CT = [
    ['emery', 'Unai Emery', ['Sevilha', 'Arsenal', 'PSG', 'Villarreal', 'Aston Villa', 'Valência', 'Spartak Moscovo', 'Almería', 'Lorca Deportiva'], 'até 2024'],
    ['marcosilva', 'Marco Silva', ['Everton', 'Sporting', 'Fulham', 'Watford', 'Olympiacos', 'Hull City', 'Estoril'], 'até 2024'],
    ['nuno', 'Nuno Espírito Santo', ['Wolverhampton', 'FC Porto', 'Tottenham', 'Valência', 'Nottingham Forest', 'Rio Ave', 'Al-Ittihad'], 'até 2024'],
    ['benitez', 'Rafael Benítez', ['Liverpool', 'Real Madrid', 'Chelsea', 'Inter', 'Napoli', 'Valência', 'Newcastle', 'Everton', 'Celta de Vigo', 'Tenerife', 'Osasuna', 'Real Valladolid', 'Extremadura', 'Dalian Professional'], 'até 2023'],
    ['capello', 'Fabio Capello', ['Milan', 'Real Madrid', 'Juventus', 'Roma', 'Jiangsu Suning'], ''],
    ['hiddink', 'Guus Hiddink', ['Real Madrid', 'Chelsea', 'PSV', 'Valência', 'Fenerbahçe', 'Betis', 'Anzhi'], ''],
  ];
  CT.forEach(([k, quem, r, ate]) => add(`trein3-${k}`, 'ligas', 'clube', `Um clube que ${quem} treinou`, `Como treinador principal de clubes${ate ? ', ' + ate : ''}`, r));

  // ---------- treinadores campeões ----------
  add('camp-trein-pt', 'portugal', 'treinador', 'Um treinador que foi campeão nacional em Portugal desde 2000', 'Campeões da 1.ª Liga de 1999/00 a 2024/25',
    ['Sérgio Conceição', 'Jorge Jesus', 'José Mourinho', 'Rúben Amorim', 'André Villas-Boas', 'Jesualdo Ferreira', 'Rui Vitória', 'Bruno Lage', 'Vítor Pereira', 'Roger Schmidt',
     'Giovanni Trapattoni', 'Co Adriaanse', 'Jaime Pacheco', 'László Bölöni', 'Augusto Inácio', 'Rui Borges']);
  add('camp-trein-es', 'mundo', 'treinador', 'Um treinador que foi campeão de Espanha desde 2000', 'Campeões da Liga espanhola de 1999/00 a 2024/25',
    ['Pep Guardiola', 'Carlo Ancelotti', 'Zinedine Zidane', 'José Mourinho', 'Diego Simeone', 'Luis Enrique', 'Xavi', 'Hansi Flick', 'Frank Rijkaard', 'Vicente del Bosque',
     'Fabio Capello', 'Rafael Benítez', 'Ernesto Valverde', 'Bernd Schuster', 'Tito Vilanova', 'Javier Irureta']);
  add('camp-trein-en', 'mundo', 'treinador', 'Um treinador que foi campeão da Premier League', 'De 1992/93 a 2024/25',
    ['Alex Ferguson', 'Pep Guardiola', 'José Mourinho', 'Arsène Wenger', 'Jürgen Klopp', 'Carlo Ancelotti', 'Antonio Conte', 'Roberto Mancini', 'Claudio Ranieri', 'Manuel Pellegrini', 'Arne Slot', 'Kenny Dalglish']);

  // ---------- campeões e taças de outras ligas ----------
  add('camp-fr', 'mundo', 'clube', 'Um clube que já foi campeão de França', 'Até 2024/25',
    ['PSG', 'Marseille', 'Saint-Étienne', 'Lyon', 'Monaco', 'Nantes', 'Bordeaux', 'Lille', 'Reims', 'Nice', 'Lens', 'Montpellier', 'Auxerre', 'Sochaux', 'Strasbourg', 'Sète', 'Racing Paris', 'Roubaix-Tourcoing', 'Olympique Lillois']);
  add('camp-nl', 'mundo', 'clube', 'Um clube que já foi campeão dos Países Baixos desde 1956/57', 'Eredivisie, até 2024/25', ['Ajax', 'PSV', 'Feyenoord', 'AZ Alkmaar', 'Twente', 'Sparta Roterdão', 'DOS', 'DWS']);
  add('camp-tr', 'mundo', 'clube', 'Um clube que já foi campeão da Turquia', 'Liga turca (desde 1959), até 2024/25', ['Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor', 'Bursaspor', 'İstanbul Başakşehir']);
  add('camp-gr', 'mundo', 'clube', 'Um clube que foi campeão da Grécia desde 1959/60', 'Liga grega, até 2024/25', ['Olympiacos', 'Panathinaikos', 'AEK Atenas', 'PAOK', 'AEL Larissa']);
  add('camp-sco', 'mundo', 'clube', 'Um clube que já foi campeão da Escócia', 'Até 2024/25', ['Celtic', 'Rangers', 'Aberdeen', 'Hearts', 'Hibernian', 'Dundee United', 'Dundee', 'Kilmarnock', 'Motherwell', 'Third Lanark', 'Dumbarton']);
  add('camp-br', 'mundo', 'clube', 'Um clube que foi campeão do Brasil desde 2003', 'Brasileirão (pontos corridos), de 2003 a 2024', ['Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Cruzeiro', 'Fluminense', 'Santos', 'Atlético Mineiro', 'Botafogo']);
  add('libertadores', 'mundo', 'clube', 'Um clube que ganhou a Taça Libertadores desde 2000', 'De 2000 a 2024',
    ['Boca Juniors', 'River Plate', 'Flamengo', 'Palmeiras', 'São Paulo', 'Internacional', 'Corinthians', 'Santos', 'Grémio', 'Fluminense', 'Atlético Mineiro', 'Botafogo', 'Estudiantes', 'San Lorenzo', 'Atlético Nacional', 'LDU Quito', 'Once Caldas', 'Olimpia']);
  add('fa-cup', 'mundo', 'clube', 'Um clube que ganhou a Taça de Inglaterra (FA Cup) desde 1990', 'De 1990 a 2025',
    ['Manchester United', 'Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Tottenham', 'Everton', 'Leicester', 'Crystal Palace', 'Portsmouth', 'Wigan Athletic']);
  add('copa-rei', 'mundo', 'clube', 'Um clube que ganhou a Taça do Rei desde 2000', 'De 2000 a 2025',
    ['Barcelona', 'Real Madrid', 'Atlético de Madrid', 'Sevilha', 'Valência', 'Betis', 'Athletic Bilbao', 'Real Sociedad', 'Espanyol', 'Zaragoza', 'Deportivo da Corunha', 'Mallorca']);
  add('coppa-it', 'mundo', 'clube', 'Um clube que ganhou a Taça de Itália desde 2000', 'De 2000 a 2025', ['Juventus', 'Inter', 'Lazio', 'Napoli', 'Roma', 'Milan', 'Fiorentina', 'Parma', 'Bologna']);
  add('pokal', 'mundo', 'clube', 'Um clube que ganhou a Taça da Alemanha desde 2000', 'De 2000 a 2025',
    ['Bayern', 'Borussia Dortmund', 'Schalke 04', 'Werder Bremen', 'RB Leipzig', 'Bayer Leverkusen', 'Eintracht Frankfurt', 'Wolfsburgo', 'Estugarda', 'Nuremberga']);
  add('coupe-fr', 'mundo', 'clube', 'Um clube que ganhou a Taça de França desde 2000', 'De 2000 a 2025', ['PSG', 'Lyon', 'Lille', 'Bordeaux', 'Nantes', 'Rennes', 'Auxerre', 'Strasbourg', 'Toulouse', 'Sochaux', 'Guingamp', 'Lorient']);
  add('taca-tacas', 'mundo', 'clube', 'Um clube que ganhou a Taça das Taças', 'Todas as edições (1961-1999)',
    ['Barcelona', 'Milan', 'Chelsea', 'Manchester United', 'Arsenal', 'Bayern', 'Juventus', 'Atlético de Madrid', 'Sporting', 'Tottenham', 'Borussia Dortmund', 'Ajax', 'Lazio', 'PSG', 'Valência',
     'Manchester City', 'West Ham', 'Everton', 'Anderlecht', 'Hamburgo', 'Sampdoria', 'Parma', 'Werder Bremen', 'Zaragoza', 'Fiorentina', 'Rangers', 'Aberdeen', 'Dínamo de Kiev',
     'Dínamo Tbilisi', 'Mechelen', 'Magdeburg', 'Slovan Bratislava']);

  // ---------- nomes alternativos e opções extra para a lista ----------
  Object.assign(A, {
    'PSV': ['PSV Eindhoven'], 'AZ Alkmaar': ['AZ'], 'Sparta Roterdão': ['Sparta Rotterdam', 'Sparta'], 'Zaragoza': ['Real Zaragoza'], 'Real Valladolid': ['Valladolid'],
    'Sporting de Gijón': ['Gijón'], 'Rayo Vallecano': ['Rayo'], 'QPR': ['Queens Park Rangers'], 'Hearts': ['Heart of Midlothian'], 'Dínamo de Kiev': ['Dynamo Kyiv', 'Dínamo Kiev'],
    'Dínamo Tbilisi': ['Dinamo Tbilisi'], 'Magdeburg': ['Magdeburgo'], 'Wigan Athletic': ['Wigan'], 'AEL Larissa': ['Larissa'], 'Farul Constança': ['Farul'],
    'Guangzhou Evergrande': ['Guangzhou'], 'Hebei China Fortune': ['Hebei'], 'Jiangsu Suning': ['Jiangsu'], 'Dalian Professional': ['Dalian'], 'İstanbul Başakşehir': ['Başakşehir', 'Basaksehir'],
    'New York Red Bulls': ['MetroStars', 'New York MetroStars'], 'Orange County Blue Star': ['Orange County'], 'América-RJ': ['América do Rio'], 'Lorca Deportiva': ['Lorca'],
    'Olympique Lillois': ['Lillois'], 'Lanceros Boyacá': ['Lanceros'], 'Racing Paris': ['Racing Club de France'], 'Swansea City': ['Swansea'], 'Stoke City': ['Stoke'], 'Hull City': ['Hull'],
    'Xavi': ['Xavi Hernández'], 'Tito Vilanova': ['Vilanova'], 'Rui Borges': ['Borges'], 'Arne Slot': ['Slot'], 'László Bölöni': ['Bölöni', 'Boloni'],
  });
  X.clube.push('Lens', 'Reims', 'Montpellier', 'Auxerre', 'Sochaux', 'Strasbourg', 'Guingamp', 'Lorient', 'Rennes', 'Toulouse', 'Metz', 'Cannes', 'Grenoble',
    'Kaiserslautern', 'Hertha Berlim', 'Hannover', 'Hamburgo', 'Nuremberga', 'Bochum', 'Freiburg', 'Mainz', 'Udinese', 'Torino', 'Genoa', 'Cagliari', 'Sassuolo', 'Brescia', 'Monza', 'Como', 'Venezia',
    'Palermo', 'Bari', 'Empoli', 'Lecce', 'Real Oviedo', 'Albacete', 'Eibar', 'Leganés', 'Getafe', 'Osasuna', 'Málaga', 'Las Palmas', 'Tenerife', 'Real Valladolid', 'Rayo Vallecano',
    'Heerenveen', 'Groningen', 'Den Bosch', 'Utrecht', 'Vitesse', 'Willem II', 'NAC Breda', 'Standard Liège', 'Genk', 'Gent', 'Club Brugge', 'Steaua Bucareste', 'Dínamo Bucareste',
    'Red Star', 'Partizan', 'Sion', 'Grasshoppers', 'Young Boys', 'Kayserispor', 'Konyaspor', 'Antalyaspor', 'Sivasspor', 'Göztepe', 'Panionios', 'Asteras Tripolis',
    'Celtic', 'Rangers', 'Hibernian', 'Hearts', 'Aberdeen', 'Dundee', 'Dundee United', 'Kilmarnock', 'Motherwell', 'St Mirren', 'Blackburn Rovers', 'Bolton', 'Portsmouth', 'Wigan Athletic',
    'QPR', 'Stoke City', 'Swansea City', 'Hull City', 'Barnet', 'Millwall', 'Charlton', 'Sunderland', 'Middlesbrough', 'Ipswich Town', 'Norwich City',
    'Olimpia', 'Cerro Porteño', 'Peñarol', 'Nacional de Montevideu', 'Danubio', 'Colo-Colo', 'Universidad de Chile', 'Cobreloa', 'LDU Quito', 'Barcelona de Guayaquil', 'Atlético Nacional',
    'Millonarios', 'Once Caldas', 'América de Cali', 'Envigado', 'Banfield', 'Lanús', 'Vélez Sarsfield', 'Racing', 'Independiente', 'San Lorenzo', "Newell's Old Boys", 'Rosario Central',
    'Grémio', 'Internacional', 'Athletico Paranaense', 'Bahia', 'Sport Recife', 'Fortaleza', 'Atlético Mineiro', 'Pumas', 'Tigres', 'Monterrey', 'Cruz Azul', 'Toluca',
    'Al-Ahli', 'Al-Shabab', 'Al-Sadd', 'Al-Rayyan', 'Al-Arabi', 'Al-Gharafa', 'Qatar SC', 'Al-Qadsia', 'Shanghai Shenhua', 'Shanghai SIPG', 'Beijing Guoan', 'Vissel Kobe',
    'Sagan Tosu', 'Cerezo Osaka', 'Kashima Antlers', 'Urawa Reds', 'Melbourne City', 'Melbourne Victory', 'Sydney FC', 'Adelaide United', 'Mumbai City', 'Kitchee',
    'New York City', 'Orlando City', 'Toronto FC', 'Seattle Sounders', 'Chicago Fire', 'DC United', 'Miami FC', 'Freamunde', 'Salgueiros', 'Leça', 'Felgueiras', 'Penafiel', 'Alverca');
  X.treinador.push('Massimiliano Allegri', 'Maurizio Sarri', 'Luciano Spalletti', 'Simone Inzaghi', 'Gian Piero Gasperini', 'Stefano Pioli', 'Rudi Garcia', 'Laurent Blanc', 'Christophe Galtier',
    'Leonardo Jardim', 'Paulo Fonseca', 'Abel Ferreira', 'Carlos Carvalhal', 'Pedro Martins', 'Jesualdo Ferreira', 'Manuel José', 'Toni', 'Fernando Santos', 'Quique Flores',
    'Marcelino', 'Julen Lopetegui', 'Pellegrino', 'Mauricio Pochettino', 'Erik ten Hag', 'Ralf Rangnick', 'Ole Gunnar Solskjær', 'David Moyes', 'Mikel Arteta', 'Enzo Maresca');
})();
