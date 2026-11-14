/* Freitag - Loop-Studio (Wochentags-Konzept Datei 10 und 33), Stil Origami.
   Zahlen belegt in final-claude-code/analyse/ZAHLEN-BELEG.md (Freitag 18a-19, Aenderung 13) und im Handbuch:
   bis zu 16 Spuren, 16 Pads, 15 Vorlagen, 14 Plattform-Vorgaben, Ausgabe AAC oder WAV; per QR-Code nur im selben
   WLAN oder Hotspot, per QR das ganze Projekt, der fertige Mix als Datei. "Kein DAW-Ersatz" hat keinen Beleg.
   Bilder: Handbuch DE / EN. Hero (im Konzept ohne Bild): mixer-vorlagen-showcase, damit mixer-ueberblick dem
   Abschnitt Mixer bleibt. Verbindung Donnerstag: "Regel startet einen eigenen Mix" ohne Beleg (Mixe liegen in
   Music/AutoPlayer, ab Werk aus der Bibliothek ausgeblendet), daher eine allgemeine Aussage zu den Regeln.
   Song: 168 "Falt den Loop" / "Fold The Loop", nicht gekuerzt. */
(window.APTage = window.APTage || {}).fr = {
  stil: 'origami',
  song: {
    de: { datei: 'audio/tage/fr-168-falt-den-loop-de.mp3', dauer: 38.00, finale: 36.8 },
    en: { datei: 'audio/tage/fr-168-fold-the-loop-en.mp3', dauer: 29.96, finale: 26.73 },
  },
  titel: { de: 'AutoPlayer – Aus deiner Musik wird dein Mix', en: 'AutoPlayer – Your music becomes your mix' },
  beschreibung: {
    de: 'Loop-Studio: Mit AutoPlayer schneidest du Stellen aus deinen eigenen Titeln und fügst sie auf dem Handy zu einem neuen Mix zusammen – ganz ohne Rechner.',
    en: 'Loop studio: with AutoPlayer you cut parts from your own songs and put them together into a new mix on your phone – no computer needed.',
  },
  hero: {
    zeile1: { de: 'Aus deiner Musik', en: 'Your music' },
    zeile2: { de: 'wird dein Mix.', en: 'becomes your mix.' },
    lead: {
      de: 'Sophie hat einen Refrain, den sie immer wieder hören will. Im Loop-Mixer legt sie ihn mit Stellen aus zwei anderen Titeln zusammen, spielt auf den Pads einen Beat dazu und schickt das Projekt per QR-Code an eine Freundin.',
      en: 'Sophie has a chorus she wants to hear again and again. In the Loop Mixer she combines it with parts of two other songs, plays a beat on the pads and sends the project to a friend by QR code.',
    },
    bild: { de: 'handbuch/bilder/mixer-vorlagen-showcase.webp', en: 'handbuch/bilder/en/mixer-vorlagen-showcase.webp', ar: '540 / 870',
      alt: { de: 'Ein ganzer Mix auf sechs Spuren im Loop-Mixer', en: 'A whole mix on six tracks in the Loop Mixer' }, kapitel: 'mixer-vorlagen' },
    karten: [
      { icon: 'stern', kapitel: 'mixer-vorlagen',
        titel: { de: '15 Vorlagen', en: '15 templates' },
        text: { de: 'Gerüste für Hip Hop, House, Lo-Fi und mehr – dazu drei fertige Mixe zum Weiterbauen.', en: 'Frameworks for Hip Hop, House, Lo-Fi and more – plus three finished mixes to build on.' } },
      { icon: 'schild', kapitel: 'mixer-projekte',
        titel: { de: 'Arbeitet mit Kopien', en: 'Works with copies' },
        text: { de: 'Jeder Ausschnitt wird eine eigene Datei, und das Projekt speichert Kopien – es spielt auch, wenn das Original verschoben wurde.', en: 'Every excerpt becomes a file of its own, and the project stores copies – it still plays if the original has been moved.' } },
    ],
  },
  abschnitte: [
    {
      name: { de: 'A–B-Wiederholung', en: 'A–B Repeat' }, pet: 'octo-layout', effekt: 'schleife',
      titel1: { de: 'Deine Stelle', en: 'Your favorite part' }, titel2: { de: 'von A bis B.', en: 'from A to B.' },
      text: {
        de: 'Tippe am Anfang der Stelle auf A, am Ende auf B, dann auf das Schleifen-Symbol – schon läuft sie immer wieder. Als Lesezeichen gespeichert, wird sie zum Baustein für deinen Mix.',
        en: 'Tap A at the start of the part, B at the end, then the loop icon – and it plays again and again. Saved as a bookmark, it becomes a building block for your mix.',
      },
      fakten: [{ de: 'Feinabstimmung in 100-ms-Schritten', en: 'Fine Tuning in 100 ms steps' }, { de: '1 bis 30 Wiederholungen oder endlos', en: '1 to 30 repetitions or endless' }],
      bilder: [{ de: 'handbuch/bilder/abrepeat-punkte.webp', en: 'handbuch/bilder/en/abrepeat-punkte.webp', ar: '760 / 261', teil: true,
        alt: { de: 'Punkt A und B unter der Wellenform', en: 'Points A and B below the waveform' }, kapitel: 'abrepeat' }],
    },
    {
      name: { de: 'Ausschnitt', en: 'Excerpt' }, pet: 'chip-grid', effekt: 'schnitt',
      titel1: { de: 'Ein Schnitt,', en: 'One cut,' }, titel2: { de: 'ein Baustein.', en: 'one building block.' },
      text: {
        de: 'In den Loop-Lesezeichen schneidet die Schere die Stelle von A bis B heraus. Mit dem Track-Cutter speicherst du einen Bereich eines Titels als eigene Datei – beides holt der Loop-Mixer in seine Liste.',
        en: 'In Loop Bookmarks, the scissors cut out the part from A to B. With the Track Cutter you save a range of a song as a file of its own – the Loop Mixer picks up both in its list.',
      },
      fakten: [{ de: 'Original bleibt unangetastet', en: 'The original stays untouched' }, { de: 'MP3 und FLAC verlustfrei', en: 'MP3 and FLAC lossless' }],
      bilder: [{ de: 'handbuch/bilder/cutter.webp', en: 'handbuch/bilder/en/cutter.webp', ar: '540 / 1170',
        alt: { de: 'Der Track-Cutter mit gewähltem Bereich', en: 'The Track Cutter with a chosen range' }, kapitel: 'cutter' }],
    },
    {
      name: { de: 'Loop-Mixer', en: 'Loop Mixer' }, pet: 'benny-motion', effekt: 'spuren',
      titel1: { de: 'Schicht für Schicht', en: 'Layer by layer' }, titel2: { de: 'zum Mix.', en: 'into a mix.' },
      text: {
        de: 'Auf der Zeitleiste legst du die Ausschnitte nebeneinander und übereinander, kürzt sie, teilst sie und gibst Effekte dazu. Überlappen sich zwei auf derselben Spur, blendet der Mixer von selbst über.',
        en: 'On the timeline you place the excerpts side by side and on top of each other, shorten them, split them and add effects. Where two overlap on the same track, the mixer crossfades on its own.',
      },
      fakten: [{ de: 'Bis zu 16 Spuren', en: 'Up to 16 tracks' }, { de: 'Ausgabe als AAC oder WAV', en: 'Export as AAC or WAV' }],
      bilder: [
        { de: 'handbuch/bilder/mixer-ueberblick.webp', en: 'handbuch/bilder/en/mixer-ueberblick.webp', ar: '540 / 775',
          alt: { de: 'Der Loop-Mixer mit einem fertigen Mix', en: 'The Loop Mixer with a finished mix' }, kapitel: 'mixer-ueberblick' },
        { de: 'handbuch/bilder/mixer-erstermix-zwei.webp', en: 'handbuch/bilder/en/mixer-erstermix-zwei.webp', ar: '760 / 272', teil: true,
          alt: { de: 'Zwei Segmente hintereinander auf einer Spur', en: 'Two segments one after the other on a track' }, kapitel: 'mixer-erstermix' },
      ],
    },
    {
      name: { de: 'Pad-Mode', en: 'Pad Mode' }, pet: 'foxy-color', effekt: 'pads',
      titel1: { de: '16 Pads.', en: '16 pads.' }, titel2: { de: 'Live gespielt.', en: 'Played live.' },
      text: {
        de: 'Belege die Pads mit Titeln aus deiner Bibliothek oder Klängen aus dem Synth Studio und spiel sie mit den Fingern. Was du aufnimmst, landet als Segmente auf der Zeitleiste.',
        en: 'Load the pads with songs from your library or sounds from Synth Studio and play them with your fingers. Whatever you record lands on the timeline as segments.',
      },
      fakten: [{ de: 'One-Shot · Loop · Toggle', en: 'One-Shot · Loop · Toggle' }, { de: 'Raster 1/1 bis 1/8 oder FREE', en: 'Grid 1/1 to 1/8 or FREE' }],
      bilder: [{ de: 'handbuch/bilder/mixer-pad.webp', en: 'handbuch/bilder/en/mixer-pad.webp', ar: '540 / 843',
        alt: { de: 'Der Pad-Mode mit 16 Pads', en: 'Pad Mode with 16 pads' }, kapitel: 'mixer-pad' }],
    },
    {
      name: { de: 'Sharing-Hub', en: 'Sharing Hub' }, pet: 'octo-3d', effekt: 'flieger',
      titel1: { de: 'Per QR-Code', en: 'By QR code' }, titel2: { de: 'zum Weiterbauen.', en: 'to keep building.' },
      text: {
        de: 'Im selben WLAN scannt deine Freundin den QR-Code und bekommt das ganze Projekt – sie kann gleich weiterbauen. Den fertigen Mix verschickst du als Datei, auf Wunsch passend für Instagram, TikTok oder YouTube.',
        en: 'On the same Wi-Fi your friend scans the QR code and gets the whole project – she can keep building right away. The finished mix goes out as a file, tailored to Instagram, TikTok or YouTube if you like.',
      },
      fakten: [{ de: '14 Plattform-Vorgaben', en: '14 platform presets' }, { de: 'Ohne Umweg übers Internet', en: 'No detour via the internet' }],
      hinweis: { de: 'Beide Handys im selben WLAN – oder eines im Hotspot des anderen.', en: 'Both phones on the same Wi-Fi – or one on the other’s hotspot.' },
      bilder: [{ de: 'handbuch/bilder/teilen-qr-uebertragung.webp', en: 'handbuch/bilder/en/teilen-qr-uebertragung.webp', ar: '760 / 1220',
        alt: { de: 'QR-Code eines Projekts, bereit zur Übertragung', en: 'QR code of a project, ready to transfer' }, kapitel: 'teilen' }],
    },
  ],
  ende: {
    zeile1: { de: 'Aus deiner Musik', en: 'Your music' },
    zeile2: { de: 'wird dein Mix.', en: 'becomes your mix.' },
    text: {
      de: 'Kein Rechner nötig: Vom ersten Schnitt bis zur fertigen Datei entsteht dein Mix auf dem Handy.',
      en: 'No computer needed: from the first cut to the finished file, your mix comes together on your phone.',
    },
    verbindungen: [
      { tag: 'sa', text: { de: 'Erst teilen, dann feiern: Gäste wünschen sich Titel – ganz ohne App.', en: 'Share first, then party: guests request songs – no app needed.' } },
      { tag: 'do', text: { de: 'Im Alltag: Regeln wählen die Musik nach Ort, Zeit und Wetter.', en: 'Day to day: rules pick the music by place, time and weather.' } },
    ],
  },
};
