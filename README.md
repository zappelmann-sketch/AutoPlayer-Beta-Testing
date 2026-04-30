# AutoPlayer — Closed Beta Testing Portal

Willkommen beim Closed Beta Test fuer **AutoPlayer** — dem innovativsten lokalen MP3-Player fuer Android mit 133+ Features, vollstaendiger Android Auto Integration und 26 Sprachen.

Welcome to the Closed Beta Test for **AutoPlayer** — the most innovative local MP3 player for Android with 133+ features, full Android Auto integration and 26 languages.

---

## Projekt auf einen Blick / Project at a Glance

| Metrik / Metric | Wert / Value |
|-----------------|--------------|
| Kotlin-Dateien / Kotlin Files | 542 |
| Lines of Code | 92.366 |
| Features | 133+ (F-001 – F-133) |
| UI-Screens | 72 |
| Sprachen / Languages | 26 |
| Strings je Sprache / per Language | 2.776 |
| Room Entities | 40 |
| Room DAOs | 34 |
| Room DB Version | 37 |
| Player-Engine Module | 149 |
| Synth-Stimmen / Synth Voices | 16 polyphone |
| Loop Mixer Tonspuren / Tracks | 16 |
| Synth-Presets (Factory) | 300+ |
| Achievements | 62 |
| Entwicklungsdauer / Dev Duration | ~8 Wochen / ~8 weeks |
| Version Code | 95 |
| Version Name | 6.1.10 |
| Min SDK | API 29 (Android 10) |
| Target SDK | API 35 (Android 15) |

---

## Fuer Tester / For Testers

### 1. App herunterladen / Download App
Die App ist ueber den Google Play Store erhaeltlich (Link folgt nach dem Launch).
The app is available via Google Play Store (link coming after launch).

### 2. Testplan oeffnen / Open Test Plan
Oeffne den interaktiven Testplan / Open the interactive test plan:
**[https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/)**

### 3. App testen / Test the App
- Installiere die App auf deinem Android-Geraet (Android 10+) / Install the app on your Android device (Android 10+)
- Oeffne den Testplan im Browser / Open the test plan in your browser
- Trage deine Geraete-Infos ein / Enter your device information
- Teste Feature fuer Feature / Test feature by feature
- Markiere Bugs und Verbesserungswuensche / Mark bugs and improvement wishes

### 4. Ergebnis absenden / Submit Results
Am Ende des Testplans / At the end of the test plan:
- Klicke **"Per E-Mail an Entwickler senden"** / Click **"Send to developer via email"**
- **ODER / OR:** Erstelle ein [GitHub Issue](https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues/new) und haenge die JSON-Datei an / Create a GitHub Issue and attach the JSON file

---

## Feature-Uebersicht / Feature Overview

### Kern-Wiedergabe / Core Playback
- Unterstuetzte Formate / Supported Formats: **MP3, FLAC, AAC, OGG, WAV, M4A**
- Lueckenlose Wiedergabe / Gapless playback
- 5-Band-Equalizer mit Presets / 5-band EQ with presets (Bass Boost, Surround, Cabin Calibration)
- A-B Repeat & Loop mit Uebungsmodus / A-B Repeat & Loop with Practice Mode
- Sleep-Timer mit Fade-Out / Sleep timer with fade-out
- Temposteuerung (pitch-korrigiert) / Speed control (pitch-corrected)
- Crossfade zwischen Titeln / Crossfade between tracks
- Lautstaerke-Normalisierung / Volume normalization
- Haptisches Feedback (522+ Interaktionspunkte) / Haptic feedback (522+ interaction points)

### Player-Skins & Visualisierung / Player Skins & Visualization
- **6 Player-Skins:** DJ-Turntable, Jukebox, Walkman/Kassette, Bandmaschine (Reel-to-Reel), Sci-Fi-Hologramm, Standard
- Vollbild-Wellenform / Fullscreen Waveform mit Lesezeichen & Farbauswahl / with bookmarks & color picker
- Genome Visualizer (24 Farbpaletten, Song-Seed-basiert / 24 color palettes, song-seed based)
- Vollbild-Visualizer / Fullscreen Visualizer
- Vintage Turntable

### Musik-Bibliothek & Organisation / Music Library & Organization
- Musik-Scanner fuer alle lokalen Dateien / Music scanner for all local files
- **Genre-Browse** mit 6 Saeulen (Phone + Auto + Voice + Batch + Tag-Editor + Settings) — F-106
- Stimmungs-Browse / Mood Browse (dynamisch generiert / dynamically generated)
- Smart Playlists mit NLP-Erkennung / Smart Playlists with NLP recognition ("Spiel froehliche Rock Songs")
- Auto-Playlists (regelbasiert / rule-based)
- Favoriten / Favorites
- Wiedergabe-Historie / Play History
- Queue-System mit Presets & Undo / Queue system with presets & undo
- Versteckte Songs / Hidden Songs
- Song-Pfad Anzeige / Song path display

### Tag-Verwaltung / Tag Management
- **Tag-Editor** (ID3-Metadaten direkt bearbeiten / edit ID3 metadata directly)
- **Tag-Rescue** (automatische Tag-Reparatur via JAudioTagger + MediaStore / automatic tag repair)
- Batch-Tag-Editierung / Batch tag editing

### Android Auto
- Vollstaendige MediaBrowserService-Integration / Full MediaBrowserService integration
- **7 Browse-Kategorien:** Favoriten, Zuletzt gehoert, Playlists, Alle Songs, Alben, Kuenstler, Genres
- Album-Cover in Browse-Tree / Album art in browse tree (ArtworkProvider)
- Sprachsteuerung in **26 Sprachen** / Voice control in **26 languages**
- Fuzzy-Matching fuer Sprachbefehle / Fuzzy matching for voice commands
- Standard-Musik-App-Registrierung fuer Lenkradtaste / Default music app registration for steering wheel button — F-133

### Sprachsteuerung & TTS / Voice Control & TTS
- Vollstaendige Sprachsteuerung (STT) / Full voice control (STT)
- TTS-Vorlese-Funktion / TTS read-aloud function
- Draggable Mic-FAB (frei positionierbar / freely positionable) — F-115
- Voice Commands in 26 Sprachen / in 26 languages

### KI & Analyse / AI & Analysis
- **Smart DJ** (BPM/Key/Energy-Analyse aller Songs / analysis of all songs)
- **NLP Smart Playlists** (natuerlichsprachliche Playlist-Erstellung / natural language playlist creation)
- **Wetter-DJ** / Weather DJ (standortbasierte Musikauswahl / location-based music selection)
- **Stimmungs-Morphing** / Mood Morphing (dynamische Stimmungsanpassung / dynamic mood adaptation)
- BPM-Anzeige auf allen 72 Screens / BPM display on all 72 screens
- Ton-Analyse (Key, Energie, BPM) / Tone analysis (key, energy, BPM)
- Geo-Musik-Regeln / Geo Music Rules (standortbasierte Playlists / location-based playlists)
- **Kontext-Auto-Switch** / Context Auto-Switch (12+ Bedingungen: GPS, Wetter, Kalender, Sensoren / 12+ conditions)

### Synthesizer Studio — F-121
- **4 Synth-Modi / 4 Synth Modes:**
  - Subtractive Synthesis (klassische VA-Synthese / classic VA synthesis)
  - FM Synthesis (DX7-Style, 4 Operatoren, 8 Algorithmen / 4 operators, 8 algorithms)
  - Wavetable Synthesis (8 prozedurale Wavetables / 8 procedural wavetables)
  - Drum Synthesis (Schlaginstrumente / drum instruments)
- **16 polyphone Stimmen / 16 polyphonic voices**
- **300+ Factory-Presets** in 20 Kategorien (Bass, Lead, Pad, Bell, Organ, Pluck, FX, Strings, Brass, Wind, Ethnic, E-Piano, Clavinet, Guitar, Vocal, Retro, Ambient, Soundscape, Drums, Cinematic)
- DSP: Schroeder-Reverb, Tape Echo, Low/High-Pass Filter, Pitch-Shift, DC-Blocker
- MIDI USB + Bluetooth LE
- Live-Recording & Recording-Manager
- **Arpeggiator + Step-Sequencer** (16 Steps, BPM-Sync, Swing, Hold) — F-124

### Loop Mixer — F-117
- **16 Tonspuren / 16 tracks** mit individuellen Neon-Farben / with individual neon colors
- Pad-Mode (1:1 Pad-Track-Mapping, 16 Pads) — F-120
- Templates (vordefinierte Projekt-Vorlagen / predefined project templates) — F-126
- Marker & Loop-Bookmarks / Markers & loop bookmarks
- Beat-Grid Visualisierung / Beat-grid visualization
- Automation (Lautstaerke, Pan / Volume, Pan)
- Export (Audio-Mixdown)
- Schroeder-Reverb, Tape Echo, Filter-DSP

### Konnektivitaet / Connectivity
- **Party-Modus** / Party Mode (lokaler HTTP-Server, Gaeste steuern Musik per QR-Code / local HTTP server, guests control music via QR code)
  - Genre-Browse & Alphabet-Navigation im Browser / Genre browse & alphabet navigation in browser
  - Now Playing Timeline im Browser / Now playing timeline in browser
  - Hotspot-IP-Erkennung (Dual-WiFi Android 12+ / Dual-WiFi detection)
- **Beifahrer-Modus** / Passenger Mode (Fernsteuerung vom Beifahrer-Geraet / remote control from passenger device) — F-097
- **Geraete-Transfer** / Device Transfer (Nearby Connections, Daten auf neues Geraet uebertragen / transfer data to new device) — F-112
- **Sharing-Suite** (6 Format-Familien: .arpset, .synthset, .loopseg, .padconfig, .mxproj, .mxbundle + QR-Code) — F-109

### Personalisierung / Personalization
- **Theme Builder** (eigene Themes mit Farbpaletten / custom themes with color palettes)
- **24 Farbpaletten** fuer Genome Visualizer / color palettes for Genome Visualizer
- Dynamischer Player-Hintergrund / Dynamic player background (Album-Art Blur, AMOLED, Tageszeit-adaptiv / time-of-day adaptive)
- Glass-Dark-Neon UI auf allen 72 Screens / Glass-Dark-Neon UI across all 72 screens

### Spezial-Player / Special Players
- **Atmosphaeren-Mixer** / Atmosphere Mixer (Umgebungsgeraeusche-Ebenen / ambient sound layers)
- **Binaural Beats** (Meditations-Frequenzen / meditation frequencies)
- **Konzert-Modus** / Concert Mode (Live-Feeling-Simulation / live feeling simulation)
- **Drive Mode DJ** (fahrtoptimierte Wiedergabe / driving-optimized playback)
- **Heartbeat Sync** (BPM-Anpassung an Herzfrequenz / BPM sync to heart rate)
- **Nostalgie-Modus** / Nostalgia Mode
- **Beat Match** (manuelle BPM-Synchronisierung / manual BPM sync)

### Werkzeuge / Tools
- **Track Cutter** (Songs schneiden und exportieren / cut and export songs)
- **Klingelton-Ersteller** / Ringtone Creator (Songs als Klingelton setzen / set songs as ringtone)
- **Vocal Isolator** (Gesang/Instrumentals trennen / separate vocals/instrumentals)
- **Sound Souvenir** (Ortsgebundene Audio-Erinnerungen / location-based audio memories)
- **Music Wrapped** (jaehrlicher Rueckblick a la Spotify Wrapped / yearly recap like Spotify Wrapped) — F-077
- Gestensteuerung / Gesture Control (9 konfigurierbare Gesten / configurable gestures)
- Gehoerschutz / Hearing Protection (WHO-Standard, Lautstaerke-Tracking / volume tracking)
- Batterie-Modus / Battery Mode (energiesparende Wiedergabe / energy-saving playback)

### Gamification — Tamagotchi Maskottchen / Mascot — F-111
- **5 Haustiere / 5 Pets:** Octo (Oktopus), Melo (Katze/Cat), Benny (Kaninchen/Rabbit), Chip (Eichhoernchen/Squirrel), Foxy (Fuchs/Fox)
- **10 Entwicklungsphasen / Evolution phases:** Baby → Kind → Teen → Adult → Star → Master → Legend → Mythic → Divine → Eternal
- **62 Achievements** (freischaltbar durch Nutzung der App / unlockable through app usage)
- **50 Tricks & Animationen / Tricks & Animations** (je 10 pro Pet / 10 per pet)
- **Trick Lab** (eigene Tricks einueben / practice custom tricks)
- Stimmungssystem / Mood system (Happy, Relaxed, Excited, Tired, Hungry, Dancing, Sleeping, Eating)
- Level-System bis Level 1000 / Level system up to level 1000
- Easter Eggs

### Datenschutz & Sicherheit / Privacy & Security
- **Kein Internet erforderlich** / No internet required (vollstaendig offline / fully offline)
- **Keine Nutzerdaten-Uebertragung** / No user data transmission
- **Alle Daten bleiben lokal** / All data stays local on device
- Crash Reports via ACRA (opt-in, optional)
- Scoped Storage (Android 10+ konform / compliant)

---

## Technologie-Stack / Technology Stack

| Komponente / Component | Technologie / Technology | Version |
|------------------------|--------------------------|---------|
| Sprache / Language | Kotlin | 2.1.0 |
| UI-Framework | Jetpack Compose (BOM) | 2024.12.01 |
| Audio-Engine | Media3 / ExoPlayer | 1.5.1 |
| Datenbank / Database | Room | 2.6.1 |
| DI-Framework | Hilt | 2.54 |
| Netzwerk / Networking | Ktor Server (CIO + WebSockets) | 3.0.3 |
| Tag-Editor | JAudioTagger | 3.0.1 |
| Nahbereich / Nearby | Google Nearby Connections | 19.3.0 |
| QR-Code | ZXing | 3.5.3 |
| Bild-Laden / Image Loading | Coil Compose | 2.7.0 |
| Praeferenzen / Preferences | DataStore | 1.1.1 |
| Absturz-Berichte / Crash Reports | ACRA | 5.11.4 |
| Health Integration | Health Connect | 1.1.0-alpha10 |

---

## Architektur / Architecture

```
Clean Architecture + MVVM

Presentation Layer:  72 Jetpack Compose Screens + 23 ViewModels
Domain Layer:        7 Repositories + Business Logic Engines
Data Layer:          Room DB v37 (40 Entities, 34 DAOs) + DataStore + MediaStore
Service Layer:       MusicService (MediaSessionService) + SynthEngine + LoopMixerEngine
```

**Datenbank-Highlights / Database Highlights:**
- 40 Room Entities (Songs, Playlists, Queue, Favoriten, Lesezeichen, Achievements, Pets, Synth-Presets, Loop-Projekte, Mixer-Pads, ...)
- 34 DAOs fuer typsichere DB-Zugriffe / type-safe database access
- DB-Version 37 mit vollstaendigen Migrationspfaden / with complete migration paths

---

## Lokalisierung / Localization

26 vollstaendig uebersetzte Sprachen / 26 fully translated languages mit je 2.776 Strings:

| | | | | |
|---|---|---|---|---|
| Englisch (Standard) | Deutsch | Arabisch | Chinesisch (Vereinfacht) | Chinesisch (Traditionell) |
| Tschechisch | Daenisch | Spanisch | Finnisch | Franzoesisch |
| Hindi | Indonesisch | Italienisch | Japanisch | Koreanisch |
| Malaiisch | Niederlaendisch | Norwegisch | Polnisch | Portugiesisch (Brasilien) |
| Russisch | Schwedisch | Thailaendisch | Tuerkisch | Ukrainisch | Vietnamesisch |

Alle Voice Commands ebenfalls in 26 Sprachen verfuegbar / All voice commands also available in 26 languages.

---

## Anforderungen / Requirements

- **Android 10** (API 29) oder hoeher / or higher
- Lokale Musikdateien / Local music files (MP3, FLAC, AAC, OGG, WAV, M4A)
- Fuer Android Auto / For Android Auto: Kompatibles Fahrzeug oder Desktop Head Unit (DHU) / Compatible vehicle or Desktop Head Unit (DHU)

---

## Rechtliches / Legal

- **[Datenschutzerklaerung / Privacy Policy](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/privacy.html)**
- **[Nutzungsbedingungen / Terms of Service](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/terms.html)**

---

## Kontakt / Contact

- E-Mail: zappelmann+autoplayer@googlemail.com
- Issues: [GitHub Issues](https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues)

---

*AutoPlayer wird entwickelt von Kay | Powered by Claude AI*
*AutoPlayer is developed by Kay | Powered by Claude AI*

*Version 6.1.10 (Build 95) — Stand / As of: April 2026*
