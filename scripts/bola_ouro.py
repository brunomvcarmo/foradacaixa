"""Fora da Caixa — perguntas da Bola de Ouro (top 3 / top 10 / top 20) → bolaouro.json (categoria "mundo").

Fonte: as classificações completas de cada edição na Wikipédia inglesa (2007 a 2025; em 2020 não houve), guardadas
em data/bola_ouro_ranking.json = {ano: [[lugar, jogador, nacionalidade], …]} (empates: o mesmo lugar).
Os pódios de 1995 a 2006 estão escritos à mão em PODIOS_ANTIGOS (factos conhecidos e fechados).
Nomes dos jogadores iguais aos que o jogo já usa (conferido). Respostas da mais óbvia (melhor lugar, mais vezes) para a mais rara.
Uso: python3 scripts/bola_ouro.py   (não precisa de rede; só volta a ser preciso com uma edição nova)
"""
import json, os
from collections import defaultdict

AQUI = os.path.dirname(os.path.abspath(__file__))
RANK = json.load(open(os.path.join(AQUI, '..', 'data', 'bola_ouro_ranking.json'), encoding='utf8'))
# o mesmo jogador escrito como nas outras perguntas (Transfermarkt), para ser a mesma resposta
MESMO = {}   # (a app junta 'Heung-min Son' e 'Son Heung-min' sozinha: MESMO_NOME no index.html)
RANK = {int(a): [(int(r), MESMO.get(n, n), c) for r, n, c in v] for a, v in RANK.items()}
PODIOS_ANTIGOS = {   # 1.º, 2.º, 3.º
    1995: ['George Weah', 'Jürgen Klinsmann', 'Jari Litmanen'], 1996: ['Matthias Sammer', 'Ronaldo Nazário', 'Alan Shearer'],
    1997: ['Ronaldo Nazário', 'Predrag Mijatović', 'Zinedine Zidane'], 1998: ['Zinedine Zidane', 'Davor Šuker', 'Ronaldo Nazário'],
    1999: ['Rivaldo', 'David Beckham', 'Andriy Shevchenko'], 2000: ['Luís Figo', 'Zinedine Zidane', 'Andriy Shevchenko'],
    2001: ['Michael Owen', 'Raúl', 'Oliver Kahn'], 2002: ['Ronaldo Nazário', 'Roberto Carlos', 'Oliver Kahn'],
    2003: ['Pavel Nedvěd', 'Thierry Henry', 'Paolo Maldini'], 2004: ['Andriy Shevchenko', 'Deco', 'Ronaldinho'],
    2005: ['Ronaldinho', 'Frank Lampard', 'Steven Gerrard'], 2006: ['Fabio Cannavaro', 'Gianluigi Buffon', 'Thierry Henry'],
}
MARCADORES = [   # (id, "da liga", categoria, [(época, [jogadores], golos)])
    ('es', 'da Liga espanhola', 'ligas', [('2015/16', ['Luis Suárez'], 40), ('2016/17', ['Lionel Messi'], 37), ('2017/18', ['Lionel Messi'], 34), ('2018/19', ['Lionel Messi'], 36),
        ('2019/20', ['Lionel Messi'], 25), ('2020/21', ['Lionel Messi'], 30), ('2021/22', ['Karim Benzema'], 27), ('2022/23', ['Robert Lewandowski'], 23), ('2023/24', ['Artem Dovbyk'], 24), ('2024/25', ['Kylian Mbappé'], 31)]),
    ('pl', 'da Premier League', 'ligas', [('2015/16', ['Harry Kane'], 25), ('2016/17', ['Harry Kane'], 29), ('2017/18', ['Mohamed Salah'], 32), ('2018/19', ['Mohamed Salah', 'Sadio Mané', 'Pierre-Emerick Aubameyang'], 22),
        ('2019/20', ['Jamie Vardy'], 23), ('2020/21', ['Harry Kane'], 23), ('2021/22', ['Mohamed Salah', 'Son Heung-min'], 23), ('2022/23', ['Erling Haaland'], 36), ('2023/24', ['Erling Haaland'], 27), ('2024/25', ['Mohamed Salah'], 29)]),
    ('it', 'da Serie A italiana', 'ligas', [('2015/16', ['Gonzalo Higuaín'], 36), ('2016/17', ['Edin Džeko'], 29), ('2017/18', ['Mauro Icardi', 'Ciro Immobile'], 29), ('2018/19', ['Fabio Quagliarella'], 26),
        ('2019/20', ['Ciro Immobile'], 36), ('2020/21', ['Cristiano Ronaldo'], 29), ('2021/22', ['Ciro Immobile'], 27), ('2022/23', ['Victor Osimhen'], 26), ('2023/24', ['Lautaro Martínez'], 24), ('2024/25', ['Mateo Retegui'], 25)]),
    ('de', 'da Bundesliga', 'ligas', [('2015/16', ['Robert Lewandowski'], 30), ('2016/17', ['Pierre-Emerick Aubameyang'], 31), ('2017/18', ['Robert Lewandowski'], 29), ('2018/19', ['Robert Lewandowski'], 22),
        ('2019/20', ['Robert Lewandowski'], 34), ('2020/21', ['Robert Lewandowski'], 41), ('2021/22', ['Robert Lewandowski'], 35), ('2022/23', ['Christopher Nkunku', 'Niclas Füllkrug'], 16), ('2023/24', ['Harry Kane'], 36), ('2024/25', ['Harry Kane'], 26)]),
    ('fr', 'da Ligue 1 francesa', 'ligas', [('2015/16', ['Zlatan Ibrahimović'], 38), ('2016/17', ['Edinson Cavani'], 35), ('2017/18', ['Edinson Cavani'], 28), ('2018/19', ['Kylian Mbappé'], 33),
        ('2019/20', ['Kylian Mbappé', 'Wissam Ben Yedder'], 18), ('2020/21', ['Kylian Mbappé'], 27), ('2021/22', ['Kylian Mbappé'], 28), ('2022/23', ['Kylian Mbappé'], 29), ('2023/24', ['Kylian Mbappé'], 27), ('2024/25', ['Ousmane Dembélé', 'Mason Greenwood'], 21)]),
    ('pt', 'da Liga Portuguesa', 'portugal', [('2015/16', ['Jonas'], 32), ('2016/17', ['Bas Dost'], 34), ('2017/18', ['Jonas'], 34), ('2018/19', ['Haris Seferović'], 23),
        ('2019/20', ['Pizzi', 'Carlos Vinícius', 'Mehdi Taremi'], 18), ('2020/21', ['Pedro Gonçalves'], 23), ('2021/22', ['Darwin Núñez'], 26), ('2022/23', ['Mehdi Taremi'], 22), ('2023/24', ['Viktor Gyökeres'], 29), ('2024/25', ['Viktor Gyökeres'], 39)]),
    ('cl', 'da Liga dos Campeões', 'mundo', [('2015/16', ['Cristiano Ronaldo'], 16), ('2016/17', ['Cristiano Ronaldo'], 12), ('2017/18', ['Cristiano Ronaldo'], 15), ('2018/19', ['Lionel Messi'], 12),
        ('2019/20', ['Robert Lewandowski'], 15), ('2020/21', ['Erling Haaland'], 10), ('2021/22', ['Karim Benzema'], 15), ('2022/23', ['Erling Haaland'], 12), ('2023/24', ['Harry Kane', 'Kylian Mbappé'], 8), ('2024/25', ['Serhou Guirassy', 'Raphinha'], 13)]),
]
NAC = {'Portugal': 'português', 'POR': 'português', 'Brazil': 'brasileiro', 'BRA': 'brasileiro', 'Spain': 'espanhol', 'ESP': 'espanhol',
       'France': 'francês', 'FRA': 'francês', 'Argentina': 'argentino', 'ARG': 'argentino', 'England': 'inglês', 'ENG': 'inglês',
       'Germany': 'alemão', 'GER': 'alemão', 'Netherlands': 'neerlandês', 'NED': 'neerlandês', 'Italy': 'italiano', 'ITA': 'italiano',
       'Belgium': 'belga', 'BEL': 'belga'}
SUB = 'Classificação final da Bola de Ouro (France Football; de 2010 a 2015, FIFA Bola de Ouro). Em 2020 não houve'
ORD = lambda n: f'{n}.º'


def junta(perguntas, qid, txt, sub, linhas, mn=5, mx=70):
    """linhas: jogador → lista de (ano, lugar). Ordem: melhor lugar, depois mais vezes, depois mais recente."""
    if not mn <= len(linhas) <= mx: return
    def stat(v):
        m = min(v, key=lambda x: (x[1], -x[0]))
        return (f'{len(v)} vezes · ' if len(v) > 1 else '') + f'{ORD(m[1])} em {m[0]}'
    r = sorted(linhas.items(), key=lambda kv: (min(x[1] for x in kv[1]), -len(kv[1]), -max(x[0] for x in kv[1])))
    perguntas.append({'id': qid, 'cat': 'mundo', 'tipo': 'jogador', 'txt': txt, 'sub': sub, 'r': [[n, stat(v)] for n, v in r]})


def main():
    P = []
    anos = sorted(RANK)
    def top(a0, a1, lim, nac=None):
        d = defaultdict(list)
        for a in anos:
            if a0 <= a <= a1:
                for r, n, c in RANK[a]:
                    if r <= lim and (nac is None or NAC.get(c) == nac): d[n].append((a, r))
        return d
    # cada edição: o top 10
    for a in anos:
        junta(P, f'bo-top10-{a}', f'Um jogador que ficou no top 10 da Bola de Ouro {a}', SUB, top(a, a, 10), mn=10)
    # períodos: top 10 e top 20
    for a0, a1 in [(2007, 2011), (2012, 2016), (2017, 2021), (2022, 2025), (2010, 2019), (2007, 2025)]:
        junta(P, f'bo-top10-{a0}-{a1}', f'Um jogador que ficou no top 10 da Bola de Ouro entre {a0} e {a1}', SUB, top(a0, a1, 10), mx=80)
    for a0, a1 in [(2007, 2011), (2012, 2016), (2017, 2021), (2022, 2025)]:
        junta(P, f'bo-top20-{a0}-{a1}', f'Um jogador que ficou no top 20 da Bola de Ouro entre {a0} e {a1}', SUB + '. Empatados no 20.º lugar contam', top(a0, a1, 20), mx=80)
    # nacionalidades (2007 a 2025)
    for nac, lim in [('português', 20), ('português', 10), ('brasileiro', 10), ('espanhol', 10), ('francês', 10), ('argentino', 20), ('inglês', 20),
                     ('alemão', 10), ('neerlandês', 20), ('italiano', 20), ('belga', 20), ('brasileiro', 20), ('francês', 20), ('espanhol', 20)]:
        junta(P, f'bo-{nac[:4]}-top{lim}', f'Um {nac} que ficou no top {lim} da Bola de Ouro entre 2007 e 2025', SUB + '. Pela seleção do jogador', top(2007, 2025, lim, nac))
    # pódios: 1995-2006 à mão + 2007-2025 das classificações
    pod = {a: v for a, v in PODIOS_ANTIGOS.items()}
    for a in anos: pod[a] = [n for r, n, c in sorted(RANK[a]) if r <= 3][:3]
    def podio(a0, a1, lugares=(1, 2, 3)):
        d = defaultdict(list)
        for a, v in pod.items():
            if a0 <= a <= a1:
                for i, n in enumerate(v):
                    if i + 1 in lugares: d[n].append((a, i + 1))
        return d
    SUBP = 'Pódio da Bola de Ouro (France Football; de 2010 a 2015, FIFA Bola de Ouro). Em 2020 não houve'
    junta(P, 'bo-podio-1995-2006', 'Um jogador que ficou no pódio (top 3) da Bola de Ouro entre 1995 e 2006', SUBP, podio(1995, 2006))
    junta(P, 'bo-podio-2007-2025', 'Um jogador que ficou no pódio (top 3) da Bola de Ouro entre 2007 e 2025', SUBP, podio(2007, 2025))
    junta(P, 'bo-2o-1995-2025', 'Um jogador que ficou em 2.º lugar na Bola de Ouro entre 1995 e 2025', SUBP, podio(1995, 2025, (2,)))
    junta(P, 'bo-3o-1995-2025', 'Um jogador que ficou em 3.º lugar na Bola de Ouro entre 1995 e 2025', SUBP, podio(1995, 2025, (3,)))
    # quem ficou em 4.º, 5.º… (fora do pódio mas no top 5)
    d = defaultdict(list)
    for a in anos:
        for r, n, c in RANK[a]:
            if 4 <= r <= 5: d[n].append((a, r))
    junta(P, 'bo-4e5', 'Um jogador que ficou em 4.º ou 5.º lugar na Bola de Ouro entre 2007 e 2025', SUB, d)
    junta(P, 'bo-top5-2007-2025', 'Um jogador que já ficou no top 5 da Bola de Ouro (entre 2007 e 2025)', SUB, top(2007, 2025, 5))
    for a0, a1 in [(2007, 2015), (2016, 2025)]:
        junta(P, f'bo-top5-{a0}-{a1}', f'Um jogador que ficou no top 5 da Bola de Ouro entre {a0} e {a1}', SUB, top(a0, a1, 5))
    # ---------- melhores marcadores das ligas (épocas 2015/16 a 2024/25; empatados contam) ----------
    # 2019/20 a 2024/25 conferidos com os dados do Transfermarkt (scripts/estatisticas.py); antes disso, factos conhecidos
    for qid, liga, cat, lista in MARCADORES:
        d = defaultdict(list)
        for ep, nomes, golos in lista:
            for n in nomes: d[n].append((ep, golos))
        r = sorted(d.items(), key=lambda kv: (-len(kv[1]), -max(g for e, g in kv[1])))
        P.append({'id': f'mm-{qid}', 'cat': cat, 'tipo': 'jogador', 'txt': f'Um jogador que foi o melhor marcador {liga} numa época entre 2015/16 e 2024/25',
                  'sub': 'Melhor marcador da época (os empatados no 1.º lugar também contam)', 'r': [[n, ', '.join(f'{e} ({g} golos)' for e, g in v)] for n, v in r]})
    d = defaultdict(list)
    for qid, liga, cat, lista in MARCADORES:
        if qid in ('es', 'pl', 'it', 'de', 'fr'):
            for ep, nomes, golos in lista:
                for n in nomes: d[n].append(f'{ep} {liga[3:] if liga.startswith("da ") else liga}')
    P.append({'id': 'mm-cinco', 'cat': 'ligas', 'tipo': 'jogador', 'txt': 'Um jogador que foi o melhor marcador de uma das 5 grandes ligas entre 2015/16 e 2024/25',
              'sub': 'Inglaterra, Espanha, Itália, Alemanha ou França; os empatados no 1.º lugar também contam', 'r': [[n, ' · '.join(v)] for n, v in sorted(d.items(), key=lambda kv: -len(kv[1]))]})
    with open(os.path.join(AQUI, '..', 'bolaouro.json'), 'w', encoding='utf8', newline='\n') as f:
        json.dump({'fonte': 'Wikipédia (classificações da Bola de Ouro 2007-2025) + pódios 1995-2006 + melhores marcadores', 'perguntas': P}, f, ensure_ascii=False, separators=(',', ':'))
    print(len(P), 'perguntas;', ', '.join(f"{q['id']}:{len(q['r'])}" for q in P))


if __name__ == '__main__':
    main()
