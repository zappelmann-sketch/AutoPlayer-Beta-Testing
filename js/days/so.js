/* Sonntag - Surf the Beat im Tunnel (Wochentags-Konzept Datei 12 und 35), Stil Holo-Projektion.
   Zahlen belegt in final-claude-code/analyse/ZAHLEN-BELEG.md (Sonntag, Nr. 21-23, Aenderung 15) und im Handbuch
   (09_61b_surf): 10 Level, 5 Tiere, 5 Bahnen, Faehigkeiten ab Level 2, 13 Phasen, 18 Trophaeen, gruenes Herz =
   Heil-Item (Lebensanzeige). Tiefsee/Polarlicht = Designs der Vollbild-Wellenform (13 Designs, 12 Ebenen), daher
   Kapitel 'wellenform' statt 'vollbild-visualizer'. Funktionsnamen wie in der App: Kontext Auto-Wechsel /
   Context Auto-Switch, Party-Modus / Party Mode. Gefangen wird ein Herz (Datei 50 Punkt 17).
   Bilder: Handbuch DE / EN; Spielszenen ohne Text sprachneutral. Song: 172 "Holo-Tunnel" / "Holo Tunnel",
   nicht gekuerzt; Finale auf dem Schlag nach "AutoPlayer" (tools/website/song_finale.py). */
(window.APTage = window.APTage || {}).so = {
  stil: 'holo',
  song: {
    de: { datei: 'audio/tage/so-172-holo-tunnel-de.mp3', dauer: 33.92, finale: 31.2 },
    en: { datei: 'audio/tage/so-172-holo-tunnel-en.mp3', dauer: 31.64, finale: 23.14 },
  },
  titel: { de: 'AutoPlayer – Alles, was die App kann, fliegt vorbei', en: 'AutoPlayer – Everything the app can do flies by' },
  beschreibung: {
    de: 'Surf the Beat: Aus deiner eigenen Musik wird ein Tunnel aus Licht – und alles, was AutoPlayer kann, fliegt vorbei.',
    en: 'Surf the Beat: your own music becomes a tunnel of light – and everything AutoPlayer can do flies by.',
  },
  hero: {
    zeile1: { de: 'Alles, was die App kann,', en: 'Everything the app can do' },
    zeile2: { de: 'fliegt vorbei.', en: 'flies by.' },
    lead: {
      de: 'Sonntag, ein Lied läuft. Mia öffnet den Fullscreen-Visualizer und tippt lange auf Octo – schon surft er durch einen Tunnel aus Licht, gebaut aus genau diesem Lied.',
      en: 'Sunday, a song is playing. Mia opens the Fullscreen Visualizer and presses and holds Octo – and Octo is off, surfing a tunnel of light built from exactly that song.',
    },
    bild: { de: 'handbuch/bilder/surf-bereit.webp', en: 'handbuch/bilder/en/surf-bereit.webp', ar: '540 / 925',
      alt: { de: 'Die Pets warten über dem Tunnel', en: 'The pets wait above the tunnel' }, kapitel: 'surf-the-beat' },
    karten: [
      { icon: 'welle', kapitel: 'surf-the-beat',
        titel: { de: 'Deine Musik, dein Tunnel', en: 'Your music, your tunnel' },
        text: { de: 'Nichts auswählen, nichts laden – gespielt wird mit dem, was der Player ohnehin spielt.', en: 'Nothing to choose, nothing to load – you play with whatever the player is playing anyway.' } },
      { icon: 'stern', kapitel: 'surf-the-beat',
        titel: { de: 'Fünf Tiere, fünf Fähigkeiten', en: 'Five pets, five abilities' },
        text: { de: 'Jedes Tier surft anders und bringt ab Level 2 eine eigene Fähigkeit mit.', en: 'Each pet surfs its own way and brings its own ability from level 2.' } },
    ],
  },
  abschnitte: [
    {
      name: { de: 'Tunnel', en: 'Tunnel' }, pet: 'octo-3d', effekt: 'tunnel',
      titel1: { de: 'Ein Lied läuft –', en: 'A song plays –' }, titel2: { de: 'der Tunnel geht auf.', en: 'the tunnel opens.' },
      text: {
        de: 'Aus dem Lied, das gerade läuft, wird ein Tunnel aus Licht – das Tempo treibt die Ringe, die Tonart gibt die Farbe. Eines deiner Vumikio Pets surft hindurch und weicht Sperrblöcken aus.',
        en: 'The song that is playing becomes a tunnel of light – its tempo drives the rings, its key sets the color. One of your Vumikio Pets surfs through and dodges the blockers.',
      },
      fakten: [{ de: '5 Bahnen · 10 Level', en: '5 lanes · 10 levels' }, { de: '13 Phasen', en: '13 phases' }],
      // sprachneutral
      bilder: [{ de: 'handbuch/bilder/surf-runde.webp', en: 'handbuch/bilder/surf-runde.webp', ar: '540 / 925',
        alt: { de: 'Octo surft durch den Tunnel, vor ihm Note, Herz und Sperrblock', en: 'Octo surfs through the tunnel, ahead a note, a heart and a blocker' }, kapitel: 'surf-the-beat' }],
    },
    {
      name: { de: 'Werkzeuge', en: 'Tools' }, pet: 'chip-icons', effekt: 'flug',
      titel1: { de: 'Am Rand fliegen', en: 'Flying past the edge:' }, titel2: { de: 'deine Werkzeuge vorbei.', en: 'your tools.' },
      text: {
        de: 'Der Theme-Builder gibt der App deine Farben und dem Tunnel eigene Spiel-Themes. Der Track-Cutter speichert einen Ausschnitt als eigene Datei, der Tag-Editor schreibt Titel, Künstler und Album direkt in die Datei.',
        en: 'The Theme Builder gives the app your colors and the tunnel game themes of its own. The Track Cutter saves a section as a file of its own, and the Tag Editor writes title, artist and album straight into the file.',
      },
      fakten: [{ de: 'Themes als Datei teilen', en: 'Share themes as a file' }, { de: 'Tag-Editor: 6 Felder', en: 'Tag Editor: 6 fields' }],
      bilder: [
        { de: 'handbuch/bilder/themebuilder.webp', en: 'handbuch/bilder/en/themebuilder.webp', ar: { de: '540 / 655', en: '540 / 618' }, teil: true,
          alt: { de: 'Theme-Builder mit eigenen Themes', en: 'Theme Builder with your own themes' }, kapitel: 'themebuilder' },
        { de: 'handbuch/bilder/cutter.webp', en: 'handbuch/bilder/en/cutter.webp', ar: '540 / 1170',
          alt: { de: 'Track-Cutter mit gewähltem Bereich', en: 'Track Cutter with a chosen range' }, kapitel: 'cutter' },
      ],
    },
    {
      name: { de: 'Player und Visualizer', en: 'Player and visualizer' }, pet: 'benny-motion', effekt: 'visualizer',
      titel1: { de: 'Platte, Kassette,', en: 'Record, cassette,' }, titel2: { de: 'Tiefsee, Polarlicht.', en: 'Deep Sea, Aurora.' },
      text: {
        de: 'Am DJ-Plattenspieler scratchst du mit dem Finger, im Kassetten-Player drehen sich die Spulen. In der Vollbild-Wellenform pulsieren bei Tiefsee Quallen, bei Polarlicht wandern Lichtvorhänge über den Himmel.',
        en: 'On the DJ Turntable you scratch with your finger, in the Cassette Player the reels turn. In the full-screen waveform, jellyfish pulse in Deep Sea, and curtains of light drift across the sky in Aurora.',
      },
      fakten: [{ de: '13 Designs · 10 Landschaften', en: '13 designs · 10 landscapes' }, { de: '12 Ebenen einzeln schaltbar', en: '12 layers, each switchable' }],
      bilder: [
        // eigene Aufnahmen 14.11.2026 (Datei 50 Punkt 16): Vollbild-Wellenform in Bewegung, Musik laeuft
        { de: 'img/tage/so-tiefsee-de.webp', en: 'img/tage/so-tiefsee-en.webp', video: { de: 'img/tage/so-tiefsee-de.mp4', en: 'img/tage/so-tiefsee-en.mp4' },
          ar: '540 / 1200', alt: { de: 'Vollbild-Wellenform im Design Tiefsee', en: 'Full-screen waveform in the Deep Sea design' }, kapitel: 'wellenform' },
        { de: 'img/tage/so-polarlicht-de.webp', en: 'img/tage/so-polarlicht-en.webp', video: { de: 'img/tage/so-polarlicht-de.mp4', en: 'img/tage/so-polarlicht-en.mp4' },
          ar: '540 / 1200', alt: { de: 'Vollbild-Wellenform im Design Polarlicht', en: 'Full-screen waveform in the Aurora design' }, kapitel: 'wellenform' },
      ],
    },
    {
      name: { de: 'Automatik und Gemeinschaft', en: 'Automation and community' }, pet: 'foxy-color', effekt: 'netz',
      titel1: { de: 'Musik, die selbst wechselt.', en: 'Music that switches on its own.' }, titel2: { de: 'Gäste, die mitwünschen.', en: 'Guests who join in.' },
      text: {
        de: 'Der Smart DJ untersucht jeden Titel auf Tempo, Energie und Tonart, der Kontext Auto-Wechsel wechselt die Musik nach Ort, Zeit oder Wetter. Im Party-Modus wünschen sich Gäste Titel über ihren Browser.',
        en: 'Smart DJ analyzes every song for tempo, energy and key, and Context Auto-Switch changes the music by place, time or weather. In Party Mode, guests request songs through their browser.',
      },
      fakten: [{ de: '29 Bedingungen', en: '29 conditions' }, { de: 'Gäste brauchen keine App', en: 'Guests need no app' }],
      bilder: [
        { de: 'handbuch/bilder/smartdj.webp', en: 'handbuch/bilder/en/smartdj.webp', ar: '820 / 713', teil: true,
          alt: { de: 'Smart DJ: Bibliothek-Analyse', en: 'Smart DJ: library analysis' }, kapitel: 'smartdj' },
        { de: 'handbuch/bilder/party-start.webp', en: 'handbuch/bilder/en/party-start.webp', ar: { de: '540 / 1101', en: '540 / 1000' },
          alt: { de: 'Party-Modus einrichten', en: 'Setting up Party Mode' }, kapitel: 'party' },
      ],
    },
    {
      name: { de: 'Fang', en: 'Catch' }, pet: 'octo-layout', effekt: 'fang',
      titel1: { de: 'Tippen, fangen –', en: 'Tap, catch –' }, titel2: { de: 'das Herz füllt sich.', en: 'the heart fills up.' },
      text: {
        de: 'Fahr auf die Bahn des grünen Herzens und tippe im richtigen Augenblick – in der Lebensanzeige pulst das Herz, das sich füllt. Jedes Lied ist ein Level, und wer zehn am Stück durchhält, gewinnt – mit der Musik, die du ohnehin hörst.',
        en: 'Move onto the green heart’s lane and tap at the right moment – the heart that fills up pulses in the life display. Every song is a level, and if you hold out for ten in a row, you win – with the music you play anyway.',
      },
      fakten: [{ de: 'Grünes Herz heilt', en: 'Green heart heals' }, { de: '18 Trophäen', en: '18 trophies' }],
      // sprachneutral (beide Spielszenen ohne Text)
      bilder: [
        { de: 'handbuch/bilder/surf-dinge.webp', en: 'handbuch/bilder/surf-dinge.webp', ar: '540 / 925',
          alt: { de: 'Ein grünes Herz kommt auf Octo zu', en: 'A green heart comes toward Octo' }, kapitel: 'surf-the-beat' },
        { de: 'handbuch/bilder/surf-fang.webp', en: 'handbuch/bilder/surf-fang.webp', ar: '540 / 925',
          alt: { de: 'Gefangen: Um Octo geht ein grüner Ring auf', en: 'Caught: a green ring opens around Octo' }, kapitel: 'surf-the-beat' },
      ],
    },
  ],
  ende: {
    zeile1: { de: 'Alles, was die App kann,', en: 'Everything the app can do' },
    zeile2: { de: 'fliegt vorbei.', en: 'flies by.' },
    text: {
      de: 'Mehr als ein Player: Werkzeuge, Ansichten, Automatik und ein Spiel – und überall deine eigene Musik.',
      en: 'More than a player: tools, views, automation and a game – with your own music everywhere.',
    },
    verbindungen: [
      { tag: 'mo', text: { de: 'Der Überblick: deine Sammlung, Android Auto, Sprachbefehle und die Pets.', en: 'The overview: your collection, Android Auto, voice commands and the pets.' } },
      { tag: 'di', text: { de: 'Dein Puls bestimmt den Takt – ein ruhiger bringt hier den Cool-Bonus.', en: 'Your pulse sets the beat – a calm one earns the Cool bonus here.' } },
      { tag: 'mi', text: { de: 'Die Musik hört auf dein Wort – per Sprachbefehl, auch im Auto.', en: 'The music answers to your voice – by voice command, in the car too.' } },
      { tag: 'do', text: { de: 'Die Musik weiß, wo du bist – Regeln nach Ort, Zeit und Wetter.', en: 'Your music knows where you are – rules by place, time and weather.' } },
      { tag: 'fr', text: { de: 'Aus deiner Musik wird dein Mix – mit Track-Cutter und Loop-Mixer.', en: 'Your music becomes your mix – with the Track Cutter and Loop Mixer.' } },
      { tag: 'sa', text: { de: 'Die Musik gehört allen – Gäste wünschen sich Titel im Browser.', en: 'The music belongs to everyone – guests request songs in their browser.' } },
    ],
  },
};
