'use strict';
// ======================================================================
// Fora da Caixa — mais modos de jogo (carregado depois do script principal do index.html; usa as funções dele):
//   ⚡ Rajada (60 s, uma pergunta, o máximo de respostas)   🕵️ Quem é? (carreira às pistas)
//   📈 Mais ou menos (série de comparações)                  ⚔️ Duelo (desafiar um amigo da liga, pelo Firebase)
// Dados: carreiras.json e maisoumenos.json (scripts/modos.py); as perguntas são as do jogo.
// ======================================================================
const MX_CSS = `
.mx-h{font-family:var(--display);font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:var(--mute);margin:18px 2px 8px}
.mx-tiles{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mx-tile{position:relative;text-align:left;padding:14px;border-radius:var(--r);background:var(--panel);border:1px solid var(--line);display:flex;flex-direction:column;gap:3px;min-height:104px;transition:transform .15s}
.mx-tile:active{transform:scale(.98)}
.mx-tile .ic{font-size:24px;line-height:1.1}
.mx-tile b{font-family:var(--display);font-size:17px;font-weight:400}
.mx-tile small{color:var(--mute);font-size:12.5px;line-height:1.3}
.mx-badge{position:absolute;top:10px;right:10px;background:var(--red);color:#fff;font-size:12px;font-weight:800;border-radius:99px;padding:2px 8px}
.mx-duban{display:flex;align-items:center;gap:12px;width:100%;padding:14px 16px;border-radius:var(--r);background:var(--red);color:#fffaf0;margin:0 0 12px;text-align:left;font-weight:700;font-size:15px;box-shadow:var(--shadow);animation:mxpop .4s}
.mx-duban .ic{font-size:26px}
.mx-duban .go{margin-left:auto;font-size:22px}
.mx-bar{height:10px;border-radius:99px;background:var(--panel2);border:1px solid var(--line);overflow:hidden;margin:0 0 12px}
.mx-bar i{display:block;height:100%;width:100%;background:var(--acc);transition:width .25s linear}
.mx-bar.low i{background:var(--red)}
.mx-msg{font-size:14px;font-weight:600;color:var(--bad);min-height:20px;margin:2px 2px 6px}
.mx-msg.ok{color:var(--acc)}
.mx-found{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.mx-found .chip{animation:mxpop .3s}
.mx-cnt{display:flex;justify-content:space-between;font-size:13px;color:var(--mute);margin:10px 2px 4px}
.mx-pop{position:fixed;left:50%;top:30%;transform:translate(-50%,-50%);font-family:var(--display);font-size:30px;pointer-events:none;z-index:50;text-shadow:2px 2px 0 var(--dark);animation:mxfly .9s forwards}
@keyframes mxfly{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}20%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}100%{opacity:0;transform:translate(-50%,-110%) scale(1)}}
@keyframes mxpop{from{transform:scale(.7);opacity:0}to{transform:none;opacity:1}}
@keyframes mxshake{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.mx-shake{animation:mxshake .3s}
.mx-path{list-style:none;padding:0;margin:10px 0;display:grid;gap:6px}
.mx-path li{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:var(--bg2);border:1px solid var(--line);font-weight:700}
.mx-path li i{font-style:normal;font-size:12px;color:var(--mute);font-weight:600;min-width:34px}
.mx-path li small{color:var(--warn);font-weight:700;font-size:12px;margin-left:auto}
.mx-path li.hid{color:var(--mute);border-style:dashed;background:transparent;font-weight:500}
.mx-path li.new{animation:mxpop .35s}
.mx-path li.extra{background:#efe4cb}
.mx-stake{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--mute);margin:4px 2px 10px}
.mx-stake i{width:12px;height:12px;border-radius:50%;flex:none}
.mx-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mx-row .btn{margin-top:0;font-size:16px;padding:13px 8px}
.mx-end{text-align:center;padding:10px 0 4px}
.mx-big{font-family:var(--display);font-size:60px;line-height:1;margin:6px 0}
.mx-end .lbl{color:var(--mute);font-size:14px}
.mx-rec{display:inline-block;background:var(--t3);color:var(--dark);font-weight:800;border-radius:99px;padding:3px 12px;margin-top:6px;font-size:14px}
.chip.no{opacity:.45}
.mm-card{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:16px;text-align:center;position:relative}
.mm-card.b{border:2px solid var(--dark);box-shadow:var(--shadow)}
.mm-n{font-family:var(--display);font-size:22px;line-height:1.15}
.mm-l{color:var(--mute);font-size:13px;margin-top:4px}
.mm-t{display:inline-block;margin-top:6px;padding:4px 12px;border-radius:99px;background:var(--panel2);border:1px solid var(--line);font-weight:700;font-size:14px}
.mm-v{font-family:var(--display);font-size:36px;color:var(--acc);margin-top:4px;min-height:44px}
.mm-v.q{color:var(--mute)}
.mm-v.bad{color:var(--red)}
.mm-d{color:var(--mute);font-size:13px;min-height:18px}
.mm-vs{text-align:center;font-family:var(--display);margin:8px 0;color:var(--mute);font-size:15px}
.mm-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.mm-btns button{padding:16px 8px;border-radius:14px;font-family:var(--display);font-size:20px;color:#fffaf0}
.mm-btns .up{background:var(--acc)} .mm-btns .down{background:var(--red)}
.mm-temas{display:grid;gap:8px}
.mm-score{display:flex;justify-content:space-between;align-items:center;margin:0 2px 10px;font-size:14px;color:var(--mute)}
.mm-score b{font-family:var(--display);font-size:24px;color:var(--ink)}
.du-sec{font-family:var(--display);font-size:16px;margin:16px 2px 8px}
.du-card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:10px}
.du-card.hot{border:2px solid var(--red)}
.du-card .tx{flex:1;min-width:0}
.du-card .tx small{display:block;color:var(--mute);font-size:12.5px}
.du-card .res{font-family:var(--display);font-size:18px;white-space:nowrap}
.du-btn{background:var(--acc);color:var(--acc-ink);padding:9px 14px;border-radius:99px;font-weight:700;font-size:14px;flex:none}
.du-ops{display:flex;flex-wrap:wrap;gap:8px}
.du-op{padding:11px 18px;border-radius:99px;border:2px solid var(--acc);font-weight:700;background:var(--panel);font-size:15px}
.du-op:active{background:var(--acc);color:var(--acc-ink)}
.du-cat{font-size:14px;color:var(--mute);margin:10px 2px 0}
.du-rec{display:flex;flex-wrap:wrap;gap:8px}
.du-rec span{background:var(--panel);border:1px solid var(--line);border-radius:99px;padding:6px 12px;font-size:14px}
.du-vs{font-family:var(--display);font-size:22px;margin:4px 0}
.cv-r{display:flex;align-items:center;gap:8px;width:100%;padding:6px 0;border-top:1px dashed var(--line);font-size:14px}
.cv-r span{flex:1}.cv-r small{color:var(--mute)}.cv-r b{font-family:var(--display);font-weight:400;font-size:16px}
.cv-g{flex:none!important;width:18px;text-align:center}
.du-link{border-style:dashed;color:var(--acc)}
.tc-mini,.mu-mini{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:12px 14px;margin:0 0 12px}
.tc-mini{display:flex;align-items:center;gap:12px;cursor:pointer;border:2px solid var(--t3)}
.tc-mini .ic{font-size:26px}.tc-mini .tx{flex:1;min-width:0}.tc-mini .tx b{font-family:var(--display);font-weight:400;font-size:17px;display:block}
.tc-mini small{color:var(--mute);font-size:13.5px}.tc-mini .go{font-size:22px;opacity:.6}
.mu-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.mu-top b{font-family:var(--display);font-weight:400;font-size:17px}
.mu-it{display:flex;align-items:flex-start;gap:9px;padding:8px 0;border-top:1px dashed var(--line);font-size:14px;line-height:1.35}
.mu-it:first-of-type{border-top:0}
.mu-it .emb{margin:1px 0 0}.mu-ic{width:22px;text-align:center;flex:none}
.mu-tx{flex:1;min-width:0}.mu-it small{flex:none;color:var(--mute);font-size:12px;white-space:nowrap;margin-top:2px}
.mu-falta{background:#fff3d6;border:1px solid #ecd28a;border-radius:12px;padding:9px 12px;font-size:14px;margin:0 0 8px}
.mu-falta.ok{background:#e7f2e6;border-color:#b7d6b2}.mu-falta .emb{margin:0 3px 0 4px}
.tc-head{display:flex;justify-content:space-between;align-items:baseline;margin:4px 2px 10px}.tc-head b{font-family:var(--display);font-weight:400;font-size:22px}.tc-head span{color:var(--mute);font-size:14px}
.tc-camp{display:flex;align-items:center;gap:12px;background:var(--t3);border:2px solid var(--dark);box-shadow:var(--shadow);border-radius:16px;padding:12px 16px;margin-bottom:12px}
.tc-camp small{display:block;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:.06em}.tc-camp b{font-family:var(--display);font-weight:400;font-size:22px}
.tc-ronda{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:10px 12px;margin:12px 0}
.tc-ronda.hoje{border:2px solid var(--acc)}
.tc-rt{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}.tc-rt b{font-family:var(--display);font-weight:400;font-size:17px}.tc-rt span{color:var(--mute);font-size:13px}
.tc-jogo{border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:6px 0}
.tc-p{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--bg2);font-weight:600}
.tc-p+.tc-p{border-top:1px solid var(--line)}
.tc-p span{flex:1}.tc-p em{font-style:normal;font-family:var(--display);font-size:17px}
.tc-p.venc{background:#e3f0e1}.tc-p.venc span::after{content:' ✓';color:var(--acc)}.tc-p.perd{opacity:.55}
.tc-p.eu span{text-decoration:underline;text-underline-offset:3px}
.tc-p.tbd{color:var(--mute);font-weight:500}.emb-v{width:24px;text-align:center}
.tc-bye{font-size:13.5px;color:var(--mute);margin:6px 2px 2px}.tc-bye .emb{margin:0 2px 0 4px}
.st-btn.du-img{background:var(--t3);border-color:var(--dark);color:var(--dark)}
.du-card .emb{margin:0}
.du-op{display:inline-flex;align-items:center;gap:2px}
.du-click{cursor:pointer}
.du-click u{color:var(--acc);font-weight:700}
.du-ver{flex:none;font-size:13px;font-weight:700;color:var(--acc);padding:6px 4px}
.du-head{display:flex;align-items:center;justify-content:center;gap:14px;margin:8px 0 2px}
.du-p{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:90px}
.du-p .emb{margin:0 0 2px}
.du-p b{font-family:var(--display);font-weight:400;font-size:20px}
.du-p span{font-size:14px;color:var(--mute);font-weight:700}
.du-x{font-size:28px}
.du-q .sc-h span{display:block}
.eu-emb{width:64px;height:80px;flex:none}
.eu-emb img{width:100%;height:100%;display:block}
.eu-ev{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:6px}
.eu-v{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px;border-radius:14px;background:var(--panel);border:2px solid var(--line);font-weight:700;font-size:14px}
.eu-v img{width:84px;height:105px}
.eu-v.on{border-color:var(--acc);background:color-mix(in oklab,var(--acc) 10%,var(--panel));box-shadow:2px 2px 0 var(--acc)}
.du-win{color:var(--acc)} .du-lose{color:var(--red)}
`;
(() => { const st = document.createElement('style'); st.textContent = MX_CSS; document.head.appendChild(st); })();

// ---------- ecrãs ----------
const MX_HTML = `
<div id="s-raj" class="screen">
  <div class="top"><button class="iconbtn" id="rjQuit" aria-label="Sair">✕</button><div class="lbl" style="font-weight:700">⚡ Rajada</div>
    <div class="score"><b id="rjScore">0</b><span>pontos</span></div><div class="score" style="margin-left:14px"><b id="rjT">60</b><span>segundos</span></div></div>
  <div class="mx-bar" id="rjBar"><i></i></div>
  <div id="rjBody"></div>
</div>
<div id="s-quem" class="screen">
  <div class="top"><button class="iconbtn" id="qeQuit" aria-label="Sair">✕</button><div class="prog" id="qeProg"></div>
    <div class="score"><b id="qeScore">0</b><span>pontos</span></div></div>
  <div id="qeBody"></div>
</div>
<div id="s-mm" class="screen">
  <div class="lg-head"><button class="iconbtn" id="mmBack" aria-label="Voltar">‹</button><h2>📈 Mais ou menos</h2></div>
  <div id="mmBody"></div>
</div>
<div id="s-duelo" class="screen">
  <div class="lg-head"><button class="iconbtn" id="duBack" aria-label="Voltar">‹</button><h2>⚔️ Duelos</h2><button class="iconbtn" id="duRefresh" aria-label="Atualizar">↻</button></div>
  <div id="duBody"></div>
</div>`;
(() => {
  const home = $('#s-home'); home.insertAdjacentHTML('afterend', MX_HTML);
  $('#s-home .hero').insertAdjacentHTML('beforebegin', `<button class="mx-duban" id="duBan" hidden><span class="ic">⚔️</span><span id="duBanTx"></span><span class="go">›</span></button>`);
})();
// ======================================================================
// ESCOLHER O MODO — ecrã com cartões que se passam com o dedo (scroll-snap), barra de ícones e pontinhos
// ======================================================================
const MODOS = [['7', '⚽', 'Rápido', 'Jogo rápido', '#1e5a37'], ['fim', '♾️', 'Sem fim', 'Sem fim', '#6b3fa0'], ['dia', '📅', 'Do dia', 'Desafio do dia', '#e07a34'],
  ['raj', '⚡', 'Rajada', 'Rajada', '#d6452f'], ['quem', '🕵️', 'Quem é?', 'Quem é?', '#2b6fae'], ['mm', '📈', '+ ou −', 'Mais ou menos', '#a8750c'], ['duelo', '⚔️', 'Duelo', 'Duelo', '#1d2b22']];
const duBadgeHTML = '<span class="mx-badge du-b" hidden></span>';
$('#mNav').innerHTML = MODOS.map(([m, ic, , nome, cor], i) => `<button role="tab" data-i="${i}" style="--mcn:${cor}">${ic} ${nome}${m === 'duelo' ? duBadgeHTML : ''}</button>`).join('');
$('#mDots').innerHTML = MODOS.map(() => '<i></i>').join('');
$('#pcStrip').innerHTML = MODOS.map(([m, ic, curto], i) => `<button data-i="${i}" aria-label="${curto}">${ic}<small>${curto}</small>${m === 'duelo' ? duBadgeHTML : ''}</button>`).join('');
const mCards = () => [...document.querySelectorAll('#mCar .mcard')];
let mAtual = 0;
function mMarca(i) {
  mAtual = i; mCards().forEach((c, k) => c.classList.toggle('on', k === i));
  document.querySelectorAll('#mNav button').forEach((b, k) => b.classList.toggle('on', k === i));
  document.querySelectorAll('#mDots i').forEach((d, k) => d.classList.toggle('on', k === i));
  const nb = document.querySelector(`#mNav button[data-i="${i}"]`); if (nb) nb.scrollIntoView({block:'nearest', inline:'center', behavior:'smooth'});
}
function mVai(i, suave = true) {
  i = Math.max(0, Math.min(MODOS.length - 1, i)); const car = $('#mCar'), c = mCards()[i];
  car.scrollTo({left: c.offsetLeft - (car.clientWidth - c.clientWidth) / 2, behavior: suave ? 'smooth' : 'auto'}); mMarca(i);
}
$('#mCar').addEventListener('scroll', () => {
  const car = $('#mCar'), meio = car.scrollLeft + car.clientWidth / 2; let best = 0, d = 1e9;
  mCards().forEach((c, k) => { const dd = Math.abs(c.offsetLeft + c.clientWidth / 2 - meio); if (dd < d) { d = dd; best = k; } });
  if (best !== mAtual) mMarca(best);
}, {passive:true});
function mRecordes() {
  const best = ST.bestMm || {}, mm = Math.max(0, ...Object.values(best)), hoje = ST.dia?.[today()];
  const dl = typeof duLista === 'function' && ME ? duLista().filter(d => duAcabou(d.res?.[d.de]) && duAcabou(d.res?.[d.para])) : [];
  const v = dl.filter(d => duRes(d, ME) > duRes(d, duOutro(d))).length, dr = dl.filter(d => duRes(d, ME) < duRes(d, duOutro(d))).length;
  const txt = {best: ST.best ? `🏆 Recorde: ${ST.best}` : '', bestFim: ST.bestFim ? `🏆 Recorde: ${ST.bestFim}` : '', dia: hoje != null ? `Hoje: ${hoje} pontos` : '',
    bestRaj: ST.bestRaj ? `🏆 Recorde: ${ST.bestRaj}` : '', bestQuem: ST.bestQuem ? `🏆 Recorde: ${ST.bestQuem}` : '', bestMm: mm ? `🏆 Melhor série: ${mm}` : '',
    duelo: dl.length ? `${v} vitória${v === 1 ? '' : 's'} · ${dr} derrota${dr === 1 ? '' : 's'}` : ''};
  document.querySelectorAll('#mCar [data-rec]').forEach(e => e.textContent = txt[e.dataset.rec] || '');
}
function openModos(i) {
  mRecordes(); show('s-modos');
  const k = i ?? (ST.modoIdx ?? 0);
  requestAnimationFrame(() => mVai(k, false));
}
$('#playBtn').onclick = () => openModos();
$('#pcStrip').onclick = e => { const b = e.target.closest('button[data-i]'); if (b) openModos(Number(b.dataset.i)); };
$('#mNav').onclick = e => { const b = e.target.closest('button[data-i]'); if (b) mVai(Number(b.dataset.i)); };
$('#mPrev').onclick = () => mVai(mAtual - 1); $('#mNext').onclick = () => mVai(mAtual + 1);
$('#mdBack').onclick = () => { renderHome(); show('s-home'); };
document.addEventListener('keydown', e => { if (!$('#s-modos').classList.contains('on') || document.querySelector('dialog[open]')) return; if (e.key === 'ArrowRight') mVai(mAtual + 1); else if (e.key === 'ArrowLeft') mVai(mAtual - 1); });
// lembrar o último modo escolhido (abre nele da próxima vez)
$('#mCar').addEventListener('click', e => { const b = e.target.closest('.mc-go'); if (b) { ST.modoIdx = mCards().indexOf(b.closest('.mcard')); saveStats(ST); } }, true);

const mxST = k => (ST[k] = ST[k] ?? (k === 'bestMm' ? {} : k.endsWith('Rec') ? [] : 0));
function mxPop(txt, cor) { const d = document.createElement('div'); d.className = 'mx-pop'; d.textContent = txt; d.style.color = cor; document.body.appendChild(d); setTimeout(() => d.remove(), 950); }
function mxShake(el) { el.classList.remove('mx-shake'); void el.offsetWidth; el.classList.add('mx-shake'); try { navigator.vibrate && navigator.vibrate([20, 30, 20]); } catch (e) {} }
const mxSair = () => { renderHome(); show('s-home'); };
const fmtN = v => String(v).replace('.', ',');
function mxRegistar(rec) {
  if (!LIGA.db || !ME) return;
  const body = JSON.stringify({...rec, dia:lisDate(), fim:Date.now()});
  const go = (k = 0) => fetch(ligaUrl(`todos/${ME}`), {method:'POST', headers:{'Content-Type':'application/json'}, body}).then(r => { if (!r.ok) throw new Error(r.status); }).catch(() => { if (k < 3) setTimeout(() => go(k + 1), 2000 * (k + 1)); });
  go();
}
async function mxJSON(f) { try { const r = await fetch(`${f}?v=${APP_VER}`); return r.ok ? await r.json() : null; } catch (e) { return null; } }

// ---------- caixa de resposta com sugestões (igual à do jogo; no iPhone escolhe-se no fim do toque) ----------
function mSearch(txt, tipo, excl) {
  const q = norm(txt); if (q.length < 2) return [];
  const res = [];
  for (const p of (POOL[tipo] || [])) {
    let s = -1;
    if (p.nWeb.startsWith(q)) s = 0; else if (p.nAll.split(' ').some(w => w.startsWith(q))) s = 1; else if (p.nAll.includes(q)) s = 2;
    if (s >= 0 && !(excl && excl.has(p))) res.push([s, p]);
  }
  res.sort((a, b) => a[0] - b[0] || b[1].fama - a[1].fama || a[1].nome.localeCompare(b[1].nome, 'pt'));
  return res.slice(0, 6).map(x => x[1]);
}
const MX_PH = {jogador:'Escreve o nome de um jogador…', plh:'Escreve o nome de um jogador…', clube:'Escreve o nome de um clube…', pais:'Escreve o nome de uma seleção…', treinador:'Escreve o nome de um treinador…', estadio:'Escreve o nome de um estádio…'};
function caixaResposta(box, opts) {
  box.innerHTML = `<div class="answer"><input type="text" inputmode="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${MX_PH[opts.tipo()] || 'Escreve…'}" aria-label="Resposta"><ul class="sug" role="listbox"></ul></div>`;
  const inp = box.querySelector('input'), ul = box.querySelector('.sug'); let lista = [], sel = 0, toque = null;
  const render = () => {
    const typed = inp.value.trim().length >= 2;
    if (!lista.length) { ul.innerHTML = typed ? '<li class="empty">Nada com esse nome na lista</li>' : ''; ul.classList.toggle('on', typed); return; }
    ul.innerHTML = lista.map((p, i) => { const t = TIPO[p.tipo] || ['⚽', '']; return `<li role="option" data-i="${i}" class="${i === sel ? 'sel' : ''}"><span class="kit">${t[0]}</span><span class="nm">${esc(p.nome)}<small>${esc(p.completo || t[1])}</small></span></li>`; }).join('');
    ul.classList.add('on');
  };
  const limpa = () => { inp.value = ''; lista = []; sel = 0; ul.classList.remove('on'); ul.innerHTML = ''; };
  const escolhe = i => { const p = lista[i]; if (!p) return; limpa(); opts.onPick(p); try { inp.focus({preventScroll:true}); } catch (e) {} };
  inp.addEventListener('input', () => { lista = mSearch(inp.value, opts.tipo(), opts.excl && opts.excl()); sel = 0; render(); });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { sel = Math.min(lista.length - 1, sel + 1); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); render(); e.preventDefault(); }
    else if (e.key === 'Enter') { e.preventDefault(); if (lista[sel]) escolhe(sel); else if (inp.value.trim()) opts.onMiss && opts.onMiss(inp.value.trim()); }
  });
  ul.addEventListener('touchstart', e => { const t = e.touches[0]; toque = {x:t.clientX, y:t.clientY, mexeu:false}; }, {passive:true});
  ul.addEventListener('touchmove', e => { const t = e.touches[0]; if (toque && Math.hypot(t.clientX - toque.x, t.clientY - toque.y) > 10) toque.mexeu = true; }, {passive:true});
  ul.addEventListener('touchend', e => { const li = e.target.closest('li[data-i]'); if (!li) return; e.preventDefault(); if (toque && toque.mexeu) return; escolhe(Number(li.dataset.i)); }, {passive:false});
  ul.addEventListener('mousedown', e => { if (e.target.closest('li')) e.preventDefault(); });
  ul.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (!li) return; e.preventDefault(); escolhe(Number(li.dataset.i)); });
  return {inp, limpa, foco: () => setTimeout(() => { try { inp.focus({preventScroll:true}); } catch (e) {} }, 250)};
}

// ======================================================================
// ⚡ RAJADA — uma pergunta com muitas respostas; 60 s para dizer o máximo. Cada resposta vale a distância dela.
// ======================================================================
const RJ_TEMPO = 60, RJ_MIN = 15;
let RJ = null;
function rajPool() {
  const todas = [...BQ, ...LQ, ...OQ, ...MQ, ...HQ].filter(q => q.valid.length >= RJ_MIN && new Set(q.valid).size === q.valid.length);
  const cat = catNorm(ST.cat), parts = cat === 'tudo' ? null : cat.split(',');
  const sel = parts ? todas.filter(q => parts.includes(q.cat)) : todas;
  return sel.length >= 5 ? sel : todas;
}
function startRajada() {
  const pool = rajPool(); if (!pool.length) { toast('Ainda a carregar as perguntas…'); return; }
  const rec = new Set(mxST('rajRec')), livres = pool.filter(q => !rec.has(q.key));
  const q = pick(Math.random, livres.length ? livres : pool);
  RJ = {q, found:[], erros:[], score:0, tEnd:Date.now() + RJ_TEMPO * 1000, ended:false};
  ST.rajRec = [q.key, ...ST.rajRec].slice(0, 60); saveStats(ST);
  $('#rjScore').textContent = '0';
  const catLbl = q.cat === 'historia' ? 'Premier League' : CATS[q.cat] || '';
  $('#rjBody').innerHTML = `<div class="qcard enter"><div class="qnum">⚡ Rajada · ${esc(catLbl)}</div><div class="qtxt">${esc(q.txt)}</div><div class="qsub">${esc(q.sub || '')}</div>
      <div class="qinfo"><span>${q.valid.length} respostas certas</span>${q.valid.length >= BALIZA_MIN ? '<span class="q100">🟪 as mais raras são de baliza a baliza</span>' : ''}</div></div>
    <div id="rjBox"></div><div class="mx-msg" id="rjMsg"></div>
    <div class="mx-cnt"><span id="rjN">0 respostas</span><span>quanto mais rara, mais pontos</span></div><div class="mx-found" id="rjFound"></div>`;
  RJ.caixa = caixaResposta($('#rjBox'), {tipo: () => q.tipo, excl: () => new Set([...RJ.found.map(f => f.e), ...RJ.erros]), onPick: rajPick,
    onMiss: t => { $('#rjMsg').className = 'mx-msg'; $('#rjMsg').textContent = `✕ "${t}" não está na lista`; }});
  show('s-raj'); RJ.caixa.foco();
  clearInterval(RJ.t); RJ.t = setInterval(rajTick, 200); rajTick();
}
function rajTick() {
  if (!RJ || RJ.ended) return;
  const ms = Math.max(0, RJ.tEnd - Date.now());
  $('#rjT').textContent = Math.ceil(ms / 1000); $('#rjBar i').style.width = (ms / (RJ_TEMPO * 10)) + '%'; $('#rjBar').classList.toggle('low', ms < 10000);
  if (ms <= 0) rajFim();
}
function rajPick(e) {
  if (!RJ || RJ.ended) return;
  const msg = $('#rjMsg');
  if (RJ.found.some(f => f.e === e)) { msg.className = 'mx-msg'; msg.textContent = `Já disseste ${e.nome}`; return; }
  if (RJ.q.ok(e)) {
    const tier = tierOf(RJ.q, e), t = TIERS[tier];
    RJ.found.unshift({e, tier}); RJ.score += t.pts;
    countUp($('#rjScore'), RJ.score - t.pts, RJ.score);
    msg.className = 'mx-msg ok'; msg.textContent = `✓ ${e.nome} · ${t.m} m · +${t.pts}`;
    mxPop(tier === 6 ? 'BALIZA A BALIZA!' : tier >= 4 ? `GOLAÇO! +${t.pts}` : `+${t.pts}`, t.hex);
    try { navigator.vibrate && navigator.vibrate(25); } catch (er) {}
  } else {
    RJ.erros.push(e); msg.className = 'mx-msg'; const st = stOf(RJ.q, e);
    msg.textContent = `✕ ${e.nome} não conta${st ? ' (' + st + ')' : ''}`; mxShake($('#rjBox'));
  }
  $('#rjN').textContent = `${RJ.found.length} resposta${RJ.found.length === 1 ? '' : 's'}`;
  $('#rjFound').innerHTML = RJ.found.map(f => chip(f.e, RJ.q)).join('');
}
function rajFim() {
  if (!RJ || RJ.ended) return;
  RJ.ended = true; clearInterval(RJ.t); RJ.caixa.inp.blur();
  const best = mxST('bestRaj'), rec = RJ.score > best && RJ.score > 0;
  if (rec) ST.bestRaj = RJ.score; ST.jogos++; saveStats(ST);
  mxRegistar({modo:'raj', pontos:RJ.score, respostas:RJ.found.length, total:RJ.q.valid.length, erros:RJ.erros.length, raras:RJ.found.filter(f => f.tier >= 5).length, chave:RJ.q.key, cat:RJ.q.cat});
  const q = RJ.q, achou = new Set(RJ.found.map(f => f.e));
  $('#rjBar i').style.width = '0%'; $('#rjT').textContent = '0';
  $('#rjBody').innerHTML = `<div class="mx-end"><div class="lbl">⚡ Rajada · acabou o tempo</div><div class="mx-big">${RJ.score}</div>
      <div class="lbl">${RJ.found.length} de ${q.valid.length} respostas · ${RJ.erros.length} erro${RJ.erros.length === 1 ? '' : 's'}</div>
      ${rec ? '<span class="mx-rec">Novo recorde!</span>' : `<div class="lbl" style="margin-top:6px">Recorde: ${ST.bestRaj}</div>`}</div>
    <div class="qcard"><div class="qtxt" style="font-size:18px">${esc(q.txt)}</div><div class="qsub">${esc(q.sub || '')}</div></div>
    <div class="alts"><h4>Todas as respostas (da mais óbvia para a mais rara · as tuas a cores)</h4><div class="chips">${q.valid.map(e => achou.has(e) ? chip(e, q) : chip(e, q).replace('class="chip"', 'class="chip no"')).join('')}</div></div>
    <div class="mx-row" style="margin-top:14px"><button class="btn" id="rjAgain">Outra rajada</button><button class="btn ghost" id="rjHome">Início</button></div>`;
  $('#rjAgain').onclick = startRajada; $('#rjHome').onclick = mxSair;
  if (rec) confettiEnd();
}
$('#rjQuit').onclick = () => { if (RJ && !RJ.ended && RJ.found.length && confirm('Acabar já e ver o resultado?')) { rajFim(); return; } if (RJ) { clearInterval(RJ.t); RJ.ended = true; } mxSair(); };

// ======================================================================
// 🕵️ QUEM É? — os clubes de um jogador aparecem um a um (do primeiro para o último). Quanto menos pistas, mais longe o remate.
// ======================================================================
const QE_N = 7, QE_TOP = 650;
let QE = null, CARR = null;
async function loadCarreiras() {
  if (CARR) return CARR;
  const d = await mxJSON('carreiras.json'); if (!d) return null;
  CARR = d.jogadores.map(j => ({...j, fama: j.j + 4 * (j.f || 0)})).sort((a, b) => b.fama - a.fama).slice(0, QE_TOP);
  CARR.forEach(j => { j.ent = getEnt('jogador', j.n); j.ent.fama = Math.max(j.ent.fama || 0, j.fama / 1000); });
  buildPools(); return CARR;
}
// tier pelo número de clubes mostrados (k) de L: 1 clube = 50 m; até 1/3 = 35 m; até metade = 25 m; até 3/4 = 18 m; mais = 11 m; com a pista extra = 5 pontos
function qeTier(k, L) { if (k <= 1) return 5; const f = k / L; return f <= 1 / 3 ? 4 : f <= .5 ? 3 : f <= .75 ? 2 : 1; }
const qePts = c => c.extra ? 5 : TIERS[qeTier(c.k, c.p.c.length)].pts;
async function startQuem() {
  const b = $('#m-quem'); b.disabled = true;
  const c = await loadCarreiras(); b.disabled = false;
  if (!c) { toast('Não consegui carregar as carreiras: tenta outra vez'); return; }
  const rec = new Set(mxST('quemRec')), livres = c.filter(j => !rec.has(j.n)), base = livres.length >= QE_N ? livres : c;
  const lista = []; const r = Math.random; while (lista.length < QE_N) { const j = pick(r, base); if (!lista.includes(j)) lista.push(j); }
  ST.quemRec = [...lista.map(j => j.n), ...ST.quemRec].slice(0, 120); saveStats(ST);
  QE = {lista, i:0, score:0, res:[]};
  $('#qeScore').textContent = '0'; $('#qeProg').innerHTML = lista.map(() => '<i></i>').join('');
  show('s-quem'); qeNext();
}
function qeNext() {
  const p = QE.lista[QE.i];
  QE.cur = {p, k:1, extra:false, tries:[], done:false};
  [...$('#qeProg').children].forEach((e, i) => { e.className = i === QE.i ? 'cur' : ''; const r = QE.res[i]; e.style.background = r ? (r.pts ? TIERS[r.tier].hex : TIERS[0].hex) : ''; });
  $('#qeBody').innerHTML = `<div class="qcard enter"><div class="qnum">🕵️ Jogador ${QE.i + 1} de ${QE_N}</div><div class="qtxt">Quem é este jogador?</div>
      <div class="qsub">Clubes por onde passou (equipa principal), do primeiro para o último · ${p.c.length} clubes · Transfermarkt, até out. 2025</div></div>
    <ul class="mx-path" id="qePath"></ul><div class="mx-stake" id="qeStake"></div>
    <div id="qeBox"></div><div class="mx-msg" id="qeMsg"></div>
    <div class="mx-row"><button class="btn ghost" id="qeMais">Mais uma pista</button><button class="btn ghost" id="qeDes">Desisto</button></div>`;
  QE.caixa = caixaResposta($('#qeBox'), {tipo: () => 'jogador', excl: () => new Set(QE.cur.tries), onPick: qeGuess,
    onMiss: t => { $('#qeMsg').className = 'mx-msg'; $('#qeMsg').textContent = `✕ "${t}" não está na lista`; }});
  $('#qeMais').onclick = () => qePista(); $('#qeDes').onclick = () => qeAcaba(false);
  qeRender(); QE.caixa.foco();
}
function qeRender(novo) {
  const c = QE.cur, p = c.p, L = p.c.length;
  const falta = c.done ? 0 : L - c.k;
  $('#qePath').innerHTML = p.c.slice(0, c.done ? L : c.k).map(([cl, ano, emp], i) => `<li class="${i === novo ? 'new' : ''}"><i>${ano || ''}</i>${esc(cl)}${emp ? '<small>empréstimo</small>' : ''}</li>`).join('')
    + (falta ? `<li class="hid"><i>····</i>+ ${falta} clube${falta === 1 ? '' : 's'} por mostrar</li>` : '')
    + (c.extra || c.done ? `<li class="extra ${c.extra && novo === L ? 'new' : ''}"><i>pista</i>${esc(p.nac || '')}${p.pos ? ' · ' + esc(p.pos) : ''}</li>` : '');
  if (c.done) return;
  const tier = c.extra ? 1 : qeTier(c.k, L), t = TIERS[tier];
  $('#qeStake').innerHTML = `<i style="background:${t.hex}"></i>Se acertares agora: <b style="color:var(--ink)">${c.extra ? 'penálti · 5 pontos' : `${t.m} m · ${t.pts} pontos`}</b>`;
  $('#qeMais').textContent = c.k < L ? 'Mais uma pista' : c.extra ? 'Sem mais pistas' : 'Nacionalidade e posição';
  $('#qeMais').disabled = c.extra;
}
function qePista() { const c = QE.cur; if (c.done) return; const L = c.p.c.length; if (c.k < L) { c.k++; qeRender(c.k - 1); } else if (!c.extra) { c.extra = true; qeRender(L); } }
function qeGuess(e) {
  const c = QE.cur; if (c.done) return;
  if (norm(e.nome) === norm(c.p.n)) { qeAcaba(true); return; }
  c.tries.push(e); const m = $('#qeMsg'); m.className = 'mx-msg';
  const L = c.p.c.length, ultima = c.extra;
  m.textContent = `✕ Não é ${e.nome}` + (ultima ? '' : ' · aparece mais uma pista'); mxShake($('#qeBox'));
  if (ultima) { if (c.tries.length >= 3 + L) qeAcaba(false); return; }
  qePista();
}
function qeAcaba(certo) {
  const c = QE.cur; if (c.done) return; c.done = true;
  const tier = certo ? (c.extra ? 1 : qeTier(c.k, c.p.c.length)) : 0, pts = certo ? qePts(c) : 0, t = TIERS[tier];
  QE.score += pts; QE.res.push({n:c.p.n, tier, pts, k:c.k, extra:c.extra, tries:c.tries.length});
  countUp($('#qeScore'), QE.score - pts, QE.score); QE.caixa.inp.blur();
  if (certo) mxPop(tier >= 4 ? `GOLAÇO! +${pts}` : `GOLO! +${pts}`, t.hex); else mxPop('DEFENDIDO', '#f05a3c');
  qeRender();
  const last = QE.i >= QE_N - 1;
  $('#qeStake').innerHTML = ''; $('#qeMsg').textContent = '';
  $('#qeBox').innerHTML = `<div class="reveal on" style="margin:0"><div class="rhead">${certo ? `<div class="badge" style="background:${t.hex}">${c.extra ? '11' : t.m}<br>m</div>` : '<div class="badge miss">✕</div>'}
    <div><b>${esc(c.p.n)}</b><span>${certo ? `Acertaste com ${c.k} de ${c.p.c.length} clubes${c.extra ? ' e a pista extra' : ''}` : 'Não acertaste'}${c.tries.length ? ` · ${c.tries.length} erro${c.tries.length === 1 ? '' : 's'}` : ''}</span></div>
    <div class="pts" style="color:${certo ? t.hex : 'var(--mute)'}">${pts ? '+' + pts : '0'}</div></div></div>
    <button class="btn" id="qeNext">${last ? 'Ver resultado' : 'Próximo jogador ›'}</button>`;
  $('#qeMais').parentNode.remove();
  $('#qeNext').onclick = () => { if (last) qeFim(); else { QE.i++; qeNext(); } };
}
function qeFim() {
  const best = mxST('bestQuem'), rec = QE.score > best && QE.score > 0;
  if (rec) ST.bestQuem = QE.score; ST.jogos++; saveStats(ST);
  const certos = QE.res.filter(r => r.pts);
  mxRegistar({modo:'quem', pontos:QE.score, acertos:certos.length, jogadores:QE.res.length, pistas:certos.reduce((s, r) => s + r.k + (r.extra ? 1 : 0), 0), erros:QE.res.reduce((s, r) => s + r.tries, 0)});
  [...$('#qeProg').children].forEach((e, i) => { const r = QE.res[i]; e.className = ''; e.style.background = r && r.pts ? TIERS[r.tier].hex : TIERS[0].hex; });
  $('#qeBody').innerHTML = `<div class="mx-end"><div class="lbl">🕵️ Quem é?</div><div class="mx-big">${QE.score}</div>
      <div class="lbl">${QE.res.filter(r => r.pts).length} de ${QE_N} acertados</div>${rec ? '<span class="mx-rec">Novo recorde!</span>' : `<div class="lbl" style="margin-top:6px">Recorde: ${ST.bestQuem}</div>`}</div>
    <div class="recap">${QE.res.map(r => { const t = TIERS[r.tier]; return `<div class="rc"><div class="badge ${r.pts ? '' : 'miss'}" style="${r.pts ? 'background:' + t.hex : ''}">${r.pts ? (r.extra ? 11 : t.m) + ' m' : '✕'}</div><p><b>${esc(r.n)}</b><br>${r.pts ? `com ${r.k} clube${r.k === 1 ? '' : 's'}${r.extra ? ' + pista' : ''}` : 'não acertaste'}</p><span class="pts">${r.pts ? '+' + r.pts : ''}</span></div>`; }).join('')}</div>
    <div class="mx-row" style="margin-top:14px"><button class="btn" id="qeAgain">Jogar outra vez</button><button class="btn ghost" id="qeHome">Início</button></div>`;
  $('#qeAgain').onclick = startQuem; $('#qeHome').onclick = mxSair;
  if (rec) confettiEnd();
}
$('#qeQuit').onclick = () => { if (QE && QE.res.length && QE.res.length < QE_N && confirm('Acabar já e ver o resultado?')) { qeFim(); return; } mxSair(); };

// ======================================================================
// 📈 MAIS OU MENOS — o de baixo custou/marcou mais ou menos do que o de cima? Acertar continua a série; errar acaba.
// ======================================================================
let MMD = null, MM = null;
async function openMM() {
  if (!MMD) { MMD = await mxJSON('maisoumenos.json'); if (!MMD) { toast('Não consegui carregar os dados: tenta outra vez'); return; } }
  const best = mxST('bestMm');
  $('#mmBody').innerHTML = `<p class="cd-p">Aparecem dois jogadores: o de cima com o número, o de baixo sem. Diz se o de baixo tem <b>mais</b> ou <b>menos</b>. Cada acerto conta para a série; o primeiro erro acaba.</p>
    <div class="mm-temas"><button class="mode main" data-t="*"><span class="ic">🎲</span><span><b>Surpresa</b><small>Um tema à sorte</small></span><span class="go">›</span></button>
    ${MMD.temas.map(t => `<button class="mode" data-t="${t.id}"><span class="ic">${t.ic}</span><span><b>${esc(t.nome)}</b><small>${esc(t.sub)}${best[t.id] ? ` · recorde ${best[t.id]}` : ''}</small></span><span class="go">›</span></button>`).join('')}</div>`;
  $('#mmBody').querySelectorAll('button[data-t]').forEach(b => b.onclick = () => startMM(b.dataset.t));
  show('s-mm');
}
function startMM(id) {
  const t = id === '*' ? pick(Math.random, MMD.temas) : MMD.temas.find(x => x.id === id);
  const itens = (t.id === 'fee' ? t.itens.slice(0, 450) : t.itens).map(([n, v, d]) => ({n, v, d}));
  MM = {t, itens, a:null, b:null, serie:0, usados:new Set(), busy:false};
  MM.a = pick(Math.random, itens); MM.usados.add(MM.a); MM.b = mmOutro(MM.a);
  mmRender();
}
function mmOutro(a) {
  const r = Math.random, cand = MM.itens.filter(x => !MM.usados.has(x) && x.v !== a.v && x.v >= a.v / 2.5 && x.v <= a.v * 2.5);
  const lista = cand.length ? cand : MM.itens.filter(x => !MM.usados.has(x) && x.v !== a.v);
  const b = lista.length ? pick(r, lista) : pick(r, MM.itens); MM.usados.add(b); return b;
}
const mmVal = v => MM.t.unid === 'M€' ? `${fmtN(v)} M€` : `${v} golo${v === 1 ? '' : 's'}`;
function mmRender() {
  const t = MM.t, verbo = t.pergunta === 'custou' ? 'custou' : 'marcou', fee = t.id === 'fee';
  // nas transferências diz-se SEMPRE qual é (há jogadores com várias, de valores diferentes): a mais cara de cada um
  const qual = x => fee ? `<div class="mm-t">🔁 ${esc(x.d)}</div>` : '';
  $('#mmBody').innerHTML = `<div class="mm-score"><span>${t.ic} ${esc(t.nome)}</span><span>série <b id="mmS">${MM.serie}</b></span></div>
    <div class="mm-card"><div class="mm-n">${esc(MM.a.n)}</div>${qual(MM.a)}<div class="mm-l">${fee ? 'nesta transferência custou' : verbo}</div><div class="mm-v">${mmVal(MM.a.v)}</div>${fee ? '' : `<div class="mm-d">${esc(MM.a.d)}</div>`}</div>
    <div class="mm-vs">… e este ${verbo} mais ou menos?</div>
    <div class="mm-card b"><div class="mm-n">${esc(MM.b.n)}</div>${qual(MM.b)}<div class="mm-l">${fee ? 'nesta transferência custou' : verbo}</div><div class="mm-v q" id="mmBv">?</div>${fee ? '' : '<div class="mm-d" id="mmBd"></div>'}</div>
    <div class="mm-btns" id="mmBtns"><button class="up" data-d="mais">▲ Mais</button><button class="down" data-d="menos">▼ Menos</button></div>
    <p class="foot">${esc(t.sub)}${t.sub.includes('Transfermarkt') ? '' : ' · Transfermarkt'}</p>`;
  $('#mmBtns').querySelectorAll('button').forEach(b => b.onclick = () => mmResp(b.dataset.d));
}
async function mmResp(d) {
  if (MM.busy) return; MM.busy = true;
  const {a, b} = MM, certo = d === 'mais' ? b.v >= a.v : b.v <= a.v;
  $('#mmBtns').querySelectorAll('button').forEach(x => x.disabled = true);
  const el = $('#mmBv'); el.classList.remove('q');
  await tween(700, k => el.textContent = mmVal(MM.t.unid === 'M€' ? Math.round(b.v * k * 10) / 10 : Math.round(b.v * k)), easeOut);
  el.textContent = mmVal(b.v); const bd = $('#mmBd'); if (bd) bd.textContent = b.d;
  if (certo) {
    MM.serie++; $('#mmS').textContent = MM.serie; mxPop(MM.serie % 5 === 0 ? `${MM.serie} SEGUIDAS!` : '✓', 'var(--t2)');
    await sleep(900); MM.a = b; MM.b = mmOutro(b); MM.busy = false; mmRender();
  } else { el.classList.add('bad'); mxShake(el.parentNode); await sleep(900); MM.busy = false; mmFim(); }
}
function mmFim() {
  const best = mxST('bestMm'), id = MM.t.id, rec = MM.serie > (best[id] || 0);
  if (rec) best[id] = MM.serie; ST.jogos++; saveStats(ST);
  mxRegistar({modo:'mm', tema:id, serie:MM.serie});
  $('#mmBody').insertAdjacentHTML('afterbegin', `<div class="mx-end"><div class="lbl">Errado! Série final</div><div class="mx-big">${MM.serie}</div>${rec && MM.serie ? '<span class="mx-rec">Novo recorde!</span>' : `<div class="lbl">Recorde neste tema: ${best[id] || 0}</div>`}</div>
    <div class="mx-row" style="margin:10px 0 14px"><button class="btn" id="mmAgain">Outra vez</button><button class="btn ghost" id="mmTemas">Outro tema</button></div>`);
  $('#mmBtns').remove(); window.scrollTo(0, 0);
  $('#mmAgain').onclick = () => startMM(id); $('#mmTemas').onclick = openMM;
  if (rec && MM.serie >= 3) confettiEnd();
}
$('#mmBack').onclick = mxSair;

// ======================================================================
// ⚔️ DUELO — desafiar um amigo da liga. Quem desafia joga 7 perguntas (do tipo escolhido no início); ficam guardadas no Firebase
// (ligas/<id>/duelos/<id>) e o amigo joga exatamente as mesmas. Ganha quem fizer mais pontos. O jogo é um "Jogo rápido" normal.
// ======================================================================
let DU = {dados:null, erro:null};
async function duGet() {
  if (!LIGA.db) return null;
  try { const r = await fetch(ligaUrl('duelos'), {cache:'no-store'}); if (!r.ok) throw new Error(r.status); DU.dados = (await r.json()) || {}; DU.erro = null; }
  catch (e) { DU.erro = 'sem ligação'; }
  return DU.dados;
}
const duAcabou = r => !!r && (r.estado === 'acabado' || Date.now() - (r.inicio || 0) > 30 * 60e3);
const duOutro = d => d.de === ME ? d.para : d.de;
function duLista() { return Object.entries(DU.dados || {}).map(([id, d]) => ({...d, id})).filter(d => d && (d.de === ME || d.para === ME)).sort((a, b) => (b.criado || 0) - (a.criado || 0)); }
function duPendentes() { return duLista().filter(d => d.para === ME && !d.res?.[ME]); }
function duRenderHome() {
  const p = ME ? duPendentes() : [], ban = $('#duBan');
  document.querySelectorAll('.du-b').forEach(b => { b.hidden = !p.length; b.textContent = p.length; });
  if (!ME) { ban.hidden = true; return; }
  ban.hidden = !p.length;
  if (p.length) { $('#duBanTx').innerHTML = p.length === 1 ? `${emb(p[0].de, 26)}O <b>${esc(p[0].de)}</b> desafiou-te para um duelo!` : `Tens <b>${p.length} duelos</b> à tua espera!`; ban.onclick = () => p.length === 1 ? duJogar(p[0].id) : openDuelo(); }
}
async function duRefresh() { setTimeout(() => { try { inicioExtra(); } catch (e) {} }, 0); if ($('#s-eu').classList.contains('on')) renderEu(); if (!ME || !LIGA.db) return; await duGet(); duRenderHome(); if ($('#s-duelo').classList.contains('on')) duRender(); if ($('#s-eu').classList.contains('on')) renderEu(); }
function duRes(d, n) { const r = d.res?.[n]; return r ? r.pontos || 0 : null; }
function duRender() {
  const el = $('#duBody');
  if (!ME) { el.innerHTML = `<p class="cd-p">Primeiro escolhe quem és.</p><button class="btn" id="duWho">Escolher</button>`; $('#duWho').onclick = askWho; return; }
  if (!DU.dados) { el.innerHTML = `<p class="cd-p">${DU.erro ? 'Sem ligação: tenta daqui a pouco.' : 'A carregar…'}</p>`; return; }
  const todos = duLista(), ls = todos.filter(d => d.para !== '*'), links = todos.filter(d => d.para === '*' && d.de === ME);
  const pend = ls.filter(d => d.para === ME && !d.res?.[ME]), espera = ls.filter(d => d.res?.[ME] && !duAcabou(d.res?.[duOutro(d)]));
  const feitos = ls.filter(d => duAcabou(d.res?.[d.de]) && duAcabou(d.res?.[d.para]));
  const cat = catNorm(ST.cat);
  let h = '';
  if (pend.length) h += `<div class="du-sec">Desafiaram-te</div>` + pend.map(d => `<div class="du-card hot">${emb(d.de, 30)}<div class="tx"><b>${esc(d.de)}</b> desafiou-te<small>7 perguntas · ${esc(catNome(d.cat))}${duAcabou(d.res?.[d.de]) ? ` · fez ${duRes(d, d.de)} pontos` : ''}</small></div><button class="du-btn" data-jogar="${d.id}">Jogar</button></div>`).join('');
  h += `<div class="du-sec">Novo duelo</div><div class="du-ops">${LIGA.jogadores.filter(n => n !== ME).map(n => `<button class="du-op" data-op="${esc(n)}">${emb(n, 22)}${esc(n)}</button>`).join('')}<button class="du-op du-link" data-op="*">🔗 Alguém de fora</button></div>
    <p class="du-cat">Perguntas: <b>${esc(cat === 'tudo' ? 'todas' : catNome(cat))}</b> · <button class="linkbtn" id="duCat">mudar</button></p>`;
  if (espera.length) h += `<div class="du-sec">À espera</div>` + espera.map(d => `<div class="du-card">${emb(duOutro(d), 30)}<div class="tx">À espera do <b>${esc(duOutro(d))}</b><small>fizeste ${duRes(d, ME)} pontos · ${new Date(d.criado).toLocaleDateString('pt-PT', {day:'numeric', month:'short'})}</small></div><button class="du-ver" data-ver="${d.id}">As tuas respostas ›</button></div>`).join('');
  // registo contra cada amigo
  const reg = {};
  for (const d of feitos) { const o = duOutro(d), a = duRes(d, ME), b = duRes(d, o), r = reg[o] = reg[o] || [0, 0, 0]; r[a > b ? 0 : a < b ? 2 : 1]++; }
  if (Object.keys(reg).length) h += `<div class="du-sec">Contra cada amigo</div><div class="du-rec">${Object.entries(reg).map(([o, [v, e, d]]) => `<span>${emb(ME, 16)}${esc(ME)} <b>${v}</b> – <b>${d}</b> ${esc(o)}${emb(o, 16)}${e ? ` · ${e} empate${e === 1 ? '' : 's'}` : ''}</span>`).join('')}</div>`;
  if (feitos.length) h += `<div class="du-sec">Últimos duelos</div>` + feitos.slice(0, 15).map(d => { const o = duOutro(d), a = duRes(d, ME), b = duRes(d, o), cl = a > b ? 'du-win' : a < b ? 'du-lose' : '';
    return `<div class="du-card du-click" data-ver="${d.id}">${emb(o, 30)}<div class="tx"><b class="${cl}">${a > b ? 'Ganhaste' : a < b ? 'Perdeste' : 'Empate'}</b> contra ${esc(o)}<small>${new Date(d.criado).toLocaleDateString('pt-PT', {day:'numeric', month:'short'})} · ${esc(catNome(d.cat))} · <u>ver respostas</u></small></div><div class="res">${a} – ${b}</div></div>`; }).join('');
  if (links.length) h += `<div class="du-sec">Duelos com convidados</div>` + links.slice(0, 12).map(d => {
    const eu = duRes(d, ME), rs = Object.entries(d.res || {}).filter(([k, r]) => k !== ME && r && duAcabou(r)).sort((a, b) => (b[1].fim || 0) - (a[1].fim || 0));
    return `<div class="du-card" style="flex-wrap:wrap"><div class="tx" style="flex-basis:60%"><b>Duelo por link</b> · ${duAcabou(d.res?.[ME]) ? `fizeste ${eu}` : 'ainda a jogar'}<small>${new Date(d.criado).toLocaleDateString('pt-PT', {day:'numeric', month:'short'})} · ${esc(catNome(d.cat))}</small></div>
      <button class="du-ver" data-link="${d.id}">📤 Enviar link</button>
      ${rs.length ? rs.map(([k, r]) => `<div class="cv-r du-click" data-ver="${d.id}" data-com="${esc(k)}"><span class="cv-g">👤</span><span>${esc(r.nome || k)} <small>· ver respostas</small></span><b class="${r.pontos > eu ? 'du-lose' : r.pontos < eu ? 'du-win' : ''}">${r.pontos || 0} – ${eu}</b></div>`).join('')
        : '<div class="cv-r"><span style="color:var(--mute)">Ainda ninguém jogou. Envia o link a alguém de fora.</span></div>'}</div>`; }).join('');
  const meus = Object.values(CV || {}).filter(c => c && c.de === ME && c.res).sort((a, b) => (b.info?.criado || 0) - (a.info?.criado || 0));
  if (meus.length) h += `<div class="du-sec">Desafios por link</div><p class="cd-p" style="margin:-4px 2px 8px">Quem jogou os desafios que partilhaste (no fim de um jogo: "Desafiar amigo").</p>` + meus.slice(0, 10).map(c => {
    const eu = c.info?.pontos ?? 0, rs = Object.values(c.res).sort((a, b) => (b.fim || 0) - (a.fim || 0));
    return `<div class="du-card" style="flex-wrap:wrap"><div class="tx" style="flex-basis:100%"><b>${c.info?.cat === 'dia' ? 'Desafio do dia' : 'Jogo rápido'}</b> · fizeste ${eu}<small>${c.info?.criado ? new Date(c.info.criado).toLocaleDateString('pt-PT', {day:'numeric', month:'short'}) : ''}</small></div>
      ${rs.map(r => `<div class="cv-r">${r.perfil ? emb(r.nome, 18) : '<span class="cv-g">👤</span>'}<span>${esc(r.nome)}${r.perfil ? '' : ' <small>(convidado)</small>'}</span><b class="${r.pontos > eu ? 'du-lose' : r.pontos < eu ? 'du-win' : ''}">${r.pontos} – ${eu}</b></div>`).join('')}</div>`; }).join('');
  if (!todos.length) h += `<p class="cd-p" style="margin-top:14px">Ainda não há duelos. Escolhe um amigo (ele recebe o desafio no início da app) ou "Alguém de fora" (envias-lhe um link). Jogas as 7 perguntas e depois joga ele.</p>`;
  el.innerHTML = h;
  el.querySelectorAll('[data-jogar]').forEach(b => b.onclick = () => duJogar(b.dataset.jogar));
  el.querySelectorAll('[data-ver]').forEach(b => b.onclick = () => duVer(b.dataset.ver, ME, b.dataset.com || null));
  el.querySelectorAll('[data-link]').forEach(b => b.onclick = () => duPartilhar(b.dataset.link));
  el.querySelectorAll('[data-op]').forEach(b => b.onclick = () => escolherTipoDuelo(b.dataset.op));
  const bc = $('#duCat'); if (bc) bc.onclick = () => { openCats(); $('#catDlg').addEventListener('close', duRender, {once:true}); };
}
// as respostas dos dois, pergunta a pergunta (só se pode ver depois de ter jogado o duelo)
function duVer(id, eu = ME, outro = null) {
  const d = DU.dados?.[id], el = $('#duBody'); if (!d) return;
  if (!eu || !duAcabou(d.res?.[eu])) { toast('Primeiro joga o duelo'); return; }
  const qs = desserializar(Array.isArray(d.qs) ? d.qs : Object.values(d.qs || {}));
  if (!outro) outro = eu === d.de ? (d.para === '*' ? (Object.keys(d.res || {}).find(k => k !== eu) || '?') : d.para) : d.de;
  const quem = [eu, outro], acabou = n => duAcabou(d.res?.[n]);
  const nomeDe = k => k === eu ? 'Tu' : d.res?.[k]?.nome || k, embDe = (k, px) => emb(d.res?.[k]?.nome || k, px);
  const tiro = (n, i) => { const r = d.res?.[n]; if (!r || !acabou(n)) return null; const t = (r.tiros || [])[i]; return {tier: t ? t[1] : 0, erros: t ? t[2] || 0 : 0, resp: (r.resp || [])[i] || null, jogou: i < (r.perguntas || 0)}; };
  const pa = duRes(d, eu), pb = duRes(d, quem[1]);
  let h = `<button class="linkbtn" id="duVolta">‹ Duelos</button>
    <div class="du-head">${quem.map((n, k) => `<div class="du-p">${embDe(n, 46)}<b>${esc(nomeDe(n))}</b><span>${acabou(n) ? duRes(d, n) + ' pts' : 'ainda não jogou'}</span></div>${k === 0 ? `<div class="du-x">${acabou(quem[1]) ? (pa > pb ? '🏆' : pa < pb ? '😬' : '🤝') : '⚔️'}</div>` : ''}`).join('')}</div>
    <p class="cd-p" style="text-align:center">${esc(catNome(d.cat))} · ${new Date(d.criado).toLocaleDateString('pt-PT', {day:'numeric', month:'long'})}</p>
    ${acabou(quem[1]) ? '<button class="st-btn du-img" id="duImgBtn" style="margin:0 0 12px">📸 Enviar imagem do resultado</button>' : ''}`;
  (qs || []).forEach((q, i) => {
    const linhas = quem.map(n => { const t = tiro(n, i);
      if (!t) return `<div class="amg">${embDe(n, 18)}<b>${esc(nomeDe(n))}</b><span>ainda não jogou</span></div>`;
      const T = TIERS[t.tier] || TIERS[0];
      return `<div class="amg">${embDe(n, 18)}<b>${esc(nomeDe(n))}</b><span>${t.resp ? esc(t.resp) : t.jogou ? 'passou / sem tempo' : 'saiu antes'}${t.erros ? ` <small>· ${t.erros} erro${t.erros === 1 ? '' : 's'}</small>` : ''}</span><em style="background:${T.hex}${t.tier === 6 ? ';color:#fffaf0' : ''}">${t.tier ? T.m + ' m' : '✕'}</em></div>`; }).join('');
    const ta = tiro(eu, i), tb = tiro(quem[1], i), ganha = ta && tb ? (TIERS[ta.tier].pts > TIERS[tb.tier].pts ? eu : TIERS[ta.tier].pts < TIERS[tb.tier].pts ? quem[1] : null) : null;
    h += `<div class="sc du-q"><div class="sc-h"><span>Pergunta ${i + 1}${ganha ? ` · ${ganha === eu ? 'ganhaste esta' : esc(nomeDe(ganha)) + ' ganhou esta'}` : ''}</span><b style="font-size:16px">${esc(q.txt)}</b><span>${esc(q.sub || '')}</span></div>
      <div class="amigos" style="margin-top:4px">${linhas}</div>
      <details class="all"><summary>Ver as ${q.valid.length} respostas certas</summary><div class="chips">${q.valid.map(x => chip(x, q)).join('')}</div></details></div>`;
  });
  if (!qs) h += '<p class="lg-note">Não consegui abrir as perguntas deste duelo.</p>';
  el.innerHTML = h; window.scrollTo(0, 0);
  $('#duVolta').onclick = () => { if (ME) duRender(); else mxSair(); };
  const bi = $('#duImgBtn'); if (bi) bi.onclick = () => duImagem(id, eu, quem[1]);
}
async function openDuelo() { show('s-duelo'); duRender(); await Promise.all([duGet(), cvGet()]); duRender(); duRenderHome(); }
function duRecDe() { return {nome: S.duelo?.nome || ME, pontos:S.score, golos:S.shots.filter(s => s.tier).length, perguntas:S.shots.length, inicio:S.duelo.inicio, tiros:tirosDe(), resp:S.shots.map(s => s.p ? s.p.nome : null)}; }
async function duCriar(op) {
  if (!LIGA.db || !ME) return;
  const cat = catNorm(ST.cat), f = freshSeed(cat), qs = f[2];
  if (qs.length < NQ) { toast('Não há perguntas suficientes desse tipo'); return; }
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6), inicio = Date.now();
  const d = {de:ME, para:op, cat, criado:inicio, qs:qs.map(serializar), res:{[ME]:{pontos:0, estado:'a jogar', inicio}}};   // op '*' = duelo por link (alguém de fora)
  try { await ligaPut(`duelos/${id}`, d); } catch (e) { toast('Sem ligação: o duelo não foi criado'); return; }
  (DU.dados = DU.dados || {})[id] = d;
  startGame('7', f[0], cat, qs); S.duelo = {id, op, inicio, link: op === '*'};
  toast(op === '*' ? 'Joga as 7 perguntas e no fim envia o link' : `Duelo com o ${op}: boa sorte!`);
}
async function duJogar(id) {
  await duGet(); const d = DU.dados?.[id];
  if (!d) { toast('Esse duelo já não existe'); return; }
  if (d.res?.[ME]) { toast('Já jogaste este duelo'); openDuelo(); return; }
  const qs = desserializar(Array.isArray(d.qs) ? d.qs : Object.values(d.qs || {}));
  if (!qs || qs.length < 1) { toast('Não consegui abrir as perguntas deste duelo'); return; }
  const inicio = Date.now();
  try { await ligaPut(`duelos/${id}/res/${ME}`, {pontos:0, estado:'a jogar', inicio}); } catch (e) { toast('Sem ligação: tenta outra vez'); return; }
  startGame('7', hashStr(id), d.cat, qs); S.duelo = {id, op:d.de, inicio};
}
let duSyncT = null;
function dueloSync(final) {
  if (!S?.duelo) return Promise.resolve();
  const body = {...duRecDe(), estado: final ? 'acabado' : 'a jogar', fim: final ? Date.now() : null}, path = `duelos/${S.duelo.id}/res/${S.duelo.chave || ME}`;
  const go = (k = 0) => ligaPut(path, JSON.parse(JSON.stringify(body))).catch(() => { if (k < 4) return sleep(2000 * (k + 1)).then(() => go(k + 1)); toast('Sem ligação: o resultado pode não ter ficado guardado'); });
  clearTimeout(duSyncT);
  if (final) return go();
  duSyncT = setTimeout(go, 300); return Promise.resolve();
}
async function dueloFim() {
  const du = S.duelo, op = du.op;
  if (du.link) {   // quem criou um duelo por link: agora é enviar o link
    await dueloSync(true);
    $('#endLbl').textContent = '⚔️ Duelo por link'; $('#again').textContent = 'Ver duelos';
    $('#endSub').innerHTML = `${esc($('#endSub').textContent)}<br><b>Agora envia o link</b> a alguém de fora: joga as mesmas 7 perguntas e o resultado aparece nos teus Duelos.`;
    $('#share').textContent = '📤 Enviar o link do duelo'; $('#share').onclick = () => duPartilhar(du.id);
    const bv = $('#endDuVer'); bv.hidden = false; bv.textContent = '📝 Ver as tuas respostas'; bv.onclick = async () => { await openDuelo(); duVer(du.id); };
    duPartilhar(du.id);
    return;
  }
  $('#endLbl').textContent = `⚔️ Duelo com o ${op}`;
  $('#again').textContent = 'Ver duelos'; $('#share').textContent = 'Partilhar';
  await dueloSync(true);
  await duGet();
  const d = DU.dados?.[du.id], r = d?.res?.[op];
  const sub = $('#endSub');
  if (r && duAcabou(r)) {
    const a = S.score, b = r.pontos || 0;
    sub.innerHTML = `<div class="du-vs ${a > b ? 'du-win' : a < b ? 'du-lose' : ''}">${a > b ? '🏆 Ganhaste' : a < b ? 'Perdeste' : 'Empate'} ${a} – ${b}</div>${esc(sub.textContent)}`;
    if (a > b) confettiEnd();
  } else sub.innerHTML = `${esc(sub.textContent)}<br><b>Agora é a vez do ${esc(op)}</b>: ele vê o desafio no início da app.`;
  const bv = $('#endDuVer'); bv.hidden = false; bv.textContent = r && duAcabou(r) ? `📝 Ver as tuas respostas e as do ${op}` : '📝 Ver as tuas respostas';
  const bi = $('#endDuImg'); bi.hidden = !(r && duAcabou(r)); bi.onclick = () => duImagem(du.id, du.chave || ME, op);
  bv.onclick = async () => { if (du.chave) { show('s-duelo'); await duGet(); duVer(du.id, du.chave, op); } else { await openDuelo(); duVer(du.id); } };
  if (du.chave) { $('#again').textContent = 'Início'; $('#again').onclick = () => { $('#again').onclick = againOrig; mxSair(); }; }
}
const againOrig = $('#again').onclick;
// antes de cada duelo: escolher o tipo de perguntas (usa a janela dos tipos, com outro título e o botão "Começar duelo")
function escolherTipoDuelo(op) {
  const dlg = $('#catDlg'), h2 = dlg.querySelector('h2'), p = dlg.querySelector('.cd-p'), ok = $('#catOk');
  const antes = {h2: h2.innerHTML, p: p.innerHTML, ok: ok.textContent, fn: ok.onclick};
  openCats();
  h2.innerHTML = op === '*' ? '⚔️ Duelo com alguém de fora' : `⚔️ Duelo com o ${esc(op)}`;
  p.innerHTML = 'Que perguntas queres neste duelo? Escolhe um ou mais tipos (toca para marcar). O adversário joga exatamente as mesmas.';
  ok.textContent = 'Começar duelo ›';
  let comecar = false;
  ok.onclick = () => { const m = catMarcadas(); if (!m.length) { $('#catMsg').hidden = false; return; } ST.cat = catNorm(m.join(',')); saveStats(ST); comecar = true; dlg.close(); };
  dlg.addEventListener('close', () => { h2.innerHTML = antes.h2; p.innerHTML = antes.p; ok.textContent = antes.ok; ok.onclick = antes.fn; if (comecar) duCriar(op); }, {once:true});
}
// ---------- imagem do resultado de um duelo (para mandar por WhatsApp) ----------
function carregaImg(src) { return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }); }
async function duImagem(id, eu, outro) {
  const d = DU.dados?.[id]; if (!d) return;
  const quem = [eu, outro], nm = k => d.res?.[k]?.nome || k, pts = k => duRes(d, k) || 0, da = pts(eu), db = pts(outro);
  const qs = desserializar(Array.isArray(d.qs) ? d.qs : Object.values(d.qs || {})) || [];
  try { await Promise.all([document.fonts.load('400 60px "Alfa Slab One"'), document.fonts.load('600 28px Barlow'), document.fonts.load('400 28px Barlow')]); } catch (e) {}
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const DISP = '"Alfa Slab One", Georgia, serif', SANS = 'Barlow, system-ui, sans-serif';
  const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  const txt = (t, x, y, font, cor, al = 'center') => { g.font = font; g.fillStyle = cor; g.textAlign = al; g.textBaseline = 'alphabetic'; g.fillText(t, x, y); };
  const corta = (t, max) => { if (g.measureText(t).width <= max) return t; while (t.length > 3 && g.measureText(t + '…').width > max) t = t.slice(0, -1); return t + '…'; };
  g.fillStyle = '#f3ead6'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#1d2b22'; rr(48, 48, W - 88, H - 88, 44); g.fill();
  g.fillStyle = '#fffaf0'; rr(40, 40, W - 88, H - 88, 44); g.fill(); g.lineWidth = 5; g.strokeStyle = '#1d2b22'; g.stroke();
  txt('⚔️ DUELO', W / 2, 140, `400 70px ${DISP}`, '#1d2b22');
  txt('FORA DA CAIXA', W / 2, 186, `700 28px ${SANS}`, '#6c6a58');
  const xs = [280, 800];
  for (let k = 0; k < 2; k++) {
    const n = nm(quem[k]), x = xs[k], liga = typeof emblemaPNG === 'function' && LIGA.jogadores.includes(n);
    const img = liga ? await carregaImg(emblemaPNG(n, true)) : null;
    if (img) g.drawImage(img, x - 100, 220, 200, 250);
    else { g.fillStyle = '#1e5a37'; g.beginPath(); g.arc(x, 345, 100, 0, Math.PI * 2); g.fill(); g.lineWidth = 6; g.strokeStyle = '#1d2b22'; g.stroke(); txt(n.slice(0, 2).toUpperCase(), x, 375, `400 84px ${DISP}`, '#f3ead6'); }
    g.font = `400 54px ${DISP}`; txt(corta(n, 380), x, 545, `400 54px ${DISP}`, '#1d2b22');
    const mine = k === 0 ? da : db, other = k === 0 ? db : da;
    txt(String(mine), x, 660, `400 120px ${DISP}`, mine > other ? '#1e5a37' : mine < other ? '#b8321f' : '#1d2b22');
  }
  txt('VS', W / 2, 400, `400 64px ${DISP}`, '#c9bd9c');
  const venc = da > db ? nm(eu) : da < db ? nm(outro) : null;
  g.fillStyle = venc ? '#e8b33a' : '#ddd0b3'; rr(150, 700, W - 300, 92, 46); g.fill(); g.lineWidth = 4; g.strokeStyle = '#1d2b22'; g.stroke();
  g.font = `400 50px ${DISP}`; txt(corta(venc ? `🏆 ${venc} ganhou!` : '🤝 Empate!', W - 360), W / 2, 765, `400 50px ${DISP}`, '#1d2b22');
  // pergunta a pergunta
  const y0 = 850, passo = 52;
  txt(corta(nm(eu), 150), 770, y0 - 14, `700 24px ${SANS}`, '#6c6a58'); txt(corta(nm(outro), 150), 930, y0 - 14, `700 24px ${SANS}`, '#6c6a58');
  for (let i = 0; i < 7; i++) {
    const y = y0 + i * passo; g.fillStyle = i % 2 ? '#fffaf0' : '#f6eedc'; g.fillRect(90, y, W - 180, passo - 4); const yy = y - 4;
    txt(String(i + 1), 120, yy + 38, `400 28px ${DISP}`, '#6c6a58');
    g.font = `500 25px ${SANS}`; txt(corta(qs[i]?.txt || '', 520), 160, yy + 36, `500 25px ${SANS}`, '#1d2b22', 'left');
    quem.forEach((k, j) => { const t = (d.res?.[k]?.tiros || [])[i], tier = t ? t[1] : 0, T = TIERS[tier] || TIERS[0], x = j ? 930 : 770;
      g.fillStyle = T.hex; rr(x - 62, yy + 10, 124, 38, 19); g.fill(); txt(tier ? `${T.m} m` : '✕', x, yy + 38, `700 26px ${SANS}`, tier === 6 || tier === 5 ? '#fffaf0' : '#1d2b22'); });
  }
  txt(`${new Date(d.criado).toLocaleDateString('pt-PT', {day:'numeric', month:'long', year:'numeric'})} · ${catNome(d.cat)}`, W / 2, 1250, `500 26px ${SANS}`, '#6c6a58');
  txt('brunomvcarmo.github.io/foradacaixa', W / 2, 1284, `700 26px ${SANS}`, '#1e5a37');
  const blob = await new Promise(r => c.toBlob(r, 'image/png'));
  const file = new File([blob], `duelo-${nm(eu)}-${nm(outro)}.png`.replace(/\s+/g, '-'), {type: 'image/png'});
  const texto = `⚔️ Duelo no Fora da Caixa: ${nm(eu)} ${da} – ${db} ${nm(outro)}`;
  try { if (navigator.canShare && navigator.canShare({files: [file]})) { await navigator.share({files: [file], text: texto}); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
  toast('Imagem guardada');
}
// enviar o link de um duelo por link
async function duPartilhar(id) {
  const d = DU.dados?.[id], url = location.origin + location.pathname + `?duelo=${id}`;
  const txt = `⚔️ ${ME} desafiou-te para um duelo no Fora da Caixa: 7 perguntas de futebol${d && duAcabou(d.res?.[ME]) ? `, fez ${duRes(d, ME)} pontos` : ''}. Consegues ganhar?`;
  try { if (navigator.share) { await navigator.share({text: txt, url}); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(txt + '\n' + url); toast('Link copiado! Cola numa conversa'); } catch (e) { prompt('Copia isto:', txt + '\n' + url); }
}
// abrir a app pelo link de um duelo (?duelo=<id>): convidados (ou alguém da liga) jogam as mesmas 7 perguntas
async function duPeloLink(id) {
  await duGet(); const d = DU.dados?.[id];
  if (!d) { toast('Esse duelo já não existe'); return; }
  if (ME && ME === d.de) { await openDuelo(); return; }
  const jogar = async (nome, chave) => {
    const r = d.res?.[chave];
    if (r) { show('s-duelo'); if (duAcabou(r)) duVer(id, chave, d.de); else toast('Já começaste este duelo'); return; }
    const qs = desserializar(Array.isArray(d.qs) ? d.qs : Object.values(d.qs || {}));
    if (!qs || !qs.length) { toast('Não consegui abrir as perguntas deste duelo'); return; }
    const inicio = Date.now();
    try { await ligaPut(`duelos/${id}/res/${chave}`, {nome, convidado: !ME, pontos:0, estado:'a jogar', inicio}); } catch (e) { toast('Sem ligação: tenta outra vez'); return; }
    startGame('7', hashStr(id), d.cat, qs); S.duelo = {id, op:d.de, inicio, chave, nome};
  };
  if (ME) { jogar(ME, ME); return; }
  const dl = $('#conv');
  $('#convDe').innerHTML = `${emb(d.de, 40)}<span><b>${esc(d.de)} desafiou-te para um duelo!</b><span>7 perguntas${duAcabou(d.res?.[d.de]) ? ` · fez ${duRes(d, d.de)} pontos` : ''}. Consegues ganhar?</span></span>`;
  $('#convNome').value = CONVIDADO || '';
  $('#convOk').onclick = () => { const nome = $('#convNome').value.trim().slice(0, 16); if (!nome) { $('#convNome').focus(); return; } setConvidado(nome); dl.close(); jogar(nome, 'conv-' + chaveNome(nome)); };
  $('#convLiga').onclick = () => { dl.close(); askWho(); };
  dl.showModal();
}
function aoArrancar() { const id = new URLSearchParams(location.search).get('duelo'); if (id && /^[a-z0-9]{4,20}$/.test(id)) duPeloLink(id); }
// ======================================================================
// ESTATÍSTICAS dos outros modos (separadores no ecrã de estatísticas; os jogos vêm de ligas/<id>/todos/<nome>, os duelos de duelos/)
// ======================================================================
function mxPeriodo(dia) { const hoje = lisDate(); return {semana: weekStart(dia) === weekStart(hoje), mes: dia.slice(0, 7) === hoje.slice(0, 7), sempre: true}[STAB.per]; }
function mxJogos(modo) { const out = []; for (const n of LIGA.jogadores) for (const g of Object.values(ST_TODOS?.[n] || {})) if (g && g.modo === modo && g.dia && mxPeriodo(g.dia)) out.push({...g, nome:n}); return out; }
const mxMedia = (a, f) => a.length ? a.reduce((s, x) => s + f(x), 0) / a.length : null;
const mxMax = (a, f) => a.length ? Math.max(...a.map(f)) : null;
const mxPerTxt = () => STAB.per === 'semana' ? 'esta semana' : STAB.per === 'mes' ? 'este mês' : 'ainda';
function renderStatsModo() {
  const el = $('#stBody'), m = STAB.modo;
  if (!LIGA.db) { el.innerHTML = '<p class="lg-note">A liga ainda não está ligada à base de dados.</p>'; return; }
  if (m === 'duelo') return renderStatsDuelos();
  if (!ST_TODOS) { el.innerHTML = '<p class="lg-note">A carregar…</p>'; statsGet().then(() => { if (ST_TODOS) renderStats(); }); return; }
  const js = mxJogos(m);
  const nome = {raj:'Rajadas', quem:'jogos do Quem é?', mm:'jogos do Mais ou menos'}[m];
  if (!js.length) { el.innerHTML = `<p class="lg-note">Ninguém jogou ${nome} ${mxPerTxt()}.</p><p class="foot">Os resultados destes modos contam a partir de hoje.</p>`; return; }
  const por = n => js.filter(g => g.nome === n);
  let h = '';
  if (m === 'raj') {
    const rows = LIGA.jogadores.map(n => { const g = por(n); return {nome:n, jogos:g.length || null, melhor:mxMax(g, x => x.pontos || 0), media:mxMedia(g, x => x.pontos || 0),
      resp:mxMedia(g, x => x.respostas || 0), pctr:mxMedia(g, x => x.total ? x.respostas / x.total : 0), raras:g.length ? g.reduce((s, x) => s + (x.raras || 0), 0) : null, erros:mxMedia(g, x => x.erros || 0)}; });
    h += barCard('Melhor rajada', 'pontos num só jogo', rows, 'melhor', v => v ?? '—');
    h += barCard('Pontos por rajada', 'média', rows, 'media', fmt1);
    h += barCard('Respostas por rajada', 'média de respostas certas em 60 s', rows, 'resp', fmt1);
    h += barCard('Respostas encontradas', '% das respostas certas de cada pergunta', rows, 'pctr', pct);
    h += barCard('Golos de longe', 'respostas de 50 m ou de baliza a baliza', rows, 'raras', v => v ?? '—');
    h += barCard('Erros por rajada', 'menos é melhor', rows, 'erros', fmt1, true);
    h += barCard('Rajadas', '', rows, 'jogos', v => v ?? '—');
  } else if (m === 'quem') {
    const rows = LIGA.jogadores.map(n => { const g = por(n), ac = g.reduce((s, x) => s + (x.acertos || 0), 0), jog = g.reduce((s, x) => s + (x.jogadores || 0), 0);
      return {nome:n, jogos:g.length || null, melhor:mxMax(g, x => x.pontos || 0), media:mxMedia(g, x => x.pontos || 0), acerto: jog ? ac / jog : null, pistas: ac ? g.reduce((s, x) => s + (x.pistas || 0), 0) / ac : null}; });
    h += barCard('Melhor jogo', 'pontos em 7 jogadores', rows, 'melhor', v => v ?? '—');
    h += barCard('Pontos por jogo', 'média', rows, 'media', fmt1);
    h += barCard('Jogadores acertados', '% dos jogadores', rows, 'acerto', pct);
    h += barCard('Pistas por acerto', 'quantos clubes precisou de ver (menos é melhor)', rows, 'pistas', fmt1, true);
    h += barCard('Jogos', '', rows, 'jogos', v => v ?? '—');
  } else {
    const temas = (MMD?.temas || []).map(t => [t.id, t.nome]);
    const rows = LIGA.jogadores.map(n => { const g = por(n); return {nome:n, jogos:g.length || null, melhor:mxMax(g, x => x.serie || 0), media:mxMedia(g, x => x.serie || 0)}; });
    h += barCard('Melhor série', 'em qualquer tema', rows, 'melhor', v => v ?? '—');
    h += barCard('Série média', '', rows, 'media', fmt1);
    h += barCard('Jogos', '', rows, 'jogos', v => v ?? '—');
    const ids = [...new Set(js.map(g => g.tema))], nomeT = id => (temas.find(t => t[0] === id) || [id, {fee:'Transferências'}[id] || id.replace(/^g/, 'Golos ')])[1];
    h += `<div class="sc"><div class="sc-h"><b>Melhor série por tema</b></div><div class="ct-w"><table class="ct"><thead><tr><th></th>${LIGA.jogadores.map(n => `<th>${emb(n, 18)}<br>${esc(n)}</th>`).join('')}</tr></thead>
      <tbody>${ids.map(id => { const vals = LIGA.jogadores.map(n => mxMax(por(n).filter(g => g.tema === id), x => x.serie || 0)), mx = Math.max(...vals.filter(v => v != null));
        return `<tr><th>${esc(nomeT(id))}</th>${vals.map(v => v == null ? '<td class="ct-e">—</td>' : `<td${v === mx && v > 0 ? ' style="background:#1e5a37;color:#fffaf0"' : ''}>${v}</td>`).join('')}</tr>`; }).join('')}</tbody></table></div></div>`;
  }
  el.innerHTML = h + `<p class="foot">Resultados guardados a partir de hoje · ${js.length} jogo${js.length === 1 ? '' : 's'} ${mxPerTxt() === 'ainda' ? 'no total' : mxPerTxt()}.</p>`;
  if (m === 'mm' && !MMD) mxJSON('maisoumenos.json').then(d => { if (d) { MMD = d; if (STAB.modo === 'mm') renderStats(); } });
}
function renderStatsDuelos() {
  const el = $('#stBody');
  if (!DU.dados) { el.innerHTML = '<p class="lg-note">A carregar…</p>'; duGet().then(() => { if (DU.dados && STAB.modo === 'duelo') renderStats(); }); return; }
  const ds = Object.values(DU.dados).filter(d => d && d.res && duAcabou(d.res[d.de]) && duAcabou(d.res[d.para]) && mxPeriodo(lisDate(new Date(d.criado || 0))));
  if (!ds.length) { el.innerHTML = `<p class="lg-note">Ainda não há duelos acabados ${mxPerTxt() === 'ainda' ? '' : mxPerTxt()}.</p>`; return; }
  const J = LIGA.jogadores, r = {}; J.forEach(n => r[n] = {v:0, e:0, d:0, pts:0, n:0});
  const h2h = {}; J.forEach(a => { h2h[a] = {}; J.forEach(b => h2h[a][b] = [0, 0, 0]); });
  for (const d of ds) {
    const a = d.de, b = d.para, pa = duRes(d, a), pb = duRes(d, b); if (!r[a] || !r[b]) continue;
    r[a].n++; r[b].n++; r[a].pts += pa; r[b].pts += pb;
    if (pa > pb) { r[a].v++; r[b].d++; h2h[a][b][0]++; h2h[b][a][2]++; } else if (pa < pb) { r[b].v++; r[a].d++; h2h[b][a][0]++; h2h[a][b][2]++; } else { r[a].e++; r[b].e++; h2h[a][b][1]++; h2h[b][a][1]++; }
  }
  const rows = J.map(n => ({nome:n, vit:r[n].n ? r[n].v : null, pctv:r[n].n ? r[n].v / r[n].n : null, media:r[n].n ? r[n].pts / r[n].n : null, jogos:r[n].n || null}));
  let h = barCard('Vitórias', 'duelos ganhos', rows, 'vit', v => v ?? '—');
  h += barCard('% de vitórias', '', rows, 'pctv', pct);
  h += barCard('Pontos por duelo', 'média', rows, 'media', fmt1);
  h += barCard('Duelos', '', rows, 'jogos', v => v ?? '—');
  h += `<div class="sc"><div class="sc-h"><b>Frente a frente</b><span>vitórias – derrotas de quem está na linha contra quem está na coluna</span></div><div class="ct-w"><table class="ct"><thead><tr><th></th>${J.map(n => `<th>${emb(n, 18)}<br>${esc(n)}</th>`).join('')}</tr></thead>
    <tbody>${J.map(a => `<tr><th>${esc(a)}</th>${J.map(b => { if (a === b) return '<td class="ct-e">·</td>'; const [v, e, d] = h2h[a][b]; if (!v && !e && !d) return '<td class="ct-e">—</td>';
      return `<td style="${v > d ? 'background:#1e5a37;color:#fffaf0' : v < d ? 'background:#f3d6cf' : ''}">${v}–${d}${e ? `<small>${e} emp.</small>` : ''}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div></div>`;
  el.innerHTML = h;
}

// ======================================================================
// BARRA DE NAVEGAÇÃO EM BAIXO (Jogar · Liga · Duelos · Estatísticas · Eu) e ecrã "Eu"
// ======================================================================
const NAV_DE = {'s-home':'jogar', 's-modos':'jogar', 's-liga':'liga', 's-rever':'liga', 's-duelo':'duelo', 's-stats':'stats', 's-eu':'eu'};
function navUpdate(id) {
  const tab = NAV_DE[id], nav = $('#bnav');
  nav.hidden = !tab; document.body.classList.toggle('has-nav', !!tab);
  nav.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.go === tab));
}
function renderEu() {
  renderHome();
  $('#euNome').textContent = ME || 'Eu';
  const cat = catNorm(ST.cat);
  $('#euMe').innerHTML = `<span class="eu-emb">${ME ? `<img src="${emblemaPNG(ME, true)}" alt="">` : ''}</span><span style="flex:1;min-width:0"><b>${ME ? esc(ME) : 'Ainda não escolheste'}</b><small>${ME ? LIGA.nome : 'Escolhe quem és para jogar a liga e os duelos'}</small></span><button class="du-btn" id="euTroca">${ME ? 'Trocar' : 'Escolher'}</button>`;
  $('#euTroca').onclick = askWho;
  $('#euCod').hidden = !ME;
  const best = ST.bestMm || {}, mm = Math.max(0, ...Object.values(best));
  const dl = ME ? duLista().filter(d => duAcabou(d.res?.[d.de]) && duAcabou(d.res?.[d.para])) : [];
  const v = dl.filter(d => duRes(d, ME) > duRes(d, duOutro(d))).length, dr = dl.filter(d => duRes(d, ME) < duRes(d, duOutro(d))).length;
  const hoje = ST.dia?.[today()];
  const it = [['⚡ Rajada', ST.bestRaj || 0, 'recorde'], ['🕵️ Quem é?', ST.bestQuem || 0, 'recorde'], ['📈 Mais ou menos', mm, 'melhor série'],
    ['⚔️ Duelos', dl.length ? `${v}–${dr}` : '—', 'vitórias–derrotas'], ['📅 Desafio do dia', hoje ?? '—', 'hoje'], ['🗂️ Perguntas', cat === 'tudo' ? 'Todas' : cat.split(',').length + ' tipos', 'tipo escolhido']];
  $('#euRecs').innerHTML = it.map(([t, val, sub]) => `<div class="eu-rec"><span>${t}</span><b>${esc(String(val))}</b><span>${sub}</span></div>`).join('');
}
// mudar o código do perfil: o novo duas vezes; se forem iguais, guarda o hash em ligas/<id>/perfil/<nome>/codigo
function abrirMudarCodigo() {
  if (!ME) return;
  const d = $('#codDlg'), a = $('#codNovo'), b = $('#codRep'), m = $('#codMsg');
  a.value = ''; b.value = ''; m.hidden = true;
  const so4 = el => () => { el.value = el.value.replace(/\D/g, '').slice(0, 4); if (el === a && a.value.length === 4) b.focus(); };
  a.oninput = so4(a); b.oninput = so4(b);
  const erro = t => { m.textContent = t; m.hidden = false; mxShake(d); };
  $('#codCancela').onclick = () => d.close();
  $('#codGuarda').onclick = async () => {
    if (!/^\d{4}$/.test(a.value)) return erro('O código tem de ter 4 algarismos.');
    if (a.value !== b.value) { b.value = ''; b.focus(); return erro('Os dois códigos não são iguais. Repete o código novo.'); }
    const bt = $('#codGuarda'); bt.disabled = true;
    try { await ligaPut(`perfil/${ME}/codigo`, await hashCodigo(ME, a.value)); d.close(); toast('Código mudado! Usa o novo da próxima vez'); }
    catch (e) { erro('Sem ligação: o código não foi mudado. Tenta outra vez.'); }
    bt.disabled = false;
  };
  b.onkeydown = ev => { if (ev.key === 'Enter') $('#codGuarda').click(); };
  d.showModal(); setTimeout(() => a.focus(), 80);
}
function openEu() { renderEu(); show('s-eu'); duGet().then(() => { if ($('#s-eu').classList.contains('on')) renderEu(); }); }
$('#bnav').onclick = e => {
  const b = e.target.closest('button[data-go]'); if (!b) return;
  const go = b.dataset.go;
  if (go === 'jogar') { renderHome(); show('s-home'); }
  else if (go === 'liga') openLiga();
  else if (go === 'duelo') { if (!ME) { askWho(); return; } openDuelo(); }
  else if (go === 'stats') openStats();
  else openEu();
};
$('#euBack').onclick = mxSair;
$('#euMe').insertAdjacentHTML('afterend', '<button class="st-btn" id="euCod" hidden>🔒 Mudar o código do perfil</button>');
$('#euCod').onclick = abrirMudarCodigo;
navUpdate((document.querySelector('.screen.on') || {}).id);

$('#s-end .row2').insertAdjacentHTML('beforebegin', '<button class="st-btn" id="endDuVer" hidden></button><button class="st-btn du-img" id="endDuImg" hidden>📸 Enviar imagem do resultado</button>');
endGame = (orig => function () { $('#endDuVer').hidden = true; $('#endDuImg').hidden = true; $('#share').onclick = share; $('#again').onclick = againOrig; const r = orig.apply(this, arguments); if (S?.convite) conviteFim(); if (S?.taca) tacaFim(); return r; })(endGame);
// ---------- desafios por link (também para convidados): o resultado de quem joga fica em ligas/<id>/convites/<chave>/res ----------
const chaveNome = n => String(n).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20) || 'alguem';   // só letras sem acento, números e traços (chave do Firebase)
function conviteFim() {
  const cv = S.convite, quem = ME || CONVIDADO, sub = $('#endSub');
  if (cv.de && S.friendScore != null) {
    const a = S.score, b = S.friendScore;
    sub.innerHTML = `<div class="du-vs ${a > b ? 'du-win' : a < b ? 'du-lose' : ''}">${a > b ? '🏆 Ganhaste ao' : a < b ? 'Perdeste com o' : 'Empataste com o'} ${esc(cv.de)} · ${a} – ${b}</div>${esc(sub.textContent.replace(/ · o teu amigo fez \d+/, ''))}`;
    if (a > b) confettiEnd();
  }
  if (!cv.chave || !quem || !LIGA.db || quem === cv.de) return;
  const body = {nome: quem, perfil: !!ME, pontos: S.score, golos: S.shots.filter(x => x.tier).length, fim: Date.now()};
  fetch(ligaUrl(`convites/${cv.chave}/res/${chaveNome(quem)}`), {method:'PUT', body: JSON.stringify(body)}).catch(() => {});
}
let CV = null;
async function cvGet() { if (!LIGA.db) return; try { const r = await fetch(ligaUrl('convites'), {cache:'no-store'}); if (r.ok) CV = (await r.json()) || {}; } catch (e) {} }

// ======================================================================
// 🏆 TAÇA DOS AMIGOS — duas por semana: "Taça de segunda" (seg-qua) e "Taça de quinta" (qui-sáb). Sorteio igual para todos
// (semente taca:<liga>:<início>); uma eliminatória por dia; 7 perguntas iguais para todos nessa ronda (taca/<id>/sets/r<k>);
// resultados em taca/<id>/jogos/r<k>/<nome>; campeões em tacas_campeoes/<id>. Passa quem fizer mais pontos
// (desempate: golos, golos de longe, lugar no sorteio). Quem não jogar até à meia-noite fica com 0.
// ======================================================================
let TC = {id:null, jogos:null, campeoes:null, ant:null, antJogos:null};
const TACA_INICIO = '2026-11-26';   // a 1.ª taça (Taça de quinta, 26 nov 2026); as anteriores não existiram
const diaMais = (ds, n) => new Date(new Date(ds + 'T12:00:00Z').getTime() + n * 864e5).toISOString().slice(0, 10);
const dowDe = ds => new Date(ds + 'T12:00:00Z').getUTCDay();
function tacaDe(ds) { const w = dowDe(ds); if (w >= 1 && w <= 3) return diaMais(ds, 1 - w); if (w >= 4 && w <= 6) return diaMais(ds, 4 - w); return null; }
function tacaAnterior(ds) { const t = tacaDe(ds); if (!t) return diaMais(ds, -3); return diaMais(t, dowDe(t) === 1 ? -4 : -3); }   // domingo: a de quinta
const tacaNome = id => dowDe(id) === 1 ? 'Taça de segunda' : 'Taça de quinta';
const diaCurto = ds => new Date(ds + 'T12:00:00Z').toLocaleDateString('pt-PT', {weekday:'short', day:'numeric', timeZone:'UTC'});
function tacaSorteio(id) {
  const J = [...LIGA.jogadores], r = rng(hashStr(`taca:${LIGA.id}:${id}`));
  for (let i = J.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [J[i], J[j]] = [J[j], J[i]]; }
  let P = 1; while (P < J.length) P *= 2;
  const n1 = J.length - P / 2, byes = J.slice(0, J.length - 2 * n1), r1 = J.slice(J.length - 2 * n1);
  const pares = []; for (let i = 0; i < n1; i++) pares.push([r1[i], r1[r1.length - 1 - i]]);
  return {J, rondas: Math.log2(P), byes, pares};
}
function nomeRonda(k, R, nJogos) { if (k === R) return 'Final'; if (k === R - 1) return 'Meias-finais'; if (k === R - 2 && nJogos === 4) return 'Quartos de final'; return 'Pré-eliminatória'; }
// estado de uma taça a partir dos jogos guardados
function tacaEstado(id, jogos) {
  const sor = tacaSorteio(id), seed = n => sor.J.indexOf(n), hoje = lisDate(), rondas = [];
  let pares = sor.pares, entram = sor.byes;
  for (let k = 1; k <= sor.rondas; k++) {
    const dia = diaMais(id, k - 1), passou = hoje > dia, js = jogos?.['r' + k] || {};
    const fechado = rec => !!rec && (rec.estado === 'acabado' || Date.now() - (rec.inicio || 0) > 30 * 60e3);
    const lista = pares.map(([a, b]) => {
      const ra = a ? js[a] : null, rb = b ? js[b] : null;
      let venc = null;
      if (a && b && (passou || (fechado(ra) && fechado(rb)))) {
        const v = x => [x?.pontos || 0, x?.golos || 0, x?.golacos || 0];
        const [pa, pb] = [v(ra), v(rb)]; let c = 0; for (let i = 0; i < 3 && !c; i++) c = pa[i] - pb[i];
        venc = c > 0 ? a : c < 0 ? b : (seed(a) < seed(b) ? a : b);
      }
      return {a, b, ra, rb, venc, jogado: !!(ra || rb)};
    });
    rondas.push({k, dia, nome: nomeRonda(k, sor.rondas, lista.length), jogos: lista, byes: k === 1 ? sor.byes : []});
    const slots = [...entram, ...lista.map(m => m.venc)];
    pares = []; for (let i = 0; i < slots.length / 2; i++) pares.push([slots[i], slots[slots.length - 1 - i]]);
    entram = [];
  }
  const fin = rondas[rondas.length - 1].jogos[0];
  return {id, nome: tacaNome(id), rondas, campeao: fin?.jogado ? fin.venc : null, finalVazia: !!(fin?.venc && !fin.jogado), sor};
}
async function tacaGet() {
  if (!LIGA.db) return;
  const hoje = lisDate(); let id = tacaDe(hoje), ant = tacaAnterior(hoje);
  if (id && id < TACA_INICIO) id = null; if (ant < TACA_INICIO) ant = null;
  const get = async p => { try { const r = await fetch(ligaUrl(p), {cache:'no-store'}); return r.ok ? (await r.json()) || {} : null; } catch (e) { return null; } };
  const [j, ja, c] = await Promise.all([id ? get(`taca/${id}/jogos`) : null, ant ? get(`taca/${ant}/jogos`) : null, get('tacas_campeoes')]);
  TC = {id, jogos: j || {}, ant, antJogos: ja || {}, campeoes: c || {}};
  for (const [tid, js] of [[id, TC.jogos], [ant, TC.antJogos]]) if (tid) {   // guardar o campeão quando a final fica decidida (uma vez)
    const e = tacaEstado(tid, js); if (e.campeao && TC.campeoes[tid] !== e.campeao && Object.keys(js).length) { TC.campeoes[tid] = e.campeao; ligaPut(`tacas_campeoes/${tid}`, e.campeao).catch(() => {}); }
  }
}
function tacaMeuJogo() {
  if (!ME || !TC.id) return null;
  const e = tacaEstado(TC.id, TC.jogos), hoje = lisDate(), r = e.rondas.find(x => x.dia === hoje); if (!r) return null;
  const m = r.jogos.find(x => x.a === ME || x.b === ME);
  if (!m) { const fora = !e.rondas.slice(0, r.k - 1).some(x => x.jogos.some(y => y.venc === ME)) && !e.rondas[0].byes.includes(ME); return {r, m:null, fora, e}; }
  const op = m.a === ME ? m.b : m.a, meu = m.a === ME ? m.ra : m.rb;
  return {r, m, op, meu, e};
}
async function startTaca() {
  if (!ME) return askWho();
  await tacaGet(); const t = tacaMeuJogo();
  if (!t || !t.m) { toast('Hoje não tens jogo da taça'); return; }
  if (t.meu) { toast('Já jogaste a tua eliminatória de hoje'); openTaca(); return; }
  if (!t.op) { toast('O teu adversário ainda não está decidido'); return; }
  const id = TC.id, k = t.r.k, seed = hashStr(`taca:${LIGA.id}:${id}:r${k}`);
  let qs = null;
  try { const r = await fetch(ligaUrl(`taca/${id}/sets/r${k}`), {cache:'no-store'}); if (r.ok) { const arr = await r.json(); if (Array.isArray(arr)) qs = desserializar(arr); } } catch (e) {}
  if (!qs) { LIGA_PL_MAX = LIGA.maxPL; qs = genSet(seed, 'liga'); LIGA_PL_MAX = null; ligaPut(`taca/${id}/sets/r${k}`, qs.map(serializar)).catch(() => {}); }
  const inicio = Date.now();
  try { await ligaPut(`taca/${id}/jogos/r${k}/${ME}`, {pontos:0, golos:0, golacos:0, estado:'a jogar', inicio}); } catch (e) { toast('Sem ligação: tenta outra vez'); return; }
  startGame('7', seed, 'liga', qs); S.taca = {id, k, op: t.op, ronda: t.r.nome, inicio};
  toast(`${t.r.nome} da taça contra o ${t.op}: boa sorte!`);
}
let tcSyncT = null;
function tacaSync(final) {
  if (!S?.taca) return Promise.resolve();
  const body = {pontos:S.score, golos:S.shots.filter(x => x.tier).length, golacos:S.shots.filter(x => x.tier >= 5).length, perguntas:S.shots.length,
    tiros:tirosDe(), resp:S.shots.map(x => x.p ? x.p.nome : null), estado: final ? 'acabado' : 'a jogar', inicio:S.taca.inicio, fim: final ? Date.now() : null};
  const path = `taca/${S.taca.id}/jogos/r${S.taca.k}/${ME}`;
  const go = (k = 0) => ligaPut(path, JSON.parse(JSON.stringify(body))).catch(() => { if (k < 4) return sleep(2000 * (k + 1)).then(() => go(k + 1)); toast('Sem ligação: o resultado pode não ter ficado guardado'); });
  clearTimeout(tcSyncT); if (final) return go(); tcSyncT = setTimeout(go, 300); return Promise.resolve();
}
async function tacaFim() {
  const t = S.taca; $('#endLbl').textContent = `🏆 ${tacaNome(t.id)} · ${t.ronda}`;
  $('#again').textContent = 'Ver a taça'; $('#again').onclick = () => { $('#again').onclick = againOrig; openTaca(); };
  await tacaSync(true); await tacaGet();
  const r = TC.jogos?.['r' + t.k]?.[t.op], sub = $('#endSub');
  if (r && (r.estado === 'acabado')) { const a = S.score, b = r.pontos || 0;
    sub.innerHTML = `<div class="du-vs ${a > b ? 'du-win' : a < b ? 'du-lose' : ''}">${a > b ? `🏆 Passaste! ${a} – ${b}` : a < b ? `Eliminado… ${a} – ${b}` : `Empate ${a} – ${b} (desempate: golos)`}</div>${esc(sub.textContent)}`;
    if (a > b) confettiEnd(); }
  else sub.innerHTML = `${esc(sub.textContent)}<br><b>Agora falta o ${esc(t.op)}</b> jogar a eliminatória dele (até à meia-noite).`;
}
function openTaca() { LTAB = 'taca'; openLiga(); }
function tacaHTML() {
  if (!TC.campeoes) return '<p class="lg-note">A carregar…</p>';
  const hoje = lisDate(), mostrar = TC.id || TC.ant;
  if (!mostrar) return `<div class="tc-camp" style="background:var(--panel2)"><span style="font-size:34px">🏆</span><span><small>Taça dos Amigos</small><b>Começa ${hoje < TACA_INICIO ? diaCurto(TACA_INICIO).replace('.', '') : 'em breve'}</b></span></div>
    <p class="lg-note" style="text-align:left">Duas taças por semana: a <b>Taça de segunda</b> (segunda, terça e quarta) e a <b>Taça de quinta</b> (quinta, sexta e sábado). Sorteio automático; uma eliminatória por dia, 7 perguntas iguais para os dois; passa quem fizer mais pontos. Com 5 jogadores: pré-eliminatória (2 jogam, 3 passam diretamente), meias-finais e final. O campeão vai para o quadro de honra.</p>`;
  const e = tacaEstado(mostrar, TC.id ? TC.jogos : TC.antJogos);
  let h = '';
  if (!TC.id) h += `<p class="lg-note">Hoje ${dowDe(hoje) === 0 ? '(domingo) ' : ''}não há taça. A próxima começa ${dowDe(hoje) === 0 ? 'amanhã' : 'em breve'}. Aqui fica a última:</p>`;
  h += `<div class="tc-head"><b>${esc(e.nome)}</b><span>${diaCurto(e.rondas[0].dia)} – ${diaCurto(e.rondas[e.rondas.length - 1].dia)}</span></div>`;
  if (e.campeao) h += `<div class="tc-camp">${emb(e.campeao, 44)}<span><small>Campeão</small><b>🏆 ${esc(e.campeao)}</b></span></div>`;
  else if (e.finalVazia) h += `<p class="lg-note">Ninguém jogou a final: esta taça ficou sem campeão.</p>`;
  const t = tacaMeuJogo();
  if (t && t.m && !t.meu && t.op) h += `<button class="btn" id="tcPlay">Jogar: ${esc(t.r.nome)} contra o ${esc(t.op)} ›</button>`;
  for (const r of e.rondas) {
    const hojeR = r.dia === hoje, fut = r.dia > hoje;
    h += `<div class="tc-ronda ${hojeR ? 'hoje' : ''}"><div class="tc-rt"><b>${esc(r.nome)}</b><span>${diaCurto(r.dia)}${hojeR ? ' · hoje' : ''}</span></div>`;
    h += r.jogos.map(m => { const lado = (n, rec) => { if (!n) return `<div class="tc-p tbd"><span class="emb-v">?</span><span>a decidir</span><em></em></div>`;
        const st = rec ? (rec.estado === 'acabado' || Date.now() - (rec.inicio || 0) > 30 * 60e3 ? String(rec.pontos || 0) : '⏳') : (fut ? '' : r.dia < hoje ? '0' : '·');
        return `<div class="tc-p ${m.venc === n ? 'venc' : m.venc ? 'perd' : ''} ${n === ME ? 'eu' : ''}">${emb(n, 24)}<span>${esc(n)}</span><em>${st}</em></div>`; };
      return `<div class="tc-jogo">${lado(m.a, m.ra)}${lado(m.b, m.rb)}</div>`; }).join('');
    if (r.byes.length) h += `<p class="tc-bye">Passam diretamente: ${r.byes.map(n => `${emb(n, 16)}${esc(n)}`).join(', ')}</p>`;
    h += '</div>';
  }
  h += `<p class="foot">Uma eliminatória por dia, 7 perguntas iguais para os dois. Passa quem fizer mais pontos (desempate: golos, golos de longe, sorteio). Quem não jogar até à meia-noite fica com 0.</p>`;
  return h;
}
function tacaHonraHTML() {
  const c = TC.campeoes || {}, ids = Object.keys(c).sort().reverse(); if (!ids.length) return `<h3 class="lg-h">Campeões da Taça</h3><p class="lg-note">Ainda não houve nenhuma final.</p>`;
  const cont = {}; ids.forEach(i => cont[c[i]] = (cont[c[i]] || 0) + 1);
  return `<h3 class="lg-h">Campeões da Taça</h3><div class="trofeus">${Object.entries(cont).sort((a, b) => b[1] - a[1]).map(([n, k]) => `<div class="tr-q">${emb(n, 26)}<b>${esc(n)}</b><span class="cups">${'🏆'.repeat(Math.min(k, 8))}</span><em>${k}</em></div>`).join('')}</div>`
    + ids.slice(0, 12).map(i => `<div class="tr-w"><span>${tacaNome(i)} · ${diaCurto(i)}</span><b>🏆 ${esc(c[i])}</b></div>`).join('');
}

// ======================================================================
// 📰 MURAL DA LIGA — o que vai acontecendo (calculado dos jogos da liga, duelos e taças; nada novo guardado)
// ======================================================================
function quando(t) {
  const m = Math.round((Date.now() - t) / 60000); if (m < 1) return 'agora'; if (m < 60) return `há ${m} min`;
  const h = Math.round(m / 60); if (h < 12) return `há ${h} h`;
  const d = new Date(t); return d.toLocaleDateString('pt-PT', {weekday:'short'}) + ' ' + d.toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'});
}
const vs = (n, txtEu, txtOutro) => n === ME ? txtEu : txtOutro;
function muralEventos() {
  const ev = [], desde = Date.now() - 8 * 864e5, add = (t, ic, html, quem) => { if (t && t > desde) ev.push({t, ic, html, quem}); };
  const nb = n => `<b>${esc(n)}</b>`;
  // jogos da liga
  const recordeAntes = {}, jogosOrd = [];
  for (const n of LIGA.jogadores) for (const dia in (LG.dados?.[n] || {})) for (const [jk, g] of Object.entries(LG.dados[n][dia] || {})) if (g) jogosOrd.push({n, dia, j: jk.slice(1), g, t: g.fim || g.inicio || 0});
  jogosOrd.sort((a, b) => a.t - b.t);
  const sem = weekStart(lisDate()), acum = {}; let lider = null;
  for (const x of jogosOrd) {
    const {n, g} = x, acabado = g.estado === 'acabado';
    if (acabado) {
      const b100 = (g.tiros || []).filter(t => t[1] === 6).length;
      if (b100) add(x.t, '🚀', `${vs(n, 'Marcaste', nb(n) + ' marcou')} ${b100 > 1 ? b100 + ' golos' : 'um golo'} de baliza a baliza (100 m) no jogo ${x.j} da liga`, n);
      if ((g.perguntas || 0) >= 7 && g.golos === g.perguntas) add(x.t, '🎯', `${vs(n, 'Acertaste', nb(n) + ' acertou')} as 7 perguntas do jogo ${x.j} (${g.pontos} pontos)`, n);
      if (recordeAntes[n] != null && (g.pontos || 0) > recordeAntes[n] && recordeAntes[n] > 0) add(x.t, '⭐', `${vs(n, 'Bateste o teu recorde', nb(n) + ' bateu o recorde dele')} na liga: ${g.pontos} pontos`, n);
      recordeAntes[n] = Math.max(recordeAntes[n] || 0, g.pontos || 0);
    }
    if (weekStart(x.dia) === sem) {
      acum[n] = (acum[n] || 0) + (g.pontos || 0);
      const top = Object.entries(acum).sort((a, b) => b[1] - a[1])[0][0];
      if (top !== lider) { if (lider) add(x.t, '👑', `${vs(top, 'Passaste para a frente da liga', 'Novo líder da semana: ' + nb(top))} (${acum[top]} pontos)`, top); lider = top; }
    }
  }
  // campeão da semana passada
  const ult = semanasFechadas().at(-1); if (ult) add(new Date(diaMais(ult.ws, 7) + 'T00:00:00Z').getTime(), '🏆', `${ult.vencedores.map(nb).join(' e ')} ${ult.vencedores.length > 1 ? 'foram campeões' : 'foi campeão'} da semana com ${ult.pts} pontos`, ult.vencedores[0]);
  // duelos
  for (const d of Object.values(DU.dados || {})) {
    if (!d || d.para === '*') continue; const ra = d.res?.[d.de], rb = d.res?.[d.para];
    if (duAcabou(ra) && duAcabou(rb)) { const a = ra.pontos || 0, b = rb.pontos || 0, t = Math.max(ra.fim || 0, rb.fim || 0) || d.criado;
      if (a === b) add(t, '⚔️', `${nb(d.de)} e ${nb(d.para)} empataram um duelo (${a}–${b})`, d.de);
      else { const [w, l, pw, pl] = a > b ? [d.de, d.para, a, b] : [d.para, d.de, b, a];
        add(t, '⚔️', l === ME ? `${nb(w)} ganhou-te um duelo por ${pw - pl} pontos (${pw}–${pl})` : w === ME ? `Ganhaste um duelo ao ${nb(l)} por ${pw - pl} pontos (${pw}–${pl})` : `${nb(w)} ganhou um duelo ao ${nb(l)} (${pw}–${pl})`, w); } }
    else add(d.criado, '⚔️', d.para === ME ? `${nb(d.de)} desafiou-te para um duelo` : `${nb(d.de)} desafiou o ${nb(d.para)} para um duelo`, d.de);
  }
  // taças
  for (const [tid, js] of [[TC.ant, TC.antJogos], [TC.id, TC.jogos]]) { if (!tid || !js) continue;
    const e = tacaEstado(tid, js);
    for (const r of e.rondas) for (const m of r.jogos) if (m.venc && m.jogado) { const p = m.venc === m.a ? m.b : m.a, rv = m.venc === m.a ? m.ra : m.rb, rp = m.venc === m.a ? m.rb : m.ra;
      const t = Math.max(rv?.fim || 0, rp?.fim || 0) || new Date(diaMais(r.dia, 1) + 'T00:00:00Z').getTime();
      if (r.nome === 'Final') add(t + 1, '🏆', `${vs(m.venc, 'Ganhaste a ' + e.nome + '!', nb(m.venc) + ' ganhou a ' + e.nome + '!')} Na final, ${rv?.pontos || 0}–${rp?.pontos || 0} ao ${nb(p)}`, m.venc);
      else add(t, '🏆', `${vs(m.venc, 'Passaste', nb(m.venc) + ' passou')} ${r.nome === 'Meias-finais' ? 'à final' : 'às ' + (r.k + 1 === e.rondas.length ? 'final' : 'meias-finais')} da ${e.nome} (${rv?.pontos || 0}–${rp?.pontos || 0} ao ${nb(p)})`, m.venc); }
  }
  return ev.sort((a, b) => b.t - a.t);
}
function muralFaltam() { const hoje = lisDate(); return LIGA.jogadores.filter(n => feitosDia(n, hoje) === 0); }
function muralItem(e) { return `<div class="mu-it">${e.quem && LIGA.jogadores.includes(e.quem) ? emb(e.quem, 22) : `<span class="mu-ic">${e.ic}</span>`}<span class="mu-tx">${e.ic} ${e.html}</span><small>${quando(e.t)}</small></div>`; }
function muralHTML(max) {
  if (!LG.dados) return '<p class="lg-note">A carregar…</p>';
  const ev = muralEventos(), falta = muralFaltam();
  let h = falta.length ? `<div class="mu-falta">👀 Ainda não ${falta.length === 1 ? 'jogou' : 'jogaram'} hoje: ${falta.map(n => `${emb(n, 16)}<b>${esc(n)}</b>`).join(', ')}</div>` : '<div class="mu-falta ok">✅ Hoje já jogaram todos!</div>';
  h += ev.length ? ev.slice(0, max || 60).map(muralItem).join('') : '<p class="lg-note">Ainda não aconteceu nada esta semana.</p>';
  return h;
}
function renderLigaExtra(tab) { $('#lgBody').innerHTML = tab === 'taca' ? tacaHTML() : muralHTML(); const b = $('#tcPlay'); if (b) b.onclick = startTaca; }
// ---------- no início: um cartão pequeno da taça e as 3 últimas do mural ----------
$('#ligaCard').insertAdjacentHTML('afterend', '<div class="tc-mini" id="tcMini" hidden></div><div class="mu-mini" id="muMini" hidden></div>');
function inicioExtra() {
  const tm = $('#tcMini'), mm = $('#muMini'); if (!tm) return;
  if (LIGA.db && TC.campeoes) {
    const t = tacaMeuJogo(); let linha = '', botao = '';
    if (!TC.id && !TC.ant) linha = lisDate() < TACA_INICIO ? `A 1.ª taça começa ${diaCurto(TACA_INICIO).replace('.', '')}` : 'Em breve';
    else if (!TC.id) linha = dowDe(lisDate()) === 0 ? 'Domingo não há taça · amanhã começa a Taça de segunda' : 'Ver a última taça';
    else if (!t) { const e = tacaEstado(TC.id, TC.jogos); linha = e.campeao ? `Campeão: <b>${esc(e.campeao)}</b>` : 'Ver o quadro'; }
    else if (t.m && t.op && !t.meu) { linha = `Hoje: <b>${esc(t.r.nome)}</b> contra o <b>${esc(t.op)}</b>`; botao = '<button class="du-btn" id="tcMiniPlay">Jogar</button>'; }
    else if (t.m && t.meu) linha = `${esc(t.r.nome)} contra o ${esc(t.op)}: já jogaste${t.m.venc ? (t.m.venc === ME ? ' · <b>passaste!</b>' : ' · eliminado') : ''}`;
    else linha = t.fora ? `Já foste eliminado · hoje: ${esc(t.r.nome)}` : `Hoje não jogas (${esc(t.r.nome)})`;
    tm.hidden = false; tm.innerHTML = `<span class="ic">🏆</span><span class="tx"><b>${esc(TC.id || TC.ant ? tacaNome(TC.id || TC.ant) : 'Taça dos Amigos')}</b><small>${linha}</small></span>${botao || '<span class="go">›</span>'}`;
    tm.onclick = e => { if (e.target.closest('#tcMiniPlay')) { e.stopPropagation(); startTaca(); } else openTaca(); };
  }
  if (LG.dados && LIGA.db) { const ev = muralEventos().slice(0, 3); mm.hidden = false;
    mm.innerHTML = `<div class="mu-top"><b>📰 Mural</b><button class="linkbtn" id="muVer">ver tudo ›</button></div>${ev.length ? ev.map(muralItem).join('') : '<p class="lg-note" style="margin:4px 0">Ainda não aconteceu nada esta semana.</p>'}`;
    $('#muVer').onclick = () => { LTAB = 'mural'; openLiga(); }; }
}
renderLigaCard = (orig => function () { const r = orig.apply(this, arguments); try { inicioExtra(); } catch (e) {} return r; })(renderLigaCard);
async function tacaRefresh() { await tacaGet(); inicioExtra(); if ($('#s-liga').classList.contains('on') && (LTAB === 'taca' || LTAB === 'mural' || LTAB === 'trofeus')) renderLiga(); }
tacaRefresh(); setInterval(() => { if (LIGA.db && document.visibilityState === 'visible' && ($('#s-home').classList.contains('on') || $('#s-liga').classList.contains('on'))) tacaRefresh(); }, 30000);

// ---------- ligar tudo ----------
$('#m-raj').onclick = startRajada;
$('#m-quem').onclick = startQuem;
$('#m-mm').onclick = openMM;
$('#m-duelo').onclick = () => { if (!ME) { askWho(); return; } openDuelo(); };
$('#duBack').onclick = mxSair;
$('#duRefresh').onclick = duRefresh;
setInterval(() => { if (LIGA.db && ME && document.visibilityState === 'visible' && ($('#s-home').classList.contains('on') || $('#s-duelo').classList.contains('on'))) duRefresh(); }, 20000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') duRefresh(); });
duRefresh();
