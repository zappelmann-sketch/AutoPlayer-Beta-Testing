<div align="center">

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    ██████╗ ██╗   ██╗████████╗ ██████╗ ██████╗ ██╗      ╔═╗  ║
║   ██╔═══██╗██║   ██║╚══██╔══╝██╔═══██╗██╔══██╗██║     ║▶ ║  ║
║   ███████║██║   ██║   ██║   ██║   ██║██████╔╝██║     ╚═╝  ║
║   ██╔══██║██║   ██║   ██║   ██║   ██║██╔═══╝ ██║           ║
║   ██║  ██║╚██████╔╝   ██║   ╚██████╔╝██║     ███████╗      ║
║   ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝     ╚══════╝      ║
║                                                               ║
║         P L A Y E R  ·  F O R  A N D R O I D                ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

**Der lokale MP3-Player der nächsten Generation für Android & Android Auto**  
**The next-generation local MP3 player for Android & Android Auto**

---

![Version](https://img.shields.io/badge/Version-6.1.10-brightgreen?style=for-the-badge)
![Build](https://img.shields.io/badge/Build-95-blue?style=for-the-badge)
![Android](https://img.shields.io/badge/Android-10%2B-green?style=for-the-badge&logo=android)
![Kotlin](https://img.shields.io/badge/Kotlin-2.1.0-purple?style=for-the-badge&logo=kotlin)
![Compose](https://img.shields.io/badge/Jetpack_Compose-2024.12-orange?style=for-the-badge)
![Languages](https://img.shields.io/badge/Languages-26-red?style=for-the-badge)
![Features](https://img.shields.io/badge/Features-133%2B-yellow?style=for-the-badge)
![Beta](https://img.shields.io/badge/Status-Closed_Beta-blueviolet?style=for-the-badge)

---

### 📊 Projekt auf einen Blick / Project at a Glance

| 🔢 Metric | 📈 Wert / Value |
|:---:|:---:|
| **Kotlin-Dateien / Kotlin Files** | 542 |
| **Lines of Code** | 92.366 |
| **Features** | 133+ (F-001 – F-133) |
| **UI-Screens** | 72 |
| **Sprachen / Languages** | 26 |
| **Strings je Sprache / per Language** | 2.776 |
| **Room Entities** | 40 |
| **Room DAOs** | 34 |
| **Room DB Version** | 37 |
| **Player-Engine Module** | 149 |
| **Synth-Stimmen / Synth Voices** | 16 polyphone |
| **Loop Mixer Tonspuren / Tracks** | 16 |
| **Synth-Presets (Factory)** | 300+ |
| **Achievements** | 62 |
| **Entwicklungsdauer / Dev Duration** | ~8 Wochen / ~8 weeks |
| **Version Code** | 95 |
| **Min SDK** | API 29 (Android 10) |
| **Target SDK** | API 35 (Android 15) |

</div>

---

## 🗂️ Inhalt dieses Repositories / Contents of this Repository

```
AutoPlayer-Beta-Testing/
├── index.html          ← Interaktiver Testplan v5.4.0 (434+ Testpunkte / test points)
├── privacy.html        ← Datenschutzerklärung / Privacy Policy
├── terms.html          ← Nutzungsbedingungen / Terms of Service
└── README.md           ← Diese Datei / This file
```

> **Testplan direkt öffnen / Open test plan directly:**  
> 🔗 **[https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/)**

---

---

# 🇩🇪 DEUTSCH

---

## 🎵 Was ist AutoPlayer?

**AutoPlayer** ist ein vollständig offline funktionierender, lokaler MP3-Player für Android – entwickelt von Grund auf mit dem Ziel, der beste und funktionsreichste lokale Musikplayer auf dem Markt zu werden. Keine Abonnements, keine Cloud-Pflicht, keine Werbung. Deine Musik, dein Gerät, deine Kontrolle.

Der besondere Fokus liegt auf der nahtlosen **Android Auto**-Integration: AutoPlayer wurde entwickelt, um im Fahrzeug genau so zu funktionieren wie auf dem Handy – mit vollständiger Sprachsteuerung in 26 Sprachen, einem erweiterten Browse-Tree und automatischer Wiedergabe beim Verbinden.

### Entstehungsgeschichte

AutoPlayer entstand aus einem echten Bedarf: Ein modernes Fahrzeug mit 10,1"-Android-Auto-Display, aber kein Player am Markt der sowohl vollständige Offline-Bibliothek als auch intelligente Funktionen und erstklassige Auto-Integration bietet. Was als persönliches Projekt begann, entwickelte sich in ~8 Wochen zu einer App mit 133+ Features, 72 UI-Screens und 26 Sprachen – entwickelt mit Unterstützung von Claude AI als Entwicklungspartner.

---

## 🎯 Zielgruppen

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTOPLAYER ZIELGRUPPEN                      │
├───────────────────┬─────────────────────────────────────────────┤
│ 🚗 FAHRER         │ Menschen mit Android Auto Fahrzeug die       │
│                   │ offline Musik hören möchten                  │
├───────────────────┼─────────────────────────────────────────────┤
│ 🎵 AUDIOPHILE     │ Nutzer die EQ, BPM-Analyse, Vocal Isolator, │
│                   │ Crossfade und professionelle Audio-Tools      │
│                   │ suchen – ohne Streaming-Pflicht              │
├───────────────────┼─────────────────────────────────────────────┤
│ 🎸 MUSIKER        │ Beat-Matching, A-B Repeat, Pitch/Speed,      │
│                   │ Waveform-Editor, Loop Mixer, Synthesizer      │
├───────────────────┼─────────────────────────────────────────────┤
│ 📱 Privacy-Nutzer │ Lokal-first: Keine Daten verlassen das       │
│                   │ Gerät (außer opt-in Crash Reports)           │
├───────────────────┼─────────────────────────────────────────────┤
│ 🎮 Power-User     │ Tamagotchi-Maskottchen, Party-Modus,         │
│                   │ Genome Visualizer, AI-Music Bibliothek        │
├───────────────────┼─────────────────────────────────────────────┤
│ 🌍 INTERNATIONAL  │ 26 Sprachen von Arabisch bis Vietnamesisch    │
│                   │ – vollständig, inkl. Sprachbefehle           │
└───────────────────┴─────────────────────────────────────────────┘
```

---

## 🏗️ App-Architektur

AutoPlayer folgt **Clean Architecture** mit strikter Schichtentrennung und **MVVM**-Pattern:

```
╔══════════════════════════════════════════════════════════════════╗
║                      AUTOPLAYER ARCHITEKTUR                      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │              PRESENTATION LAYER                          │    ║
║  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │    ║
║  │  │  Compose  │  │ViewModels│  │  Navigation (Hilt) │    │    ║
║  │  │ 72 Screens│  │23 VMs    │  │  Drawer + NavHost  │    │    ║
║  │  └──────────┘  └──────────┘  └────────────────────┘    │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                              │                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │                 DOMAIN LAYER                             │    ║
║  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │    ║
║  │  │  Use Cases  │  │  Models    │  │  Repositories    │  │    ║
║  │  │ (Business   │  │ Song/Album │  │  (Interface)     │  │    ║
║  │  │  Logic)     │  │ Artist/Pet │  │  7 Repos         │  │    ║
║  │  └────────────┘  └────────────┘  └──────────────────┘  │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                              │                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │                  DATA LAYER                              │    ║
║  │  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │    ║
║  │  │  Room DB   │  │  DataStore   │  │  MediaStore    │  │    ║
║  │  │ 40 Entities│  │  Settings    │  │  (Audio Files) │  │    ║
║  │  │ 34 DAOs    │  │  Preferences │  │  Scanner       │  │    ║
║  │  └────────────┘  └──────────────┘  └────────────────┘  │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                              │                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │              PLAYER ENGINE (149 Module)                  │    ║
║  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    ║
║  │  │ ExoPlayer│ │   EQ /   │ │   BPM /  │ │  Synth   │   │    ║
║  │  │ Media3   │ │ Effects  │ │  Key     │ │  Studio  │   │    ║
║  │  │ 1.5.1    │ │ DSP      │ │ Analyzer │ │ Loop Mix │   │    ║
║  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                              │                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │              SERVICES / ANDROID INTEGRATION             │    ║
║  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │    ║
║  │  │ MusicService │  │Android Auto  │  │  Passenger   │  │    ║
║  │  │ MediaLibrary │  │MediaBrowser  │  │  Party Mode  │  │    ║
║  │  │ MediaSession │  │ AutoMediaBr. │  │  Nearby API  │  │    ║
║  │  └──────────────┘  └──────────────┘  └──────────────┘  │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Package-Struktur

```
com/autoplayer/mp3/
│
├── 📦 auto/               Android Auto (AutoMediaBrowser.kt)
├── 📦 data/
│   ├── local/dao/        34 DAOs (Room Datenbankzugriff)
│   ├── local/entity/     40 Entities (Datenbankmodelle)
│   └── repository/       7 Repositories (MusicRepo, PetRepo, etc.)
│
├── 📦 domain/
│   ├── model/            Domain-Modelle (Song, Album, Artist, Pet...)
│   └── usecase/          Business-Logik Use Cases
│
├── 📦 player/ (149 Module)
│   ├── gesture/          Gestensteuerung
│   ├── sound/voices/     Voice-TTS Engine
│   └── synth/            Synthesizer-Engine (FM, Wavetable, Subtractive, Drum)
│
├── 📦 presentation/
│   ├── components/       58+ wiederverwendbare Compose-Komponenten
│   ├── navigation/       Navigation + Drawer
│   ├── screens/          72 Feature-Screens
│   ├── theme/            12 Farbthemes
│   └── viewmodels/       23 ViewModels
│
├── 📦 service/           MusicService + ListenDurationTracker
├── 📦 passenger/         Beifahrer-Modus (Nearby Connections)
├── 📦 party/             Party-Modus (Ktor HTTP Server)
├── 📦 sharing/           6 Export-Formate + QR-Code
├── 📦 transfer/          Geräte-zu-Geräte Transfer (TCP)
└── 📦 widget/            Homescreen-Widget
```

---

## 🚀 Entwicklungsverlauf

```
TIMELINE: AutoPlayer Entwicklung (2026)
════════════════════════════════════════════════════════════════════

März 2026
  ├─ 05.03  🚀 Projektstart — Grundarchitektur, MediaSession, ExoPlayer
  ├─ 07.03  ✅ v1.0: Player-Core, Bibliothek, Android Auto Basis
  ├─ 10.03  ✅ v1.1: EQ, Crossfade, Sleep Timer
  ├─ 14.03  ✅ v1.2: Vocal Isolator, Waveform, Tag Editor
  ├─ 18.03  ✅ v1.3: Smart DJ BPM/Key, Beat-Match Crossfade
  ├─ 20.03  ✅ v2.0: 6 Player-Skins, Theme Builder
  ├─ 25.03  🚗 FELDTEST: Roadtrip — Beifahrer-Modus bestanden
  └─ 29.03  ✅ v3.0: Testplan v1.0 (388 Testpunkte)

April 2026
  ├─ 01.04  ✅ v3.12: Draggable Mic FAB, Sleep Fade Persistent
  ├─ 11.04  ✅ v4.0: Tamagotchi-Maskottchen (5 Pets, 62 Achievements)
  ├─ 13.04  ✅ v4.1: Haptic Feedback App-weit (522+ Aufrufe, 83 Dateien)
  ├─ 13.04  ✅ v4.2: Party-Modus v2 + Genome Visualizer
  ├─ 15.04  ✅ v3.15: Genre-Browse (F-106, Room DB v23)
  ├─ 22.04  ✅ v4.3: Loop Mixer + Pad Mode (16 Spuren)
  ├─ 24.04  ✅ v4.4: Synth Studio (300+ Factory Presets)
  ├─ 25.04  ✅ v4.5: FM-Synthese DX7-Style (200 Presets)
  ├─ 25.04  ✅ v4.6: Wavetable-Synthesizer (8 Tables)
  ├─ 25.04  ✅ v4.7: Arpeggiator + Step-Sequencer
  ├─ 25.04  ✅ F-109: Sharing-Suite (6 Formate + QR)
  ├─ 28.04  ✅ F-133: Lenkrad-Sprechtaste Fix (Auto-Test bestanden)
  ├─ 29.04  ✅ v5.0–5.4: Testplan i18n EN/DE
  └─ 30.04  ✅ v6.1.10: Phase 2B i18n — 26 Sprachen vollständig

Juni 2026 (Ziel)
  └─ 01.06  🎯 PLAY STORE LAUNCH
════════════════════════════════════════════════════════════════════
```

---

## 🎮 Features — Vollständige Übersicht

### 🎨 Player-Skins (7)

```
┌─────────────┬──────────────┬──────────────┬─────────────────┐
│  Standard   │ DJ Turntable │ Vintage Hi-Fi│    Jukebox      │
├─────────────┼──────────────┼──────────────┼─────────────────┤
│  Kassette   │ Bandmaschine │  Sci-Fi      │                 │
│  (Cassette) │ (Reel-to-    │  Hologramm   │                 │
│             │  Reel)       │              │                 │
└─────────────┴──────────────┴──────────────┴─────────────────┘
```

### 🔊 Wiedergabe & Audio

| Feature | Details |
|---------|---------|
| **Formate** | MP3, FLAC, AAC, OGG, WAV, M4A |
| **Gapless Playback** | Nahtlose Wiedergabe ohne Pausen |
| **Crossfade** | 1–10 Sekunden, AI Beat-Match |
| **Geschwindigkeit** | 0,5× bis 2,0× (Pitch-korrigiert) |
| **Tonhöhe** | −6 bis +6 Halbtöne |
| **ReplayGain** | Track + Album Modus |
| **Bluetooth** | Auto-Resume bei Verbindung |
| **Queue** | Vollständiges Queue-Management mit Undo |
| **Sleep Timer** | Timer mit sanftem Fade-Out |
| **A-B Repeat** | Loop mit Practice Mode |

### 🎛️ Equalizer & Effekte

- 5-Band Equalizer mit Presets
- Bass Boost & Loudness Enhancer
- 3D Surround Sound
- Dynamic Ambient EQ (passt sich der Umgebung an)
- Live Concert Simulator
- Atmosphere Mixer
- Binaural Beats Generator
- Car Cabin Calibrator

### 🎤 Vocal Isolator / Karaoke

- Echtzeit-Vokalunterdrückung (0–100%)
- Karaoke-Modus (Gesang raus)
- Vocals-Only-Modus (Instrumental raus)
- DSP-basiert, vollständig offline

### 📚 Musikbibliothek

- MediaStore Scanner (Android Scoped Storage)
- Ansichten: Alle Songs, Alben, Künstler, Ordner, Genre
- Smart Playlists: Meistgehört, Zuletzt gespielt, Nie gespielt
- Manuelle Playlists + Favoriten
- Play History + Statistiken
- Genre Browse mit Cover-Grid (F-106)
- Alphabet-Navigation

### 🚗 Android Auto

```
Android Auto Browse-Hierarchie:
│
├── 🎵 Alle Songs
├── 💿 Alben
├── 🎤 Künstler
├── 📋 Playlists
│   ├── Manuelle Playlists
│   ├── ❤️  Favoriten
│   ├── 🕐  Zuletzt gespielt
│   ├── 🎵  Meistgehört
│   └── 🆕  Neu hinzugefügt
├── 🎭 Mood Browse (Stimmungsbasiert)
├── 🎸 Genre Browse
├── 🔁 Aktuelle Queue
└── ⏯️  Continue Listening
```

- **26-Sprachen Sprachsteuerung**: „Spiel [Song]", „Weiter", „Lauter" etc.
- Individuelles Album Art pro Song (ArtworkProvider)
- Crash-Protection (automatischer Skip bei Fehlern)
- Autoplay bei Auto-Verbindung (konfigurierbar)
- Lenkrad-Sprechtaste vollständig unterstützt (F-133)
- Getestet im Dacia Jogger (10,1" Display)

### 🧠 Intelligente Features

| Feature | Beschreibung |
|---------|-------------|
| **Smart DJ** | BPM/Key/Energy-Analyse, automatisches Mixing |
| **Geo-Music** | Standortbasierte Playlists |
| **Nostalgia Machine** | Musik nach Jahrgang/Epoche |
| **Mood Morph** | Stimmungsbasierte Übergänge |
| **Drive Mode DJ** | Fahrtgeschwindigkeit → Musikauswahl |
| **Sound Souvenir** | Ortsgebundene Musikerinnerungen |
| **Passenger Mode** | Beifahrer steuert Musik (Nearby Connections) |
| **Party Mode** | Gäste per QR-Code einladen (lokaler HTTP-Server) |
| **Weather DJ** | Wetter → passende Musik (opt-in) |
| **Heartbeat Sync** | Health Connect → BPM-angepasste Wiedergabe |
| **Kontext Auto-Wechsel** | 12+ Bedingungen (Bewegung, Tageszeit, Kalender, GPS) |
| **Music Genome Visualizer** | Song-DNA visualisiert (24 Farbpaletten) |
| **Sleep Fade** | Sanftes Einschlafen mit Lautstärke-Kurve |
| **Shake to Shuffle** | Schütteln → zufälliger Song |
| **Speed-based Volume** | Lautstärke folgt Fahrtgeschwindigkeit |

### 🎹 Musik-Studio Features

```
LOOP MIXER ──────────────────────────────────────────────────
│  16 Spuren · 4 Effekte · BPM-Sync · Swing · Bounce to WAV
│  Templates · Marker · Loop-Bookmarks · Projekt-Sharing
│
SYNTHESIZER STUDIO ──────────────────────────────────────────
│  Subtractive Synth  │  300+ Factory Presets (20 Kategorien)
│  FM DX7-Style       │  200 Presets, 4 Operatoren, 8 Alg.
│  Wavetable          │  8 Tables, Position Modulation
│  Drum Synth         │  Schlaginstrument-Synthese
│  MIDI USB + BLE     │  Live-Recording, Recording-Manager
│
ARPEGGIATOR & STEP-SEQUENCER ────────────────────────────────
│  6 Muster · 16-Step-Grid · BPM-Sync · Hold · Swing
│
PAD MODE ────────────────────────────────────────────────────
│  16 Pads · 16 Spuren · 1:1 Mapping · Recording
```

### 🛠️ Tools & Hilfsfunktionen

| Tool | Funktion |
|------|----------|
| **Tag Editor** | ID3-Tags bearbeiten (jAudioTagger) |
| **Tag Rescue** | Automatische Tag-Reparatur (JAudioTagger + MediaStore) |
| **Track Cutter** | Songs zuschneiden & exportieren |
| **Ringtone Setter** | Song als Klingelton setzen |
| **Waveform Editor** | Visueller Editor mit Lesezeichen & Farbauswahl |
| **BPM Analyzer** | FFT-basierte BPM- und Key-Erkennung |
| **Backup & Restore** | Vollständiges JSON-Backup |
| **Geräte-Transfer** | Song-Bibliothek per TCP/Nearby übertragen (F-112) |

### 🎨 UI & Design

- **12 Farbthemes** (inkl. AMOLED Black, Neon Glas-Dark)
- **Theme Builder**: Eigene Themes erstellen
- **Dynamic Background**: Album Art als Hintergrund (Blur-Effekt)
- Tageszeit-adaptives Dark/Light Mode
- **Adjustable UI**: Schrift- und Icongröße 80–140%
- Konfigurierbare Tab-Reihenfolge
- Navigation Drawer + Bottom Navigation
- Swipe-Gesten (9 konfigurierbare Aktionen)
- **Haptic Feedback**: 522+ Aufrufe in 83 Dateien
- **BPM-Anzeige** auf allen 72 Screens
- Glass-Dark-Neon Design durchgehend

### 🐾 Tamagotchi-Maskottchen (F-111)

```
5 Haustiere:
  🐙 Octo  (Oktopus)    🐱 Melo  (Katze)    🐰 Benny (Kaninchen)
  🐿️ Chip  (Eichhörnchen)                   🦊 Foxy  (Fuchs)

10 Entwicklungsphasen:
  Baby → Kind → Teen → Adult → Star → Master → Legend → Mythic → Divine → Eternal

62 Achievements · 50 Trick-Animationen · Level 1–1000
Reagiert auf Musikgeschmack, Hördauer, Tageszeit
Easter Egg: Trick Lab
```

### 📊 Music Wrapped (F-077)

- Jahresrückblick wie Spotify Wrapped – vollständig lokal
- 15 Statistik-Slides
- 8 Hörer-Persönlichkeiten
- Dashboard mit Top-Songs, -Alben, -Künstlern
- Genre-Statistiken + Stunden-Verlauf

### 🔗 Sharing & Export (F-109)

```
6 Export-Formate:
  .arpset    — Arpeggiator Presets
  .synthset  — Synthesizer Presets
  .loopseg   — Loop-Mixer Segmente
  .padconfig — Pad-Konfiguration
  .mxproj    — Mixer-Projekt
  .mxbundle  — Komplettes Bundle (alle Formate)

+ QR-Code Sharing für alle Formate
```

### 🔒 Privacy & Datenschutz

```
✅ Vollständig offline (außer Weather DJ: opt-in)
✅ Keine Nutzerdaten werden übermittelt
✅ Keine Werbung · Keine Tracker · Kein Analytics
✅ Crash Reports nur mit expliziter Zustimmung (ACRA opt-in)
✅ DSGVO/GDPR-konform
✅ Privacy Policy in 26 Sprachen
✅ Alle Daten durch Deinstallation löschbar
```

---

## 🔧 Tech Stack

### Kern-Technologien

| Technologie | Version | Verwendung |
|-------------|---------|-----------|
| **Kotlin** | 2.1.0 | Primäre Programmiersprache |
| **Jetpack Compose BOM** | 2024.12.01 | Gesamte UI |
| **Media3 / ExoPlayer** | 1.5.1 | Audio-Wiedergabe, MediaSession |
| **Room Database** | 2.6.1 | Lokale Datenpersistenz (40 Tabellen, DB v37) |
| **Hilt (Dependency Injection)** | 2.53.1 | DI Framework |
| **Kotlin Coroutines** | 1.9.0 | Asynchrone Operationen |
| **Kotlin Flow** | — | Reaktive Datenstreams |
| **Navigation Compose** | 2.8.5 | Screen-Navigation |
| **DataStore** | 1.1.1 | Einstellungen-Persistenz |

### Spezialbibliotheken

| Bibliothek | Version | Funktion |
|-----------|---------|----------|
| **Ktor Server** | 3.0.3 | Lokaler HTTP-Server (Party Mode) |
| **Google Nearby** | 19.3.0 | Passenger Mode (Peer-to-Peer) |
| **ZXing (QR)** | 3.5.3 | QR-Code generieren/scannen |
| **jAudioTagger** | 3.0.1 | ID3-Tag lesen/schreiben |
| **Coil** | 2.7.0 | Album Art laden/cachen |
| **ACRA** | 5.11.4 | Opt-in Crash Reporting |
| **Health Connect** | 1.1.0-alpha10 | Herzfrequenz-Sync |
| **Palette API** | 1.0.0 | Dynamische Farb-Extraktion |
| **KSP** | 2.1.0-1.0.29 | Kotlin Symbol Processing |
| **Kotlinx Serialization** | 1.7.3 | JSON-Serialisierung |

### Build-System

```
├── Gradle 8.7.3 (Kotlin DSL)
├── Version Catalog (gradle/libs.versions.toml)
├── ProGuard + R8 (Release-Build)
├── KSP (statt KAPT für schnellere Builds)
└── AAB-Format für Play Store
```

### Android-SDK Anforderungen

```
Min SDK:     29  (Android 10, Scoped Storage)
Target SDK:  35  (Android 15)
Compile SDK: 35
```

---

## 🌍 Lokalisierung (26 Sprachen)

```
🇩🇪 Deutsch    🇬🇧 English    🇫🇷 Français    🇪🇸 Español
🇮🇹 Italiano   🇳🇱 Nederlands 🇵🇱 Polski      🇷🇺 Русский
🇵🇹 Português  🇸🇪 Svenska    🇳🇴 Norsk       🇩🇰 Dansk
🇫🇮 Suomi      🇺🇦 Українська 🇨🇿 Česky       🇹🇷 Türkçe
🇸🇦 العربية    🇯🇵 日本語       🇰🇷 한국어        🇨🇳 中文(简)
🇹🇼 中文(繁)    🇮🇳 हिन्दी      🇮🇩 Bahasa      🇲🇾 Melayu
🇹🇭 ไทย        🇻🇳 Tiếng Việt
```

- **2.776 Strings** je Sprache vollständig übersetzt
- Sprachsteuerung (Voice Commands) in allen 26 Sprachen
- Benutzerhandbuch (35 Abschnitte) in allen 26 Sprachen
- Datenschutzerklärung + Nutzungsbedingungen in 26 Sprachen

---

## 🧪 Beta-Testing

### Schritt 1 — Testplan öffnen
👉 **[https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/)**

Der interaktive Testplan enthält **434+ Testpunkte** in 20+ Kategorien:

```
Kategorien im Testplan:
├── Player-Grundfunktionen
├── Musikbibliothek & Scanner
├── Android Auto
├── Equalizer & Effekte
├── Vocal Isolator / Karaoke
├── Loop Mixer & Studio (16 Spuren)
├── Synthesizer (Subtractive, FM, Wavetable, Drum)
├── Arpeggiator & Step-Sequencer
├── Sharing & Export
├── Passenger Mode
├── Party Mode
├── Tamagotchi Maskottchen
├── Tag Editor & Tag Rescue
├── Gestensteuerung
├── Lokalisierung
├── Datenschutz & Legal
├── Barrierefreiheit
├── Performance & Stabilität
├── Android Auto (DHU-Tests)
└── Geräte-Transfer
```

### Schritt 2 — Geräte eintragen
Dein Gerät, Android-Version, Bildschirmgröße — alles direkt im Testplan eingeben.

### Schritt 3 — Testen & dokumentieren
Jeden Testpunkt abarbeiten, Bugs und Wünsche markieren.

### Schritt 4 — Ergebnis senden

```
Option A: "Per E-Mail an Entwickler senden" (direkt im Testplan)
Option B: GitHub Issue erstellen + JSON-Datei anhängen
          → https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues
```

### Anforderungen

- **Android 10** (API 29) oder höher
- Lokale Musikdateien auf dem Gerät
- Für Android Auto Tests: Kompatibles Fahrzeug oder DHU (Desktop Head Unit)

---

## 📬 Kontakt

- **E-Mail:** zappelmann+autoplayer@googlemail.com
- **GitHub Issues:** [Fehler melden](https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues/new)
- **Datenschutz:** [privacy.html](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/privacy.html)
- **Nutzungsbedingungen:** [terms.html](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/terms.html)

---

---

# 🇬🇧 ENGLISH

---

## 🎵 What is AutoPlayer?

**AutoPlayer** is a fully offline, local MP3 player for Android — built from scratch with the goal of becoming the best and most feature-rich local music player on the market. No subscriptions, no mandatory cloud, no ads. Your music, your device, your control.

The special focus is on seamless **Android Auto** integration: AutoPlayer was designed to work just as well in the car as on the phone — with full voice control in 26 languages, an extended browse tree, and automatic playback when connecting.

### Background & Story

AutoPlayer was born out of a real need: a modern vehicle with a 10.1" Android Auto display, but no player on the market offering both a complete offline library and intelligent features with first-class Auto integration. What started as a personal project grew into an app with 133+ features, 72 UI screens and 26 languages in ~8 weeks — developed with Claude AI as a development partner.

---

## 🎯 Target Audience

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOPLAYER TARGET GROUPS                      │
├───────────────────┬─────────────────────────────────────────────┤
│ 🚗 DRIVERS        │ People with Android Auto vehicles who want   │
│                   │ offline music — reliable & feature-rich      │
├───────────────────┼─────────────────────────────────────────────┤
│ 🎵 AUDIOPHILES    │ Users seeking EQ, BPM analysis, Vocal        │
│                   │ Isolator, Crossfade & pro audio tools        │
│                   │ without streaming subscriptions              │
├───────────────────┼─────────────────────────────────────────────┤
│ 🎸 MUSICIANS      │ Beat-Matching, A-B Repeat, Pitch/Speed,      │
│                   │ Waveform Editor, Loop Mixer, Synthesizer     │
├───────────────────┼─────────────────────────────────────────────┤
│ 📱 PRIVACY USERS  │ Local-first: no data leaves the device       │
│                   │ (except opt-in crash reports)                │
├───────────────────┼─────────────────────────────────────────────┤
│ 🎮 POWER USERS    │ Tamagotchi mascot, Party Mode,               │
│                   │ Genome Visualizer, AI Music Library          │
├───────────────────┼─────────────────────────────────────────────┤
│ 🌍 INTERNATIONAL  │ 26 languages from Arabic to Vietnamese       │
│                   │ — fully localized, incl. voice commands      │
└───────────────────┴─────────────────────────────────────────────┘
```

---

## 🏗️ App Architecture

AutoPlayer follows **Clean Architecture** with strict layer separation and **MVVM** pattern:

```
╔══════════════════════════════════════════════════════════════════╗
║                     AUTOPLAYER ARCHITECTURE                      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │              PRESENTATION LAYER                          │    ║
║  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐    │    ║
║  │  │  Compose  │  │ViewModels│  │  Navigation (Hilt) │    │    ║
║  │  │ 72 Screens│  │23 VMs    │  │  Drawer + NavHost  │    │    ║
║  │  └──────────┘  └──────────┘  └────────────────────┘    │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                              │                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │                 DOMAIN LAYER                             │    ║
║  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │    ║
║  │  │  Use Cases  │  │  Models    │  │  Repositories    │  │    ║
║  │  │ (Business   │  │ Song/Album │  │  (Interface)     │  │    ║
║  │  │  Logic)     │  │ Artist/Pet │  │  7 Repos         │  │    ║
║  │  └────────────┘  └────────────┘  └──────────────────┘  │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                              │                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │                  DATA LAYER                              │    ║
║  │  ┌────────────┐  ┌──────────────┐  ┌────────────────┐  │    ║
║  │  │  Room DB   │  │  DataStore   │  │  MediaStore    │  │    ║
║  │  │ 40 Entities│  │  Settings    │  │  (Audio Files) │  │    ║
║  │  │ 34 DAOs    │  │  Preferences │  │  Scanner       │  │    ║
║  │  └────────────┘  └──────────────┘  └────────────────┘  │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                              │                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │              PLAYER ENGINE (149 Modules)                 │    ║
║  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    ║
║  │  │ ExoPlayer│ │   EQ /   │ │   BPM /  │ │  Synth   │   │    ║
║  │  │ Media3   │ │ Effects  │ │  Key     │ │  Studio  │   │    ║
║  │  │ 1.5.1    │ │ DSP      │ │ Analyzer │ │ Loop Mix │   │    ║
║  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                              │                                   ║
║  ┌─────────────────────────────────────────────────────────┐    ║
║  │              SERVICES / ANDROID INTEGRATION             │    ║
║  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │    ║
║  │  │ MusicService │  │Android Auto  │  │  Passenger   │  │    ║
║  │  │ MediaLibrary │  │MediaBrowser  │  │  Party Mode  │  │    ║
║  │  │ MediaSession │  │ AutoMediaBr. │  │  Nearby API  │  │    ║
║  │  └──────────────┘  └──────────────┘  └──────────────┘  │    ║
║  └─────────────────────────────────────────────────────────┘    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🚀 Development Timeline

```
TIMELINE: AutoPlayer Development (2026)
════════════════════════════════════════════════════════════════════

March 2026
  ├─ 05.03  🚀 Project start — core architecture, MediaSession
  ├─ 07.03  ✅ v1.0: Player core, library, Android Auto basis
  ├─ 10.03  ✅ v1.1: EQ, crossfade, sleep timer
  ├─ 14.03  ✅ v1.2: Vocal isolator, waveform, tag editor
  ├─ 18.03  ✅ v1.3: Smart DJ BPM/Key, beat-match crossfade
  ├─ 20.03  ✅ v2.0: 6 player skins, theme builder
  ├─ 25.03  🚗 FIELD TEST: Road trip — passenger mode passed
  └─ 29.03  ✅ v3.0: Test plan v1.0 (388 test points)

April 2026
  ├─ 01.04  ✅ v3.12: Draggable Mic FAB, sleep fade persistent
  ├─ 11.04  ✅ v4.0: Tamagotchi mascot (5 pets, 62 achievements)
  ├─ 13.04  ✅ v4.1: Haptic feedback app-wide (522+ calls, 83 files)
  ├─ 13.04  ✅ v4.2: Party mode v2 + genome visualizer
  ├─ 15.04  ✅ v3.15: Genre Browse (F-106, Room DB v23)
  ├─ 22.04  ✅ v4.3: Loop mixer + pad mode (16 tracks)
  ├─ 24.04  ✅ v4.4: Synth Studio (300+ factory presets)
  ├─ 25.04  ✅ v4.5: FM synthesis DX7-style (200 presets)
  ├─ 25.04  ✅ v4.6: Wavetable synthesizer (8 tables)
  ├─ 25.04  ✅ v4.7: Arpeggiator + step sequencer
  ├─ 25.04  ✅ F-109: Sharing suite (6 formats + QR)
  ├─ 28.04  ✅ F-133: Steering wheel voice button fix (Auto passed)
  ├─ 29.04  ✅ v5.0–5.4: Test plan EN/DE i18n
  └─ 30.04  ✅ v6.1.10: Phase 2B i18n — 26 languages complete

June 2026 (Target)
  └─ 01.06  🎯 PLAY STORE LAUNCH
════════════════════════════════════════════════════════════════════
```

---

## 🎮 Features — Complete Overview

### 🎨 Player Skins (7)

Standard · DJ Turntable · Vintage Hi-Fi · Jukebox · Cassette · Reel-to-Reel · Sci-Fi Hologram

### 🔊 Playback & Audio

| Feature | Details |
|---------|---------|
| **Formats** | MP3, FLAC, AAC, OGG, WAV, M4A |
| **Gapless Playback** | Seamless playback without gaps |
| **Crossfade** | 1–10 seconds, AI beat-match |
| **Speed** | 0.5× to 2.0× (pitch-corrected) |
| **Pitch** | −6 to +6 semitones |
| **ReplayGain** | Track + album mode |
| **Bluetooth** | Auto-resume on connection |
| **Queue** | Full queue management with undo |
| **Sleep Timer** | Timer with gentle fade-out |
| **A-B Repeat** | Loop with practice mode |

### 🎛️ Equalizer & Effects

5-Band EQ · Bass Boost · Loudness Enhancer · 3D Surround · Dynamic Ambient EQ  
Live Concert Simulator · Atmosphere Mixer · Binaural Beats · Car Cabin Calibrator

### 🚗 Android Auto

Full MediaBrowserService browse tree with 8 categories (Songs, Albums, Artists, Playlists,  
Mood, Genre, Queue, Continue Listening), individual album art per song, voice control in  
26 languages, steering wheel button support (F-133), autoplay on connect, tested in Dacia Jogger.

### 🧠 Smart Features

Smart DJ · Geo-Music · Nostalgia Machine · Mood Morph · Drive Mode DJ  
Sound Souvenir · Passenger Mode · Party Mode · Weather DJ (opt-in) · Heartbeat Sync  
Context Auto-Switch (12+ conditions) · Genome Visualizer · Sleep Fade · Shake to Shuffle  
Speed-based Volume · Music Wrapped (15 slides, 8 listener personalities)

### 🎹 Music Studio

```
Loop Mixer   — 16 tracks · Templates · Markers · BPM-Sync · Swing · WAV Export
Synth Studio — Subtractive + FM DX7 (200 presets) + Wavetable (8 tables) + Drum Synth
             — 300+ factory presets across 20 categories · MIDI USB + BLE
Arpeggiator  — 16-step grid · BPM sync · Swing · Hold
Pad Mode     — 16 pads · 16 tracks · 1:1 mapping · Recording
```

### 🐾 Tamagotchi Mascot (F-111)

```
5 pets: 🐙 Octo · 🐱 Melo · 🐰 Benny · 🐿️ Chip · 🦊 Foxy
10 evolution phases: Baby → Child → Teen → Adult → Star → Master → Legend → Mythic → Divine → Eternal
62 achievements · 50 trick animations · Level 1–1000 · Easter Egg: Trick Lab
Reacts to music taste, listening duration, time of day
```

### 🔒 Privacy

```
✅ Fully offline (except Weather DJ: opt-in)
✅ No user data transmitted
✅ No ads · No trackers · No analytics
✅ Crash reports only with explicit consent (ACRA opt-in)
✅ GDPR compliant
✅ Privacy Policy in 26 languages
✅ All data deletable via uninstall
```

---

## 🔧 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Kotlin** | 2.1.0 | Primary language |
| **Jetpack Compose BOM** | 2024.12.01 | Entire UI |
| **Media3 / ExoPlayer** | 1.5.1 | Audio engine + MediaSession |
| **Room Database** | 2.6.1 | Local persistence (40 tables, DB v37) |
| **Hilt** | 2.53.1 | Dependency injection |
| **Kotlin Coroutines** | 1.9.0 | Async operations |
| **Ktor Server** | 3.0.3 | Local HTTP server (party mode) |
| **Google Nearby** | 19.3.0 | Peer-to-peer (passenger mode) |
| **ZXing** | 3.5.3 | QR code generation/scanning |
| **jAudioTagger** | 3.0.1 | ID3 tag read/write |
| **Coil** | 2.7.0 | Album art loading |
| **ACRA** | 5.11.4 | Opt-in crash reporting |
| **Health Connect** | 1.1.0-alpha10 | Heart rate sync |

**Android SDK:** Min API 29 (Android 10) · Target API 35 (Android 15)

---

## 🌍 Localization (26 Languages)

🇩🇪 🇬🇧 🇫🇷 🇪🇸 🇮🇹 🇳🇱 🇵🇱 🇷🇺 🇵🇹 🇸🇪 🇳🇴 🇩🇰 🇫🇫🇮 🇺🇦 🇨🇿 🇹🇷 🇸🇦 🇯🇵 🇰🇷 🇨🇳 🇹🇼 🇮🇳 🇮🇩 🇲🇾 🇹🇭 🇻🇳

**2,776 strings** per language · Voice commands in all 26 languages  
User guide (35 sections) · Privacy Policy · Terms of Service — all in 26 languages

---

## 🧪 Beta Testing

### Step 1 — Open Test Plan
👉 **[https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/)**

The interactive test plan contains **434+ test points** across 20+ categories.

### Step 2 — Enter Device Info
Your device model, Android version, screen size — directly in the test plan.

### Step 3 — Test & Document
Work through each test point, mark bugs and wishes.

### Step 4 — Submit Results

```
Option A: Click "Send to developer via email" (built into test plan)
Option B: Create GitHub Issue + attach JSON file
          → https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues
```

### Requirements

- **Android 10** (API 29) or higher
- Local music files on your device
- For Android Auto tests: compatible vehicle or DHU (Desktop Head Unit)

---

## 📬 Contact

- **E-Mail:** zappelmann+autoplayer@googlemail.com
- **Report a bug:** [GitHub Issues](https://github.com/zappelmann-sketch/AutoPlayer-Beta-Testing/issues/new)
- **Privacy Policy:** [privacy.html](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/privacy.html)
- **Terms of Service:** [terms.html](https://zappelmann-sketch.github.io/AutoPlayer-Beta-Testing/terms.html)

---

<div align="center">

*AutoPlayer wird entwickelt von Kay | Powered by Claude AI*  
*AutoPlayer is developed by Kay | Powered by Claude AI*

**Version 6.1.10 · Build 95 · © 2026**

</div>
