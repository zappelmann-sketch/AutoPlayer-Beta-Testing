/* Mittwoch - Auto mit Android Auto (Wochentags-Konzept Datei 08 und 31), Stil Kassetten-Band.
   Zahlen belegt in final-claude-code/analyse/ZAHLEN-BELEG.md (Mittwoch Nr. 10-13 und "Muss geaendert werden"
   Punkte 6-9): Fahrmodus-DJ bevorzugt Stadt 80-120 / Autobahn 110-160 / Stau 60-100 BPM, Stau unter 15 km/h
   laenger als 3 min; im Auto 16 der 119 Sprachbefehle (Musik waehlen und Wiedergabe steuern), die Lautstaerke
   regelt das Fahrzeug; Geschwindigkeitsbasierte Lautstaerke nur ueber Bluetooth-Lautsprecher und Kopfhoerer,
   nicht mit Android Auto; Beifahrer ohne WLAN und Datenverbindung, Warteschlange gehoert beiden, Anhaengen ohne
   Unterbrechung; Favoriten vorn im Fahrzeug-Menue, der Rest unter "Mehr"; keine Abonnements (Datenschutz).
   Namen aus strings.xml (DE/EN), Texte aus dem Handbuch (05_35, 05_36, 05_38, 05_40, 01_01, 01_06, 07_50,
   07_51, 11_70, 11_71). Leitspruch Datei 50 Punkt 10. Bilder: Handbuch DE / EN.
   Song: 164 "Roadtrip auf Zuruf" / "Roadtrip On Command", nicht gekuerzt. */
(window.APTage = window.APTage || {}).mi = {
  stil: 'kassette',
  song: {
    de: { datei: 'audio/tage/mi-164-roadtrip-auf-zuruf-de.mp3', dauer: 29.88, finale: 28.0 },
    en: { datei: 'audio/tage/mi-164-roadtrip-on-command-en.mp3', dauer: 30.04, finale: 27.16 },
  },
  titel: { de: 'AutoPlayer – Die Musik hört auf dein Wort', en: 'AutoPlayer – The music answers to your voice' },
  beschreibung: {
    de: 'Android Auto: AutoPlayer spielt deine eigene Musik im Auto – per Sprechtaste am Lenkrad, mit Fahrmodus-DJ und Beifahrer-Modus.',
    en: 'Android Auto: AutoPlayer plays your own music in the car – via the voice button on the steering wheel, with Drive Mode DJ and Passenger Mode.',
  },
  hero: {
    zeile1: { de: 'Die Musik hört', en: 'The music answers' },
    zeile2: { de: 'auf dein Wort.', en: 'to your voice.' },
    lead: {
      de: 'Markus pendelt morgens zur Arbeit. Er drückt die Sprechtaste am Lenkrad, sagt „Spiele Playlist Roadtrip“ – und die Musik läuft, ohne dass er auf den Bildschirm schaut.',
      en: 'Markus commutes to work every morning. He presses the voice button on the steering wheel, says “Play playlist Roadtrip” – and the music starts without him looking at the screen.',
    },
    bild: { de: 'handbuch/bilder/androidauto.webp', en: 'handbuch/bilder/en/androidauto.webp', ar: { de: '860 / 456', en: '860 / 516' }, auto: true,
      alt: { de: 'AutoPlayer auf dem Fahrzeugbildschirm mit Android Auto', en: 'AutoPlayer on the car display with Android Auto' }, kapitel: 'androidauto' },
    karten: [
      { icon: 'mikro', kapitel: 'sprachbefehle',
        titel: { de: 'Sprechtaste am Lenkrad', en: 'Voice button on the wheel' },
        text: { de: 'Musik auswählen und die Wiedergabe steuern – per Stimme, ohne Blick auf den Bildschirm.', en: 'Choose music and control playback – by voice, without looking at the screen.' } },
      { icon: 'offline', kapitel: 'erste-schritte',
        titel: { de: 'Deine eigene Musik', en: 'Your own music' },
        text: { de: 'Die Dateien liegen auf deinem Handy – kein Streaming, kein Konto. Musik hören geht sogar im Flugmodus.', en: 'Your files live on your phone – no streaming, no account. Listening even works in airplane mode.' } },
    ],
  },
  abschnitte: [
    {
      name: { de: 'Sprechtaste', en: 'Voice button' }, pet: 'chip-icons', effekt: 'sprechblase',
      titel1: { de: 'Sag einfach,', en: 'Just say' }, titel2: { de: 'was du hören willst.', en: 'what you want to hear.' },
      text: {
        de: '„Spiele Playlist Roadtrip“ – und die Playlist startet mit ihrem ersten Titel. Einmal als Standard-Musik-App festgelegt, landet jeder Musikwunsch von der Sprechtaste bei AutoPlayer.',
        en: '“Play playlist Roadtrip” – and the playlist starts with its first song. Once you set it as the default music app, every music request from the voice button lands at AutoPlayer.',
      },
      fakten: [{ de: 'Titel · Künstler · Album · Playlist · Genre', en: 'Song · artist · album · playlist · genre' }, { de: '„Was spielt?“ wird vorgelesen', en: '“What’s playing?” is read aloud' }],
      bilder: [
        { de: 'handbuch/bilder/voiceplaylist.webp', en: 'handbuch/bilder/en/voiceplaylist.webp', ar: '540 / 1200',
          alt: { de: 'Playlist per Sprache: Welche Playlist?', en: 'Playlist by voice: Which playlist?' }, kapitel: 'voiceplaylist' },
        { de: 'handbuch/bilder/androidauto-einstellung.webp', en: 'handbuch/bilder/en/androidauto-einstellung.webp', ar: '860 / 374', teil: true,
          alt: { de: 'Als Standard-Musik-App festlegen', en: 'Set as default music app' }, kapitel: 'androidauto' },
      ],
    },
    {
      name: { de: 'Fahrmodus-DJ', en: 'Drive Mode DJ' }, pet: 'octo-layout', effekt: 'stau',
      titel1: { de: 'Stadt, Autobahn, Stau –', en: 'City, Highway, Traffic Jam –' }, titel2: { de: 'die Musik fährt mit.', en: 'the music rides along.' },
      text: {
        de: 'Der Fahrmodus-DJ erkennt an der Geschwindigkeit, wie du fährst, und wählt deine Musik danach – beschwingt auf der Autobahn, ruhig im Stau. Jede Lage bevorzugt ihren eigenen Tempobereich.',
        en: 'Drive Mode DJ tells from your speed how you are driving and picks your music to match – upbeat on the highway, calm in a traffic jam. Each situation prefers its own tempo range.',
      },
      fakten: [{ de: 'Stadt 80–120 · Autobahn 110–160 · Stau 60–100 BPM', en: 'City 80–120 · Highway 110–160 · Traffic Jam 60–100 BPM' }, { de: 'Stau: unter 15 km/h, länger als 3 Min.', en: 'Traffic Jam: under 15 km/h for over 3 min' }],
      bilder: [{ de: 'handbuch/bilder/fahrmodus.webp', en: 'handbuch/bilder/en/fahrmodus.webp', ar: '540 / 1101',
        alt: { de: 'Fahrmodus-DJ mit Stadt, Autobahn und Stau', en: 'Drive Mode DJ with City, Highway and Traffic Jam' }, kapitel: 'fahrmodus' }],
    },
    {
      name: { de: 'Beifahrer-Modus', en: 'Passenger Mode' }, pet: 'foxy-color', effekt: 'warteschlange',
      titel1: { de: 'Wer daneben sitzt,', en: 'Whoever sits beside you' }, titel2: { de: 'sucht die Musik aus.', en: 'picks the music.' },
      text: {
        de: 'Die Beifahrerin sucht vom eigenen Handy aus mit: Sie hängt einen Titel an die Warteschlange, und die Musik läuft ohne Unterbrechung weiter. Markus muss sein Handy nicht anfassen.',
        en: 'The passenger joins in from her own phone: she adds a song to the queue, and the music keeps playing without a break. Markus never has to touch his phone.',
      },
      fakten: [{ de: 'Ohne WLAN, ohne Datenverbindung', en: 'No Wi-Fi, no data connection' }, { de: 'Die Warteschlange gehört beiden', en: 'The queue belongs to both' }],
      bilder: [
        { de: 'handbuch/bilder/beifahrer.webp', en: 'handbuch/bilder/en/beifahrer.webp', ar: '540 / 505', teil: true,
          alt: { de: 'Rollenwahl HOST oder BEIFAHRER', en: 'Choosing the role HOST or PASSENGER' }, kapitel: 'beifahrer' },
        { de: 'handbuch/bilder/beifahrer-songs.webp', en: 'handbuch/bilder/en/beifahrer-songs.webp', ar: '540 / 1101',
          alt: { de: 'Beifahrer-Modus: Songs mit Suche', en: 'Passenger Mode: songs with search' }, kapitel: 'beifahrer' },
      ],
      hinweis: { de: 'Dafür läuft AutoPlayer auf beiden Handys.', en: 'For this, AutoPlayer runs on both phones.' },
    },
    {
      name: { de: 'Favoriten', en: 'Favorites' }, pet: 'benny-motion', effekt: 'band',
      titel1: { de: 'Deine Favoriten', en: 'Your favorites' }, titel2: { de: 'stehen vorn.', en: 'are right up front.' },
      text: {
        de: 'Was du am Handy mit Herz markierst, steht im Auto vorn im Menü – der kürzeste Weg zu deiner Lieblingsmusik. Weiterhören bringt angefangene Titel zurück an die gemerkte Stelle.',
        en: 'Whatever you mark with a heart on your phone sits up front in the car menu – the shortest way to the music you love. Continue Listening takes songs you started back to the saved spot.',
      },
      fakten: [{ de: 'Favoriten · Zuletzt gespielt · Alle Songs', en: 'Favorites · Recently Played · All Songs' }, { de: 'Alles Weitere unter „Mehr“', en: 'Everything else under “More”' }],
      // LUECKE: DHU-Aufnahme Favoriten folgt
      bilder: [{ de: 'handbuch/bilder/favoriten.webp', en: 'handbuch/bilder/en/favoriten.webp', ar: '540 / 1170',
        alt: { de: 'Reiter Favoriten mit allen Titeln mit Herz', en: 'Favorites tab with every song marked with a heart' }, kapitel: 'favoriten' }],
    },
    {
      name: { de: 'Gut zu wissen', en: 'Good to know' }, pet: 'melo-type', effekt: 'zaehler',
      titel1: { de: 'Ehrlich gesagt:', en: 'To be honest:' }, titel2: { de: 'Die Lautstärke regelt dein Auto.', en: 'your car sets the volume.' },
      text: {
        de: 'Die Sprechtaste wählt Musik aus und steuert die Wiedergabe; Bildschirme, Tempo und Timer gehen per Sprache nur am Handy. Die Geschwindigkeitsbasierte Lautstärke wirkt über Bluetooth-Lautsprecher und Kopfhörer, nicht mit Android Auto.',
        en: 'The voice button picks music and controls playback; screens, tempo and timers by voice work on the phone only. Speed-based Volume works through Bluetooth speakers and headphones, not with Android Auto.',
      },
      fakten: [{ de: '16 von 119 Sprachbefehlen im Auto', en: '16 of 119 voice commands in the car' }, { de: 'Der Rest steht unter „Nur Handy“', en: 'The rest is under “Phone Only”' }],
      bilder: [
        { de: 'handbuch/bilder/sprachbefehle-handy.webp', en: 'handbuch/bilder/en/sprachbefehle-handy.webp', ar: '540 / 1200',
          alt: { de: 'Sprachbefehle, Reiter Nur Handy', en: 'Voice Commands, Phone Only tab' }, kapitel: 'sprachbefehle' },
        { de: 'handbuch/bilder/speedvolume-verlauf.webp', en: 'handbuch/bilder/en/speedvolume-verlauf.webp', ar: { de: '540 / 660', en: '540 / 539' }, teil: true,
          alt: { de: 'Geschwindigkeitsbasierte Lautstärke mit Verlauf', en: 'Speed-based Volume with its curve' }, kapitel: 'speedvolume' },
      ],
      hinweis: { de: 'Das gibt Android so vor – für jede App gleich.', en: 'Android sets it up this way – the same for every app.' },
    },
  ],
  ende: {
    zeile1: { de: 'Die Musik hört', en: 'The music answers' },
    zeile2: { de: 'auf dein Wort.', en: 'to your voice.' },
    text: {
      de: 'Sprechtaste drücken, Wunsch sagen, weiterfahren. Deine eigene Musik – offline und ohne Abo.',
      en: 'Press the button, say what you want, keep driving. Your own music – offline and with no subscription.',
    },
    verbindungen: [
      { tag: 'do', text: { de: 'Kontext-Regeln wechseln die Musik nach Uhrzeit oder Bluetooth-Gerät.', en: 'Context rules switch your music by time of day or Bluetooth device.' } },
      { tag: 'di', text: { de: 'Eine Herzschlag-Session läuft auch unter Android Auto weiter.', en: 'A Heartbeat Sync session keeps running under Android Auto.' } },
    ],
    hinweis: { de: 'Wie AutoPlayer im Auto aussieht, gibt dein Fahrzeug vor.', en: 'How AutoPlayer looks in the car is up to your vehicle.' },
  },
};
