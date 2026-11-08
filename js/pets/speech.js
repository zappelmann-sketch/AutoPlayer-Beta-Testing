/* Vumikio Pets on the web - what a pet says. The texts are the app's own pools
   (js/pets/texts_de.js, generated from app/src/main/assets/vumikio/de by werkzeuge/texte_aus_app.py);
   filling the templates follows MoodTemplateEngine.kt / LexiconTemplateEngine.kt:
   {var} from the pool's vars (plus shared_vars), {var|cap} / {var|upper} modifiers, runtime
   values win, templates needing a runtime value that is not there are dropped. */
(function () {
  'use strict';
  const PHASES = ['BABY', 'KIND', 'TEEN', 'ADULT', 'STAR', 'MASTER', 'LEGEND', 'MYTHIC', 'DIVINE', 'ETERNAL'];
  const VAR = /\{([\p{L}\p{N}_]+)(?:\|(upper|cap))?\}/gu;
  // Values only the app knows (songs heard, level, streak): templates that need them are skipped.
  const RUNTIME_ONLY = ['level', 'songsHeard', 'streak', 'songTitle', 'artist', 'title', 'song'];

  function pick(list, rnd) { return list && list.length ? list[Math.floor(rnd() * list.length)] : null; }

  function hourBucket(h, keys) {
    if (keys.includes('noon')) return h < 11 ? 'morning' : h < 14 ? 'noon' : h < 18 ? 'afternoon' : h < 22 ? 'evening' : 'night';
    return h < 11 ? 'morning' : h < 18 ? 'day' : h < 22 ? 'evening' : 'night';
  }

  function fill(template, vars, runtime, rnd) {
    return template.replace(VAR, (m, key, mod) => {
      const raw = runtime[key] != null ? runtime[key] : pick(vars[key], rnd);
      if (raw == null) return m;
      if (mod === 'upper') return raw.toUpperCase();
      if (mod === 'cap') return raw.charAt(0).toUpperCase() + raw.slice(1);
      return raw;
    });
  }

  function usable(template, runtime) {
    return !RUNTIME_ONLY.concat(['bpm']).some((k) => template.includes('{' + k) && runtime[k] == null);
  }

  /** One pool { templates, vars } -> one line, or null. */
  function fromPool(pool, shared, runtime, rnd) {
    if (!pool) return null;
    if (Array.isArray(pool)) return pick(pool, rnd);
    const list = (pool.templates || []).filter((t) => usable(t, runtime));
    const tpl = pick(list, rnd);
    return tpl ? fill(tpl, Object.assign({}, shared, pool.vars || {}), runtime, rnd) : null;
  }

  function runtimeFor(T, bpm, now) {
    const h = now.getHours();
    const rt = { bpm: String(Math.round(bpm)) };
    const tod = T.timeOfDay && T.timeOfDay[hourBucket(h, Object.keys(T.timeOfDay))];
    const gr = T.greetings && T.greetings[hourBucket(h, Object.keys(T.greetings))];
    return { rt, tod, gr };
  }

  /** A line for a tap: mostly the mood, sometimes a fun fact from the lexicon. */
  function moodLine(petKey, mood, bpm, rnd) {
    const T = window.VPPets.texts && window.VPPets.texts[petKey];
    if (!T) return '';
    const { rt, tod, gr } = runtimeFor(T, bpm, new Date());
    const shared = T.shared || {};
    const tryPools = [];
    const r = rnd();
    if (r < 0.3 && T.lexicon) {
      const ph = Object.keys(T.lexicon);
      tryPools.push(T.lexicon[pick(ph, rnd)]);
    }
    if (r >= 0.3 && r < 0.42 && tod) tryPools.push(tod);
    if (r >= 0.42 && r < 0.5 && gr) tryPools.push(gr);
    const cat = mood === 'DANCING' || mood === 'EXCITED' ? (rnd() < 0.5 ? 'dancing' : 'bpm') : 'happy';
    const group = T.mood[cat] || T.mood.happy;
    if (group) {
      const sub = cat === 'bpm' ? (bpm < 90 ? 'slow' : bpm < 130 ? 'medium' : 'fast') : Object.keys(group)[0];
      tryPools.push(group[sub] || group[Object.keys(group)[0]]);
    }
    for (const pool of tryPools) {
      const line = fromPool(pool, shared, Object.assign({}, rt), rnd);
      if (line) return line;
    }
    return '';
  }

  /** The line that goes with a trick - from the phase the trick unlocks in or later. */
  function trickLine(petKey, trickType, trickIndex, rnd) {
    const T = window.VPPets.texts && window.VPPets.texts[petKey];
    const byPhase = T && T.tricks && T.tricks[trickType];
    if (!byPhase) return '';
    const from = Math.max(0, Math.min(9, trickIndex));
    const phase = PHASES[from + Math.floor(rnd() * (10 - from))];
    return pick(byPhase[phase] || byPhase[PHASES[from]], rnd) || '';
  }

  /** How long a bubble stays: ~15 characters a second, 2 s to 5 s (PetSpeechBubble.kt). */
  function durationMs(text) { return Math.max(2000, Math.min(5000, (text.length / 15) * 1000)); }

  window.VPSpeech = { moodLine, trickLine, durationMs };
})();
