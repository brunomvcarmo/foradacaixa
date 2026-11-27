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
// "Partilhar" no fim do jogo: escolhe entre a imagem do resultado e a capa do jornal (os duelos têm a imagem deles)
function resImgBotao() {
  const b = $('#endPart'), sh = $('#share'); if (!b) return;
  b.hidden = !S || !S.shots?.length || !!S.duelo;
  b.onclick = () => $('#partDlg').showModal();
  // o "Partilhar" de texto (liga e Sem fim) passa para dentro deste menu: não ficam dois botões "Partilhar"
  const t = sh.textContent.trim(), txt = !S?.duelo && t === 'Partilhar';
  sh.hidden = txt; $('#partTxt').hidden = !txt;
  if (t === 'Desafiar amigo') sh.innerHTML = '<span>🤝</span>Desafiar';
}
$('#partTxt').onclick = () => { $('#partDlg').close(); share(); };
$('#partImg').onclick = () => { $('#partDlg').close(); resImagem(); };
$('#partJornal').onclick = () => { $('#partDlg').close(); jornalImagem(); };
$('#partX').onclick = () => $('#partDlg').close();
$('#partDlg').addEventListener('click', e => { if (e.target === $('#partDlg')) $('#partDlg').close(); });
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

// ---------- repetição dos golaços (50 m e 100 m): o mesmo remate em câmara lenta ----------
async function repeticao(tier, kind, sorte) {
  await sleep(700);
  const box = $('#pitchBox'); if (!box || !$('#s-game').classList.contains('on') || typeof PV === 'undefined') return;
  drawPitch($('#pitch'), PV);
  box.classList.add('replay');
  box.insertAdjacentHTML('beforeend', '<div class="rp-tag"><i></i>REPETIÇÃO<button type="button">saltar ›</button></div>');
  const tag = box.querySelector('.rp-tag'); let saltar = false;
  const salta = e => { e?.stopPropagation(); saltar = true; TEMPO = .05; };
  tag.querySelector('button').onclick = salta; box.addEventListener('click', salta, {once: true});   // tocar no relvado também salta
  TEMPO = 1.8;
  try { await shoot(tier, kind, rng(sorte)); } catch (e) {}
  TEMPO = 1;
  box.removeEventListener('click', salta);
  if (!saltar) await sleep(350);
  box.classList.remove('replay'); tag.remove();
}

// ---------- capa do jornal no fim de cada jogo ----------
function jornalDados() {
  const sh = S.shots, golos = sh.filter(x => x.tier).length, melhor = sh.reduce((b, x) => x.tier > (b?.tier || 0) ? x : b, null);
  const quem = ME || (typeof CONVIDADO !== 'undefined' && CONVIDADO) || 'O jogador', Q = quem.toUpperCase();
  const rec = /recorde/i.test($('#endRec')?.textContent || ''), cem = sh.filter(x => x.tier >= 6).length, n = sh.length, sete = n === 7 && golos === 7;
  const m = melhor ? TIERS[melhor.tier].m : 0;
  let tit, ante;
  if (sete && cem) { tit = `${Q} FAZ O PLENO E MARCA DE BALIZA A BALIZA!`; ante = 'Noite histórica'; }
  else if (cem >= 2) { tit = `${cem} GOLOS DE 100 METROS: ${Q} NÃO É DESTE PLANETA`; ante = 'Inacreditável'; }
  else if (cem) { tit = `GOLAÇO DE 100 METROS DE ${Q}!`; ante = 'De baliza a baliza'; }
  else if (sete) { tit = `SETE EM SETE: ${Q} IMPARÁVEL`; ante = 'Pleno'; }
  else if (rec) { tit = `${Q} BATE O RECORDE: ${S.score} PONTOS`; ante = 'Recorde pessoal'; }
  else if (n && golos <= Math.floor(n / 3)) { tit = `NOITE PARA ESQUECER: ${Q} SÓ MARCA ${golos}`; ante = 'Crise no ataque'; }
  else if (m >= 50) { tit = `${Q} MARCA DO MEIO-CAMPO E SOMA ${S.score} PONTOS`; ante = 'Golaço'; }
  else { tit = `${Q} SOMA ${S.score} PONTOS`; ante = golos >= n - 1 ? 'Exibição sólida' : 'Jogo dividido'; }
  const lead = melhor ? `Ao responder «${melhor.p.nome}» à pergunta “${melhor.q.txt}”, ${quem} mandou a bola de ${m} metros${melhor.tier >= 6 ? ', de baliza a baliza' : ''}.` : `${quem} não conseguiu marcar: o guarda-redes defendeu tudo.`;
  const falhas = sh.filter(x => !x.tier), falha = falhas[0];
  const outra = falha ? `Em “${falha.q.txt}”, ${falhas.length === 1 ? 'a única que escapou' : `uma das ${falhas.length} que escaparam`}${falha.q.valid[0] ? `: bastava dizer ${falha.q.valid[0].nome}` : ''}.` : 'Nenhuma pergunta ficou por responder.';
  return {tit, ante, lead, outra, golos, n, m, quem, data: new Date().toLocaleDateString('pt-PT', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}), num: (ST.jogos || 0) + 1000, modo: $('#endLbl').textContent};
}
function jornalRender() {
  let el = $('#endJornal');
  if (!el) { $('#recap').insertAdjacentHTML('beforebegin', '<div class="jornal" id="endJornal"></div>'); el = $('#endJornal'); }
  if (!S?.shots?.length) { el.hidden = true; return; }
  const J = jornalDados(); el.hidden = false;
  el.innerHTML = `<details class="jn-d"><summary><span class="jn-k">📰 Diário Fora da Caixa</span><b>${esc(J.tit)}</b><em>ver a capa ›</em></summary>
    <div class="jn-top"><span>N.º ${J.num}</span><b>Diário Fora da Caixa</b><span>0,90 €</span></div>
    <div class="jn-data">${esc(J.data)} · ${esc(J.modo)}</div>
    <div class="jn-ante">${esc(J.ante)}</div><h3 class="jn-tit">${esc(J.tit)}</h3>
    <div class="jn-cols"><p class="jn-lead">${esc(J.lead)}</p><div class="jn-ficha"><b>FICHA</b><span>${J.golos}/${J.n} golos</span><span>${J.m ? J.m + ' m' : '—'} remate mais longo</span><span>${S.score} pontos</span></div></div>
    <p class="jn-outra">${esc(J.outra)}</p></details>`;
}
async function partilharCanvas(c, ficheiro, texto) {
  const blob = await new Promise(res => c.toBlob(res, 'image/png')), f = new File([blob], ficheiro, {type: 'image/png'});
  try { if (navigator.canShare && navigator.canShare({files: [f]})) { await navigator.share({files: [f], title: 'Fora da Caixa', text: texto}); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = ficheiro; document.body.appendChild(a); a.click(); a.remove(); toast('Imagem guardada');
}
async function jornalImagem() {
  const J = jornalDados();
  try { await Promise.all([document.fonts.load('400 60px "Alfa Slab One"'), document.fonts.load('600 28px Barlow')]); } catch (e) {}
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const DISP = '"Alfa Slab One", Georgia, serif', SERIF = 'Georgia, "Times New Roman", serif', SANS = 'Barlow, system-ui, sans-serif';
  const txt = (t, x, y, font, cor, al = 'left') => { g.font = font; g.fillStyle = cor; g.textAlign = al; g.fillText(t, x, y); };
  const quebra = (t, font, max) => { g.font = font; const ws = t.split(' '), ls = []; let l = ''; for (const w of ws) { const n = l ? l + ' ' + w : w; if (g.measureText(n).width > max && l) { ls.push(l); l = w; } else l = n; } if (l) ls.push(l); return ls; };
  g.fillStyle = '#efe6d2'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(80,60,30,${Math.random() * .05})`; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }   // grão do papel
  const M = 70; g.fillStyle = '#1d2b22';
  txt(`N.º ${J.num}`, M, 92, `700 26px ${SANS}`, '#1d2b22'); txt('0,90 €', W - M, 92, `700 26px ${SANS}`, '#1d2b22', 'right');
  txt('DIÁRIO', W / 2, 108, `400 40px ${DISP}`, '#d6452f', 'center');
  txt('FORA DA CAIXA', W / 2, 196, `400 92px ${DISP}`, '#1d2b22', 'center');
  g.fillRect(M, 222, W - 2 * M, 6); g.fillRect(M, 234, W - 2 * M, 2);
  txt(`${J.data} · ${J.modo}`.toUpperCase(), W / 2, 272, `700 24px ${SANS}`, '#6c6a58', 'center');
  g.fillRect(M, 292, W - 2 * M, 2);
  g.font = `800 30px ${SANS}`; const aw = g.measureText(J.ante.toUpperCase()).width + 36; g.fillStyle = '#d6452f'; g.fillRect(M, 322, aw, 48); txt(J.ante.toUpperCase(), M + 18, 356, `800 30px ${SANS}`, '#fffaf0');
  let y = 452; const tam = quebra(J.tit, `400 84px ${DISP}`, W - 2 * M).length > 3 ? 66 : 84; for (const l of quebra(J.tit, `400 ${tam}px ${DISP}`, W - 2 * M)) { txt(l, M, y, `400 ${tam}px ${DISP}`, '#1d2b22'); y += tam * 1.08; }
  y += 20; g.fillStyle = '#1d2b22'; g.fillRect(M, y, W - 2 * M, 2); y += 56;
  // coluna da notícia e ficha
  const colW = 600; let yl = y; for (const l of quebra(J.lead, `400 34px ${SERIF}`, colW)) { txt(l, M, yl, `400 34px ${SERIF}`, '#1d2b22'); yl += 46; }
  yl += 14; for (const l of quebra(J.outra, `italic 28px ${SERIF}`, colW)) { txt(l, M, yl, `italic 28px ${SERIF}`, '#6c6a58'); yl += 38; }
  const fx = M + colW + 40, fw = W - M - fx; g.strokeStyle = '#1d2b22'; g.lineWidth = 3; g.strokeRect(fx, y - 40, fw, 356);
  txt('FICHA DO JOGO', fx + fw / 2, y + 4, `800 24px ${SANS}`, '#d6452f', 'center');
  [[`${J.golos}/${J.n}`, 'golos'], [J.m ? `${J.m} m` : '—', 'remate mais longo'], [String(S.score), 'pontos']].forEach(([v, l], i) => { txt(v, fx + fw / 2, y + 74 + i * 92, `400 50px ${DISP}`, '#1d2b22', 'center'); txt(l, fx + fw / 2, y + 102 + i * 92, `600 22px ${SANS}`, '#6c6a58', 'center'); });
  // os remates, como fotografias pequenas
  const yb = H - 210, sh = S.shots.slice(0, 7), lado = 100, esp = 20, xs = W / 2 - (sh.length * lado + (sh.length - 1) * esp) / 2;
  sh.forEach((s, i) => { const t = TIERS[s.tier], x = xs + i * (lado + esp); g.fillStyle = s.tier ? t.hex : '#d9cdb1'; g.fillRect(x, yb, lado, lado); g.strokeStyle = '#1d2b22'; g.lineWidth = 3; g.strokeRect(x, yb, lado, lado);
    txt(s.tier ? `${t.m}` : '✕', x + lado / 2, yb + 62, `400 38px ${DISP}`, s.tier === 6 ? '#fffaf0' : '#1d2b22', 'center'); });
  g.fillStyle = '#1d2b22'; g.fillRect(M, H - 82, W - 2 * M, 2);
  txt('brunomvcarmo.github.io/foradacaixa', W / 2, H - 44, `700 24px ${SANS}`, '#6c6a58', 'center');
  partilharCanvas(c, 'fora-da-caixa-jornal.png', J.tit);
}
endGame = (orig => function () { const r = orig.apply(this, arguments); setTimeout(() => { try { jornalRender(); } catch (e) {} }, 80); return r; })(endGame);

// ---------- quadro da taça em árvore ----------
function tacaArvore(e) {
  const R = e.rondas; if (!R?.length) return '';
  const filhos = {};   // 'k:j' → fontes ({bye} ou {k, j})
  let entram = e.sor.byes.map(n => ({bye: n}));
  for (let k = 0; k < R.length - 1; k++) {
    const slots = [...entram, ...R[k].jogos.map((m, j) => ({k, j}))];
    R[k + 1].jogos.forEach((m, i) => { filhos[`${k + 1}:${i}`] = [slots[i], slots[slots.length - 1 - i]]; });
    entram = [];
  }
  const LIN = 62, BW = 118, GAP = 24, pos = {}, caixas = [];
  let folha = 0;
  const coloca = (no) => {
    const id = no.bye ? 'b:' + no.bye : `${no.k}:${no.j}`, fs = no.bye ? null : filhos[id];
    let y; if (!fs) y = folha++ * LIN; else { const ys = fs.map(coloca); y = (ys[0] + ys[1]) / 2; }
    pos[id] = {x: (no.bye ? 0 : no.k) * (BW + GAP), y}; return y;
  };
  const final = {k: R.length - 1, j: 0}; coloca(final);
  const linhas = [], hoje = lisDate();
  for (const [id, fs] of Object.entries(filhos)) { const p = pos[id]; for (const f of fs) { const c = pos[f.bye ? 'b:' + f.bye : `${f.k}:${f.j}`]; if (!c) continue;
    const x1 = c.x + BW, y1 = c.y + 24, x2 = p.x, y2 = p.y + 24, xm = (x1 + x2) / 2; linhas.push(`M${x1} ${y1}H${xm}V${y2}H${x2}`); } }
  const lado = (n, tot, venc) => n ? `<div class="ta-l ${venc === n ? 'v' : venc ? 'p' : ''} ${n === ME ? 'eu' : ''}">${emb(n, 16)}<span>${esc(n)}</span><em>${tot ?? ''}</em></div>` : '<div class="ta-l tbd"><span>a decidir</span></div>';
  for (const [id, p] of Object.entries(pos)) {
    if (id.startsWith('b:')) { const n = id.slice(2); caixas.push(`<div class="ta-c bye" style="left:${p.x}px;top:${p.y}px">${lado(n)}<small>passa diretamente</small></div>`); continue; }
    const [k, j] = id.split(':').map(Number), m = R[k].jogos[j], jog = m.jogado || R[k].dia < hoje;
    caixas.push(`<div class="ta-c ${R[k].dia === hoje ? 'hoje' : ''}" style="left:${p.x}px;top:${p.y}px">${lado(m.a, jog ? m.ta : null, m.venc)}${lado(m.b, jog ? m.tb : null, m.venc)}</div>`);
  }
  const fp = pos[`${R.length - 1}:0`], cx = fp.x + BW + GAP; linhas.push(`M${fp.x + BW} ${fp.y + 24}H${cx}`);
  caixas.push(`<div class="ta-c camp ${e.campeao ? 'tem' : ''}" style="left:${cx}px;top:${fp.y}px"><div class="ta-taca">🏆</div>${e.campeao ? `${emb(e.campeao, 18)}<b>${esc(e.campeao)}</b>` : '<b>?</b>'}</div>`);
  const cab = R.map((r, k) => `<span style="left:${k * (BW + GAP)}px">${esc(r.nome)}<small>${diaCurto(r.dia)}</small></span>`).join('') + `<span style="left:${cx}px">Campeão</span>`;
  const larg = cx + BW, alt = Math.max(...Object.values(pos).map(p => p.y)) + 56;
  return `<div class="ta-wrap"><div class="ta" style="width:${larg}px"><div class="ta-cab">${cab}</div><div class="ta-in" style="height:${alt}px"><svg width="${larg}" height="${alt}" aria-hidden="true"><path d="${linhas.join('')}" fill="none" stroke="var(--line)" stroke-width="2.5"/></svg>${caixas.join('')}</div></div></div>`;
}
tacaHTML = (orig => function () {
  const h = orig.apply(this, arguments);
  try { if (!TC.id && !TC.ant) return h; const i = h.indexOf('<div class="tc-ronda'); if (i < 0) return h;
    return h.slice(0, i) + tacaArvore(tacaEst(TC.id ? 'id' : 'ant')) + '<h3 class="lg-h" style="margin-top:14px">Jogo a jogo</h3>' + h.slice(i); } catch (e) { return h; }
})(tacaHTML);

document.head.insertAdjacentHTML('beforeend', `<style>
/* repetição */
#pitchBox.replay svg{filter:saturate(.75) contrast(1.05)}
.rp-tag{position:absolute;top:8px;left:8px;z-index:5;display:flex;align-items:center;gap:7px;background:rgba(20,20,20,.78);color:#fff;font:800 12px var(--sans);letter-spacing:.12em;padding:5px 6px 5px 10px;border-radius:8px}
.rp-tag i{width:8px;height:8px;border-radius:50%;background:#e33;animation:rpPisca 1s infinite}
.rp-tag button{border:0;background:rgba(255,255,255,.16);color:#fff;font:700 11px var(--sans);letter-spacing:0;padding:3px 7px;border-radius:6px;cursor:pointer}
@keyframes rpPisca{50%{opacity:.2}}
/* capa do jornal */
.jn-d summary{list-style:none;cursor:pointer;display:grid;gap:2px}
.jn-d summary::-webkit-details-marker{display:none}
.jn-d summary .jn-k{font:700 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:#6c6a58}
.jn-d summary b{font-family:var(--display);font-weight:400;font-size:19px;line-height:1.15}
.jn-d summary em{font:600 12.5px var(--sans);font-style:normal;color:#1e5a37}
.jn-d[open] summary{display:none}
.jornal{margin:16px 0 6px;padding:14px 16px 12px;background:#efe6d2;color:#1d2b22;border:2px solid var(--dark);box-shadow:var(--shadow);border-radius:6px;font-family:Georgia,'Times New Roman',serif;transform:rotate(-.6deg)}
.jn-top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:4px double #1d2b22;padding-bottom:6px;font:700 11px var(--sans)}
.jn-top b{font-family:var(--display);font-weight:400;font-size:21px;letter-spacing:.01em}
.jn-data{font:700 10.5px var(--sans);color:#6c6a58;text-transform:uppercase;letter-spacing:.06em;text-align:center;padding:4px 0;border-bottom:1px solid #1d2b22}
.jn-ante{display:inline-block;margin-top:10px;background:#d6452f;color:#fffaf0;font:800 11px var(--sans);text-transform:uppercase;letter-spacing:.06em;padding:2px 8px}
.jn-tit{font-family:var(--display);font-weight:400;font-size:24px;line-height:1.08;margin:6px 0 8px;color:#1d2b22}
.jn-cols{display:grid;grid-template-columns:1fr 96px;gap:12px;border-top:1px solid #1d2b22;padding-top:8px}
.jn-lead{margin:0;font-size:14.5px;line-height:1.4}
.jn-lead::first-letter{font-family:var(--display);font-size:30px;float:left;line-height:.9;margin:3px 5px 0 0}
.jn-ficha{border:2px solid #1d2b22;padding:6px;display:flex;flex-direction:column;gap:4px;text-align:center;font:600 11px var(--sans);color:#6c6a58}
.jn-ficha b{color:#d6452f;font-weight:800;font-size:10.5px;letter-spacing:.06em}
.jn-outra{margin:8px 0 10px;font-style:italic;font-size:13px;color:#6c6a58;line-height:1.35}
.jornal .st-btn{margin:0;background:#1d2b22;color:#efe6d2;border-color:#1d2b22}
/* quadro da taça */
.ta-wrap{overflow-x:auto;margin:4px -4px 6px;padding:4px 4px 10px;-webkit-overflow-scrolling:touch}
.ta{position:relative}
.ta-cab{position:relative;height:34px}.ta-cab span{position:absolute;top:0;width:118px;font:800 12px var(--sans);text-transform:uppercase;letter-spacing:.04em;color:var(--ink)}
.ta-cab small{display:block;font-weight:600;text-transform:none;letter-spacing:0;color:var(--mute)}
.ta-in{position:relative}.ta-in svg{position:absolute;inset:0}
.ta-c{position:absolute;width:118px;background:var(--panel);border:1.5px solid var(--line);border-radius:10px;overflow:hidden;box-shadow:0 2px 0 rgba(0,0,0,.06)}
.ta-c.hoje{border:2px solid var(--acc)}
.ta-c.bye{background:var(--bg2);border-style:dashed}.ta-c.bye small{display:block;font:600 10px var(--sans);color:var(--mute);padding:0 8px 4px 32px}
.ta-l{display:flex;align-items:center;gap:6px;padding:3px 8px;height:24px;font:600 12.5px var(--sans)}.ta-l+.ta-l{border-top:1px solid var(--line)}
.ta-l span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ta-l em{font-style:normal;font-family:var(--display);font-size:13px}
.ta-l .emb{margin:0}.ta-l.v{background:color-mix(in oklab,var(--acc) 14%,var(--panel))}.ta-l.v span{font-weight:800}.ta-l.p{opacity:.5}.ta-l.eu span{text-decoration:underline;text-underline-offset:2px}
.ta-l.tbd{color:var(--mute);font-weight:500}
.ta-c.camp{display:flex;align-items:center;gap:6px;padding:0 8px;height:50px;border:2px solid var(--t3);background:color-mix(in oklab,var(--t3) 18%,var(--panel))}
.ta-c.camp b{font-family:var(--display);font-weight:400;font-size:15px}.ta-taca{font-size:22px}.ta-c.camp .emb{margin:0}
</style>`);

// ---------- comentário no golo (por cima do resultado de cada pergunta) ----------
const COMENT = {
  0: ['O guarda-redes adivinhou...', 'Ao lado! Fica para a próxima.', 'Uhhh! Quase!', 'O guarda-redes nem precisou de se esticar.'],
  1: ['De penálti, sem espinhas.', 'Golo fácil, mas conta!', 'Aquela que toda a gente sabia.', 'Simples e eficaz.'],
  2: ['Bem colocada, à entrada da área.', 'Golo de quem sabe.', 'Sem pressa, para o fundo da baliza.'],
  3: ['Fora da caixa! Já poucos se lembravam d{e} {n}.', 'Remate seco, de fora da área!', 'Bonito golo! {n}, quem diria.'],
  4: ['Que bomba! {N} — esta ninguém esperava!', 'Do meio da rua, e entrou!', 'Disparo de longe… e lá dentro!'],
  5: ['DO MEIO-CAMPO! {N}?! Onde é que foste buscar isso?', 'Golaço! A bancada levantou-se toda!', 'Inacreditável! {N} do meio-campo!'],
  6: ['DE BALIZA A BALIZA! {N}! Isto vai passar no resumo durante anos!', 'Inacreditável! O guarda-redes nem viu a bola!', 'GOLO DO ANO! {N}! Ninguém no mundo se lembrava!'],
};
function comentario(tier, p, timeout) {
  if (timeout) return ['Acabou o tempo! O árbitro já tinha o apito na boca.', 'Tempo! A bola não chegou a sair.'][Math.floor(Math.random() * 2)];
  const l = COMENT[tier] || COMENT[0], f = l[Math.floor(Math.random() * l.length)], n = p?.nome || '';
  return f.replace('{N}', n.toUpperCase()).replace(/\{n\}/g, n).replace('d{e} ', 'de ');
}
renderReveal = (orig => function (q, p, tier, pts, timeout) {
  const r = orig.apply(this, arguments);
  // o comentário fica numa linha só, logo por baixo do resultado (sem caixa à parte)
  try { const rv = $('#reveal'), rh = rv?.querySelector('.rhead'); if (rh && !rv.querySelector('.coment')) rh.insertAdjacentHTML('afterend', `<div class="coment"><span>🎙️</span><q>${esc(comentario(tier, p, timeout))}</q></div>`); } catch (e) {}
  return r;
})(renderReveal);

// ---------- câmara que segue a bola nos remates de longe (afasta no remate, aproxima à baliza) ----------
shoot = (orig => function (tier, kind, rnd) {
  const d = tier ? TIERS[tier].m : 11, svg = $('#pitch');
  if (svg && tier >= 4 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const tot = (380 + d * 6 + 220 + 520 + Math.min(d, 70) * 13 + 260) * (TEMPO || 1);
    svg.style.transformOrigin = '50% 22%';
    svg.animate([{transform: 'scale(1)'}, {transform: 'scale(.93)', offset: .25}, {transform: 'scale(1.22)', offset: .82}, {transform: 'scale(1.22)', offset: .92}, {transform: 'scale(1)'}],
      {duration: tot + 500, easing: 'ease-in-out'});
  }
  return orig.apply(this, arguments);
})(shoot);

// ---------- dia de jogo: cartaz "HOJE HÁ JOGO" no início quando tens jogo da taça ----------
inicioExtra = (orig => function () {
  const r = orig.apply(this, arguments);
  try {
    const tm = $('#tcMini'), t = typeof tacaMeuJogo === 'function' ? tacaMeuJogo() : null;
    if (tm && t?.m && t.op && t.falta?.length) {
      const temBotao = !!tm.querySelector('#tcMiniPlay'), estado = tm.querySelector('small')?.innerHTML.split('·').slice(1).join('·') || '';
      tm.classList.add('cartaz');
      tm.innerHTML = `<div class="cz-topo"><span>🏆 ${esc(tacaNome(TC.id))}</span><span>${esc(t.r.nome)}</span></div>
        <div class="cz-titulo">HOJE HÁ JOGO</div>
        <div class="cz-vs"><div>${emb(ME, 52)}<b>${esc(ME)}</b></div><span class="cz-x">VS</span><div>${emb(t.op, 52)}<b>${esc(t.op)}</b></div></div>
        <div class="cz-pe"><small>${estado || '🏠 casa e ✈️ fora'}</small>${temBotao ? '<button class="du-btn" id="tcMiniPlay">Jogar ›</button>' : ''}</div>`;
      const ag = $('#agora'); if (ag) { ag.prepend(tm); $('#playBtn')?.classList.add('sec'); }   // dia de jogo: o cartaz sobe para o topo
    } else tm?.classList.remove('cartaz');
  } catch (e) {}
  try { domingoMini(); } catch (e) {}
  try { festaSeCampeao(); } catch (e) {}
  return r;
})(inicioExtra);

// ---------- campeão da taça: ecrã de festa (uma vez por taça) ----------
function festaCampeao(nomeTaca) {
  if ($('#campFx')) return;
  document.body.insertAdjacentHTML('beforeend', `<div class="campeao-fx" id="campFx"><div class="cf-luz"></div>
    <div class="cf-in"><small>${esc(nomeTaca)}</small><h2>CAMPEÃO!</h2>
    <svg class="cf-taca" viewBox="0 0 120 150" aria-hidden="true"><defs><linearGradient id="cfOuro" x1="0" x2="1"><stop offset="0" stop-color="#a8781c"/><stop offset=".45" stop-color="#ffe08a"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs>
      <path d="M30 14h60v34a30 30 0 0 1-60 0z" fill="url(#cfOuro)" stroke="#5a3d0a" stroke-width="2.5"/><path d="M30 24H14a16 16 0 0 0 18 28M90 24h16a16 16 0 0 1-18 28" fill="none" stroke="url(#cfOuro)" stroke-width="7"/>
      <rect x="52" y="78" width="16" height="22" fill="url(#cfOuro)" stroke="#5a3d0a" stroke-width="2"/><rect x="34" y="100" width="52" height="14" rx="3" fill="url(#cfOuro)" stroke="#5a3d0a" stroke-width="2"/>
      <rect x="28" y="114" width="64" height="20" rx="3" fill="#3b2a12"/><text x="60" y="128" text-anchor="middle" font-size="9" font-family="Barlow,sans-serif" font-weight="800" fill="#ffe08a">TAÇA DOS AMIGOS</text></svg>
    <div class="cf-emb">${emb(ME, 64)}<b>${esc(ME)}</b></div><button class="btn" id="cfOk" type="button">Levantar a taça 🏆</button></div></div>`);
  $('#cfOk').onclick = () => $('#campFx').remove();
  try { SOM.golo(6); } catch (e) {}
  try { if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.([80, 60, 80, 60, 200]); } catch (e) {}
  if (typeof confettiEnd === 'function') confettiEnd();
}
function festaSeCampeao() {
  if (!ME || !TC?.campeoes) return;
  const vistas = ST.festas = ST.festas || {};
  for (const id of [TC.id, TC.ant]) if (id && TC.campeoes[id] === ME && !vistas[id]) { vistas[id] = 1; saveStats(ST); festaCampeao(tacaNome(id)); return; }
}
tacaFim = (orig => async function () { const r = await orig.apply(this, arguments); try { festaSeCampeao(); } catch (e) {} return r; })(tacaFim);

// ---------- Domingo Desportivo: o resumo da semana (domingo: a semana até agora; segunda: a semana que acabou) ----------
function resumoSemana(ws) {
  const F = d => weekStart(d) === ws, tab = totals(F), jogos = [];
  for (const n of LIGA.jogadores) for (const dia in (LG.dados?.[n] || {})) if (F(dia)) for (const g of Object.values(LG.dados[n][dia] || {})) if (g) jogos.push({n, dia, g});
  let golo = null, jogo = null; const golacos = {}, plenos = {};
  for (const {n, dia, g} of jogos) {
    (g.tiros || []).forEach((t, i) => { const tier = t[1]; if (tier >= 5) golacos[n] = (golacos[n] || 0) + 1;
      if (tier >= 5 && (!golo || tier > golo.tier || (tier === golo.tier && (g.fim || 0) < golo.fim))) golo = {n, dia, tier, resp: g.resp?.[i], fim: g.fim || 0}; });
    if (!jogo || (g.pontos || 0) > jogo.pts) jogo = {n, dia, pts: g.pontos || 0, golos: g.golos || 0};
    if ((g.perguntas || 0) >= 7 && (g.golos || 0) >= 7) plenos[n] = (plenos[n] || 0) + 1;
  }
  const antes = totals(d => weekStart(d) === weekStart(diaMais(ws, -7))).map(o => o.nome);
  const subida = tab.map((o, i) => ({n: o.nome, d: antes.indexOf(o.nome) - i})).filter(x => x.d > 0).sort((a, b) => b.d - a.d)[0];
  const tacas = Object.entries(TC?.campeoes || {}).filter(([id]) => id >= ws && id <= diaMais(ws, 6));
  return {tab, golo, jogo, golacos, plenos, subida, tacas, nJogos: jogos.length};
}
function domingoSemana() { const hoje = lisDate(), w = dowDe(hoje); return w === 0 ? {ws: weekStart(hoje), acabou: false} : w === 1 ? {ws: weekStart(diaMais(hoje, -1)), acabou: true} : null; }
function domingoMini() {
  let el = $('#ddMini'); const s = domingoSemana();
  if (!s || !LG.dados) { if (el) el.hidden = true; return; }
  if (!el) { ($('#muMini') || $('#tcMini')).insertAdjacentHTML('afterend', '<button class="dd-mini" id="ddMini" type="button"></button>'); el = $('#ddMini'); el.onclick = abrirDomingo; }
  const R = resumoSemana(s.ws), lider = R.tab[0];
  el.hidden = !R.nJogos;
  el.innerHTML = `<span class="dd-tv">📺</span><span class="dd-tx"><b>Domingo Desportivo</b><small>${s.acabou ? 'O resumo da semana que acabou' : 'A semana até agora'} · ${lider && lider.pts ? `${esc(lider.nome)} ${s.acabou ? 'campeão' : 'na frente'}` : ''}</small></span><span class="go">›</span>`;
}
function abrirDomingo() {
  const s = domingoSemana() || {ws: weekStart(lisDate()), acabou: false}, R = resumoSemana(s.ws);
  const fim = diaMais(s.ws, 6), lab = d => new Date(d + 'T12:00:00Z').toLocaleDateString('pt-PT', {day: 'numeric', month: 'short', timeZone: 'UTC'});
  const top = R.tab[0], vencs = R.tab.filter(o => o.pts && o.pts === top.pts).map(o => o.nome);
  const mx = obj => { const e = Object.entries(obj).sort((a, b) => b[1] - a[1])[0]; return e ? e : null; };
  const gol = mx(R.golacos), ple = mx(R.plenos);
  const bloco = (ic, tit, html) => `<div class="dd-bl"><div class="dd-bt">${ic} ${tit}</div>${html}</div>`;
  let h = `<div class="dd-cab"><div class="dd-logo"><span>DOMINGO</span><b>DESPORTIVO</b></div><small>Semana de ${lab(s.ws)} a ${lab(fim)}${s.acabou ? '' : ' · ainda falta hoje'}</small></div>`;
  h += bloco('🏆', s.acabou ? (vencs.length > 1 ? 'Campeões da semana' : 'Campeão da semana') : 'Na frente', top?.pts ? `<div class="dd-camp">${vencs.map(n => `<span>${emb(n, 46)}<b>${esc(n)}</b></span>`).join('')}<em>${top.pts} pontos</em></div>` : '<p class="lg-note">Ninguém jogou esta semana.</p>');
  h += bloco('📊', 'Classificação', `<ol class="dd-tab">${R.tab.map((o, i) => `<li>${i + 1}.º ${emb(o.nome, 20)}<span>${esc(o.nome)}</span><b>${o.pts}</b></li>`).join('')}</ol>`);
  if (R.golo) h += bloco('🚀', 'Golo da semana', `<p>${emb(R.golo.n, 22)}<b>${esc(R.golo.n)}</b> marcou de <b>${TIERS[R.golo.tier].m} m</b>${R.golo.resp ? ` com <q>${esc(R.golo.resp)}</q>` : ''} · ${lab(R.golo.dia)}</p>`);
  if (R.jogo) h += bloco('⭐', 'Jogo da semana', `<p>${emb(R.jogo.n, 22)}<b>${esc(R.jogo.n)}</b>: ${R.jogo.pts} pontos e ${R.jogo.golos} golos (${lab(R.jogo.dia)})</p>`);
  if (R.subida) h += bloco('📈', 'Quem mais subiu', `<p>${emb(R.subida.n, 22)}<b>${esc(R.subida.n)}</b> subiu ${R.subida.d} lugar${R.subida.d > 1 ? 'es' : ''} em relação à semana anterior</p>`);
  if (gol) h += bloco('🎯', 'Rei dos golaços', `<p>${emb(gol[0], 22)}<b>${esc(gol[0])}</b> com ${gol[1]} golo${gol[1] > 1 ? 's' : ''} de 50 m ou mais</p>`);
  if (ple) h += bloco('✨', 'Plenos (7 em 7)', `<p>${Object.entries(R.plenos).map(([n, v]) => `${emb(n, 18)}<b>${esc(n)}</b> ×${v}`).join(' · ')}</p>`);
  if (R.tacas.length) h += bloco('🏆', 'Taças da semana', `<p>${R.tacas.map(([id, n]) => `${esc(tacaNome(id))}: ${emb(n, 18)}<b>${esc(n)}</b>`).join(' · ')}</p>`);
  let el = $('#domingoFx');
  if (!el) { document.body.insertAdjacentHTML('beforeend', '<div class="domingo-fx" id="domingoFx"><div class="dd-in"></div></div>'); el = $('#domingoFx'); el.addEventListener('click', e => { if (e.target === el) el.remove(); }); }
  el.querySelector('.dd-in').innerHTML = `<button class="dlg-x" type="button" aria-label="Fechar" id="ddX">✕</button>${h}<button class="btn" type="button" id="ddOk">Fechar</button>`;
  $('#ddX').onclick = $('#ddOk').onclick = () => el.remove();
}

document.head.insertAdjacentHTML('beforeend', `<style>
/* comentário */
.coment{display:flex;gap:6px;align-items:flex-start;color:var(--ink);margin:8px 0 0;font-size:14px;line-height:1.35;animation:qIn .35s both}
.coment q{font-style:italic;quotes:'«' '»'}.coment span{font-size:14px;line-height:1.35}
/* cartaz do dia de jogo */
.tc-mini.cartaz{display:block;padding:0;overflow:hidden;border:2px solid var(--dark);box-shadow:var(--shadow);background:linear-gradient(180deg,#1e5a37,#174a2c);color:#fffaf0}
.cartaz .cz-topo{display:flex;justify-content:space-between;padding:7px 12px;background:rgba(0,0,0,.22);font:800 11.5px var(--sans);text-transform:uppercase;letter-spacing:.08em}
.cartaz .cz-titulo{font-family:var(--display);font-size:30px;text-align:center;margin:8px 0 2px;letter-spacing:.02em;color:#ffe08a;text-shadow:0 3px 0 rgba(0,0,0,.3)}
.cartaz .cz-vs{display:flex;align-items:center;justify-content:center;gap:16px;padding:4px 12px 8px}
.cartaz .cz-vs>div{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:84px}.cartaz .cz-vs .emb{margin:0;filter:drop-shadow(0 3px 0 rgba(0,0,0,.3))}
.cartaz .cz-vs b{font-family:var(--display);font-weight:400;font-size:18px}
.cartaz .cz-x{font-family:var(--display);font-size:26px;color:#ffe08a}
.cartaz .cz-pe{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px 10px;background:rgba(0,0,0,.18)}
.cartaz .cz-pe small{color:rgba(255,250,240,.85);font-size:13px}.cartaz .du-btn{background:#ffe08a;color:#1d2b22}
/* festa do campeão */
.campeao-fx{position:fixed;inset:0;z-index:80;display:grid;place-items:center;background:radial-gradient(circle at 50% 35%,#3a2a0e,#0d0b08 70%);color:#fffaf0;text-align:center;animation:cfIn .5s ease-out;overflow:hidden}
.cf-luz{position:absolute;inset:-20%;background:repeating-conic-gradient(from 0deg at 50% 40%,rgba(255,224,138,.12) 0 8deg,transparent 8deg 20deg);animation:cfGira 18s linear infinite}
.cf-in{position:relative;padding:20px;width:min(340px,90vw)}.cf-in small{font:800 13px var(--sans);letter-spacing:.14em;color:#ffe08a;text-transform:uppercase}
.cf-in h2{font-family:var(--display);font-weight:400;font-size:52px;margin:2px 0 8px;color:#ffe08a;text-shadow:0 4px 0 #5a3d0a}
.cf-taca{width:150px;animation:cfTaca 1.2s .2s cubic-bezier(.2,1.4,.4,1) both;filter:drop-shadow(0 10px 18px rgba(255,200,80,.35))}
.cf-emb{display:flex;align-items:center;justify-content:center;gap:10px;margin:6px 0 14px}.cf-emb .emb{margin:0}.cf-emb b{font-family:var(--display);font-weight:400;font-size:28px}
@keyframes cfIn{from{opacity:0}}@keyframes cfGira{to{transform:rotate(360deg)}}@keyframes cfTaca{from{transform:translateY(80px) scale(.6);opacity:0}}
/* Domingo Desportivo */
.dd-mini{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:linear-gradient(90deg,#16306b,#1f4796);color:#fffaf0;border:2px solid var(--dark);border-radius:var(--r);padding:12px 14px;margin:0 0 12px;box-shadow:var(--shadow);cursor:pointer}
.dd-mini .dd-tv{font-size:26px}.dd-mini .dd-tx{flex:1;min-width:0}.dd-mini b{display:block;font-family:var(--display);font-weight:400;font-size:17px}.dd-mini small{color:rgba(255,250,240,.85);font-size:13px}.dd-mini .go{font-size:22px;opacity:.7}
.domingo-fx{position:fixed;inset:0;z-index:70;background:rgba(5,8,18,.72);overflow-y:auto;padding:18px 12px;animation:cfIn .3s ease-out}
.dd-in{position:relative;max-width:460px;margin:0 auto;background:var(--panel);border:2px solid var(--dark);border-radius:var(--r);box-shadow:var(--shadow);padding:0 14px 14px;overflow:hidden}
.dd-in .dlg-x{position:absolute;top:10px;right:10px;z-index:2}
.dd-cab{margin:0 -14px 12px;padding:18px 14px 12px;background:repeating-linear-gradient(135deg,#16306b 0 18px,#1b3a80 18px 36px);color:#fffaf0;text-align:center}
.dd-logo{display:inline-flex;flex-direction:column;align-items:center;line-height:.95}
.dd-logo span{font:800 13px var(--sans);letter-spacing:.42em;color:#ffe08a;margin-left:.42em}.dd-logo b{font-family:var(--display);font-weight:400;font-size:34px;letter-spacing:.02em}
.dd-cab small{display:block;margin-top:6px;color:rgba(255,250,240,.85);font-size:13px}
.dd-bl{border-top:1px dashed var(--line);padding:10px 0}.dd-bl:first-of-type{border-top:0}
.dd-bt{font:800 12px var(--sans);text-transform:uppercase;letter-spacing:.08em;color:var(--mute);margin-bottom:6px}
.dd-bl p{margin:0;font-size:15px;line-height:1.45}.dd-bl p .emb{margin:0 4px 0 0}.dd-bl q{font-style:italic}
.dd-camp{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.dd-camp span{display:flex;align-items:center;gap:8px}.dd-camp b{font-family:var(--display);font-weight:400;font-size:24px}.dd-camp em{font-style:normal;color:var(--mute);margin-left:auto}
.dd-tab{list-style:none;margin:0;padding:0;display:grid;gap:4px}.dd-tab li{display:flex;align-items:center;gap:8px;font-size:15px}.dd-tab li span{flex:1}.dd-tab li b{font-family:var(--display);font-weight:400}.dd-tab .emb{margin:0}
@media (prefers-reduced-motion: reduce){.cf-luz,.cf-taca,.coment{animation:none}}
</style>`);
