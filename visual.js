// ======================================================================
// Fora da Caixa — aspeto (visual.js, carregado depois do modos.js)
// Ícones desenhados (ICO), escudos dos clubes / bandeiras / camisolas nas sugestões, sons e vibração (SOM),
// golo de 100 m especial, pódio na classificação, imagem do resultado de qualquer jogo, medalhas como cromos
// de caderneta, textura de papel e transições. O relvado à noite (modo escuro) está no drawPitch do index.html.
// ======================================================================

// ---------- ícones (traço, 24×24, cor do texto) ----------
const ICO_P = {
  bola: '<circle cx="12" cy="12" r="9"/><path d="M12 7.6l3.5 2.5-1.3 4.1H9.8l-1.3-4.1z"/><path d="M12 7.6V3.1M15.5 10.1l4.2-1.4M14.2 14.2l2.6 3.6M9.8 14.2l-2.6 3.6M8.5 10.1L4.3 8.7"/>',
  infinito: '<path d="M12 12c-2-2.7-3.6-4-5.5-4a4 4 0 0 0 0 8c1.9 0 3.5-1.3 5.5-4zm0 0c2 2.7 3.6 4 5.5 4a4 4 0 0 0 0-8c-1.9 0-3.5 1.3-5.5 4z"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M7.5 14h2M11 14h2M14.5 14h2M7.5 17h2M11 17h2"/>',
  raio: '<path d="M13.5 2.5L5 13.5h6l-1 8 8.5-11h-6z"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6.2"/><path d="M15.2 15.2l5.3 5.3"/><path d="M7.6 9.4a3.2 3.2 0 0 1 2.8-2"/>',
  maismenos: '<path d="M7 20V5M3.5 8.5L7 5l3.5 3.5M17 4v15M13.5 15.5L17 19l3.5-3.5"/>',
  espadas: '<path d="M4 4l10.5 10.5M12.4 16.6l4.2-4.2M14.5 14.5L19 19M20 4L9.5 14.5M7.4 12.4l4.2 4.2M9.5 14.5L5 19"/>',
  taca: '<path d="M8 3.5h8v5.5a4 4 0 0 1-8 0z"/><path d="M8 5.5H5a3 3 0 0 0 3.2 4.4M16 5.5h3a3 3 0 0 1-3.2 4.4M12 13v3.5M9 20.5h6M10 16.5h4v4h-4z"/>',
  grafico: '<path d="M3.5 20.5h17M7 20.5v-6M12 20.5V7.5M17 20.5v-9"/>',
  pessoa: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  prancheta: '<rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 13.5h7M8.5 17h4"/>',
  estadio: '<ellipse cx="12" cy="9" rx="9" ry="3.5"/><path d="M3 9v6c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5V9"/><path d="M8 18.2v-4M16 18.2v-4M12 18.5v-4"/>',
};
const ico = (n, px = 22, sw = 2) => `<svg class="ico" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO_P[n] || ''}</svg>`;
const ICO_MODO = {'7': 'bola', fim: 'infinito', dia: 'calendario', raj: 'raio', quem: 'lupa', mm: 'maismenos', duelo: 'espadas'};
function icones() {
  $('#mNav').innerHTML = MODOS.map(([m, , , nome, cor], i) => `<button role="tab" data-i="${i}" style="--mcn:${cor}">${ico(ICO_MODO[m], 17, 2.2)} ${nome}${m === 'duelo' ? duBadgeHTML : ''}</button>`).join('');
  $('#pcStrip').innerHTML = MODOS.map(([m, , curto, , cor], i) => `<button data-i="${i}" aria-label="${curto}" style="--mcn:${m === 'duelo' ? 'var(--ink)' : cor}">${ico(ICO_MODO[m], 22, 2)}<small>${curto}</small>${m === 'duelo' ? duBadgeHTML : ''}</button>`).join('');
  document.querySelectorAll('.mcard').forEach(c => { const e = c.querySelector('.mc-emo'); if (e) e.innerHTML = ico(ICO_MODO[c.dataset.m], 84, 1.6); });
  const BN = {jogar: 'bola', liga: 'taca', duelo: 'espadas', stats: 'grafico', eu: 'pessoa'};
  document.querySelectorAll('#bnav button').forEach(b => { const bi = b.querySelector('.bi'); if (!bi || !BN[b.dataset.go]) return; const badge = bi.querySelector('.mx-badge');
    bi.innerHTML = ico(BN[b.dataset.go], 23, 2); if (badge) bi.appendChild(badge); });
  const dbi = document.querySelector('#duBan .ic'); if (dbi) dbi.innerHTML = ico('espadas', 26, 2.2);
  try { mMarca(mAtual); } catch (e) {}
  try { if (DU.dados) duRenderHome(); } catch (e) {}
}

// ---------- bandeiras, escudos e camisolas nas sugestões ----------
const ISO = {'África do Sul':'ZA','Albânia':'AL','Alemanha':'DE','Andorra':'AD','Angola':'AO','Arábia Saudita':'SA','Argélia':'DZ','Argentina':'AR','Arménia':'AM','Austrália':'AU','Áustria':'AT','Azerbaijão':'AZ',
  'Bélgica':'BE','Benim':'BJ','Bolívia':'BO','Bósnia':'BA','Brasil':'BR','Bulgária':'BG','Cabo Verde':'CV','Camarões':'CM','Canadá':'CA','Catar':'QA','Cazaquistão':'KZ','Chéquia':'CZ','Chile':'CL','China':'CN',
  'Chipre':'CY','Colômbia':'CO','Congo':'CG','Coreia do Norte':'KP','Coreia do Sul':'KR','Costa do Marfim':'CI','Costa Rica':'CR','Croácia':'HR','Cuba':'CU','Curaçau':'CW','Dinamarca':'DK','Egito':'EG',
  'El Salvador':'SV','Emirados Árabes Unidos':'AE','Equador':'EC','Eslováquia':'SK','Eslovénia':'SI','Espanha':'ES','Estados Unidos':'US','Estónia':'EE','Etiópia':'ET','Finlândia':'FI','França':'FR','Gabão':'GA',
  'Gana':'GH','Geórgia':'GE','Gibraltar':'GI','Grécia':'GR','Guiné-Bissau':'GW','Haiti':'HT','Honduras':'HN','Hungria':'HU','Ilhas Faroé':'FO','Indonésia':'ID','Irão':'IR','Iraque':'IQ','Irlanda':'IE',
  'Islândia':'IS','Israel':'IL','Itália':'IT','Jamaica':'JM','Japão':'JP','Jordânia':'JO','Kuwait':'KW','Letónia':'LV','Libéria':'LR','Listenstaine':'LI','Lituânia':'LT','Luxemburgo':'LU','Macedónia do Norte':'MK',
  'Mali':'ML','Malta':'MT','Marrocos':'MA','México':'MX','Moçambique':'MZ','Moldávia':'MD','Montenegro':'ME','Nigéria':'NG','Noruega':'NO','Nova Zelândia':'NZ','Países Baixos':'NL','Panamá':'PA','Paraguai':'PY',
  'Peru':'PE','Polónia':'PL','Portugal':'PT','RD Congo':'CD','Roménia':'RO','Rússia':'RU','Senegal':'SN','Sérvia':'RS','Sudão':'SD','Suécia':'SE','Suíça':'CH','Togo':'TG','Trindade e Tobago':'TT',
  'Trinidad e Tobago':'TT','Tunísia':'TN','Turquia':'TR','Ucrânia':'UA','Uruguai':'UY','Usbequistão':'UZ','Uzbequistão':'UZ','Venezuela':'VE','Zâmbia':'ZM'};
const BANDEIRA_UK = {'Inglaterra':'gbeng', 'Escócia':'gbsct', 'País de Gales':'gbwls'};
function bandeira(nome) {
  if (ISO[nome]) return [...ISO[nome]].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
  if (BANDEIRA_UK[nome]) return '\u{1F3F4}' + [...BANDEIRA_UK[nome]].map(c => String.fromCodePoint(0xE0000 + c.charCodeAt(0))).join('') + '\u{E007F}';
  if (nome === 'Irlanda do Norte') return '\u{1F1EC}\u{1F1E7}';
  return null;   // seleções que já não existem (URSS, Jugoslávia, RDA…): iniciais
}
const CLUBE_COR = {
  'FC Porto':['#1b4fa0','#fff'], 'Benfica':['#e4252b','#fff'], 'Sporting':['#008a4a','#fff'], 'Braga':['#d71920','#fff'], 'Vitória de Guimarães':['#fff','#111'], 'Marítimo':['#d71920','#0b7a3b'],
  'Boavista':['#111','#fff'], 'Rio Ave':['#0b7a3b','#fff'], 'Belenenses':['#2a6ebb','#fff'], 'Belenenses SAD':['#2a6ebb','#fff'], 'Vitória de Setúbal':['#0b7a3b','#fff'], 'Gil Vicente':['#d71920','#1b3a8a'],
  'União de Leiria':['#111','#fff'], 'Nacional':['#111','#fff'], 'Estrela da Amadora':['#d71920','#0b7a3b'], 'Académica':['#111','#fff'], 'Moreirense':['#0b7a3b','#fff'], 'Estoril':['#ffd200','#1b4fa0'],
  'Santa Clara':['#d71920','#fff'], 'Beira-Mar':['#ffd200','#111'], 'Farense':['#111','#fff'], 'Arouca':['#ffd200','#1b4fa0'], 'Salgueiros':['#d71920','#fff'], 'Famalicão':['#1b4fa0','#fff'],
  'Chaves':['#1b4fa0','#d71920'], 'Tondela':['#ffd200','#0b7a3b'], 'Portimonense':['#111','#fff'], 'Casa Pia':['#111','#fff'], 'Olhanense':['#d71920','#111'], 'Leixões':['#d71920','#fff'],
  'Chelsea':['#034694','#fff'], 'Real Madrid':['#fff','#e8b33a'], 'Inter':['#0a5fb4','#111'], 'Barcelona':['#a50044','#004d98'], 'Milan':['#d71920','#111'], 'Manchester United':['#da291c','#ffe500'],
  'Juventus':['#111','#fff'], 'PSG':['#004170','#da291c'], 'Liverpool':['#c8102e','#f6eb61'], 'Valência':['#fff','#f57c00'], 'Manchester City':['#6cabdd','#fff'], 'Atlético de Madrid':['#cb3524','#fff'],
  'Bayern':['#dc052d','#fff'], 'Tottenham':['#fff','#132257'], 'Ajax':['#fff','#d2122e'], 'Monaco':['#e30613','#fff'], 'Arsenal':['#ef0107','#fff'], 'PSV':['#e30613','#fff'], 'Napoli':['#12a0d7','#fff'],
  'Borussia Dortmund':['#fde100','#111'], 'Roma':['#8e1f2f','#f0bc42'], 'Marseille':['#fff','#2faee0'], 'Parma':['#ffd200','#1b3a8a'], 'Lazio':['#87d8f7','#fff'], 'Everton':['#003399','#fff'],
  'Sampdoria':['#1b4fa0','#fff'], 'Sevilha':['#fff','#d71920'], 'Galatasaray':['#a90432','#fdb912'], 'Fenerbahçe':['#163962','#ffed00'], 'Fiorentina':['#592c82','#fff'], 'River Plate':['#fff','#e2231a'],
  'Feyenoord':['#e30613','#fff'], 'Villarreal':['#ffe667','#005187'], 'Eintracht Frankfurt':['#e1000f','#111'], 'Bayer Leverkusen':['#e32221','#111'], 'Lille':['#e01e13','#1b3a8a'],
  'West Ham':['#7a263a','#1bb1e7'], 'Nottingham Forest':['#dd0000','#fff'], 'Anderlecht':['#4c2b84','#fff'], 'Leicester':['#003090','#fdbe11'], 'Real Sociedad':['#0067b1','#fff'], 'Betis':['#00954c','#fff'],
  'Genoa':['#a51e36','#1b3a8a'], 'Werder Bremen':['#1d9053','#fff'], 'Boca Juniors':['#0b3d91','#fdc82f'], 'Beşiktaş':['#111','#fff'], 'Espanyol':['#007fc8','#fff'], 'Lyon':['#fff','#1b4fa0'],
  'Nantes':['#fcd405','#00845b'], 'Nice':['#d71920','#111'], 'Udinese':['#111','#fff'], 'Aston Villa':['#670e36','#95bfe5'], 'Atalanta':['#1e71b8','#111'], 'Schalke 04':['#004d9d','#fff'],
  'Estugarda':['#fff','#e32219'], 'Wolfsburgo':['#65b32e','#fff'], 'Corinthians':['#fff','#111'], 'Wolverhampton':['#fdb913','#231f20'], 'Strasbourg':['#009fe3','#fff'], 'Trabzonspor':['#6d1b2e','#4fa9e0'],
  'Zaragoza':['#fff','#1b4fa0'], 'Newcastle':['#111','#fff'], 'Celta de Vigo':['#8ac3ee','#fff'], 'Hamburgo':['#fff','#0a3d91'], 'Bologna':['#a21c26','#1a2f48'], 'Flamengo':['#c4161c','#111'],
  'Fluminense':['#7a1437','#00613c'], 'Atlético Mineiro':['#111','#fff'], 'São Paulo':['#fff','#e2231a'], 'Crystal Palace':['#1b458f','#c4122e'], 'Mallorca':['#e20613','#111'], 'RB Leipzig':['#fff','#dd0741'],
  'Rayo Vallecano':['#fff','#e53027'], 'Watford':['#fbee23','#ed2127'], 'Celtic':['#018749','#fff'], 'Borussia Mönchengladbach':['#fff','#111'], 'Blackburn Rovers':['#009ee0','#fff'], 'Torino':['#8a1e03','#fff'],
  'Cagliari':['#a7192d','#002350'], 'Grémio':['#0d80bf','#111'], 'West Bromwich Albion':['#122f67','#fff'], 'Olympiacos':['#e30613','#fff'], 'Rangers':['#1b458f','#fff'], 'Santos':['#fff','#111'],
  'Botafogo':['#111','#fff'], 'Rennes':['#e13327','#111'], 'Fulham':['#fff','#111'], 'Southampton':['#d71920','#fff'], 'Getafe':['#005999','#fff'], 'Girona':['#cd2534','#fff'], 'Brest':['#e30613','#fff'],
  'Athletic Bilbao':['#ee2523','#fff'], 'Deportivo da Corunha':['#1b4fa0','#fff'], 'Palmeiras':['#006437','#fff'], 'Internacional':['#e2231a','#fff'], 'Brighton':['#0057b8','#fff'], 'Bournemouth':['#da291c','#111'],
  'Club Brugge':['#0067ce','#111'], 'Zenit':['#0a8ed6','#fff'], 'Shakhtar Donetsk':['#f37021','#111'], 'Steaua Bucareste':['#1b4fa0','#e30613'], 'Estrela Vermelha':['#e30613','#fff'], 'Panathinaikos':['#007841','#fff'],
  'PAOK':['#111','#fff'], 'Hellas Verona':['#ffd200','#1b3a8a'], 'Twente':['#e30613','#fff'], 'AZ Alkmaar':['#e30613','#fff'], 'Norwich City':['#fff200','#00a650'], 'Ipswich Town':['#0044aa','#fff'],
  'Inter Miami':['#f7b5cd','#231f20'], 'LA Galaxy':['#00245d','#ffd200'], 'Lens':['#ffd200','#e30613'], 'Saint-Étienne':['#00a650','#fff'], 'Bordeaux':['#1b3a8a','#fff'], 'Montpellier':['#1b3a8a','#f57c00'],
  'Toulouse':['#5b2d86','#fff'], 'Cruzeiro':['#1b4fa0','#fff'], 'Al-Nassr':['#fdd700','#1b3a8a'], 'Al-Hilal':['#1b4fa0','#fff'], 'Como':['#1b4fa0','#fff'], 'Venezia':['#111','#f57c00'], 'Osasuna':['#d71920','#1b3a8a'],
  'Granada':['#d71920','#fff'], 'Real Valladolid':['#5b2d86','#fff'], 'Las Palmas':['#ffd200','#1b4fa0'], 'Alavés':['#1b4fa0','#fff'], 'Leganés':['#fff','#1b4fa0'], 'Almería':['#e30613','#fff'],
  'Sassuolo':['#00a650','#111'], 'Lecce':['#ffd200','#e30613'], 'Brentford':['#e30613','#fff'], 'Augsburg':['#ba3733','#46714d'], 'Hoffenheim':['#1961b5','#fff'], 'Bochum':['#005ca9','#fff'],
  'Colónia':['#fff','#e30613'], 'Hertha Berlim':['#005ca9','#fff'], 'Kaiserslautern':['#e30613','#fff'], 'Nuremberga':['#a8173d','#111'], 'Sparta Roterdão':['#e30613','#fff'], 'Groningen':['#00a650','#fff'],
  'Genk':['#1b4fa0','#fff'], 'Standard Liège':['#e30613','#fff'], 'Aberdeen':['#e30613','#fff'], 'Hearts':['#7a1437','#fff'], 'Hibernian':['#00a650','#fff'], 'Portsmouth':['#1b4fa0','#fff'],
  'Swansea City':['#fff','#111'], 'Bolton':['#fff','#1b3a8a'], 'CSKA Moscovo':['#e30613','#1b4fa0'], "Newell's Old Boys":['#e30613','#111'], 'San Lorenzo':['#1b3a8a','#e30613'], 'Estudiantes':['#e30613','#fff'],
  '1860 Munique':['#6cace4','#fff'], 'AEK Atenas':['#ffd200','#111'], 'Ajaccio':['#e30613','#fff'], 'Al-Ittihad':['#ffd200','#111'], 'Al-Ahli':['#007a3d','#fff'], 'América':['#ffd200','#0b3d91'],
  'Angers':['#111','#fff'], 'Argentinos Juniors':['#e30613','#fff'], 'Arminia Bielefeld':['#1b4fa0','#fff'], 'Athletico Paranaense':['#e30613','#111'], 'Atlético Nacional':['#007a3d','#fff'], 'Auxerre':['#fff','#1b4fa0'],
  'Bahia':['#1b4fa0','#e30613'], 'Barcelona de Guayaquil':['#ffd200','#111'], 'Bari':['#fff','#e30613'], 'Basileia':['#e30613','#1b4fa0'], 'Benevento':['#ffd200','#e30613'], 'Bodø/Glimt':['#ffd200','#111'],
  'Brescia':['#1b4fa0','#fff'], 'Brøndby':['#ffd200','#1b4fa0'], 'Bursaspor':['#007a3d','#fff'], 'Cádiz':['#ffd200','#1b4fa0'], 'Cardiff City':['#0070b5','#fff'], 'Catania':['#e30613','#1b4fa0'],
  'Charlton':['#e30613','#fff'], 'Chivas':['#e30613','#fff'], 'Colo-Colo':['#fff','#111'], 'Copenhaga':['#fff','#1b4fa0'], 'Cruz Azul':['#1b4fa0','#fff'], 'Dínamo Bucareste':['#e30613','#fff'],
  'Dínamo de Kiev':['#fff','#1b4fa0'], 'Dínamo Moscovo':['#1b4fa0','#fff'], 'Dínamo Zagreb':['#1b4fa0','#fff'], 'Dundee United':['#f57c00','#111'], 'Elche':['#fff','#007a3d'], 'Empoli':['#1b4fa0','#fff'],
  'Ferencváros':['#007a3d','#fff'], 'Freiburg':['#e30613','#111'], 'Gent':['#1b4fa0','#fff'], 'Grasshoppers':['#1b4fa0','#fff'], 'Hajduk Split':['#fff','#1b4fa0'], 'Hannover':['#e30613','#111'],
  'Heerenveen':['#1b4fa0','#fff'], 'Huddersfield Town':['#0e63ad','#fff'], 'Hull City':['#f5a12d','#111'], 'Independiente':['#e30613','#fff'], 'İstanbul Başakşehir':['#f57c00','#1b3a8a'], 'Kilmarnock':['#1b4fa0','#fff'],
  'Lanús':['#7a1437','#fff'], 'LDU Quito':['#fff','#1b4fa0'], 'Lech Poznań':['#1b4fa0','#fff'], 'Legia Varsóvia':['#fff','#007a3d'], 'Levante':['#1b4fa0','#a50044'], 'Lokomotiv Moscovo':['#e30613','#007a3d'],
  'Lorient':['#f57c00','#111'], 'Luton Town':['#f57c00','#1b3a8a'], 'Mainz':['#c3141e','#fff'], 'Málaga':['#1b9fd8','#fff'], 'Malmö':['#7ab8e6','#fff'], 'Middlesbrough':['#e30613','#fff'],
  'Midtjylland':['#111','#e30613'], 'Millwall':['#1b3a8a','#fff'], 'Molde':['#1b4fa0','#fff'], 'Monterrey':['#1b3a8a','#fff'], 'Monza':['#e30613','#fff'], 'Motherwell':['#f5a12d','#7a1437'],
  'Nacional de Montevideu':['#fff','#1b4fa0'], 'Olympique de Lyon':['#fff','#1b4fa0'], 'Orlando City':['#5b2d86','#fff'], 'Palermo':['#f4a6c8','#111'], 'Partizan':['#111','#fff'], 'Peñarol':['#ffd200','#111'],
  'QPR':['#1b4fa0','#fff'], 'Racing':['#7ab8e6','#fff'], 'Real Oviedo':['#1b4fa0','#fff'], 'Reims':['#e30613','#fff'], 'Rosario Central':['#1b4fa0','#ffd200'], 'Rosenborg':['#fff','#111'],
  'Rubin Kazan':['#a50044','#007a3d'], 'Salernitana':['#7a1437','#fff'], 'Salzburgo':['#fff','#e30613'], 'Seattle Sounders':['#5d9741','#005595'], 'Sheffield United':['#e30613','#fff'], 'Slavia Praga':['#e30613','#fff'],
  'Sochaux':['#ffd200','#1b3a8a'], 'Sparta Praga':['#7a1437','#fff'], 'Spartak Moscovo':['#e30613','#fff'], 'Spezia':['#fff','#111'], 'Sporting de Gijón':['#e30613','#fff'], 'St. Pauli':['#6b4423','#fff'],
  'Stoke City':['#e30613','#fff'], 'Tenerife':['#fff','#1b4fa0'], 'Tigres':['#ffd200','#1b4fa0'], 'Toluca':['#e30613','#fff'], 'Toronto FC':['#e30613','#fff'], 'Union Berlim':['#e30613','#fff'],
  'Utrecht':['#e30613','#fff'], 'Vasco da Gama':['#111','#fff'], 'Vélez Sarsfield':['#fff','#1b4fa0'], 'Vitesse':['#ffd200','#111'], 'Wigan Athletic':['#1b4fa0','#fff'], 'Young Boys':['#ffd200','#111'],
  'Universidad de Chile':['#1b4fa0','#e30613'], 'Viktoria Plzeň':['#e30613','#1b4fa0'], 'Shanghai SIPG':['#e30613','#fff'], 'Guangzhou Evergrande':['#e30613','#fff'], 'Kashima Antlers':['#a50044','#fff'], 'Urawa Reds':['#e30613','#111'],
  'Olimpia':['#fff','#111'], 'New York City':['#6cace4','#fff'], 'New York Red Bulls':['#fff','#ed1e36'], 'Leeds':['#fff','#1d428a'], 'Sunderland':['#e30613','#fff'], 'Burnley':['#6c1d45','#99d6ea'],
};
// camisolas da Premier League desta época (pelo código curto de TEAMS)
const PL_COR = {ARS:['#ef0107','#fff'], AVL:['#670e36','#95bfe5'], BOU:['#da291c','#111'], BRE:['#e30613','#fff'], BHA:['#0057b8','#fff'], BUR:['#6c1d45','#99d6ea'], CHE:['#034694','#fff'], CRY:['#1b458f','#c4122e'],
  EVE:['#003399','#fff'], FUL:['#fff','#111'], IPS:['#0044aa','#fff'], LEE:['#fff','#1d428a'], LEI:['#003090','#fdbe11'], LIV:['#c8102e','#c8102e'], MCI:['#6cabdd','#fff'], MUN:['#da291c','#fff'],
  NEW:['#111','#fff'], NFO:['#dd0000','#fff'], SOU:['#d71920','#fff'], SUN:['#e30613','#fff'], TOT:['#fff','#132257'], WHU:['#7a263a','#1bb1e7'], WOL:['#fdb913','#231f20']};
const iniciais = n => n.replace(/^(FC|CF|SC|AC|AS|SL|CD|UD|RC|SS|US)\s+/i, '').split(/[\s-]+/).filter(w => w.length > 2 || /^[A-Z]{2,}$/.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase() || n.slice(0, 2).toUpperCase();
function escudoSVG(nome, px = 26) {
  const c = CLUBE_COR[nome], s = 'M12 1.8l8.6 3.1v6.2c0 5.3-3.6 9.2-8.6 11.1C7 20.3 3.4 16.4 3.4 11.1V4.9z', id = 'e' + (hashStr(nome) % 1e6);
  if (!c) return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="${s}" fill="var(--panel2)" stroke="var(--mute)" stroke-width="1.3"/><text x="12" y="14.6" text-anchor="middle" font-size="7.2" font-weight="800" font-family="Barlow,sans-serif" fill="var(--mute)">${esc(iniciais(nome))}</text></svg>`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="${id}"><path d="${s}"/></clipPath></defs><g clip-path="url(#${id})"><rect width="24" height="24" fill="${c[0]}"/><rect x="12" width="12" height="24" fill="${c[1]}"/><rect y="0" width="24" height="5" fill="rgba(255,255,255,.18)"/></g><path d="${s}" fill="none" stroke="#1d2b22" stroke-width="1.3" stroke-opacity=".75"/></svg>`;
}
function camisolaSVG(c1, c2, px = 26) {
  return `<svg width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 3.5L3 6.6l2 4.2 2-.9V21h10V9.9l2 .9 2-4.2-5.2-3.1c-.5 1.6-2 2.6-3.8 2.6S8.7 5.1 8.2 3.5z" fill="${c1}" stroke="#1d2b22" stroke-opacity=".75" stroke-width="1.2" stroke-linejoin="round"/><path d="M3 6.6l2 4.2 2-.9-1.4-4.7zM21 6.6l-2 4.2-2-.9 1.4-4.7z" fill="${c2}"/></svg>`;
}
function kitDe(p) {
  if (p.equipa && TEAMS[p.equipa]) { const c = PL_COR[TEAMS[p.equipa][1]] || ['#2f7a4a', '#f3ead6']; return camisolaSVG(c[0], c[1]); }
  if (p.tipo === 'pais') { const f = bandeira(p.nome); return f ? `<span class="kit-f">${f}</span>` : `<span class="kit-t">${esc(iniciais(p.nome))}</span>`; }
  if (p.tipo === 'clube') return escudoSVG(p.nome);
  if (p.tipo === 'jogador' || p.tipo === 'plh') return camisolaSVG('#2f7a4a', '#f3ead6');
  if (p.tipo === 'treinador') return ico('prancheta', 20, 1.8);
  if (p.tipo === 'estadio') return ico('estadio', 20, 1.8);
  return null;
}
sugLine = (orig => function (p) { const r = orig(p); try { const k = kitDe(p); if (k) r[0] = k; } catch (e) {} return r; })(sugLine);

// ---------- sons e vibração (WebAudio, sem ficheiros) ----------
const somLigado = () => ST.som !== false;
const SOM = {ctx: null,
  a() { if (!somLigado()) return null; try { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx; } catch (e) { return null; } },
  ruido(seg) { const c = this.ctx, b = c.createBuffer(1, Math.ceil(c.sampleRate * seg), c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; return s; },
  env(g, t, pico, sobe, dura) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(pico, t + sobe); g.gain.exponentialRampToValueAtTime(0.0001, t + sobe + dura); },
  remate() { const c = this.a(); if (!c) return; const t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + .12); this.env(g, t, .55, .005, .14); o.connect(g).connect(c.destination); o.start(t); o.stop(t + .2);
    const n = this.ruido(.05), f = c.createBiquadFilter(), g2 = c.createGain(); f.type = 'highpass'; f.frequency.value = 1500; this.env(g2, t, .18, .002, .04); n.connect(f).connect(g2).connect(c.destination); n.start(t); },
  bancada(seg, forca, tom = 700) { const c = this.a(); if (!c) return; const t = c.currentTime, n = this.ruido(seg + .3), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.Q.value = .6; f.frequency.setValueAtTime(tom * .7, t); f.frequency.linearRampToValueAtTime(tom, t + seg * .4); this.env(g, t, forca, seg * .25, seg * .75); n.connect(f).connect(g).connect(c.destination); n.start(t); n.stop(t + seg + .3); },
  nota(freq, ini, dura, vol = .12, tipo = 'sawtooth') { const c = this.ctx, t = c.currentTime + ini, o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
    o.type = tipo; o.frequency.value = freq; f.type = 'lowpass'; f.frequency.value = 1800; this.env(g, t, vol, .02, dura); o.connect(f).connect(g).connect(c.destination); o.start(t); o.stop(t + dura + .1); },
  golo(tier) { const c = this.a(); if (!c) return; this.bancada(1 + tier * .35, Math.min(.5, .12 + tier * .07), 600 + tier * 60);
    if (tier >= 6) [523, 659, 784, 1047].forEach((f, i) => this.nota(f, .05 + i * .12, .5 + (i === 3 ? .6 : 0), .1)); },
  falha() { const c = this.a(); if (!c) return; const t = c.currentTime, n = this.ruido(1.1), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.Q.value = .8; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(380, t + .9); this.env(g, t, .14, .1, .8); n.connect(f).connect(g).connect(c.destination); n.start(t); n.stop(t + 1.1); },
  apito() { const c = this.a(); if (!c) return; [0, .35, .7].forEach((ini, i) => { const t = c.currentTime + ini, o = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(), g = c.createGain();
    o.type = 'square'; o.frequency.value = 2900; lfo.frequency.value = 32; lg.gain.value = 120; lfo.connect(lg).connect(o.frequency); this.env(g, t, .05, .01, i === 2 ? .6 : .22);
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2900; o.connect(f).connect(g).connect(c.destination); o.start(t); lfo.start(t); o.stop(t + .9); lfo.stop(t + .9); }); },
};
// a vibração segue o mesmo botão dos sons
try { const v0 = navigator.vibrate && navigator.vibrate.bind(navigator); if (v0) navigator.vibrate = p => somLigado() ? v0(p) : false; } catch (e) {}
function fxRemate() { SOM.remate(); }
function fxGolo(tier) {
  SOM.golo(tier);
  if (tier >= 6) {   // golo de baliza a baliza: o ecrã treme, luz dourada e vibração longa
    const pb = $('#pitchBox'); pb?.animate([{transform:'translate(0,0)'}, {transform:'translate(-6px,3px)'}, {transform:'translate(5px,-4px)'}, {transform:'translate(-4px,2px)'}, {transform:'translate(3px,-2px)'}, {transform:'translate(0,0)'}], {duration: 520, easing: 'ease-out'});
    const l = document.createElement('div'); l.className = 'fx-ouro'; document.body.appendChild(l); setTimeout(() => l.remove(), 1500);
    try { navigator.vibrate && navigator.vibrate([60, 50, 60, 50, 160]); } catch (e) {}
  }
}
function fxFalha() { SOM.falha(); }
function fxDefesa() { SOM.falha(); }
endGame = (orig => function () { const r = orig.apply(this, arguments); try { SOM.apito(); } catch (e) {} setTimeout(resImgBotao, 50); return r; })(endGame);
document.addEventListener('touchend', () => { if (SOM.ctx && SOM.ctx.state === 'suspended') SOM.ctx.resume(); }, {passive: true});

// ---------- pódio e setas na classificação ----------
renderLiga = (orig => function () {
  const r = orig.apply(this, arguments);
  try { if (['hoje', 'semana', 'total'].includes(LTAB) && LG.dados) podio(); } catch (e) {}
  return r;
})(renderLiga);
function podio() {
  const hoje = lisDate(), wk = weekStart(hoje), F = {hoje: d => d === hoje, semana: d => weekStart(d) === wk, total: () => true}[LTAB];
  const rows = totals(F), tab = $('#lgBody .lg-table'); if (!tab || !rows.length) return;
  // setas: lugar agora vs lugar sem os jogos de hoje (não há no separador Hoje)
  if (LTAB !== 'hoje') { const antes = totals(d => F(d) && d !== hoje).map(o => o.nome);
    tab.querySelectorAll('.lg-row').forEach((el, i) => { const a = antes.indexOf(rows[i]?.nome); if (a < 0 || a === i) return; const sobe = a > i;
      el.querySelector('.nm b')?.insertAdjacentHTML('beforeend', `<span class="seta ${sobe ? 'up' : 'dn'}" title="${sobe ? 'subiu' : 'desceu'} hoje">${sobe ? '▲' : '▼'}${Math.abs(a - i)}</span>`); }); }
  if (!rows.some(o => o.pts > 0) || rows.length < 3) return;
  const lug = [1, 0, 2].map(i => ({...rows[i], i}));
  tab.insertAdjacentHTML('beforebegin', `<div class="podio">${lug.map(o => `<div class="pd pd${o.i + 1} ${o.nome === ME ? 'eu' : ''}"><div class="pd-emb">${emb(o.nome, o.i ? 50 : 64)}</div><b>${esc(o.nome)}</b><em>${o.pts}</em><div class="pd-deg"><span>${o.i + 1}</span></div></div>`).join('')}</div>`);
}

// ---------- imagem do resultado de qualquer jogo ----------
function resImgBotao() {
  let b = $('#endImg');
  if (!b) { $('#share').insertAdjacentHTML('afterend', '<button class="st-btn du-img" id="endImg" type="button">📸 Imagem do resultado</button>'); b = $('#endImg'); b.onclick = resImagem; }
  b.hidden = !S || !S.shots?.length || !!S.duelo;   // os duelos têm a imagem deles
}
async function resImagem() {
  if (!S?.shots?.length) return;
  const quem = ME || (typeof CONVIDADO !== 'undefined' && CONVIDADO) || '', lbl = $('#endLbl').textContent || 'Jogo', shots = S.shots;
  try { await Promise.all([document.fonts.load('400 60px "Alfa Slab One"'), document.fonts.load('600 28px Barlow'), document.fonts.load('400 28px Barlow')]); } catch (e) {}
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const DISP = '"Alfa Slab One", Georgia, serif', SANS = 'Barlow, system-ui, sans-serif';
  const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  const txt = (t, x, y, font, cor, al = 'center') => { g.font = font; g.fillStyle = cor; g.textAlign = al; g.textBaseline = 'alphabetic'; g.fillText(t, x, y); };
  const corta = (t, max) => { if (g.measureText(t).width <= max) return t; while (t.length > 3 && g.measureText(t + '…').width > max) t = t.slice(0, -1); return t + '…'; };
  g.fillStyle = '#f3ead6'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#1d2b22'; rr(48, 48, W - 88, H - 88, 44); g.fill();
  g.fillStyle = '#fffaf0'; rr(40, 40, W - 88, H - 88, 44); g.fill(); g.lineWidth = 5; g.strokeStyle = '#1d2b22'; g.stroke();
  // faixa verde com o relvado
  g.save(); rr(40, 40, W - 88, 350, 44); g.clip(); for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#2a6f43' : '#2f7a4a'; g.fillRect(40 + i * 90, 40, 90, 350); } g.restore();
  txt('FORA DA CAIXA', W / 2, 120, `400 44px ${DISP}`, '#fffaf0');
  txt(corta(lbl.toUpperCase(), 820), W / 2, 168, `700 28px ${SANS}`, '#e8b33a');
  txt(String(S.score), W / 2, 318, `400 150px ${DISP}`, '#fffaf0');
  txt('pontos', W / 2, 352, `600 28px ${SANS}`, 'rgba(255,250,240,.85)');
  // quem jogou
  let y = 450;
  if (quem) { const img = typeof emblemaPNG === 'function' && LIGA.jogadores.includes(quem) ? await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = emblemaPNG(quem, true); }) : null;
    g.font = `400 46px ${DISP}`; const w = g.measureText(quem).width, x0 = W / 2 - (w + (img ? 76 : 0)) / 2;
    if (img) g.drawImage(img, x0, y - 52, 60, 75); txt(quem, x0 + (img ? 76 : 0), y, `400 46px ${DISP}`, '#1d2b22', 'left'); y += 40; }
  // os remates
  const golos = shots.filter(s => s.tier).length, longe = Math.max(0, ...shots.map(s => s.tier ? TIERS[s.tier].m : 0));
  txt(`${golos} ${golos === 1 ? 'golo' : 'golos'} em ${shots.length} · remate mais longo: ${longe ? longe + ' m' : '—'}`, W / 2, y + 22, `600 30px ${SANS}`, '#6c6a58'); y += 60;
  const mostra = shots.slice(0, 7), n = mostra.length, lado = 104, esp = 18, xs = W / 2 - (n * lado + (n - 1) * esp) / 2;
  mostra.forEach((s, i) => { const t = TIERS[s.tier], x = xs + i * (lado + esp); g.fillStyle = s.tier ? t.hex : '#d9cdb1'; rr(x, y, lado, lado, 22); g.fill(); g.lineWidth = 3; g.strokeStyle = '#1d2b22'; g.stroke();
    txt(s.tier ? String(t.m) : '✕', x + lado / 2, y + (s.tier ? 62 : 68), `400 ${s.tier ? 40 : 46}px ${DISP}`, s.tier === 6 ? '#fffaf0' : '#1d2b22'); if (s.tier) txt('m', x + lado / 2, y + 88, `700 20px ${SANS}`, s.tier === 6 ? '#fffaf0' : '#1d2b22'); });
  y += lado + 40;
  // as perguntas e o que respondeu
  const passo = Math.min(86, (H - 150 - y) / Math.max(1, n));
  mostra.forEach((s, i) => { const yy = y + i * passo; g.fillStyle = i % 2 ? '#fffaf0' : '#f6eedc'; g.fillRect(90, yy, W - 180, passo - 6);
    g.font = `600 25px ${SANS}`; txt(corta(s.q.txt, 640), 112, yy + 34, `600 25px ${SANS}`, '#1d2b22', 'left');
    g.font = `400 23px ${SANS}`; txt(corta(s.p ? s.p.nome : 'passou', 640), 112, yy + 64, `400 23px ${SANS}`, '#6c6a58', 'left');
    const t = TIERS[s.tier]; g.fillStyle = s.tier ? t.hex : '#d9cdb1'; rr(W - 230, yy + 16, 118, passo - 38, 16); g.fill();
    txt(s.tier ? `${t.m} m` : '—', W - 171, yy + passo / 2 + 6, `400 28px ${DISP}`, s.tier === 6 ? '#fffaf0' : '#1d2b22'); });
  txt(`${new Date().toLocaleDateString('pt-PT', {day: 'numeric', month: 'long', year: 'numeric'})} · brunomvcarmo.github.io/foradacaixa`, W / 2, H - 76, `600 24px ${SANS}`, '#6c6a58');
  const blob = await new Promise(res => c.toBlob(res, 'image/png')), f = new File([blob], 'fora-da-caixa.png', {type: 'image/png'});
  try { if (navigator.canShare && navigator.canShare({files: [f]})) { await navigator.share({files: [f], title: 'Fora da Caixa', text: `${S.score} pontos no Fora da Caixa!`}); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'fora-da-caixa.png'; document.body.appendChild(a); a.click(); a.remove(); toast('Imagem guardada');
}

// ---------- medalhas como cromos de caderneta ----------
const MED_COR = ['#2f7a4a', '#d6452f', '#2b6fae', '#a8750c', '#6b3fa0', '#e07a34'];
medRender = function () {
  const el = $('#euMed'); if (!el) return;
  const ja = ST.med || {}, vistas = ST.medVistas = ST.medVistas || {}, n = MEDALHAS.filter(m => ja[m[0]]).length;
  el.innerHTML = `<div class="du-sec">📒 Caderneta de medalhas <small class="med-n">${n} de ${MEDALHAS.length} cromos</small></div>
    <div class="cad-bar"><i style="width:${Math.round(100 * n / MEDALHAS.length)}%"></i></div>
    <div class="cad">${MEDALHAS.map(([id, ic, nome, desc, val, alvo], k) => {
      const num = String(k + 1).padStart(2, '0');
      if (!ja[id]) { let v = 0; try { v = Math.min(alvo, val()); } catch (e) {}
        return `<div class="cromo vazio"><span class="cr-n">${num}</span><span class="cr-ic">${ic}</span><b>${esc(nome)}</b><small>${esc(desc)}</small>${alvo > 1 ? `<i class="med-bar"><i style="width:${Math.round(100 * v / alvo)}%"></i></i><em>${v} / ${alvo}</em>` : ''}</div>`; }
      const novo = !vistas[id], rot = [-2.2, 1.6, -1, 2.4, -1.8, 1.1][k % 6];
      return `<div class="cromo tem ${novo ? 'novo' : ''}" style="--cr:${MED_COR[k % MED_COR.length]};--rot:${rot}deg"><span class="cr-n">${num}</span>${novo ? '<span class="cr-novo">NOVO!</span>' : ''}<span class="cr-ic">${ic}</span><b>${esc(nome)}</b><small>${esc(desc)}</small><em>${new Date(ja[id]).toLocaleDateString('pt-PT', {day: 'numeric', month: 'short'})}</em><span class="cr-brilho"></span></div>`; }).join('')}</div>`;
  let mud = false; for (const id in ja) if (!vistas[id]) { vistas[id] = 1; mud = true; } if (mud) saveStats(ST);
};

// ---------- sons no ecrã Eu ----------
renderEu = (orig => function () {
  const r = orig.apply(this, arguments);
  if (!$('#euSom')) $('#euTema')?.insertAdjacentHTML('afterend', '<div class="eu-tema" id="euSom"><span>🔊 Sons e vibração</span><div class="seg"><button data-som="1">Ligados</button><button data-som="0">Desligados</button></div></div>');
  document.querySelectorAll('#euSom [data-som]').forEach(b => { b.classList.toggle('on', (b.dataset.som === '1') === somLigado()); b.onclick = () => { ST.som = b.dataset.som === '1'; saveStats(ST); if (ST.som) SOM.remate(); renderEu(); }; });
  return r;
})(renderEu);

// ---------- estilos ----------
document.head.insertAdjacentHTML('beforeend', `<style>
.ico{display:block;flex:none}
.pc-strip button{color:var(--mcn,var(--ink))}.pc-strip button .ico{margin:1px 0 2px}
.mnav button .ico{display:inline-block;vertical-align:-3px;margin-right:2px}
.mc-emo{display:grid;place-items:center;color:#fffaf0}.mc-emo .ico{filter:drop-shadow(3px 4px 0 rgba(0,0,0,.25))}
.bnav .bi{display:grid;place-items:center;height:26px}
.mx-duban .ic .ico{display:block}
.sug .kit,.mx-sug .kit{background:transparent;width:30px;height:30px;display:grid;place-items:center}
.kit-f{font-size:22px;line-height:1}.kit-t{font:800 10px var(--sans);color:var(--mute);background:var(--bg2);border:1px solid var(--line);border-radius:6px;padding:3px 4px}
/* golo de 100 m */
.flashp{animation:flashp 2.6s ease-in-out infinite}.flashp:nth-of-type(3n){animation-delay:1.1s}.flashp:nth-of-type(4n){animation-delay:1.9s}
@keyframes flashp{0%,80%,100%{opacity:.2}85%{opacity:1}}
.fx-ouro{position:fixed;inset:0;pointer-events:none;z-index:60;background:radial-gradient(circle at 50% 40%,rgba(255,214,90,.55),rgba(255,214,90,0) 60%);animation:fxOuro 1.4s ease-out forwards}
@keyframes fxOuro{0%{opacity:0}15%{opacity:1}100%{opacity:0}}
/* pódio */
.podio{display:grid;grid-template-columns:1fr 1.08fr 1fr;align-items:end;gap:8px;margin:4px 2px 14px}
.pd{display:flex;flex-direction:column;align-items:center;gap:2px;animation:pdSobe .6s cubic-bezier(.2,.8,.2,1) both}
.pd2{animation-delay:.12s}.pd3{animation-delay:.24s}
.pd b{font-size:15px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pd em{font-style:normal;font-family:var(--display);font-size:22px;line-height:1}
.pd.eu b{text-decoration:underline;text-underline-offset:3px}
.pd-emb .emb{margin:0;filter:drop-shadow(0 3px 0 rgba(0,0,0,.18))}
.pd-deg{width:100%;margin-top:6px;border:2px solid var(--dark);border-bottom:0;border-radius:12px 12px 0 0;display:grid;place-items:center;box-shadow:inset 0 -6px 0 rgba(0,0,0,.08)}
.pd-deg span{font-family:var(--display);font-size:26px;color:#1d2b22}
.pd1 .pd-deg{height:78px;background:linear-gradient(180deg,#f2c84b,#e0a92a)}.pd2 .pd-deg{height:56px;background:linear-gradient(180deg,#e4e4e4,#c2c2c2)}.pd3 .pd-deg{height:42px;background:linear-gradient(180deg,#e6a56a,#c98140)}
@keyframes pdSobe{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.seta{font-size:11px;font-weight:800;margin-left:6px;vertical-align:1px}.seta.up{color:var(--acc-t)}.seta.dn{color:var(--red)}
/* caderneta */
.cad-bar{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin:6px 2px 10px}.cad-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--t2),var(--t3))}
.cad{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 8px;margin:0 0 16px;padding:12px 10px;border-radius:16px;background:var(--panel2);border:1px solid var(--line)}
.cromo{position:relative;aspect-ratio:3/4.1;border-radius:10px;padding:16px 6px 8px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:2px;overflow:hidden}
.cromo.vazio{border:2px dashed var(--line);background:var(--bg2);opacity:.85}
.cromo.vazio .cr-ic{filter:grayscale(1);opacity:.35}.cromo.vazio b{color:var(--mute)}
.cromo.tem{background:var(--cr);border:4px solid #fffaf0;box-shadow:0 3px 0 rgba(0,0,0,.18),0 6px 14px rgba(0,0,0,.12);transform:rotate(var(--rot));color:#fffaf0}
.cromo.tem b,.cromo.tem small,.cromo.tem em{color:#fffaf0}.cromo.tem small{opacity:.9}
.cr-n{position:absolute;top:4px;left:6px;font:800 10px var(--sans);opacity:.6}
.cr-ic{font-size:30px;line-height:1.1;margin-top:2px}.cromo.tem .cr-ic{filter:drop-shadow(0 2px 0 rgba(0,0,0,.25))}
.cromo b{font-size:12.5px;line-height:1.1;margin-top:2px}.cromo small{font-size:10.5px;line-height:1.15;color:var(--mute)}
.cromo em{font-style:normal;font-size:10.5px;font-weight:800;margin-top:auto;color:var(--mute)}
.cromo .med-bar{width:80%;margin-top:auto}
.cr-brilho{position:absolute;inset:0;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.35) 48%,transparent 60%);transform:translateX(-120%);pointer-events:none}
.cromo.novo .cr-brilho{animation:crBrilho 1.6s .3s ease-in-out 2}
.cromo.novo{animation:crCola .55s cubic-bezier(.2,1.4,.4,1) both}
.cr-novo{position:absolute;top:6px;right:-22px;transform:rotate(35deg);background:var(--t3);color:#1d2b22;font:800 9px var(--sans);padding:2px 24px}
@keyframes crBrilho{to{transform:translateX(120%)}}
@keyframes crCola{from{transform:scale(1.35) rotate(0);opacity:0}to{transform:rotate(var(--rot));opacity:1}}
/* textura de papel */
body{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .2 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E"),radial-gradient(1000px 520px at 50% -220px,var(--glow,#fbf5e6) 0%,var(--bg) 62%)!important;background-attachment:fixed!important}
/* toques: os botões afundam */
.pc-strip button,.du-op,.lg-row,.tc-mini,.mu-mini,.qe-paga,.eu-tema .seg button,.st-btn,.mode{transition:transform .12s ease}
.pc-strip button:active,.du-op:active,.tc-mini:active,.qe-paga:active,.st-btn:active,.bnav button:active{transform:translateY(1px) scale(.96)}
.btn:active{transform:translateY(2px) scale(.985)}
.bnav button:active .bi{transform:scale(.9)}
@media (prefers-reduced-motion: reduce){.screen.on,.pd,.cromo.novo,.cromo.novo .cr-brilho,.fx-ouro{animation:none!important}}
</style>`);

icones();
