/* Aus BENUTZERHANDBUCH_NEU.html uebernommen von tools/website/baue_website.py - nicht von Hand aendern. */
(function () {
  "use strict";

  var ORDNER = "audio/";
  var ton    = document.getElementById("tonquelle");
  var leiste = document.getElementById("tonleiste");
  var eTitel = document.getElementById("tl-titel");
  var ePlay  = document.getElementById("tl-play");
  var eZeit  = document.getElementById("tl-zeit");
  var eTempo = document.getElementById("tl-tempo");
  var eKette = document.getElementById("tl-kette");
  var eMit   = document.getElementById("tl-mit");

  var aktiv = null;          // gerade laufender Knopf
  var kette = false;         // automatisch zum naechsten Kapitel
  // Beschriftungen je Sprache (einleitung.py, von baue.py eingesetzt). Die Leiste gibt es nur einmal;
  // beim Sprachwechsel wird sie umbeschriftet.
  var TEXTE = {"de": {"ruhe": "▶ Vorlesen liest das Kapitel, das gerade oben steht", "vorlesen": "▶ Vorlesen", "pause": "Pause", "weiter": "Weiter", "stopp": "Stopp", "mit": "Mitlesen", "kette": "Kette", "an": "an", "aus": "aus", "zurueck": "10 Sekunden zurück", "vor": "10 Sekunden vor", "tempoTitel": "Sprechtempo", "tempo": ["langsamer", "normal", "etwas schneller", "schneller", "schnell"], "mitTitel": "Seite läuft beim Vorlesen mit", "ketteTitel": "Nach dem Kapitel automatisch weiterlesen", "fehlt": "Datei nicht gefunden: {datei}"}, "en": {"ruhe": "▶ Read aloud starts with the chapter at the top of the screen", "vorlesen": "▶ Read aloud", "pause": "Pause", "weiter": "Resume", "stopp": "Stop", "mit": "Read along", "kette": "Chain", "an": "on", "aus": "off", "zurueck": "10 seconds back", "vor": "10 seconds forward", "tempoTitel": "Speaking speed", "tempo": ["slower", "normal", "a bit faster", "faster", "fast"], "mitTitel": "The page scrolls along while reading", "ketteTitel": "Continue with the next chapter automatically", "fehlt": "No English recording for this chapter yet – the narration is being prepared."}};
  var sprache = "de";
  function T(k) { return (TEXTE[sprache] || TEXTE.de)[k]; }
  var SPEICHER = "handbuch-gehoert";
  var SPEICHER_MIT = "handbuch-mitlesen";

  // --- Gehoert-Merker (haelt auch ohne localStorage durch) ----------------
  var gehoert = {};
  try {
    var roh = window.localStorage.getItem(SPEICHER);
    if (roh) { gehoert = JSON.parse(roh) || {}; }
  } catch (e) { gehoert = {}; }

  function merken(anker) {
    gehoert[anker] = 1;
    try { window.localStorage.setItem(SPEICHER, JSON.stringify(gehoert)); } catch (e) {}
    zeichneGehoert();
  }

  function zeichneGehoert() {
    var artikel = document.querySelectorAll("article[id]");
    for (var i = 0; i < artikel.length; i++) {
      if (gehoert[artikel[i].id]) { artikel[i].classList.add("gehoert"); }
      else { artikel[i].classList.remove("gehoert"); }
    }
    var links = document.querySelectorAll("nav.inhalt a[href^='#']");
    for (var j = 0; j < links.length; j++) {
      var ziel = links[j].getAttribute("href").substring(1);
      if (gehoert[ziel]) { links[j].classList.add("gehoert"); }
      else { links[j].classList.remove("gehoert"); }
    }
  }

  // =========================================================================
  //  Mitlauf: die Seite folgt dem Vorlesen
  // =========================================================================
  //
  //  Grundgedanke: Ist die Aufnahme zu 40 Prozent gelaufen, soll der Blick auf
  //  40 Prozent des Kapitels liegen. Daraus ergibt sich die Zielposition.
  //
  //  Drei Punkte, die den Unterschied zwischen "laeuft mit" und "zappelt"
  //  ausmachen:
  //
  //  1. GESCHMEIDIGKEIT. Das timeupdate-Ereignis feuert nur etwa viermal je
  //     Sekunde. Wer dort direkt scrollt, bekommt sichtbare Spruenge. Deshalb
  //     laeuft eine eigene Bildschleife, die sich der Zielposition in jedem
  //     Einzelbild ein Stueck annaehert - das ergibt eine gleichmaessige,
  //     langsame Fahrt.
  //
  //  2. EIGENE EINGRIFFE. Scrollt der Leser selbst - etwa um etwas nachzusehen -
  //     darf die Seite nicht dagegenhalten. Weicht die Position deutlich von
  //     der zuletzt selbst gesetzten ab, pausiert der Mitlauf einige Sekunden
  //     und faengt sich danach wieder ein.
  //
  //  3. KETTE. Beim Wechsel zum naechsten Kapitel wird bewusst NICHT gesprungen.
  //     Das neue Ziel liegt dicht unter dem alten, und dieselbe Bildschleife
  //     faehrt einfach weiter - der Uebergang fliesst.
  //
  var mitlesen = true;
  var laeuftSchleife = false;
  var letzteEigene = -1;        // Position, die der Mitlauf zuletzt gesetzt hat
  var pauseBis = 0;             // Zeitpunkt, ab dem wieder mitgelaufen wird

  var ABSTAND_OBEN = 90;        // Luft ueber dem Kapitel
  var ANNAEHERUNG = 0.10;       // Anteil der Reststrecke je Einzelbild
  var EINGRIFF_TOLERANZ = 60;   // ab wie vielen Pixeln es als eigener Eingriff gilt
  var EINGRIFF_PAUSE = 4000;    // wie lange danach nicht mitgelaufen wird

  try {
    var gespeichert = window.localStorage.getItem(SPEICHER_MIT);
    if (gespeichert === "0") { mitlesen = false; }
  } catch (e) {}

  function zeigeKette() {
    eKette.textContent = T("kette") + ": " + (kette ? T("an") : T("aus"));
    if (kette) { eKette.classList.add("ein"); } else { eKette.classList.remove("ein"); }
  }

  function zeigeMitlesen() {
    eMit.textContent = T("mit") + ": " + (mitlesen ? T("an") : T("aus"));
    if (mitlesen) { eMit.classList.add("ein"); }
    else { eMit.classList.remove("ein"); }
  }

  /* Der Bereich, durch den gefahren wird: der ganze Artikel des Kapitels. */
  function laufBereich(knopf) {
    return document.getElementById(knopf.dataset.anker);
  }

  function seitenPosition(element) {
    var y = 0;
    while (element) { y += element.offsetTop; element = element.offsetParent; }
    return y;
  }

  function zielPosition() {
    if (!aktiv) { return null; }
    var bereich = laufBereich(aktiv);
    if (!bereich) { return null; }

    var oben = seitenPosition(bereich) - ABSTAND_OBEN;
    var hoehe = bereich.offsetHeight;
    var leisteHoehe = leiste.offsetHeight;
    var sicht = window.innerHeight - leisteHoehe - ABSTAND_OBEN;

    // Passt das Kapitel ganz auf den Schirm, gibt es nichts zu fahren -
    // dann bleibt es einfach oben stehen.
    var strecke = Math.max(0, hoehe - sicht);

    var anteil = 0;
    if (ton.duration && isFinite(ton.duration) && ton.duration > 0) {
      anteil = Math.min(1, Math.max(0, ton.currentTime / ton.duration));
    }

    var ziel = oben + strecke * anteil;
    var hoechstens = document.documentElement.scrollHeight - window.innerHeight;
    return Math.max(0, Math.min(ziel, hoechstens));
  }

  function schleife() {
    if (!mitlesen || !aktiv || ton.paused || !leiste.classList.contains("an")) {
      laeuftSchleife = false;
      return;
    }
    if (Date.now() >= pauseBis) {
      var ziel = zielPosition();
      if (ziel !== null) {
        var jetzt = window.scrollY || window.pageYOffset;
        var rest = ziel - jetzt;
        if (Math.abs(rest) > 0.5) {
          // Grosse Strecken (Kapitelwechsel) etwas zuegiger nehmen, damit der
          // Uebergang nicht traege wirkt.
          var tempo = Math.abs(rest) > 400 ? ANNAEHERUNG * 2 : ANNAEHERUNG;
          var neu = jetzt + rest * tempo;
          window.scrollTo(0, neu);
          letzteEigene = window.scrollY || window.pageYOffset;
        }
      }
    }
    window.requestAnimationFrame(schleife);
  }

  function starteSchleife() {
    if (laeuftSchleife) { return; }
    laeuftSchleife = true;
    letzteEigene = window.scrollY || window.pageYOffset;
    window.requestAnimationFrame(schleife);
  }

  // Eigenes Scrollen erkennen und den Mitlauf kurz aussetzen lassen.
  window.addEventListener("scroll", function () {
    if (!mitlesen || !laeuftSchleife || letzteEigene < 0) { return; }
    var jetzt = window.scrollY || window.pageYOffset;
    if (Math.abs(jetzt - letzteEigene) > EINGRIFF_TOLERANZ) {
      pauseBis = Date.now() + EINGRIFF_PAUSE;
      letzteEigene = jetzt;
    }
  }, { passive: true });

  eMit.addEventListener("click", function () {
    mitlesen = !mitlesen;
    zeigeMitlesen();
    try { window.localStorage.setItem(SPEICHER_MIT, mitlesen ? "1" : "0"); } catch (e) {}
    if (mitlesen && aktiv && !ton.paused) { pauseBis = 0; starteSchleife(); }
  });

  // --- Hilfen -------------------------------------------------------------
  function zeit(s) {
    if (!isFinite(s) || s < 0) { s = 0; }
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  function alleKnoepfe() {
    return document.querySelectorAll(".vorlese-knopf");
  }

  /* Die Leiste steht fest am unteren Rand. Damit sie das Seitenende nicht verdeckt,
     bekommt die Seite unten so viel Luft, wie die Leiste hoch ist - am Handy bricht sie
     auf zwei Zeilen um. */
  function platzUnten() {
    var h = leiste.offsetHeight;
    document.body.style.paddingBottom = h ? (h + 12) + "px" : "";
  }

  // Das Kapitel, das gerade oben auf dem Schirm steht - dort beginnt "Vorlesen" in der Leiste.
  // Hauptknoepfe der sichtbaren Sprachfassung, in Handbuch-Reihenfolge.
  function hauptKnoepfe() {
    return document.querySelectorAll("main.sprache:not([hidden]) .vorlese-knopf[data-haupt='1']");
  }

  function knopfImBlick() {
    var knoepfe = hauptKnoepfe();
    for (var i = 0; i < knoepfe.length; i++) {
      var artikel = document.getElementById(knoepfe[i].dataset.anker);
      if (artikel && artikel.offsetParent && artikel.getBoundingClientRect().bottom > ABSTAND_OBEN + 40) {
        return knoepfe[i];
      }
    }
    return knoepfe.length ? knoepfe[0] : null;
  }

  function zeigeRuhe() {
    eTitel.textContent = T("ruhe");
    eTitel.classList.add("ruhe");
    ePlay.textContent = T("vorlesen");
    eZeit.textContent = "0:00 / 0:00";
  }

  function zuruecksetzen() {
    var k = alleKnoepfe();
    for (var i = 0; i < k.length; i++) {
      k[i].classList.remove("laeuft");
      if (k[i].dataset.beschriftung) { k[i].textContent = k[i].dataset.beschriftung; }
    }
    var l = document.querySelectorAll(".vorlese-leiste.aktiv");
    for (var j = 0; j < l.length; j++) { l[j].classList.remove("aktiv"); }
    var a = document.querySelectorAll("article.liest");
    for (var n = 0; n < a.length; n++) { a[n].classList.remove("liest"); }
  }

  // --- Abspielen ----------------------------------------------------------
  function starte(knopf) {
    if (aktiv === knopf && !ton.paused) { ton.pause(); return; }
    if (aktiv === knopf && ton.paused && ton.src) { ton.play(); return; }

    zuruecksetzen();
    aktiv = knopf;
    knopf.classList.add("laeuft");
    knopf.textContent = T("pause");
    var box = knopf.closest(".vorlese-leiste");
    if (box) { box.classList.add("aktiv"); }
    var artikel = document.getElementById(knopf.dataset.anker);
    if (artikel) { artikel.classList.add("liest"); }

    ton.src = ORDNER + knopf.dataset.datei + ".mp3";
    ton.playbackRate = parseFloat(eTempo.value) || 1;
    eTitel.textContent = knopf.dataset.titel;
    eTitel.classList.remove("ruhe");
    leiste.classList.add("an");
    ePlay.textContent = T("pause");
    pauseBis = 0;
    platzUnten();

    var versuch = ton.play();
    if (versuch && versuch.catch) {
      versuch.catch(function (fehler) {
        // Abgebrochen, weil schon das naechste Kapitel startet: kein Fehler.
        if (aktiv !== knopf || (fehler && fehler.name === "AbortError")) { return; }
        zuruecksetzen();
        aktiv = null;
        leiste.classList.remove("an");
        ePlay.textContent = T("vorlesen");
        eTitel.classList.remove("ruhe");
        eTitel.textContent = T("fehlt").replace("{datei}", knopf.dataset.datei + ".mp3");
        platzUnten();
      });
    }
  }

  function naechstesKapitel() {
    if (!aktiv) { return null; }
    var haupt = hauptKnoepfe();
    var jetzt = aktiv.dataset.anker;
    for (var i = 0; i < haupt.length; i++) {
      if (haupt[i].dataset.anker === jetzt && i + 1 < haupt.length) {
        return haupt[i + 1];
      }
    }
    return null;
  }

  // --- Ereignisse ---------------------------------------------------------
  ton.addEventListener("timeupdate", function () {
    eZeit.textContent = zeit(ton.currentTime) + " / " + zeit(ton.duration);
    if (aktiv) {
      var box = aktiv.closest(".vorlese-leiste");
      if (box) {
        var b = box.querySelector(".vorlese-balken > i");
        if (b && ton.duration) {
          b.style.width = (100 * ton.currentTime / ton.duration) + "%";
        }
      }
    }
  });

  ton.addEventListener("play", function () {
    ePlay.textContent = T("pause");
    if (aktiv) { aktiv.textContent = T("pause"); }
    if (mitlesen) { starteSchleife(); }
  });

  ton.addEventListener("pause", function () {
    // Nach Stopp kommt das Ereignis erst, wenn die Leiste schon wieder in Ruhe steht.
    if (!aktiv) { return; }
    ePlay.textContent = T("weiter");
    if (aktiv && aktiv.dataset.beschriftung) { aktiv.textContent = aktiv.dataset.beschriftung; }
  });

  ton.addEventListener("ended", function () {
    if (aktiv && aktiv.dataset.anker) { merken(aktiv.dataset.anker); }
    var weiter = kette ? naechstesKapitel() : null;
    if (weiter) {
      // Kein Sprung: das neue Ziel liegt dicht unter dem alten, der Mitlauf
      // faehrt weiter. Nur wenn er aus ist, wird hingescrollt.
      if (!mitlesen) {
        var ziel = document.getElementById(weiter.dataset.anker);
        if (ziel) { ziel.scrollIntoView({ behavior: "smooth", block: "start" }); }
      }
      starte(weiter);
    } else {
      zuruecksetzen();
      ePlay.textContent = T("weiter");
    }
  });

  ePlay.addEventListener("click", function () {
    if (!aktiv) {
      var k = knopfImBlick();
      if (k) { starte(k); }
      return;
    }
    if (ton.paused) { ton.play(); } else { ton.pause(); }
  });
  document.getElementById("tl-zurueck").addEventListener("click", function () {
    ton.currentTime = Math.max(0, ton.currentTime - 10);
    pauseBis = 0;
  });
  document.getElementById("tl-vor").addEventListener("click", function () {
    ton.currentTime = Math.min(ton.duration || 0, ton.currentTime + 10);
    pauseBis = 0;
  });
  eTempo.addEventListener("change", function () {
    ton.playbackRate = parseFloat(eTempo.value) || 1;
  });
  eKette.addEventListener("click", function () {
    kette = !kette;
    zeigeKette();
  });
  // Stopp: Ton aus, die Leiste bleibt stehen und wartet auf das naechste Kapitel.
  function stoppe() {
    ton.pause();
    ton.removeAttribute("src");
    ton.load();
    zuruecksetzen();
    leiste.classList.remove("an");
    aktiv = null;
    zeigeRuhe();
    platzUnten();
  }
  document.getElementById("tl-stop").addEventListener("click", stoppe);

  function beschriften() {
    document.getElementById("tl-zurueck").title = T("zurueck");
    document.getElementById("tl-vor").title = T("vor");
    document.getElementById("tl-stop").textContent = T("stopp");
    eTempo.title = T("tempoTitel");
    for (var i = 0; i < eTempo.options.length; i++) { eTempo.options[i].text = T("tempo")[i]; }
    eMit.title = T("mitTitel");
    eKette.title = T("ketteTitel");
    zeigeMitlesen();
    zeigeKette();
    if (!aktiv) { zeigeRuhe(); }
  }

  // Wechsel der Sprache (Skript am Seitenende): Was laeuft, gehoert zur anderen Fassung - anhalten.
  document.addEventListener("handbuch-sprache", function (e) {
    if (e.detail !== sprache && aktiv) { stoppe(); }
    sprache = TEXTE[e.detail] ? e.detail : "de";
    beschriften();
    platzUnten();
  });
  window.addEventListener("resize", platzUnten);

  // Knoepfe verdrahten
  document.addEventListener("click", function (e) {
    var k = e.target.closest(".vorlese-knopf");
    if (!k) { return; }
    e.preventDefault();
    starte(k);
  });

  // Bereich am Stueck vorlesen: Kette einschalten und beim ersten Kapitel
  // des Bereichs beginnen.
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".bereich-knopf");
    if (!b) { return; }
    e.preventDefault();
    var ueberschrift = document.getElementById(b.dataset.bereich);
    if (!ueberschrift) { return; }
    var knopf = null, knoten = ueberschrift.nextElementSibling;
    while (knoten && knoten.tagName !== "H2") {
      knopf = knoten.querySelector ? knoten.querySelector(".vorlese-knopf[data-haupt='1']") : null;
      if (knopf) { break; }
      knoten = knoten.nextElementSibling;
    }
    if (!knopf) { return; }
    if (!kette) {
      kette = true;
      zeigeKette();
    }
    starte(knopf);
  });

  // Ruecksprung zum Inhaltsverzeichnis: den Eintrag des Kapitels mittig zeigen
  // und kurz hervorheben. Der Mitlauf haelt so lange still - sonst holte er die
  // Seite beim Vorlesen nach vier Sekunden zurueck ins Kapitel.
  var INHALT_PAUSE = 20000;
  var angesprungen = null;
  document.addEventListener("click", function (e) {
    var k = e.target.closest(".inhalt-knopf");
    if (!k) { return; }
    // Ziel ist der eigene Link: "#inh-widget", in der englischen Fassung "#en-inh-widget".
    var eintrag = document.getElementById(k.getAttribute("href").substring(1));
    if (!eintrag) { return; }
    e.preventDefault();
    pauseBis = Date.now() + INHALT_PAUSE;
    eintrag.scrollIntoView({ behavior: "smooth", block: "center" });
    if (angesprungen) { angesprungen.classList.remove("angesprungen"); }
    eintrag.classList.add("angesprungen");
    angesprungen = eintrag;
    window.setTimeout(function () { eintrag.classList.remove("angesprungen"); }, 3500);
  });

  // Ein Klick im Inhaltsverzeichnis fuehrt zum Kapitel - dann darf der Mitlauf
  // sofort wieder uebernehmen.
  document.addEventListener("click", function (e) {
    if (e.target.closest("nav.inhalt a")) { pauseBis = 0; }
  });

  // Sprung im Fortschrittsbalken
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".vorlese-balken");
    if (!b || !aktiv || !ton.duration) { return; }
    var box = b.getBoundingClientRect();
    ton.currentTime = ton.duration * ((e.clientX - box.left) / box.width);
    pauseBis = 0;
  });

  // Tastatur: Leertaste haelt an, Pfeile spulen
  document.addEventListener("keydown", function (e) {
    if (!leiste.classList.contains("an")) { return; }
    var feld = document.activeElement && document.activeElement.tagName;
    if (feld === "INPUT" || feld === "SELECT" || feld === "TEXTAREA") { return; }
    if (e.code === "Space") { e.preventDefault(); if (ton.paused) { ton.play(); } else { ton.pause(); } }
    if (e.code === "ArrowLeft")  { ton.currentTime = Math.max(0, ton.currentTime - 10); pauseBis = 0; }
    if (e.code === "ArrowRight") { ton.currentTime = Math.min(ton.duration || 0, ton.currentTime + 10); pauseBis = 0; }
  });

  // Zuruecksetzen der Merkliste
  // Je Sprache ein Link (die englischen Anker tragen die Vorsilbe "en-").
  var resets = document.querySelectorAll("#gehoert-loeschen, #en-gehoert-loeschen");
  for (var r = 0; r < resets.length; r++) {
    var reset = resets[r];
    reset.addEventListener("click", function (e) {
      e.preventDefault();
      gehoert = {};
      try { window.localStorage.removeItem(SPEICHER); } catch (err) {}
      zeichneGehoert();
    });
  }

  beschriften();
  zeichneGehoert();
  platzUnten();
})();
