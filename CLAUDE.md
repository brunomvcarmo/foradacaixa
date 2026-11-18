# Fora da Caixa — instruções para o Claude

Jogo de futebol independente (não tem nada a ver com a app da FPL do repositório `brunomvcarmo.github.io`).
Site: **https://brunomvcarmo.github.io/foradacaixa/** (GitHub Pages deste repositório, ramo `main`, pasta raiz).
Fala sempre em **português de Portugal** e de forma simples: o utilizador não é programador e usa muito o telemóvel.

## Como funciona
- `index.html` — o jogo todo (HTML + CSS + JS). Ecrãs: início (categorias, modos, recordes), jogo (pergunta, caixa de resposta com sugestões, relvado SVG com o remate animado), fim (pontos, resumo, partilha).
- Distância do remate = posição da resposta na lista de respostas certas, da mais óbvia para a mais rara, dividida em 5 quintos: 11 m (10 pts), 18 m (20), 25 m (30), 35 m (40), 50 m (50).
- Resposta errada: o guarda-redes defende e tenta outra vez na mesma pergunta, sem perder tempo (`PENALTY` = 0; o teclado fica aberto: `touchstart`/`mousedown` na lista com `preventDefault`) (`wrongTry`); a pergunta só acaba ao acertar, passar ou acabar o tempo. Errar não tira vidas no Sem fim, só o tempo esgotado ou passar.
- Modos: Jogo rápido (7), Sem fim (3 vidas, multiplicador a cada 3 golos seguidos, golo de 50 m devolve uma vida), Desafio do dia (semente = data), Desafiar amigo (`?jogo=<semente base36>&c=<categoria>&p=<pontos>` refaz as mesmas 7).
- Recordes ficam só no browser (`localStorage` `fora-da-caixa-v1`).

## Aspeto (estilo "caderneta retro")
- Cores e letras nos tokens do `:root` (creme `--bg`, verde `--acc`, vermelho `--red`, `--dark`; Alfa Slab One nos títulos, Barlow no texto; `html{font-synthesis:none}` porque a Alfa só tem um peso). Cores dos níveis de remate em `--t0..--t5` E no array `TIERS` (JS) — mudar os dois. Cores do relvado em `drawPitch()`.
- Ícone: mesmo estilo do da app da FPL (letras FdC grandes, corte na diagonal com o nome, bola 3D com riscos). Gerado por `python3 scripts/icone.py <desenho>` → `icones/icone-512/192/180/32.png` (topo da página, favicon, iPhone e `manifest.webmanifest`); desenhos `pergunta` (atual: ponto de interrogação com a bola como ponto e etiqueta "50 m"), `distancia`, `d-funda`, `d-lado`, `d-titulo`, `ideia`, `fita`, `f-faixa`, `f-caixa`, `f-enrolada`, `creme`, `relvado`, `cartaz`; `python3 scripts/icone.py amostra` mostra-os lado a lado. A bola do jogo (relvado) é o símbolo `ballsym` (de `realBall()`).

## Liga dos Amigos
- Jogadores em `LIGA.jogadores` (no `index.html`, bloco "LIGA DOS AMIGOS"); para juntar um amigo, acrescentar o nome. `LIGA.porDia` = 3 jogos por dia que contam.
- Cada pessoa escolhe quem é na 1.ª visita (`localStorage` `fora-da-caixa-eu`; "trocar" no início).
- Jogo da liga = 7 perguntas da categoria `liga` (banco + épocas passadas, sem as desta época), semente `liga:<id>:<dia de Lisboa>:<n>` → o jogo n de cada dia é igual para todos. Conta logo que começa e guarda os pontos a cada resposta (sair a meio conta com o que tinha).
- Resultados no Firebase Realtime Database (API REST, sem biblioteca): `LIGA.db` = endereço da base de dados; dados em `ligas/<id>/jogos/<nome>/<AAAA-MM-DD>/j<n>` = {pontos, golos, golacos, perguntas, estado, inicio, fim}. A classificação (Hoje / Esta semana / Total) atualiza-se sozinha a cada 15 s e ao voltar à app.
- Apagar os jogos de alguém (reset): acrescentar `{id, nome, motivo}` a `LIGA.resets`; o 1.º telemóvel que abrir a página apaga `jogos/<nome>` e marca `resets/<id>` (corre uma só vez). Esta sessão não chega ao Firebase, por isso é sempre feito assim, pela app.
- Testar sem Firebase: `window.__LIGA_DB = 'http://127.0.0.1:8767'` antes de a página carregar, com um servidor que imite a API REST (GET/PUT em `/caminho.json`, com CORS).

## Perguntas
- **Banco (`perguntas.js`)**, categorias `portugal` e `mundo`: `{id, cat, tipo, txt, sub, r}`; `r` ORDENADO da resposta mais óbvia para a mais rara. Tipos: `jogador`, `clube`, `pais`, `treinador`. Nomes alternativos em `ALIASES`; opções que só servem para a lista de sugestões não denunciar as certas em `EXTRAS`.
  - Regra de ouro: **só factos fechados e de que se tem a certeza**, e listas completas (uma resposta certa que falte é dada como errada ao jogador). Quando há edições recentes, pôr o limite no `sub` ("até 2025"). Na dúvida, não pôr a pergunta.
  - Para acrescentar: uma linha nova no `BANCO` com `id` único; nomes iguais aos que já existem para a mesma entidade (ex.: "FC Porto", "Manchester United").
- **Mais perguntas à mão (`perguntas2.js`)**: junta-se ao `BANCO` (Mundiais e Euros edição a edição, adversários de Portugal, participantes, onzes de finais, treinadores, Bolas de Ouro, carreiras). Tipo extra `estadio`.
- **Premier League 2016/17 a 2024/25 (`historia`)**: `historia.json`, gerado UMA vez por `python3 scripts/historia_pl.py` a partir dos dados oficiais arquivados (vaastav/Fantasy-Premier-League, com a equipa de cada jogo — transferências a meio da época contam pelo clube certo). Só é preciso voltar a correr para juntar uma época que acabou (acrescentar em `EPOCAS`). Na categoria "Tudo", metade das perguntas do banco vem daqui.
- **Premier League (`pl`)**: geradas no browser a partir de `dados.json` (modelos em `buildTemplates()`); a resposta óbvia é o jogador mais popular entre os adeptos (`popular`). `dados.json` é escrito sozinho pela Action `dados.yml` (terça e sexta); à mão: `python3 scripts/quiz_dados.py` (Windows: `py -X utf8 scripts/quiz_dados.py`).

## Testar e publicar
- Servir localmente (`python3 -m http.server`) e abrir `/index.html`; o Playwright está disponível nas sessões na nuvem. Verificar telemóvel (390 px) e computador, sem erros na consola e sem scroll horizontal.
- Publicar: commit no `main` e `git push` (o site atualiza em 1-2 minutos). Se não for possível escrever no `main`, abrir um PR e explicar: *"Na app do GitHub, abre Pull requests → este PR → Merge pull request → Confirm merge."*
