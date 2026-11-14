/* AutoPlayer landing prototype - the swarm and its choreography.
   The builders are the five Vumikio Pets, each with two roles. Times are seconds after the
   section starts building (see TRIGGER in engine.js). */
(function () {
  'use strict';
  // language first: the texts must be in place before the builders measure and type them
  const L = window.APLang || { lang: 'de', t: (k) => k, apply: () => {} };
  L.apply();
  // "Naechster Use Case": target and label from the one list of the seven pages (js/konstanten.js)
  const K = window.APKonst;
  const weiterBtn = document.getElementById('ctaWeiter');
  if (K && weiterBtn) {
    const next = K.naechster('mo');
    const tx = (o) => o[L.lang] || o.de;
    weiterBtn.href = K.adresse(next.kurz, L.lang);
    weiterBtn.querySelector('span').textContent =
      (L.lang === 'en' ? 'Next use case' : 'Nächster Use Case') + ': ' + tx(next.tag) + ' · ' + tx(next.thema) + ' →';
  }
  const E = window.APEngine;
  const ring = { obj: null };

  // The swarm are the five Vumikio Pets themselves (js/pets/stage.js flies them to their jobs);
  // each pet has two roles. Chips, boxes and the typing caret take the pet's colour.
  E.agents([
    { id: 'octo', color: '#4fe3ff', roles: ['octo-layout', 'octo-3d'] },
    { id: 'melo', color: '#c4a8ff', roles: ['melo-type', 'melo-copy'] },
    { id: 'benny', color: '#ff9ccf', roles: ['benny-motion', 'benny-a11y'] },
    { id: 'foxy', color: '#ff9a52', roles: ['foxy-color', 'foxy-glass'] },
    { id: 'chip', color: '#ffd666', roles: ['chip-grid', 'chip-icons'] },
  ]);

  const GLASS = 'rgba(255,255,255,.065)';
  const MINT = '#62E8C8';
  const step = (el, kind, agent, at, dur, extra) => Object.assign({ el, kind, agent, at, dur }, extra || {});

  // ---------- hero ----------
  const heroSteps = [
    step('#logo', 'box', 'chip-grid', 0.05, 0.3),
    step('#logo', 'fn', 'chip-icons', 0.4, 0.4, { chip: () => 'icon 512 × 512 · png' }),
    step('#pills', 'box', 'octo-layout', 0.05, 0.35),
    step('#pills', 'fill', 'octo-layout', 0.5, 0.35, { label: GLASS, noChip: true }),
    step('#pills', 'glass', 'foxy-glass', 0.45, 0.5),
    step('#navCta', 'box', 'foxy-color', 0.1, 0.3),
    step('#navCta', 'fill', 'foxy-color', 0.5, 0.3, { label: MINT }),
    step('#h1a', 'type', 'melo-type', 0.2, 0.55),
    step('#h1b', 'type', 'melo-copy', 0.28, 0.5),
    step('#h1a', 'fn', 'benny-a11y', 0.85, 0.5, { chip: () => 'contrast 17.0:1 · AAA', ax: 0.82, ay: 0.9 }),
    step('#heroLead', 'type', 'melo-copy', 0.85, 0.8),
    step('#heroCta', 'box', 'foxy-color', 0.78, 0.28),
    step('#heroCta', 'fill', 'foxy-color', 1.1, 0.3, { label: MINT }),
    step('#heroDemo', 'box', 'chip-grid', 0.8, 0.28),
    step('#heroDemo', 'fill', 'octo-layout', 1.2, 0.3, { label: GLASS, noChip: true }),
    step('#heroDemo', 'glass', 'foxy-glass', 1.12, 0.45),
    step('#ringAnchor', 'fn', 'octo-3d', 1.25, 0.8, {
      dx: 300, dy: 40,
      apply: (p) => { ring.obj.params.grow = E.EASE.back(p); },
      chip: (p) => 'ring(32 bars) · r=' + Math.round((ring.obj ? ring.obj.rMax : 360) * E.EASE.out(p)) + ' · glow 0.9',
    }),
    step('#ringAnchor', 'fn', 'octo-3d', 2.4, 0.9, {
      dx: -320, dy: 60,
      apply: (p) => { ring.obj.params.bars = 32 + 64 * E.EASE.inOut(p); ring.obj.params.orbits = 3 * p; },
      chip: (p) => 'bars 32 → ' + Math.round(32 + 64 * E.EASE.inOut(p)) + ' · orbits ' + (3 * p).toFixed(1),
    }),
    step('#heroPhone', 'box', 'benny-motion', 1.0, 0.35),
    step('#heroPhone', 'img', 'benny-motion', 1.4, 0.65),
    step('#cardAuto', 'box', 'chip-grid', 1.35, 0.3),
    step('#cardAuto', 'glass', 'foxy-glass', 1.7, 0.45),
    step('#cardAuto', 'fill', 'melo-type', 1.95, 0.3, { label: GLASS }),
    step('#cardOcto', 'box', 'octo-layout', 1.5, 0.3),
    step('#cardOcto', 'fill', 'melo-copy', 2.0, 0.3, { label: GLASS, noChip: true }),
    step('#cardOcto', 'glass', 'foxy-glass', 2.2, 0.4),
    step('#cardVoice', 'box', 'chip-icons', 1.6, 0.3),
    step('#cardVoice', 'glass', 'benny-a11y', 2.0, 0.4),
    step('#cardVoice', 'fill', 'chip-icons', 2.35, 0.3, { label: GLASS, noChip: true }),
    step('#cardOffline', 'box', 'chip-grid', 1.8, 0.3),
    step('#cardOffline', 'fill', 'octo-layout', 2.5, 0.3, { label: GLASS, noChip: true }),
    step('#cardOffline', 'glass', 'foxy-glass', 2.65, 0.4),
  ];
  // Phones (layout in style.css, max-width 860px): the hero stacks - two cards, the phone in its
  // ring, two cards - and is taller than the screen. So each part becomes a section of its own and
  // builds when it comes into view. A part that is on screen right away keeps the desktop timing
  // (it builds together with the headline); a part further down starts promptly once scrolled in.
  const STACKED = window.matchMedia('(max-width: 860px)').matches;
  if (STACKED) heroOnPhones(heroSteps);
  else E.section('#hero', heroSteps);

  function heroOnPhones(all) {
    const shown = all.filter((s) => document.querySelector(s.el).getClientRects().length > 0);
    const parts = [
      ['#cardAuto', ['#cardAuto', '#cardOcto']],
      ['#heroPhone', ['#heroPhone', '#ringAnchor']],
      ['#cardVoice', ['#cardVoice', '#cardOffline']],
    ];
    const inParts = parts.reduce((acc, p) => acc.concat(p[1]), []);
    E.section('#hero', shown.filter((s) => !inParts.includes(s.el)));
    const reach = window.innerWidth * 0.3;   // chips beside the ring stay on the narrow screen
    parts.forEach(([trigger, sels]) => {
      let list = shown.filter((s) => sels.includes(s.el))
        .map((s) => (s.dx ? Object.assign({}, s, { dx: Math.sign(s.dx) * Math.min(Math.abs(s.dx), reach) }) : s));
      if (!onScreenNow(trigger)) {
        const t0 = Math.min.apply(null, list.map((s) => s.at)) - 0.2;
        list = list.map((s) => Object.assign({}, s, { at: s.at - t0 }));
      }
      E.section(trigger, list);
    });
  }

  // same rule as the engine: at least half of the part (or of the screen) is visible
  function onScreenNow(sel) {
    const r = document.querySelector(sel).getBoundingClientRect();
    const seen = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    return seen / Math.max(1, Math.min(r.height, window.innerHeight)) >= 0.5;
  }

  // ---------- players fan ----------
  const fanBox = ['chip-grid', 'octo-layout', 'foxy-color', 'benny-motion', 'chip-icons'];
  const fanImg = ['foxy-glass', 'benny-motion', 'octo-layout', 'chip-grid', 'foxy-color'];
  E.section('#players', [
    step('#pA', 'type', 'melo-type', 0.25, 0.45),
    step('#pB', 'type', 'melo-copy', 0.32, 0.5),
    step('#pSub', 'type', 'benny-a11y', 0.8, 0.6),
    step('#fan', 'fn', 'octo-3d', 0.35, 1.1, {
      ay: 0.75,
      init: () => document.getElementById('fan').style.setProperty('--spread', '0'),
      apply: (p) => document.getElementById('fan').style.setProperty('--spread', E.EASE.back(p).toFixed(3)),
      chip: (p) => 'spread ' + p.toFixed(2) + ' · rotateZ(±' + Math.round(16 * p) + '°) · perspective 1400px',
    }),
  ].concat(
    fanBox.map((a, i) => step('#fan' + i, 'box', a, 0.3 + i * 0.08, 0.3)),
    fanImg.map((a, i) => step('#fan' + i, 'img', a, 0.75 + i * 0.12, 0.55)),
  ));

  // ---------- numbers ----------
  const stBox = ['chip-grid', 'octo-layout', 'chip-icons', 'foxy-color', 'benny-motion', 'octo-3d'];
  const stCount = ['melo-copy', 'melo-type', 'chip-grid', 'octo-layout', 'chip-icons', 'foxy-color'];
  E.section('#numbers', [
    step('#nA', 'type', 'melo-type', 0.2, 0.4),
    step('#nB', 'type', 'melo-copy', 0.26, 0.45),
  ].concat(
    stBox.map((a, i) => step('#st' + i, 'box', a, 0.3 + i * 0.07, 0.28)),
    [0, 1, 2, 3, 4, 5].map((i) => step('#st' + i, 'glass', i % 2 ? 'benny-a11y' : 'foxy-glass', 0.7 + i * 0.1, 0.35)),
    stCount.map((a, i) => step('#st' + i, 'count', a, 0.75 + i * 0.08, 0.9, { from: i === 5 ? 10 : 0 })),
    stBox.map((a, i) => step('#st' + i, 'fill', a, 0.8 + i * 0.06, 0.3, { label: GLASS, noChip: true })),
  ));

  // ---------- surf the beat ----------
  E.section('#surf', [
    step('#sEye', 'type', 'chip-icons', 0.15, 0.3),
    step('#sA', 'type', 'melo-type', 0.25, 0.4),
    step('#sB', 'type', 'melo-copy', 0.3, 0.55),
    step('#sSub', 'type', 'benny-a11y', 0.8, 0.6),
    step('#surfA', 'box', 'benny-motion', 0.3, 0.32),
    step('#surfA', 'img', 'foxy-glass', 0.7, 0.55),
    step('#surfB', 'box', 'octo-layout', 0.4, 0.32),
    step('#surfB', 'img', 'octo-3d', 0.85, 0.55),
    step('#surfWin', 'box', 'chip-grid', 0.55, 0.3),
    step('#surfWin', 'img', 'foxy-color', 1.0, 0.5),
    step('#surfWin', 'fn', 'chip-icons', 1.5, 0.6, { chip: () => L.t('scoreChip'), ay: 0.45 }),
  ]);

  // ---------- android auto ----------
  const apAgents = ['chip-grid', 'chip-icons', 'foxy-color'];
  E.section('#auto', [
    step('#aA', 'type', 'melo-type', 0.2, 0.4),
    step('#aB', 'type', 'melo-copy', 0.28, 0.5),
    step('#car', 'box', 'octo-layout', 0.3, 0.4),
    step('#car', 'img', 'benny-motion', 0.8, 0.7),
    step('#car', 'fn', 'octo-3d', 1.0, 0.6, { chip: () => 'perspective 1600px · rotateX(9°)', ax: 0.15, ay: 0.2 }),
  ].concat(
    apAgents.map((a, i) => step('#ap' + i, 'box', a, 0.5 + i * 0.1, 0.28)),
    [0, 1, 2].map((i) => step('#ap' + i, 'glass', 'foxy-glass', 1.0 + i * 0.12, 0.3, { noChip: i > 0 })),
    apAgents.map((a, i) => step('#ap' + i, 'fill', a, 1.05 + i * 0.1, 0.3, { label: GLASS, noChip: true })),
  ));

  // ---------- call to action ----------
  E.section('#cta', [
    step('#ctaCard', 'box', 'octo-layout', 0.2, 0.4),
    step('#ctaCard', 'glass', 'foxy-glass', 0.65, 0.5),
    step('#ctaCard', 'fill', 'octo-layout', 0.7, 0.3, { label: GLASS, noChip: true }),
    step('#cA', 'type', 'melo-type', 0.8, 0.4),
    step('#cB', 'type', 'melo-copy', 0.85, 0.4),
    step('#cSub', 'type', 'benny-a11y', 1.15, 0.45),
    // the two buttons built like at the end of the weekday pages (js/tagbau.js)
    step('#ctaBtn', 'box', 'chip-icons', 1.0, 0.28),
    step('#ctaBtn', 'fill', 'octo-layout', 1.25, 0.3, { label: GLASS, noChip: true }),
    step('#ctaBtn', 'glass', 'foxy-glass', 1.2, 0.35, { noChip: true }),
    step('#ctaWeiter', 'box', 'foxy-color', 1.08, 0.28),
    step('#ctaWeiter', 'fill', 'foxy-color', 1.35, 0.3, { label: MINT }),
    step('#horizon', 'fn', 'octo-3d', 0.9, 0.8, {
      init: () => document.getElementById('horizon').style.setProperty('--hz', '0'),
      apply: (p) => document.getElementById('horizon').style.setProperty('--hz', E.EASE.out(p).toFixed(3)),
      chip: (p) => 'horizon · scaleX(' + E.EASE.out(p).toFixed(2) + ') · glow 140px',
      ay: 0.05,
    }),
    step('#foot', 'box', 'chip-grid', 1.4, 0.3),
  ]);

  // ---------- per-frame extras ----------
  const surfClip = document.querySelector('#surfA video');
  // the ring is drawn only while the hero can be seen (two canvases per frame for nothing otherwise)
  const heroEl = document.getElementById('hero');
  let heroBottom = 0;
  const measureHero = () => { const r = heroEl.getBoundingClientRect(); heroBottom = r.bottom + window.scrollY; };
  window.addEventListener('resize', measureHero);
  E.onFrame((t) => {
    if (!heroBottom) measureHero();
    if (ring.obj && window.scrollY < heroBottom) ring.obj.draw(t);
    const z = (1.035 + 0.035 * Math.sin(t * 0.55)).toFixed(4);
    ['surfA', 'surfB'].forEach((id) => document.getElementById(id).style.setProperty('--zoom', z));
    if (surfClip) syncClip(surfClip, t);
  });

  // The real round of Surf the Beat starts when its phone is revealed (img step at 0.7 s).
  // Live it simply plays; in the frame-by-frame export it is seeked to the exact frame.
  function syncClip(v, t) {
    const st = E.sectionStart('#surf');
    if (st == null) return;
    const local = t - (st + 0.7);
    if (local < 0) return;
    if (E.isRender()) {
      const want = local % (v.duration || 15);
      if (Math.abs(v.currentTime - want) > 0.004) {
        v.pause();
        E.waitFor(new Promise((res) => { v.addEventListener('seeked', res, { once: true }); setTimeout(res, 1500); }));
        v.currentTime = want;
      }
    } else if (v.paused) {
      v.play().catch(() => {});
    }
  }

  // Sound of the Surf the Beat clip: a tap on its phone switches it on and off. The clip keeps
  // looping either way; if the demo music still plays, it stops so two beats never overlap.
  const soundBtn = document.getElementById('clipSound');
  function toggleClipSound(e) {
    if (e) e.stopPropagation();
    if (!surfClip || document.documentElement.classList.contains('demo')) return;
    const on = surfClip.muted;
    surfClip.muted = !on;
    if (on) {
      surfClip.volume = 1;
      surfClip.play().catch(() => {});
      const demoMusic = musik.audio();
      if (demoMusic && !demoMusic.paused) demoMusic.pause();
    }
    soundBtn.classList.toggle('on', on);
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.title = on ? L.t('soundOff') : L.t('soundOn');
    soundBtn.setAttribute('aria-label', on ? L.t('soundOffLabel') : L.t('soundOnLabel'));
  }
  if (soundBtn) {
    soundBtn.addEventListener('click', toggleClipSound);
    document.getElementById('surfA').addEventListener('click', toggleClipSound);
  }

  // The 30 s demo with its song "Neon-Baustelle" / "Neon Build Site" (track 161) - on the start page
  // by itself (Kay 08.11.2026), and with ?demo=30&musik=1. Song and sound button: js/demomusik.js.
  const musik = window.APMusik.create(L.t('music'), { only: '30' });

  // ---------- demo scroll scripts ----------
  const vh = () => window.innerHeight;
  const END = () => document.documentElement.scrollHeight;
  const at = (sel, frac) => () => E.rectOf(document.querySelector(sel)).y - vh() * frac;
  // the middle of a section in the middle of the screen (+ px to drift on while holding)
  const mid = (sel, px) => () => { const r = E.rectOf(document.querySelector(sel)); return r.y + r.h / 2 - vh() / 2 + (px || 0); };

  E.start({
    gate: musik.gate,
    clockOf: musik.clockOf,
    onReady: () => {
      ring.obj = new window.APRing(document.getElementById('ringBack'), document.getElementById('ringFront'));
      window.addEventListener('resize', () => ring.obj.resize());
    },
    // Each section rolls in, builds where it can be seen (engine: once half of it is on screen),
    // holds, moves on. 30 s: holds on the parts of the song "Neon-Baustelle" (track 161) -
    // first drop 9 s = numbers, "Deine Sammlung" 13.4 s = Surf the Beat, peak 19-21 s = Android
    // Auto, "AutoPlayer." 24.2 s = closing card, last hit 25 s = finale of the pets (stage.js).
    demos: {
      15: {
        duration: 15, speed: 0.75,
        keys: [
          [0, 0], [2.6, 0],
          [3.6, mid('#players')], [4.8, mid('#players', 24), 'sine'],
          [5.8, mid('#numbers')], [7.0, mid('#numbers', 24), 'sine'],
          [8.0, mid('#surf')], [9.6, mid('#surf', 24), 'sine'],
          [10.6, mid('#auto')], [11.8, mid('#auto', 24), 'sine'],
          [12.8, END], [15, END],
        ],
      },
      30: {
        duration: 30,
        keys: [
          [0, 0], [4.0, 0],
          [5.6, mid('#players')], [7.6, mid('#players', 30), 'sine'],
          [8.9, mid('#numbers')], [11.4, mid('#numbers', 30), 'sine'],
          [12.8, mid('#surf')], [16.6, mid('#surf', 40), 'sine'],
          [18.2, mid('#auto')], [21.2, mid('#auto', 30), 'sine'],
          [23.0, END], [30, END],
        ],
      },
    },
  });
})();
