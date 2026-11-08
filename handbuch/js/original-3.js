/* Aus BENUTZERHANDBUCH_NEU.html uebernommen von tools/website/baue_website.py - nicht von Hand aendern. */
(function () {
  "use strict";
  var fassung = { de: document.querySelector('main.sprache[data-lang="de"]'),
                  en: document.querySelector('main.sprache[data-lang="en"]') };
  var titel = { de: "AutoPlayer – Benutzerhandbuch", en: "AutoPlayer – User Guide" };
  var knoepfe = document.querySelectorAll(".sprachwahl a[data-lang]");
  var jetzt = "de";
  if (!fassung.de || !fassung.en) { return; }

  function spracheVon(anker) { return anker.indexOf("en-") === 0 ? "en" : "de"; }
  function umgesetzt(anker, ziel) {
    var basis = anker.replace(/^en-/, "");
    return ziel === "en" ? "en-" + basis : basis;
  }

  // Kapitel oder Bereichsueberschrift, die gerade oben steht - dorthin springt der Wechsel.
  function obenImBlick() {
    var stellen = fassung[jetzt].querySelectorAll("h2.kategorie[id], article[id]");
    var treffer = null;
    for (var i = 0; i < stellen.length; i++) {
      if (stellen[i].getBoundingClientRect().top > 120) { break; }
      treffer = stellen[i];
    }
    return treffer ? treffer.id : "";
  }

  function adresse(ziel, anker) {
    var basis = location.pathname + (ziel === "en" ? "?lang=en" : "");
    try { history.replaceState(null, "", basis + (anker ? "#" + anker : "")); } catch (e) {}
  }

  function zeige(ziel, anker) {
    jetzt = ziel;
    fassung.de.hidden = ziel !== "de";
    fassung.en.hidden = ziel !== "en";
    document.documentElement.lang = ziel;
    document.title = titel[ziel];
    for (var i = 0; i < knoepfe.length; i++) {
      if (knoepfe[i].getAttribute("data-lang") === ziel) { knoepfe[i].setAttribute("aria-current", "true"); }
      else { knoepfe[i].removeAttribute("aria-current"); }
    }
    document.dispatchEvent(new CustomEvent("handbuch-sprache", { detail: ziel }));
    adresse(ziel, anker);
    var stelle = anker ? document.getElementById(anker) : null;
    if (stelle) { stelle.scrollIntoView(); }
    // Tabellen neben Bildern messen sich in der neu sichtbaren Fassung neu (Skript davor).
    window.dispatchEvent(new Event("resize"));
  }

  for (var i = 0; i < knoepfe.length; i++) {
    knoepfe[i].addEventListener("click", function (e) {
      e.preventDefault();
      var ziel = this.getAttribute("data-lang");
      if (ziel === jetzt) { return; }
      var anker = obenImBlick();
      zeige(ziel, anker ? umgesetzt(anker, ziel) : "");
    });
  }

  // Sprache und Ziel aus der Adresse: ?lang= geht vor, sonst verraet es der Anker.
  function ausAdresse() {
    var anker = decodeURIComponent(location.hash.substring(1));
    var wahl = /[?&]lang=(de|en)(?:&|$)/.exec(location.search);
    var ziel = wahl ? wahl[1] : (anker ? spracheVon(anker) : "de");
    if (anker) { anker = umgesetzt(anker, ziel); }
    if (anker && !document.getElementById(anker)) { anker = ""; }
    return { ziel: ziel, anker: anker };
  }

  // Ein Sprung innerhalb der Seite (#pets, auch mit ?lang=en davor) laedt nicht neu.
  window.addEventListener("hashchange", function () {
    var a = ausAdresse();
    if (a.ziel !== jetzt || (a.anker && a.anker !== location.hash.substring(1))) { zeige(a.ziel, a.anker); }
  });

  var a = ausAdresse();
  if (a.ziel !== "de") { zeige(a.ziel, a.anker); }
  else if (a.anker && a.anker !== location.hash.substring(1)) { zeige("de", a.anker); }
})();
