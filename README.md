# AutoPlayer

**Musik-Player für die eigene Musiksammlung – auf dem Android-Handy und im Auto über Android Auto.**
**A music player for your own music collection – on Android phones and in the car through Android Auto.**

[Website](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/) ·
[Benutzerhandbuch](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/handbuch/index.html) /
[User Guide](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/handbuch/index.html?lang=en) ·
[Datenschutz / Privacy](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/privacy.html) ·
[Nutzungsbedingungen / Terms](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/terms.html) ·
[Impressum / Legal Notice](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/impressum.html)

**Stand / As of:** 8. November 2026 · Version **6.77.0** (versionCode 344) ·
geschlossene Beta, Veröffentlichung im Play Store in Vorbereitung /
closed beta, Play Store release in preparation

---

## Projekt auf einen Blick / Project at a glance

Gemessen am 08.11.2026 im Projekt-Repository (alle Dateien unter Git, mit den Zählwerkzeugen des Projekts).
Measured on 2026-11-08 in the project repository (all files under Git, with the project's own counting tools).

| Kennzahl / Metric | Wert / Value |
|---|---|
| Version | 6.77.0 (versionCode 344) |
| Android | 10 bis 16 / 10 to 16 – minSdk 29, targetSdk und compileSdk 36 |
| In Entwicklung seit / In development since | 7. März 2026 / 7 March 2026 (erster Commit / first commit) – 898 Commits |
| App-Quellcode Kotlin / App source code Kotlin | 232.561 Zeilen in 942 Dateien, davon 177.981 ohne Leer- und Kommentarzeilen / 232,561 lines in 942 files, 177,981 of them without blank and comment lines |
| Unit-Tests / Unit tests | 2.312 Tests in 251 Dateien, letzter Lauf ohne Fehler / 2,312 tests in 251 files, last run without failures |
| Bildschirme / ViewModels – Screens / ViewModels | 75 / 26 |
| Datenbank / Database | Room, Schema-Version 49, 46 Tabellen, 41 DAOs, verschlüsselt mit SQLCipher / schema version 49, 46 tables, 41 DAOs, encrypted with SQLCipher |
| Sprachen / Languages | 26 – Oberfläche, Sprachbefehle, Handbuch in der App / user interface, voice commands, in-app guide |
| Texte je Sprache / Strings per language | 4.352 Texte, 112 Pluralformen, 19 Listen / 4,352 strings, 112 plurals, 19 arrays |
| Benutzerhandbuch / User guide | 113 Kapitel in 13 Bereichen; online Deutsch und Englisch mit 726 Bildern, Vorlesen auf Deutsch / 113 chapters in 13 sections; online in German and English with 726 pictures, read-aloud in German |
| Funktionen laut Handbuch / Features per guide | 39 frei, 68 Pro, 6 teilweise frei / 39 free, 68 Pro, 6 partly free |
| Vumikio Pets und Surf the Beat | 59.718 Zeilen Kotlin (Code und Tests); Sprechtexte in 26 Sprachen, je 25 Dateien / 59,718 lines of Kotlin (code and tests); speech texts in 26 languages, 25 files each |

---

## Dieses Repository / This repository

Hier liegt der Internetauftritt von AutoPlayer, ausgeliefert über GitHub Pages. Er wird im Projekt-Repository aus dem
Ordner `website/` gebaut und hierher übertragen.
This repository holds the AutoPlayer website, served through GitHub Pages. It is built from the `website/` folder of
the project repository and copied here.

```
AutoPlayer-Beta-Testing/
├── index.html            Startseite (Deutsch/Englisch) / landing page (German/English)
├── handbuch/             Online-Benutzerhandbuch: 113 Kapitel, Bilder, deutsche Vorlese-Aufnahmen
│                         online user guide: 113 chapters, pictures, German read-aloud recordings
├── privacy.html          Datenschutzerklärung / Privacy Policy
├── terms.html            Nutzungsbedingungen / Terms of Use
├── impressum.html        Impressum / Legal Notice
├── changelog.json        Änderungsprotokoll für die Update-Karte der App (letzte 15 Versionen)
│                         changelog for the app's update card (last 15 versions)
├── llms.txt, index.md,   für Suchmaschinen und KI-Modelle: Kurzüberblick und Markdown-Fassungen
│   robots.txt,           for search engines and AI models: overview and Markdown versions
│   sitemap.xml
├── css/, js/, img/,      Startseite – eigene Skripte, keine fremden Bibliotheken
│   audio/                landing page – own scripts, no third-party libraries
└── .github/              Vorlagen für Fehlerberichte, Wünsche und Testberichte
                          templates for bug reports, feature requests and test reports
```

**Grundsätze der Website / Website principles:** keine Cookies, kein Tracking, keine Inhalte von fremden Servern,
strenge Content-Security-Policy, Systemschrift. Sprache und Anzeige stehen nur in der Adresse (`?lang=`, `?pets=aus`,
`?bau=aus`); das Handbuch merkt sich gehörte Kapitel im Browser (siehe Datenschutzerklärung).
No cookies, no tracking, no content from third-party servers, strict Content Security Policy, system fonts. Language
and display options live only in the address; the guide remembers chapters you have listened to in the browser (see
the Privacy Policy).

---

## Technik / Technology

### Architektur / Architecture

Clean Architecture mit MVVM, einschichtige App (ein Gradle-Modul), ohne Dependency-Injection-Framework.
Clean Architecture with MVVM, single Gradle module, no dependency injection framework.

```
Oberfläche / UI          Jetpack Compose, Material 3 – 75 Bildschirme / screens, 26 ViewModels
        │
Daten / Data             Room + SQLCipher (46 Tabellen / tables), DataStore, MediaStore, jAudioTagger
        │
Wiedergabe / Playback    Media3 ExoPlayer, eigene Audio-Kette / own audio chain
                         (Equalizer, Effekte / effects, Crossfade, Tempo über / via AudioTrack)
        │
Dienste / Services       MusicService (MediaLibraryService, MediaSession) – Android Auto,
                         Party-Modus (Ktor-Server), Mitfahrer und Geräte-Transfer (Nearby),
                         Herzschlag-Sync (Bluetooth LE), Widget
```

### Tech-Stack

| Bereich / Area | Technik / Technology |
|---|---|
| Sprache und Bau / Language and build | Kotlin 2.4.21, Java 17, Gradle 8.11.1 (Kotlin DSL), Android Gradle Plugin 8.9.3, KSP 2.3.7, Version Catalog, R8 |
| Oberfläche / UI | Jetpack Compose (BOM 2026.06.01, UI 1.11.4), Material 3, Navigation Compose 2.9.8, Lifecycle 2.10.0, Activity Compose 1.13.0, Core KTX 1.18.0, AppCompat 1.8.0 |
| Wiedergabe / Playback | Media3 1.11.1 (ExoPlayer, Session, UI) |
| Daten / Data | Room 2.8.5, SQLCipher 4.20.0, DataStore 1.3.0, WorkManager 2.12.0, DocumentFile 1.1.0, jAudioTagger 3.0.1 |
| Nebenläufigkeit, Formate / Concurrency, formats | Kotlin Coroutines 1.11.0, kotlinx.serialization 1.12.0 |
| Verbindungen / Connectivity | Ktor Server 3.5.2 (CIO, WebSockets), Play Services Nearby 19.5.0, Bluetooth LE |
| Bilder, Karte, QR / Images, map, QR | Coil 2.7.0, Palette 1.1.0, osmdroid 6.1.20, CameraX 1.6.2, ZXing 3.5.4 |
| Kauf, Updates, Absturzberichte / Purchase, updates, crash reports | Play Billing 9.1.0, Play In-App Update 2.1.0, ACRA 5.13.1 (nur mit Einwilligung / only with consent) |
| Tests | JUnit 4.13.2, MockK 1.14.11, Turbine 1.2.1, kotlinx-coroutines-test, AndroidX Test 1.7.0, Espresso 3.7.0, Compose UI Test |
| Website | HTML, CSS und JavaScript ohne Frameworks / without frameworks; Vumikio Pets als eigene Canvas-Zeichnung / drawn on canvas |

### Code nach Paketen / Code by package (`app/src/main`)

| Paket / Package | Inhalt / Contents | Dateien / Files | Zeilen / Lines |
|---|---|---:|---:|
| `presentation/screens` | Bildschirme / screens (Compose) | 214 | 83.991 |
| `player` | Wiedergabe, Audio, Effekte / playback, audio, effects | 216 | 57.781 |
| `presentation/components` | Bausteine, darunter die Pets / components, incl. the pets | 98 | 22.947 |
| `data` | Datenbank, Einstellungen, Sicherung / database, settings, backup | 148 | 17.323 |
| `domain` | Modelle und Regeln, darunter das Spiel / models and rules, incl. the game | 95 | 16.229 |
| `sharing` | Sharing-Hub, Mixer-Bundles, QR | 89 | 11.014 |
| `service` | MusicService, Android Auto | 4 | 4.227 |
| übrige / other | Transfer, Party, Pro-Kauf, Mitfahrer, Widget, Update … | 78 | 19.049 |
| **Summe / Total** | | **942** | **232.561** |

---
---

# Deutsch

## Was ist AutoPlayer?

**AutoPlayer** ist ein Musik-Player für Android, der deine eigene Musik abspielt: die Musikdateien, die auf deinem
Handy liegen – deine MP3-Sammlung. Er läuft auf dem Handy und im Auto über **Android Auto**. Streaming, Abo und
Benutzerkonto gibt es nicht.

### Wie es dazu kam

Am Anfang stand ein Wunsch aus dem Alltag: die eigene Musiksammlung im Auto hören – bedient über den Bildschirm im
Armaturenbrett und per Sprache, ohne Internet und ohne Abo. Musik ist beim Fahren mehr als Unterhaltung. Wenn es auf
der Straße hektisch wird, holt die richtige Musik einen herunter: Man fährt ruhiger und kommt entspannter an. Aus
diesem Wunsch ist AutoPlayer entstanden – zuerst als Player für die Fahrt, dann Stück für Stück für alles, was man mit
seiner Musik machen möchte.

### Für wen AutoPlayer gedacht ist

- Für alle, die **eigene Musikdateien** besitzen und sie hören, ordnen und pflegen wollen – mit Playlists, Favoriten,
  Genres und dem Tag-Editor.
- Für **Autofahrer mit Android Auto**: große Bedienflächen, Sprachbefehle und Funktionen für die Fahrt – Musik passend
  zu Stadt, Autobahn und Stau oder zum Wetter.
- Für alle, die **ohne Streaming** hören möchten – ohne Abo, ohne Werbung, auch im Funkloch, im Ausland oder im
  Flugzeug.
- Für **Musik-Bastler**, die mit dem Loop-Mixer und dem Synth Studio aus ihren Titeln eigene Mixe bauen.
- Und für alle, die beim Hören **Freude am Spiel** haben: Player-Ansichten, Visualizer, die Vumikio Pets und das
  Spiel Surf the Beat.

### Wie AutoPlayer mit deinen Daten umgeht

AutoPlayer ist eine **lokale App**. Deine Musik, die Bibliothek, Playlists, der Verlauf und alle Einstellungen werden
nur auf deinem Gerät verarbeitet. Es gibt kein Konto, keine Cloud und keinen Server des Anbieters, auf dem deine Daten
liegen – kein Tracking, keine Werbung, kein Verkauf von Daten. Die Datenbank der App ist verschlüsselt.

Zum Musikhören braucht AutoPlayer kein Internet, die App läuft auch im Flugmodus. Ins Netz geht sie nur bei wenigen
Funktionen am Rand, etwa für das Wetter beim Wetter-DJ, für die Suche nach Aktualisierungen oder für den Kauf von Pro
über Google Play. Absturzberichte gehen nur mit deiner Einwilligung hinaus. Einzelheiten stehen in der
[Datenschutzerklärung](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/privacy.html).

### Frei und Pro

Die Grundfunktionen sind frei. **AutoPlayer Pro** schaltet die übrigen Funktionen frei – **einmalig, kein Abo**. Von
den 113 Kapiteln des Handbuchs beschreiben 39 freie Funktionen, 68 Pro-Funktionen und 6 Funktionen, die teilweise
frei sind. Das Handbuch kennzeichnet jedes Kapitel.

## Funktionen nach Bereichen

So gegliedert wie das [Benutzerhandbuch](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/handbuch/index.html)
(113 Kapitel in 13 Bereichen):

1. **Grundlagen** (12) – Erste Schritte, Musikbibliothek, der Player, Menü am Titel, Playlists, Favoriten,
   Einstellungen, Song-Details, Genre durchsuchen, App-Aktualisierungen, Hauptmenü, AutoPlayer Pro
2. **Die Player-Ansichten** (10) – DJ-Plattenspieler, Jukebox, Kassette, Bandmaschine, Vintage-Plattenspieler,
   Sci-Fi-Hologramm, Balken-Visualizer, Vollbild-Visualizer, Musik-DNA
3. **Klang und Effekte** (7) – Equalizer, Konzert-Modus, Gesangs-Isolator, Binaurale Beats, Atmosphären-Mixer,
   Gehörschutz, Bass-Vibration
4. **Was die App selbst aussucht** (7) – Smart DJ, Smarte Playlists, Auto-Playlists, Stimmungswandler,
   Stimmungs-Browse, Smart Reorder, Song-Pfade
5. **Im Fahrzeug** (6) – Android Auto, Fahrmodus-DJ, Wetter-DJ, geschwindigkeitsbasierte Lautstärke,
   Kabinen-Kalibrator, Beifahrer-Modus
6. **Die Wiedergabe steuern** (9) – Warteschlangen, Abstecher, Queue Crossfade, A–B-Wiederholung, Wellenform,
   Wiedergabeposition merken, Beat-Match DJ, Schlaf-Timer, Schlaf-Ausblendung
7. **Wenn die App selbst reagiert** (7) – Kontext Auto-Wechsel, Meine Orte, Herzschlag-Sync, Klangerinnerung,
   Geo-Musik, Schütteln zum Mischen, Gestensteuerung
8. **Zu mehreren** (2) – Party-Modus, Sharing-Hub
9. **Statistiken, Erfolge und Maskottchen** (5) – Musik-Rückblick, Erfolge und Level, Nostalgie-Maschine,
   Vumikio Pets, Surf the Beat
10. **Werkzeuge** (8) – Tag-Editor, Track-Cutter, Klingelton-Wechsler, Tag-Retter, Startbildschirm-Widget,
    Kurzbefehle am App-Symbol, Theme-Builder, Batterie-Modus
11. **Mit der Stimme steuern** (3) – Sprachbefehle, Playlists per Sprache, Vorlesen
12. **Loop-Mixer und Synth Studio** (30) – Mixe aus eigenen Titeln mit Tonspuren, Segmenten, Beat-Match, Effekten,
    Automation, Markern und Export; Pad-Mode; Synth Studio (subtraktiv, FM, Wavetable), Arpeggiator, Projektvorlagen
13. **Daten, Datenschutz und Umzug** (7) – Sichern und Wiederherstellen, Datenschutz, Berechtigungen,
    Absturzberichte, Geräte-Transfer, Werkseinstellungen, App beenden

Android Auto wird im eigenen Fahrzeug (10,1-Zoll-Display) und mit der Desktop Head Unit getestet.

## Sprachen

26 Sprachen für Oberfläche, Sprachbefehle und das Handbuch in der App: Deutsch, English, Español, Français,
Italiano, Nederlands, Polski, Português (Brasil), Русский, Українська, Čeština, Dansk, Norsk, Suomi, Svenska,
Türkçe, العربية, हिन्दी, ไทย, Tiếng Việt, Bahasa Indonesia, Bahasa Melayu, 日本語, 한국어, 简体中文, 繁體中文.
Die Rechtstexte und das Online-Handbuch gibt es auf Deutsch und Englisch.

## Entwicklungsverlauf

| Datum | Version | Was |
|---|---|---|
| 07.03.2026 | 0.1.0 | Projektstart (erster Commit) |
| 10.03.2026 | 1.0.0 | erste vollständige Fassung, u. a. Fahrmodus-DJ |
| 19.03.2026 | 3.0.0 | Kontext Auto-Wechsel |
| 14.04.2026 | 4.0.0 | Vumikio Pets mit Level-System bis 1000 |
| 26.04.2026 | 5.0.0 | Teilen von Loop-Mixer-Inhalten |
| 27.04.2026 | 6.0.0 | neue Klangerzeugung im Synth Studio |
| 17.10.2026 | 6.75.0 | Surf the Beat |
| 19.10.2026 | 6.76.0 | Herzschlag-Sync, neu gebaut |
| 04.11.2026 | 6.77.0 | neues Benutzerhandbuch in der App (113 Kapitel, Vorlesen), bis 05.11. in allen 26 Sprachen |
| 08.11.2026 | – | Website mit Online-Handbuch (dieses Repository) |

Die Veröffentlichung im Google Play Store ist in Vorbereitung; einen festen Termin gibt es noch nicht.

## Beta-Test

Der frühere interaktive Testplan ist vorerst nicht mehr online; wie die Beta-Tests künftig ablaufen, wird gerade neu
festgelegt. Fehler und Wünsche bitte weiterhin als
[GitHub-Issue](https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues/new/choose) melden – mit den
Vorlagen für Fehlerbericht, Feature-Wunsch oder Testbericht.

Voraussetzungen: Android 10 oder neuer, eigene Musikdateien auf dem Gerät; für Android Auto ein passendes Fahrzeug
oder die Desktop Head Unit.

## Kontakt

- **E-Mail:** zappelmann+autoplayer@googlemail.com
- **Fehler melden:** [GitHub Issues](https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues/new/choose)
- [Datenschutzerklärung](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/privacy.html) ·
  [Nutzungsbedingungen](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/terms.html) ·
  [Impressum](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/impressum.html)

---
---

# English

## What is AutoPlayer?

**AutoPlayer** is a music player for Android that plays your own music: the music files stored on your phone – your
MP3 collection. It runs on your phone and in the car through **Android Auto**. There is no streaming, no subscription
and no user account.

### How it started

It started with an everyday wish: to listen to your own music collection in the car – controlled from the dashboard
screen and by voice, without internet and without a subscription. When you drive, music is more than entertainment.
When traffic gets hectic, the right music helps you calm down: you drive more calmly and arrive more relaxed.
AutoPlayer grew out of this wish – first as a player for the road, then, step by step, for everything you might want
to do with your music.

### Who AutoPlayer is for

- Anyone who owns **their own music files** and wants to listen to them, organize them and keep them in order – with
  playlists, favorites, genres and the tag editor.
- **Drivers with Android Auto**: large controls, voice commands and features for the road – music to suit the city,
  the highway, a traffic jam or the weather.
- Anyone who wants to listen **without streaming** – no subscription, no ads, even without a signal, abroad or on a
  plane.
- **Music tinkerers** who build their own mixes from their songs with the Loop Mixer and the Synth Studio.
- And anyone who likes a bit of **play** while listening: player views, visualizers, the Vumikio Pets and the game
  Surf the Beat.

### How AutoPlayer handles your data

AutoPlayer is a **local app**. Your music, library, playlists, history and all settings are processed on your device
only. There is no account, no cloud and no server of the provider holding your data – no tracking, no ads, no selling
of data. The app's database is encrypted.

AutoPlayer needs no internet to play music; it also works in airplane mode. It only goes online for a few features on
the side, such as the weather for the Weather DJ, checking for updates or buying Pro through Google Play. Crash reports
are only sent with your consent. Details are in the
[Privacy Policy](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/privacy.html?lang=en).

### Free and Pro

The basic features are free. **AutoPlayer Pro** unlocks the rest – **a one-time purchase, no subscription**. Of the
guide's 113 chapters, 39 describe free features, 68 Pro features and 6 features that are partly free. The guide marks
every chapter.

## Features by section

Organized like the [User Guide](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/handbuch/index.html?lang=en)
(113 chapters in 13 sections):

1. **Basics** (12) – getting started, music library, the player, the song menu, playlists, favorites, settings, song
   details, Genre Browse, app updates, main menu, AutoPlayer Pro
2. **The player views** (10) – DJ Turntable, Jukebox, Cassette, Reel-to-Reel, Vintage Turntable, Sci-Fi Hologram, bar
   visualizer, Fullscreen Visualizer, Music DNA
3. **Sound and effects** (7) – Equalizer, Concert Mode, Vocal Isolator, Binaural Beats, Atmosphere Mixer, Hearing
   Protection, Bass Vibration
4. **What the app picks by itself** (7) – Smart DJ, Smart Playlists, Auto Playlists, Mood Morph, Mood Browse, Smart
   Reorder, Song Paths
5. **In the vehicle** (6) – Android Auto, Drive Mode DJ, Weather DJ, Speed-based Volume, Cabin Calibrator, Passenger
   Mode
6. **Controlling playback** (9) – queues, Detour, Queue Crossfade, A–B Repeat, Waveform, Remember Playback Position,
   Beat-Match DJ, Sleep Timer, Sleep Fade
7. **When the app reacts by itself** (7) – Context Auto-Switch, My places, Heartbeat Sync, Sound Souvenir, Geo Music,
   Shake to Shuffle, Gesture Control
8. **With others** (2) – Party Mode, Sharing Hub
9. **Statistics, achievements and mascots** (5) – Music Wrapped, achievements and levels, Nostalgia Machine,
   Vumikio Pets, Surf the Beat
10. **Tools** (8) – Tag Editor, Track Cutter, Ringtone Changer, Tag Rescue, home screen widget, app icon shortcuts,
    Theme Builder, Battery Mode
11. **Controlling by voice** (3) – voice commands, playlists by voice, read aloud
12. **Loop Mixer and Synth Studio** (30) – mixes from your own songs with tracks, segments, beat matching, effects,
    automation, markers and export; Pad Mode; Synth Studio (subtractive, FM, wavetable), Arpeggiator, project
    templates
13. **Data, privacy and moving** (7) – backing up and restoring, privacy, permissions, crash reports, Device Transfer,
    factory reset, exit app

Android Auto is tested in the developer's own car (10.1-inch display) and with the Desktop Head Unit.

## Languages

26 languages for the user interface, voice commands and the in-app guide: Deutsch, English, Español, Français,
Italiano, Nederlands, Polski, Português (Brasil), Русский, Українська, Čeština, Dansk, Norsk, Suomi, Svenska,
Türkçe, العربية, हिन्दी, ไทย, Tiếng Việt, Bahasa Indonesia, Bahasa Melayu, 日本語, 한국어, 简体中文, 繁體中文.
The legal texts and the online guide are available in German and English.

## Development timeline

| Date | Version | What |
|---|---|---|
| 2026-03-07 | 0.1.0 | project start (first commit) |
| 2026-03-10 | 1.0.0 | first complete version, including Drive Mode DJ |
| 2026-03-19 | 3.0.0 | Context Auto-Switch |
| 2026-04-14 | 4.0.0 | Vumikio Pets with a level system up to 1000 |
| 2026-04-26 | 5.0.0 | sharing Loop Mixer content |
| 2026-04-27 | 6.0.0 | new sound engine in the Synth Studio |
| 2026-10-17 | 6.75.0 | Surf the Beat |
| 2026-10-19 | 6.76.0 | Heartbeat Sync, rebuilt |
| 2026-11-04 | 6.77.0 | new in-app user guide (113 chapters, read-aloud), in all 26 languages by 2026-11-05 |
| 2026-11-08 | – | website with the online guide (this repository) |

The release on the Google Play Store is in preparation; there is no fixed date yet.

## Beta testing

The former interactive test plan is no longer online for now; how beta testing will work from here is being
redefined. Please keep reporting bugs and wishes as a
[GitHub issue](https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues/new/choose) – with the templates for
bug report, feature request or test report.

Requirements: Android 10 or newer, your own music files on the device; for Android Auto a compatible car or the
Desktop Head Unit.

## Contact

- **E-mail:** zappelmann+autoplayer@googlemail.com
- **Report a bug:** [GitHub Issues](https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues/new/choose)
- [Privacy Policy](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/privacy.html?lang=en) ·
  [Terms of Use](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/terms.html?lang=en) ·
  [Legal Notice](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/impressum.html?lang=en)
