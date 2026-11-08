/* AutoPlayer landing page - language (German / English only).
   German when the browser's first language is German (de, de-DE, de-AT, de-CH ...), English for
   everybody else. ?lang=de / ?lang=en - set by the switch in the header - overrides it.
   No cookie, no storage: the choice lives only in the address.
   Loaded in <head>; page.js calls APLang.apply() before anything is built. */
(function () {
  'use strict';
  var asked = /[?&]lang=(de|en)(?:&|$)/.exec(location.search);
  var first = (navigator.languages && navigator.languages[0]) || navigator.language || 'de';
  var lang = asked ? asked[1] : (/^de(-|$)/i.test(first) ? 'de' : 'en');
  var root = document.documentElement;
  root.lang = lang;
  root.classList.add('js-build');

  // texts that scripts write (the page's own texts are in index.html as data-en attributes)
  var TEXTS = {
    de: {
      petsOff: 'Pets aus', petsOn: 'Pets an',
      soundOn: 'Ton an', soundOff: 'Ton aus',
      soundOnLabel: 'Ton des Surf-the-Beat-Clips einschalten',
      soundOffLabel: 'Ton des Surf-the-Beat-Clips ausschalten',
      // sound button of the 30 s demo (page.js)
      musicOn: '♪ Ton an', musicOff: '♪ Ton aus', musicAgain: '↺ Demo mit Musik',
      musicOnLabel: 'Musik zur Demo einschalten', musicOffLabel: 'Musik ausschalten',
      musicAgainLabel: 'Demo mit Musik noch einmal von vorn',
      scoreChip: 'score 1.010.425 · alle 10 Level',
      music: 'audio/Neon-Baustelle.mp3',
      switchTitle: 'English version',
    },
    en: {
      petsOff: 'Pets off', petsOn: 'Pets on',
      soundOn: 'Sound on', soundOff: 'Sound off',
      soundOnLabel: 'Turn on the sound of the Surf the Beat clip',
      soundOffLabel: 'Turn off the sound of the Surf the Beat clip',
      musicOn: '♪ Sound on', musicOff: '♪ Sound off', musicAgain: '↺ Demo with music',
      musicOnLabel: 'Turn on the music of the demo', musicOffLabel: 'Turn off the music',
      musicAgainLabel: 'Demo with music once more from the start',
      scoreChip: 'score 1,766,913 · all 10 levels',   // the English win screen is another round (img/en/)
      // track 161 in English ("Neon Build Site", SUNO cover of the German one, Kay 07.11.2026)
      music: 'audio/Neon-Build-Site.mp3',
      switchTitle: 'Deutsche Fassung',
    },
  };
  function t(key) { return TEXTS[lang][key]; }

  // the pets' sentences: the app's own pools in this language (only this one is loaded)
  var pool = document.createElement('script');
  pool.src = 'js/pets/texts_' + lang + '.js';
  document.head.appendChild(pool);

  function apply() {
    if (lang === 'en') {
      document.querySelectorAll('[data-en]').forEach(function (el) { el.textContent = el.getAttribute('data-en'); });
      // English screenshots where the app shows text (player, turntable, win screen, Android Auto)
      ['src', 'alt', 'title', 'aria-label', 'content'].forEach(function (a) {
        document.querySelectorAll('[data-en-' + a + ']').forEach(function (el) { el.setAttribute(a, el.getAttribute('data-en-' + a)); });
      });
    }
    // links to the other pages of the site (handbook, legal texts) open in the same language
    document.querySelectorAll('a[data-lang-link]').forEach(function (a) {
      var base = a.getAttribute('href').split('?')[0];
      a.setAttribute('href', base + '?lang=' + lang);
    });
    // the switch links to the other language; all other parameters and the current anchor stay
    var sw = document.getElementById('langSwitch');
    if (sw) {
      var other = lang === 'en' ? 'de' : 'en';
      var target = function () {
        var params = new URLSearchParams(location.search);
        params.set('lang', other);
        return '?' + params.toString() + location.hash;
      };
      sw.href = target();
      sw.addEventListener('click', function () { sw.href = target(); });
      sw.textContent = other.toUpperCase();
      sw.hreflang = other;
      sw.lang = other;
      sw.title = t('switchTitle');
    }
  }

  // last big hit of the song (ms) - the five pets do their trick together on it (stage.js, demo 30 s);
  // measured: German 25.1 s, English 25.3 s
  var FINALE_MS = { de: 25000, en: 25200 };

  window.APLang = { lang: lang, t: t, apply: apply, finaleMs: FINALE_MS[lang] };
})();
