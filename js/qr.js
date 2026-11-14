/* AutoPlayer landing pages - the small QR code to Google Play at the end of every page
   (Wochentags-Konzept Datei 50, Punkt 19). Link and picture come from ONE place, js/konstanten.js.
   As long as the app is not in the store, a neutral placeholder stands there. Not in the videos
   (html.render hides #qr, style.css). */
(function () {
  'use strict';
  const K = window.APKonst;
  const L = window.APLang || { lang: 'de' };
  const box = document.getElementById('qr');
  if (!K || !box) return;
  const en = L.lang === 'en';
  const ps = K.playStore;
  const echt = !!(ps.url && ps.qrBild);
  const T = en
    ? { titel: 'Straight to your phone', echt: 'Scan the code to open AutoPlayer on Google Play.',
        bald: 'Soon on Google Play – the QR code for a quick install follows with the launch.', alt: 'QR code: AutoPlayer on Google Play' }
    : { titel: 'Direkt aufs Handy', echt: 'Code scannen – AutoPlayer öffnet sich bei Google Play.',
        bald: 'Bald bei Google Play – der QR-Code zur Schnellinstallation folgt mit dem Start.', alt: 'QR-Code: AutoPlayer bei Google Play' };
  const karte = document.createElement('div');
  karte.className = 'qr-karte glass';
  const code = document.createElement(echt ? 'a' : 'div');
  code.className = 'qr-code' + (echt ? '' : ' qr-platzhalter');
  if (echt) {
    code.href = ps.url;
    code.rel = 'noopener';
    const img = document.createElement('img');
    img.src = ps.qrBild;
    img.alt = T.alt;
    img.width = 112;
    img.height = 112;
    code.appendChild(img);
  } else {
    code.setAttribute('aria-hidden', 'true');
    // three finder squares and a few modules: reads as "QR", but is no code (nothing to scan yet)
    code.innerHTML = '<svg viewBox="0 0 29 29"><path d="M1 1h7v7H1zM21 1h7v7h-7zM1 21h7v7H1z" fill="none" stroke="currentColor" stroke-width="1.6"/>'
      + '<path d="M3 3h3v3H3zM23 3h3v3h-3zM3 23h3v3H3zM11 2h2v2h-2zM15 4h2v2h-2zM11 8h2v2h-2zM13 12h3v2h-3zM9 13h2v3H9zM18 11h2v2h-2zM22 12h3v2h-3zM12 17h2v2h-2zM16 16h2v3h-2zM20 19h2v2h-2zM11 22h3v2h-3zM17 23h2v4h-2zM23 22h2v2h-2zM21 26h4v2h-4z" fill="currentColor"/></svg>';
  }
  const text = document.createElement('div');
  text.className = 'qr-text';
  text.innerHTML = '<b></b><span></span>';
  text.firstChild.textContent = T.titel;
  text.lastChild.textContent = echt ? T.echt : T.bald;
  karte.appendChild(code);
  karte.appendChild(text);
  box.appendChild(karte);
})();
