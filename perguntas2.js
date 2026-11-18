// =====================================================================================
// Fora da Caixa — mais perguntas escritas à mão (junta-se ao BANCO de perguntas.js).
// Mesmas regras: só factos fechados e listas completas; respostas da mais óbvia para a mais rara.
// =====================================================================================
(function () {
  const B = window.BANCO, A = window.ALIASES, X = window.EXTRAS;
  const add = (id, cat, tipo, txt, sub, r) => B.push({id, cat, tipo, txt, sub, r});

  // ---------- Mundiais: os 4 primeiros de cada edição (campeão, finalista, 3.º, 4.º) ----------
  const WC = [
    [1930,'no Uruguai',['Uruguai','Argentina','Estados Unidos','Jugoslávia'],'Em 1930 não houve jogo do 3.º lugar: contam os 4 semifinalistas'],
    [1934,'em Itália',['Itália','Checoslováquia','Alemanha','Áustria']],
    [1938,'em França',['Itália','Hungria','Brasil','Suécia']],
    [1950,'no Brasil',['Uruguai','Brasil','Suécia','Espanha'],'Os 4 da fase final (em grupo)'],
    [1954,'na Suíça',['Alemanha','Hungria','Áustria','Uruguai']],
    [1958,'na Suécia',['Brasil','Suécia','França','Alemanha']],
    [1962,'no Chile',['Brasil','Checoslováquia','Chile','Jugoslávia']],
    [1966,'em Inglaterra',['Inglaterra','Alemanha','Portugal','União Soviética']],
    [1970,'no México',['Brasil','Itália','Alemanha','Uruguai']],
    [1974,'na RFA',['Alemanha','Países Baixos','Polónia','Brasil']],
    [1978,'na Argentina',['Argentina','Países Baixos','Brasil','Itália']],
    [1982,'em Espanha',['Itália','Alemanha','Polónia','França']],
    [1986,'no México',['Argentina','Alemanha','França','Bélgica']],
    [1990,'em Itália',['Alemanha','Argentina','Itália','Inglaterra']],
    [1994,'nos Estados Unidos',['Brasil','Itália','Suécia','Bulgária']],
    [1998,'em França',['França','Brasil','Croácia','Países Baixos']],
    [2002,'na Coreia do Sul e no Japão',['Brasil','Alemanha','Turquia','Coreia do Sul']],
    [2006,'na Alemanha',['Itália','França','Alemanha','Portugal']],
    [2010,'na África do Sul',['Espanha','Países Baixos','Alemanha','Uruguai']],
    [2014,'no Brasil',['Alemanha','Argentina','Países Baixos','Brasil']],
    [2018,'na Rússia',['França','Croácia','Bélgica','Inglaterra']],
    [2022,'no Catar',['Argentina','França','Croácia','Marrocos']],
  ];
  // (cada edição só tem 4 respostas: juntam-se várias edições numa pergunta, para haver pelo menos 5)
  const uniao = (lista, de, ate) => { const out = []; lista.filter(e => e[0] >= de && e[0] <= ate).forEach(e => e[2].forEach(p => { if (!out.includes(p)) out.push(p); })); return out; };
  add('wc-top4-1930-1962', 'mundo', 'pais', 'Uma seleção que ficou nos 4 primeiros de um Mundial entre 1930 e 1962', 'Campeões, finalistas, 3.º e 4.º lugar · Alemanha = RFA · em 1930 contam os 4 semifinalistas', uniao(WC, 1930, 1962));
  add('wc-top4-1966-1986', 'mundo', 'pais', 'Uma seleção que ficou nos 4 primeiros de um Mundial entre 1966 e 1986', 'Campeões, finalistas, 3.º e 4.º lugar · Alemanha = RFA', uniao(WC, 1966, 1986));
  add('wc-top4-1990-2022', 'mundo', 'pais', 'Uma seleção que chegou às meias-finais de um Mundial entre 1990 e 2022', 'Campeões, finalistas, 3.º e 4.º lugar', uniao(WC, 1990, 2022));
  add('wc-finais-perdidas', 'mundo', 'pais', 'Uma seleção que perdeu uma final do Mundial', 'De 1930 a 2022 (em 1950 conta o Brasil, 2.º na fase final) · Alemanha = RFA',
    ['Argentina', 'Alemanha', 'Países Baixos', 'Brasil', 'Itália', 'França', 'Hungria', 'Checoslováquia', 'Croácia', 'Suécia']);

  // ---------- Europeus: os 4 primeiros de cada edição ----------
  const EU = [
    [1960,'em França',['União Soviética','Jugoslávia','Checoslováquia','França']],
    [1964,'em Espanha',['Espanha','União Soviética','Hungria','Dinamarca']],
    [1968,'em Itália',['Itália','Jugoslávia','Inglaterra','União Soviética']],
    [1972,'na Bélgica',['Alemanha','União Soviética','Bélgica','Hungria']],
    [1976,'na Jugoslávia',['Checoslováquia','Alemanha','Países Baixos','Jugoslávia']],
    [1980,'em Itália',['Alemanha','Bélgica','Checoslováquia','Itália']],
    [1984,'em França',['França','Espanha','Portugal','Dinamarca']],
    [1988,'na RFA',['Países Baixos','União Soviética','Alemanha','Itália']],
    [1992,'na Suécia',['Dinamarca','Alemanha','Países Baixos','Suécia']],
    [1996,'em Inglaterra',['Alemanha','Chéquia','Inglaterra','França']],
    [2000,'na Bélgica e nos Países Baixos',['França','Itália','Portugal','Países Baixos']],
    [2004,'em Portugal',['Grécia','Portugal','Países Baixos','Chéquia']],
    [2008,'na Áustria e na Suíça',['Espanha','Alemanha','Rússia','Turquia']],
    [2012,'na Polónia e na Ucrânia',['Espanha','Itália','Portugal','Alemanha']],
    [2016,'em França',['Portugal','França','País de Gales','Alemanha']],
    [2020,'(jogado em 2021, em 11 países)',['Itália','Inglaterra','Espanha','Dinamarca']],
    [2024,'na Alemanha',['Espanha','Inglaterra','França','Países Baixos']],
  ];
  add('eu-top4-1960-1988', 'mundo', 'pais', 'Uma seleção que ficou nos 4 primeiros de um Euro entre 1960 e 1988', 'Finalistas e meias-finalistas (em 1980: jogo do 3.º lugar) · Alemanha = RFA', uniao(EU, 1960, 1988));
  add('eu-top4-1992-2024', 'mundo', 'pais', 'Uma seleção que chegou às meias-finais de um Euro entre 1992 e 2024', 'Finalistas e meias-finalistas (o Euro 2020 jogou-se em 2021)', uniao(EU, 1992, 2024));
  add('eu-organizou', 'mundo', 'pais', 'Um país que organizou (sozinho ou com outro) uma fase final do Euro', 'De 1960 a 2016 (o Euro 2020, em 11 países, não conta) · Alemanha = RFA em 1988',
    ['França', 'Portugal', 'Alemanha', 'Espanha', 'Itália', 'Inglaterra', 'Países Baixos', 'Bélgica', 'Suíça', 'Áustria', 'Polónia', 'Ucrânia', 'Suécia', 'Jugoslávia']);
  add('confed', 'mundo', 'pais', 'Uma seleção que ganhou a Taça das Confederações', 'Todas as edições (1992-2017)', ['Brasil', 'Alemanha', 'França', 'Argentina', 'México', 'Dinamarca']);

  // ---------- Portugal: adversários em cada fase final ----------
  const PT = [
    ['wc1966','no Mundial 1966',['Inglaterra','Brasil','Hungria','União Soviética','Coreia do Norte','Bulgária']],
    ['wc1986','no Mundial 1986',['Inglaterra','Polónia','Marrocos']],
    ['wc2002','no Mundial 2002',['Coreia do Sul','Estados Unidos','Polónia']],
    ['wc2006','no Mundial 2006',['Inglaterra','França','Alemanha','Países Baixos','México','Irão','Angola']],
    ['wc2010','no Mundial 2010',['Espanha','Brasil','Costa do Marfim','Coreia do Norte']],
    ['wc2014','no Mundial 2014',['Alemanha','Estados Unidos','Gana']],
    ['wc2018','no Mundial 2018',['Espanha','Uruguai','Marrocos','Irão']],
    ['wc2022','no Mundial 2022',['Marrocos','Uruguai','Suíça','Gana','Coreia do Sul']],
    ['eu1984','no Euro 1984',['França','Alemanha','Espanha','Roménia']],
    ['eu1996','no Euro 1996',['Croácia','Dinamarca','Turquia','Chéquia']],
    ['eu2000','no Euro 2000',['França','Inglaterra','Alemanha','Roménia','Turquia']],
    ['eu2008','no Euro 2008',['Alemanha','Turquia','Chéquia','Suíça']],
    ['eu2012','no Euro 2012',['Espanha','Alemanha','Países Baixos','Dinamarca','Chéquia']],
    ['eu2020','no Euro 2020',['França','Alemanha','Bélgica','Hungria']],
    ['eu2024','no Euro 2024',['França','Turquia','Chéquia','Geórgia','Eslovénia']],
  ];
  PT.forEach(([k, t, r]) => add(`pt-adv-${k}`, 'portugal', 'pais', `Uma seleção que Portugal defrontou ${t}`, 'Fase de grupos e eliminatórias (inclui jogo do 3.º lugar)', r));
  // edições com poucos adversários: juntar todas
  const juntaPT = pre => { const out = []; PT.filter(e => e[0].startsWith(pre)).forEach(e => e[2].forEach(p => { if (!out.includes(p)) out.push(p); })); return out; };
  add('pt-adv-wc-todos', 'portugal', 'pais', 'Uma seleção que Portugal defrontou numa fase final do Mundial', 'Mundiais de 1966 a 2022', juntaPT('wc'));
  add('pt-adv-eu-todos', 'portugal', 'pais', 'Uma seleção que Portugal defrontou numa fase final do Euro', 'Euros de 1984 a 2024', juntaPT('eu'));

  // ---------- Participantes de fases finais ----------
  add('wc2022-part','mundo','pais','Uma seleção que jogou o Mundial 2022','As 32 seleções do Catar',
    ['Brasil','Argentina','França','Portugal','Espanha','Alemanha','Inglaterra','Países Baixos','Bélgica','Croácia','Uruguai','Marrocos','Estados Unidos','México','Dinamarca','Suíça','Polónia','Sérvia','Japão','Coreia do Sul','Senegal','Gana','Camarões','Catar','Equador','País de Gales','Irão','Arábia Saudita','Austrália','Tunísia','Canadá','Costa Rica']);
  add('wc2018-part','mundo','pais','Uma seleção que jogou o Mundial 2018','As 32 seleções da Rússia',
    ['Brasil','França','Argentina','Portugal','Espanha','Alemanha','Inglaterra','Bélgica','Croácia','Uruguai','Rússia','México','Colômbia','Suíça','Suécia','Dinamarca','Polónia','Sérvia','Japão','Coreia do Sul','Marrocos','Egito','Nigéria','Senegal','Tunísia','Islândia','Peru','Costa Rica','Arábia Saudita','Irão','Austrália','Panamá']);
  add('wc2014-part','mundo','pais','Uma seleção que jogou o Mundial 2014','As 32 seleções do Brasil',
    ['Brasil','Alemanha','Argentina','Espanha','Portugal','Países Baixos','França','Inglaterra','Itália','Bélgica','Uruguai','Colômbia','Chile','México','Croácia','Suíça','Grécia','Rússia','Costa Rica','Estados Unidos','Japão','Coreia do Sul','Austrália','Irão','Gana','Nigéria','Camarões','Costa do Marfim','Argélia','Equador','Honduras','Bósnia']);
  add('wc2010-part','mundo','pais','Uma seleção que jogou o Mundial 2010','As 32 seleções da África do Sul',
    ['Espanha','Países Baixos','Alemanha','Brasil','Argentina','Portugal','Inglaterra','Itália','França','Uruguai','África do Sul','México','Chile','Paraguai','Gana','Costa do Marfim','Camarões','Nigéria','Argélia','Estados Unidos','Japão','Coreia do Sul','Coreia do Norte','Austrália','Nova Zelândia','Dinamarca','Suíça','Sérvia','Eslováquia','Eslovénia','Grécia','Honduras']);
  add('eu2024-part','mundo','pais','Uma seleção que jogou o Euro 2024','As 24 seleções da Alemanha',
    ['Espanha','Inglaterra','França','Alemanha','Portugal','Países Baixos','Itália','Bélgica','Croácia','Suíça','Dinamarca','Áustria','Turquia','Polónia','Escócia','Sérvia','Hungria','Chéquia','Ucrânia','Roménia','Eslováquia','Eslovénia','Albânia','Geórgia']);
  add('eu2020-part','mundo','pais','Uma seleção que jogou o Euro 2020','As 24 seleções (jogado em 2021)',
    ['Itália','Inglaterra','Espanha','Portugal','França','Alemanha','Bélgica','Países Baixos','Dinamarca','Croácia','Suíça','Áustria','Suécia','Polónia','Ucrânia','Chéquia','Turquia','Rússia','Escócia','País de Gales','Hungria','Eslováquia','Finlândia','Macedónia do Norte']);
  add('eu2016-part','mundo','pais','Uma seleção que jogou o Euro 2016','As 24 seleções de França',
    ['Portugal','França','Alemanha','Espanha','Inglaterra','Itália','Bélgica','País de Gales','Croácia','Suíça','Polónia','Islândia','Áustria','Hungria','Rússia','Ucrânia','Suécia','Turquia','Chéquia','Eslováquia','Roménia','Irlanda','Irlanda do Norte','Albânia']);

  // ---------- Finais de Mundiais e Europeus: quem entrou em campo ----------
  const F = [
    ['wc98-fra','pela França na final do Mundial 1998','contra o Brasil',['Zinedine Zidane','Fabien Barthez','Didier Deschamps','Lilian Thuram','Marcel Desailly','Emmanuel Petit','Youri Djorkaeff','Bixente Lizarazu','Frank Leboeuf','Christian Karembeu','Patrick Vieira','Stéphane Guivarc\'h','Christophe Dugarry','Alain Boghossian']],
    ['wc98-bra','pelo Brasil na final do Mundial 1998','contra a França',['Ronaldo Nazário','Roberto Carlos','Cafu','Rivaldo','Bebeto','Dunga','Taffarel','Leonardo','Denílson','Aldair','César Sampaio','Júnior Baiano','Edmundo']],
    ['wc02-ale','pela Alemanha na final do Mundial 2002','contra o Brasil',['Oliver Kahn','Miroslav Klose','Oliver Neuville','Dietmar Hamann','Bernd Schneider','Torsten Frings','Christoph Metzelder','Carsten Ramelow','Thomas Linke','Marco Bode','Jens Jeremies','Oliver Bierhoff','Christian Ziege','Gerald Asamoah']],
    ['wc06-fra','pela França na final do Mundial 2006','contra a Itália',['Zinedine Zidane','Thierry Henry','Franck Ribéry','Fabien Barthez','Patrick Vieira','Claude Makélélé','Lilian Thuram','William Gallas','Florent Malouda','Willy Sagnol','Éric Abidal','David Trezeguet','Sylvain Wiltord','Alou Diarra']],
    ['wc10-ned','pelos Países Baixos na final do Mundial 2010','contra a Espanha',['Arjen Robben','Wesley Sneijder','Robin van Persie','Dirk Kuyt','Mark van Bommel','Nigel de Jong','Giovanni van Bronckhorst','Rafael van der Vaart','Maarten Stekelenburg','John Heitinga','Gregory van der Wiel','Joris Mathijsen','Eljero Elia','Edson Braafheid']],
    ['wc14-arg','pela Argentina na final do Mundial 2014','contra a Alemanha',['Lionel Messi','Sergio Agüero','Gonzalo Higuaín','Javier Mascherano','Ezequiel Lavezzi','Pablo Zabaleta','Sergio Romero','Rodrigo Palacio','Martín Demichelis','Ezequiel Garay','Marcos Rojo','Lucas Biglia','Enzo Pérez','Fernando Gago']],
    ['wc22-fra','pela França na final do Mundial 2022','contra a Argentina',['Kylian Mbappé','Antoine Griezmann','Hugo Lloris','Olivier Giroud','Ousmane Dembélé','Raphaël Varane','Aurélien Tchouaméni','Adrien Rabiot','Théo Hernández','Jules Koundé','Dayot Upamecano','Eduardo Camavinga','Kingsley Coman','Marcus Thuram','Randal Kolo Muani','Youssouf Fofana','Ibrahima Konaté','Axel Disasi']],
    ['eu08-esp','pela Espanha na final do Euro 2008','contra a Alemanha',['Fernando Torres','Iker Casillas','Xavi','Andrés Iniesta','Sergio Ramos','Carles Puyol','David Silva','Cesc Fàbregas','Xabi Alonso','Marcos Senna','Carlos Marchena','Joan Capdevila','Santi Cazorla','Dani Güiza']],
    ['eu12-esp','pela Espanha na final do Euro 2012','contra a Itália',['Andrés Iniesta','Iker Casillas','Xavi','Sergio Ramos','Fernando Torres','Gerard Piqué','David Silva','Cesc Fàbregas','Xabi Alonso','Sergio Busquets','Jordi Alba','Álvaro Arbeloa','Juan Mata','Pedro']],
    ['eu16-fra','pela França na final do Euro 2016','contra Portugal',['Antoine Griezmann','Paul Pogba','Hugo Lloris','Olivier Giroud','Dimitri Payet','Blaise Matuidi','Moussa Sissoko','Laurent Koscielny','Patrice Evra','Samuel Umtiti','Bacary Sagna','Kingsley Coman','Anthony Martial','André-Pierre Gignac']],
    ['eu20-ita','pela Itália na final do Euro 2020','contra a Inglaterra',['Gianluigi Donnarumma','Giorgio Chiellini','Leonardo Bonucci','Jorginho','Federico Chiesa','Ciro Immobile','Lorenzo Insigne','Marco Verratti','Nicolò Barella','Giovanni Di Lorenzo','Emerson Palmieri','Federico Bernardeschi','Bryan Cristante','Domenico Berardi','Manuel Locatelli','Andrea Belotti','Alessandro Florenzi']],
    ['eu20-ing','pela Inglaterra na final do Euro 2020','contra a Itália',['Harry Kane','Raheem Sterling','Bukayo Saka','Jordan Pickford','Harry Maguire','John Stones','Declan Rice','Mason Mount','Luke Shaw','Kyle Walker','Kieran Trippier','Kalvin Phillips','Jack Grealish','Marcus Rashford','Jadon Sancho','Jordan Henderson']],
  ];
  F.forEach(([k, t, contra, r]) => add(k, 'mundo', 'jogador', `Um jogador que entrou em campo ${t}`, `Titulares e suplentes utilizados ${contra}`, r));

  // ---------- Finais da Liga dos Campeões: quem entrou em campo ----------
  const UCL = [
    ['ucl04-por','pelo FC Porto na final da Liga dos Campeões 2004','contra o Monaco','portugal',['Deco','Vítor Baía','Ricardo Carvalho','Maniche','Paulo Ferreira','Costinha','Derlei','Jorge Costa','Nuno Valente','Pedro Mendes','Carlos Alberto','Dmitri Alenichev','Benni McCarthy','Pedro Emanuel']],
    ['ucl05-liv','pelo Liverpool na final da Liga dos Campeões 2005','contra o Milan','mundo',['Steven Gerrard','Xabi Alonso','Jamie Carragher','Jerzy Dudek','Luis García','Milan Baroš','Sami Hyypiä','Harry Kewell','John Arne Riise','Djimi Traoré','Steve Finnan','Vladimír Šmicer','Dietmar Hamann','Djibril Cissé']],
    ['ucl08-mun','pelo Manchester United na final da Liga dos Campeões 2008','contra o Chelsea','mundo',['Cristiano Ronaldo','Wayne Rooney','Paul Scholes','Rio Ferdinand','Carlos Tevez','Edwin van der Sar','Nemanja Vidić','Patrice Evra','Michael Carrick','Ryan Giggs','Owen Hargreaves','Wes Brown','Nani','Anderson']],
    ['ucl11-bar','pelo Barcelona na final da Liga dos Campeões 2011','contra o Manchester United','mundo',['Lionel Messi','Xavi','Andrés Iniesta','David Villa','Sergio Busquets','Gerard Piqué','Dani Alves','Pedro','Víctor Valdés','Javier Mascherano','Éric Abidal','Carles Puyol','Seydou Keita','Ibrahim Afellay']],
    ['ucl12-che','pelo Chelsea na final da Liga dos Campeões 2012','contra o Bayern','mundo',['Didier Drogba','Frank Lampard','Petr Čech','Ashley Cole','Juan Mata','Fernando Torres','David Luiz','Gary Cahill','John Obi Mikel','Salomon Kalou','José Bosingwa','Florent Malouda','Ryan Bertrand']],
    ['ucl13-bay','pelo Bayern na final da Liga dos Campeões 2013','contra o Borussia Dortmund','mundo',['Arjen Robben','Franck Ribéry','Thomas Müller','Manuel Neuer','Bastian Schweinsteiger','Philipp Lahm','Mario Mandžukić','David Alaba','Jérôme Boateng','Javi Martínez','Dante','Mario Gómez','Luiz Gustavo']],
    ['ucl14-rma','pelo Real Madrid na final da Liga dos Campeões 2014','contra o Atlético de Madrid','mundo',['Cristiano Ronaldo','Sergio Ramos','Gareth Bale','Karim Benzema','Luka Modrić','Iker Casillas','Ángel Di María','Marcelo','Raphaël Varane','Dani Carvajal','Sami Khedira','Fábio Coentrão','Isco','Álvaro Morata']],
    ['ucl15-bar','pelo Barcelona na final da Liga dos Campeões 2015','contra a Juventus','mundo',['Lionel Messi','Neymar','Luis Suárez','Andrés Iniesta','Xavi','Gerard Piqué','Sergio Busquets','Ivan Rakitić','Dani Alves','Javier Mascherano','Jordi Alba','Marc-André ter Stegen','Pedro','Jérémy Mathieu']],
    ['ucl16-rma','pelo Real Madrid na final da Liga dos Campeões 2016','contra o Atlético de Madrid','mundo',['Cristiano Ronaldo','Sergio Ramos','Gareth Bale','Karim Benzema','Luka Modrić','Toni Kroos','Pepe','Marcelo','Keylor Navas','Casemiro','Dani Carvajal','Isco','Danilo','Lucas Vázquez']],
    ['ucl17-rma','pelo Real Madrid na final da Liga dos Campeões 2017','contra a Juventus','mundo',['Cristiano Ronaldo','Sergio Ramos','Luka Modrić','Toni Kroos','Karim Benzema','Casemiro','Marcelo','Isco','Keylor Navas','Raphaël Varane','Dani Carvajal','Gareth Bale','Marco Asensio','Álvaro Morata']],
    ['ucl18-rma','pelo Real Madrid na final da Liga dos Campeões 2018','contra o Liverpool','mundo',['Gareth Bale','Cristiano Ronaldo','Sergio Ramos','Luka Modrić','Karim Benzema','Toni Kroos','Marcelo','Casemiro','Keylor Navas','Isco','Raphaël Varane','Dani Carvajal','Marco Asensio','Nacho']],
    ['ucl19-liv','pelo Liverpool na final da Liga dos Campeões 2019','contra o Tottenham','mundo',['Mohamed Salah','Virgil van Dijk','Sadio Mané','Roberto Firmino','Alisson','Trent Alexander-Arnold','Andrew Robertson','Jordan Henderson','Fabinho','Georginio Wijnaldum','Joël Matip','Divock Origi','James Milner','Joe Gomez']],
    ['ucl21-che','pelo Chelsea na final da Liga dos Campeões 2021','contra o Manchester City','mundo',['Kai Havertz','N\'Golo Kanté','Mason Mount','Thiago Silva','Édouard Mendy','Timo Werner','Jorginho','César Azpilicueta','Antonio Rüdiger','Reece James','Ben Chilwell','Christian Pulisic','Mateo Kovačić','Andreas Christensen']],
    ['ucl22-rma','pelo Real Madrid na final da Liga dos Campeões 2022','contra o Liverpool','mundo',['Vinícius Júnior','Karim Benzema','Thibaut Courtois','Luka Modrić','Toni Kroos','Casemiro','Federico Valverde','Éder Militão','David Alaba','Dani Carvajal','Ferland Mendy','Rodrygo','Eduardo Camavinga','Dani Ceballos']],
  ];
  UCL.forEach(([k, t, contra, cat, r]) => add(k, cat, 'jogador', `Um jogador que entrou em campo ${t}`, `Titulares e suplentes utilizados ${contra}`, r));

  // ---------- Treinadores e prémios ----------
  add('wc-treinadores','mundo','treinador','Um treinador (selecionador) campeão do mundo','Mundiais até 2022',
    ['Didier Deschamps','Lionel Scaloni','Joachim Löw','Vicente del Bosque','Luiz Felipe Scolari','Marcello Lippi','Franz Beckenbauer','Carlos Alberto Parreira','Aimé Jacquet','Mário Zagallo','Enzo Bearzot','Carlos Bilardo','César Luis Menotti','Alf Ramsey','Helmut Schön','Vicente Feola','Aymoré Moreira','Sepp Herberger','Vittorio Pozzo','Juan López','Alberto Suppici']);
  add('eu-treinadores','mundo','treinador','Um treinador (selecionador) campeão da Europa','Euros até 2024',
    ['Fernando Santos','Vicente del Bosque','Luis de la Fuente','Roberto Mancini','Luis Aragonés','Otto Rehhagel','Rinus Michels','Berti Vogts','Roger Lemerre','Michel Hidalgo','Helmut Schön','Jupp Derwall','Richard Møller Nielsen','Ferruccio Valcareggi','Václav Ježek','José Villalonga','Gavriil Kachalin']);
  add('wc-bola-ouro','mundo','jogador','Um jogador eleito o melhor de um Mundial (Bola de Ouro do torneio)','De 1978 a 2022',
    ['Lionel Messi','Diego Maradona','Zinedine Zidane','Ronaldo Nazário','Luka Modrić','Oliver Kahn','Romário','Diego Forlán','Paolo Rossi','Salvatore Schillaci','Mario Kempes']);
  add('bo-fra','mundo','jogador','Um francês que ganhou a Bola de Ouro','Até 2025',['Zinedine Zidane','Michel Platini','Karim Benzema','Ousmane Dembélé','Jean-Pierre Papin','Raymond Kopa']);
  add('bo-ale','mundo','jogador','Um alemão que ganhou a Bola de Ouro','Até 2025',['Franz Beckenbauer','Lothar Matthäus','Gerd Müller','Karl-Heinz Rummenigge','Matthias Sammer']);
  add('bo-1990','mundo','jogador','Um jogador que ganhou a Bola de Ouro entre 1990 e 2025','Da France Football (de 2010 a 2015 foi a "FIFA Bola de Ouro")',
    ['Lionel Messi','Cristiano Ronaldo','Luka Modrić','Karim Benzema','Zinedine Zidane','Ronaldinho','Kaká','Ronaldo Nazário','Rodri','Ousmane Dembélé','Luís Figo','Rivaldo',
     'Andriy Shevchenko','Fabio Cannavaro','Michael Owen','Pavel Nedvěd','Roberto Baggio','George Weah','Marco van Basten','Lothar Matthäus','Hristo Stoichkov','Jean-Pierre Papin','Matthias Sammer']);
  add('bo-paises','mundo','pais','Um país com um jogador que ganhou a Bola de Ouro','Pela nacionalidade desportiva do vencedor, até 2025',
    ['Argentina','Portugal','França','Alemanha','Brasil','Países Baixos','Itália','Inglaterra','Espanha','Croácia','Ucrânia','Bulgária','Libéria','Dinamarca','Escócia','Irlanda do Norte','Chéquia','Checoslováquia','União Soviética','Hungria']);
  add('ucl-finalistas','mundo','clube','Um clube que jogou uma final da Liga dos Campeões','De 1993 a 2025 (desde que tem este nome)',
    ['Real Madrid','Barcelona','Bayern','Liverpool','Manchester United','Milan','Juventus','Chelsea','Inter','Manchester City','PSG','Borussia Dortmund','Atlético de Madrid','Ajax','FC Porto','Arsenal','Valência','Tottenham','Marseille','Monaco','Bayer Leverkusen']);
  add('ucl-perdeu','mundo','clube','Um clube que perdeu uma final da Liga dos Campeões','De 1993 a 2025',
    ['Juventus','Bayern','Liverpool','Atlético de Madrid','Manchester United','Inter','Milan','Borussia Dortmund','Valência','Barcelona','Chelsea','Arsenal','PSG','Manchester City','Tottenham','Ajax','Monaco','Bayer Leverkusen']);
  add('bo-bra','mundo','jogador','Um brasileiro que ganhou a Bola de Ouro','Até 2025',['Ronaldinho','Kaká','Ronaldo Nazário','Rivaldo']);
  add('bo-ita','mundo','jogador','Um jogador da seleção italiana que ganhou a Bola de Ouro','Até 2025',['Roberto Baggio','Fabio Cannavaro','Paolo Rossi','Gianni Rivera','Omar Sívori']);
  add('bo-ing','mundo','jogador','Um inglês que ganhou a Bola de Ouro','Até 2025',['Michael Owen','Bobby Charlton','Kevin Keegan','Stanley Matthews']);
  add('pl-bota','mundo','jogador','Um melhor marcador da Premier League (sozinho ou empatado)','De 1992/93 a 2024/25',
    ['Mohamed Salah','Harry Kane','Erling Haaland','Thierry Henry','Alan Shearer','Cristiano Ronaldo','Sergio Agüero','Didier Drogba','Robin van Persie','Luis Suárez','Jamie Vardy','Michael Owen','Son Heung-min','Sadio Mané','Pierre-Emerick Aubameyang','Ruud van Nistelrooy','Andy Cole','Teddy Sheringham','Jimmy Floyd Hasselbaink','Nicolas Anelka','Dimitar Berbatov','Carlos Tevez','Dwight Yorke','Kevin Phillips','Dion Dublin','Chris Sutton']);
  add('liga-nacoes','mundo','pais','Uma seleção que ganhou a Liga das Nações','Até à edição de 2025',['Portugal','França','Espanha']);
  add('pt-finais-eur','portugal','clube','Um clube português que já jogou a final de uma competição europeia da UEFA','Taça dos Campeões/Liga dos Campeões, Taça UEFA/Liga Europa ou Taça das Taças, até 2025',['Benfica','FC Porto','Sporting','Braga']);
  add('pt-euro04-estadios','portugal','estadio','Um estádio que recebeu jogos do Euro 2004','Os 10 estádios do torneio em Portugal',
    ['Estádio da Luz','Estádio do Dragão','Estádio José Alvalade','Estádio Municipal de Braga','Estádio do Bessa','Estádio D. Afonso Henriques','Estádio Cidade de Coimbra','Estádio Algarve','Estádio Municipal de Aveiro','Estádio Dr. Magalhães Pessoa']);

  // ---------- Carreiras: clubes onde jogaram / que treinaram ----------
  const C = [
    ['messi','Lionel Messi','jogou',['Barcelona','PSG','Inter Miami']],
    ['neymar','Neymar','jogou',['Barcelona','PSG','Santos','Al-Hilal']],
    ['mbappe','Kylian Mbappé','jogou',['PSG','Real Madrid','Monaco']],
    ['haaland','Erling Haaland','jogou',['Manchester City','Borussia Dortmund','Salzburgo','Molde','Bryne']],
    ['benzema','Karim Benzema','jogou',['Real Madrid','Lyon','Al-Ittihad']],
    ['modric','Luka Modrić','jogou',['Real Madrid','Tottenham','Dínamo Zagreb','Milan','Zrinjski Mostar','Inter Zaprešić'],'Na equipa principal (empréstimos contam), até 2025'],
    ['salah','Mohamed Salah','jogou',['Liverpool','Chelsea','Roma','Fiorentina','Basileia','El Mokawloon']],
    ['debruyne','Kevin De Bruyne','jogou',['Manchester City','Chelsea','Wolfsburgo','Napoli','Genk','Werder Bremen'],'Na equipa principal (empréstimos contam), até 2025'],
    ['kane','Harry Kane','jogou',['Tottenham','Bayern','Leicester','Norwich City','Millwall','Leyton Orient'],'Na equipa principal (empréstimos contam)'],
    ['lukaku','Romelu Lukaku','jogou',['Chelsea','Manchester United','Inter','Everton','Roma','Napoli','Anderlecht','West Bromwich Albion'],'Na equipa principal (empréstimos contam), até 2025'],
    ['drogba','Didier Drogba','jogou',['Chelsea','Marseille','Galatasaray','Guingamp','Le Mans','Shanghai Shenhua','Montreal Impact','Phoenix Rising']],
    ['pirlo','Andrea Pirlo','jogou',['Milan','Juventus','Inter','Brescia','Reggina','New York City']],
    ['buffon','Gianluigi Buffon','jogou',['Juventus','Parma','PSG']],
    ['delpiero','Alessandro Del Piero','jogou',['Juventus','Padova','Sydney FC','Delhi Dynamos']],
    ['maradona','Diego Maradona','jogou',['Napoli','Barcelona','Boca Juniors','Sevilha','Argentinos Juniors','Newell\'s Old Boys']],
    ['ruicosta','Rui Costa','jogou',['Benfica','Milan','Fiorentina','Fafe'],'Na equipa principal (empréstimos contam)','portugal'],
    ['quaresma','Ricardo Quaresma','jogou',['FC Porto','Sporting','Barcelona','Inter','Chelsea','Beşiktaş','Vitória de Guimarães','Kasımpaşa','Al-Ahli Dubai'],'Na equipa principal (empréstimos contam)','portugal'],
    ['moutinho','João Moutinho','jogou',['Sporting','FC Porto','Monaco','Wolverhampton','Braga'],'Na equipa principal','portugal'],
    ['cancelo','João Cancelo','jogou',['Manchester City','Juventus','Benfica','Barcelona','Bayern','Inter','Valência','Al-Hilal'],'Na equipa principal (empréstimos contam), até 2025','portugal'],
    ['rcarvalho','Ricardo Carvalho','jogou',['Chelsea','FC Porto','Real Madrid','Monaco','Vitória de Setúbal','Alverca','Leça','Shanghai SIPG'],'Na equipa principal (empréstimos contam)','portugal'],
    ['simao','Simão Sabrosa','jogou',['Benfica','Sporting','Barcelona','Atlético de Madrid','Beşiktaş','Espanyol','NorthEast United'],'Na equipa principal','portugal'],
    ['nunogomes','Nuno Gomes','jogou',['Benfica','Boavista','Fiorentina','Braga','Blackburn Rovers'],'Na equipa principal','portugal'],
    ['bernardo','Bernardo Silva','jogou',['Manchester City','Benfica','Monaco'],'Na equipa principal','portugal'],
    ['vitinha','Vitinha (o médio do PSG)','jogou',['PSG','FC Porto','Wolverhampton'],'Na equipa principal (empréstimos contam)','portugal'],
    ['leao','Rafael Leão','jogou',['Milan','Sporting','Lille'],'Na equipa principal','portugal'],
    ['conte','Antonio Conte','treinou',['Juventus','Chelsea','Inter','Tottenham','Napoli','Atalanta','Bari','Siena','Arezzo'],'Como treinador principal de clubes, até 2025'],
    ['simeone','Diego Simeone','treinou',['Atlético de Madrid','River Plate','Estudiantes','Racing','San Lorenzo','Catania'],'Como treinador principal de clubes'],
    ['wenger','Arsène Wenger','treinou',['Arsenal','Monaco','Nancy','Nagoya Grampus'],'Como treinador principal de clubes'],
    ['ferguson','Alex Ferguson','treinou',['Manchester United','Aberdeen','St Mirren','East Stirlingshire'],'Como treinador principal de clubes'],
    ['vangaal','Louis van Gaal','treinou',['Ajax','Barcelona','Bayern','Manchester United','AZ Alkmaar'],'Como treinador principal de clubes'],
    ['tuchel','Thomas Tuchel','treinou',['Chelsea','PSG','Bayern','Borussia Dortmund','Mainz'],'Como treinador principal de equipas principais de clubes, até 2025'],
    ['luisenrique','Luis Enrique','treinou',['Barcelona','PSG','Roma','Celta de Vigo'],'Como treinador principal de equipas principais de clubes, até 2025'],
    ['klopp','Jürgen Klopp','treinou',['Liverpool','Borussia Dortmund','Mainz'],'Como treinador principal de clubes'],
    ['guardiola','Pep Guardiola','treinou',['Barcelona','Bayern','Manchester City'],'Como treinador principal de equipas principais de clubes'],
  ];
  C.forEach(([k, quem, verbo, r, sub, cat]) => add(`car-${k}`, cat || 'mundo', 'clube', verbo === 'jogou' ? `Um clube em que ${quem} jogou` : `Um clube que ${quem} treinou`, sub || 'Na equipa principal', r));

  // ---------- nomes alternativos e opções extra ----------
  Object.assign(A, {
    'Chéquia':['República Checa','Chequia'], 'Bósnia':['Bósnia e Herzegovina'], 'Coreia do Norte':['Coreia do Norte'], 'Macedónia do Norte':['Macedónia'],
    'Irlanda':['República da Irlanda','Eire'], 'Estados Unidos':['EUA','USA'], 'Jugoslávia':['Jugoslavia'], 'Rússia':['Russia'],
    'Wolverhampton':['Wolves'], 'West Bromwich Albion':['West Brom'], 'Sheffield United':['Sheffield Utd'], 'Estrela da Amadora':['Estrela'],
    'Dínamo Zagreb':['Dinamo Zagreb'], 'Salzburgo':['Red Bull Salzburg','Salzburg'], 'Basileia':['Basel','FC Basel'],
    'Al-Ahli Dubai':['Shabab Al-Ahli'], 'Inter Zaprešić':['Zapresic'], 'Celta de Vigo':['Celta'], 'AVS':['AVS Futebol SAD','Vila das Aves'],
'Estádio José Alvalade':['Alvalade','Alvalade XXI'], 'Estádio da Luz':['Luz'], 'Estádio do Dragão':['Dragão'],
    'Estádio Municipal de Braga':['Pedreira'], 'Estádio D. Afonso Henriques':['Afonso Henriques','Guimarães'], 'Estádio Dr. Magalhães Pessoa':['Leiria'],
    'Estádio Algarve':['Faro','Loulé'], 'Estádio Municipal de Aveiro':['Aveiro'], 'Estádio Cidade de Coimbra':['Coimbra'], 'Estádio do Bessa':['Bessa'],
    'Xavi':['Xavi Hernández'], 'Nacho':['Nacho Fernández'], 'Dante':['Dante Bonfim'], 'Alisson':['Alisson Becker'], 'Fabinho':['Fábio Henrique Tavares'],
    'Anderson':['Anderson Oliveira'], 'Jorginho':['Jorge Luiz Frello'], 'Marcelo':['Marcelo Vieira'], 'Casemiro':['Carlos Henrique Casimiro'],
  });
  X.clube.push('Sheffield United','Burnley','Watford','Southampton','Wolverhampton','Brentford','Brighton','Bournemouth','Crystal Palace','Fulham','Luton Town',
    'Norwich City','Middlesbrough','Stoke City','Swansea City','Hull City','Sunderland','Cardiff City','Huddersfield Town','West Bromwich Albion','Leeds',
    'Levante','Getafe','Espanyol','Mallorca','Osasuna','Celta de Vigo','Málaga','Sampdoria','Udinese','Torino','Genoa','Bologna','Wolfsburgo','Hertha Berlim',
    'Hoffenheim','Freiburg','Augsburg','Mainz','Nantes','Bordeaux','Rennes','Nice','Saint-Étienne','Lens','Toulouse','Twente','Utrecht','Vitesse','Standard Liège',
    'Genk','Gent','Racing','Independiente','Estudiantes','Vélez Sarsfield','Vasco da Gama','Cruzeiro','Botafogo','Internacional','Al-Nassr','Al-Shabab','Al-Sadd',
    'Toronto FC','New York City','Seattle Sounders','Chivas','América','Tigres','Monterrey','AEK Atenas','PAOK','Trabzonspor','Dínamo Zagreb','Hajduk Split',
    'Partizan','Sparta Praga','Slavia Praga','Legia Varsóvia','Lech Poznań','Viktoria Plzeň','Ferencváros','Malmö','Rosenborg','Molde','Bodø/Glimt','Midtjylland',
    'Brøndby','Lokomotiv Moscovo','Spartak Moscovo','Dínamo Moscovo','Rubin Kazan','Olympique de Lyon','AVS','Tondela','Alverca','Vizela','Chaves','Belenenses SAD');
  X.jogador.push('Jamie Carragher','Fernando Morientes','Michael Laudrup','Hristo Stoichkov','Gheorghe Hagi','Ronald Koeman','Frank de Boer','Patrick Kluivert',
    'Edgar Davids','Marc Overmars','Jaap Stam','Gaizka Mendieta','Iván Zamorano','Hernán Crespo','Gabriel Batistuta','Juan Sebastián Verón','Javier Zanetti',
    'Pablo Aimar','Juan Román Riquelme','Esteban Cambiasso','Diego Milito','Walter Samuel','Lúcio','Júlio César','Maicon','Thiago Motta','Wesley Sneijder',
    'Dejan Stanković','Sulley Muntari','Marco Materazzi','Ivan Córdoba','Fernando Couto','Abel Xavier','Dimas','Paulo Sousa','Sérgio Conceição','Paulo Bento',
    'Hélder Postiga','Hugo Almeida','Danny','Raul Meireles','Bruno Alves','José Fonte','Eliseu','André Silva','Gelson Martins','William Carvalho','Adrien Silva');
  X.treinador.push('Fabio Capello','Arrigo Sacchi','Ottmar Hitzfeld','Rafael Benítez','Unai Emery','Jorge Sampaoli','Marcelo Bielsa','Gerardo Martino','Tite',
    'Dunga','Luiz Felipe Scolari','Gareth Southgate','Roy Hodgson','Sven-Göran Eriksson','Kevin Keegan','Glenn Hoddle','Bobby Robson','Graham Taylor','Terry Venables',
    'Raymond Domenech','Laurent Blanc','Jürgen Klinsmann','Rudi Völler','Erich Ribbeck','Hansi Flick','Julen Lopetegui','Fernando Hierro','José Antonio Camacho',
    'Javier Clemente','Cesare Prandelli','Gian Piero Ventura','Dino Zoff','Giovanni Trapattoni','Roberto Donadoni','Marc Wilmots','Bert van Marwijk','Frank Rijkaard',
    'Dick Advocaat','Ronald Koeman','Hervé Renard','Walid Regragui','Zlatko Dalić','Slaven Bilić','Luis Fernández','Bora Milutinović','Guus Hiddink');
  X.pais.push('Coreia do Norte','Kuwait','Iraque','Emirados Árabes Unidos','Jordânia','Uzbequistão','Haiti','El Salvador','Trinidad e Tobago','Cuba','Togo','Benim','Gabão');
  X.estadio = ['Estádio da Luz','Estádio do Dragão','Estádio José Alvalade','Estádio Municipal de Braga','Estádio do Bessa','Estádio D. Afonso Henriques',
    'Estádio Cidade de Coimbra','Estádio Algarve','Estádio Municipal de Aveiro','Estádio Dr. Magalhães Pessoa','Estádio do Restelo','Estádio Nacional (Jamor)',
    'Estádio dos Barreiros','Estádio do Bonfim','Estádio da Mata Real','Estádio Capital do Móvel','Estádio Municipal de Portimão','Estádio do Fontelo',
    'Estádio de São Miguel','Estádio da Madeira','Estádio do Mar','Estádio das Antas','Estádio de Alvalade (antigo)','Estádio 1.º de Maio','Estádio Marcolino de Castro',
    'Estádio dos Arcos','Estádio Municipal 22 de Junho','Estádio Comendador Joaquim de Almeida Freitas','Estádio do Clube Desportivo Nacional','Estádio José Gomes'];
  // regra do jogo: cada pergunta tem pelo menos 5 respostas certas
  for (let i = B.length - 1; i >= 0; i--) if (B[i].r.length < 5) B.splice(i, 1);
})();
