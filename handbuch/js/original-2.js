/* Aus BENUTZERHANDBUCH_NEU.html uebernommen von tools/website/baue_website.py - nicht von Hand aendern. */
/* Tabellen neben einem Bildschirmfoto: Laeuft eine im Streifen daneben ueber, weicht sie unter
   das Bild aus (Klasse unter-bild). Alle anderen bleiben daneben. Laeuft bei jedem Laden und
   nach jeder Groessenaenderung, in Dokumentreihenfolge - eine ausweichende Tabelle verschiebt
   die folgenden. */
(function () {
  function ordne() {
    var huellen = document.querySelectorAll('.tab-huelle');
    var i;
    for (i = 0; i < huellen.length; i++) huellen[i].classList.remove('unter-bild');
    for (i = 0; i < huellen.length; i++) {
      if (huellen[i].scrollWidth > huellen[i].clientWidth + 1) huellen[i].classList.add('unter-bild');
    }
  }
  var warte = null;
  window.addEventListener('resize', function () { clearTimeout(warte); warte = setTimeout(ordne, 150); });
  window.addEventListener('load', ordne);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ordne);
  ordne();
})();
