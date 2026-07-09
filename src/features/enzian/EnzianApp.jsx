import React, { useState, useRef, useEffect } from 'react';

const PAL = {
  uterus: '#dfa1b1', ovary: '#dca7ad', bladder: '#eecb8c', ureter: '#edbe34',
  ligament: '#bb7682', rectum: '#d27c58', sigma: '#d6835f', vagina: '#d79cab',
  bone: '#e9dfc8', lesion: '#8e2c3b', endo: '#5b3026', adh: '#daccb6', nerve: '#dcc24e', levator: '#a86058', hydro: '#e9c5cb',
};
const TEAL = '#1a7f7f', TEAL_D = '#136363';

const PANEL = [
  { key: 'P', label: 'Peritoneo', type: 'grade' },
  { key: 'O', label: 'Ovario (endometrioma)', type: 'gradeLR' },
  { key: 'T', label: 'Condición tubo-ovárica', type: 'gradeLR' },
  { key: 'A', label: 'Retrocervical/tabique rectovaginal', type: 'grade' },
  { key: 'B', label: 'Lig. uterosacro / parametrio', type: 'gradeLR' },
  { key: 'C', label: 'Recto / rectosigmoides', type: 'grade' },
  { key: 'FA', label: 'Adenomiosis', type: 'toggle' },
  { key: 'FB', label: 'Vejiga', type: 'toggle' },
  { key: 'FU', label: 'Uréter', type: 'toggleLR' },
  { key: 'FI', label: 'Intestino (sobre rectosigmoides)', type: 'toggle' },
  { key: 'FO', label: 'Otra localización', type: 'toggleText' },
];
const TOGGLES = new Set(['FA', 'FB', 'FI', 'FU_l', 'FU_r']);
const DIE_R = { 1: 0.4, 2: 1.0, 3: 2.0 };
const ENDO_R = { 1: 1.0, 2: 2.5, 3: 4.0 };

const PERI_SITES = [
  [0, -1.5, -2.6], [4.2, 0.5, -1.2], [-4.2, 0.5, -1.2], [0, 0.6, 2.4],
  [3.4, 2.2, -1.6], [-3.4, 2.2, -1.6], [1.4, -1.8, -2.6], [-1.4, -1.8, -2.6], [0.8, 2.8, 1.2],
  [2.6, -0.6, 2.0], [-2.6, -0.6, 2.0], [1.8, 0.5, -3.0], [-1.8, 0.5, -3.0],
  [3.0, 4.0, -1.0], [-3.0, 4.0, -1.0], [0, 4.6, 1.0],
];
const PERI_N = [0, 4, 9, 16];
const FA_FOCI = [
  [1.6, 2.4, 0.6], [-1.5, 2.0, 0.5], [0.6, 2.8, 1.7], [-0.7, 3.2, 1.4],
  [1.5, 1.8, -1.0], [-1.6, 2.6, -0.9], [0.5, 1.4, -1.6], [-0.4, 3.0, -1.4], [0.3, 2.2, -1.7],
  [1.9, 2.4, -0.2], [-1.9, 2.0, 0.1], [0.5, 3.9, 0.2], [-0.6, 3.7, -0.3], [0.4, 0.9, -0.3], [-0.5, 1.1, 0.4],
];

const LABELS = [
  { t: 'Útero', p: [0, 3.4, 1.6] }, { t: 'Ovario der.', p: [5.7, 3.0, 0] }, { t: 'Ovario izq.', p: [-5.7, 3.0, 0] },
  { t: 'Trompa der.', p: [3.7, 4.6, 0.2] }, { t: 'Trompa izq.', p: [-3.7, 4.6, 0.2] }, { t: 'Vejiga', p: [0, -1.0, 5.4] },
  { t: 'Uréter der.', p: [3.1, 5.6, -1.0] }, { t: 'Uréter izq.', p: [-3.1, 5.6, -1.0] }, { t: 'Recto', p: [0, -1.6, -4.6] },
  { t: 'Lig. uterosacro der.', p: [2.7, -0.6, -4.2] }, { t: 'Lig. uterosacro izq.', p: [-2.7, -0.6, -4.2] },
  { t: 'Vagina', p: [0, -6.6, 1.6] }, { t: 'Intestino', p: [-2.8, 6.7, -2.3] },
];
const BONE_LABELS = [{ t: 'Sacro', p: [0, 1.5, -5.6] }, { t: 'Pubis', p: [0, -3.4, 4.6] }];
const VIEWS = { frontal: [0, 0], posterior: [Math.PI, 0], izq: [Math.PI / 2, 0], der: [-Math.PI / 2, 0], superior: [0, 1.3] };

const toRGB = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mixTo = (rgb, t, tg) => rgb.map((v, i) => Math.round(v + (tg[i] - v) * t));
const dshade = (rgb, df) => rgb.map((v) => Math.min(255, Math.round(v * df)));
const css = (rgb, a) => (a == null || a >= 1 ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`);
const WARM = [255, 249, 240], COOL = [44, 30, 38], DARK = [30, 20, 28];

function ellSamples(c, a) {
  const pts = [[c[0], c[1] + a[1], c[2]], [c[0], c[1] - a[1], c[2]]];
  const lat = 5, lon = 9;
  for (let i = 1; i < lat; i++) {
    const th = (Math.PI * i) / lat, sy = Math.cos(th), sr = Math.sin(th);
    for (let j = 0; j < lon; j++) { const ph = (2 * Math.PI * j) / lon; pts.push([c[0] + a[0] * sr * Math.cos(ph), c[1] + a[1] * sy, c[2] + a[2] * sr * Math.sin(ph)]); }
  }
  return pts;
}

function buildStatic() {
  const parts = [];
  const ell = (c, a, color, code = null, opacity = 1, extra = {}) => parts.push({ kind: 'ell', c, samp: ellSamples(c, a), rgb: toRGB(color), code, opacity, ...extra });
  const tube = (pts, r, color, code = null, opacity = 1, faint = false, extra = {}) => parts.push({ kind: 'tube', pts, r, rgb: toRGB(color), code, opacity, faint, ...extra });

  // ---- pelvis ósea (transparente, conmutable) ----
  const boneEll = (groups, opacity) => {
    let samp = [], cx = 0, cy = 0, cz = 0;
    groups.forEach(([c, a]) => { samp = samp.concat(ellSamples(c, a)); cx += c[0]; cy += c[1]; cz += c[2]; });
    parts.push({ kind: 'ell', c: [cx / groups.length, cy / groups.length, cz / groups.length], samp, rgb: toRGB(PAL.bone), code: null, opacity, flat: true, bone: true });
  };
  boneEll([[[0, 5.0, -5.5], [1.7, 1.0, 0.9]], [[0, 3.2, -5.8], [1.6, 1.1, 0.9]], [[0, 1.4, -5.8], [1.4, 1.1, 0.9]], [[0, -0.4, -5.5], [1.2, 1.0, 0.9]], [[0, -2.0, -5.0], [0.9, 0.9, 0.9]], [[0, -3.2, -4.4], [0.6, 0.8, 0.8]]], 0.3); // sacro
  tube([[-4.0, -5.0, 1.0], [-2.2, -4.0, 3.2], [0, -3.6, 4.2], [2.2, -4.0, 3.2], [4.0, -5.0, 1.0]], 0.7, PAL.bone, null, 0.55, true, { bone: true }); // arco púbico
  tube([[0, 5.0, -4.8], [5.5, 2.5, -2.5], [4.2, -1.0, 1.6], [0, -3.4, 4.0], [-4.2, -1.0, 1.6], [-5.5, 2.5, -2.5], [0, 5.0, -4.8]], 0.45, PAL.bone, null, 0.5, true, { bone: true }); // estrecho pélvico
  // agujeros obturadores (anillo óseo; el centro vacío es el agujero)
  [1, -1].forEach((s) => tube([[s * 1.8, -2.6, 3.0], [s * 3.4, -2.3, 1.8], [s * 4.4, -3.2, 1.0], [s * 4.0, -4.4, 1.2], [s * 2.6, -4.7, 2.4], [s * 1.6, -3.6, 3.1], [s * 1.8, -2.6, 3.0]], 0.4, PAL.bone, null, 0.5, true, { bone: true }));

  // recto -> unión rectosigmoidea
  tube([[-1.2, 4.6, -3.3], [-0.5, 2.8, -3.6], [0.1, 0.8, -3.9], [0.15, -1.2, -3.8], [0.1, -3.2, -3.4], [0.0, -5.2, -2.8]], 1.45, PAL.rectum, 'C');
  [[-0.6, 3.6, -3.6], [-1.3, 4.6, -3.3], [-2.0, 5.4, -2.9], [-2.3, 6.2, -2.6], [-1.6, 6.8, -2.5], [-0.6, 6.85, -2.7], [0.2, 6.4, -3.0]].forEach((c, i) => { const r = i % 2 ? 1.2 : 1.45; parts.push({ kind: 'ell', c, samp: ellSamples(c, [r, r * 0.95, r]), rgb: toRGB(PAL.sigma), code: 'FI', opacity: 1 }); });
  tube([[1.3, -1.8, -1.4], [1.8, -1.2, -2.6], [2.3, -0.7, -3.8], [2.7, -0.4, -5.0]], 0.5, PAL.ligament, 'B_r');
  tube([[-1.3, -1.8, -1.4], [-1.8, -1.2, -2.6], [-2.3, -0.7, -3.8], [-2.7, -0.4, -5.0]], 0.5, PAL.ligament, 'B_l');
  tube([[3.4, 6.2, -1.6], [3.7, 4.2, -1.2], [3.4, 2.0, -0.4], [2.6, 0.0, 0.8], [1.7, -1.4, 2.0], [1.3, -2.4, 2.6]], 0.28, PAL.ureter, 'FU_r');
  tube([[-3.4, 6.2, -1.6], [-3.7, 4.2, -1.2], [-3.4, 2.0, -0.4], [-2.6, 0.0, 0.8], [-1.7, -1.4, 2.0], [-1.3, -2.4, 2.6]], 0.28, PAL.ureter, 'FU_l');
  tube([[1.8, 4.6, 0.1], [2.8, 4.9, -0.2], [3.7, 4.6, -0.6], [4.4, 3.9, -0.9]], 0.26, PAL.ovary, 'T_r');
  tube([[-1.8, 4.6, 0.1], [-2.8, 4.9, -0.2], [-3.7, 4.6, -0.6], [-4.4, 3.9, -0.9]], 0.26, PAL.ovary, 'T_l');

  ell([5.0, 3.0, -1.0], [1.05, 1.55, 0.88], PAL.ovary, 'O_r', 1, { mottle: [[5.35, 3.5, -0.55], [4.7, 2.5, -0.6], [5.2, 2.7, -0.85], [4.85, 3.5, -0.8]], vessels: [[[5.6, 2.2, -0.7], [5.2, 3.2, -0.5], [4.7, 3.8, -0.8]]] });
  ell([-5.0, 3.0, -1.0], [1.05, 1.55, 0.88], PAL.ovary, 'O_l', 1, { mottle: [[-5.35, 3.5, -0.55], [-4.7, 2.5, -0.6], [-5.2, 2.7, -0.85], [-4.85, 3.5, -0.8]], vessels: [[[-5.6, 2.2, -0.7], [-5.2, 3.2, -0.5], [-4.7, 3.8, -0.8]]] });
  // útero: se construye dinámicamente en buildUterus(fa) para volverse globuloso con adenomiosis
  tube([[0, -1.9, -0.1], [0, -4.0, 0.4], [0, -6.2, 1.0], [0, -8.0, 1.4]], 1.25, PAL.vagina);
  parts.push({ kind: 'ell', c: [0, -1.0, 4.0], samp: ellSamples([0, -1.5, 4.0], [2.55, 1.7, 2.05]).concat(ellSamples([0, -0.1, 3.95], [1.95, 1.45, 1.6])), rgb: toRGB(PAL.bladder), code: 'FB', opacity: 0.92, mottle: [[1.2, -0.5, 5.5], [-1.0, -1.6, 5.3]] });

  // ---- músculo elevador del ano (embudo cóncavo del piso pélvico, conmutable) ----
  ell([0, -2.6, 0.2], [3.6, 0.5, 3.8], PAL.levator, null, 0.4, { flat: true, levator: true });
  ell([0, -3.0, 0.0], [2.6, 0.5, 2.8], PAL.levator, null, 0.4, { flat: true, levator: true });
  ell([0, -3.4, -0.2], [1.6, 0.45, 1.8], PAL.levator, null, 0.42, { flat: true, levator: true });

  // ---- nervios autónomos pélvicos (líneas finas, conmutables) ----
  const nrv = (pts, r = 0.07) => tube(pts, r, PAL.nerve, null, 0.95, false, { nerve: true });
  // Plexo hipogástrico superior (presacro, línea media) — malla fina
  nrv([[0, 6.3, -2.7], [0, 5.4, -3.0], [0, 4.5, -3.4], [0, 3.7, -3.7]], 0.09);
  nrv([[0.18, 6.1, -2.75], [0.16, 5.2, -3.05], [0.14, 4.4, -3.4]], 0.05);
  nrv([[-0.18, 6.1, -2.75], [-0.16, 5.2, -3.05], [-0.14, 4.4, -3.4]], 0.05);
  nrv([[-0.18, 5.6, -2.95], [0.18, 5.3, -3.0]], 0.045);
  nrv([[-0.16, 4.7, -3.25], [0.16, 4.4, -3.35]], 0.045);
  [1, -1].forEach((s) => {
    // Nervio hipogástrico (del plexo superior al inferior, lateral al recto)
    nrv([[s * 0.2, 3.9, -3.6], [s * 0.9, 2.7, -3.6], [s * 1.5, 1.4, -3.3], [s * 2.0, 0.1, -2.9]], 0.08);
    // Plexo hipogástrico inferior (placa parasagital lateral al recto — malla fina)
    nrv([[s * 2.0, 0.1, -2.9], [s * 2.0, -1.0, -2.85], [s * 2.0, -1.9, -2.7]], 0.06);
    nrv([[s * 2.25, -0.2, -1.95], [s * 2.25, -1.1, -1.9], [s * 2.25, -2.0, -1.8]], 0.06);
    nrv([[s * 2.0, 0.1, -2.9], [s * 2.25, -0.2, -1.95]], 0.05);
    nrv([[s * 2.0, -1.9, -2.7], [s * 2.25, -2.0, -1.8]], 0.05);
    nrv([[s * 2.0, -0.5, -2.85], [s * 2.25, -0.7, -1.9]], 0.04);
    nrv([[s * 2.12, 0.0, -2.45], [s * 2.12, -1.95, -2.3]], 0.04);
    // Rama eferente anterior (hacia vejiga / vagina)
    nrv([[s * 2.25, -1.5, -1.85], [s * 1.9, -1.8, -0.7], [s * 1.4, -1.9, 0.4]], 0.05);
    // Nervios esplácnicos pélvicos (nervi erigentes S2–S4: del foramen sacro al plexo inferior)
    nrv([[s * 0.95, 1.7, -4.7], [s * 1.5, 1.0, -3.5], [s * 2.0, 0.2, -2.95]], 0.055);
    nrv([[s * 0.95, 0.3, -4.75], [s * 1.5, -0.3, -3.5], [s * 2.05, -0.8, -2.8]], 0.055);
    nrv([[s * 0.9, -1.1, -4.65], [s * 1.5, -1.5, -3.4], [s * 2.0, -1.75, -2.7]], 0.055);
  });
  return parts;
}

function buildUterus(fa) {
  const samp = fa
    ? ellSamples([0, 2.2, 0.15], [2.7, 2.7, 2.25])
        .concat(ellSamples([0, 3.4, 0.3], [2.3, 1.95, 1.95]))
        .concat(ellSamples([0, 0.3, -0.3], [1.6, 1.5, 1.3]))
        .concat(ellSamples([0, -1.0, -0.7], [1.1, 1.2, 0.95]))
    : ellSamples([0, 3.9, 0.4], [2.05, 1.6, 1.5])
        .concat(ellSamples([0, 2.6, 0.25], [2.05, 1.55, 1.4]))
        .concat(ellSamples([0, 1.2, 0.0], [1.75, 1.4, 1.25]))
        .concat(ellSamples([0, 0.0, -0.35], [1.25, 1.15, 1.0]))
        .concat(ellSamples([0, -1.1, -0.75], [1.0, 1.15, 0.92]));
  return {
    kind: 'ell', c: [0, 1.8, 0], samp,
    rgb: toRGB(PAL.uterus), code: 'FA', opacity: 1,
    mottle: [[0.8, 3.4, 1.1], [-0.7, 2.8, 1.05], [0.3, 4.2, 0.85]],
    vessels: [[[1.7, 2.2, 0.5], [1.0, 3.4, 1.05], [0.3, 4.4, 0.9]], [[-1.6, 2.4, 0.55], [-0.85, 3.5, 1.05], [0.0, 4.5, 0.85]], [[0.2, 1.0, 0.95], [0.4, 2.6, 1.2], [0.15, 3.9, 1.0]]],
  };
}

function buildLesions(v) {
  const L = [];
  const disc = (c, r, color, code, opacity = 1, endo = false, spic = false, oval = null) => L.push({ kind: 'disc', c, r, rgb: toRGB(color), code, opacity, endo, spic, oval });
  const tube = (pts, r, color, code, opacity, faint) => L.push({ kind: 'tube', pts, r, rgb: toRGB(color), code, opacity, faint });

  const pg = v.P || 0;
  if (pg) PERI_SITES.slice(0, PERI_N[pg]).forEach((s) => disc(s, 0.22, PAL.lesion, 'P', 1, false, true, [1.1, 0.85]));
  [['O_r', [5.0, 3.0, -1.0]], ['O_l', [-5.0, 3.0, -1.0]]].forEach(([code, c]) => { const grd = v[code] || 0; if (grd) disc(c, ENDO_R[grd], PAL.endo, code, 0.84, true); });
  const adhFan = (from, to) => { for (let i = 0; i < 3; i++) { const t = (i - 1) * 0.9; const mid = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + t, (from[2] + to[2]) / 2 + t * 0.5]; tube([from, mid, to], 0.17, PAL.adh, null, 0.82, false); } };
  [['T_r', 1], ['T_l', -1]].forEach(([code, s]) => {
    const grd = v[code] || 0;
    if (!grd) return;
    adhFan([s * 5.0, 3.0, -1.0], [s * 6.4, 2.0, -1.5]);
    if (grd >= 2) adhFan([s * 5.0, 3.0, -1.0], [s * 2.0, 4.4, 0]);
    if (grd >= 3) adhFan([s * 4.6, 2.4, -1.4], [s * 2.3, -0.6, -3.6]);
    // hidrosalpinx (trompa dilatada por líquido), adicional a las adherencias
    if (grd === 2) tube([[s * 2.7, 4.85, -0.25], [s * 3.5, 4.6, -0.55], [s * 4.2, 4.05, -0.85]], 0.5, PAL.hydro, code, 0.68, false);
    if (grd >= 3) tube([[s * 2.5, 4.9, -0.15], [s * 3.4, 4.7, -0.5], [s * 4.1, 4.15, -0.8], [s * 4.6, 3.4, -0.7], [s * 4.2, 2.8, -0.45]], 0.85, PAL.hydro, code, 0.68, false);
  });
  const die = (code, c) => { const grd = v[code] || 0; if (!grd) return; disc(c, DIE_R[grd], PAL.lesion, code, 1, false, true, [1.4, 0.8]); };
  die('A', [0, -0.7, -1.7]); die('B_r', [2.1, -1.35, -2.05]); die('B_l', [-2.1, -1.35, -2.05]); die('C', [0, -1.1, -2.3]);
  if (v.FB) disc([0, 0.6, 2.4], 0.9, PAL.lesion, 'FB', 1, false, true, [1.4, 0.8]);
  if (v.FI) disc([-2.2, 6.1, -2.0], 0.9, PAL.lesion, 'FI', 1, false, true, [1.4, 0.8]);
  if (v.FU_r) disc([1.7, -1.4, 2.0], 0.45, PAL.lesion, 'FU_r', 1, false, true, [1.3, 0.8]);
  if (v.FU_l) disc([-1.7, -1.4, 2.0], 0.45, PAL.lesion, 'FU_l', 1, false, true, [1.3, 0.8]);
  if (v.FA) FA_FOCI.forEach((c) => disc(c, 0.3, PAL.lesion, 'FA'));
  return L;
}

function hull(points) {
  const pts = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
  if (pts.length < 3) return pts;
  const cr = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lo = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  const up = [];
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  lo.pop(); up.pop();
  return lo.concat(up);
}
function smoothClosed(ctx, p) {
  const n = p.length;
  if (n < 3) { ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y))); ctx.closePath(); return; }
  ctx.beginPath();
  ctx.moveTo((p[n - 1].x + p[0].x) / 2, (p[n - 1].y + p[0].y) / 2);
  for (let i = 0; i < n; i++) { const c = p[i], nx = p[(i + 1) % n]; ctx.quadraticCurveTo(c.x, c.y, (c.x + nx.x) / 2, (c.y + nx.y) / 2); }
  ctx.closePath();
}
function pathOpen(ctx, p) {
  ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y);
  for (let i = 1; i < p.length - 1; i++) ctx.quadraticCurveTo(p[i].x, p[i].y, (p[i].x + p[i + 1].x) / 2, (p[i].y + p[i + 1].y) / 2);
  ctx.lineTo(p[p.length - 1].x, p[p.length - 1].y);
}
function ptInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
    if (((yi > y) !== (yj > y)) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function distPolyline(px, py, p) {
  let m = Infinity;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i], b = p[i + 1], dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy;
    let t = l2 ? ((px - a.x) * dx + (py - a.y) * dy) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    m = Math.min(m, Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy)));
  }
  return m;
}

/* ---- Controles del panel (definidos a nivel de módulo para evitar remount en cada render) ---- */
function GradeBtns({ k, gv, setV }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[0, 1, 2, 3].map((n) => {
        const on = gv(k) === n;
        return (
          <button key={n} onClick={() => setV(k, n)} aria-label={`${k} grado ${n}`} aria-pressed={on}
            style={{ flex: 1, padding: 6, fontSize: 11, border: 'none', borderRadius: 5, cursor: 'pointer', background: on ? (n === 0 ? '#9aa3a3' : TEAL) : '#eceeee', color: on ? 'white' : '#556', fontWeight: on ? 700 : 500 }}>{n}</button>
        );
      })}
    </div>
  );
}
function ToggleBtns({ k, gv, setV }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[['Ausente', 0], ['Presente', 1]].map(([lab, n]) => {
        const on = gv(k) === n;
        return (
          <button key={n} onClick={() => setV(k, n)} aria-label={`${k} ${lab}`} aria-pressed={on}
            style={{ flex: 1, padding: 6, fontSize: 11, border: 'none', borderRadius: 5, cursor: 'pointer', background: on ? (n === 0 ? '#9aa3a3' : TEAL) : '#eceeee', color: on ? 'white' : '#556', fontWeight: on ? 700 : 500 }}>{lab}</button>
        );
      })}
    </div>
  );
}
function Side({ label, k, gv, setV, setHover }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
      <span onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} style={{ fontSize: 10, color: '#889', width: 26 }}>{label}</span>
      <div style={{ flex: 1 }}><GradeBtns k={k} gv={gv} setV={setV} /></div>
    </div>
  );
}
function SideT({ label, k, gv, setV, setHover }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
      <span onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} style={{ fontSize: 10, color: '#889', width: 26 }}>{label}</span>
      <div style={{ flex: 1 }}><ToggleBtns k={k} gv={gv} setV={setV} /></div>
    </div>
  );
}

export default function EnzianApp() {
  const mountRef = useRef(null);
  const [vals, setVals] = useState({});
  const [copied, setCopied] = useState(false);
  const [narrow, setNarrow] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 760 : false));
  const [hover, setHover] = useState(null);
  const [labelsOn, setLabelsOn] = useState(true);
  const [boneOn, setBoneOn] = useState(true);
  const [nervesOn, setNervesOn] = useState(false);
  const [levatorOn, setLevatorOn] = useState(false);

  const staticRef = useRef(null);
  const allRef = useRef([]);
  const hitRef = useRef([]);
  const rotRef = useRef({ yaw: 0.5, pitch: 0.3, zoom: 1, tyaw: 0.5, tpitch: 0.3, tzoom: 1 });
  const hoverRef = useRef(null);
  const flashRef = useRef(null);
  const flashTimer = useRef(null);
  const faRef = useRef(false);
  const labelsRef = useRef(true);
  const boneRef = useRef(true);
  const nervesRef = useRef(false);
  const levatorRef = useRef(false);
  const setViewRef = useRef(null);
  const wakeRef = useRef(null);

  // Resalta brevemente una estructura del modelo cuando se cambia su control en el panel
  // (sustituye al "hover" del escritorio en dispositivos táctiles).
  const flash = (codeKey) => {
    flashRef.current = codeKey;
    if (wakeRef.current) wakeRef.current();
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => { flashRef.current = null; if (wakeRef.current) wakeRef.current(); }, 750);
  };

  const gv = (k) => vals[k] || 0;
  const setV = (k, val) => { setVals((p) => ({ ...p, [k]: val })); flash(k); };
  const tap = (codeKey) => setVals((p) => (TOGGLES.has(codeKey) ? { ...p, [codeKey]: p[codeKey] ? 0 : 1 } : { ...p, [codeKey]: ((p[codeKey] || 0) + 1) % 4 }));
  const reset = () => setVals({});

  const seg = (l, r) => `${l || 0}/${r || 0}`;
  const code = (() => {
    const base = `P${gv('P')} O${seg(vals.O_l, vals.O_r)} T${seg(vals.T_l, vals.T_r)} A${gv('A')} B${seg(vals.B_l, vals.B_r)} C${gv('C')}`;
    const F = [];
    if (vals.FA) F.push('FA');
    if (vals.FB) F.push('FB');
    if (vals.FU_r || vals.FU_l) { const s = []; if (vals.FU_r) s.push('r'); if (vals.FU_l) s.push('l'); F.push(`FU(${s.join(',')})`); }
    if (vals.FI) F.push('FI');
    if (vals.FO) F.push(`F(${(vals.FO_text || 'otra').trim()})`);
    return `#Enzian ${base}${F.length ? ' ' + F.join(' ') : ''}`;
  })();

  const copy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) { /* si falla, no mostramos éxito */ }
  };

  useEffect(() => { const onR = () => setNarrow(window.innerWidth < 760); window.addEventListener('resize', onR); return () => window.removeEventListener('resize', onR); }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none';
    mount.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    staticRef.current = buildStatic();
    allRef.current = staticRef.current.concat(buildUterus(!!vals.FA), buildLesions(vals));
    faRef.current = !!vals.FA;

    let W = 1, H = 1, dpr = 1;
    const resize = () => {
      const r = mount.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (wakeRef.current) wakeRef.current(); // redibujar tras un resize (el canvas se limpia)
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(mount);

    const rot = rotRef.current;
    const D = 46, C = [0, -0.6, 0];
    let cyw = 1, syw = 0, cp = 1, sp = 0, S = 1;
    const pointers = new Map();
    const RP = (x, y, z) => {
      const dx = x - C[0], dy = y - C[1], dz = z - C[2];
      const x1 = dx * cyw + dz * syw, z1 = -dx * syw + dz * cyw;
      const y2 = dy * cp - z1 * sp, z2 = dy * sp + z1 * cp;
      const f = D / (D - z2 * 0.7);
      return [W / 2 - x1 * f * S, H / 2 - y2 * f * S, z2, f];
    };

    const drawEll = (part, hit) => {
      const p2 = part.samp.map((s) => { const p = RP(s[0], s[1], s[2]); return { x: p[0], y: p[1] }; });
      const hp = hull(p2);
      let cx = 0, cy = 0; hp.forEach((p) => { cx += p.x; cy += p.y; }); cx /= hp.length; cy /= hp.length;
      let rad = 0; hp.forEach((p) => { rad = Math.max(rad, Math.hypot(p.x - cx, p.y - cy)); });
      const dz = RP(part.c[0], part.c[1], part.c[2])[2];
      const df = Math.max(0.8, Math.min(1.14, 0.97 + dz * 0.022));
      const rgb = dshade(part.rgb, df);
      let op = part.opacity || 1;
      if (part.code === 'FA' && faRef.current) op = 0.85;
      const lx = cx - rad * 0.32, ly = cy - rad * 0.4;
      const grd = ctx.createRadialGradient(lx, ly, rad * 0.05, cx, cy, rad * 1.06);
      grd.addColorStop(0, css(mixTo(rgb, 0.58, WARM)));
      grd.addColorStop(0.2, css(mixTo(rgb, 0.32, WARM)));
      grd.addColorStop(0.52, css(rgb));
      grd.addColorStop(0.84, css(mixTo(rgb, 0.2, COOL)));
      grd.addColorStop(1, css(mixTo(rgb, 0.42, COOL)));
      ctx.globalAlpha = op;
      if (part.flat) { smoothClosed(ctx, hp); ctx.fillStyle = grd; ctx.fill(); }
      else {
        ctx.save();
        ctx.shadowColor = 'rgba(55,35,45,0.22)'; ctx.shadowBlur = Math.max(5, rad * 0.2); ctx.shadowOffsetX = rad * 0.05; ctx.shadowOffsetY = rad * 0.12;
        smoothClosed(ctx, hp); ctx.fillStyle = grd; ctx.fill();
        ctx.restore();
      }
      if ((part.mottle || part.vessels) && !part.flat) {
        ctx.save(); smoothClosed(ctx, hp); ctx.clip();
        if (part.mottle) part.mottle.forEach((m) => {
          const pr = RP(m[0], m[1], m[2]); if (pr[2] < dz - 0.2) return;
          const mr = rad * 0.55, mg = ctx.createRadialGradient(pr[0], pr[1], 0, pr[0], pr[1], mr);
          mg.addColorStop(0, css(mixTo(rgb, 0.16, COOL), 0.18 * op)); mg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(pr[0], pr[1], mr, 0, Math.PI * 2); ctx.fill();
        });
        if (part.vessels) { ctx.lineCap = 'round'; part.vessels.forEach((vs) => {
          const proj = vs.map((p) => RP(p[0], p[1], p[2])); if (proj[Math.floor(proj.length / 2)][2] < dz - 0.2) return;
          pathOpen(ctx, proj.map((p) => ({ x: p[0], y: p[1] }))); ctx.lineWidth = Math.max(0.8, rad * 0.022); ctx.strokeStyle = 'rgba(150,42,56,0.16)'; ctx.stroke();
        }); }
        ctx.restore();
      }
      ctx.lineWidth = 1; ctx.strokeStyle = css(mixTo(rgb, 0.5, DARK), part.flat ? 0.42 : 0.36); smoothClosed(ctx, hp); ctx.stroke();
      if (!part.flat) {
        ctx.save(); ctx.translate(-1, -1.4); smoothClosed(ctx, hp); ctx.lineWidth = 1.4; ctx.strokeStyle = css(mixTo(rgb, 0.5, WARM), 0.35); ctx.stroke(); ctx.restore();
        ctx.save(); smoothClosed(ctx, hp); ctx.clip();
        let sg = ctx.createRadialGradient(lx, ly, 0, lx, ly, rad * 0.5);
        sg.addColorStop(0, `rgba(255,255,255,${0.3 * op})`); sg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sg; ctx.fillRect(cx - rad * 1.3, cy - rad * 1.3, rad * 2.6, rad * 2.6);
        sg = ctx.createRadialGradient(lx, ly, 0, lx, ly, rad * 0.18);
        sg.addColorStop(0, `rgba(255,255,255,${0.5 * op})`); sg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sg; ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
        ctx.restore();
      }
      if (part.code && (part.code === hoverRef.current || part.code === flashRef.current)) { ctx.globalAlpha = 1; ctx.strokeStyle = TEAL; ctx.lineWidth = 2.5; smoothClosed(ctx, hp); ctx.stroke(); }
      ctx.globalAlpha = 1;
      if (part.code) hit.push({ code: part.code, depth: dz, kind: 'poly', poly: hp });
    };

    const drawTube = (part, hit) => {
      const proj = part.pts.map((p) => RP(p[0], p[1], p[2]));
      const p2 = proj.map((p) => ({ x: p[0], y: p[1] }));
      const mid = proj[Math.floor(proj.length / 2)];
      const dz = mid[2];
      const w = Math.max(part.faint ? 0.8 : 1.6, 2 * part.r * mid[3] * S);
      const df = Math.max(0.8, Math.min(1.14, 0.97 + dz * 0.022));
      const rgb = dshade(part.rgb, df);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.globalAlpha = part.opacity || 1;
      pathOpen(ctx, p2); ctx.lineWidth = w + 2.4; ctx.strokeStyle = css(mixTo(rgb, 0.5, DARK), part.faint ? 0.22 : 0.42); ctx.stroke();
      pathOpen(ctx, p2); ctx.lineWidth = w; ctx.strokeStyle = css(rgb, part.faint ? 0.5 : 1); ctx.stroke();
      if (!part.faint) {
        ctx.save(); ctx.translate(1.2, 1.6); pathOpen(ctx, p2); ctx.lineWidth = Math.max(1, w * 0.5); ctx.strokeStyle = css(mixTo(rgb, 0.26, COOL), 0.5); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.translate(-1.3, -1.8); pathOpen(ctx, p2); ctx.lineWidth = Math.max(1, w * 0.34); ctx.strokeStyle = css(mixTo(rgb, 0.55, WARM), 0.62); ctx.stroke(); ctx.restore();
      }
      if (part.code && (part.code === hoverRef.current || part.code === flashRef.current)) { ctx.globalAlpha = 1; pathOpen(ctx, p2); ctx.lineWidth = w + 3; ctx.strokeStyle = TEAL; ctx.stroke(); }
      ctx.globalAlpha = 1;
      if (part.code) hit.push({ code: part.code, depth: dz, kind: 'tube', pts: p2, w });
    };

    const drawSpic = (part, p, r, hit) => {
      const cx = p[0], cy = p[1];
      const seed = Math.abs(part.c[0] * 127.1 + part.c[1] * 311.7 + part.c[2] * 74.7) % 1000;
      const rnd = (i) => { const v = Math.sin(seed + i * 12.9898) * 43758.5453; return v - Math.floor(v); };
      const ovx = part.oval ? part.oval[0] : 1, ovy = part.oval ? part.oval[1] : 1, om = Math.max(ovx, ovy);
      const ox = ovx / om, oy = ovy / om;
      const rot = seed * 0.37, cR = Math.cos(rot), sR = Math.sin(rot);
      const tx = (lx, ly) => cx + (lx * ox) * cR - (ly * oy) * sR;
      const ty = (lx, ly) => cy + (lx * ox) * sR + (ly * oy) * cR;
      ctx.globalAlpha = part.opacity || 1;
      ctx.lineCap = 'round';
      ctx.strokeStyle = css(mixTo(part.rgb, 0.32, DARK), 0.72);
      const nS = 12;
      for (let i = 0; i < nS; i++) {
        const a = (i / nS) * Math.PI * 2 + (rnd(i) - 0.5) * 0.6;
        const len = r * (0.84 + rnd(i + 31) * 0.16);
        ctx.lineWidth = Math.max(0.5, r * 0.07 * (0.5 + rnd(i + 17)));
        const x0 = Math.cos(a) * r * 0.45, y0 = Math.sin(a) * r * 0.45, x1 = Math.cos(a) * len, y1 = Math.sin(a) * len;
        ctx.beginPath(); ctx.moveTo(tx(x0, y0), ty(x0, y0)); ctx.lineTo(tx(x1, y1), ty(x1, y1)); ctx.stroke();
      }
      ctx.save();
      ctx.shadowColor = 'rgba(50,20,28,0.28)'; ctx.shadowBlur = Math.max(2, r * 0.3); ctx.shadowOffsetY = r * 0.12;
      const g = ctx.createRadialGradient(tx(-r * 0.3, -r * 0.3), ty(-r * 0.3, -r * 0.3), r * 0.05, cx, cy, r);
      g.addColorStop(0, css(mixTo(part.rgb, 0.45, WARM))); g.addColorStop(0.55, css(part.rgb)); g.addColorStop(1, css(mixTo(part.rgb, 0.45, DARK)));
      ctx.fillStyle = g;
      ctx.beginPath();
      const nP = 13;
      for (let i = 0; i <= nP; i++) {
        const a = (i / nP) * Math.PI * 2;
        const rr = r * (0.5 + rnd(i + 3) * 0.22);
        const lx = Math.cos(a) * rr, ly = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(tx(lx, ly), ty(lx, ly)); else ctx.lineTo(tx(lx, ly), ty(lx, ly));
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
      if (part.code && (part.code === hoverRef.current || part.code === flashRef.current)) {
        ctx.globalAlpha = 1; ctx.strokeStyle = TEAL; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.ellipse(cx, cy, r * ox * 1.12, r * oy * 1.12, rot, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (part.code) hit.push({ code: part.code, depth: p[2], kind: 'disc', c: [cx, cy], r: r * Math.max(ox, oy) * 1.05 });
    };

    const drawDisc = (part, hit) => {
      const p = RP(part.c[0], part.c[1], part.c[2]);
      const r = Math.max(1.4, part.r * p[3] * S);
      ctx.globalAlpha = part.opacity || 1;
      if (part.spic) { drawSpic(part, p, r, hit); return; }
      const grd = ctx.createRadialGradient(p[0] - r * 0.3, p[1] - r * 0.35, r * 0.05, p[0], p[1], r);
      if (part.endo) {
        grd.addColorStop(0, css(mixTo(part.rgb, 0.28, DARK))); grd.addColorStop(0.68, css(part.rgb));
        grd.addColorStop(0.92, css(mixTo(part.rgb, 0.34, WARM))); grd.addColorStop(1, css(mixTo(part.rgb, 0.2, DARK)));
      } else {
        grd.addColorStop(0, css(mixTo(part.rgb, 0.5, WARM))); grd.addColorStop(0.6, css(part.rgb)); grd.addColorStop(1, css(mixTo(part.rgb, 0.4, DARK)));
      }
      ctx.save();
      if (!part.endo) { ctx.shadowColor = 'rgba(50,20,28,0.3)'; ctx.shadowBlur = Math.max(2, r * 0.25); ctx.shadowOffsetY = r * 0.1; }
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      if (part.endo) { ctx.globalAlpha = 0.85; ctx.strokeStyle = css(mixTo(part.rgb, 0.4, WARM)); ctx.lineWidth = Math.max(1, r * 0.06); ctx.beginPath(); ctx.arc(p[0], p[1], r * 0.94, 0, Math.PI * 2); ctx.stroke(); }
      if (part.code && (part.code === hoverRef.current || part.code === flashRef.current)) { ctx.globalAlpha = 1; ctx.strokeStyle = TEAL; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p[0], p[1], r + 2, 0, Math.PI * 2); ctx.stroke(); }
      ctx.globalAlpha = 1;
      if (part.code) hit.push({ code: part.code, depth: p[2], kind: 'disc', c: [p[0], p[1]], r });
    };

    const renderFrame = () => {
      cyw = Math.cos(rot.yaw); syw = Math.sin(rot.yaw); cp = Math.cos(rot.pitch); sp = Math.sin(rot.pitch); S = Math.min(W, H) * 0.03 * rot.zoom;

      const bg = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.5, Math.max(W, H) * 0.72);
      bg.addColorStop(0, '#fdfdfd'); bg.addColorStop(1, '#ebedef');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      const parts = allRef.current;
      const showBone = boneRef.current;
      const showNerves = nervesRef.current;
      const showLevator = levatorRef.current;
      parts.forEach((p) => { const c = p.kind === 'tube' ? p.pts[Math.floor(p.pts.length / 2)] : p.c; p._d = RP(c[0], c[1], c[2])[2]; });
      const order = parts.map((_, i) => i).sort((a, b) => parts[a]._d - parts[b]._d);
      const hit = [];
      order.forEach((i) => { const p = parts[i]; if (p.bone && !showBone) return; if (p.nerve && !showNerves) return; if (p.levator && !showLevator) return; if (p.kind === 'ell') drawEll(p, hit); else if (p.kind === 'tube') drawTube(p, hit); else drawDisc(p, hit); });
      hitRef.current = hit;

      if (labelsRef.current) {
        ctx.font = '600 11px Segoe UI, sans-serif'; ctx.textAlign = 'center';
        let labs = LABELS;
        if (showBone) labs = labs.concat(BONE_LABELS);
        labs.forEach((Lb) => {
          const pr = RP(Lb.p[0], Lb.p[1], Lb.p[2]);
          if (pr[2] < -1.5) return;
          const bone = BONE_LABELS.indexOf(Lb) >= 0;
          ctx.lineJoin = 'round'; ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.strokeText(Lb.t, pr[0], pr[1] + 3);
          ctx.fillStyle = bone ? '#5a4e30' : '#2a3838'; ctx.fillText(Lb.t, pr[0], pr[1] + 3);
        });
      }
    };

    // ---- Bucle con descanso: solo anima mientras hay interacción o transición en curso ----
    const EPS = 1e-3;
    const settled = () =>
      pointers.size === 0 &&
      Math.abs(rot.tyaw - rot.yaw) < EPS &&
      Math.abs(rot.tpitch - rot.pitch) < EPS &&
      Math.abs(rot.tzoom - rot.zoom) < EPS;

    let raf = null, running = false;
    const loop = () => {
      rot.yaw += (rot.tyaw - rot.yaw) * 0.15;
      rot.pitch += (rot.tpitch - rot.pitch) * 0.15;
      rot.zoom += (rot.tzoom - rot.zoom) * 0.15;
      if (Math.abs(rot.tyaw - rot.yaw) < EPS) rot.yaw = rot.tyaw;
      if (Math.abs(rot.tpitch - rot.pitch) < EPS) rot.pitch = rot.tpitch;
      if (Math.abs(rot.tzoom - rot.zoom) < EPS) rot.zoom = rot.tzoom;
      renderFrame();
      if (settled()) { running = false; raf = null; }
      else raf = requestAnimationFrame(loop);
    };
    const wake = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };
    wakeRef.current = wake;
    wake(); // primer render

    setViewRef.current = (name) => {
      const v = VIEWS[name];
      if (!v) return;
      const TWO_PI = Math.PI * 2;
      let d = ((v[0] - rot.yaw) % TWO_PI + TWO_PI) % TWO_PI;
      if (d > Math.PI) d -= TWO_PI; // tomar siempre el camino angular más corto
      rot.tyaw = rot.yaw + d;
      rot.tpitch = v[1];
      wake();
    };

    let moved = false, lastX = 0, lastY = 0, pinch = 0;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const onDown = (e) => {
      canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) { moved = false; lastX = e.clientX; lastY = e.clientY; }
      if (pointers.size === 2) { const p = [...pointers.values()]; pinch = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); }
      wake();
    };
    const onMove = (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) { const p = [...pointers.values()]; const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); if (pinch) { rot.zoom = clamp(rot.zoom * (d / pinch), 0.55, 2.6); rot.tzoom = rot.zoom; } pinch = d; wake(); return; }
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
      rot.yaw += dx * 0.007; rot.tyaw = rot.yaw;
      rot.pitch = clamp(rot.pitch - dy * 0.007, -1.35, 1.35); rot.tpitch = rot.pitch;
      lastX = e.clientX; lastY = e.clientY;
      wake();
    };
    const onUp = (e) => {
      const wasOne = pointers.size === 1;
      pointers.delete(e.pointerId); pinch = 0;
      if (wasOne && !moved) {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left, py = e.clientY - rect.top;
        const hits = hitRef.current.slice().sort((a, b) => b.depth - a.depth);
        for (const h of hits) {
          let ok = false;
          if (h.kind === 'poly') ok = ptInPoly(px, py, h.poly);
          else if (h.kind === 'tube') ok = distPolyline(px, py, h.pts) <= h.w / 2 + 4;
          else ok = Math.hypot(px - h.c[0], py - h.c[1]) <= h.r + 4;
          if (ok) { tap(h.code); break; }
        }
      }
      wake();
    };
    const onWheel = (e) => { e.preventDefault(); rot.zoom = clamp(rot.zoom * (1 - e.deltaY * 0.001), 0.55, 2.6); rot.tzoom = rot.zoom; wake(); };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      running = false;
      if (flashTimer.current) clearTimeout(flashTimer.current);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('wheel', onWheel);
      wakeRef.current = null; setViewRef.current = null;
      try { mount.removeChild(canvas); } catch (e) {}
    };
  }, [narrow]);

  useEffect(() => { if (staticRef.current) allRef.current = staticRef.current.concat(buildUterus(!!vals.FA), buildLesions(vals)); faRef.current = !!vals.FA; if (wakeRef.current) wakeRef.current(); }, [vals]);
  useEffect(() => { hoverRef.current = hover; if (wakeRef.current) wakeRef.current(); }, [hover]);
  useEffect(() => { labelsRef.current = labelsOn; if (wakeRef.current) wakeRef.current(); }, [labelsOn]);
  useEffect(() => { boneRef.current = boneOn; if (wakeRef.current) wakeRef.current(); }, [boneOn]);
  useEffect(() => { nervesRef.current = nervesOn; if (wakeRef.current) wakeRef.current(); }, [nervesOn]);
  useEffect(() => { levatorRef.current = levatorOn; if (wakeRef.current) wakeRef.current(); }, [levatorOn]);

  const presets = [{ l: 'Frontal', v: 'frontal' }, { l: 'Posterior', v: 'posterior' }, { l: 'Izq.', v: 'izq' }, { l: 'Der.', v: 'der' }, { l: 'Superior', v: 'superior' }];

  const isActive = (it) => {
    if (it.type === 'grade' || it.type === 'toggle') return gv(it.key) > 0;
    if (it.type === 'toggleText') return gv('FO') > 0;
    return gv(it.key + '_l') > 0 || gv(it.key + '_r') > 0;
  };
  const topBtn = (active, onClick, label, compact = false) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      style={{
        padding: compact ? '6px 8px' : '6px 10px',
        fontSize: compact ? 10.5 : 11,
        border: 'none',
        borderRadius: 7,
        cursor: 'pointer',
        background: active ? TEAL : '#eef2f2',
        color: active ? 'white' : '#556',
        fontWeight: 600,
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        maxWidth: compact ? 104 : undefined,
        whiteSpace: 'normal',
        lineHeight: 1.15,
      }}
    >
      {label}
    </button>
  );

  const legendItems = [
    { c: PAL.lesion, l: 'Nódulo DIE' },
    { c: PAL.endo, l: 'Endometrioma' },
    { c: PAL.bone, l: 'Pelvis ósea' },
    { c: PAL.nerve, l: 'Nervios autónomos' },
  ];

  const titleBlock = (compact = false) => (
    <div style={{ padding: compact ? '10px 68px 10px 14px' : '16px 20px', background: TEAL, color: 'white', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ margin: '0 0 3px', fontSize: compact ? 14 : 20, lineHeight: 1.25 }}>Modelo de reconstrucción 3D basado en clasificación #Enzian para orientación del paciente</h1>
      <p style={{ margin: 0, fontSize: compact ? 10.5 : 12.5, opacity: 0.9 }}>Modelo educativo · clasificación #Enzian</p>
    </div>
  );

  const viewControls = (compact = false) => (
    <div style={{ position: 'absolute', top: 10, left: compact ? 10 : '50%', transform: compact ? 'none' : 'translateX(-50%)', display: 'flex', gap: 2, background: '#eef2f2', borderRadius: 8, padding: 3, zIndex: 4, flexWrap: 'wrap', justifyContent: 'center', maxWidth: compact ? 'calc(100% - 138px)' : '56%' }}>
      {presets.map((b) => (<button key={b.v} aria-label={`Vista ${b.l}`} onClick={() => setViewRef.current && setViewRef.current(b.v)} style={{ padding: compact ? '5px 6px' : '5px 9px', fontSize: compact ? 10.5 : 11.5, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', color: '#445', fontWeight: 600 }}>{b.l}</button>))}
    </div>
  );

  const modelToggles = (compact = false) => (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 4, display: 'flex', flexDirection: 'column', gap: compact ? 5 : 6, alignItems: 'flex-end' }}>
      {topBtn(labelsOn, () => setLabelsOn((o) => !o), 'Etiquetas', compact)}
      {topBtn(boneOn, () => setBoneOn((o) => !o), 'Pelvis', compact)}
      {topBtn(nervesOn, () => setNervesOn((o) => !o), 'Nervios', compact)}
      {topBtn(levatorOn, () => setLevatorOn((o) => !o), 'Músculos pélvicos', compact)}
    </div>
  );

  const legend = (compact = false) => (
    <div style={{ display: 'flex', gap: compact ? 9 : 16, marginBottom: compact ? 0 : 8, flexWrap: 'wrap', alignItems: 'center' }}>
      {legendItems.map((it) => (
        <div key={it.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: compact ? 11 : 14, height: compact ? 11 : 14, background: it.c, borderRadius: 3, display: 'inline-block', flex: '0 0 auto' }} />
          <span>{it.l}</span>
        </div>
      ))}
    </div>
  );

  const modelStage = (compact = false) => (
    <div style={{ ...(compact ? { height: 'min(56dvh, 430px)', minHeight: 330 } : { flex: 1 }), background: 'white', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', minWidth: 0 }}>
      {viewControls(compact)}
      {modelToggles(compact)}
      <div ref={mountRef} role="img" aria-label="Modelo 3D interactivo de anatomía pélvica con lesiones de endometriosis" style={{ flex: 1, position: 'relative', minHeight: 0 }} />
      <div style={{ padding: compact ? '5px 10px' : '6px 12px', fontSize: compact ? 9.5 : 10.5, color: '#99a', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>Arrastra para rotar · pellizca para zoom · toca un órgano</div>
      {compact && <div style={{ padding: '7px 10px 9px', borderTop: '1px solid #f2f2f2', fontSize: 10.5, color: '#667' }}>{legend(true)}</div>}
    </div>
  );

  const compartmentPanel = (scrollable = true) => (
    <div style={{ ...(scrollable ? { flex: 1, overflowY: 'auto' } : {}), padding: 12, borderBottom: scrollable ? '1px solid #eee' : 'none', minHeight: scrollable ? 80 : undefined }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#667', marginBottom: 4 }}>COMPARTIMENTOS #ENZIAN</div>
      <div style={{ fontSize: 10, color: '#9aa', marginBottom: 10 }}>P/O: &lt;3 / 3–7 / &gt;7 cm · A/B/C: &lt;1 / 1–3 / &gt;3 cm · T: adherencias (1–3) · F: presencia</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {PANEL.map((it) => {
          const active = isActive(it);
          return (
            <div key={it.key} style={{ padding: 8, borderRadius: 7, background: active ? 'rgba(26,127,127,0.07)' : '#fafafa', border: active ? '1px solid rgba(26,127,127,0.35)' : '1px solid #f0f0f0' }}>
              <div onMouseEnter={() => setHover(it.type.includes('LR') ? null : it.key)} onMouseLeave={() => setHover(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: it.type === 'grade' || it.type === 'toggle' ? 5 : 2 }}>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: 'white', background: active ? TEAL : '#b9c2c2', borderRadius: 4, padding: '1px 5px', minWidth: 22, textAlign: 'center' }}>{it.key}</span>
                <span style={{ fontSize: 11.5, color: '#334', fontWeight: 500, flex: 1 }}>{it.label}</span>
              </div>
              {it.type === 'grade' && <GradeBtns k={it.key} gv={gv} setV={setV} />}
              {it.type === 'toggle' && <ToggleBtns k={it.key} gv={gv} setV={setV} />}
              {it.type === 'gradeLR' && (<><Side label="Izq" k={it.key + '_l'} gv={gv} setV={setV} setHover={setHover} /><Side label="Der" k={it.key + '_r'} gv={gv} setV={setV} setHover={setHover} /></>)}
              {it.type === 'toggleLR' && (<><SideT label="Izq" k={it.key + '_l'} gv={gv} setV={setV} setHover={setHover} /><SideT label="Der" k={it.key + '_r'} gv={gv} setV={setV} setHover={setHover} /></>)}
              {it.type === 'toggleText' && (<>
                <ToggleBtns k="FO" gv={gv} setV={setV} />
                {gv('FO') > 0 && <input aria-label="Especificar otra localización" value={vals.FO_text || ''} onChange={(e) => setVals((p) => ({ ...p, FO_text: e.target.value }))} placeholder="especificar (diafragma, ombligo…)" style={{ marginTop: 6, width: '100%', boxSizing: 'border-box', padding: 6, fontSize: 11, border: '1px solid #ddd', borderRadius: 5 }} />}
              </>)}
            </div>
          );
        })}
      </div>
    </div>
  );

  const codePanel = () => (
    <div style={{ padding: 12, borderBottom: '1px solid #eee' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#667', marginBottom: 8 }}>CÓDIGO #ENZIAN</div>
      <div style={{ padding: 10, background: '#f5f5f5', borderRadius: 6, fontSize: 12, fontFamily: 'monospace', color: '#223', wordBreak: 'break-word', lineHeight: 1.45, minHeight: 20 }}>{code}</div>
      <button onClick={copy} aria-label={copied ? 'Código copiado' : 'Copiar código #Enzian'} style={{ marginTop: 8, width: '100%', padding: 8, fontSize: 11.5, border: 'none', borderRadius: 6, cursor: 'pointer', background: copied ? TEAL_D : TEAL, color: 'white', fontWeight: 600 }}>{copied ? '✓ Copiado' : 'Copiar código'}</button>
    </div>
  );

  const resetPanel = () => (
    <div style={{ padding: 12 }}>
      <button onClick={reset} aria-label="Limpiar todos los compartimentos" style={{ width: '100%', padding: 9, fontSize: 11.5, background: '#f0f0f0', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', fontWeight: 600, color: '#556' }}>Limpiar todo</button>
    </div>
  );

  const authorsBlock = (compact = false) => (
    <div style={{ padding: compact ? 12 : 0, background: compact ? 'white' : undefined, borderRadius: compact ? 10 : undefined, boxShadow: compact ? '0 2px 8px rgba(0,0,0,0.08)' : undefined, fontSize: 11, color: '#667' }}>
      <div style={{ fontSize: compact ? 10 : 11, color: '#778', marginBottom: 6 }}>
        <strong>Autores:</strong> Dr. Mauricio Correa D., Ph.D. · REDEP (Red de Endometriosis y Dolor Pélvico) · Universidad Austral de Chile
      </div>
      <p style={{ margin: 0, lineHeight: 1.45, color: '#9aa', fontSize: compact ? 10 : 11 }}>
        <strong>Disclaimer:</strong> Modelo educativo con proporciones promedio y tamaños según umbrales #Enzian. No reemplaza evaluación clínica, ecográfica, quirúrgica o por resonancia.
      </p>
    </div>
  );

  if (narrow) {
    return (
      <div style={{ minHeight: '100dvh', width: '100%', maxWidth: '100%', fontFamily: 'Segoe UI, sans-serif', background: '#fbfafa' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fbfafa', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
          {titleBlock(true)}
          <div style={{ padding: '8px 8px 10px' }}>
            {modelStage(true)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 8px 16px' }}>
          <section style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {compartmentPanel(false)}
          </section>

          <section style={{ background: 'white', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {codePanel()}
            {resetPanel()}
          </section>

          {authorsBlock(true)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', width: '100%', overflow: 'hidden', fontFamily: 'Segoe UI, sans-serif', background: '#fbfafa' }}>
      {titleBlock(false)}

      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden', gap: 14, padding: 14, minHeight: 0 }}>
        {modelStage(false)}

        <div style={{ width: 308, flex: '0 0 308px', minHeight: 0, background: 'white', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {compartmentPanel(true)}
          {codePanel()}
          {resetPanel()}
        </div>
      </div>

      <div style={{ padding: '12px 20px', background: 'white', borderTop: '1px solid #eee', fontSize: 11, color: '#667' }}>
        {legend(false)}
        {authorsBlock(false)}
      </div>
    </div>
  );
}
