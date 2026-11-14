/* AutoPlayer landing pages - what is the same on all seven pages (Montag bis Sonntag) and is kept
   in ONE place: the Google Play link with its QR code, and the order of the weekday pages.
   Wochentags-Konzept Datei 50, Punkt 4 und 19: der Play-Store-Link fehlt noch bewusst. Kommt er,
   wird er nur hier eingetragen; den QR-Code dazu erzeugt tools/website/qr_playstore.py. */
(function () {
  'use strict';
  window.APKonst = {
    playStore: {
      url: null,            // z. B. 'https://play.google.com/store/apps/details?id=com.autoplayer.mp3'
      qrBild: null,         // z. B. 'img/qr-playstore.svg' (tools/website/qr_playstore.py)
    },
    // Montag ist die Startseite, Dienstag bis Sonntag die Wochentags-Seiten (tag.html?tag=..).
    // "Naechster Use Case" fuehrt in dieser Reihenfolge weiter, nach Sonntag zum Montag.
    tage: [
      { kurz: 'mo', seite: 'index.html?tag=mo', tag: { de: 'Montag', en: 'Monday' }, thema: { de: 'Deine Sammlung', en: 'Your collection' } },
      { kurz: 'di', seite: 'tag.html?tag=di', tag: { de: 'Dienstag', en: 'Tuesday' }, thema: { de: 'Herzschlag-Sync', en: 'Heartbeat Sync' } },
      { kurz: 'mi', seite: 'tag.html?tag=mi', tag: { de: 'Mittwoch', en: 'Wednesday' }, thema: { de: 'Android Auto', en: 'Android Auto' } },
      { kurz: 'do', seite: 'tag.html?tag=do', tag: { de: 'Donnerstag', en: 'Thursday' }, thema: { de: 'Kontext-Regeln', en: 'Context rules' } },
      { kurz: 'fr', seite: 'tag.html?tag=fr', tag: { de: 'Freitag', en: 'Friday' }, thema: { de: 'Loop-Studio', en: 'Loop studio' } },
      { kurz: 'sa', seite: 'tag.html?tag=sa', tag: { de: 'Samstag', en: 'Saturday' }, thema: { de: 'Party-Modus', en: 'Party mode' } },
      { kurz: 'so', seite: 'tag.html?tag=so', tag: { de: 'Sonntag', en: 'Sunday' }, thema: { de: 'Surf the Beat', en: 'Surf the Beat' } },
    ],
  };
  const K = window.APKonst;
  K.tagVon = (kurz) => K.tage.find((d) => d.kurz === kurz) || null;
  K.naechster = (kurz) => { const i = K.tage.findIndex((d) => d.kurz === kurz); return K.tage[(i + 1) % K.tage.length]; };
  /** Address of a page in a language (the language lives only in the address, js/lang.js). */
  K.adresse = (kurz, lang, extra) => {
    const d = K.tagVon(kurz);
    const p = new URLSearchParams(d.seite.split('?')[1] || '');
    if (lang) p.set('lang', lang);
    if (extra) Object.keys(extra).forEach((k) => p.set(k, extra[k]));
    return d.seite.split('?')[0] + '?' + p.toString();
  };
})();
