import fs from 'node:fs';
import path from 'node:path';
import {mathjax} from 'mathjax-full/js/mathjax.js';
import {TeX} from 'mathjax-full/js/input/tex.js';
import {SVG} from 'mathjax-full/js/output/svg.js';
import {liteAdaptor} from 'mathjax-full/js/adaptors/liteAdaptor.js';
import {RegisterHTMLHandler} from 'mathjax-full/js/handlers/html.js';
import {AllPackages} from 'mathjax-full/js/input/tex/AllPackages.js';

const OUT = path.resolve('..');
const FONTS = path.resolve('node_modules/@fontsource-variable');
fs.mkdirSync(`${OUT}/_assets`, {recursive: true});

/* ---------- MathJax -> SVG (chemins inclus, aucune police requise) ---------- */
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const doc = mathjax.document('', {
  InputJax: new TeX({packages: AllPackages}),
  OutputJax: new SVG({fontCache: 'none'}),
});
function eq(tex) {
  const html = adaptor.innerHTML(doc.convert(tex, {display: false}));
  const m = html.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/);
  if (!m) throw new Error('MathJax: ' + tex);
  const [minx, miny, w, h] = m[1].split(/\s+/).map(Number);
  const inner = m[2].replace(/<title[\s\S]*?<\/title>/g, '').replace(/data-[a-z-]+="[^"]*"/g, '');
  return {minx, miny, w, h, inner, vb: m[1]};
}

/* ---------- Équations du champ d'arrière-plan ---------- */
const EQ = [
  ['P(A\\mid B)=\\frac{P(B\\mid A)\\,P(A)}{P(B)}', 1],
  ['e(x)=P(T=1\\mid X=x)', 1],
  ['\\bar{x}\\pm 1{,}96\\,\\frac{s}{\\sqrt{n}}', 1],
  ['\\log\\mu_i=\\beta_0+\\beta_1 x_i', 1],
  ['f(y)=\\sum_{k=1}^{K}\\pi_k\\,f_k(y)', 1],
  ['\\hat\\beta=(X^{\\top}X)^{-1}X^{\\top}y', 1],
  ['\\log\\frac{e(x)}{1-e(x)}=\\beta_0+\\beta^{\\top}x', 0],
  ['w_i=\\frac{T_i}{e(x_i)}+\\frac{1-T_i}{1-e(x_i)}', 0],
  ['\\tau=\\mathbb{E}[Y(1)-Y(0)]', 0],
  ['y_{it}=\\eta_{0i}+\\eta_{1i}\\,t+\\varepsilon_{it}', 0],
  ['\\mathrm{Var}(X)=\\mathbb{E}[X^2]-\\mathbb{E}[X]^2', 0],
  ['\\int_{-\\infty}^{\\infty}e^{-x^2/2}\\,dx=\\sqrt{2\\pi}', 0],
  ['\\frac{\\partial \\ell}{\\partial\\theta}=0', 0],
  ['r=\\frac{\\mathrm{Cov}(X,Y)}{\\sigma_X\\,\\sigma_Y}', 0],
  ['s^2=\\frac{1}{n-1}\\sum_{i=1}^{n}(x_i-\\bar{x})^2', 0],
  ['\\mathrm{OR}=\\frac{p_1/(1-p_1)}{p_0/(1-p_0)}', 0],
  ['P(X=k)=\\frac{\\lambda^{k}e^{-\\lambda}}{k!}', 0],
  ['\\mathrm{AIC}=2k-2\\ln\\hat{L}', 0],
  ['\\mathrm{BIC}=k\\ln n-2\\ln\\hat{L}', 0],
  ['H_0:\\ \\mu_1=\\mu_2', 0],
  ['\\hat\\theta=\\arg\\max_{\\theta}\\ \\ell(\\theta)', 0],
  ['R^2=1-\\frac{SS_{\\mathrm{res}}}{SS_{\\mathrm{tot}}}', 0],
  ['\\mathbb{E}[Y\\mid X]=g^{-1}(X\\beta)', 0],
  ['\\sum_{i}\\hat{e}_i=0', 0],
].map(([tex, hi]) => ({...eq(tex), hi}));

/* Petits dessins (courbe en cloche, nuage de points, histogramme) */
const bell = {w: 220, h: 100, doodle: true, svg:
  `<path d="M0 96 H220" /><path d="M10 96 C 50 96, 70 6, 110 6 S 170 96, 210 96" />`};
const scatter = {w: 190, h: 120, doodle: true, svg:
  `<path d="M6 108 L184 18" />` +
  [[22,96],[40,80],[58,92],[74,66],[96,70],[112,46],[130,56],[150,30],[168,34],[84,88]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" />`).join('')};
const histo = {w: 170, h: 100, doodle: true, svg:
  [[8,60],[38,30],[68,6],[98,22],[128,52]]
    .map(([x, h]) => `<rect x="${x}" y="${96 - (96 - h) }" width="24" height="${96 - h}" />`).join('') +
  `<path d="M0 96 H170" />`};

/* ---------- Placement pseudo-aléatoire sans chevauchement ---------- */
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(2026);
const W = 1600, H = 1000;
const placed = [];
const items = [];
const order = [...EQ.map((e, i) => ({e, i})), {d: bell}, {d: scatter}, {d: histo}];
let out = '';
for (const it of order) {
  const isD = !!it.d;
  const size = isD ? 1 : 30 + Math.floor(R() * 34);       // taille de police (px)
  const bw = isD ? it.d.w : (it.e.w * size) / 1000;
  const bh = isD ? it.d.h : (it.e.h * size) / 1000;
  const rot = isD ? (R() * 14 - 7) : (R() * 18 - 9);
  const pad = 26;
  let ok = false, x = 0, y = 0;
  for (let t = 0; t < 900 && !ok; t++) {
    x = 20 + R() * (W - bw - 40);
    y = 20 + R() * (H - bh - 40);
    ok = placed.every(p => x + bw + pad < p.x || p.x + p.w + pad < x || y + bh + pad < p.y || p.y + p.h + pad < y);
  }
  if (!ok) continue;
  placed.push({x, y, w: bw, h: bh});
  if (isD) {
    out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--eq-c)">${it.d.svg}</g>`;
  } else {
    const e = it.e, k = size / 1000;
    const col = e.hi ? 'var(--eq-hi, var(--eq-c))' : 'var(--eq-c)';
    out += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${k.toFixed(5)}) translate(${-e.minx} ${-e.miny})" style="color:${col}">${e.inner}</g>`;
  }
}
console.log('éléments placés :', placed.length, 'sur', order.length);

const champ = `<!-- Généré par gen.mjs : champ d'équations en arrière-plan -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><g id="champ-eq">${out}</g></defs></svg>
<div class="champ-fond" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" focusable="false"><use href="#champ-eq"/></svg></div>
`;
fs.writeFileSync(`${OUT}/_assets/champ.html`, champ);

/* ---------- Traducteur d'équations (accueil) ---------- */
const T = [
  ['Mettre à jour une croyance', 'P(A\\mid B)=\\frac{P(B\\mid A)\\,P(A)}{P(B)}',
   'Vous estimez à une chance sur dix qu’il pleuve. Puis vous voyez des nuages noirs : votre estimation monte. Cette formule dit de combien, selon la fiabilité de l’indice.',
   'Théorème de Bayes. La probabilité a posteriori de A est la probabilité a priori multipliée par la vraisemblance de B, puis normalisée par la probabilité de B.'],
  ['Comparer équitablement', 'e(x)=P(T=1\\mid X=x)',
   'Deux personnes peuvent différer dès le départ : l’une reçoit un service, l’autre non, mais pas pour les mêmes raisons. Cette formule calcule, pour chacune, la chance qu’elle avait de le recevoir. En pesant chacune selon cette chance, on compare des groupes devenus semblables, comme si le hasard avait décidé.',
   'Score de propension (Rosenbaum et Rubin, 1983). On l’utilise pour apparier ou pondérer (inverse de la probabilité de traitement) afin d’équilibrer les covariables entre traités et non-traités.'],
  ['Mesurer l’incertitude', '\\bar{x}\\pm 1{,}96\\,\\frac{s}{\\sqrt{n}}',
   'Un sondage de 100 personnes donne 52 %. Est-ce vraiment 52 %? La formule trace une fourchette autour du chiffre. Pour la réduire de moitié, il faut quadrupler l’échantillon : la précision coûte cher.',
   'Intervalle de confiance à 95 % pour une moyenne (approximation normale). L’erreur type vaut s/√n et 1,96 est le quantile de la loi normale centrée réduite.'],
  ['Compter des événements', '\\log\\mu_i=\\beta_0+\\beta_1 x_i',
   'On compte des choses qui arrivent : consultations, absences, incidents. Le modèle dit qu’une unité de plus d’une caractéristique multiplie le nombre attendu d’événements par un même facteur (par exemple « 1,2 fois plus »), au lieu d’ajouter un nombre fixe.',
   'Régression de Poisson avec lien logarithmique. exp(β₁) est un rapport de taux. La version robuste corrige les erreurs types lorsque la variance s’écarte de la moyenne.'],
  ['Repérer des sous-groupes', 'f(y)=\\sum_{k=1}^{K}\\pi_k\\,f_k(y)',
   'Une population semble homogène, mais cache plusieurs façons d’évoluer : certains progressent vite, d’autres stagnent, d’autres décrochent. On ne voit que la foule mélangée. Cette méthode la sépare en trajectoires types et estime la taille de chaque groupe.',
   'Modèle de mélange fini. Pour des trajectoires, on parle d’analyse en classes latentes de croissance (LCGA). Le nombre de classes se choisit avec des critères comme le BIC et l’interprétabilité.'],
  ['Tracer la meilleure droite', '\\hat\\beta=(X^{\\top}X)^{-1}X^{\\top}y',
   'Posez des points sur un graphique et tendez un fil au plus près de tous. Cette formule donne la position exacte du fil : celle qui rend la somme des écarts au carré la plus petite.',
   'Estimateur des moindres carrés ordinaires, valable si XᵀX est inversible. Sous les hypothèses classiques, il est sans biais et de variance minimale (Gauss–Markov).'],
];
const chips = T.map(([label], i) =>
  `<button class="chip" role="tab" id="t${i}" aria-controls="p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${label}</button>`).join('\n');
const panels = T.map(([label, tex, txt, detail], i) => {
  const e = eq(tex);
  return `<div class="panneau" role="tabpanel" id="p${i}" aria-labelledby="t${i}"${i === 0 ? '' : ' hidden'}>
<svg class="eq-grande" viewBox="${e.vb}" style="--w:${(e.w / 1000).toFixed(3)}" role="img" aria-label="${label}" focusable="false">${e.inner}</svg>
<div class="texte"><p>${txt}</p>
<details class="detail"><summary>Pour les statisticiens</summary><p>${detail}</p></details></div>
</div>`;
}).join('\n');

const trad = `<!-- Généré par gen.mjs : traducteur d'équations -->
<section class="hero" id="hero">
<svg class="hero-champ" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><use href="#champ-eq"/></svg>
<div class="hero-contenu">
<h1 class="hero-titre">Derrière chaque chiffre, il y a une recette.</h1>
<p class="hero-sous">Comment se construisent les variables, les bases de données et les analyses statistiques. Expliqué sans jargon, à partir de vrais projets de recherche.</p>
<div class="traducteur">
<p class="trad-invite">Touchez une équation, on la traduit.</p>
<div class="chips" role="tablist" aria-label="Équations à traduire">
${chips}
</div>
${panels}
</div>
</div>
</section>
<script>
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.traducteur [role=tab]'));
  function activer(i) {
    tabs.forEach(function (t, j) {
      var on = i === j;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById('p' + j).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { activer(i); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = (i + d + tabs.length) % tabs.length;
      activer(n); tabs[n].focus(); e.preventDefault();
    });
  });
})();
</script>
`;
fs.writeFileSync(`${OUT}/_assets/traducteur.html`, trad);

/* ---------- Barre de lecture + équations dans le bandeau d'article ---------- */
const lecture = `<div class="barre-lecture" aria-hidden="true"><div></div></div>
<script>
(function () {
  var barre = document.querySelector('.barre-lecture > div');
  var banniere = document.querySelector('.quarto-title-banner');
  if (banniere) {
    banniere.insertAdjacentHTML('afterbegin',
      '<svg class="hero-champ" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><use href="#champ-eq"/></svg>');
  }
  var raf = false;
  function maj() {
    raf = false;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    barre.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
  }
  window.addEventListener('scroll', function () { if (!raf) { raf = true; requestAnimationFrame(maj); } }, {passive: true});
  maj();
})();
</script>
`;
fs.writeFileSync(`${OUT}/_assets/lecture.html`, lecture);

/* ---------- Polices intégrées (aucune requête externe) ---------- */
const b64 = (p) => fs.readFileSync(p).toString('base64');
const face = (family, style, weight, stretch, file) =>
  `@font-face{font-family:"${family}";font-style:${style};font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ''}font-display:swap;src:url("data:font/woff2;base64,${b64(file)}") format("woff2");}`;
const fonts = `/*-- scss:rules --*/
/* Généré par gen.mjs. Polices Literata (lecture) et Bricolage Grotesque (titres), licence OFL, intégrées au site. */
${face('Literata', 'normal', '200 900', '', `${FONTS}/literata/files/literata-latin-wght-normal.woff2`)}
${face('Literata', 'italic', '200 900', '', `${FONTS}/literata/files/literata-latin-wght-italic.woff2`)}
${face('Bricolage Grotesque', 'normal', '200 800', '75% 100%', `${FONTS}/bricolage-grotesque/files/bricolage-grotesque-latin-wdth-normal.woff2`)}
`;
fs.writeFileSync(`${OUT}/fonts.scss`, fonts);
console.log('ok');
