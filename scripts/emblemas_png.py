"""Fora da Caixa — transforma os emblemas dos amigos (emblemas.js) em imagens PNG nítidas.

Os efeitos do SVG (relevo, sombra) são desenhados em baixa resolução por alguns telemóveis (sobretudo o iPhone)
e as letras pequenas viram borrões; por isso a app usa PNGs feitos aqui:
  icones/emblemas/<nome>-g.png  300x375  emblema completo (para tamanhos grandes: ecrã Eu, duelos)
  icones/emblemas/<nome>-p.png  120x150  versão mini: sem letras nem efeitos, só o escudo e o símbolo (listas)
Uso: python3 scripts/emblemas_png.py   (voltar a correr sempre que se mudar o desenho no emblemas.js)
"""
import os, pathlib
from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SAIDA = RAIZ / 'icones' / 'emblemas'
NOMES = ['Bruno', 'Freitas', 'CC', 'Viegas']
TAM = {'g': (300, 375), 'p': (120, 150)}
PAGINA = """<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap" rel="stylesheet">
<style>html,body{margin:0;background:transparent}#c{display:block}#c svg{width:100%;height:100%;display:block}</style></head>
<body><div id="c"></div><script src="EMBLEMAS"></script></body></html>"""

def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    tmp = RAIZ / '_emblemas_tmp.html'
    tmp.write_text(PAGINA.replace('EMBLEMAS', (RAIZ / 'emblemas.js').as_uri()), encoding='utf8')
    try:
        with sync_playwright() as pw:
            try: b = pw.chromium.launch()
            except Exception: b = pw.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--headless', '--no-sandbox'])
            pg = b.new_page(viewport={'width': 600, 'height': 600})
            pg.goto(tmp.as_uri()); pg.wait_for_timeout(1500)
            for nome in NOMES:
                for k, (w, h) in TAM.items():
                    pg.evaluate("""([nome, k, w, h]) => {
                      let svg = emblemaSVG(nome);
                      if (k === 'p') svg = svg.replace(/<text[\\s\\S]*?<\\/text>/g, '').replace(/ filter="url\\([^)]*\\)"/g, '');
                      const c = document.getElementById('c'); c.style.width = w + 'px'; c.style.height = h + 'px'; c.innerHTML = svg; }""", [nome, k, w, h])
                    pg.wait_for_timeout(150)
                    pg.locator('#c').screenshot(path=str(SAIDA / f'{nome.lower()}-{k}.png'), omit_background=True)
                    print('feito', nome, k)
            b.close()
    finally:
        tmp.unlink(missing_ok=True)

if __name__ == '__main__':
    main()
