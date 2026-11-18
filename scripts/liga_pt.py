"""Perguntas da Liga Portuguesa (1.ª Liga) para o jogo "Fora da Caixa", geradas a partir dos resultados de todos os jogos.
Fontes (públicas, no GitHub): jalapic/engsoccerdata (1994/95 a 2024/25) e openfootball/football.json (2025/26 e a época atual).
As duas foram conferidas uma contra a outra nas épocas em comum (2018/19 a 2024/25: os mesmos resultados).
Só se fazem perguntas tiradas diretamente dos resultados (quem venceu quem, golos, vitórias/derrotas) — nunca a classificação
oficial, que pode ter descontos de pontos ou decisões de secretaria.
Cada pergunta leva o período: 'atual' (esta época), 'recente' (2010/11 até à época passada) ou 'antiga' (antes de 2010/11).
Escreve liga_pt.json. Corre sozinho na Action dados.yml (a época atual muda todas as semanas).
Uso (a partir da raiz):  python3 scripts/liga_pt.py   ·   Windows: py -X utf8 scripts/liga_pt.py"""
import csv, io, json, time, urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'liga_pt.json'
HIST = 'https://raw.githubusercontent.com/jalapic/engsoccerdata/master/data-raw/portugal.csv'
OF = 'https://raw.githubusercontent.com/openfootball/football.json/master/{s}/pt.1.json'
UA = {'User-Agent': 'Mozilla/5.0', 'Accept': '*/*'}

# nomes das duas fontes -> nome usado no jogo (igual ao das outras perguntas)
NOME = {'Sp Lisbon': 'Sporting', 'Sporting CP': 'Sporting', 'Sporting Clube de Portugal': 'Sporting', 'Porto': 'FC Porto', 'FC Porto': 'FC Porto',
        'Benfica': 'Benfica', 'SL Benfica': 'Benfica', 'Sport Lisboa e Benfica': 'Benfica', 'Sp Braga': 'Braga', 'Sporting Braga': 'Braga',
        'Sporting Clube de Braga': 'Braga', 'Guimaraes': 'Vitória de Guimarães', 'Vitória Guimarães': 'Vitória de Guimarães',
        'Setubal': 'Vitória de Setúbal', 'Vitória Setúbal': 'Vitória de Setúbal', 'Academica': 'Académica', 'Est Amadora': 'Estrela da Amadora',
        'Estrela da Amadora': 'Estrela da Amadora', 'CF Estrela da Amadora': 'Estrela da Amadora', 'Belenenses': 'Belenenses',
        'Belenenses SAD': 'Belenenses SAD', 'Aves': 'Desportivo das Aves', 'CD Aves': 'Desportivo das Aves', 'AVS Futebol SAD': 'AVS', 'AVS': 'AVS',
        'Chaves': 'Chaves', 'Desp. Chaves': 'Chaves', 'GD Chaves': 'Chaves', 'Maritimo': 'Marítimo', 'CS Marítimo': 'Marítimo',
        'Nacional': 'Nacional', 'CD Nacional': 'Nacional', 'Uniao Madeira': 'União da Madeira', 'Madeira': 'União da Madeira',
        'Leiria': 'União de Leiria', 'Leixoes': 'Leixões', 'Naval': 'Naval 1.º de Maio', 'Olhanense': 'Olhanense',
        'Pacos Ferreira': 'Paços de Ferreira', 'Paços de Ferreira': 'Paços de Ferreira', 'Penafiel': 'Penafiel', 'Portimonense': 'Portimonense',
        'Portimonense SC': 'Portimonense', 'Salgueiros': 'Salgueiros', 'Santa Clara': 'Santa Clara', 'CD Santa Clara': 'Santa Clara',
        'Tirsense': 'Tirsense', 'Tondela': 'Tondela', 'CD Tondela': 'Tondela', 'Trofense': 'Trofense', 'Varzim': 'Varzim', 'Beira Mar': 'Beira-Mar',
        'Campomaior': 'Campomaiorense', 'Campomaiorense': 'Campomaiorense', 'Espinho': 'Espinho', 'Leca': 'Leça', 'Famalicao': 'Famalicão',
        'FC Famalicão': 'Famalicão', 'FC Vizela': 'Vizela', 'Farense': 'Farense', 'SC Farense': 'Farense', 'Feirense': 'Feirense',
        'Feirense ': 'Feirense', 'CD Feirense': 'Feirense', 'Felgueiras': 'Felgueiras', 'Gil Vicente': 'Gil Vicente', 'Gil Vicente FC': 'Gil Vicente',
        'Moreirense': 'Moreirense', 'Moreirense FC': 'Moreirense', 'Rio Ave': 'Rio Ave', 'Rio Ave FC': 'Rio Ave', 'Estoril': 'Estoril',
        'GD Estoril': 'Estoril', 'GD Estoril Praia': 'Estoril', 'Arouca': 'Arouca', 'FC Arouca': 'Arouca', 'Alverca': 'Alverca', 'FC Alverca': 'Alverca',
        'Casa Pia AC': 'Casa Pia', 'Boavista': 'Boavista', 'Boavista FC': 'Boavista', 'Académico de Viseu FC': 'Académico de Viseu'}
# quanto "salta à vista" cada clube (decide o mais óbvio); os outros vão pelos pontos da época
PRESTIGIO = {'Benfica': 300, 'FC Porto': 300, 'Sporting': 300, 'Braga': 150, 'Vitória de Guimarães': 120, 'Boavista': 100, 'Marítimo': 60,
             'Belenenses': 50, 'Académica': 40, 'Vitória de Setúbal': 40, 'Rio Ave': 30, 'Nacional': 30, 'Gil Vicente': 25, 'Paços de Ferreira': 25,
             'Estoril': 25, 'Famalicão': 25, 'Santa Clara': 20, 'Moreirense': 15, 'Arouca': 15, 'Casa Pia': 10}
GRANDES = ['Benfica', 'FC Porto', 'Sporting', 'Braga', 'Vitória de Guimarães']
ART = {'Benfica': 'o Benfica', 'FC Porto': 'o FC Porto', 'Sporting': 'o Sporting', 'Braga': 'o Braga', 'Vitória de Guimarães': 'o Vitória de Guimarães'}


def get(url):
    for k in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=180) as r: return r.read().decode('utf-8', errors='replace')
        except Exception as e:
            if k == 3: raise RuntimeError(f'falhou {url}: {e}')
            time.sleep(3 + 4 * k)


def nome(n):
    n2 = NOME.get(n) or NOME.get(n.strip())
    if not n2: raise SystemExit(f'clube sem nome no jogo: {n!r} — acrescentar a NOME')
    return n2


def epoca_atual():
    now = datetime.now(timezone.utc); return now.year if now.month >= 7 else now.year - 1


def jogos():
    """devolve {ano de início: [(data, ronda, casa, fora, golos casa, golos fora)]}"""
    out = defaultdict(list)
    for r in csv.DictReader(io.StringIO(get(HIST))):
        if r['division'] != 'P1': continue
        y = int(r['Season']); casa, fora = nome(r['home']), nome(r['visitor'])
        if 2018 <= y <= 2021 and 'Belenenses' in (casa, fora):   # nestas épocas quem jogou a 1.ª Liga foi a Belenenses SAD
            casa, fora = ['Belenenses SAD' if t == 'Belenenses' else t for t in (casa, fora)]
        out[y].append((r['Date'], None, casa, fora, int(r['hgoal']), int(r['vgoal'])))
    ultimo = max(out)
    for y in range(ultimo + 1, epoca_atual() + 1):
        try: d = json.loads(get(OF.format(s=f'{y}-{(y + 1) % 100:02d}')))
        except Exception: continue
        for m in d['matches']:
            sc = m.get('score'); ft = sc.get('ft') if isinstance(sc, dict) else sc if isinstance(sc, list) else None
            if not ft or len(ft) != 2: continue
            rnd = m.get('round', ''); rnd = int(rnd.split()[-1]) if rnd.split() and rnd.split()[-1].isdigit() else None
            out[y].append((m['date'], rnd, nome(m['team1']), nome(m['team2']), int(ft[0]), int(ft[1])))
        if y == epoca_atual():   # clubes da época atual (mesmo os que ainda não jogaram)
            out[('clubes', y)] = sorted({nome(m[k]) for m in d['matches'] for k in ('team1', 'team2')})
    return out


def main():
    J = jogos(); atual = epoca_atual()
    perguntas = []
    for y in sorted(k for k in J if isinstance(k, int)):
        ms = J[y]; lbl = f'{y}/{(y + 1) % 100:02d}'
        per = 'atual' if y == atual else 'recente' if y >= 2010 else 'antiga'
        MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        ud = max(m[0] for m in ms); ate = f' (jogos até {int(ud[8:10])} {MES[int(ud[5:7]) - 1]} {ud[:4]})' if per == 'atual' else ''
        quando = 'esta época' if per == 'atual' else f'na 1.ª Liga {lbl}'
        sub = f'1.ª Liga {lbl}' + ate
        st = defaultdict(Counter)
        for d, rnd, h, a, hg, ag in ms:
            for t, gf, gs in ((h, hg, ag), (a, ag, hg)):
                s = st[t]; s['j'] += 1; s['gm'] += gf; s['gs'] += gs
                s['v' if gf > gs else 'e' if gf == gs else 'd'] += 1
        pts = {t: 3 * s['v'] + s['e'] for t, s in st.items()}
        fama = lambda t: PRESTIGIO.get(t, 0) + pts.get(t, 0) / 100
        def add(qid, txt, itens, mn=5, mx=18, s=sub, tipo_ord='fama'):
            itens = list(dict.fromkeys(itens))
            if not (mn <= len(itens) <= mx): return
            itens.sort(key=lambda x: -fama(x[0]))
            seen, r = set(), []
            for t, stat in itens:
                if t not in seen: seen.add(t); r.append([t, stat])
            if len(r) >= max(mn, 5): perguntas.append({'id': f'pt{lbl}-{qid}', 'per': per, 'ep': lbl, 'txt': txt, 'sub': s, 'r': r})
        rec = lambda t: f"{st[t]['v']}V {st[t]['e']}E {st[t]['d']}D"
        clubes = J.get(('clubes', y)) or sorted(st)
        add('clubes', f'Um clube que jogou a 1.ª Liga {lbl}', [(t, rec(t) if t in st else '') for t in clubes], mn=10, mx=20, s=f'As {len(clubes)} equipas dessa época')
        for g in GRANDES:
            if g not in st: continue
            ven, emp, venfora = {}, {}, {}
            for d, rnd, h, a, hg, ag in ms:
                if g not in (h, a): continue
                adv = a if h == g else h; mg, ag2 = (hg, ag) if h == g else (ag, hg)
                res = f'{ag2}-{mg} ' + ('fora' if h == g else 'em casa')
                if ag2 > mg:
                    ven.setdefault(adv, res)
                    if h == g: venfora.setdefault(adv, res)
                elif ag2 == mg: emp.setdefault(adv, res)
            add(f'venceu-{g}', f'Um clube que venceu {ART[g]} {quando}', list(ven.items()), mn=5, mx=15)
            if g in ('Benfica', 'FC Porto', 'Sporting'):
                add(f'empatou-{g}', f'Um clube que empatou com {ART[g]} {quando}', list(emp.items()), mn=5, mx=15)
                add(f'fora-{g}', f'Um clube que foi ganhar ao estádio {"do " + g[3:] if g.startswith("FC ") else "do " + g} {quando}', list(venfora.items()), mn=5, mx=12)
        # goleadas
        gol = {}
        for d, rnd, h, a, hg, ag in ms:
            if abs(hg - ag) >= 4:
                w = h if hg > ag else a; gol.setdefault(w, f'{max(hg, ag)}-{min(hg, ag)}')
        add('goleada', f'Um clube que ganhou um jogo por 4 ou mais golos de diferença {quando}', list(gol.items()), mn=5, mx=14)
        cinco = {}
        for d, rnd, h, a, hg, ag in ms:
            for t, gf, gs in ((h, hg, ag), (a, ag, hg)):
                if gf >= 5: cinco.setdefault(t, f'{gf}-{gs}')
        add('cinco', f'Um clube que marcou 5 ou mais golos num jogo {quando}', list(cinco.items()), mn=5, mx=12)
        if per != 'atual':
            pos = [(t, f"{st[t]['v']}V, {st[t]['d']}D") for t in st if st[t]['v'] > st[t]['d']]
            add('positivo', f'Um clube que acabou a 1.ª Liga {lbl} com mais vitórias do que derrotas', pos, mn=5, mx=12)
            for lim in (60, 55, 50, 45, 40):   # o limite que der uma lista de tamanho jeitoso
                gm = [(t, f"{st[t]['gm']} golos") for t in st if st[t]['gm'] >= lim]
                if 5 <= len(gm) <= 12: add(f'gm{lim}', f'Um clube que marcou {lim} ou mais golos na 1.ª Liga {lbl}', gm); break
            for lim in (25, 30, 35, 40):
                gs = [(t, f"{st[t]['gs']} sofridos") for t in st if st[t]['gs'] < lim]
                if 5 <= len(gs) <= 10: add(f'gs{lim}', f'Um clube que sofreu menos de {lim} golos na 1.ª Liga {lbl}', gs); break
            for lim in (8, 10, 12, 6):
                pv = [(t, f"{st[t]['v']} vitórias") for t in st if st[t]['v'] <= lim]
                if 5 <= len(pv) <= 9: add(f'pv{lim}', f'Um clube que ganhou {lim} jogos ou menos na 1.ª Liga {lbl}', pv); break
        else:
            invictos = [(t, rec(t)) for t in st if st[t]['d'] == 0]
            add('invicto', 'Um clube que ainda não perdeu esta época', invictos, mn=5, mx=10)
            semganhar = [(t, rec(t)) for t in st if st[t]['v'] == 0]
            add('semganhar', 'Um clube que ainda não ganhou esta época', semganhar, mn=5, mx=10)
            rondas = sorted({m[1] for m in ms if m[1]})
            for r in rondas:
                rm = [m for m in ms if m[1] == r]
                if len(rm) < 7: continue
                ven = [((h if hg > ag else a), f'{max(hg, ag)}-{min(hg, ag)}') for d, rnd, h, a, hg, ag in rm if hg != ag]
                add(f'ronda{r}', f'Um clube que ganhou na {r}.ª jornada desta época', ven, mn=5, mx=9)
    # várias épocas juntas (cada uma das grandes, por década): listas maiores e mais "Fora da Caixa"
    DEC = [(1994, 1999, 'entre 1994/95 e 1999/00', 'antiga'), (2000, 2009, 'entre 2000/01 e 2009/10', 'antiga'),
           (2010, 2014, 'entre 2010/11 e 2014/15', 'recente'), (2015, 2019, 'entre 2015/16 e 2019/20', 'recente'), (2020, atual - 1, f'entre 2020/21 e {atual - 1}/{atual % 100:02d}', 'recente')]
    for a0, a1, txt, per in DEC:
        ms = [m for y in J if isinstance(y, int) and a0 <= y <= a1 for m in J[y]]
        if not ms: continue
        for g in ('Benfica', 'FC Porto', 'Sporting'):
            ven = Counter()
            for d, rnd, h, a, hg, ag in ms:
                if g in (h, a):
                    adv = a if h == g else h; mg, og = (hg, ag) if h == g else (ag, hg)
                    if og > mg: ven[adv] += 1
            fam = lambda t: PRESTIGIO.get(t, 0)
            r = [[t, f'{v} vitória' + ('s' if v > 1 else '')] for t, v in sorted(ven.items(), key=lambda x: (-fam(x[0]), -x[1]))]
            if 5 <= len(r) <= 30:
                perguntas.append({'id': f'ptdec{a0}-venceu-{g}', 'per': per, 'ep': txt, 'txt': f'Um clube que venceu {ART[g]} na 1.ª Liga {txt}', 'sub': '1.ª Liga, todas as épocas desse período', 'r': r})
        clubes = Counter(t for y in J if isinstance(y, int) and a0 <= y <= a1 for t in {m[2] for m in J[y]})
        r = [[t, f'{v} época' + ('s' if v > 1 else '')] for t, v in sorted(clubes.items(), key=lambda x: (-PRESTIGIO.get(x[0], 0), -x[1]))]
        if len(r) >= 5: perguntas.append({'id': f'ptdec{a0}-clubes', 'per': per, 'ep': txt, 'txt': f'Um clube que jogou a 1.ª Liga {txt}', 'sub': 'Pelo menos uma época nesse período', 'r': r})
    # época atual: perguntas largas (com poucos jogos ainda há poucas respostas nas outras)
    ms = J.get(atual, [])
    if ms:
        lbl = f'{atual}/{(atual + 1) % 100:02d}'; MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
        ud = max(m[0] for m in ms); sub = f'1.ª Liga {lbl} (jogos até {int(ud[8:10])} {MES[int(ud[5:7]) - 1]} {ud[:4]})'
        st = defaultdict(Counter)
        for d, rnd, h, a, hg, ag in ms:
            for t, gf, gs in ((h, hg, ag), (a, ag, hg)):
                st[t]['v' if gf > gs else 'e' if gf == gs else 'd'] += 1; st[t]['gm'] += gf
                if gf >= 3: st[t]['tres'] += 1
                if gs == 0: st[t]['cs'] += 1
                if gf > gs and t == a: st[t]['vf'] += 1
        fam = lambda t: PRESTIGIO.get(t, 0) + st[t]['v']
        for qid, txt, cond, stat in (('emp', 'Um clube que já empatou um jogo esta época', 'e', lambda t: f"{st[t]['e']} empates"),
                                     ('perd', 'Um clube que já perdeu um jogo esta época', 'd', lambda t: f"{st[t]['d']} derrotas"),
                                     ('tres', 'Um clube que já marcou 3 ou mais golos num jogo esta época', 'tres', lambda t: f"{st[t]['tres']} vez(es)"),
                                     ('cs', 'Um clube que já acabou um jogo sem sofrer golos esta época', 'cs', lambda t: f"{st[t]['cs']} jogo(s)"),
                                     ('vf', 'Um clube que já ganhou fora de casa esta época', 'vf', lambda t: f"{st[t]['vf']} vitória(s) fora")):
            r = [[t, stat(t)] for t in sorted(st, key=lambda t: -fam(t)) if st[t][cond] > 0]
            if 5 <= len(r) <= 18: perguntas.append({'id': f'pt{lbl}-larga-{qid}', 'per': 'atual', 'ep': lbl, 'txt': txt, 'sub': sub, 'r': r})
    perguntas = [q for q in perguntas if len(q['r']) >= 5]   # regra do jogo: pelo menos 5 respostas
    data = {'fonte': 'jalapic/engsoccerdata + openfootball/football.json', 'atual': f'{atual}/{(atual + 1) % 100:02d}', 'perguntas': perguntas}
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8', newline='\n')
    print(f'liga_pt.json: {len(perguntas)} perguntas ({OUT.stat().st_size // 1024} KB)', Counter(q['per'] for q in perguntas))


if __name__ == '__main__':
    main()
