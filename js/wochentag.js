/* AutoPlayer landing pages - which page a visitor sees (Wochentags-Konzept Datei 02).
   The weekday of the visitor's own device decides (local time): Montag = index.html, Dienstag bis
   Sonntag = tag.html?tag=di..so. ?tag=mo..so forces a day (tests, the "next use case" button).
   Loaded first in <head> of both pages, before anything is drawn.
   Stays where it is: demo / video export (?demo, ?render, ?t, ?clean) and the way back from the
   manual (?stelle) - those always mean the page in the address. */
(function () {
  'use strict';
  var KURZ = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'];
  var q = new URLSearchParams(location.search);
  var tag = q.get('tag');
  if (!/^(mo|di|mi|do|fr|sa|so)$/.test(tag || '')) tag = null;
  var fest = q.has('demo') || q.has('render') || q.has('t') || q.has('clean') || q.has('stelle');
  var heute = KURZ[new Date().getDay()];
  var aufTagSeite = /(^|\/)tag\.html$/.test(location.pathname);

  function weiter(seite, kurz) {
    q.set('tag', kurz);
    location.replace(seite + '?' + q.toString() + location.hash);
  }

  if (!aufTagSeite) {
    var ziel = tag || (fest ? 'mo' : heute);
    if (ziel !== 'mo') weiter('tag.html', ziel);
    window.APTagKurz = 'mo';
  } else {
    var z = tag || (fest ? 'di' : heute);
    if (z === 'mo') weiter('index.html', 'mo');
    window.APTagKurz = z;
  }
})();
