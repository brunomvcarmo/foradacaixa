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
  $('.modes').insertAdjacentHTML('afterend', `<div class="mx-h">Mais modos</div><div class="mx-tiles">
    <button class="mx-tile" id="m-raj"><span class="ic">⚡</span><b>Rajada</b><small>Uma pergunta, 60 s: diz o máximo de respostas</small></button>
    <button class="mx-tile" id="m-quem"><span class="ic">🕵️</span><b>Quem é?</b><small>Adivinha o jogador pelos clubes, com o mínimo de pistas</small></button>
    <button class="mx-tile" id="m-mm"><span class="ic">📈</span><b>Mais ou menos</b><small>Custou mais ou menos? Marcou mais ou menos?</small></button>
    <button class="mx-tile" id="m-duelo"><span class="ic">⚔️</span><b>Duelo</b><small>Desafia um amigo da liga: as mesmas 7 perguntas</small><span class="mx-badge" id="duBadge" hidden></span></button>
  </div>`);
})();
const mxST = k => (ST[k] = ST[k] ?? (k === 'bestMm' ? {} : k.endsWith('Rec') ? [] : 0));
function mxPop(txt, cor) { const d = document.createElement('div'); d.className = 'mx-pop'; d.textContent = txt; d.style.color = cor; document.body.appendChild(d); setTimeout(() => d.remove(), 950); }
function mxShake(el) { el.classList.remove('mx-shake'); void el.offsetWidth; el.classList.add('mx-shake'); try { navigator.vibrate && navigator.vibrate([20, 30, 20]); } catch (e) {} }
const mxSair = () => { renderHome(); show('s-home'); };
const fmtN = v => String(v).replace('.', ',');
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
  const t = MM.t, verbo = t.pergunta === 'custou' ? 'custou' : 'marcou';
  $('#mmBody').innerHTML = `<div class="mm-score"><span>${t.ic} ${esc(t.nome)}</span><span>série <b id="mmS">${MM.serie}</b></span></div>
    <div class="mm-card"><div class="mm-n">${esc(MM.a.n)}</div><div class="mm-l">${verbo}</div><div class="mm-v">${mmVal(MM.a.v)}</div><div class="mm-d">${esc(MM.a.d)}</div></div>
    <div class="mm-vs">… e este ${verbo} mais ou menos?</div>
    <div class="mm-card b"><div class="mm-n">${esc(MM.b.n)}</div><div class="mm-l">${verbo}</div><div class="mm-v q" id="mmBv">?</div><div class="mm-d" id="mmBd"></div></div>
    <div class="mm-btns" id="mmBtns"><button class="up" data-d="mais">▲ Mais</button><button class="down" data-d="menos">▼ Menos</button></div>
    <p class="foot">${esc(t.sub)} · Transfermarkt</p>`;
  $('#mmBtns').querySelectorAll('button').forEach(b => b.onclick = () => mmResp(b.dataset.d));
}
async function mmResp(d) {
  if (MM.busy) return; MM.busy = true;
  const {a, b} = MM, certo = d === 'mais' ? b.v >= a.v : b.v <= a.v;
  $('#mmBtns').querySelectorAll('button').forEach(x => x.disabled = true);
  const el = $('#mmBv'); el.classList.remove('q');
  await tween(700, k => el.textContent = mmVal(MM.t.unid === 'M€' ? Math.round(b.v * k * 10) / 10 : Math.round(b.v * k)), easeOut);
  el.textContent = mmVal(b.v); $('#mmBd').textContent = b.d;
  if (certo) {
    MM.serie++; $('#mmS').textContent = MM.serie; mxPop(MM.serie % 5 === 0 ? `${MM.serie} SEGUIDAS!` : '✓', 'var(--t2)');
    await sleep(900); MM.a = b; MM.b = mmOutro(b); MM.busy = false; mmRender();
  } else { el.classList.add('bad'); mxShake(el.parentNode); await sleep(900); MM.busy = false; mmFim(); }
}
function mmFim() {
  const best = mxST('bestMm'), id = MM.t.id, rec = MM.serie > (best[id] || 0);
  if (rec) best[id] = MM.serie; ST.jogos++; saveStats(ST);
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
  if (!ME) { $('#duBan').hidden = true; $('#duBadge').hidden = true; return; }
  const p = duPendentes(), ban = $('#duBan');
  ban.hidden = !p.length; $('#duBadge').hidden = !p.length; $('#duBadge').textContent = p.length;
  if (p.length) { $('#duBanTx').innerHTML = p.length === 1 ? `O <b>${esc(p[0].de)}</b> desafiou-te para um duelo!` : `Tens <b>${p.length} duelos</b> à tua espera!`; ban.onclick = () => p.length === 1 ? duJogar(p[0].id) : openDuelo(); }
}
async function duRefresh() { if (!ME || !LIGA.db) return; await duGet(); duRenderHome(); if ($('#s-duelo').classList.contains('on')) duRender(); }
function duRes(d, n) { const r = d.res?.[n]; return r ? r.pontos || 0 : null; }
function duRender() {
  const el = $('#duBody');
  if (!ME) { el.innerHTML = `<p class="cd-p">Primeiro escolhe quem és.</p><button class="btn" id="duWho">Escolher</button>`; $('#duWho').onclick = askWho; return; }
  if (!DU.dados) { el.innerHTML = `<p class="cd-p">${DU.erro ? 'Sem ligação: tenta daqui a pouco.' : 'A carregar…'}</p>`; return; }
  const ls = duLista(), pend = ls.filter(d => d.para === ME && !d.res?.[ME]), espera = ls.filter(d => d.res?.[ME] && !duAcabou(d.res?.[duOutro(d)]));
  const feitos = ls.filter(d => duAcabou(d.res?.[d.de]) && duAcabou(d.res?.[d.para]));
  const cat = catNorm(ST.cat);
  let h = '';
  if (pend.length) h += `<div class="du-sec">Desafiaram-te</div>` + pend.map(d => `<div class="du-card hot"><div class="tx"><b>${esc(d.de)}</b> desafiou-te<small>7 perguntas · ${esc(catNome(d.cat))}${duAcabou(d.res?.[d.de]) ? ` · fez ${duRes(d, d.de)} pontos` : ''}</small></div><button class="du-btn" data-jogar="${d.id}">Jogar</button></div>`).join('');
  h += `<div class="du-sec">Novo duelo</div><div class="du-ops">${LIGA.jogadores.filter(n => n !== ME).map(n => `<button class="du-op" data-op="${esc(n)}">⚔️ ${esc(n)}</button>`).join('')}</div>
    <p class="du-cat">Perguntas: <b>${esc(cat === 'tudo' ? 'todas' : catNome(cat))}</b> · <button class="linkbtn" id="duCat">mudar</button></p>`;
  if (espera.length) h += `<div class="du-sec">À espera</div>` + espera.map(d => `<div class="du-card"><div class="tx">À espera do <b>${esc(duOutro(d))}</b><small>fizeste ${duRes(d, ME)} pontos · ${new Date(d.criado).toLocaleDateString('pt-PT', {day:'numeric', month:'short'})}</small></div></div>`).join('');
  // registo contra cada amigo
  const reg = {};
  for (const d of feitos) { const o = duOutro(d), a = duRes(d, ME), b = duRes(d, o), r = reg[o] = reg[o] || [0, 0, 0]; r[a > b ? 0 : a < b ? 2 : 1]++; }
  if (Object.keys(reg).length) h += `<div class="du-sec">Contra cada amigo</div><div class="du-rec">${Object.entries(reg).map(([o, [v, e, d]]) => `<span>${esc(ME)} <b>${v}</b> – <b>${d}</b> ${esc(o)}${e ? ` · ${e} empate${e === 1 ? '' : 's'}` : ''}</span>`).join('')}</div>`;
  if (feitos.length) h += `<div class="du-sec">Últimos duelos</div>` + feitos.slice(0, 15).map(d => { const o = duOutro(d), a = duRes(d, ME), b = duRes(d, o), cl = a > b ? 'du-win' : a < b ? 'du-lose' : '';
    return `<div class="du-card"><div class="tx"><b class="${cl}">${a > b ? 'Ganhaste' : a < b ? 'Perdeste' : 'Empate'}</b> contra ${esc(o)}<small>${new Date(d.criado).toLocaleDateString('pt-PT', {day:'numeric', month:'short'})} · ${esc(catNome(d.cat))}</small></div><div class="res">${a} – ${b}</div></div>`; }).join('');
  if (!ls.length) h += `<p class="cd-p" style="margin-top:14px">Ainda não há duelos. Escolhe um amigo: jogas as 7 perguntas e ele recebe o desafio no início da app.</p>`;
  el.innerHTML = h;
  el.querySelectorAll('[data-jogar]').forEach(b => b.onclick = () => duJogar(b.dataset.jogar));
  el.querySelectorAll('[data-op]').forEach(b => b.onclick = () => duCriar(b.dataset.op));
  const bc = $('#duCat'); if (bc) bc.onclick = () => { openCats(); $('#catDlg').addEventListener('close', duRender, {once:true}); };
}
async function openDuelo() { show('s-duelo'); duRender(); await duGet(); duRender(); duRenderHome(); }
function duRecDe() { return {pontos:S.score, golos:S.shots.filter(s => s.tier).length, perguntas:S.shots.length, inicio:S.duelo.inicio, tiros:tirosDe(), resp:S.shots.map(s => s.p ? s.p.nome : null)}; }
async function duCriar(op) {
  if (!LIGA.db || !ME) return;
  const cat = catNorm(ST.cat), f = freshSeed(cat), qs = f[2];
  if (qs.length < NQ) { toast('Não há perguntas suficientes desse tipo'); return; }
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6), inicio = Date.now();
  const d = {de:ME, para:op, cat, criado:inicio, qs:qs.map(serializar), res:{[ME]:{pontos:0, estado:'a jogar', inicio}}};
  try { await ligaPut(`duelos/${id}`, d); } catch (e) { toast('Sem ligação: o duelo não foi criado'); return; }
  (DU.dados = DU.dados || {})[id] = d;
  startGame('7', f[0], cat, qs); S.duelo = {id, op, inicio};
  toast(`Duelo com o ${op}: boa sorte!`);
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
  const body = {...duRecDe(), estado: final ? 'acabado' : 'a jogar', fim: final ? Date.now() : null}, path = `duelos/${S.duelo.id}/res/${ME}`;
  const go = (k = 0) => ligaPut(path, JSON.parse(JSON.stringify(body))).catch(() => { if (k < 4) return sleep(2000 * (k + 1)).then(() => go(k + 1)); toast('Sem ligação: o resultado pode não ter ficado guardado'); });
  clearTimeout(duSyncT);
  if (final) return go();
  duSyncT = setTimeout(go, 300); return Promise.resolve();
}
async function dueloFim() {
  const du = S.duelo, op = du.op;
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
}
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
