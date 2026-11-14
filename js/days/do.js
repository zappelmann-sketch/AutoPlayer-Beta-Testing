/* Donnerstag - Kontext-Regeln (Wochentags-Konzept Datei 09 und 32), Stil Pixel-Aufbau.
   Zahlen belegt in final-claude-code/analyse/ZAHLEN-BELEG.md (Donnerstag Nr. 14-17 und "Muss geaendert werden"
   Punkte 10-12): 29 Bedingungen in vier Gruppen, jede mit NICHT umkehrbar; 5 nutzbare Aktionen ("Ordner
   abspielen" ist im Regel-Editor nicht waehlbar und ohne Wirkung, bleibt deshalb weg); 101 Regel-Vorlagen in
   10 Kategorien plus 10 Komplett-Setups, "Pendeln" ist eine Kategorie, keine Vorlage; Abklingzeit ab Werk 30 min;
   Wetter hoechstens alle 30 min mit auf etwa 110 m gerundeten Koordinaten, "Natur in der Naehe" ab Werk aus.
   Namen aus strings.xml (DE/EN), Texte aus dem Handbuch (07_50, 07_50b, 07_53, 13_102 Datenschutz, 12_93).
   Bilder: Handbuch DE / EN. Hero (im Konzept ohne Bild): kontext.webp, der Einstieg Kontext Auto-Wechsel mit
   Quick-Wins, Kontext-Monitor und Regel-Vorlagen - zeigt allerdings die leere Regelliste und die Statusleiste,
   nach der Emulator-Aufnahme der Regelansicht ggf. tauschen. Datenschutz: datenschutz-verweise statt
   kontext-quickwins (Konzept), weil es die Wetter-Ausnahme mit den 110 m zeigt; quickwins zeigt nur Einstellungen.
   Song: 167 "Ort Zeit Wetter" / "Place Time Weather" (Kay 14.11.2026), nicht gekuerzt. */
(window.APTage = window.APTage || {}).do = {
  stil: 'pixel',
  song: {
    de: { datei: 'audio/tage/do-167-ort-zeit-wetter-de.mp3', dauer: 31.20, finale: 28.58 },
    en: { datei: 'audio/tage/do-167-place-time-weather-en.mp3', dauer: 32.08, finale: 30.6 },
  },
  titel: { de: 'AutoPlayer – Die Musik weiß, wo du bist', en: 'AutoPlayer – Your music knows where you are' },
  beschreibung: {
    de: 'Kontext Auto-Wechsel: AutoPlayer wechselt deine eigene Musik nach Uhrzeit, Ort, Bluetooth, WLAN und Wetter – einmal eingerichtet, danach von selbst.',
    en: 'Context Auto-Switch: AutoPlayer switches your own music by time, place, Bluetooth, Wi-Fi and weather – set up once, then all by itself.',
  },
  hero: {
    zeile1: { de: 'Die Musik weiß,', en: 'Your music knows' },
    zeile2: { de: 'wo du bist.', en: 'where you are.' },
    lead: {
      de: 'Jonas hat seine Routinen einmal in Regeln gepackt. Morgens um sieben verbindet sich sein Handy per Bluetooth mit dem Auto – und seine Playlist für den Weg startet von selbst.',
      en: 'Jonas put his routines into rules once. At seven in the morning his phone connects to the car via Bluetooth – and his playlist for the drive starts by itself.',
    },
    // eigene Aufnahme 14.11.2026 (Emulator, Android 17): drei aktive Regeln statt der leeren Liste
    bild: { de: 'img/tage/do-uebersicht-de.webp', en: 'img/tage/do-uebersicht-en.webp', ar: '540 / 1200',
      alt: { de: 'Kontext Auto-Wechsel mit drei aktiven Regeln', en: 'Context Auto-Switch with three active rules' }, kapitel: 'kontext' },
    karten: [
      { icon: 'stern', kapitel: 'kontext',
        titel: { de: 'Einmal einrichten', en: 'Set up once' },
        text: { de: 'Eine Vorlage übernehmen, anpassen, speichern – danach wechselt die Musik von selbst.', en: 'Take a preset, adjust it, save it – from then on the music switches by itself.' } },
      { icon: 'ort', kapitel: 'orte',
        titel: { de: 'Meine Orte', en: 'My places' },
        text: { de: 'Zuhause, Arbeit, Sportstudio: auf der Karte markiert – deine Regeln können sich danach richten.', en: 'Home, work, the gym: mark them on the map – your rules can use them.' } },
    ],
  },
  abschnitte: [
    {
      name: { de: 'Vorlagen', en: 'Presets' }, pet: 'chip-grid', effekt: 'raster',
      titel1: { de: '101 Vorlagen', en: '101 presets' }, titel2: { de: 'zum Loslegen.', en: 'to start from.' },
      text: {
        de: 'Statt bei null anzufangen, übernimmst du eine fertige Regel und passt sie an – etwa „Werktag Aufstehen“ oder „Morgenfahrt“ aus der Kategorie Pendeln.',
        en: 'Instead of starting from scratch, you take a ready-made rule and adjust it – such as “Workday wake-up” or “Morning drive” from the Commute category.',
      },
      fakten: [{ de: '10 Kategorien', en: '10 categories' }, { de: '10 Komplett-Setups', en: '10 full setups' }],
      // eigene Aufnahme: Regel-Vorlagen, Kategorie Pendeln (Morgenfahrt, Abendfahrt, Autobahn, Stau, Lange Tour)
      bilder: [{ de: 'img/tage/do-vorlagen-de.webp', en: 'img/tage/do-vorlagen-en.webp', ar: '540 / 1200',
        alt: { de: 'Regel-Vorlagen der Kategorie Pendeln', en: 'Rule presets of the Commute category' }, kapitel: 'kontext' }],
    },
    {
      name: { de: 'Bedingungen', en: 'Conditions' }, pet: 'octo-layout', effekt: 'symbole',
      titel1: { de: 'Uhrzeit, Ort, Wetter:', en: 'Time, place, weather:' }, titel2: { de: '29 Bedingungen.', en: '29 conditions.' },
      text: {
        de: 'Von der Uhrzeit über dein Bluetooth-Gerät und dein WLAN bis zum Wetter – in vier Gruppen. Alle Bedingungen einer Regel müssen gleichzeitig zutreffen.',
        en: 'From the time of day to your Bluetooth device, your Wi-Fi and the weather – in four groups. All conditions of a rule must be true at the same time.',
      },
      fakten: [{ de: 'Bekannter Ort aus Meine Orte', en: 'Known place from My places' }, { de: 'Jede mit NICHT umkehrbar', en: 'Each can be reversed with NOT' }],
      // eigene Aufnahme (Datei 50 Punkt 12): eine Regel mit fuenf Bedingungen - Zeitbereich, Tagestyp,
      // Bluetooth-Geraet, Wetter, Geschwindigkeitsbereich
      bilder: [{ de: 'img/tage/do-bedingungen-de.webp', en: 'img/tage/do-bedingungen-en.webp', ar: '540 / 1200',
        alt: { de: 'Eine Regel mit fünf Bedingungen', en: 'A rule with five conditions' }, kapitel: 'kontext' }],
    },
    {
      name: { de: 'Aktionen', en: 'Actions' }, pet: 'foxy-color', effekt: 'aktionen',
      titel1: { de: 'Dann wechselt', en: 'Then the music' }, titel2: { de: 'die Musik.', en: 'switches.' },
      text: {
        de: 'Trifft alles zu, führt die Regel ihre Aktion aus: Playlist abspielen, Smarte Playlist, Auto-Playlist, Queue wechseln oder Queue-Vorlage. Danach ruht sie eine Weile – so springt die Musik nicht alle paar Minuten um.',
        en: 'When everything matches, the rule runs its action: Play Playlist, Smart Playlist, Auto Playlist, Switch Queue or Queue Preset. Then it rests for a while – so the music doesn’t jump around every few minutes.',
      },
      fakten: [{ de: '5 Aktionen', en: '5 actions' }, { de: 'Abklingzeit: ab Werk 30 Min.', en: 'Cooldown: 30 min by default' }],
      // eigene Aufnahme (Datei 50 Punkt 13): die Auswahl der fuenf Aktionen einer Regel
      bilder: [{ de: 'img/tage/do-aktionen-de.webp', en: 'img/tage/do-aktionen-en.webp', ar: '540 / 1200',
        alt: { de: 'Die fünf Aktionen einer Regel', en: 'The five actions of a rule' }, kapitel: 'kontext' }],
    },
    {
      name: { de: 'Kontext-Monitor', en: 'Context Monitor' }, pet: 'benny-motion', effekt: 'monitor',
      titel1: { de: 'Live sehen,', en: 'See live' }, titel2: { de: 'welche Regel greift.', en: 'which rule fires.' },
      text: {
        de: 'Der Kontext-Monitor zeigt alle Signale in Echtzeit – Uhrzeit, Tag, Bluetooth, WLAN, Geschwindigkeit, Akku und mehr. Greift eine Regel nicht, steht hier der Grund.',
        en: 'The Context Monitor shows every signal in real time – time, day, Bluetooth, Wi-Fi, speed, battery and more. If a rule doesn’t fire, you’ll find the reason here.',
      },
      fakten: [{ de: 'Alle Signale in Echtzeit', en: 'All signals in real time' }, { de: 'Warum eine Regel nicht greift', en: 'Why a rule doesn’t fire' }],
      bilder: [{ de: 'handbuch/bilder/kontext-monitor.webp', en: 'handbuch/bilder/en/kontext-monitor.webp', ar: '540 / 937',
        alt: { de: 'Kontext-Monitor: aktueller Kontext, System und Sensoren', en: 'Context Monitor: current context, system and sensors' }, kapitel: 'kontext' }],
    },
    {
      name: { de: 'Datenschutz', en: 'Privacy' }, pet: 'melo-type', effekt: 'schloss',
      titel1: { de: 'Bleibt auf dem Gerät –', en: 'Stays on your device –' }, titel2: { de: 'bis auf zwei Ausnahmen.', en: 'with two exceptions.' },
      text: {
        de: 'Nutzt eine Regel das Wetter, fragt die App höchstens alle 30 Minuten einen Wetterdienst – mit auf etwa 110 Meter gerundeten Koordinaten. „Natur in der Nähe“ fragt einen Kartendienst – ab Werk aus, nur mit deiner ausdrücklichen Erlaubnis. Alle anderen Signale bleiben auf dem Handy.',
        en: 'If a rule uses the weather, the app asks a weather service at most every 30 minutes – with coordinates rounded to about 110 meters. “Nature Nearby” asks a map service – off by default, only with your explicit consent. All other signals stay on your phone.',
      },
      fakten: [{ de: 'Wetter: auf ~110 m gerundet', en: 'Weather: rounded to ~110 m' }, { de: 'Natur in der Nähe: ab Werk aus', en: 'Nature Nearby: off by default' }],
      bilder: [{ de: 'handbuch/bilder/datenschutz-verweise.webp', en: 'handbuch/bilder/en/datenschutz-verweise.webp', ar: { de: '540 / 370', en: '540 / 348' }, teil: true,
        alt: { de: 'Datenschutzerklärung, Abschnitt 6: Wetter im Kontext Auto-Wechsel', en: 'Privacy policy, section 6: weather in Context Auto-Switch' }, kapitel: 'datenschutz' }],
    },
  ],
  ende: {
    zeile1: { de: 'Die Musik weiß,', en: 'Your music knows' },
    zeile2: { de: 'wo du bist.', en: 'where you are.' },
    text: {
      de: 'Einmal einrichten, danach wechselt die Musik von selbst. Startest du selbst etwas, hast du das letzte Wort.',
      en: 'Set it up once, and from then on the music switches by itself. Start something yourself, and you have the last word.',
    },
    verbindungen: [
      { tag: 'mi', text: { de: 'Im Auto gehen deine Regeln dem Fahrmodus-DJ vor.', en: 'In the car, your rules come before Drive Mode DJ.' } },
      { tag: 'fr', text: { de: 'Aus deinen eigenen Titeln baust du einen Mix – direkt auf dem Handy.', en: 'Build a mix from your own songs – right on your phone.' } },
      { tag: 'sa', text: { de: 'Samstagabends startet eine Regel deine Party-Playlist – etwa aus der Vorlage „Samstags-Tanzen“.', en: 'On Saturday night a rule starts your party playlist – built from the “Saturday dancing” preset, for example.' } },
    ],
  },
};
