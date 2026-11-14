/* Dienstag - Herzschlag-Sync (Wochentags-Konzept Datei 07 und 30), Stil Wellenform.
   Zahlen belegt in final-claude-code/analyse/ZAHLEN-BELEG.md (Dienstag): Ziele und Namen aus dem Code
   (HeartbeatGoal), 55-140 BPM, Kurve ein Schritt je Lied, +-5 BPM, Dauer 10-120 min, Zonen, Vorlagen,
   Vibrationsstufen Dezent/Leicht/Mittel, kein Medizinprodukt. Bilder: Handbuch DE / EN.
   Song: 163 "Atem und Trommel" / "Breath And Drum" (Kay 14.11.2026), nicht gekuerzt. */
(window.APTage = window.APTage || {}).di = {
  stil: 'wellenform',
  song: {
    de: { datei: 'audio/tage/di-163-atem-und-trommel-de.mp3', dauer: 28.84, finale: 27.43 },
    en: { datei: 'audio/tage/di-163-breath-and-drum-en.mp3', dauer: 31.36, finale: 29.57 },
  },
  titel: { de: 'AutoPlayer – Dein Puls bestimmt den Takt', en: 'AutoPlayer – Your pulse sets the beat' },
  beschreibung: {
    de: 'Herzschlag-Sync: AutoPlayer wählt deine eigene Musik passend zu deinem Puls – zum Laufen und zum Runterkommen.',
    en: 'Heartbeat Sync: AutoPlayer picks your own music to match your pulse – for running and for winding down.',
  },
  hero: {
    zeile1: { de: 'Dein Puls', en: 'Your pulse' },
    zeile2: { de: 'bestimmt den Takt.', en: 'sets the beat.' },
    lead: {
      de: 'Lena läuft nach der Arbeit eine Runde. Ihre Uhr sendet den Puls, AutoPlayer spielt dazu ihre eigene Musik im passenden Tempo – erst im Laufschritt, danach Lied für Lied ruhiger.',
      en: 'Lena goes for a run after work. Her watch sends her pulse, and AutoPlayer plays her own music at the right tempo – first at running pace, then calmer song by song.',
    },
    bild: { de: 'handbuch/bilder/herzschlag-kopf.webp', en: 'handbuch/bilder/en/herzschlag-kopf.webp', ar: '540 / 1016',
      alt: { de: 'Herzschlag-Sync mit Live-Puls', en: 'Heartbeat Sync with live pulse' }, kapitel: 'herzschlag' },
    karten: [
      { icon: 'herz', kapitel: 'herzschlag',
        titel: { de: 'Puls von der Uhr', en: 'Pulse from your watch' },
        text: { de: 'Jedes Gerät mit Bluetooth-Herzfrequenz genügt – eine App des Herstellers braucht es nicht.', en: 'Any device with Bluetooth heart rate will do – no app from its maker needed.' } },
      { icon: 'schild', kapitel: 'herzschlag',
        titel: { de: 'Bleibt auf dem Handy', en: 'Stays on your phone' },
        text: { de: 'Der Puls wird nur im Arbeitsspeicher verarbeitet – nie gespeichert, nie gesendet.', en: 'Your pulse is processed in memory only – never stored, never sent.' } },
    ],
  },
  abschnitte: [
    {
      name: { de: 'Pulslinie', en: 'Pulse line' }, pet: 'octo-layout', effekt: 'ekg',
      titel1: { de: 'Die Pulslinie', en: 'The pulse line' }, titel2: { de: 'läuft live mit.', en: 'runs live.' },
      text: {
        de: 'Während der Session liegen dein Puls und die Kurve der Musik übereinander – du siehst, wie dicht die Musik deinem Herzschlag folgt.',
        en: 'During the session your pulse and the curve of the music lie on top of each other – you see how closely the music follows your heartbeat.',
      },
      fakten: [{ de: 'Live-Puls per Bluetooth', en: 'Live pulse via Bluetooth' }, { de: 'Ein Kurvenschritt je Lied', en: 'One curve step per song' }],
      bilder: [{ de: 'handbuch/bilder/herzschlag-session.webp', en: 'handbuch/bilder/en/herzschlag-session.webp', ar: '760 / 914', teil: true,
        alt: { de: 'Herzschlag-Session läuft', en: 'Heartbeat session running' }, kapitel: 'herzschlag' }],
    },
    {
      name: { de: 'Ziele', en: 'Goals' }, pet: 'chip-grid', effekt: 'wellen',
      titel1: { de: 'Fünf Ziele.', en: 'Five goals.' }, titel2: { de: 'Ein Tipp.', en: 'One tap.' },
      text: {
        de: 'Relax, Energie halten, Aktivität unterstützen, Aktivieren / Push oder Cooldown – du wählst, wohin es geht. Den Zielwert schiebst du zwischen 55 und 140 BPM.',
        en: 'Relax, Keep energy, Support activity, Activate / Push or Cooldown – you choose where to go. You slide the target anywhere between 55 and 140 BPM.',
      },
      fakten: [{ de: 'Aktivität: um 125 BPM', en: 'Activity: around 125 BPM' }, { de: 'Cooldown: Richtung 70 BPM', en: 'Cooldown: towards 70 BPM' }],
      bilder: [{ de: 'handbuch/bilder/herzschlag-ziel.webp', en: 'handbuch/bilder/en/herzschlag-ziel.webp', ar: { de: '760 / 1288', en: '760 / 1105' },
        alt: { de: 'Ziele von Herzschlag-Sync', en: 'Heartbeat Sync goals' }, kapitel: 'herzschlag' }],
    },
    {
      name: { de: 'Musikkurve', en: 'Music curve' }, pet: 'octo-3d', effekt: 'kurve',
      titel1: { de: 'Die Musik folgt', en: 'The music follows' }, titel2: { de: 'deinem Körper.', en: 'your body.' },
      text: {
        de: 'Aus deinen eigenen Titeln entsteht eine Kurve – sanft, normal oder dynamisch, ein Schritt je Lied. Bei „Relax“ zum Beispiel von 85 auf 65 BPM.',
        en: 'Your own songs form a curve – gentle, normal or dynamic, one step per song. With “Relax”, for example, from 85 down to 65 BPM.',
      },
      fakten: [{ de: '10 bis 120 Minuten', en: '10 to 120 minutes' }, { de: 'Jeder Titel ±5 BPM an der Kurve', en: 'Each song within ±5 BPM of the curve' }],
      bilder: [{ de: 'handbuch/bilder/herzschlag-kurve.webp', en: 'handbuch/bilder/en/herzschlag-kurve.webp', ar: { de: '760 / 726', en: '760 / 656' }, teil: true,
        alt: { de: 'Empfohlene Musikkurve', en: 'Recommended music curve' }, kapitel: 'herzschlag' }],
    },
    {
      name: { de: 'Herzschlag-Vibration', en: 'Heartbeat vibration' }, pet: 'foxy-color', effekt: 'herz',
      titel1: { de: 'Das Handy schlägt', en: 'Your phone beats' }, titel2: { de: 'in deinem Takt.', en: 'to your rhythm.' },
      text: {
        de: 'Mit der Herzschlag-Vibration spürst du deinen Puls in der Hand. Du schaltest sie bei jedem App-Start selbst ein – so vibriert nichts ungefragt.',
        en: 'With heartbeat vibration you feel your pulse in your hand. You switch it on yourself every time you start the app – so nothing vibrates unasked.',
      },
      fakten: [{ de: 'Dezent · Leicht · Mittel', en: 'Subtle · Light · Medium' }],
      bilder: [{ de: 'handbuch/bilder/vibration-herzschlag.webp', en: 'handbuch/bilder/en/vibration-herzschlag.webp', ar: '760 / 468', teil: true,
        alt: { de: 'Herzschlag-Vibration', en: 'Heartbeat vibration' }, kapitel: 'vibration' }],
    },
    {
      name: { de: 'Auswertung', en: 'Summary' }, pet: 'benny-motion', effekt: 'balken',
      titel1: { de: 'Nach dem Lauf:', en: 'After the run:' }, titel2: { de: 'deine Zonen.', en: 'your zones.' },
      text: {
        de: 'Die Auswertung zeigt den Verlauf und wie lange du in welcher Zone warst – Ruhezone, Leicht, Moderat, Intensiv oder Maximum. Dazu das Lied, das dich am meisten beruhigt hat.',
        en: 'The summary shows the course and how long you spent in each zone – Rest, Light, Moderate, Intense or Maximum. Plus the song that calmed you down the most.',
      },
      fakten: [{ de: '5 Zonen', en: '5 zones' }, { de: 'Als Puls-Vorlage speichern', en: 'Save as pulse template' }],
      bilder: [{ de: 'handbuch/bilder/herzschlag-auswertung.webp', en: 'handbuch/bilder/en/herzschlag-auswertung.webp', ar: '760 / 1288',
        alt: { de: 'Auswertung der Session', en: 'Session summary' }, kapitel: 'herzschlag' }],
    },
  ],
  ende: {
    zeile1: { de: 'Dein Puls', en: 'Your pulse' },
    zeile2: { de: 'bestimmt den Takt.', en: 'sets the beat.' },
    text: {
      de: 'Ein Gerät, das den Puls sendet, genügt. Die Musik folgt dir – nicht umgekehrt.',
      en: 'A device that sends your pulse is all it takes. The music follows you – not the other way round.',
    },
    verbindungen: [
      { tag: 'mi', text: { de: 'Unterwegs: Musik per Sprache, auch im Auto.', en: 'On the road: music by voice, in the car too.' } },
      { tag: 'so', text: { de: 'Ein ruhiger Puls bringt im Spiel den Cool-Bonus.', en: 'A calm pulse earns the Cool bonus in the game.' } },
    ],
    hinweis: { de: 'AutoPlayer ist kein Medizinprodukt und stellt keine Diagnosen.', en: 'AutoPlayer is not a medical device and does not diagnose anything.' },
  },
};
