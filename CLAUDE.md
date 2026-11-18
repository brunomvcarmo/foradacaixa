# Fora da Caixa — instruções para o Claude

Jogo de futebol independente (não tem nada a ver com a app da FPL do repositório `brunomvcarmo.github.io`).
Site: **https://brunomvcarmo.github.io/foradacaixa/** (GitHub Pages deste repositório, ramo `main`, pasta raiz).
Fala sempre em **português de Portugal** e de forma simples: o utilizador não é programador e usa muito o telemóvel.

## Como funciona
- `index.html` — o jogo todo (HTML + CSS + JS). Ecrãs: início (categorias, modos, recordes), jogo (pergunta, caixa de resposta com sugestões, relvado SVG com o remate animado), fim (pontos, resumo, partilha).
- Distância do remate = posição da resposta na lista de respostas certas, da mais óbvia para a mais rara, dividida em 5 quintos: 11 m (10 pts), 18 m (20), 25 m (30), 35 m (40), 50 m (50).
- Modos: Jogo rápido (7), Sem fim (3 vidas, multiplicador a cada 3 golos seguidos, golo de 50 m devolve uma vida), Desafio do dia (semente = data), Desafiar amigo (`?jogo=<semente base36>&c=<categoria>&p=<pontos>` refaz as mesmas 7).
- Recordes ficam só no browser (`localStorage` `fora-da-caixa-v1`).

## Perguntas
- **Banco (`perguntas.js`)**, categorias `portugal` e `mundo`: `{id, cat, tipo, txt, sub, r}`; `r` ORDENADO da resposta mais óbvia para a mais rara. Tipos: `jogador`, `clube`, `pais`, `treinador`. Nomes alternativos em `ALIASES`; opções que só servem para a lista de sugestões não denunciar as certas em `EXTRAS`.
  - Regra de ouro: **só factos fechados e de que se tem a certeza**, e listas completas (uma resposta certa que falte é dada como errada ao jogador). Quando há edições recentes, pôr o limite no `sub` ("até 2025"). Na dúvida, não pôr a pergunta.
  - Para acrescentar: uma linha nova no `BANCO` com `id` único; nomes iguais aos que já existem para a mesma entidade (ex.: "FC Porto", "Manchester United").
- **Premier League (`pl`)**: geradas no browser a partir de `dados.json` (modelos em `buildTemplates()`); a resposta óbvia é o jogador mais popular entre os adeptos (`popular`). `dados.json` é escrito sozinho pela Action `dados.yml` (terça e sexta); à mão: `python3 scripts/quiz_dados.py` (Windows: `py -X utf8 scripts/quiz_dados.py`).

## Testar e publicar
- Servir localmente (`python3 -m http.server`) e abrir `/index.html`; o Playwright está disponível nas sessões na nuvem. Verificar telemóvel (390 px) e computador, sem erros na consola e sem scroll horizontal.
- Publicar: commit no `main` e `git push` (o site atualiza em 1-2 minutos). Se não for possível escrever no `main`, abrir um PR e explicar: *"Na app do GitHub, abre Pull requests → este PR → Merge pull request → Confirm merge."*
