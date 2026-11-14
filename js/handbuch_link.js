/* AutoPlayer landing pages - every element that shows the app leads into its chapter of the manual,
   and the manual leads back to exactly that element (Wochentags-Konzept Datei 13, Kay 14.11.2026).
   - clickable once the element is built (a click during the demo ends the demo, as any click does)
   - the hint "Im Handbuch ›" only on the website, not in the videos (html.render hides it)
   - same tab; the way back is the button in the manual (handbuch/js/rueckweg.js)
   - nothing is stored: the way back lives only in the address (?zurueck=<tag>.<element-id>)
   The start page (Montag) gets its links from the table below, the weekday pages from their day
   configuration (js/tagbau.js calls APHandbuch.verlinke). */
(function () {
  'use strict';
  const L = window.APLang || { lang: 'de' };
  const tag = window.APTagKurz || 'mo';
  const en = L.lang === 'en';

  // Montag: element id -> chapter (id of the <article> in handbuch/index.html)
  const MONTAG = {
    heroPhone: 'player', cardAuto: 'androidauto', cardVoice: 'sprachbefehle', cardOcto: 'pets', cardOffline: 'bibliothek',
    fan0: 'kassette', fan1: 'jukebox', fan2: 'dj-turntable', fan3: 'bandmaschine', fan4: 'hologramm',
    st0: 'einstellungen', st1: 'sprachbefehle', st2: 'pets', st3: 'surf-the-beat',
    surfA: { kapitel: 'surf-the-beat', nurHinweis: true },   // tapping this phone switches the clip's sound
    surfB: 'surf-the-beat', surfWin: 'surf-the-beat',
    car: 'androidauto', ap0: 'sprachbefehle', ap1: 'bibliothek',
  };

  function ziel(kapitel, id) {
    const p = new URLSearchParams();
    if (en) p.set('lang', 'en');
    p.set('zurueck', tag + '.' + id);
    return 'handbuch/index.html?' + p.toString() + '#' + (en ? 'en-' : '') + kapitel;
  }

  function nameVon(el) {
    const img = el.querySelector('img, video');
    const b = el.querySelector('b');
    return (img && (img.getAttribute('alt') || img.getAttribute('aria-label'))) || (b && b.textContent) || '';
  }

  const offen = [];
  /** Makes `el` a way into the manual: a link over the whole element (or only on the hint). */
  function verlinke(el, kapitel, opts) {
    const o = opts || {};
    if (!el || !el.id || !/^[a-z0-9-]+$/.test(kapitel)) return;
    if (getComputedStyle(el).position === 'static') el.classList.add('hb-host');
    const a = document.createElement('a');
    a.href = ziel(kapitel, el.id);
    a.className = o.nurHinweis ? 'hb-hint hb-link' : 'hb-link';
    const name = nameVon(el);
    a.setAttribute('aria-label', (en ? 'In the manual: ' : 'Im Handbuch: ') + (name || kapitel));
    a.addEventListener('click', (e) => e.stopPropagation());   // not the phone's own click (clip sound)
    if (o.nurHinweis) {
      a.textContent = en ? 'In the manual ›' : 'Im Handbuch ›';
    } else {
      const h = document.createElement('span');
      h.className = 'hb-hint';
      h.setAttribute('aria-hidden', 'true');
      h.textContent = en ? 'In the manual ›' : 'Im Handbuch ›';
      a.appendChild(h);
    }
    el.appendChild(a);
    offen.push(el);
  }

  // clickable (and the hint visible) once the element is built
  function pruefe() {
    const E = window.APEngine;
    for (let i = offen.length - 1; i >= 0; i--) {
      if (!E || !E.isBuilt || E.isBuilt(offen[i])) { offen[i].classList.add('hb-bereit'); offen.splice(i, 1); }
    }
  }
  if (window.APEngine) window.APEngine.onFrame(pruefe);

  if (tag === 'mo') {
    Object.keys(MONTAG).forEach((id) => {
      const v = MONTAG[id];
      verlinke(document.getElementById(id), typeof v === 'string' ? v : v.kapitel, typeof v === 'string' ? null : v);
    });
  }

  window.APHandbuch = { verlinke, ziel, MONTAG };
})();
