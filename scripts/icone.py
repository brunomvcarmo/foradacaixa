"""Ícone do Fora da Caixa para o ecrã principal do telemóvel, no mesmo estilo do da app da FPL
(letras grandes, corte na diagonal com o nome, bola 3D com riscos de velocidade), com as cores retro do jogo.
Desenha em HTML e grava PNG com o Playwright.
Uso (a partir da raiz):  python3 scripts/icone.py <desenho>          → icones/icone-512/192/180/32.png
                         python3 scripts/icone.py amostra [desenhos…] → icones/amostra.png (lado a lado)"""
import math, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'icones'
FONT = '<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Barlow+Semi+Condensed:wght@700;800&display=block" rel="stylesheet">'
BASE = ".i{width:512px;height:512px;position:relative;overflow:hidden;font-family:'Barlow Semi Condensed',sans-serif}"
CREME, VERDE, ESCURO, VERMELHO, MOSTARDA = '#f3ead6', '#1e5a37', '#1d2b22', '#d6452f', '#e8b33a'


def bola_3d(cls='ball', uid='r', rx=24, ry=-14, rz=8, pent='#1d2b22'):
    """Bola clássica verdadeira: icosaedro truncado (12 pentágonos e 20 hexágonos) insuflado para uma esfera,
    rodado em 3D e projetado, com luz em cada painel, costuras, sombra e brilho. viewBox -50..50."""
    phi = (1 + 5 ** .5) / 2
    V = [(0, a, b * phi) for a in (-1, 1) for b in (-1, 1)] + [(a, b * phi, 0) for a in (-1, 1) for b in (-1, 1)] + [(a * phi, 0, b) for a in (-1, 1) for b in (-1, 1)]
    d2 = lambda p, q: sum((x - y) ** 2 for x, y in zip(p, q))
    nb = {i: [j for j in range(12) if j != i and abs(d2(V[i], V[j]) - 4) < 1e-6] for i in range(12)}
    lerp = lambda p, q, t: tuple(x + (y - x) * t for x, y in zip(p, q))
    faces = []
    for i in range(12):                                   # pentágonos: um por vértice do icosaedro
        v = V[i]; n = sum(x * x for x in v) ** .5; z = tuple(x / n for x in v)
        ref = [x - y for x, y in zip(V[nb[i][0]], v)]
        def ang(j):
            w = [x - y for x, y in zip(V[j], v)]
            e1 = ref; e2 = (z[1] * e1[2] - z[2] * e1[1], z[2] * e1[0] - z[0] * e1[2], z[0] * e1[1] - z[1] * e1[0])
            return math.atan2(sum(a * b for a, b in zip(w, e2)), sum(a * b for a, b in zip(w, e1)))
        faces.append(('p', [lerp(v, V[j], 1 / 3) for j in sorted(nb[i], key=ang)]))
    for i in range(12):                                   # hexágonos: um por face do icosaedro
        for j in nb[i]:
            for k in nb[i]:
                if i < j < k and k in nb[j]:
                    a, b, c = V[i], V[j], V[k]
                    faces.append(('h', [lerp(a, b, 1 / 3), lerp(a, b, 2 / 3), lerp(b, c, 1 / 3), lerp(b, c, 2 / 3), lerp(c, a, 1 / 3), lerp(c, a, 2 / 3)]))
    def rot(p):
        x, y, z = p
        for axis, deg in (('x', rx), ('y', ry), ('z', rz)):
            c, s_ = math.cos(math.radians(deg)), math.sin(math.radians(deg))
            if axis == 'x': y, z = y * c - z * s_, y * s_ + z * c
            elif axis == 'y': x, z = x * c + z * s_, -x * s_ + z * c
            else: x, y = x * c - y * s_, x * s_ + y * c
        return x, y, z
    unit = lambda p: tuple(x / sum(y * y for y in p) ** .5 for x in p)
    L = unit((-.45, -.55, .7))
    def limb(p):                                          # o que fica atrás encosta à borda (não aparece por dentro)
        x, y, z = p
        if z >= 0: return p
        r = (x * x + y * y) ** .5 or 1
        return x / r, y / r, z
    out = []
    for kind, P in faces:
        pts = []
        for m in range(len(P)):                           # arestas curvas: subdividir e empurrar para a esfera
            for t in range(6):
                pts.append(limb(rot(unit(lerp(P[m], P[(m + 1) % len(P)], t / 6)))))
        cz = sum(p[2] for p in pts) / len(pts)
        if cz < -.25: continue
        n = unit(rot(unit(tuple(sum(p[i] for p in P) / len(P) for i in range(3)))))
        lit = max(0, sum(a * b for a, b in zip(n, L)))
        if kind == 'h':
            g = int(204 + 51 * lit); fill = f'rgb({g},{g},{min(255, g + 6)})'
        else:
            fill = pent; 
        out.append((cz, f'<polygon points="{" ".join(f"{p[0] * 47:.2f},{p[1] * 47:.2f}" for p in pts)}" fill="{fill}"'
                        f'{f" opacity=" + chr(34) + str(round(.82 + .18 * lit, 2)) + chr(34) if kind == "p" else ""} stroke="#6c6a58" stroke-width=".7" stroke-linejoin="round"/>'))
    body = ''.join(x for _, x in sorted(out))
    return (f'<svg class="{cls}" viewBox="-50 -50 100 100"><defs>'
            f'<radialGradient id="{uid}s" cx="36%" cy="30%" r="72%"><stop offset=".55" stop-color="#1d2b22" stop-opacity="0"/><stop offset="1" stop-color="#1d2b22" stop-opacity=".35"/></radialGradient>'
            f'<radialGradient id="{uid}h" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
            f'<clipPath id="{uid}c"><circle r="47"/></clipPath></defs>'
            f'<circle r="47" fill="#fff"/><g clip-path="url(#{uid}c)">{body}<circle r="47" fill="url(#{uid}s)"/></g>'
            f'<ellipse cx="-16" cy="-24" rx="16" ry="9" fill="url(#{uid}h)" transform="rotate(-35 -16 -24)"/>'
            f'<circle r="46.6" fill="none" stroke="#1d2b22" stroke-width="1.4"/></svg>')


ANG = -13.5   # inclinação do corte e dos riscos


def desenho(fundo, letras, letras_sombra, corte, nome, nome_destaque, risco, ball=None, sheen=True):
    trail = [(196, 222, 140, .95), (150, 250, 186, .6), (216, 278, 120, .32)]
    trails = ''.join(f'<div class="tr" style="left:{x}px;top:{y}px;width:{w}px;opacity:{o}"></div>' for x, y, w, o in trail)
    brilho = '<div style="position:absolute;inset:0;background:radial-gradient(circle at 18% 8%,rgba(255,255,255,.45) 0,rgba(255,255,255,0) 45%)"></div>' if sheen else ''
    css = (f".i{{background:{fundo}}}"
           f".cut{{position:absolute;inset:0;background:{corte};clip-path:polygon(0 76%,100% 52%,100% 100%,0 100%)}}"
           f".tr{{position:absolute;height:13px;border-radius:7px;background:{risco};transform:rotate({ANG}deg);transform-origin:100% 50%}}"
           ".ball{position:absolute;left:316px;top:168px;width:170px;height:170px;filter:drop-shadow(-4px 12px 12px rgba(29,43,34,.45))}"
           f".t{{position:absolute;left:36px;top:52px;color:{letras};font-family:'Alfa Slab One',serif;font-size:196px;line-height:.9;letter-spacing:-4px;text-shadow:8px 8px 0 {letras_sombra}}}"
           f".s{{position:absolute;left:46px;top:414px;color:{nome};font-size:44px;font-weight:800;letter-spacing:4px;text-transform:uppercase;line-height:1.1}}"
           f".s b{{color:{nome_destaque}}}")
    body = brilho + '<div class="cut"></div><div class="t">FdC</div>' + trails + (ball or bola_3d()) + '<div class="s">Fora da <b>Caixa</b></div>'
    return css, body


D = {
    # creme em cima, letras verdes com sombra vermelha, corte verde-escuro com o nome
    'creme': desenho(f'linear-gradient(150deg,#fbf4e3 0%,{CREME} 60%,#e9dcc0 100%)', VERDE, VERMELHO, f'linear-gradient(160deg,#236541,{ESCURO})', CREME, MOSTARDA, ESCURO),
    # relvado verde em cima, letras creme com sombra escura, corte vermelho com o nome
    'relvado': desenho(f'repeating-linear-gradient(110deg,#226640 0 46px,{VERDE} 46px 92px)', CREME, ESCURO, f'linear-gradient(160deg,#e05437,#b8321f)', CREME, ESCURO, CREME, sheen=False),
    # mostarda de cartaz, letras vermelhas com sombra escura, corte verde
    'cartaz': desenho(f'linear-gradient(150deg,#f2c45a 0%,{MOSTARDA} 65%,#d89a23 100%)', VERMELHO, ESCURO, f'linear-gradient(160deg,#236541,{ESCURO})', CREME, MOSTARDA, ESCURO),
}


# ---------- variantes com referência à distância ou ao conhecimento (sempre com a bola) ----------
TICKS = lambda x0, x1, y, n, h, c: ''.join(f'<line x1="{x0 + (x1 - x0) * i / n:.1f}" y1="{y}" x2="{x0 + (x1 - x0) * i / n:.1f}" y2="{y - (h if i % 5 == 0 else h * .5)}" stroke="{c}" stroke-width="{5 if i % 5 == 0 else 3}"/>' for i in range(n + 1))
D.update({
    # A. ponto de interrogação: a bola é o ponto (conhecimento)
    'pergunta': (f".i{{background:repeating-linear-gradient(110deg,#226640 0 46px,{VERDE} 46px 92px)}}"
                 ".q{position:absolute;inset:0}"
                 ".ball{position:absolute;left:176px;top:318px;width:164px;height:164px;filter:drop-shadow(-4px 12px 12px rgba(29,43,34,.5))}"
                 f".tag{{position:absolute;right:30px;bottom:44px;background:{MOSTARDA};color:{ESCURO};font:800 46px 'Barlow Semi Condensed';padding:2px 16px;border-radius:12px;border:5px solid {ESCURO};box-shadow:6px 6px 0 {ESCURO};transform:rotate(-6deg)}}",
                 '<svg class="q" viewBox="0 0 512 512"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="66">'
                 f'<path d="M148 176C148 66 364 58 364 170C364 246 258 236 258 300" stroke="{ESCURO}" transform="translate(12 12)"/>'
                 f'<path d="M148 176C148 66 364 58 364 170C364 246 258 236 258 300" stroke="{CREME}"/></g></svg>'
                 + bola_3d() + '<div class="tag">50 m</div>'),
    # B. remate de longe: relvado em perspetiva com as distâncias e a bola a voar para a baliza
    'distancia': (f".i{{background:{CREME}}}"
                  ".p{position:absolute;inset:0}"
                  ".ball{position:absolute;left:286px;top:92px;width:150px;height:150px;filter:drop-shadow(-4px 14px 12px rgba(29,43,34,.45))}",
                  '<svg class="p" viewBox="0 0 512 512"><defs><linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a6f43"/><stop offset="1" stop-color="#1e5a37"/></linearGradient></defs>'
                  '<path d="M150 120H362L512 512H0Z" fill="url(#rv)"/>'
                  + ''.join(f'<path d="M{150 - 150 * t:.0f} {120 + 392 * t:.0f}H{362 + 150 * t:.0f}" stroke="{CREME}" stroke-width="{3 + 5 * t:.1f}" opacity=".9"/>'
                            f'<text x="{170 - 150 * t:.0f}" y="{110 + 392 * t:.0f}" font-family="Alfa Slab One" font-size="{30 + 30 * t:.0f}" fill="{CREME}" stroke="{ESCURO}" stroke-width="{5 + 4 * t:.1f}" paint-order="stroke" stroke-linejoin="round">{lbl}</text>'
                            for t, lbl in ((.12, '11'), (.36, '25'), (.78, '50 m')))
                  + f'<rect x="206" y="64" width="100" height="56" fill="none" stroke="{ESCURO}" stroke-width="11" transform="translate(5 5)"/>'
                  f'<rect x="206" y="64" width="100" height="56" fill="none" stroke="#fffaf0" stroke-width="11"/>'
                  f'<path d="M330 480C300 330 300 230 340 175" fill="none" stroke="{VERMELHO}" stroke-width="13" stroke-dasharray="4 26" stroke-linecap="round"/></svg>'
                  + bola_3d()),
    # C. lâmpada: a bola é a ideia (conhecimento)
    'ideia': (f".i{{background:radial-gradient(circle at 50% 38%,#2a7a4c 0,{VERDE} 45%,#123824 100%)}}"
              ".r{position:absolute;inset:0}"
              ".ball{position:absolute;left:136px;top:66px;width:240px;height:240px;filter:drop-shadow(0 0 30px rgba(232,179,58,.75))}",
              '<svg class="r" viewBox="0 0 512 512">'
              + ''.join(f'<line x1="{256 + 150 * math.cos(math.radians(a)):.0f}" y1="{183 + 150 * math.sin(math.radians(a)):.0f}" x2="{256 + 192 * math.cos(math.radians(a)):.0f}" y2="{183 + 192 * math.sin(math.radians(a)):.0f}" stroke="{MOSTARDA}" stroke-width="18" stroke-linecap="round"/>' for a in (-155, -122, -90, -58, -25))
              + f'<path d="M206 300H306L298 332H214Z" fill="{CREME}" stroke="{ESCURO}" stroke-width="6"/>'
              + ''.join(f'<rect x="{212 + i * 3}" y="{336 + i * 28}" width="{88 - i * 6}" height="22" rx="8" fill="#c9bd9c" stroke="{ESCURO}" stroke-width="6"/>' for i in range(3))
              + f'<path d="M232 420H280L268 446H244Z" fill="{ESCURO}"/></svg>' + bola_3d()),
    # D. como o da FPL, mas o corte é uma fita métrica até aos 50 m (distância)
    'fita': (f".i{{background:linear-gradient(150deg,#fbf4e3 0%,{CREME} 60%,#e9dcc0 100%)}}"
             ".f{position:absolute;inset:0}"
             f".t{{position:absolute;left:36px;top:52px;color:{VERDE};font-family:'Alfa Slab One',serif;font-size:196px;line-height:.9;letter-spacing:-4px;text-shadow:8px 8px 0 {VERMELHO}}}"
             ".tr{position:absolute;height:13px;border-radius:7px;background:#1d2b22;transform:rotate(-13.5deg);transform-origin:100% 50%}"
             ".ball{position:absolute;left:318px;top:150px;width:170px;height:170px;filter:drop-shadow(-4px 12px 12px rgba(29,43,34,.45))}",
             '<div class="t">FdC</div>'
             + ''.join(f'<div class="tr" style="left:{x}px;top:{y}px;width:{w}px;opacity:{o}"></div>' for x, y, w, o in [(196, 210, 140, .95), (150, 238, 186, .6), (216, 266, 120, .32)])
             + '<svg class="f" viewBox="0 0 512 512"><g transform="rotate(-13.5 256 400)">'
             f'<rect x="-40" y="352" width="600" height="104" fill="{ESCURO}" transform="translate(0 10)"/>'
             f'<rect x="-40" y="352" width="600" height="104" fill="{MOSTARDA}" stroke="{ESCURO}" stroke-width="6"/>'
             + TICKS(10, 500, 456, 50, 34, ESCURO)
             + ''.join(f'<text x="{10 + 490 * v / 50:.0f}" y="410" text-anchor="middle" font-family="Alfa Slab One" font-size="{40 if v == 50 else 30}" fill="{VERMELHO if v == 50 else ESCURO}">{v}</text>' for v in (10, 20, 30))
             + f'<text x="452" y="412" text-anchor="middle" font-family="Alfa Slab One" font-size="44" fill="{VERMELHO}">50m</text></g></svg>'
             + bola_3d()),
})


def html(k):
    css, body = D[k]
    return f'<!doctype html><html><head><meta charset="utf-8">{FONT}<style>html,body{{margin:0}}{BASE}{css}</style></head><body><div class="i">{body}</div></body></html>'


def amostra(b, ks=None):
    ks = ks or list(D)
    cells = ''.join(f'<div style="text-align:center;font:600 22px sans-serif;color:#1d2b22"><div style="width:256px;height:256px;border-radius:56px;overflow:hidden;margin:0 auto 10px">'
                    f'<iframe srcdoc="{html(k).replace(chr(34), "&quot;")}" style="width:512px;height:512px;border:0;transform:scale(.5);transform-origin:0 0"></iframe></div>{n}. {k}</div>'
                    for n, k in enumerate(ks, 1))
    pg = b.new_page(viewport={'width': 940, 'height': 340}, device_scale_factor=2)
    pg.set_content(f'<body style="margin:0;padding:24px;background:#f4f1ea;display:flex;flex-wrap:wrap;gap:28px">{cells}</body>'); pg.wait_for_timeout(2500)
    out = OUT / 'amostra.png'; pg.screenshot(path=str(out), full_page=True); print('amostra em', out)


def gravar(b, k):
    OUT.mkdir(exist_ok=True)
    for size in (512, 192, 180, 32):
        pg = b.new_page(viewport={'width': 512, 'height': 512}, device_scale_factor=size / 512)
        pg.set_content(html(k)); pg.wait_for_timeout(1500)
        pg.locator('.i').screenshot(path=str(OUT / f'icone-{size}.png')); pg.close()
    print(f'ícone "{k}" em', OUT)


if __name__ == '__main__':
    k = sys.argv[1] if len(sys.argv) > 1 else ''
    if k != 'amostra' and k not in D: print(__doc__); sys.exit(1)
    with sync_playwright() as pw:
        try: b = pw.chromium.launch()
        except Exception: b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--headless', '--no-sandbox'])   # sessões na nuvem
        amostra(b, sys.argv[2:]) if k == 'amostra' else gravar(b, k)
        b.close()
