/* Samstag - Party-Modus (Wochentags-Konzept Datei 11 und 34), Stil Lego-Stapel.
   Zahlen belegt in final-claude-code/analyse/ZAHLEN-BELEG.md (Samstag, Nr. 20a-20h) und Handbuch 08_56_party:
   zwei QR-Codes (erst WLAN-Login, dann Party-Adresse mit PIN), Gaeste im Browser ohne App, Suche und
   Durchsuchen (Titel, Alben, Kuenstler, Genres), Abstimmung ab Werk an, Genehmigung optional, PIN je Party neu,
   Max. Gaeste 20 (2-50), Gaeste sperren und freigeben. Kein Verschluesselungshinweis (Datei 50 Punkt 15),
   keine Gesten (allgemeine Funktion, Beleg 20j). Bilder: Handbuch DE / EN. Hero: party-gast-laeuft (Konzept
   ohne Bild; der gewuenschte Titel laeuft beim Gast = Leitspruch). party-absicherung oben beschnitten
   (ar 480 / 425 statt 712 / 600), damit der Verbindungshinweis der App nicht im Bild steht.
   Song: DE 171 "Ruf und Antwort", EN 170 "Bricks On The Beat" (Kay 14.11.2026), nicht gekuerzt. */
(window.APTage = window.APTage || {}).sa = {
  stil: 'lego',
  song: {
    de: { datei: 'audio/tage/sa-171-ruf-und-antwort-de.mp3', dauer: 29.68, finale: 27.89 },
    en: { datei: 'audio/tage/sa-170-bricks-on-the-beat-en.mp3', dauer: 39.08, finale: 34.88 },
  },
  titel: { de: 'AutoPlayer – Die Musik gehört allen', en: 'AutoPlayer – The music belongs to everyone' },
  beschreibung: {
    de: 'Party-Modus: Deine Gäste wünschen sich Titel aus deiner eigenen Musik – per QR-Code im Browser, ohne App.',
    en: 'Party Mode: your guests request songs from your own music – via QR code in their browser, no app needed.',
  },
  hero: {
    zeile1: { de: 'Die Musik', en: 'The music' },
    zeile2: { de: 'gehört allen.', en: 'belongs to everyone.' },
    lead: {
      de: 'Tom gibt eine Grillparty: Seine Gäste scannen einen Code und wünschen sich im Browser Titel aus seiner Musik, ohne eine App zu installieren. Als Ninas Lieblingssong läuft, steigt die Stimmung – weil es ihr Wunsch war.',
      en: 'Tom is throwing a barbecue: his guests scan a code and request songs from his music in their browser, without installing an app. When Nina’s favorite song comes on, the mood lifts – because it was her request.',
    },
    bild: { de: 'handbuch/bilder/party-gast-laeuft.webp', en: 'handbuch/bilder/en/party-gast-laeuft.webp', ar: '540 / 982',
      alt: { de: 'Gast-Ansicht: Der Wunsch läuft', en: 'Guest view: the request is playing' }, kapitel: 'party' },
    karten: [
      { icon: 'leute', kapitel: 'party',
        titel: { de: 'Gäste ohne App', en: 'Guests need no app' },
        text: { de: 'Ein Scan genügt: Gäste wünschen sich Titel im Browser – die Seite gibt es in allen Sprachen der App.', en: 'One scan is enough: guests request songs in their browser – the page comes in every language of the app.' } },
      { icon: 'offline', kapitel: 'party',
        titel: { de: 'Läuft ohne Internet', en: 'Runs without internet' },
        text: { de: 'Dein Handy wird zum Musikserver – die Party bleibt in deinem eigenen Netz.', en: 'Your phone becomes the music server – the party stays on your own network.' } },
    ],
  },
  abschnitte: [
    {
      name: { de: 'Start', en: 'Start' }, pet: 'chip-icons', effekt: 'qr',
      titel1: { de: 'Zwei Codes,', en: 'Two codes,' }, titel2: { de: 'und die Party läuft.', en: 'and the party is on.' },
      text: {
        de: 'Du startest den Party-Modus, und dein Handy zeigt zwei QR-Codes. Der erste bringt die Gäste ins WLAN, der zweite öffnet die Party im Browser – die PIN steckt schon mit drin.',
        en: 'You start Party Mode, and your phone shows two QR codes. The first gets your guests onto the Wi-Fi, the second opens the party in their browser – with the PIN already included.',
      },
      fakten: [{ de: '2 QR-Codes', en: '2 QR codes' }, { de: 'WLAN-Login zuerst scannen', en: 'Scan WiFi Login first' }],
      bilder: [{ de: 'handbuch/bilder/party-laeuft.webp', en: 'handbuch/bilder/en/party-laeuft.webp', ar: '540 / 1101',
        alt: { de: 'Die Party läuft: zwei QR-Codes', en: 'The party is running: two QR codes' }, kapitel: 'party' }],
    },
    {
      name: { de: 'Gast', en: 'Guest' }, pet: 'melo-type', effekt: 'stapel',
      titel1: { de: 'Name rein,', en: 'Enter a name,' }, titel2: { de: 'Lieblingssong suchen.', en: 'find a favorite.' },
      text: {
        de: 'Nach dem Scan trägt der Gast seinen Namen ein und tippt auf „Party beitreten“. Schon beim Tippen ins Suchfeld erscheinen passende Titel – oder er stöbert nach Alben, Künstlern und Genres.',
        en: 'After scanning, a guest enters a name and taps “Join Party”. Matching songs appear while they type in the search field – or they browse albums, artists and genres.',
      },
      fakten: [{ de: 'Im Browser, ohne App', en: 'In the browser, no app' }, { de: 'Titel · Alben · Künstler · Genres', en: 'Songs · Albums · Artists · Genres' }],
      bilder: [
        { de: 'handbuch/bilder/party-gast-anmelden.webp', en: 'handbuch/bilder/en/party-gast-anmelden.webp', ar: '540 / 1066',
          alt: { de: 'Gast-Anmeldung im Browser', en: 'Guest sign-in in the browser' }, kapitel: 'party' },
        { de: 'handbuch/bilder/party-gast-suche.webp', en: 'handbuch/bilder/en/party-gast-suche.webp', ar: '540 / 1068',
          alt: { de: 'Gast sucht einen Titel', en: 'Guest searching for a song' }, kapitel: 'party' },
      ],
    },
    {
      name: { de: 'Wunsch', en: 'Request' }, pet: 'foxy-color', effekt: 'turm',
      titel1: { de: 'Ein Tipp aufs Plus –', en: 'One tap on the plus –' }, titel2: { de: 'der Wunsch ist drin.', en: 'the request is in.' },
      text: {
        de: 'Der Wunsch landet in der Warteschlange, die alle Gäste sehen. Was gerade spielt, läuft zu Ende, dann sind die Wünsche dran – und ohne Wünsche läuft deine Musik einfach weiter.',
        en: 'The request lands in the queue that every guest can see. Whatever is playing finishes, then the requests take their turn – and with none left, your music simply keeps playing.',
      },
      fakten: [{ de: '1 Tipp aufs Plus', en: '1 tap on the plus' }, { de: 'Warteschlange für alle sichtbar', en: 'Queue visible to everyone' }],
      bilder: [{ de: 'handbuch/bilder/party-gast-warteschlange.webp', en: 'handbuch/bilder/en/party-gast-warteschlange.webp', ar: '540 / 1068',
        alt: { de: 'Warteschlange mit Stimmen', en: 'Queue with votes' }, kapitel: 'party' }],
    },
    {
      name: { de: 'Abstimmung', en: 'Voting' }, pet: 'benny-motion', effekt: 'wackeln',
      titel1: { de: 'Mehr Stimmen,', en: 'More votes,' }, titel2: { de: 'früher dran.', en: 'sooner on.' },
      text: {
        de: 'Der Pfeil neben einem Wunsch ist eine Stimme, und mehr Stimmen rücken ihn nach vorn. Als Gastgeber siehst du alles auf einen Blick und kannst einen Wunsch sofort spielen, nach oben schieben oder entfernen.',
        en: 'The arrow next to a request is a vote, and more votes move it forward. As the host you see everything at a glance and can play a request right away, push it to the top or remove it.',
      },
      fakten: [{ de: '1 Pfeil = 1 Stimme', en: '1 arrow = 1 vote' }, { de: 'Abstimmung ab Werk an', en: 'Voting on by default' }],
      bilder: [{ de: 'handbuch/bilder/party-gastgeber.webp', en: 'handbuch/bilder/en/party-gastgeber.webp', ar: '540 / 1101',
        alt: { de: 'Warteschlange beim Gastgeber', en: 'The host’s queue' }, kapitel: 'party' }],
    },
    {
      name: { de: 'Sicherheit', en: 'Security' }, pet: 'octo-layout', effekt: 'mauer',
      titel1: { de: 'Dein Handy,', en: 'Your phone,' }, titel2: { de: 'deine Regeln.', en: 'your rules.' },
      text: {
        de: 'Eine PIN, die bei jeder Party neu entsteht, lässt nur deine Gäste hinein. Auf Wunsch genehmigst du jeden Titel, bevor er in die Warteschlange kommt, und du legst fest, wie viele Gäste mitmachen.',
        en: 'A PIN that is new for every party lets only your guests in. If you like, you approve every song before it joins the queue, and you decide how many guests join in.',
      },
      fakten: [{ de: 'Max. Gäste: 20 (2–50)', en: 'Max Guests: 20 (2–50)' }, { de: 'Gäste sperren und freigeben', en: 'Block and unblock guests' }],
      bilder: [{ de: 'handbuch/bilder/party-absicherung.webp', en: 'handbuch/bilder/en/party-absicherung.webp', ar: { de: '540 / 480', en: '540 / 425' }, teil: true,
        alt: { de: 'PIN, Genehmigung und Max. Gäste', en: 'PIN, approval and Max Guests' }, kapitel: 'party' }],
    },
  ],
  ende: {
    zeile1: { de: 'Die Musik', en: 'The music' },
    zeile2: { de: 'gehört allen.', en: 'belongs to everyone.' },
    text: {
      de: 'Ein Handy, zwei Codes – und jeder Gast setzt seinen Wunsch wie einen Stein obendrauf. Mitmachen ist so einfach wie ein Scan.',
      en: 'One phone, two codes – and every guest adds a request like a brick on top. Joining in is as easy as a scan.',
    },
    verbindungen: [
      { tag: 'do', text: { de: 'Eine Kontext-Regel startet deine Party-Playlist von selbst – etwa samstagabends.', en: 'A context rule starts your party playlist by itself – on Saturday evenings, say.' } },
      { tag: 'fr', text: { de: 'Den eigenen Party-Mix baust du im Loop-Mixer und teilst ihn über den Sharing-Hub.', en: 'Build your own party mix in the Loop Mixer and share it through the Sharing Hub.' } },
    ],
  },
};
