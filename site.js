/* Site de Matteo Miannay — scripts communs
   1. photo de secours (initiales) si photo.jpg manque
   2. onglets des colles (page Enseignement)
   3. particules en interaction (thème Particules ; ignorées si le canvas est masqué) */
(function () {
  'use strict';

  /* 1. Photo */
  document.querySelectorAll('.portrait img').forEach(function (img) {
    function fail() { img.parentNode.classList.add('no-photo'); img.remove(); }
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener('error', fail);
  });

  /* Menu défilant sur téléphone : centre la page courante, retire le fondu en fin de course */
  var nav = document.querySelector('.nav');
  if (nav) {
    var cur = nav.querySelector('[aria-current="page"]');
    if (cur && nav.scrollWidth > nav.clientWidth) {
      nav.scrollLeft = cur.offsetLeft - (nav.clientWidth - cur.offsetWidth) / 2;
    }
    var fade = function () { nav.classList.toggle('at-end', nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 4); };
    nav.addEventListener('scroll', fade, { passive: true });
    window.addEventListener('resize', fade);
    fade();
  }

  /* 2. Colles */
  var data = window.COLLES;
  var root = document.querySelector('[data-colles]');
  if (data && root) {
    var tablist = document.createElement('div');
    tablist.className = 'tabs';
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', 'Classes');
    var tabs = [], panels = [];
    Object.keys(data).forEach(function (cls, k) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab';
      tab.id = 'tab-' + cls;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'panel-' + cls);
      tab.innerHTML = cls + ' <span class="count">' + data[cls].length + '</span>';
      var panel = document.createElement('div');
      panel.className = 'tab-panel';
      panel.id = 'panel-' + cls;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      var ul = document.createElement('ol');
      ul.className = 'colles-list';
      data[cls].forEach(function (s) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = s.file; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = s.name;
        li.appendChild(a);
        if (s.cor) {
          var c = document.createElement('a');
          c.className = 'cor';
          c.href = s.cor; c.target = '_blank'; c.rel = 'noopener';
          c.textContent = 'correction';
          c.setAttribute('aria-label', 'Éléments de correction : ' + s.name);
          li.appendChild(c);
        }
        ul.appendChild(li);
      });
      panel.appendChild(ul);
      tab.addEventListener('click', function () { select(k); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          var n = (k + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
          select(n); tabs[n].focus();
        }
      });
      tabs.push(tab); panels.push(panel);
      tablist.appendChild(tab);
    });
    function select(i) {
      tabs.forEach(function (t, j) {
        t.setAttribute('aria-selected', j === i ? 'true' : 'false');
        t.tabIndex = j === i ? 0 : -1;
        panels[j].hidden = j !== i;
      });
    }
    root.appendChild(tablist);
    panels.forEach(function (p) { root.appendChild(p); });
    select(0);
  }

  /* 3. Particules : dX = -k (X - c_t) dt + interaction répulsive à courte portée + bruit */
  function gauss() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function hexToRgb(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!m) return [38, 196, 236];
    var n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  document.querySelectorAll('canvas.particles').forEach(function (cv) {
    if (getComputedStyle(cv).display === 'none') return;
    var host = cv.parentElement;
    var ctx = cv.getContext('2d');
    var N = parseInt(cv.dataset.n, 10) || 120;
    var cxr = parseFloat(cv.dataset.cx) || 0.72;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var P = null, mouse = null, t = 0, visible = true, w = 0, h = 0, raf = 0;
    var css = getComputedStyle(document.documentElement);
    var accent = (css.getPropertyValue('--accent') || '#26C4EC').trim();
    var rgb = hexToRgb(accent);
    var R = 46, L = 78;
    /* Options par CSS : --particles-n (nombre), --particles-mode: ring (anneau autour de .portrait) */
    var cs = getComputedStyle(cv);
    var nCss = parseInt(cs.getPropertyValue('--particles-n'), 10);
    if (nCss > 0) N = nCss;
    var ring = cs.getPropertyValue('--particles-mode').trim() === 'ring' ? host.querySelector('.portrait') : null;
    var hole = null;
    function updateHole() {
      if (!ring) return;
      var a = cv.getBoundingClientRect(), b = ring.getBoundingClientRect();
      hole = { x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2, r: b.width / 2 + 18 };
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function center() {
      if (hole) return [hole.x + 8 * Math.cos(t * 0.4), hole.y + 8 * Math.sin(t * 0.53)];
      var wide = w > 900;
      return [
        (wide ? w * cxr : w * 0.5) + w * 0.05 * Math.cos(t * 0.31),
        h * 0.52 + h * 0.1 * Math.sin(t * 0.47)
      ];
    }
    function init() {
      P = [];
      var c = center();
      for (var i = 0; i < N; i++) P.push({ x: c[0] + gauss() * 80, y: c[1] + gauss() * 80, vx: 0, vy: 0 });
    }
    function step(draw) {
      t += 0.016;
      updateHole();
      var c = center(), i, j, a, b, dx, dy, d2, d, f;
      if (draw) { ctx.clearRect(0, 0, w, h); ctx.lineWidth = 1; }
      for (i = 0; i < N; i++) {
        a = P[i];
        a.vx += -0.0007 * (a.x - c[0]) + 0.1 * gauss();
        a.vy += -0.0007 * (a.y - c[1]) + 0.1 * gauss();
        if (hole) {
          dx = a.x - hole.x; dy = a.y - hole.y; d2 = dx * dx + dy * dy;
          if (d2 < hole.r * hole.r) {
            d = Math.sqrt(d2) || 0.01; f = 0.25 + 0.6 * (1 - d / hole.r);
            if (d2 < 1) { dx = gauss(); dy = gauss(); d = Math.sqrt(dx * dx + dy * dy) || 1; }
            a.vx += dx / d * f; a.vy += dy / d * f;
          }
        }
        if (mouse) {
          dx = a.x - mouse.x; dy = a.y - mouse.y; d2 = dx * dx + dy * dy;
          if (d2 < 16000 && d2 > 1) { d = Math.sqrt(d2); f = 0.9 * (1 - d / 126); a.vx += dx / d * f; a.vy += dy / d * f; }
        }
        for (j = i + 1; j < N; j++) {
          b = P[j];
          dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
          if (d2 < L * L && d2 > 0.01) {
            d = Math.sqrt(d2);
            if (d < R) {
              f = 0.14 * (1 - d / R);
              a.vx += dx / d * f; a.vy += dy / d * f;
              b.vx -= dx / d * f; b.vy -= dy / d * f;
            }
            if (draw) {
              ctx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + (0.32 * (1 - d / L)).toFixed(3) + ')';
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
      }
      if (draw) ctx.fillStyle = accent;
      for (i = 0; i < N; i++) {
        a = P[i];
        a.vx *= 0.93; a.vy *= 0.93;
        a.x += a.vx; a.y += a.vy;
        if (draw) { ctx.beginPath(); ctx.arc(a.x, a.y, 2, 0, Math.PI * 2); ctx.fill(); }
      }
    }
    function loop() {
      raf = 0;
      if (!visible || document.hidden) return;
      step(true);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf && !reduce) raf = requestAnimationFrame(loop); }

    resize(); updateHole(); init();
    if (reduce) { for (var k = 0; k < 300; k++) step(false); step(true); }
    else start();

    host.addEventListener('pointermove', function (e) {
      var r = cv.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    host.addEventListener('pointerleave', function () { mouse = null; });
    window.addEventListener('resize', function () { resize(); if (reduce) step(true); });
    document.addEventListener('visibilitychange', start);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start();
      }).observe(cv);
    }
  });
  /* 4. Filtre par numéro de leçon (page Agrégation) */
  var lf = document.querySelector('[data-lecon-filter]');
  if (lf) {
    var input = lf.querySelector('input');
    var clear = lf.querySelector('.lecon-clear');
    var status = lf.querySelector('.lecon-status');
    var defaultStatus = status.innerHTML;
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-filter] .dev'));
    var tagsHtml = items.map(function (li) { var t = li.querySelector('.tags'); return t ? t.innerHTML : null; });
    var plural = function (n, one, many) { return n + ' ' + (n > 1 ? many : one); };
    var apply = function () {
      var q = input.value.replace(/\D/g, '').slice(0, 3);
      if (input.value !== q) input.value = q;
      clear.hidden = !q;
      document.body.classList.toggle('filtering', !!q);
      var nPlans = 0, nDevs = 0;
      items.forEach(function (li, k) {
        var nums = (li.getAttribute('data-lecons') || '').split(/\s+/).filter(Boolean);
        var hit = !q || nums.some(function (n) { return n.indexOf(q) === 0; });
        li.classList.toggle('is-hidden', !hit);
        var t = li.querySelector('.tags');
        if (t) t.innerHTML = q && hit ? tagsHtml[k].replace(/\d{3}/g, function (n) { return n.indexOf(q) === 0 ? '<mark>' + n + '</mark>' : n; }) : tagsHtml[k];
        if (hit && q) { if (li.closest('#plans')) nPlans++; else nDevs++; }
      });
      document.querySelectorAll('[data-filter] h3').forEach(function (h) {
        var list = h.nextElementSibling;
        var any = list && list.querySelector('.dev:not(.is-hidden)');
        h.classList.toggle('is-hidden', !!q && !any);
      });
      document.querySelectorAll('[data-filter]').forEach(function (sec) {
        sec.classList.toggle('is-hidden', !!q && !sec.querySelector('.dev:not(.is-hidden)'));
      });
      if (!q) { status.innerHTML = defaultStatus; return; }
      if (!nPlans && !nDevs) { status.innerHTML = 'Rien pour la leçon <strong>' + q + '</strong> sur cette page. Essayez <a href="https://agreg-maths.fr/couplages/1100">agreg-maths</a>.'; return; }
      var parts = [];
      if (nPlans) parts.push(plural(nPlans, 'plan', 'plans'));
      if (nDevs) parts.push(plural(nDevs, 'développement', 'développements'));
      status.innerHTML = '<strong>' + parts.join(' et ') + '</strong> pour ' + (q.length < 3 ? 'les leçons ' + q + '…' : 'la leçon ' + q + '.');
    };
    input.addEventListener('input', apply);
    clear.addEventListener('click', function () { input.value = ''; apply(); input.focus(); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; apply(); } });
    var m = /^#lecon-(\d{1,3})$/.exec(location.hash);
    if (m) { input.value = m[1]; apply(); }
  }

  /* 5. Boutons « Copier » (BibTeX) */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var src = btn.parentNode.querySelector(btn.getAttribute('data-copy'));
      if (!src) return;
      var text = src.textContent;
      var label = btn.textContent;
      var done = function () { btn.textContent = btn.getAttribute('data-copied') || 'Copié'; setTimeout(function () { btn.textContent = label; }, 1800); };
      var fallback = function () {
        var r = document.createRange(); r.selectNodeContents(src);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        try { document.execCommand('copy'); done(); } catch (e) { /* texte sélectionné : Ctrl+C */ }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    });
  });
  /* 6. Date de mise à jour : date du dernier envoi sur le serveur (en-tête Last-Modified).
        Si le serveur ne la donne pas, le texte écrit dans la page reste affiché. */
  var lm = new Date(document.lastModified);
  if (!isNaN(lm) && Math.abs(Date.now() - lm.getTime()) > 60000) {
    document.querySelectorAll('[data-updated]').forEach(function (el) {
      var en = el.getAttribute('data-updated') === 'en';
      var d = lm.toLocaleDateString(en ? 'en-GB' : 'fr-FR', { month: 'long', year: 'numeric' });
      el.textContent = en ? 'Last updated ' + d : 'Mis à jour en ' + d;
    });
  }
})();
