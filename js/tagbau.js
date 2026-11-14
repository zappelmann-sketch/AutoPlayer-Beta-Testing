/* AutoPlayer weekday pages (Dienstag bis Sonntag) - the shared build layer (Wochentags-Konzept Datei 04).
   One page (tag.html), the day decides: js/days/<tag>.js brings the content in German and English,
   js/styles/<stil>.js the way the pets build. This file writes the page from the day's configuration,
   gives every element its builder (the pet roles of Datei 06), times the demo to the day's song and
   links every element that shows the app to its chapter of the manual (Datei 13).
   Length: the song is not cut (Kay 14.11.2026) - demo, video and finale follow its length per language. */
(function () {
  'use strict';
  const L = window.APLang;
  const K = window.APKonst;
  const E = window.APEngine;
  const lang = L.lang === 'en' ? 'en' : 'de';
  const kurz = window.APTagKurz;
  const TAG = (window.APTage || {})[kurz];
  const STIL = (window.APStile || {})[TAG && TAG.stil];
  if (!TAG || !STIL) throw new Error('Wochentag fehlt: ' + kurz);
  const tx = (o) => (o == null ? '' : typeof o === 'string' ? o : o[lang]);
  const info = K.tagVon(kurz);
  const next = K.naechster(kurz);
  const song = TAG.song[lang];
  const DAUER = song.dauer;
  const SPEED = DAUER / 30;     // the 30 s choreography of the concept, stretched to the song

  // ---------- texts of the page frame ----------
  const RAHMEN = {
    de: { play: 'Bald bei Google Play', playPfeil: 'Bald bei Google Play →', mehr: '▶ So geht’s', oben: '↑ Zurück zum Start',
      weiter: 'Nächster Use Case', passt: 'Passt auch zu', handbuch: 'Handbuch', daten: 'Datenschutz',
      nutzung: 'Nutzungsbedingungen', impressum: 'Impressum', demo: 'Demo', demoMusik: 'Demo mit Musik',
      selbst: 'Selbst scrollen (ohne Demo)', werkzeuge: 'Werkzeuge', petHint: 'Pets: antippen = reden · doppelt = Trick · ziehen = mitnehmen' },
    en: { play: 'Soon on Google Play', playPfeil: 'Coming soon to Google Play →', mehr: '▶ How it works', oben: '↑ Back to the start',
      weiter: 'Next use case', passt: 'Goes well with', handbuch: 'Manual', daten: 'Privacy Policy',
      nutzung: 'Terms of Use', impressum: 'Legal Notice', demo: 'Demo', demoMusik: 'Demo with music',
      selbst: 'Scroll yourself (no demo)', werkzeuge: 'Tools', petHint: 'Pets: tap = talk · double-tap = trick · drag = take along' },
  }[lang];

  document.title = tx(TAG.titel);
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', tx(TAG.beschreibung));
  document.body.dataset.tag = kurz;
  // the song's last big hit = the finale of the pets (stage.js reads it when it loads, after this file)
  L.finaleMs = Math.round(song.finale * 1000);

  const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  set('fHandbuch', RAHMEN.handbuch); set('fDaten', RAHMEN.daten); set('fNutzung', RAHMEN.nutzung); set('fImpressum', RAHMEN.impressum);
  document.querySelector('#navCta span').textContent = RAHMEN.play;
  set('petHint', RAHMEN.petHint);
  const fab = document.getElementById('toolsFab');
  fab.title = RAHMEN.werkzeuge;
  const tool = (id, text, params) => {
    const a = document.getElementById(id);
    a.textContent = text;
    const p = new URLSearchParams({ tag: kurz, lang });
    Object.keys(params).forEach((k) => p.set(k, params[k]));
    a.href = '?' + p.toString();
  };
  tool('toolDemo', RAHMEN.demo, { demo: '30' });
  tool('toolDemoMusik', RAHMEN.demoMusik, { demo: '30', musik: '1' });
  tool('toolSelbst', RAHMEN.selbst, { demo: 'aus' });
  // Play Store: one place (js/konstanten.js); until the link exists, the button leads to the QR placeholder
  const storeUrl = K.playStore.url;
  document.getElementById('navCta').href = storeUrl || '#qr';

  // ---------- DOM ----------
  const main = document.getElementById('tagMain');
  function el(tag, cls, parent, attrs) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) Object.keys(attrs).forEach((k) => e.setAttribute(k, attrs[k]));
    if (parent) parent.appendChild(e);
    return e;
  }
  function textEl(tag, cls, parent, id, text) {
    const e = el(tag, cls, parent, { id, 'data-b': '' });
    // a dash never starts a line on its own ("Bleibt auf dem Geraet" / "-")
    e.textContent = String(text).replace(/ ([–—])/g, ' $1');
    return e;
  }
  /** A phone mockup with a screenshot of the app (German pictures on the German page, English on the English one). */
  function phone(parent, id, b) {
    const src = b[lang] || b.de;
    // the car's display (Android Auto, landscape) gets the car frame of the start page, all else a phone
    const p = el('div', b.auto ? 'car tag-car' : 'phone' + (b.teil ? ' teil' : '') + (b.klein ? ' klein' : ''), parent, { id, 'data-b': '' });
    if (b.ar) p.style.setProperty('--ar', typeof b.ar === 'string' ? b.ar : b.ar[lang]);
    if (b.w) p.style.setProperty('--w', b.w);
    const scr = el('div', 'scr', p);
    let img;
    if (b.video) {
      // a short screen recording of the app (moving picture), its still as poster
      img = el('video', null, scr, { src: tx(b.video), poster: src, preload: 'metadata', playsinline: '', loop: '', 'aria-label': tx(b.alt) });
      img.muted = true;
      clips.push(img);
    } else {
      img = el('img', null, scr, { src, alt: tx(b.alt), decoding: 'async' });
    }
    if (b.pos) img.style.objectPosition = b.pos;
    el('div', 'scan', scr);
    return p;
  }
  // screen recordings: live they play only while they can be seen; in the frame-by-frame export
  // they are set to the exact frame (the time since the page started, looped)
  const clips = [];
  let clipFrame = 0;
  E.onFrame((t) => {
    if (!clips.length) return;
    const y0 = window.scrollY;
    const y1 = y0 + window.innerHeight;
    clipFrame++;
    clips.forEach((v) => {
      const host = v.closest('[data-b]');
      // position measured twice a second, not in every frame (Datei 14)
      if (!v.lage || clipFrame % 30 === 0 || E.isRender()) v.lage = E.rectOf(host);
      const r = v.lage;
      const sichtbar = r.y + r.h > y0 && r.y < y1 && E.isBuilt(host);
      if (E.isRender()) {
        const want = (t % (v.duration || 6));
        if (Math.abs(v.currentTime - want) > 0.004) {
          v.pause();
          E.waitFor(new Promise((res) => { v.addEventListener('seeked', res, { once: true }); setTimeout(res, 1500); }));
          v.currentTime = want;
        }
      } else if (sichtbar && v.paused) v.play().catch(() => {});
      else if (!sichtbar && !v.paused) v.pause();
    });
  });
  function icon(name) {
    const I = {
      herz: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
      welle: 'M2 12h4l2-5 3 10 3-8 2 3h6',
      auto: 'M5 16v-5l2-5h10l2 5v5M3.5 11h17M5 16h14M6 16v2.5M18 16v2.5',
      mikro: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21',
      ort: 'M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
      uhr: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
      schleife: 'M7 7h10a4 4 0 0 1 0 8H9M9 11l-3 4 3 4',
      teilen: 'M7 12a2.5 2.5 0 1 0 0-.1M17 6a2.5 2.5 0 1 0 0-.1M17 18a2.5 2.5 0 1 0 0-.1M9.2 11l5.6-3.6M9.2 13l5.6 3.6',
      leute: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 19a5.5 5.5 0 0 1 11 0M16 11a2.5 2.5 0 1 0 0-5M15.5 14a5 5 0 0 1 6 5',
      schild: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z',
      welle2: 'M3 15c3 0 3-6 6-6s3 6 6 6 3-6 6-6',
      stern: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z',
      offline: 'M3 6.5h6l2 2h10V19H3zM3 10.5h18',
    };
    return '<svg viewBox="0 0 24 24"><path d="' + (I[name] || I.stern) + '"/></svg>';
  }

  const S = {};       // section id -> list of steps
  const add = (sec, sel, kind, agent, at, dur, extra) => { (S[sec] = S[sec] || []).push(Object.assign({ el: sel, kind, agent, at, dur }, extra || {})); };
  const GLASS = 'rgba(255,255,255,.065)';
  const MINT = '#62E8C8';
  const links = [];   // [element id, chapter, options]

  // ----- hero -----
  const H = TAG.hero;
  const hero = el('section', 'sec tag-hero', main, { id: 'hero' });
  textEl('span', 'eyebrow tag-badge', hero, 'hEye', tx(info.tag) + ' · ' + tx(info.thema));
  const h1 = el('h1', 'h-xl', hero);
  textEl('span', '', h1, 'h1a', tx(H.zeile1));
  textEl('span', 'accent', h1, 'h1b', tx(H.zeile2));
  textEl('p', 'lead', hero, 'heroLead', tx(H.lead));
  const row = el('div', 'cta-row', hero);
  const cta = el('a', 'btn btn-mint ph-able', row, { id: 'heroCta', 'data-b': '', href: storeUrl || '#qr' });
  el('span', null, cta).textContent = RAHMEN.playPfeil;
  const more = el('a', 'btn btn-glass glass ph-able', row, { id: 'heroMore', 'data-b': '', 'data-blur': '16', 'data-sat': '1.5', href: '#a1' });
  el('span', null, more).textContent = RAHMEN.mehr;
  const stage = el('div', 'tag-stage', hero, { id: 'stage' });
  el('div', 'stil-buehne', stage, { id: 'heroFx', 'aria-hidden': 'true' });
  phone(stage, 'heroPhone', H.bild);
  if (H.bild.kapitel) links.push(['heroPhone', H.bild.kapitel]);
  (H.karten || []).forEach((k, i) => {
    const c = el('div', 'card glass ph-able tag-card k' + i, stage, { id: 'hk' + i, 'data-b': '', 'data-blur': String(18 + i * 4), 'data-sat': '1.6' });
    c.innerHTML = '<i>' + icon(k.icon) + '</i><b></b><span></span>';
    c.querySelector('b').textContent = tx(k.titel);
    c.querySelector('span').textContent = tx(k.text);
    if (k.kapitel) links.push(['hk' + i, k.kapitel]);
  });
  add('hero', '#logo', 'box', 'chip-grid', 0.05, 0.3);
  add('hero', '#pills', 'box', 'octo-layout', 0.05, 0.3);
  add('hero', '#pills', 'fill', 'octo-layout', 0.4, 0.3, { label: GLASS, noChip: true });
  add('hero', '#pills', 'glass', 'foxy-glass', 0.35, 0.45);
  add('hero', '#navCta', 'box', 'foxy-color', 0.1, 0.3);
  add('hero', '#navCta', 'fill', 'foxy-color', 0.5, 0.3, { label: MINT });
  add('hero', '#hEye', 'type', 'chip-icons', 0.15, 0.35);
  add('hero', '#h1a', 'type', 'melo-type', 0.25, 0.55);
  add('hero', '#h1b', 'type', 'melo-copy', 0.4, 0.6);
  add('hero', '#heroLead', 'type', 'benny-a11y', 0.95, 0.8);
  add('hero', '#heroCta', 'box', 'foxy-color', 0.85, 0.28);
  add('hero', '#heroCta', 'fill', 'foxy-color', 1.15, 0.3, { label: MINT });
  add('hero', '#heroMore', 'box', 'chip-grid', 0.9, 0.28);
  add('hero', '#heroMore', 'fill', 'octo-layout', 1.25, 0.3, { label: GLASS, noChip: true });
  add('hero', '#heroMore', 'glass', 'foxy-glass', 1.2, 0.4);
  add('hero', '#heroPhone', 'box', 'benny-motion', 1.05, 0.35);
  add('hero', '#heroPhone', 'img', 'benny-motion', 1.45, 0.7);
  add('hero', '#heroFx', 'fn', 'octo-3d', 1.3, 1.3, Object.assign({ ax: 0.5, ay: 0.55 }, STIL.hero ? STIL.hero(TAG, lang) : {}));
  (H.karten || []).forEach((k, i) => {
    add('hero', '#hk' + i, 'box', i ? 'chip-icons' : 'chip-grid', 1.4 + i * 0.15, 0.3);
    add('hero', '#hk' + i, 'glass', 'foxy-glass', 1.75 + i * 0.15, 0.4);
    add('hero', '#hk' + i, 'fill', i ? 'melo-copy' : 'melo-type', 1.95 + i * 0.15, 0.3, { label: GLASS, noChip: i > 0 });
  });

  // ----- the five sections of the use case -----
  const ROLLE_BILD = ['benny-motion', 'foxy-glass', 'octo-layout', 'chip-grid', 'foxy-color'];
  TAG.abschnitte.forEach((a, n) => {
    const id = 'a' + (n + 1);
    const sec = el('section', 'sec tag-sec' + (n % 2 ? ' rechts' : ''), main, { id });
    const wrap = el('div', 'tag-row', sec);
    const text = el('div', 'tag-text', wrap);
    textEl('span', 'eyebrow', text, id + 'e', String(n + 1).padStart(2, '0') + ' · ' + tx(a.name));
    const h2 = el('h2', 'h-lg', text);
    textEl('span', '', h2, id + 't', tx(a.titel1));
    if (a.titel2) textEl('span', 'accent', h2, id + 'u', tx(a.titel2));
    textEl('p', 'sub', text, id + 'p', tx(a.text));
    const fakten = el('div', 'fakten', text);
    (a.fakten || []).forEach((f, i) => {
      const pill = el('div', 'pill glass ph-able', fakten, { id: id + 'f' + i, 'data-b': '', 'data-blur': '14', 'data-sat': '1.4' });
      pill.innerHTML = '<span><em>●</em><span></span></span>';
      pill.querySelector('span span').textContent = tx(f);
    });
    if (a.hinweis) textEl('p', 'tag-hinweis', text, id + 'h', tx(a.hinweis));
    const media = el('div', 'tag-media n' + a.bilder.length, wrap);
    el('div', 'stil-buehne', media, { id: id + 'x', 'aria-hidden': 'true' });
    a.bilder.forEach((b, i) => {
      const pid = id + 'b' + i;
      phone(media, pid, b);
      if (b.kapitel) links.push([pid, b.kapitel]);
    });
    // builders: the section's pet (Datei 06 / concept table) builds the main picture's frame
    const pet = a.pet || 'octo-layout';
    add(id, '#' + id + 'e', 'type', 'chip-icons', 0.1, 0.3);
    add(id, '#' + id + 't', 'type', 'melo-type', 0.2, 0.45);
    if (a.titel2) add(id, '#' + id + 'u', 'type', 'melo-copy', 0.32, 0.5);
    add(id, '#' + id + 'p', 'type', 'benny-a11y', 0.8, 0.65);
    a.bilder.forEach((b, i) => {
      add(id, '#' + id + 'b' + i, 'box', i ? ROLLE_BILD[(n + i) % 5] : pet, 0.3 + i * 0.15, 0.35);
      add(id, '#' + id + 'b' + i, 'img', i ? 'benny-motion' : ROLLE_BILD[n % 5], 0.75 + i * 0.18, 0.6);
    });
    add(id, '#' + id + 'x', 'fn', pet, 1.0, 1.4, Object.assign({ ax: 0.5, ay: 0.5 }, STIL.effekt ? STIL.effekt(a, n, TAG, lang) : {}));
    (a.fakten || []).forEach((f, i) => {
      add(id, '#' + id + 'f' + i, 'box', i % 2 ? 'chip-icons' : 'chip-grid', 1.0 + i * 0.12, 0.25);
      add(id, '#' + id + 'f' + i, 'glass', 'foxy-glass', 1.2 + i * 0.12, 0.3, { noChip: i > 0 });
      add(id, '#' + id + 'f' + i, 'fill', 'foxy-color', 1.25 + i * 0.12, 0.3, { label: GLASS, noChip: true });
    });
    if (a.hinweis) add(id, '#' + id + 'h', 'type', 'melo-copy', 1.5, 0.5);
  });

  // ----- closing: the motto with the pets, the connections, two buttons (Datei 03 Punkt 11) -----
  const Z = TAG.ende;
  const ende = el('section', 'sec tag-ende', main, { id: 'ende' });
  const card = el('div', 'cta-card glass ph-able', ende, { id: 'endCard', 'data-b': '', 'data-blur': '18', 'data-sat': '1.5' });
  const h2 = el('h2', 'h-lg', card);
  textEl('span', '', h2, 'eA', tx(Z.zeile1));
  textEl('span', 'accent', h2, 'eB', tx(Z.zeile2));
  textEl('p', 'sub', card, 'eSub', tx(Z.text));
  const passt = el('div', 'passt', card, { id: 'passt', 'data-b': '' });
  el('span', 'passt-titel', passt).textContent = RAHMEN.passt + ':';
  (Z.verbindungen || []).forEach((v) => {
    const d = K.tagVon(v.tag);
    const a = el('a', 'passt-link', passt, { href: K.adresse(v.tag, lang) });
    a.innerHTML = '<b></b><span></span>';
    a.querySelector('b').textContent = tx(d.tag) + ' · ' + tx(d.thema);
    a.querySelector('span').textContent = tx(v.text);
  });
  const knoepfe = el('div', 'tag-knoepfe', card);
  const oben = el('a', 'btn btn-glass glass ph-able', knoepfe, { id: 'btnOben', 'data-b': '', 'data-blur': '16', 'data-sat': '1.5', href: '#hero' });
  el('span', null, oben).textContent = RAHMEN.oben;
  const weiter = el('a', 'btn btn-mint ph-able', knoepfe, { id: 'btnWeiter', 'data-b': '', href: K.adresse(next.kurz, lang) });
  el('span', null, weiter).textContent = RAHMEN.weiter + ': ' + tx(next.tag) + ' · ' + tx(next.thema) + ' →';
  if (Z.hinweis) textEl('p', 'tag-hinweis', card, 'eHinweis', tx(Z.hinweis));
  el('div', 'horizon', card, { id: 'horizon' });
  // "Zurueck zum Start": to the top and the page once more from there
  oben.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  add('ende', '#endCard', 'box', 'octo-layout', 0.15, 0.4);
  add('ende', '#endCard', 'glass', 'foxy-glass', 0.55, 0.5);
  add('ende', '#endCard', 'fill', 'octo-layout', 0.6, 0.3, { label: GLASS, noChip: true });
  add('ende', '#eA', 'type', 'melo-type', 0.7, 0.45);
  add('ende', '#eB', 'type', 'melo-copy', 0.8, 0.5);
  add('ende', '#eSub', 'type', 'benny-a11y', 1.1, 0.5);
  add('ende', '#passt', 'box', 'chip-grid', 1.2, 0.3);
  add('ende', '#btnOben', 'box', 'chip-icons', 1.35, 0.28);
  add('ende', '#btnOben', 'fill', 'octo-layout', 1.6, 0.3, { label: GLASS, noChip: true });
  add('ende', '#btnOben', 'glass', 'foxy-glass', 1.55, 0.35, { noChip: true });
  add('ende', '#btnWeiter', 'box', 'foxy-color', 1.4, 0.28);
  add('ende', '#btnWeiter', 'fill', 'foxy-color', 1.7, 0.3, { label: MINT });
  if (Z.hinweis) add('ende', '#eHinweis', 'type', 'benny-a11y', 1.6, 0.4);
  add('ende', '#horizon', 'fn', 'octo-3d', 0.9, 0.8, {
    init: () => document.getElementById('horizon').style.setProperty('--hz', '0'),
    apply: (p) => E.setVar(document.getElementById('horizon'), '--hz', E.EASE.out(p).toFixed(3)),
    chip: (p) => 'horizon · scaleX(' + E.EASE.out(p).toFixed(2) + ')',
    ay: 0.05,
  });
  add('ende', '#foot', 'box', 'chip-grid', 1.9, 0.3);

  // language: the page itself is written in its language; the switch keeps day and parameters
  L.apply();

  // manual links (Datei 13)
  links.forEach(([id, kapitel, o]) => window.APHandbuch.verlinke(document.getElementById(id), kapitel, o));

  // ---------- builders and style ----------
  E.agents([
    { id: 'octo', color: '#4fe3ff', roles: ['octo-layout', 'octo-3d'] },
    { id: 'melo', color: '#c4a8ff', roles: ['melo-type', 'melo-copy'] },
    { id: 'benny', color: '#ff9ccf', roles: ['benny-motion', 'benny-a11y'] },
    { id: 'foxy', color: '#ff9a52', roles: ['foxy-color', 'foxy-glass'] },
    { id: 'chip', color: '#ffd666', roles: ['chip-grid', 'chip-icons'] },
  ]);
  E.useStyle(STIL);
  ['hero'].concat(TAG.abschnitte.map((a, n) => 'a' + (n + 1)), ['ende']).forEach((sec) => E.section('#' + sec, S[sec]));

  // ---------- the demo: each part of the page in its time window of the song ----------
  // concept windows (of 30 s): hero 0-4, then 4-9, 9-14, 14-19, 19-24, 24-27, closing 27-30 -
  // stretched to the song; the closing card arrives in time for the finale (song.finale)
  const vh = () => window.innerHeight;
  const mid = (sel, px) => () => { const r = E.rectOf(document.querySelector(sel)); return r.y + r.h / 2 - vh() / 2 + (px || 0); };
  const END = () => document.documentElement.scrollHeight;
  const GRENZEN = TAG.fenster || [4, 9, 14, 19, 24, 27];
  const f = (s) => s * SPEED;
  // a part that is taller than the screen (phones: text above, pictures below) is travelled from its
  // top to its bottom during its window; one that fits stands in the middle and drifts a little
  const lage = (sel, wo) => () => {
    const r = E.rectOf(document.querySelector(sel));
    const h = vh();
    if (r.h <= h * 0.9) return r.y + r.h / 2 - h / 2 + (wo === 'ende' ? 30 : 0);
    return wo === 'anfang' ? r.y - h * 0.05 : r.y + r.h - h * 0.95;
  };
  const keys = [[0, 0], [Math.min(1.6, f(GRENZEN[0]) - 1.6), 0], [f(GRENZEN[0]) - 0.9, () => Math.max(0, lage('#hero', 'ende')()), 'sine']];
  TAG.abschnitte.forEach((a, n) => {
    const a0 = f(GRENZEN[n]);
    const a1 = f(GRENZEN[n + 1]);
    keys.push([a0 + 0.2, lage('#a' + (n + 1), 'anfang')], [a1 - 0.9, lage('#a' + (n + 1), 'ende'), 'sine']);
  });
  const endeAb = f(GRENZEN[5]) + 0.2;
  keys.push([endeAb, mid('#ende')], [DAUER - 0.5, mid('#ende', 20), 'sine']);
  keys.sort((x, y) => x[0] - y[0]);

  const musik = window.APMusik.create(song.datei, { only: '30' });
  E.start({
    gate: musik.gate,
    clockOf: musik.clockOf,
    onReady: () => { if (STIL.ready) STIL.ready(TAG, lang); },
    demos: { 30: { duration: DAUER, speed: SPEED, keys } },
  });
  window.APTagSeite = { TAG, STIL, lang, kurz, DAUER, keys, END };
})();
