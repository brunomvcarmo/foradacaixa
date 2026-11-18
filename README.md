# Fora da Caixa ⚽

Quiz de futebol em que **o óbvio não marca**: qualquer resposta certa é golo, mas quanto mais rara for, mais longe é o remate (11 m → 50 m) e mais pontos dá.

**Jogar:** https://brunomvcarmo.github.io/foradacaixa/

- **Jogo rápido:** 7 perguntas de 25 segundos, sempre que quiseres.
- **Sem fim:** 3 vidas; séries de golos multiplicam os pontos; um golo do meio-campo devolve uma vida.
- **Desafio do dia:** as mesmas 7 para toda a gente.
- **Desafiar amigo:** um link com as tuas 7 perguntas e a tua pontuação.
- **Categorias:** Portugal, Mundo e história, Premier League desta época (sempre novas) e Premier League 2016-2025.

## Ficheiros
- `index.html` — o jogo (um só ficheiro, sem instalar nada).
- `perguntas.js` + `perguntas2.js` — as perguntas escritas à mão (respostas da mais óbvia para a mais rara).
- `historia.json` — 621 perguntas das épocas 2016/17 a 2024/25 da Premier League, a partir das estatísticas oficiais (`scripts/historia_pl.py`).
- `dados.json` — estatísticas da Premier League desta época, atualizadas sozinhas à terça e sexta pela Action `.github/workflows/dados.yml` (`scripts/quiz_dados.py`).
