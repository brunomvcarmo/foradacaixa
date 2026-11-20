// =====================================================================================
// Fora da Caixa — emblemas dos amigos da liga (paródias dos símbolos dos clubes que cada um apoia).
// Carregado ANTES do script principal. Expõe: emblemaSVG(nome), emblemaURL(nome), emblemaPNG(nome, grande), emb(nome, px).
// Todos usam a versão AVACALHADA (2) — o utilizador não quer escolha. A versão 1 (quase igual) fica no código, sem uso.
// Bruno = Liverpool · Freitas = Chelsea · CC = Arsenal · Viegas = Manchester United · Manel = Leicester City. Outros nomes: círculo com as iniciais.
// =====================================================================================
(function () {
'use strict';
// símbolos desenhados com mais pormenor (gradientes, contornos, penas, juba…)
let UID = 0;
const rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
function pena(bx, by, ang, L, w) {   // pena: forma de folha a partir da base, virada para ang (radianos)
  const P = (x, y) => { const [a, b] = rot(x, y, ang); return `${(bx + a).toFixed(1)} ${(by + b).toFixed(1)}`; };
  return `M${P(0, 0)} C${P(w * .6, L * .25)} ${P(w * .55, L * .8)} ${P(0, L)} C${P(-w * .45, L * .8)} ${P(-w * .6, L * .25)} ${P(0, 0)}Z`;
}
// ---------- ave (cormorão heráldico, de lado, asas levantadas, alga no bico) ----------
function AVE2(cor, escuro, opt = {}) {
  const u = 'av' + (UID++);
  let asaE = '', asaD = '';
  const nerv = (bx, by, ang, L) => { const [x2, y2] = rot(0, L * .92, ang); return `<path d="M${bx} ${by} L${(bx + x2).toFixed(1)} ${(by + y2).toFixed(1)}" stroke="${escuro}" stroke-width=".9" opacity=".75" fill="none"/>`; };
  for (let i = 0; i < 7; i++) asaE += `<path d="${pena(-6, -16, Math.PI * (0.62 + i * 0.075), 30 + i * 4.5, 10)}"/>` + nerv(-6, -16, Math.PI * (0.62 + i * 0.075), 30 + i * 4.5);
  for (let i = 0; i < 6; i++) asaD += `<path d="${pena(10, -20, Math.PI * (0.98 + i * 0.07), 26 + i * 4, 9)}"/>` + nerv(10, -20, Math.PI * (0.98 + i * 0.07), 26 + i * 4);
  let escamas = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 4 - (r > 2 ? 1 : 0); c++) { const x = -16 + c * 8 + (r % 2) * 4, y = -4 + r * 8; escamas += `<path d="M${x - 4} ${y} Q${x} ${y + 5} ${x + 4} ${y}" />`; }
  let cauda = ''; for (let i = 0; i < 4; i++) cauda += `<path d="${pena(-14, 26, Math.PI * (0.18 + i * 0.09), 20 + i * 2, 7)}"/>`;
  return `<g><defs><linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cor}"/><stop offset="1" stop-color="${escuro}"/></linearGradient></defs>
  <g fill="url(#${u}g)" stroke="${escuro}" stroke-width="1.6" stroke-linejoin="round">
    <g transform="scale(-1 1) translate(-4 0)">${asaD}</g>
    ${cauda}
    <path d="M-20 28 C-32 18 -30 -4 -16 -12 C-6 -18 8 -16 13 -8 C18 2 16 22 4 30 C-4 34 -14 33 -20 28Z"/>
    ${asaE}
    <path d="M4 -10 C2 -26 8 -40 16 -46 C22 -51 31 -50 33 -44 C34 -40 31 -36 27 -34 C22 -30 19 -22 17 -8Z"/>
    <path d="M24 -50 C21 -56 24 -61 29 -61 C27 -58 28 -55 31 -52 C29 -55 31 -59 35 -59 C33 -55 33 -52 32 -49Z"/>
  </g>
  <g fill="none" stroke="${escuro}" stroke-width="1.2" opacity=".7">${escamas}</g>
  <path d="M31 -45 L50 -41 C52 -40 52 -38 50 -37 L31 -38Z" fill="${opt.bico || '#e9b23a'}" stroke="${escuro}" stroke-width="1.4"/>
  <path d="M50 -41 C53 -40 53 -36 50 -35" fill="none" stroke="${escuro}" stroke-width="1.4"/>
  ${opt.oculos ? `<g><rect x="19" y="-47" width="10" height="7" rx="2.5" fill="#111"/><rect x="29.5" y="-46.5" width="7" height="6" rx="2" fill="#111"/><rect x="17" y="-45" width="20" height="1.8" fill="#111"/><rect x="21" y="-46" width="3" height="2" fill="#fff" opacity=".6"/></g>`
                : `<circle cx="25" cy="-43" r="3.2" fill="#fff" stroke="${escuro}" stroke-width="1"/><circle cx="26" cy="-43" r="1.6" fill="#111"/>`}
  ${opt.bola ? `<g transform="translate(57 -36)"><circle r="8" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M0 -3.4 L3.2 -1 L2 2.8 L-2 2.8 L-3.2 -1Z" fill="#111"/><path d="M0 -3.4 L0 -8 M3.2 -1 L7.6 -2.4 M2 2.8 L4.6 6.4 M-2 2.8 L-4.6 6.4 M-3.2 -1 L-7.6 -2.4" stroke="#111" stroke-width="1"/></g>`
             : `<g fill="#2f8f5b" stroke="#145232" stroke-width="1"><path d="M50 -39 C58 -46 66 -44 70 -38 C64 -38 60 -34 62 -28 C56 -30 53 -34 50 -38Z"/><path d="M58 -42 C62 -50 70 -52 74 -48 C68 -46 66 -44 64 -40Z"/><path d="M56 -36 C60 -30 60 -24 56 -20 C54 -26 52 -30 52 -34Z"/></g>`}
  <g stroke="${opt.pernas || '#e9b23a'}" stroke-width="3" stroke-linecap="round" fill="none"><path d="M-6 31 L-8 48 M4 30 L6 48"/></g>
  <g fill="${opt.pernas || '#e9b23a'}" stroke="${escuro}" stroke-width="1"><path d="M-8 47 L-18 52 L-12 52 L-8 50 L-4 53 L0 52Z"/><path d="M6 47 L-2 52 L4 52 L6 50 L10 53 L15 52Z"/></g></g>`;
}
// ---------- leão rampante (de pé, patas levantadas, juba encaracolada, cauda com tufo) ----------
function LEAO2(cor, escuro, ouro, opt = {}) {
  const u = 'le' + (UID++);
  const L = (d, w) => `<path d="${d}" stroke="${escuro}" stroke-width="${w + 3.5}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="url(#${u}g)" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const garra = (x, y, a) => [0, 1, 2].map(k => { const [dx, dy] = rot(6, (k - 1) * 3.4, a); const [ex, ey] = rot(10, (k - 1) * 4.4, a); return `<path d="M${x + dx * .5} ${y + dy * .5} Q${x + dx} ${y + dy} ${x + ex} ${y + ey}" stroke="${escuro}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; }).join('');
  // juba: anéis de caracóis grandes à volta da cabeça e a descer pelo peito
  let juba = '';
  const cachos = [];
  for (let i = 0; i < 15; i++) { const a = -Math.PI * 1.02 + i / 14 * Math.PI * 1.7; cachos.push([-10 + Math.cos(a) * 19, -36 + Math.sin(a) * 21, 8.5]); }
  for (let i = 0; i < 5; i++) cachos.push([-4 + i * 1.2, -16 + i * 5, 7.5 - i * .6]);
  for (const [x, y, r] of cachos) juba += `<path d="M${(x - r).toFixed(1)} ${y.toFixed(1)} A${r} ${r} 0 1 1 ${(x + r * .3).toFixed(1)} ${(y + r * .95).toFixed(1)} Q${(x - r * .2).toFixed(1)} ${(y + r * .2).toFixed(1)} ${(x - r).toFixed(1)} ${y.toFixed(1)}Z"/><path d="M${(x - r * .45).toFixed(1)} ${(y - r * .1).toFixed(1)} A${(r * .45).toFixed(1)} ${(r * .45).toFixed(1)} 0 1 1 ${(x + r * .1).toFixed(1)} ${(y + r * .4).toFixed(1)}" fill="none" stroke="${escuro}" stroke-width="1.1"/>`;
  return `<g><defs><linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${cor}"/><stop offset="1" stop-color="${escuro}"/></linearGradient></defs>
  ${opt.bastao !== false ? `<line x1="-44" y1="-58" x2="-20" y2="60" stroke="${escuro}" stroke-width="7" stroke-linecap="round"/><line x1="-44" y1="-58" x2="-20" y2="60" stroke="${ouro}" stroke-width="4" stroke-linecap="round"/>
    ${opt.interrogacao ? `<path d="M-54 -66 C-56 -80 -36 -82 -36 -70 C-36 -62 -44 -62 -44 -56" fill="none" stroke="${escuro}" stroke-width="7" stroke-linecap="round"/><path d="M-54 -66 C-56 -80 -36 -82 -36 -70 C-36 -62 -44 -62 -44 -56" fill="none" stroke="${ouro}" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M-50 -60 C-54 -72 -40 -78 -36 -70 C-34 -64 -40 -60 -44 -62" fill="none" stroke="${escuro}" stroke-width="6"/><path d="M-50 -60 C-54 -72 -40 -78 -36 -70 C-34 -64 -40 -60 -44 -62" fill="none" stroke="${ouro}" stroke-width="3.5"/>`}` : ''}
  ${L('M18 14 C40 10 50 -6 44 -22 C40 -32 44 -40 52 -42', 4.5)}
  <path d="M50 -42 C46 -52 56 -58 62 -52 C58 -52 58 -48 62 -44 C58 -42 60 -38 64 -36 C58 -34 52 -36 50 -42Z" fill="url(#${u}g)" stroke="${escuro}" stroke-width="1.5"/>
  ${L('M4 30 C6 44 2 52 -2 58', 13)}${L('M16 26 C10 36 -6 36 -18 30', 12)}
  <path d="M-14 -24 C-26 -8 -20 16 -4 32 C8 38 24 32 24 18 C24 4 12 -16 6 -26Z" fill="url(#${u}g)" stroke="${escuro}" stroke-width="2"/><path d="M-6 -8 C-8 4 -6 14 0 22 M10 8 C14 14 14 20 12 26" fill="none" stroke="${escuro}" stroke-width="1.2" opacity=".7"/>
  ${L('M-6 -18 C-18 -22 -28 -32 -36 -40', 10.5)}${L('M-4 -6 C-16 -6 -28 -12 -38 -18', 10.5)}
  ${garra(-38, -42, Math.PI * 1.2)}${garra(-40, -19, Math.PI * 1.05)}${garra(-20, 31, Math.PI * .95)}${garra(-4, 59, Math.PI * .5)}
  <g fill="url(#${u}g)" stroke="${escuro}" stroke-width="1.3">${juba}</g>
  <g transform="translate(-14 -36) scale(1.35) translate(14 36)">
  <path d="M-12 -46 C-20 -46 -26 -42 -30 -36 L-35 -34 C-34 -31 -31 -30 -29 -31 L-27 -28 C-29 -26 -30 -24 -28 -23 C-22 -22 -16 -24 -12 -28 C-8 -32 -6 -42 -12 -46Z" fill="url(#${u}g)" stroke="${escuro}" stroke-width="1.4"/>
  <path d="M-35 -34.5 L-31 -34 L-32.5 -31Z" fill="${escuro}"/><path d="M-29 -31 L-27 -28 L-34 -26 Z" fill="#c62a1f" stroke="${escuro}" stroke-width=".8"/>
  <path d="M-25 -36 C-22 -37 -19 -36 -18 -34" fill="none" stroke="${escuro}" stroke-width="1"/>
  <path d="M-14 -46 L-12 -53 L-8 -46Z" fill="url(#${u}g)" stroke="${escuro}" stroke-width="1.2"/>
  <path d="M-22 -41 L-17 -42" stroke="${escuro}" stroke-width="1.3" stroke-linecap="round"/><circle cx="-19" cy="-39.5" r="1.8" fill="#fff"/><circle cx="-19.6" cy="-39.5" r=".9" fill="#111"/></g>
  ${opt.coroa ? `<g transform="rotate(-18 -14 -54)"><path d="M-28 -52 L-26 -64 L-20 -56 L-14 -68 L-8 -56 L-2 -64 L0 -52Z" fill="${ouro}" stroke="${escuro}" stroke-width="1.4"/><circle cx="-14" cy="-68" r="2" fill="#d33a2c"/></g>` : ''}</g>`;
}
// ---------- canhão dourado (com brilho metálico e reparos) ----------
function CANHAO2(opt = {}) {
  const u = 'ca' + (UID++), O = '#7a5a12';
  return `<g><defs><linearGradient id="${u}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".35" stop-color="#e2bd4c"/><stop offset=".7" stop-color="#b38a1e"/><stop offset="1" stop-color="#7a5a12"/></linearGradient>
    <radialGradient id="${u}r" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#fff2b0"/><stop offset=".6" stop-color="#d7ad3a"/><stop offset="1" stop-color="#7a5a12"/></radialGradient></defs>
  <g transform="rotate(-6)">
    <path d="M-52 -11 C-52 -14 -50 -16 -46 -16 L34 -12 L34 12 L-46 16 C-50 16 -52 14 -52 11Z" fill="url(#${u}m)" stroke="${O}" stroke-width="1.6"/>
    <path d="M34 -14 C40 -15 46 -16 50 -18 L52 -18 L52 18 L50 18 C46 16 40 15 34 14Z" fill="url(#${u}m)" stroke="${O}" stroke-width="1.6"/>
    <ellipse cx="52" cy="0" rx="3" ry="18" fill="#5b430c" stroke="${O}" stroke-width="1.4"/><ellipse cx="52.5" cy="0" rx="1.6" ry="11" fill="#2a1f05"/>
    ${[-40, -22, 6, 30].map(x => `<rect x="${x}" y="${-16 + (x + 52) * .045}" width="${x === -40 ? 7 : 5}" height="${32 - (x + 52) * .09}" rx="2" fill="url(#${u}m)" stroke="${O}" stroke-width="1.3"/>`).join('')}
    <circle cx="-58" cy="0" r="6.5" fill="url(#${u}r)" stroke="${O}" stroke-width="1.4"/><rect x="-56" y="-3" width="5" height="6" fill="url(#${u}m)" stroke="${O}" stroke-width="1"/>
    <circle cx="-8" cy="0" r="5" fill="url(#${u}r)" stroke="${O}" stroke-width="1.3"/>
    <path d="M-48 -9 L30 -7" stroke="#fffbe0" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>
  </g>
  <path d="M-46 12 L-36 26 L26 26 L34 12 L22 12 L18 18 L-28 18 L-34 12Z" fill="url(#${u}m)" stroke="${O}" stroke-width="1.5"/>
  ${[-30, 20].map(x => `<g transform="translate(${x} 30)"><circle r="13" fill="url(#${u}r)" stroke="${O}" stroke-width="1.6"/><circle r="9" fill="none" stroke="${O}" stroke-width="1.2"/>
    ${[0, 30, 60, 90, 120, 150].map(a => { const [x2, y2] = rot(9, 0, a * Math.PI / 180); return `<line x1="${-x2.toFixed(1)}" y1="${-y2.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${O}" stroke-width="1.6"/>`; }).join('')}<circle r="3" fill="url(#${u}r)" stroke="${O}" stroke-width="1"/></g>`).join('')}
  ${opt.bola ? `<g><path d="M58 -14 C64 -22 72 -22 76 -18 M58 -6 C66 -6 70 -2 72 2" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>
    <g fill="#fff" opacity=".9"><circle cx="62" cy="-10" r="6"/><circle cx="68" cy="-14" r="5"/><circle cx="66" cy="-5" r="4.5"/></g>
    <g transform="translate(86 -18)"><circle r="9" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M0 -3.8 L3.6 -1.2 L2.2 3.1 L-2.2 3.1 L-3.6 -1.2Z" fill="#111"/><path d="M0 -3.8 L0 -9 M3.6 -1.2 L8.6 -2.7 M2.2 3.1 L5.3 7.3 M-2.2 3.1 L-5.3 7.3 M-3.6 -1.2 L-8.6 -2.7" stroke="#111" stroke-width="1"/></g></g>` : ''}</g>`;
}
// ---------- diabo com tridente ----------
function DIABO2(opt = {}) {
  const u = 'di' + (UID++), R = '#e0261b', E = '#6d0d08';
  const L = (d, w) => `<path d="${d}" stroke="#111" stroke-width="${w + 3}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="url(#${u}g)" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<g><defs><linearGradient id="${u}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4a3a"/><stop offset=".55" stop-color="${R}"/><stop offset="1" stop-color="${E}"/></linearGradient></defs>
  ${L('M-12 18 C-36 22 -46 4 -38 -10 C-34 -16 -40 -22 -44 -20', 3.5)}<path d="M-44 -20 L-52 -24 L-44 -30 L-42 -22Z" fill="url(#${u}g)" stroke="#111" stroke-width="1.5"/>
  <line x1="24" y1="-50" x2="16" y2="56" stroke="#111" stroke-width="6" stroke-linecap="round"/><line x1="24" y1="-50" x2="16" y2="56" stroke="#2b2b2b" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M11 -46 C12 -56 14 -62 14 -70 L19 -58 C17 -54 17 -50 18 -46 M37 -44 C37 -54 36 -60 38 -68 L41 -55 C40 -51 39 -47 38 -44 M10 -46 C18 -42 30 -41 38 -44 M24 -44 L25 -74" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M25 -80 L21 -70 L29 -70Z M14 -74 L10 -64 L18 -66Z M38 -72 L35 -62 L43 -63Z" fill="#111"/>
  ${opt.bola ? `<g transform="translate(25 -88)"><circle r="7.5" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M0 -3.2 L3 -1 L1.9 2.6 L-1.9 2.6 L-3 -1Z" fill="#111"/></g>` : ''}
  ${L('M-6 26 C-8 38 -14 46 -18 54', 8)}${L('M6 26 C10 38 10 46 14 54', 8)}
  <path d="M-20 54 L-28 58 L-14 58Z M12 54 L22 58 L8 58Z" fill="#111"/>
  <path d="M-14 -20 C-20 -8 -16 14 -8 28 L10 28 C16 14 16 -8 10 -20 C4 -26 -8 -26 -14 -20Z" fill="url(#${u}g)" stroke="#111" stroke-width="2"/>
  <path d="M-4 -12 C-6 -2 -6 8 -2 16 M4 -4 C8 -2 10 4 8 10" fill="none" stroke="${E}" stroke-width="1.4" opacity=".8"/>
  ${L('M10 -16 C16 -10 20 -14 22 -24', 7)}${L('M10 -8 C16 2 20 6 20 10', 7)}
  ${L('M-12 -16 C-22 -12 -28 -4 -30 6', 7)}
  <path d="M-4 -46 C-14 -46 -18 -38 -16 -30 C-14 -24 -8 -20 -2 -20 C6 -20 10 -26 10 -32 C10 -40 4 -46 -4 -46Z" fill="url(#${u}g)" stroke="#111" stroke-width="2"/>
  <path d="M-12 -42 C-18 -50 -18 -58 -12 -64 C-12 -56 -8 -50 -6 -46Z M4 -44 C10 -52 12 -60 8 -66 C6 -58 2 -52 0 -46Z" fill="#1d1d1d" stroke="#111" stroke-width="1"/>
  <path d="M-16 -34 L-22 -38 L-17 -30Z M9 -34 L15 -38 L10 -30Z" fill="url(#${u}g)" stroke="#111" stroke-width="1.2"/>
  <path d="M-10 -36 L-6 -34 M4 -36 L0 -34" stroke="#111" stroke-width="1.8" stroke-linecap="round"/><circle cx="-8" cy="-32" r="1.6" fill="#fff59a"/><circle cx="2" cy="-32" r="1.6" fill="#fff59a"/>
  <path d="M-8 -26 Q-3 -22 2 -26" fill="none" stroke="#111" stroke-width="1.6" stroke-linecap="round"/><path d="M-5 -21 L-3 -16 L-1 -21Z" fill="#111"/></g>`;
}
// ---------- navio (galeão com velas cheias) ----------
function NAVIO2(opt = {}) {
  const u = 'na' + (UID++);
  if (opt.papel) return `<g><path d="M-34 4 L34 4 L22 22 L-22 22Z" fill="#fff" stroke="#111" stroke-width="2.2"/><path d="M-2 4 L-2 -34 L26 4Z" fill="#fff" stroke="#111" stroke-width="2.2"/><path d="M-6 4 L-6 -24 L-28 4Z" fill="#f1f1f1" stroke="#111" stroke-width="2.2"/>
    <path d="M-2 -34 L-2 4" stroke="#111" stroke-width="1"/><text x="0" y="17" text-anchor="middle" font-family="Barlow" font-weight="700" font-size="9" fill="#111">FdC</text>
    <path d="M-44 26 Q-34 20 -24 26 T-4 26 T16 26 T36 26 T50 26" fill="none" stroke="#2b6fae" stroke-width="2.5"/></g>`;
  const vela = (x, y, w, h) => `<path d="M${x} ${y} Q${x + w / 2} ${y - 4} ${x + w} ${y} Q${x + w + 5} ${y + h / 2} ${x + w} ${y + h} Q${x + w / 2} ${y + h + 3} ${x} ${y + h} Q${x + 5} ${y + h / 2} ${x} ${y}Z" fill="url(#${u}v)" stroke="#111" stroke-width="1.3"/>`;
  return `<g><defs><linearGradient id="${u}v" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9d4c4"/></linearGradient>
    <linearGradient id="${u}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b3a1e"/><stop offset="1" stop-color="#2b1a0b"/></linearGradient></defs>
  ${[-22, 0, 20].map((x, i) => `<line x1="${x}" y1="10" x2="${x}" y2="${-36 + i * 3 + (i === 1 ? -6 : 0)}" stroke="#111" stroke-width="2.2"/>`).join('')}
  <path d="M-22 -34 L-6 -14 M0 -42 L16 -20 M0 -42 L-16 -18 M20 -30 L34 -8" stroke="#111" stroke-width=".8"/>
  ${vela(-31, -28, 18, 12)}${vela(-30, -14, 16, 12)}${vela(-10, -36, 20, 13)}${vela(-9, -21, 18, 14)}${vela(12, -24, 16, 11)}${vela(13, -11, 14, 11)}
  <path d="M-22 -36 L-12 -38 L-22 -40Z M0 -48 L12 -50 L0 -52Z M20 -30 L28 -32 L20 -34Z" fill="#d33a2c"/>
  <path d="M-40 6 L-34 4 L40 4 C46 4 48 2 50 -2 L48 8 C44 18 36 24 24 24 L-26 24 C-34 22 -38 16 -40 6Z" fill="url(#${u}h)" stroke="#111" stroke-width="1.6"/>
  <path d="M-38 12 L46 12 M-34 18 L42 18" stroke="#c9a227" stroke-width="1.3"/>${[-26, -14, -2, 10, 22, 34].map(x => `<rect x="${x}" y="13.5" width="3" height="3" fill="#111"/>`).join('')}
  <path d="M-40 6 L-44 -6 L-30 -4 L-28 4Z" fill="url(#${u}h)" stroke="#111" stroke-width="1.3"/>
  <path d="M-48 28 Q-38 22 -28 28 T-8 28 T12 28 T32 28 T52 28" fill="none" stroke="#2b6fae" stroke-width="2.5"/></g>`;
}

// acabamento "a sério": relevo (luz especular), sombra, verniz e metais
function FX(u) {
  return `<defs>
  <filter id="${u}rel" x="-15%" y="-15%" width="130%" height="130%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="b"/>
    <feSpecularLighting in="b" surfaceScale="2.6" specularConstant=".75" specularExponent="28" lighting-color="#ffffff" result="s"><feDistantLight azimuth="235" elevation="50"/></feSpecularLighting>
    <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>
    <feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3=".32" k4="0" result="lit"/>
    <feDropShadow in="lit" dx="1.2" dy="1.8" stdDeviation="1" flood-color="#000" flood-opacity=".38"/></filter>
  <filter id="${u}som" x="-10%" y="-10%" width="125%" height="125%"><feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#000" flood-opacity=".35"/></filter>
  <filter id="${u}txt" x="-10%" y="-30%" width="120%" height="160%"><feDropShadow dx=".8" dy="1.2" stdDeviation=".5" flood-color="#000" flood-opacity=".45"/></filter>
  <linearGradient id="${u}ouro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b8"/><stop offset=".3" stop-color="#e8c25a"/><stop offset=".62" stop-color="#b8892a"/><stop offset=".82" stop-color="#e6c35e"/><stop offset="1" stop-color="#7a5a12"/></linearGradient>
  <linearGradient id="${u}prata" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#d8d8d8"/><stop offset=".7" stop-color="#9a9a9a"/><stop offset="1" stop-color="#e2e2e2"/></linearGradient>
  <linearGradient id="${u}verniz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset=".45" stop-color="#fff" stop-opacity=".08"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="${u}vinh" cx=".5" cy=".42" r=".7"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
  </defs>`;
}
// ---------- Liverpool ----------
// ---------- Chelsea ----------
function chelsea(nome, v) {
  const u = 'C' + (UID++), blue = '#0a4595';
  return `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">${FX(u)}<defs><path id="${u}t" d="M22 125 A78 78 0 0 1 178 125"/><path id="${u}b" d="M14 125 A86 86 0 0 0 186 125"/>
    <radialGradient id="${u}az" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#2a6fd6"/><stop offset=".6" stop-color="${blue}"/><stop offset="1" stop-color="#05265a"/></radialGradient>
    <radialGradient id="${u}fundo" cx=".45" cy=".35" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9e3d6"/></radialGradient><clipPath id="${u}c"><circle cx="100" cy="125" r="97"/></clipPath></defs>
  <g filter="url(#${u}som)">
    <circle cx="100" cy="125" r="97" fill="url(#${u}ouro)"/><circle cx="100" cy="125" r="92" fill="url(#${u}az)"/>
    <circle cx="100" cy="125" r="68" fill="url(#${u}ouro)"/><circle cx="100" cy="125" r="64" fill="url(#${u}fundo)"/>
    <g filter="url(#${u}rel)" transform="translate(104 116) scale(.78)">${LEAO2('#1d5fc0', '#062a63', `url(#${u}ouro)`, {interrogacao: v === 2, coroa: v === 2})}</g>
    <g filter="url(#${u}rel)">${[[64, 172], [136, 172]].map(([x, y]) => `<g transform="translate(${x} ${y})"><path d="M-7 4 L-13 9 L-6 9Z M7 4 L13 9 L6 9Z" fill="#2c7a3b"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-4.5" rx="4" ry="5" fill="#d33a2c" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="#8a1a12"/><circle r="1.4" fill="#e9b23a"/></g>`).join('')}
    ${[[84, 182], [116, 182]].map(([x, y]) => `<g transform="translate(${x} ${y})"><circle r="6.5" fill="#fff" stroke="#123" stroke-width="1.2"/><path d="M0 -2.8 L2.6 -.8 L1.6 2.4 L-1.6 2.4 L-2.6 -.8Z" fill="#123"/><path d="M0 -2.8 L0 -6.5 M2.6 -.8 L6.2 -2 M1.6 2.4 L3.8 5.3 M-1.6 2.4 L-3.8 5.3 M-2.6 -.8 L-6.2 -2" stroke="#123" stroke-width=".8"/></g>`).join('')}
    ${[-1, 1].map(k => `<path d="M${100 + k * 80} 125 l2.4 5 5.4 .8 -3.9 3.8 .9 5.4 -4.8 -2.5 -4.8 2.5 .9 -5.4 -3.9 -3.8 5.4 -.8z" fill="url(#${u}ouro)"/>`).join('')}</g>
    <g clip-path="url(#${u}c)"><path d="M0 20 L200 20 L200 110 Q100 92 0 120Z" fill="url(#${u}verniz)"/></g>
  </g>
  <g filter="url(#${u}txt)"><text font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="17" fill="#fff" letter-spacing="1.6" text-anchor="middle"><textPath href="#${u}t" startOffset="50%">${nome.toUpperCase()}</textPath></text>
  <text font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="13" fill="#fff" letter-spacing="1.6" text-anchor="middle"><textPath href="#${u}b" startOffset="50%">${v === 1 ? 'FOOTBALL CLUB' : 'FOOTBALL CLUBE DA BOLA'}</textPath></text></g></svg>`;
}
// ---------- Arsenal ----------
function arsenal(nome, v) {
  const u = 'A' + (UID++), red = '#db0007', navy = '#063672';
  const SH = 'M30 26 C60 14 140 14 170 26 C176 90 168 160 100 234 C32 160 24 90 30 26Z';
  return `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">${FX(u)}<defs><clipPath id="${u}c"><path d="${SH}"/></clipPath>
    <linearGradient id="${u}vm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff3a33"/><stop offset=".5" stop-color="${red}"/><stop offset="1" stop-color="#8a0004"/></linearGradient></defs>
  <g filter="url(#${u}som)">
    <g clip-path="url(#${u}c)"><rect width="200" height="250" fill="url(#${u}vm)"/><rect width="200" height="64" fill="#fbf8f0"/><rect y="62" width="200" height="5" fill="url(#${u}ouro)"/><rect width="200" height="250" fill="url(#${u}vinh)"/></g>
    <path d="${SH}" fill="none" stroke="${navy}" stroke-width="9"/><path d="${SH}" fill="none" stroke="url(#${u}ouro)" stroke-width="3" transform="translate(100 125) scale(.92) translate(-100 -125)"/>
    <g filter="url(#${u}rel)" transform="translate(${v === 1 ? 104 : 88} 128) scale(${v === 1 ? 1.05 : .9})">${CANHAO2({bola: v === 2})}</g>
    <g clip-path="url(#${u}c)"><path d="M0 0 L200 0 L200 110 Q100 90 0 120Z" fill="url(#${u}verniz)"/></g>
  </g>
  <g filter="url(#${u}txt)"><text x="100" y="54" text-anchor="middle" font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="${v === 1 ? 21 : 19}" fill="${red}" letter-spacing=".5">${nome.toUpperCase()}SENAL${v === 2 ? '!' : ''}</text>
  ${v === 2 ? '<text x="100" y="198" text-anchor="middle" font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="14" fill="#fff">PUM!</text>' : ''}</g></svg>`;
}
// ---------- Manchester United ----------

// ---------- ave nova: elegante, de perfil (virada para a direita), pescoço em S, asas em V ----------
function AVE3(cor, escuro, opt = {}) {
  const u = 'a3' + (UID++);
  const penaLonga = (bx, by, ang, L, w) => `<path d="${pena(bx, by, ang, L, w)}"/>` + (() => { const [x2, y2] = rot(0, L * .9, ang); return `<path d="M${bx} ${by} L${(bx + x2).toFixed(1)} ${(by + y2).toFixed(1)}" stroke="${escuro}" stroke-width=".8" opacity=".6" fill="none"/>`; })();
  let asaTras = '', asaFrente = '', cauda = '';
  for (let i = 0; i < 7; i++) asaTras += penaLonga(14, -14, Math.PI * (1.02 + i * .055), 34 + i * 3.5, 8.5);
  for (let i = 0; i < 8; i++) asaFrente += penaLonga(-2, -10, Math.PI * (.68 + i * .05), 36 + i * 3.8, 9.5);
  for (let i = 0; i < 5; i++) cauda += penaLonga(-18, 22, Math.PI * (.16 + i * .07), 22 + (i % 2) * 4, 6.5);
  return `<g><defs><linearGradient id="${u}g" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${cor}"/><stop offset="1" stop-color="${escuro}"/></linearGradient></defs>
  <g fill="url(#${u}g)" stroke="${escuro}" stroke-width="1.3" stroke-linejoin="round">
    <g opacity=".92">${asaTras}</g>
    ${cauda}
    <path d="M-24 26 C-20 12 -10 0 2 -6 C10 -10 18 -8 20 0 C22 10 14 22 2 28 C-8 32 -18 32 -24 26Z"/>
    ${asaFrente}
    <path d="M8 -4 C4 -16 6 -28 14 -38 C20 -46 30 -50 36 -48 C40 -46 40 -42 36 -40 C30 -38 26 -34 24 -28 C22 -20 22 -10 18 -2Z"/>
    <path d="M28 -49 C26 -56 30 -61 36 -60 C33 -58 33 -55 35 -52 C34 -56 37 -59 41 -58 C38 -55 38 -52 38 -49Z"/>
  </g>
  <path d="M8 -2 C12 6 12 14 8 22" fill="none" stroke="${escuro}" stroke-width=".9" opacity=".5"/>
  <path d="M36 -47 L54 -44.5 C56 -44 56 -42 54 -41.5 L36 -41Z" fill="${opt.bico || '#e9b23a'}" stroke="${escuro}" stroke-width="1.2"/>
  ${opt.oculos ? `<g><rect x="24" y="-50" width="10" height="7" rx="2.5" fill="#111"/><rect x="34.5" y="-49.5" width="7" height="6" rx="2" fill="#111"/><rect x="22" y="-48" width="20" height="1.6" fill="#111"/><rect x="26" y="-49" width="3" height="2" fill="#fff" opacity=".6"/></g>`
                : `<circle cx="31" cy="-46" r="2.6" fill="#fff" stroke="${escuro}" stroke-width=".8"/><circle cx="31.7" cy="-46" r="1.3" fill="#111"/>`}
  ${opt.bola ? `<g transform="translate(61 -40)"><circle r="7.5" fill="#fff" stroke="#111" stroke-width="1.4"/><path d="M0 -3.2 L3 -1 L1.9 2.6 L-1.9 2.6 L-3 -1Z" fill="#111"/><path d="M0 -3.2 L0 -7.5 M3 -1 L7.1 -2.3 M1.9 2.6 L4.3 6 M-1.9 2.6 L-4.3 6 M-3 -1 L-7.1 -2.3" stroke="#111" stroke-width=".9"/></g>`
             : `<g fill="#2f8f5b" stroke="#145232" stroke-width=".9"><path d="M53 -43 C58 -50 66 -50 70 -45 C64 -44 61 -40 63 -34 C58 -36 55 -40 53 -43Z"/><path d="M60 -47 C63 -54 70 -57 75 -54 C70 -51 67 -49 65 -45Z"/><path d="M59 -40 C63 -34 63 -28 59 -24 C57 -30 55 -34 55 -38Z"/></g>`}
  <g stroke="${opt.pernas || '#d9a12e'}" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M-4 30 L-6 48 M6 27 L8 46"/></g>
  <g fill="${opt.pernas || '#d9a12e'}" stroke="${escuro}" stroke-width=".9"><path d="M-6 47 L-16 51 L-10 51 L-6 49 L-2 52 L2 51Z"/><path d="M8 45 L0 50 L5 50 L8 48 L12 51 L16 50Z"/></g></g>`;
}
function liverpool(nome, v) {
  const u = 'L' + (UID++), red = '#c8102e', dk = '#5c0712';
  const SH = 'M30 70 L170 70 L170 150 C170 196 136 222 100 238 C64 222 30 196 30 150Z', IN = 'M40 80 L160 80 L160 148 C160 188 131 210 100 224 C69 210 40 188 40 148Z';
  return `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">${FX(u)}<defs><path id="${u}arc" d="M28 62 Q100 0 172 62"/><clipPath id="${u}c"><path d="${SH}"/></clipPath>
    <linearGradient id="${u}teal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fe0d4"/><stop offset=".5" stop-color="#00a398"/><stop offset="1" stop-color="#00635c"/></linearGradient>
    <linearGradient id="${u}vm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef2a3e"/><stop offset=".6" stop-color="${red}"/><stop offset="1" stop-color="#7a0919"/></linearGradient>
    <radialGradient id="${u}fundo" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ece2cc"/></radialGradient></defs>
  <g filter="url(#${u}som)">
    <g filter="url(#${u}rel)"><path d="M34 72 L34 46 Q100 -4 166 46 L166 72" fill="none" stroke="url(#${u}teal)" stroke-width="8"/>
    ${[50, 66, 82, 100, 118, 134, 150].map(x => { const y0 = 72 - 47 * Math.sin(Math.PI * (x - 34) / 132); return `<line x1="${x}" y1="${(y0 + 6).toFixed(1)}" x2="${x}" y2="72" stroke="#00897f" stroke-width="3.2"/><circle cx="${x}" cy="${(y0 + 5).toFixed(1)}" r="2.6" fill="url(#${u}ouro)"/>`; }).join('')}
    <path d="M40 60 L160 60" stroke="#00897f" stroke-width="2.4"/></g>
    <path d="${SH}" fill="url(#${u}vm)"/><path d="${SH}" fill="none" stroke="url(#${u}ouro)" stroke-width="4.5"/><path d="${SH}" fill="none" stroke="${dk}" stroke-width="1.3"/>
    <path d="${IN}" fill="url(#${u}fundo)" stroke="url(#${u}ouro)" stroke-width="2.2"/>
    <g filter="url(#${u}rel)" transform="translate(98 152) scale(1.0) rotate(-16)">${AVE3('#e1263b', '#7a0919', {oculos: v === 2, bola: v === 2})}</g>
    <path d="M16 196 L184 196 L175 210 L184 224 L16 224 L25 210Z" fill="url(#${u}ouro)" stroke="${dk}" stroke-width="2.4"/>
    <g clip-path="url(#${u}c)"><path d="M0 60 L200 60 L200 140 Q100 120 0 150Z" fill="url(#${u}verniz)"/></g>
  </g>
  <text font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="${v === 1 ? 9.5 : 8.6}" fill="#123b38" text-anchor="middle"><textPath href="#${u}arc" startOffset="50%">${v === 1 ? "YOU'LL NEVER WALK ALONE" : 'NUNCA RESPONDERÁS SOZINHO'}</textPath></text>
  <text x="100" y="215.5" text-anchor="middle" font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="${v === 1 ? 13 : 12}" fill="#3a0a10">${v === 1 ? `${nome.toUpperCase()}POOL F.C.` : `${nome.toUpperCase()} F.C. · EST. 2026`}</text></svg>`;
}
// ---------- navio dourado (silhueta de galeão) ----------
function NAVIO3(ouro, escuro, opt = {}) {
  if (opt.papel) return `<g><path d="M-34 4 L34 4 L22 22 L-22 22Z" fill="#fff" stroke="#111" stroke-width="2.2"/><path d="M-2 4 L-2 -34 L26 4Z" fill="#fff" stroke="#111" stroke-width="2.2"/><path d="M-6 4 L-6 -24 L-28 4Z" fill="#f1f1f1" stroke="#111" stroke-width="2.2"/><text x="0" y="17" text-anchor="middle" font-family="Barlow" font-weight="700" font-size="9" fill="#111">FdC</text></g>`;
  const vela = (x, y, w, h) => `<path d="M${x} ${y} Q${x + w / 2} ${y - 4} ${x + w} ${y} Q${x + w + 5} ${y + h / 2} ${x + w} ${y + h} Q${x + w / 2} ${y + h + 3} ${x} ${y + h} Q${x + 5} ${y + h / 2} ${x} ${y}Z"/>`;
  return `<g fill="${ouro}" stroke="${escuro}" stroke-width="1.3" stroke-linejoin="round">
  ${[-22, 0, 20].map((x, i) => `<rect x="${x - 1.4}" y="${-40 + i * 3 + (i === 1 ? -6 : 0)}" width="2.8" height="${50 - i * 3 + (i === 1 ? 6 : 0)}"/>`).join('')}
  ${vela(-31, -28, 18, 12)}${vela(-30, -14, 16, 12)}${vela(-10, -36, 20, 13)}${vela(-9, -21, 18, 14)}${vela(12, -24, 16, 11)}${vela(13, -11, 14, 11)}
  <path d="M-22 -40 L-12 -42 L-22 -44Z M0 -52 L12 -54 L0 -56Z M20 -34 L28 -36 L20 -38Z"/>
  <path d="M-40 6 L-34 4 L40 4 C46 4 48 2 50 -2 L48 8 C44 18 36 24 24 24 L-26 24 C-34 22 -38 16 -40 6Z"/>
  <path d="M-40 6 L-44 -6 L-30 -4 L-28 4Z"/>
  <path d="M-36 12 L44 12 M-32 18 L40 18" fill="none" stroke="${escuro}" stroke-width="1.1"/></g>`;
}
// ---------- diabo maior, de pé, com tridente (estilo clássico) ----------
function united(nome, v) {
  const u = 'U' + (UID++), red = '#da291c';
  const SHI = 'M58 66 L142 66 L142 146 C142 172 124 188 100 198 C76 188 58 172 58 146Z';
  return `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">${FX(u)}<defs><path id="${u}t" d="M26 125 A74 74 0 0 1 174 125"/><path id="${u}b" d="M17 125 A83 83 0 0 0 183 125"/>
    <clipPath id="${u}s"><path d="${SHI}"/></clipPath><clipPath id="${u}c"><circle cx="100" cy="125" r="97"/></clipPath>
    <radialGradient id="${u}vm" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#ff4b3a"/><stop offset=".6" stop-color="${red}"/><stop offset="1" stop-color="#7d0f08"/></radialGradient>
    <linearGradient id="${u}am" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff7a8"/><stop offset=".45" stop-color="#fbe122"/><stop offset="1" stop-color="#d1a800"/></linearGradient></defs>
  <g filter="url(#${u}som)">
    <circle cx="100" cy="125" r="97" fill="#111"/><circle cx="100" cy="125" r="94" fill="url(#${u}vm)"/>
    <circle cx="100" cy="125" r="88" fill="url(#${u}am)" stroke="#111" stroke-width="2.5"/><circle cx="100" cy="125" r="64" fill="url(#${u}vm)" stroke="#111" stroke-width="2.5"/>
    <g filter="url(#${u}rel)">${[-1, 1].map(k => `<path d="M${100 + k * 40} 117 L${100 + k * 72} 112 L${100 + k * 82} 112 L${100 + k * 76} 121 L${100 + k * 82} 130 L${100 + k * 72} 130 L${100 + k * 40} 133Z" fill="url(#${u}am)" stroke="#111" stroke-width="2" stroke-linejoin="round"/><path d="M${100 + k * 72} 112 L${100 + k * 72} 130" stroke="#111" stroke-width="1.4"/>`).join('')}</g>
    <g clip-path="url(#${u}s)"><rect x="50" y="60" width="100" height="56" fill="url(#${u}vm)"/><rect x="50" y="114" width="100" height="90" fill="url(#${u}am)"/></g>
    <path d="${SHI}" fill="none" stroke="#111" stroke-width="3"/><line x1="58" y1="115" x2="142" y2="115" stroke="#111" stroke-width="2.5"/>
    <g filter="url(#${u}rel)" transform="translate(100 96) scale(.62)">${NAVIO3(v === 1 ? `url(#${u}ouro)` : '#fff', '#3a2a05', {papel: v === 2})}</g>
    <g filter="url(#${u}rel)" transform="translate(97 158) scale(.6)">${DIABO2({bola: v === 2})}</g>
    <g clip-path="url(#${u}c)"><path d="M0 20 L200 20 L200 110 Q100 92 0 120Z" fill="url(#${u}verniz)"/></g>
  </g>
  <text font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="${v === 1 ? 15 : 12.5}" fill="#111" letter-spacing="1.6" text-anchor="middle"><textPath href="#${u}t" startOffset="50%">${nome.toUpperCase().replace(/S$/, '')}${v === 1 ? 'STER' : 'STER DA BOLA'}</textPath></text>
  <text font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="15" fill="#111" letter-spacing="2.4" text-anchor="middle"><textPath href="#${u}b" startOffset="50%">UNITED</textPath></text></svg>`;
}

// ---------- raposa de frente (Leicester) ----------
function RAPOSA(opt = {}) {
  const u = 'rp' + (UID++), dk = '#5a2408';
  return `<g><defs><linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7a04a"/><stop offset=".55" stop-color="#e2711f"/><stop offset="1" stop-color="#a84a12"/></linearGradient></defs>
  <g stroke="${dk}" stroke-width="1.8" stroke-linejoin="round">
    <path d="M-30 -26 L-22 -60 L-4 -34Z M30 -26 L22 -60 L4 -34Z" fill="url(#${u}g)"/>
    <path d="M-25 -32 L-21 -50 L-11 -35Z M25 -32 L21 -50 L11 -35Z" fill="#3a1606" stroke="none"/>
    <path d="M-32 -28 C-38 -8 -30 8 -16 18 L0 36 L16 18 C30 8 38 -8 32 -28 C20 -38 -20 -38 -32 -28Z" fill="url(#${u}g)"/>
    <path d="M-30 -4 C-20 6 -10 16 0 34 C10 16 20 6 30 -4 C18 4 8 6 0 6 C-8 6 -18 4 -30 -4Z" fill="#fffaf0"/>
    <path d="M-36 -10 L-44 -2 L-34 -2 L-40 6 L-30 2Z M36 -10 L44 -2 L34 -2 L40 6 L30 2Z" fill="#fffaf0"/>
  </g>
  <path d="M-6 -24 L0 -4 L6 -24" fill="none" stroke="${dk}" stroke-width="1" opacity=".5"/>
  ${opt.pisca ? `<path d="M-18 -12 Q-11 -7 -4 -12" fill="none" stroke="#1a0b03" stroke-width="2.6" stroke-linecap="round"/>`
              : `<path d="M-18 -12 Q-11 -18 -4 -12 Q-11 -8 -18 -12Z" fill="#1a0b03"/><circle cx="-9" cy="-13" r="1.2" fill="#fff"/>`}
  <path d="M18 -12 Q11 -18 4 -12 Q11 -8 18 -12Z" fill="#1a0b03"/><circle cx="12" cy="-13" r="1.2" fill="#fff"/>
  <ellipse cx="0" cy="27" rx="5.5" ry="4" fill="#1a0b03"/><ellipse cx="-1.5" cy="25.8" rx="1.6" ry="1" fill="#fff" opacity=".7"/>
  ${opt.lingua ? `<path d="M-3 32 C-4 40 4 40 3 32Z" fill="#e8577a" stroke="#7a1f33" stroke-width="1"/>` : ''}</g>`;
}
function leicester(nome, v) {
  const u = 'Le' + (UID++), azul = '#0a3d9e';
  const SH = 'M100 12 C130 12 160 18 176 30 L176 116 C176 176 140 212 100 234 C60 212 24 176 24 116 L24 30 C40 18 70 12 100 12Z';
  const petala = a => { const x = Math.cos(a) * 30, y = Math.sin(a) * 30; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="21"/>`; };
  return `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">${FX(u)}<defs><clipPath id="${u}c"><path d="${SH}"/></clipPath>
    <radialGradient id="${u}az" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#2f6be0"/><stop offset=".6" stop-color="${azul}"/><stop offset="1" stop-color="#041d52"/></radialGradient></defs>
  <g filter="url(#${u}som)">
    <path d="${SH}" fill="url(#${u}az)"/><path d="${SH}" fill="none" stroke="url(#${u}ouro)" stroke-width="6"/><path d="${SH}" fill="none" stroke="#041d52" stroke-width="1.5"/>
    <g filter="url(#${u}rel)" transform="translate(100 112)"><g fill="#fffaf0" stroke="url(#${u}ouro)" stroke-width="2.5">${[0, 1, 2, 3, 4].map(i => petala(-Math.PI / 2 + i * 2 * Math.PI / 5)).join('')}</g>
      <circle r="24" fill="#fffaf0"/></g>
    <g filter="url(#${u}rel)" transform="translate(100 114) scale(.95)">${RAPOSA({pisca: v === 2, lingua: v === 2})}</g>
    <path d="M14 176 L186 176 L177 190 L186 204 L14 204 L23 190Z" fill="url(#${u}ouro)" stroke="#041d52" stroke-width="2.4"/>
    ${v === 2 ? `<g transform="rotate(-14 154 42)"><rect x="128" y="32" width="54" height="20" rx="4" fill="#fffaf0" stroke="#041d52" stroke-width="2"/><text x="155" y="47" text-anchor="middle" font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="13" fill="#c8102e">5000-1</text></g>` : ''}
    <g clip-path="url(#${u}c)"><path d="M0 0 L200 0 L200 100 Q100 84 0 112Z" fill="url(#${u}verniz)"/></g>
  </g>
  <text x="100" y="195.5" text-anchor="middle" font-family="Alfa Slab One, Rockwell, Georgia, serif" font-weight="700" font-size="${v === 1 ? 13 : 12.5}" fill="#041d52">${nome.toUpperCase()}CESTER CITY</text></svg>`;
}
const CLUBE_DE = {Bruno: liverpool, Freitas: chelsea, CC: arsenal, Viegas: united, Manel: leicester};
function generico(nome) {
  const ini = String(nome || '?').slice(0, 2).toUpperCase();
  return `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="125" r="94" fill="#1e5a37" stroke="#1d2b22" stroke-width="6"/><text x="100" y="152" text-anchor="middle" font-family="${'Alfa Slab One, Georgia, serif'}" font-weight="700" font-size="80" fill="#f3ead6">${ini}</text></svg>`;
}
const VERSAO = 2;   // avacalhado para todos
window.emblemaSVG = (nome, v) => { const f = CLUBE_DE[nome]; return f ? f(nome, v || VERSAO) : generico(nome); };
const cache = {};
window.emblemaURL = (nome, v) => { v = v || VERSAO; const k = nome + '|' + v; return cache[k] || (cache[k] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(emblemaSVG(nome, v))); };
// PNGs feitos por scripts/emblemas_png.py (o SVG com efeitos fica desfocado em tamanho pequeno no iPhone):
// -p = mini (sem letras nem efeitos) para listas; -g = completo para tamanhos grandes
const PNG = {Bruno:'bruno', Freitas:'freitas', CC:'cc', Viegas:'viegas', Manel:'manel'};
window.emblemaPNG = (nome, grande) => PNG[nome] ? `icones/emblemas/${PNG[nome]}-${grande ? 'g' : 'p'}.png?v=${typeof APP_VER !== 'undefined' ? APP_VER : ''}` : emblemaURL(nome);
window.emb = (nome, px = 22, cls = '') => `<img class="emb ${cls}" src="${emblemaPNG(nome, px > 32)}" width="${px}" height="${Math.round(px * 1.25)}" alt="" decoding="async">`;
})();
