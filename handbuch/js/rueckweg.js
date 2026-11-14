/* AutoPlayer manual - the way back to the landing page the visitor came from (Wochentags-Konzept
   Datei 13, Kay 14.11.2026). A landing page links here with ?zurueck=<tag>.<element-id>; then a
   button stays at the bottom: "← Zurück zu: Herzschlag-Sync". It leads back to that page with
   ?stelle=<element-id>: the page stands there built, scrolled to the element (js/engine.js).
   Without ?zurueck there is no button - the app shows the same manual without a landing page.
   Safe: the page comes from the fixed list in ../js/konstanten.js, the element id only from
   [a-zA-Z0-9-]; nothing from the address is used as an address. Nothing is stored.
   Loaded in <head> right after frueh.js: it reads ?zurueck before original-3.js rewrites the address
   (language switch); afterwards it puts it back. */
(function () {
  'use strict';
  var m = /[?&]zurueck=(mo|di|mi|do|fr|sa|so)\.([A-Za-z0-9-]{1,40})(?:&|$)/.exec(location.search);
  if (!m) return;
  var tag = m[1];
  var stelle = m[2];
  var wert = tag + '.' + stelle;

  function sprache() { return document.documentElement.lang === 'en' ? 'en' : 'de'; }

  function ziel() {
    var K = window.APKonst;
    var lang = sprache();
    if (K && K.adresse) return '../' + K.adresse(tag, lang, { stelle: stelle });
    return '../' + (tag === 'mo' ? 'index.html' : 'tag.html') + '?tag=' + tag + '&lang=' + lang + '&stelle=' + stelle;
  }

  function name() {
    var K = window.APKonst;
    var lang = sprache();
    if (tag === 'mo') return lang === 'en' ? 'Back to the home page' : 'Zurück zur Startseite';
    var d = K && K.tagVon ? K.tagVon(tag) : null;
    var thema = d ? d.thema[lang] : '';
    return (lang === 'en' ? 'Back to: ' : 'Zurück zu: ') + thema;
  }

  // the language switch and the chapter jumps rewrite the address - ?zurueck goes back in
  function behalten() {
    if (new RegExp('[?&]zurueck=' + wert.replace('.', '\\.') + '(&|$)').test(location.search)) return;
    var p = new URLSearchParams(location.search);
    p.set('zurueck', wert);
    try { history.replaceState(history.state, '', location.pathname + '?' + p.toString() + location.hash); } catch (e) { /* file:// */ }
  }

  var knopf = null;
  function zeigen() {
    if (!knopf) {
      knopf = document.createElement('a');
      knopf.className = 'rueckweg';
      document.body.appendChild(knopf);
    }
    // above the read-aloud bar at the bottom (its height changes with the screen width)
    var leiste = document.getElementById('tonleiste');
    knopf.style.setProperty('--rueck-unten', ((leiste ? leiste.offsetHeight : 0) + 14) + 'px');
    knopf.href = ziel();
    knopf.textContent = '← ' + name();
    knopf.lang = sprache();
  }

  document.addEventListener('DOMContentLoaded', function () { zeigen(); setTimeout(behalten, 0); });
  document.addEventListener('handbuch-sprache', function () { setTimeout(function () { behalten(); zeigen(); }, 0); });
  window.addEventListener('hashchange', function () { setTimeout(behalten, 0); });
  window.addEventListener('resize', function () { if (knopf) zeigen(); });
})();
