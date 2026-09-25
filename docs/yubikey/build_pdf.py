# -*- coding: utf-8 -*-
"""Erzeugt die PDF-Anleitung "YubiKey unter Windows 10/11".

Aufruf:  python3 build_pdf.py   (benötigt reportlab, DejaVu-Schriften)
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer,
                                Table, TableStyle, PageBreak, KeepTogether, Preformatted,
                                NextPageTemplate, CondPageBreak)
from reportlab.platypus.tableofcontents import TableOfContents

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "YubiKey_Anleitung_Windows_10_11.pdf")

FD = "/usr/share/fonts/truetype/dejavu/"
LD = "/usr/share/fonts/truetype/liberation/"
pdfmetrics.registerFont(TTFont("Sans", LD + "LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Sans-B", LD + "LiberationSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Sans-I", LD + "LiberationSans-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Sans-BI", LD + "LiberationSans-BoldItalic.ttf"))
pdfmetrics.registerFont(TTFont("Sym", FD + "DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("Mono", FD + "DejaVuSansMono.ttf"))
pdfmetrics.registerFont(TTFont("Mono-B", FD + "DejaVuSansMono-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Mono-I", FD + "DejaVuSansMono-Oblique.ttf"))
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily("Sans", normal="Sans", bold="Sans-B", italic="Sans-I", boldItalic="Sans-BI")
registerFontFamily("Mono", normal="Mono", bold="Mono-B", italic="Mono-I", boldItalic="Mono-B")

# ---------------------------------------------------------------- Farben
YUBI = colors.HexColor("#9ACA3C")      # Yubico-Grün (Akzent)
DARK = colors.HexColor("#1F2A36")
ACC = colors.HexColor("#2E6DA4")
GREY = colors.HexColor("#5B6770")
LIGHT = colors.HexColor("#F2F5F7")
CODEBG = colors.HexColor("#F4F4F4")
INFO_BG, INFO_BD = colors.HexColor("#EAF2FB"), colors.HexColor("#2E6DA4")
WARN_BG, WARN_BD = colors.HexColor("#FFF4E5"), colors.HexColor("#E08A00")
CRIT_BG, CRIT_BD = colors.HexColor("#FDECEC"), colors.HexColor("#C0392B")
TIP_BG, TIP_BD = colors.HexColor("#EEF7E4"), colors.HexColor("#5E8C1F")

# ---------------------------------------------------------------- Stile
S = {}
S["body"] = ParagraphStyle("body", fontName="Sans", fontSize=9.4, leading=13.2, spaceAfter=5, textColor=DARK)
S["small"] = ParagraphStyle("small", parent=S["body"], fontSize=8, leading=10.5, spaceAfter=2)
S["cell"] = ParagraphStyle("cell", parent=S["body"], fontSize=8.2, leading=10.6, spaceAfter=0)
S["cellb"] = ParagraphStyle("cellb", parent=S["cell"], fontName="Sans-B", textColor=colors.white)
S["cellmono"] = ParagraphStyle("cellmono", parent=S["cell"], fontName="Mono", fontSize=7.4, leading=9.6)
S["h1"] = ParagraphStyle("h1", fontName="Sans-B", fontSize=17, leading=21, spaceBefore=14, spaceAfter=10, textColor=DARK)
S["h2"] = ParagraphStyle("h2", fontName="Sans-B", fontSize=12.5, leading=16, spaceBefore=10, spaceAfter=5, textColor=ACC)
S["h3"] = ParagraphStyle("h3", fontName="Sans-B", fontSize=10.3, leading=13.5, spaceBefore=7, spaceAfter=3, textColor=DARK)
S["bullet"] = ParagraphStyle("bullet", parent=S["body"], leftIndent=13, bulletIndent=3, spaceAfter=2.5)
S["step"] = ParagraphStyle("step", parent=S["body"], leftIndent=18, bulletIndent=0, spaceAfter=3.5)
S["code"] = ParagraphStyle("code", fontName="Mono", fontSize=7.9, leading=10.4, textColor=colors.HexColor("#1B1B1B"))
S["boxtitle"] = ParagraphStyle("boxtitle", parent=S["body"], fontName="Sans-B", spaceAfter=2)
S["box"] = ParagraphStyle("box", parent=S["body"], spaceAfter=2)
S["toc1"] = ParagraphStyle("toc1", fontName="Sans-B", fontSize=9.5, leading=12, leftIndent=0, textColor=DARK)
S["toc2"] = ParagraphStyle("toc2", fontName="Sans", fontSize=8.4, leading=9.6, leftIndent=16, textColor=GREY)

PAGE_W, PAGE_H = A4
LM = RM = 18 * mm
TM, BM = 20 * mm, 18 * mm
CW = PAGE_W - LM - RM  # nutzbare Breite


class Doc(BaseDocTemplate):
    def __init__(self, fn, **kw):
        super().__init__(fn, pagesize=A4, leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM,
                         title="YubiKey – Installations- und Einrichtungsanleitung für Windows 10/11",
                         author="IT-Dokumentation", subject="YubiKey, FIDO2, OATH, Sophos Central",
                         creator="build_pdf.py (reportlab)", **kw)
        frame = Frame(LM, BM, CW, PAGE_H - TM - BM, id="f", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.addPageTemplates([PageTemplate("cover", [frame], onPage=self.cover_page),
                               PageTemplate("normal", [frame], onPage=self.normal_page)])
        self._hcount = 0

    def beforeDocument(self):
        self._hcount = 0

    def cover_page(self, c, d):
        c.saveState()
        c.setFillColor(DARK)
        c.rect(0, PAGE_H - 95 * mm, PAGE_W, 95 * mm, stroke=0, fill=1)
        c.setFillColor(YUBI)
        c.rect(0, PAGE_H - 98 * mm, PAGE_W, 3 * mm, stroke=0, fill=1)
        c.restoreState()

    def normal_page(self, c, d):
        c.saveState()
        c.setStrokeColor(YUBI)
        c.setLineWidth(1.2)
        c.line(LM, PAGE_H - 13 * mm, PAGE_W - RM, PAGE_H - 13 * mm)
        c.setFont("Sans", 7.5)
        c.setFillColor(GREY)
        c.drawString(LM, PAGE_H - 11 * mm, "YubiKey unter Windows 10/11 – Installation, Einrichtung, Verwaltung")
        c.drawRightString(PAGE_W - RM, PAGE_H - 11 * mm, "Stand: 25.09.2026")
        c.line(LM, 12 * mm, PAGE_W - RM, 12 * mm)
        c.drawString(LM, 8 * mm, "Yubico Authenticator 7.4.2 · YubiKey Manager CLI 5.9.2 · Sophos Central (Passkey/TOTP)")
        c.drawRightString(PAGE_W - RM, 8 * mm, "Seite %d" % d.page)
        c.restoreState()

    def afterFlowable(self, f):
        if isinstance(f, Paragraph) and f.style.name in ("h1", "h2"):
            lvl = 0 if f.style.name == "h1" else 1
            txt = f.getPlainText()
            key = "h%d" % self._hcount
            self._hcount += 1
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(txt, key, level=lvl, closed=(lvl == 1))
            self.notify("TOCEntry", (lvl, txt, self.page, key))


story = []


def H1(t):
    story.append(CondPageBreak(60 * mm))
    story.append(Paragraph(t, S["h1"]))


def H2(t):
    story.append(CondPageBreak(35 * mm))
    story.append(Paragraph(t, S["h2"]))


def H3(t):
    story.append(CondPageBreak(25 * mm))
    story.append(Paragraph(t, S["h3"]))


def P(t, st="body"):
    story.append(Paragraph(t, S[st]))


def BL(items):
    for i in items:
        story.append(Paragraph(i, S["bullet"], bulletText="•"))
    story.append(Spacer(1, 3))


def STEPS(items, start=1):
    for n, i in enumerate(items, start):
        story.append(Paragraph(i, S["step"], bulletText="%d." % n))
    story.append(Spacer(1, 3))


def CODE(txt):
    pre = Preformatted(txt.strip("\n"), S["code"])
    t = Table([[pre]], colWidths=[CW])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), CODEBG),
                           ("LINEBEFORE", (0, 0), (0, -1), 2.2, GREY),
                           ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                           ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5)]))
    story.append(t)
    story.append(Spacer(1, 6))


def BOX(kind, title, paras):
    bg, bd = {"info": (INFO_BG, INFO_BD), "warn": (WARN_BG, WARN_BD), "crit": (CRIT_BG, CRIT_BD),
              "tip": (TIP_BG, TIP_BD)}[kind]
    cont = [Paragraph(title, S["boxtitle"])]
    for p in paras:
        if isinstance(p, str):
            cont.append(Paragraph(p, S["box"]))
        else:
            cont.append(p)
    t = Table([[cont]], colWidths=[CW])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), bg), ("LINEBEFORE", (0, 0), (0, -1), 3, bd),
                           ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                           ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    story.append(KeepTogether([t, Spacer(1, 7)]))


def TABLE(rows, widths, head=True, mono_cols=(), zebra=True, fs=None):
    data = []
    for r_i, r in enumerate(rows):
        row = []
        for c_i, c in enumerate(r):
            if not isinstance(c, str):
                row.append(c)
                continue
            if head and r_i == 0:
                st = S["cellb"]
            elif c_i in mono_cols:
                st = S["cellmono"]
            else:
                st = S["cell"]
            row.append(Paragraph(c, st))
        data.append(row)
    w = [CW * x for x in widths]
    t = Table(data, colWidths=w, repeatRows=1 if head else 0)
    ts = [("VALIGN", (0, 0), (-1, -1), "TOP"), ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#C9D1D8")),
          ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
          ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]
    if head:
        ts.append(("BACKGROUND", (0, 0), (-1, 0), DARK))
    if zebra:
        for i in range(1 if head else 0, len(data)):
            if i % 2 == 0:
                ts.append(("BACKGROUND", (0, i), (-1, i), LIGHT))
    t.setStyle(TableStyle(ts))
    story.append(t)
    story.append(Spacer(1, 7))


def link(url, text=None):
    return '<link href="%s" color="#2E6DA4"><u>%s</u></link>' % (url, text or url)


def m(t):  # Inline-Monospace
    return '<font name="Mono" size="8.3">%s</font>' % t


# =====================================================================
# DATEN DER GEPRÜFTEN DOWNLOADS (am 25.09.2026 selbst geladen und geprüft)
# =====================================================================
AUTH = dict(
    name="Yubico Authenticator 7.4.2 (Windows x64)",
    file="yubico-authenticator-7.4.2-win64.msi",
    url="https://github.com/Yubico/yubioath-flutter/releases/download/7.4.2/yubico-authenticator-7.4.2-win64.msi",
    sig="https://github.com/Yubico/yubioath-flutter/releases/download/7.4.2/yubico-authenticator-7.4.2-win64.msi.sig",
    size="61.698.048 Bytes",
    sha256="9f252a0f2ef06c11a580bb95952ec4ebdc6f1e4d533341aee920f790f5c327f4",
    sha1="4ce57e015fbeb71211d0ba6f95fd97a30800ce4e",
    md5="84e14de45a247204b09b7951d826bd01",
    gpg="Dennis Fokin &lt;dennis.fokin@yubico.com&gt;, Hauptschlüssel 9E88 5C03 02F9 BB91 6752 9C2D 5CBA 11E6 ADC7 BCD1 "
        "(signiert mit Unterschlüssel D691 9FBF 48C4 84F3 CB7B 71CD 870B 8825 6690 D8BC), Signatur vom 09.09.2026",
)
YKMAN = dict(
    name="YubiKey Manager CLI (ykman) 5.9.2 (Windows x64)",
    file="yubikey-manager-5.9.2-win64.msi",
    url="https://github.com/Yubico/yubikey-manager/releases/download/5.9.2/yubikey-manager-5.9.2-win64.msi",
    sig="https://github.com/Yubico/yubikey-manager/releases/download/5.9.2/yubikey-manager-5.9.2-win64.msi.sig",
    size="22.396.928 Bytes",
    sha256="54e5830c56fafcdde80037de490a88de4fe3afc398fc2ad7ccbffcfc6b93be9f",
    sha1="c76669740ce99c1d0d696bc5c15801438919baa3",
    md5="9ae39157aed672bad813fde6f963cc02",
    gpg="Dain Nilsson &lt;dain@yubico.com&gt;, Schlüssel 20EE 325B 86A8 1BCB D3E5 6798 F043 6709 6FBA 95E8, "
        "Signatur vom 30.06.2026",
)
CERT_SUBJECT = "CN=Yubico AB, O=Yubico AB, L=STOCKHOLM, S=Stockholms län, C=SE"
CERT_THUMB = "A1614CD84976030D49209B56162D9EFA69B73698"
CERT_SHA256 = "A0:1E:11:73:E5:15:18:09:53:8D:FD:24:92:D5:C2:91:DB:F4:EC:67:B5:A5:CF:06:13:71:98:5E:34:36:5D:E6"

# =====================================================================
# DECKBLATT
# =====================================================================
cover_t = ParagraphStyle("ct", fontName="Sans-B", fontSize=27, leading=33, textColor=colors.white)
cover_s = ParagraphStyle("cs", fontName="Sans", fontSize=13, leading=18, textColor=colors.HexColor("#D5DEE6"))
story.append(Spacer(1, 18 * mm))
story.append(Paragraph("YubiKey unter Windows 10 und 11", cover_t))
story.append(Spacer(1, 5 * mm))
story.append(Paragraph("Installations-, Einrichtungs- und Verwaltungsanleitung<br/>"
                       "mit Praxisbeispiel <b>Sophos Central (Enterprise)</b>", cover_s))
story.append(Spacer(1, 42 * mm))

cover_rows = [
    ["Zielgruppe", "Anwender und Administratoren, die einen YubiKey (Serie 5, Security Key, Bio) lokal unter "
                   "Windows 10/11 einrichten, verwalten und als zweiten Faktor (2FA/MFA) an Konten binden wollen."],
    ["Software-Stand", "Yubico Authenticator <b>7.4.2</b> (09.09.2026) · YubiKey Manager CLI <b>ykman 5.9.2</b> "
                       "(30.06.2026) – Downloads am 25.09.2026 geladen, Hashwerte berechnet, GPG- und "
                       "Authenticode-Signatur geprüft (Kapitel 3)."],
    ["Grundlage", "Offizielle Dokumentation von Yubico (docs.yubico.com, support.yubico.com, developers.yubico.com, "
                  "Quellcode der Yubico-Tools auf GitHub) und Sophos (docs.sophos.com, community.sophos.com). "
                  "Alle Quellen im Anhang A."],
    ["Aufbau", "1 Funktionsweise · 2 Methodenwahl · 3 Downloads &amp; Prüfsummen · 4 Installation · "
               "5 Ersteinrichtung · 6 Standardweg: Key an Konto binden · 7 Mehrere Konten · "
               "8 Beispiel Sophos Central · 9 Verwaltung · 10 Verlust &amp; Reset · 11 Fehlerbehebung · "
               "12 Testprotokoll · Anhänge"],
]
TABLE(cover_rows, [0.2, 0.8], head=False, zebra=True)
story.append(Spacer(1, 6 * mm))
P("<i>Hinweis zu Menübezeichnungen:</i> Windows, Browser, Yubico Authenticator und Sophos Central werden laufend "
  "aktualisiert. Die Pfade in dieser Anleitung entsprechen dem Stand September 2026. Weicht eine Beschriftung ab, "
  "gilt sinngemäß der gleiche Weg. Deutsche und englische Bezeichnungen sind jeweils angegeben: "
  "<b>Deutsch</b> / <i>English</i>.", "small")
story.append(NextPageTemplate("normal"))
story.append(PageBreak())

# =====================================================================
# INHALT
# =====================================================================
story.append(Paragraph("Inhaltsverzeichnis", S["h1"].clone("tocH", spaceBefore=0, spaceAfter=8)))
toc = TableOfContents()
toc.levelStyles = [S["toc1"], S["toc2"]]
toc.dotsMinLevel = 0
story.append(toc)
story.append(PageBreak())

# =====================================================================
# 1 FUNKTIONSWEISE
# =====================================================================
H1("1  Wie ein YubiKey funktioniert")
P("Ein YubiKey ist ein kleiner Hardware-Sicherheitsschlüssel mit einem eigenen, manipulationsgeschützten Chip "
  "(Secure Element). Er wird per USB-A, USB-C oder Lightning angeschlossen bzw. per NFC an Smartphones gehalten. "
  "Er braucht weder Batterie noch Treiber: Windows erkennt ihn als Tastatur (HID), als FIDO-Gerät und als "
  "Smartcard-Leser (CCID). Das Entscheidende: <b>Die geheimen Schlüssel verlassen den YubiKey nie.</b> Sie können "
  "weder ausgelesen noch kopiert werden. Auch die Firmware lässt sich bewusst nicht aktualisieren. Das schützt vor "
  "manipulierten Updates, bedeutet aber, dass neue Funktionen nur mit einem neuen Key kommen.")

H2("1.1  Das Prinzip: Besitz + Wissen")
P("Ein Konto mit YubiKey ist durch zwei unabhängige Faktoren geschützt: etwas, das Sie <b>wissen</b> (Passwort "
  "und/oder PIN des Keys), und etwas, das Sie <b>besitzen</b> (den physischen YubiKey). Mit dem gestohlenen Passwort "
  "allein kommt ein Angreifer nicht weiter. Die Berührung der goldenen Kontaktfläche (<i>Touch</i>) bestätigt "
  "zusätzlich, dass ein Mensch vor dem Rechner sitzt. Schadsoftware kann den Key deshalb nicht unbemerkt aus der "
  "Ferne benutzen.")

H2("1.2  FIDO2/WebAuthn: warum der Key phishing-resistent ist")
P("Die modernste und empfohlene Methode ist <b>FIDO2/WebAuthn</b> (im Web meist »Sicherheitsschlüssel«, "
  "»Security Key« oder »Passkey« genannt). Sie beruht auf Public-Key-Kryptografie:")
STEPS([
    "<b>Registrierung:</b> Der YubiKey erzeugt für <i>genau diese</i> Website (z. B. "
    + m("central.sophos.com") + ") ein neues Schlüsselpaar. Der <b>öffentliche</b> Schlüssel geht an den Dienst, "
    "der <b>private</b> bleibt im Key.",
    "<b>Anmeldung:</b> Der Dienst schickt eine Zufallszahl (Challenge). Der Browser gibt die tatsächlich besuchte "
    "Domain mit. Nach PIN-Eingabe und Berührung signiert der Key die Challenge mit dem privaten Schlüssel.",
    "<b>Prüfung:</b> Der Dienst prüft die Signatur mit dem hinterlegten öffentlichen Schlüssel. Passt sie, ist die "
    "Anmeldung erfolgreich.",
])
P("Weil die Domain in die Signatur eingeht, liefert der Key auf einer gefälschten Seite (z. B. "
  + m("centrall-sophos.com") + ") keine gültige Antwort. Anders als bei Codes zum Abtippen kann der Nutzer den "
  "Faktor also gar nicht an Phisher weitergeben. Außerdem wird kein gemeinsames Geheimnis beim Dienst gespeichert: "
  "Ein Datenleck beim Anbieter verrät nur öffentliche Schlüssel.")

H2("1.3  Die Anwendungen (Applets) auf dem YubiKey")
P("Ein YubiKey 5 enthält mehrere voneinander unabhängige Anwendungen. Jede hat eigene Zugangsdaten und lässt sich "
  "einzeln zurücksetzen, ohne die anderen zu berühren.")
TABLE([
    ["Anwendung", "Wofür", "Schutz / Standardwerte", "Kapazität"],
    ["<b>FIDO2 / WebAuthn</b> (Passkeys)", "Passwortlose Anmeldung oder 2FA im Browser und in Apps; phishing-resistent",
     "FIDO2-PIN: <b>ab Werk keine</b>, 4–63 Zeichen. Nach 3 Fehlversuchen Key abziehen und neu einstecken; "
     "nach 8 Fehlversuchen gesperrt → nur noch Reset (löscht alle Passkeys)",
     "Firmware &lt; 5.7: 25 Passkeys<br/>ab 5.7: 100 Passkeys"],
    ["<b>FIDO U2F</b>", "Klassischer »Sicherheitsschlüssel« als 2. Faktor (Vorgänger von FIDO2)",
     "Touch; teilt sich den FIDO-Reset mit FIDO2", "<b>unbegrenzt</b> (es wird nichts auf dem Key gespeichert)"],
    ["<b>OATH</b> (TOTP/HOTP)", "6-/8-stellige Einmalcodes wie Google/Microsoft Authenticator; Codes zeigt der "
     "Yubico Authenticator an, das Geheimnis liegt im Key",
     "Optionales OATH-Passwort; optional Touch pro Konto", "Firmware &lt; 5.7: 32 Konten<br/>ab 5.7: 64 Konten"],
    ["<b>Yubico OTP</b> / Slots", "2 programmierbare Slots: Yubico OTP, statisches Passwort, Challenge-Response, HOTP",
     "Kurz berühren (1–2,5 s) = Slot 1, lang (3–5 s) = Slot 2; optional Zugriffscode", "2 Slots"],
    ["<b>PIV</b> (Smartcard)", "Zertifikate: Windows-/AD-Smartcard-Anmeldung, S/MIME, Signaturen",
     "PIN <b>123456</b>, PUK <b>12345678</b>, Management Key "
     + m("010203040506070801020304050607080102030405060708") + " (ab Werk; unbedingt ändern), je 3 Versuche",
     "24 Zertifikats-Slots"],
    ["<b>OpenPGP</b>", "GPG-Schlüssel für E-Mail-Verschlüsselung, Signaturen, SSH",
     "User-PIN <b>123456</b>, Admin-PIN <b>12345678</b> (ab Werk; ändern), je 3 Versuche", "3 Schlüssel (S/E/A)"],
], [0.17, 0.30, 0.35, 0.18])
P("Die Anwendungen laufen über drei USB-Schnittstellen: <b>OTP</b> (meldet sich als Tastatur), <b>FIDO</b> "
  "(U2F und FIDO2) und <b>CCID</b> (Smartcard: PIV, OATH, OpenPGP). Eine Schnittstelle ist aktiv, solange "
  "mindestens eine ihrer Anwendungen aktiviert ist.", "small")

H2("1.4  Begriffe: Passkey, Sicherheitsschlüssel, TOTP")
TABLE([
    ["Begriff", "Bedeutung in dieser Anleitung"],
    ["<b>Passkey</b> (auffindbare Anmeldeinformation / <i>discoverable credential</i>)",
     "FIDO2-Schlüssel, der auf dem YubiKey <i>gespeichert</i> wird und auch den Benutzernamen kennt. Er belegt einen "
     "der 25/100 Plätze und ist mit der FIDO2-PIN geschützt. Anmeldung oft ganz ohne Passwort."],
    ["<b>Sicherheitsschlüssel</b> (nicht auffindbar / U2F-artig)",
     "FIDO-Schlüssel, der nicht auf dem Key gespeichert, sondern bei jeder Anmeldung aus einem Geheimnis im Key "
     "abgeleitet wird. Belegt keinen Speicherplatz, daher unbegrenzt viele Konten."],
    ["<b>TOTP</b> (Time-based One-Time Password)",
     "Sechsstelliger Code, der alle 30 s wechselt. Mit dem YubiKey liegt das Geheimnis im Key statt im Handy. "
     "Funktioniert mit jedem Dienst, der eine »Authenticator-App« anbietet, ist aber <b>nicht</b> phishing-resistent."],
], [0.3, 0.7])

# =====================================================================
# 2 METHODENWAHL
# =====================================================================
H1("2  Welche Methode für welches Konto?")
P("Als Faustregel gilt: <b>so weit oben in dieser Liste wie der Dienst es erlaubt.</b>")
TABLE([
    ["Rang", "Methode", "Wann nutzen?", "Bezeichnung beim Dienst (typisch)"],
    ["1", "<b>FIDO2 Passkey</b> auf dem YubiKey", "Dienst bietet »Passkey« an; höchste Sicherheit, "
     "phishing-resistent, schnell", "Passkey, Sicherheitsschlüssel, Security key, Hardware key, WebAuthn"],
    ["2", "<b>FIDO U2F / nicht auffindbarer Sicherheitsschlüssel</b>", "Dienst bietet »Sicherheitsschlüssel« als "
     "2. Faktor; Passkey-Speicher knapp", "Security key, U2F, 2-Step Verification › Security key"],
    ["3", "<b>OATH-TOTP</b> im YubiKey (Yubico Authenticator)", "Dienst bietet nur eine »Authenticator-App« an "
     "(QR-Code + 6-stelliger Code)", "Authenticator app, TOTP, Google Authenticator, 2FA-App"],
    ["4", "<b>Yubico OTP / statisch / Challenge-Response</b>", "Nur Sonderfälle (ältere Systeme, Passwortmanager "
     "wie KeePassXC, lokale Windows-Anmeldung mit Yubico Login)", "Yubico OTP, YubiKey (OTP)"],
], [0.07, 0.28, 0.35, 0.30])
BOX("tip", "Empfehlung", [
    "Registrieren Sie bei <b>jedem</b> Konto mindestens <b>zwei</b> YubiKeys (Haupt- und Ersatzschlüssel) und "
    "bewahren Sie die Wiederherstellungscodes des Dienstes offline auf. Yubico empfiehlt ausdrücklich, den "
    "Ersatzschlüssel gleich bei der Ersteinrichtung mit zu registrieren. Ein YubiKey lässt sich nicht klonen "
    "oder sichern.",
])

# =====================================================================
# 3 DOWNLOADS & PRÜFSUMMEN
# =====================================================================
H1("3  Benötigte Software, offizielle Downloads und Prüfsummen")
P("Für die Grundfunktion (FIDO2/Passkey im Browser) braucht Windows <b>keine</b> Zusatzsoftware: Windows 10 "
  "(ab 1903) und Windows 11 bringen die WebAuthn-Schnittstelle mit. Für die <b>Verwaltung</b> des Keys (PINs, "
  "Passkeys ansehen und löschen, TOTP-Konten, Schnittstellen) stellt Yubico folgende Werkzeuge bereit:")
TABLE([
    ["Werkzeug", "Zweck", "Erforderlich?"],
    ["<b>Yubico Authenticator</b> (Desktop-App)", "Zentrales GUI-Werkzeug: TOTP-Codes, Passkeys, FIDO2-PIN, "
     "PIV-Zertifikate, OTP-Slots, Schnittstellen. Ersetzt den <b>YubiKey Manager (GUI)</b>, der am 19.02.2026 "
     "End-of-Life erreicht hat.", "<b>Ja</b> (empfohlen)"],
    ["<b>YubiKey Manager CLI (ykman)</b>", "Kommandozeile für Skripte, Automatisierung, Diagnose, Reset",
     "Optional (Admins)"],
    ["YubiKey Smart Card Minidriver", "Windows-Smartcard-Integration für PIV (Zertifikatsanmeldung im AD)",
     "Nur für PIV/Smartcard-Logon"],
    ["Yubico Login for Windows", "2FA für die <i>lokale</i> Windows-Anmeldung (Challenge-Response; nur lokale "
     "Konten, nicht Entra ID, nicht Windows on Arm)", "Nur bei Bedarf"],
], [0.28, 0.54, 0.18])

H2("3.1  Geprüfte Downloads (Direktlinks und Hashwerte)")
P("Die folgenden zwei Installer wurden am <b>25.09.2026</b> von Yubicos offiziellen GitHub-Releases geladen. "
  "Ihre Hashwerte wurden berechnet, die OpenPGP-Signatur (.sig) gegen die auf "
  + link("https://developers.yubico.com/Software_Projects/Software_Signing.html", "developers.yubico.com › Software Signing")
  + " veröffentlichten Yubico-Schlüssel geprüft (»Good signature«), und die Windows-Codesignatur "
  "(Authenticode) lautet auf <b>Yubico AB</b>.")

for d in (AUTH, YKMAN):
    H3(d["name"])
    TABLE([
        ["Datei", m(d["file"]) + " (" + d["size"] + ")"],
        ["Download", link(d["url"])],
        ["Signatur", link(d["sig"])],
        ["SHA-256", m(d["sha256"])],
        ["SHA-1", m(d["sha1"])],
        ["MD5", m(d["md5"])],
        ["GPG-Signatur", "Good signature – " + d["gpg"]],
        ["Authenticode", "Signiert von <b>Yubico AB</b> (DigiCert Trusted G4 Code Signing CA), Zertifikat gültig "
                         "bis 26.02.2027, Thumbprint " + m(CERT_THUMB)],
    ], [0.15, 0.85], head=False)

P("Offizielle Übersichtsseiten (falls neuere Versionen erscheinen): "
  + link("https://www.yubico.com/products/yubico-authenticator/", "yubico.com › Yubico Authenticator") + " · "
  + link("https://developers.yubico.com/yubioath-flutter/Releases/", "developers.yubico.com › yubioath-flutter › Releases") + " · "
  + link("https://developers.yubico.com/yubikey-manager/Releases/", "developers.yubico.com › yubikey-manager › Releases") + " · "
  + link("https://www.yubico.com/support/download/smart-card-drivers-tools/", "Smart Card Minidriver") + " · "
  + link("https://www.yubico.com/products/computer-login-tools/", "Yubico Login for Windows") + ".", "small")

BOX("warn", "Zu MD5 und neueren Versionen", [
    "MD5 ist wie gewünscht angegeben, gilt aber kryptografisch als gebrochen: Zwei verschiedene Dateien können "
    "denselben MD5-Wert haben. Maßgeblich sind daher <b>SHA-256</b> <i>und</i> die <b>Signatur »Yubico AB«</b>. "
    "Stimmen beide, ist die Datei echt.",
    "Erscheint eine neuere Version, gelten die obigen Hashwerte nur für die genannte Version. Dann prüfen Sie "
    "die Signatur (Abschnitt 3.2). Yubico selbst veröffentlicht keine Hashlisten, sondern Signaturen.",
])

H2("3.2  Download unter Windows prüfen (PowerShell)")
P("Öffnen Sie PowerShell im Download-Ordner (Explorer › Ordner › Adresszeile »powershell« eingeben) und prüfen Sie "
  "Hashwert und Signatur:")
CODE(r"""
# Hashwerte berechnen (Ergebnis mit Tabelle 3.1 vergleichen)
Get-FileHash .\yubico-authenticator-7.4.2-win64.msi -Algorithm SHA256
Get-FileHash .\yubico-authenticator-7.4.2-win64.msi -Algorithm MD5

# Automatischer Vergleich (gibt True oder False aus)
(Get-FileHash .\yubico-authenticator-7.4.2-win64.msi -Algorithm SHA256).Hash -eq `
  '9F252A0F2EF06C11A580BB95952EC4EBDC6F1E4D533341AEE920F790F5C327F4'

# Windows-Codesignatur prüfen: Status muss "Valid" sein, Signer "CN=Yubico AB, ..."
Get-AuthenticodeSignature .\yubico-authenticator-7.4.2-win64.msi |
  Format-List Status,
    @{n='Signer';     e={$_.SignerCertificate.Subject}},
    @{n='Thumbprint'; e={$_.SignerCertificate.Thumbprint}}
""")
P("Erwartete Ausgabe der Signaturprüfung:")
CODE("""
Status     : Valid
Signer     : CN=Yubico AB, O=Yubico AB, L=STOCKHOLM, S=Stockholms län, C=SE
Thumbprint : A1614CD84976030D49209B56162D9EFA69B73698
""")
P("<b>Ohne PowerShell:</b> Rechtsklick auf die .msi › <b>Eigenschaften</b> › Registerkarte "
  "<b>Digitale Signaturen</b> › Name des Signaturgebers muss <b>Yubico AB</b> lauten › <b>Details</b> › "
  "»Diese digitale Signatur ist gültig.« Alternativ: " + m("certutil -hashfile Datei.msi SHA256") + " bzw. "
  + m("MD5") + " in der Eingabeaufforderung.")
P("<b>Optional: GPG-Prüfung</b> (mit Gpg4win installiert):")
CODE("""
gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys 9E885C0302F9BB9167529C2D5CBA11E6ADC7BCD1
gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys 20EE325B86A81BCBD3E56798F04367096FBA95E8
gpg --verify yubico-authenticator-7.4.2-win64.msi.sig yubico-authenticator-7.4.2-win64.msi
#  -> gpg: Good signature from "Dennis Fokin <dennis.fokin@yubico.com>"
gpg --verify yubikey-manager-5.9.2-win64.msi.sig yubikey-manager-5.9.2-win64.msi
#  -> gpg: Good signature from "Dain Nilsson <dain@yubico.com>"
""")
P("Die Warnung »This key is not certified with a trusted signature« ist normal. Entscheidend ist »Good signature« "
  "und ein Fingerabdruck, der auf der Yubico-Seite Software Signing gelistet ist.", "small")

# =====================================================================
# 4 INSTALLATION
# =====================================================================
H1("4  Installation unter Windows 10 und 11")
P("Windows 10 und Windows 11 unterscheiden sich für den YubiKey nur in Details der Oberfläche. Die Schritte sind "
  "identisch. Voraussetzung: Windows 10 oder 11, 64-Bit (x64), aktuell gepatcht, Administratorrechte für die "
  "Installation.")

H2("4.1  Yubico Authenticator installieren")
STEPS([
    "Installer laden: " + link(AUTH["url"], AUTH["file"]) + " und gemäß Kapitel 3.2 prüfen.",
    "Doppelklick auf die .msi › Assistent mit <b>Next</b> bestätigen › Lizenz akzeptieren › Zielordner übernehmen "
    "(" + m(r"C:\Program Files\Yubico\Yubico Authenticator") + ") › <b>Install</b> › UAC-Abfrage mit <b>Ja</b> "
    "bestätigen › <b>Finish</b>.",
    "Startmenü › <b>Yubico Authenticator</b> starten. YubiKey einstecken. Der Key erscheint oben links mit Modell, "
    "Seriennummer und Firmware-Version.",
])
P("Unbeaufsichtigte Installation für Administratoren (Softwareverteilung, Intune, GPO):")
CODE(r"""
msiexec /i yubico-authenticator-7.4.2-win64.msi /qn /l*v C:\Temp\yubico-auth-install.log
""")
BOX("crit", "Wichtig: Administratorrechte für FIDO-Funktionen", [
    "Seit Änderungen in Windows 10/11 dürfen normale Programme nicht mehr direkt mit FIDO-Geräten sprechen. Nur "
    "der Browser tut das über die Windows-WebAuthn-Schnittstelle. Für die Bereiche <b>Passkeys</b> und die "
    "<b>FIDO2-PIN</b> muss der Yubico Authenticator deshalb <b>als Administrator</b> laufen. Die App zeigt dafür "
    "einen Button zum Anheben der Rechte an, oder Sie wählen Rechtsklick › <b>Als Administrator ausführen</b>. "
    "TOTP (OATH), PIV, OpenPGP und OTP-Slots funktionieren auch ohne Adminrechte.",
    "Alternative ohne Adminrechte: FIDO2-PIN über die Windows-Einstellungen verwalten (Kapitel 5.2).",
])
BOX("warn", "Nicht die Microsoft-Store-Version verwenden", [
    "Die Store-Version kann ihre Rechte wegen der Sandbox in der Regel nicht anheben. Yubico selbst empfiehlt den "
    "offiziellen .msi-Installer.",
])

H2("4.2  Optional: YubiKey Manager CLI (ykman) installieren")
STEPS([
    "Installer laden: " + link(YKMAN["url"], YKMAN["file"]) + " und prüfen (Kapitel 3.2).",
    "Installieren wie oben. Ziel: " + m(r"C:\Program Files\Yubico\YubiKey Manager CLI") + ". Das Setup trägt "
    "den Ordner in die systemweite PATH-Variable ein.",
    "<b>Neues</b> Terminal öffnen (für FIDO-Befehle: <b>Terminal (Administrator)</b>) und testen:",
])
CODE("""
PS C:\\> ykman --version
YubiKey Manager (ykman) version: 5.9.2

PS C:\\> ykman info
Device type: YubiKey 5C NFC
Serial number: 12345678
Firmware version: 5.7.4
Form factor: Keychain (USB-C)
Enabled USB interfaces: OTP, FIDO, CCID
NFC transport is enabled
...
""")
P("(Beispielausgabe; Modell, Seriennummer und Firmware entsprechen Ihrem Key.) FIDO-Befehle ohne Adminrechte "
  "enden mit der Meldung »FIDO access on Windows requires running as Administrator.«", "small")

H2("4.3  Optionale Komponenten")
BL([
    "<b>YubiKey Smart Card Minidriver</b>: nur nötig, wenn PIV-Zertifikate für die Windows-/Active-Directory-"
    "Smartcard-Anmeldung genutzt werden. Download: "
    + link("https://www.yubico.com/support/download/smart-card-drivers-tools/") + ". Signatur »Yubico AB« "
    "wie in 3.2 prüfen.",
    "<b>Yubico Login for Windows</b>: sichert die Anmeldung an <i>lokalen</i> Windows-Konten mit "
    "Challenge-Response. <b>Achtung, Aussperrgefahr:</b> Vorher lokalen Benutzernamen und Passwort kennen und die "
    "Konfigurationsanleitung vollständig lesen: "
    + link("https://support.yubico.com/hc/en-us/articles/360013708460-Yubico-Login-for-Windows-Configuration-Guide",
           "Yubico Login for Windows Configuration Guide") + ".",
])

# =====================================================================
# 5 ERSTEINRICHTUNG
# =====================================================================
H1("5  Ersteinrichtung des YubiKeys")
P("Diese Schritte werden einmal pro YubiKey durchgeführt, vor der ersten Registrierung bei einem Dienst. "
  "Wiederholen Sie sie für den Ersatzschlüssel.")

H2("5.1  Key identifizieren und dokumentieren")
STEPS([
    "YubiKey einstecken, Yubico Authenticator öffnen › Bereich <b>Start</b> / <i>Home</i>.",
    "Modell, <b>Seriennummer</b> und <b>Firmware-Version</b> notieren. Die Firmware bestimmt die Kapazität: "
    "ab 5.7 sind es 100 Passkeys und 64 TOTP-Konten, darunter 25 bzw. 32.",
    "Den Key physisch beschriften (z. B. »YK-01 Haupt«, »YK-02 Ersatz«) und in einer Inventarliste führen: "
    "Seriennummer, Besitzer, registrierte Konten.",
])

H2("5.2  FIDO2-PIN setzen (Pflicht für Passkeys)")
P("Ab Werk hat der YubiKey <b>keine</b> FIDO2-PIN. Viele Dienste, darunter Sophos Central, verlangen für "
  "Passkeys eine Benutzerverifizierung. Setzen Sie die PIN deshalb vorab. Wählen Sie mindestens 6 Zeichen, "
  "erlaubt sind 4 bis 63, auch alphanumerisch.")
H3("Weg A – Windows-Einstellungen (ohne Zusatzsoftware)")
STEPS([
    "<b>Einstellungen</b> (Win + I) › <b>Konten</b> / <i>Accounts</i> › <b>Anmeldeoptionen</b> / "
    "<i>Sign-in options</i>.",
    "<b>Sicherheitsschlüssel</b> / <i>Security Key</i> › <b>Verwalten</b> / <i>Manage</i>.",
    "YubiKey einstecken und berühren, wenn er blinkt.",
    "Unter <b>Sicherheitsschlüssel-PIN</b> auf <b>Hinzufügen</b> klicken (bei vorhandener PIN: "
    "<b>Ändern</b>), PIN zweimal eingeben › <b>OK</b>.",
])
H3("Weg B – Yubico Authenticator (als Administrator)")
STEPS([
    "Yubico Authenticator <b>als Administrator</b> starten › Bereich <b>Passkeys</b>.",
    "Menü (drei Punkte bzw. Aktionsleiste) › <b>PIN setzen</b> / <i>Set PIN</i> › neue PIN zweimal eingeben › "
    "<b>Speichern</b>.",
])
H3("Weg C – Kommandozeile (Terminal als Administrator)")
CODE("""
ykman fido access change-pin              # fragt die neue PIN interaktiv ab
ykman fido info                           # zeigt: PIN is set, with 8 attempt(s) remaining
""")
BOX("warn", "PIN-Fehlversuche", [
    "Nach <b>3</b> Fehlversuchen in Folge muss der Key abgezogen und neu eingesteckt werden. Nach insgesamt "
    "<b>8</b> Fehlversuchen ist FIDO2 <b>gesperrt</b>. Dann hilft nur ein FIDO-Reset, der <b>alle</b> Passkeys und "
    "U2F-Registrierungen löscht (Kapitel 10). Die PIN deshalb sicher notieren, etwa im Passwortmanager.",
])
BOX("info", "Bekanntes Windows-Problem (behoben)", [
    "Das Juli-Update 2025 für Windows 11 24H2 (KB5062553) verhinderte das Setzen, Ändern und Zurücksetzen der PIN "
    "über die Einstellungen. Behoben ist das ab Build 26100.6584 (KB5065426). Bei älterem Patchstand Weg B oder C "
    "verwenden.",
])

H2("5.3  Optional: OATH-Passwort setzen")
P("Wer TOTP-Codes auf dem Key speichert, kann den Zugriff mit einem Passwort schützen. Ohne Passwort kann jeder, "
  "der den Key in den Händen hält, die Codes anzeigen lassen. Yubico Authenticator › <b>Konten</b> / "
  "<i>Accounts</i> › Menü › <b>Passwort verwalten</b> / <i>Manage password</i> › <b>Passwort setzen</b>. "
  "Die Option »Passwort merken« speichert es auf <i>diesem</i> PC. CLI: " + m("ykman oath access change") + ".")

H2("5.4  Optional: Nicht benötigte Schnittstellen abschalten")
P("Ein häufiges Ärgernis: Streift man den Key versehentlich, »tippt« die OTP-Schnittstelle eine lange "
  "Zeichenfolge wie " + m("cccccbhkevjk...") + " in das aktive Fenster. Wer Yubico OTP nicht benötigt, schaltet es "
  "ab. Das lässt sich jederzeit rückgängig machen.")
BL([
    "Yubico Authenticator › <b>Start</b> › <b>Anwendungen aktivieren/deaktivieren</b> / <i>Toggle applications</i> "
    "› USB › <b>OTP</b> deaktivieren › Speichern. Der Key startet dabei neu.",
    "CLI: " + m("ykman config usb --disable OTP") + " (wieder aktivieren: " + m("ykman config usb --enable OTP") + ")",
])
P("Nicht deaktivieren: <b>FIDO2/U2F</b>, wenn Sie Passkeys nutzen, und <b>OATH</b>, wenn Sie TOTP-Codes auf dem "
  "Key speichern.", "small")

H2("5.5  PIV- und OpenPGP-Standard-PINs ändern (nur bei Nutzung)")
P("Wenn Sie PIV (Smartcard) oder OpenPGP verwenden, ändern Sie <b>sofort</b> die öffentlich bekannten "
  "Standardwerte:")
CODE("""
ykman piv access change-pin               # Standard: 123456
ykman piv access change-puk               # Standard: 12345678
ykman piv access change-management-key --generate --protect
ykman openpgp access change-pin           # Standard: 123456
ykman openpgp access change-admin-pin     # Standard: 12345678
""")

# =====================================================================
# 6 STANDARDWEG
# =====================================================================
H1("6  Der Standardweg: YubiKey als 2FA an ein Konto binden")
P("Fast alle Dienste (Microsoft, Google, GitHub, AWS, Sophos, Passwortmanager usw.) folgen demselben Muster. "
  "Die Bezeichnungen variieren, der Ablauf nicht.")

H2("6.1  Variante FIDO2 / Sicherheitsschlüssel / Passkey (empfohlen)")
STEPS([
    "Im Browser (Edge, Chrome oder Firefox, aktuell) beim Dienst anmelden.",
    "Die Sicherheitseinstellungen öffnen: meist <b>Profil › Sicherheit › Zwei-Faktor-Authentifizierung / "
    "Anmeldemethoden / MFA</b>.",
    "<b>Methode hinzufügen</b> › <b>Sicherheitsschlüssel</b>, <b>Passkey</b> oder <i>Security key</i> wählen. "
    "Oft verlangt der Dienst jetzt noch einmal Passwort oder bisherigen Faktor.",
    "Windows öffnet den Dialog <b>Windows-Sicherheit</b>. Wenn gefragt wird, wo der Passkey gespeichert werden "
    "soll, <b>Sicherheitsschlüssel</b> / <i>Security key</i> wählen, <i>nicht</i> »Dieses Windows-Gerät« "
    "(Windows Hello) und nicht »iPhone, iPad oder Android-Gerät«.",
    "YubiKey einstecken › <b>FIDO2-PIN</b> eingeben › goldene Kontaktfläche <b>berühren</b>, wenn der Key blinkt.",
    "Beim Dienst einen sprechenden Namen vergeben, z. B. »YK-01 Haupt (SN 12345678)«.",
    "<b>Sofort den Ersatzschlüssel</b> auf die gleiche Weise als zweite Methode registrieren.",
    "Wiederherstellungscodes des Dienstes (falls angeboten) herunterladen und offline verwahren.",
    "<b>Test:</b> abmelden, neu anmelden und mit dem YubiKey bestätigen. Danach mit dem Ersatzschlüssel testen.",
])
BOX("info", "Anmeldung danach", [
    "Passwort eingeben (entfällt bei rein passwortlosen Passkeys) › der Browser fordert den Sicherheitsschlüssel an "
    "› PIN eingeben › berühren › angemeldet. Auf einer Phishing-Seite passiert nichts, weil der Key dort keinen "
    "passenden Schlüssel hat.",
])

H2("6.2  Variante TOTP mit dem Yubico Authenticator")
P("Wenn der Dienst nur eine »Authenticator-App« anbietet, speichern Sie das TOTP-Geheimnis im YubiKey statt auf "
  "dem Smartphone. Die Codes erhalten Sie dann an jedem PC mit installiertem Yubico Authenticator oder per NFC in "
  "der Yubico-Authenticator-App auf Android/iOS.")
STEPS([
    "Beim Dienst: <b>MFA hinzufügen › Authenticator-App</b>. Ein QR-Code wird angezeigt.",
    "Yubico Authenticator öffnen, YubiKey einstecken › <b>Konten</b> / <i>Accounts</i> › <b>Konto hinzufügen</b> / "
    "<i>Add account</i>.",
    "<b>QR-Code aufnehmen</b> / <i>Scan QR code</i> wählen: Die App liest den QR-Code direkt vom Bildschirm. "
    "Alternativ das QR-Bild per Drag &amp; Drop in die App ziehen oder den geheimen Schlüssel (Base32) manuell "
    "eingeben.",
    "Aussteller und Kontoname prüfen. Empfohlen: <b>Berührung erforderlich</b> / <i>Require touch</i> "
    "aktivieren. Dann wird jeder Code erst nach Berühren des Keys angezeigt › <b>Speichern</b>.",
    "Den angezeigten 6-stelligen Code beim Dienst eingeben › bestätigen.",
    "<b>Ersatzschlüssel:</b> Denselben QR-Code <i>vor dem Schließen</i> auch mit dem zweiten YubiKey scannen. "
    "Später ist der QR-Code in der Regel nicht mehr abrufbar.",
])
P("Dasselbe per Kommandozeile, wenn der Dienst den geheimen Schlüssel als Text anzeigt:")
CODE("""
ykman oath accounts add -t -i "Beispieldienst" "max.mustermann@firma.de" JBSWY3DPEHPK3PXP
ykman oath accounts list
ykman oath accounts code "Beispieldienst"      # zeigt den aktuellen Code (bei -t: Key berühren)
""")
P(m("-t") + " = Berührung erforderlich, " + m("-i") + " = Aussteller. Standard ist TOTP, 6 Stellen, SHA1, 30 s. "
  "Der Beispiel-Schlüssel ist ein Platzhalter.", "small")

# =====================================================================
# 7 MEHRERE KONTEN
# =====================================================================
H1("7  Ein YubiKey für mehrere Konten, mehrere Keys pro Konto")
P("<b>Ja, ein einzelner YubiKey kann an beliebig viele Konten gebunden werden</b>, auch bei verschiedenen "
  "Diensten und mehreren Konten beim selben Dienst. Die Konten sind kryptografisch voneinander getrennt: "
  "Kein Dienst erfährt, bei welchen anderen Diensten der Key registriert ist. Grenzen setzt nur der Speicher:")
TABLE([
    ["Methode", "Wie viele Konten pro YubiKey?", "Belegt Speicher?"],
    ["FIDO U2F / nicht auffindbarer Sicherheitsschlüssel", "<b>Unbegrenzt</b>", "Nein"],
    ["FIDO2-Passkey (auffindbar)", "25 (Firmware &lt; 5.7) bzw. <b>100</b> (ab 5.7)", "Ja, je Passkey 1 Platz"],
    ["OATH-TOTP/HOTP", "32 (Firmware &lt; 5.7) bzw. <b>64</b> (ab 5.7)", "Ja, je Konto 1 Platz"],
    ["Yubico OTP / Challenge-Response", "2 Slots (ein Yubico-OTP-Slot funktioniert bei vielen Diensten)", "Ja"],
], [0.4, 0.4, 0.2])
P("Umgekehrt gilt: <b>Ein Konto kann mehrere YubiKeys haben.</b> Das ist der Standard für Ausfallsicherheit, "
  "etwa Haupt- und Ersatzschlüssel, bei Admin-Konten ggf. ein dritter Key im Tresor. Die meisten Dienste "
  "erlauben 5 oder mehr Sicherheitsschlüssel, Sophos Central bis zu 10 Methoden je Typ.")
BOX("tip", "Praxisbeispiel Mehrfachnutzung", [
    "Ein YubiKey 5C NFC (Firmware 5.7) eines Administrators trägt z. B.: Passkey für Sophos Central, Passkey für "
    "Microsoft 365 (Entra ID), Sicherheitsschlüssel für GitHub, TOTP für das Sophos-Firewall-Benutzerportal und "
    "TOTP für einen Webhoster. Das sind 5 Konten auf einem Key. Derselbe Ersatzschlüssel ist bei allen fünf "
    "ebenfalls registriert.",
])

# =====================================================================
# 8 SOPHOS CENTRAL
# =====================================================================
H1("8  Praxisbeispiel: YubiKey für ein Sophos-Central-Konto (Enterprise)")
P("Sophos Central (Admin, Enterprise Dashboard und Partner Dashboard) erzwingt MFA für alle Administratoren. "
  "Seit <b>November 2024</b> werden <b>Passkeys (FIDO2)</b> nativ unterstützt. Sophos nennt dabei ausdrücklich "
  "YubiKeys als gerätegebundene Authentifikatoren. Außerdem gilt:")
BL([
    "Unterstützte Methoden: <b>Passkey</b> (z. B. YubiKey) und <b>Authenticator-App (TOTP)</b>, etwa Google/Microsoft "
    "Authenticator, der Authenticator in Intercept X for Mobile oder eben der YubiKey mit Yubico Authenticator.",
    "<b>SMS und E-Mail+PIN sind abgekündigt.</b> Neue Benutzer können sie nicht mehr wählen, und seit 01.05.2025 "
    "müssen bestehende Nutzer beim Anmelden auf Passkey oder App umstellen.",
    "Es müssen <b>mindestens zwei MFA-Methoden</b> registriert werden, maximal 10 je Typ. Sophos empfiehlt einen "
    "Passkey plus eine Authenticator-App. Ist ein Passkey vorhanden, fragt Sophos ihn bei der Anmeldung zuerst ab.",
])
BOX("tip", "Empfohlene Kombination für Sophos Central", [
    "<b>Methode 1:</b> Passkey auf YubiKey YK-01 (Haupt)  ·  <b>Methode 2:</b> Passkey auf YubiKey YK-02 (Ersatz)  ·  "
    "optional <b>Methode 3:</b> TOTP (Authenticator-App oder YubiKey-OATH) als Rückfallebene. Zwei Hardware-Passkeys "
    "erfüllen die Zwei-Methoden-Pflicht und sind beide phishing-resistent.",
])

H2("8.1  Voraussetzungen")
BL([
    "YubiKey mit FIDO2 (YubiKey 5, Security Key oder Bio), FIDO2-PIN gesetzt (Kapitel 5.2).",
    "Aktueller Browser (Edge, Chrome oder Firefox) unter Windows 10/11. Der Yubico Authenticator ist für den Passkey-"
    "Weg <i>nicht</i> nötig, der Browser spricht über Windows direkt mit dem Key.",
    "Zugang zum Sophos-Central-Konto (Benutzername und Passwort der Sophos ID). Für ein bestehendes Konto: "
    "eine bereits funktionierende MFA-Methode, um die Änderung zu bestätigen.",
])

H2("8.2  Variante A – YubiKey als Passkey registrieren (empfohlen)")
P("<b>Bei der Erstanmeldung</b> (neuer Administrator): Sophos Central fordert nach dem Passwort automatisch zur "
  "MFA-Einrichtung auf und verlangt zwei Methoden. Wählen Sie dort <b>Passkey</b> und fahren Sie ab Schritt 4 fort.")
P("<b>Bei einem bestehenden Konto:</b>")
STEPS([
    "Unter " + link("https://central.sophos.com") + " anmelden (Passwort + bisherige MFA).",
    "Oben rechts auf das <b>Profil-Symbol</b> › <b>My info</b> (Meine Informationen) › <b>Manage MFA</b> "
    "(MFA verwalten). Alternativ über die Sophos ID: <b>My Profile › Manage MFA</b>.",
    "Auf dem Bildschirm <b>Multi-Factor Authentication</b> auf das <b>+</b>-Symbol klicken › unter "
    "<b>Set up MFA method</b> die Option <b>Passkey</b> wählen.",
    "Windows öffnet den Dialog <b>Windows-Sicherheit</b> › <b>Sicherheitsschlüssel</b> / <i>Security key</i> wählen "
    "(nicht »Dieses Windows-Gerät«, nicht »iPhone/Android«).",
    "YubiKey einstecken › <b>FIDO2-PIN</b> eingeben › Key <b>berühren</b>.",
    "Einen Anzeigenamen vergeben, z. B. <b>YubiKey YK-01 Haupt</b> › speichern. Die Methode erscheint in der Liste "
    "mit Name und »zuletzt verwendet«.",
    "Schritte 3–6 mit dem <b>Ersatzschlüssel</b> (YK-02) wiederholen.",
    "<b>Test:</b> abmelden › anmelden › nach dem Passwort erscheint die Passkey-Abfrage › PIN + Berührung › "
    "Dashboard erscheint. Test mit YK-02 wiederholen.",
])
BOX("info", "Mehrere Sophos-Konten", [
    "Derselbe YubiKey kann Passkeys für mehrere Sophos-Konten tragen, z. B. Kunden-Tenant und Partner-Konto mit "
    "unterschiedlicher Sophos ID. Jede Registrierung belegt einen eigenen Passkey-Platz (25 bzw. 100). In der "
    "Windows-Abfrage wählen Sie ggf. das passende Konto aus.",
])

H2("8.3  Variante B – YubiKey als TOTP-Authenticator (OATH)")
P("Wenn Passkeys organisatorisch nicht gewünscht sind oder als zusätzliche Rückfallmethode:")
STEPS([
    "<b>Profil › My info › Manage MFA</b> › <b>+</b> › <b>Authentication App</b> › <b>Set up now</b>. "
    "Ein QR-Code erscheint.",
    "Yubico Authenticator › <b>Konten › Konto hinzufügen › QR-Code aufnehmen</b> › Aussteller »Sophos Central« "
    "prüfen › <b>Berührung erforderlich</b> aktivieren › <b>Speichern</b>.",
    "Vor dem Schließen denselben QR-Code auch mit dem Ersatzschlüssel scannen (optional).",
    "Den im Yubico Authenticator angezeigten 6-stelligen Code (<i>security code</i>) in Sophos Central eingeben "
    "› bestätigen.",
    "<b>Anmeldung künftig:</b> Passwort › »Authenticator-App« › Yubico Authenticator öffnen › Key berühren › "
    "Code abtippen.",
])
P("Hinweis: TOTP ist nicht phishing-resistent. Für Admin-Konten ist Variante A vorzuziehen.", "small")

H2("8.4  MFA eines Administrators zurücksetzen (Key verloren)")
TABLE([
    ["Umgebung", "Weg (laut Sophos-Dokumentation)"],
    ["<b>Sophos Central Admin</b>", "Ein <b>Super Admin</b>: <b>My Environment › Users &amp; Groups</b> › "
     "Registerkarte <i>Users</i> › Benutzer anklicken › <b>Reset MFA</b> › <b>Reset</b>. Der Benutzer erhält eine "
     "E-Mail mit Sicherheitscode, gibt ihn bei der nächsten Anmeldung ein und richtet MFA neu ein."],
    ["<b>Sophos Central Enterprise</b>", "Symbol <b>Global Settings › Access Control › Admins and Roles</b> › "
     "Administrator wählen › <b>Reset MFA</b> › bestätigen. Die Einrichtung startet bei der nächsten Anmeldung."],
    ["Eigenes Konto gesperrt", "Den eigenen Super Admin bzw. den Partner-Super-Admin kontaktieren. Deshalb immer "
     "einen Ersatzschlüssel registrieren."],
], [0.25, 0.75])
P("Nach dem Reset den verlorenen Key in allen anderen Diensten ebenfalls entfernen (Kapitel 10.1).", "small")

H2("8.5  Enterprise-Option: Anmeldung über Identity Provider (Entra ID / Okta)")
P("Sophos Central unterstützt die föderierte Anmeldung über <b>Microsoft Entra ID</b>, <b>OpenID Connect</b> "
  "(z. B. Okta) und <b>AD FS</b>. Konfiguration: <b>Global Settings › Access Control › Sign-in and Identity › "
  "Sophos sign-in</b>. Voraussetzung ist eine verifizierte Domain. Bei der Option <b>IdP-erzwungene MFA</b> prüft "
  "der Identity Provider den zweiten Faktor. Der YubiKey wird dann dort als FIDO2-Sicherheitsschlüssel registriert "
  "(z. B. Entra ID: <i>Authentifizierungsmethoden › FIDO2-Sicherheitsschlüssel / Passkey</i>) und gilt zentral für "
  "Sophos Central <i>und</i> alle anderen Entra-Anwendungen.")

H2("8.6  Abgrenzung: Sophos Firewall (Benutzerportal, VPN)")
P("Die <b>Sophos Firewall</b> (Web-Admin, Benutzerportal, SSL/IPsec-VPN, Sophos Connect) ist ein eigenes System. "
  "Sie unterstützt <b>nur OTP (TOTP)</b>, kein FIDO2. Mit dem YubiKey funktioniert das über OATH: Im "
  "Benutzerportal den OTP-QR-Code mit dem Yubico Authenticator scannen (Kapitel 6.2). Bei <b>Sophos Connect</b> "
  "wird der Code direkt an das Passwort angehängt (" + m("PasswortCODE") + "). Hardware-Token-Geheimnisse "
  "unterstützt die Firewall nur mit SHA1.")

# =====================================================================
# 9 VERWALTUNG
# =====================================================================
H1("9  YubiKey im Alltag verwalten")
H2("9.1  Yubico Authenticator – Bereiche")
TABLE([
    ["Bereich (DE / EN)", "Funktionen", "Adminrechte?"],
    ["<b>Start</b> / Home", "Modell, Seriennummer, Firmware; <b>Anwendungen aktivieren/deaktivieren</b>; "
     "Werksreset; Diagnose", "Nein (FIDO-Reset: ja)"],
    ["<b>Konten</b> / Accounts", "TOTP/HOTP: hinzufügen (QR-Code, manuell), Codes anzeigen und kopieren, "
     "umbenennen, löschen, anpinnen; OATH-Passwort", "Nein"],
    ["<b>Passkeys</b>", "Gespeicherte Passkeys anzeigen und löschen; FIDO2-PIN setzen/ändern; FIDO-Reset; "
     "Fingerabdrücke (Bio)", "<b>Ja</b>"],
    ["<b>Zertifikate</b> / Certificates", "PIV: Zertifikate, Schlüssel, PIN/PUK/Management Key", "Nein"],
    ["<b>Slots</b>", "OTP-Slot 1/2: Yubico OTP, statisches Passwort, Challenge-Response, HOTP", "Nein"],
], [0.24, 0.58, 0.18])

H2("9.2  Kommandoreferenz ykman 5.9.2")
TABLE([
    ["Aufgabe", "Befehl"],
    ["Angeschlossene Keys auflisten / Details", m("ykman list") + "  ·  " + m("ykman info")],
    ["Schnittstellen anzeigen / ändern", m("ykman config usb --list") + "  ·  " + m("ykman config usb --disable OTP")],
    ["FIDO-Status (PIN, Restversuche)*", m("ykman fido info")],
    ["FIDO2-PIN ändern*", m("ykman fido access change-pin")],
    ["Passkeys auflisten / löschen*", m("ykman fido credentials list") + "  ·  " + m("ykman fido credentials delete &lt;ID&gt;")],
    ["TOTP-Konto hinzufügen", m("ykman oath accounts add -t -i ISSUER NAME SECRET")],
    ["TOTP-Konten / Codes anzeigen", m("ykman oath accounts list") + "  ·  " + m("ykman oath accounts code [Suchbegriff]")],
    ["TOTP-Konto umbenennen / löschen", m("ykman oath accounts rename") + "  ·  " + m("ykman oath accounts delete &lt;Name&gt;")],
    ["OATH-Passwort setzen", m("ykman oath access change")],
    ["OTP-Slots anzeigen", m("ykman otp info")],
    ["PIV-/OpenPGP-Status", m("ykman piv info") + "  ·  " + m("ykman openpgp info")],
    ["Hilfe zu jedem Befehl", m("ykman &lt;befehl&gt; --help")],
], [0.36, 0.64])
P("* Erfordert unter Windows ein Terminal <b>als Administrator</b>.", "small")

H2("9.3  Passkeys prüfen und aufräumen")
P("Da Passkey-Plätze begrenzt sind, lohnt ein regelmäßiger Blick: Yubico Authenticator (als Administrator) › "
  "<b>Passkeys</b> › FIDO2-PIN eingeben. Die Liste zeigt Dienst (Relying Party, z. B. " + m("sophos.com") +
  ") und Benutzername. Nicht mehr benötigte Einträge über <b>Passkey löschen</b> entfernen. Danach die Methode "
  "auch beim Dienst entfernen. Alternativ: <b>Einstellungen › Konten › Anmeldeoptionen › Sicherheitsschlüssel › "
  "Verwalten</b> (je nach Windows-Build mit Passkey-Verwaltung).")

H2("9.4  Empfohlene Betriebsregeln")
BL([
    "Pro Person mindestens zwei Keys. Der Ersatzschlüssel liegt an einem anderen Ort (Tresor, zu Hause).",
    "Inventar führen: Seriennummer ↔ Person ↔ registrierte Konten.",
    "Neue Konten immer mit <b>beiden</b> Keys registrieren. Den Ersatzschlüssel dazu kurz holen oder das Konto "
    "vormerken.",
    "PINs nie auf dem Key notieren. Den Key nicht dauerhaft unbeaufsichtigt im Rechner stecken lassen.",
    "Vierteljährlich die Anmeldung mit dem Ersatzschlüssel testen.",
])

# =====================================================================
# 10 VERLUST & RESET
# =====================================================================
H1("10  Verlust, Defekt und Zurücksetzen")
H2("10.1  YubiKey verloren oder gestohlen")
STEPS([
    "Mit dem <b>Ersatzschlüssel</b> (oder den Wiederherstellungscodes) bei jedem Dienst anmelden.",
    "Den verlorenen Key in den MFA-Einstellungen <b>jedes</b> Dienstes entfernen (Inventarliste nutzen). Bei Sophos "
    "Central: <b>My info › Manage MFA</b> › Methode entfernen. Ohne Zugang: Reset durch den Super Admin (8.4).",
    "Neuen Key beschaffen, einrichten (Kapitel 5) und überall als neuen Ersatzschlüssel registrieren.",
])
P("Der Finder kann mit dem Key allein wenig anfangen: Für Passkeys fehlt ihm die PIN, für U2F-Konten das Passwort. "
  "Trotzdem den Key zeitnah bei allen Diensten austragen.", "small")

H2("10.2  Anwendungen zurücksetzen")
BOX("crit", "Achtung – unwiderruflich", [
    "Ein Reset löscht alle Zugangsdaten der jeweiligen Anwendung endgültig. Vorher sicherstellen, dass alle "
    "betroffenen Konten anderweitig erreichbar sind (Ersatzschlüssel).",
])
TABLE([
    ["Anwendung", "Befehl / Weg", "Wirkung"],
    ["FIDO (FIDO2 + U2F)", m("ykman fido reset") + " (als Admin) · Yubico Authenticator › Passkeys › Zurücksetzen "
     "· Windows: Einstellungen › Konten › Anmeldeoptionen › Sicherheitsschlüssel › Verwalten › "
     "<b>Zurücksetzen</b>", "Löscht <b>alle</b> Passkeys und U2F-Registrierungen und die PIN. Muss innerhalb von "
     "ca. 5 s nach dem Einstecken gestartet und per Berührung bestätigt werden."],
    ["OATH", m("ykman oath reset"), "Löscht alle TOTP/HOTP-Konten und das OATH-Passwort."],
    ["PIV", m("ykman piv reset"), "Zertifikate gelöscht; PIN 123456, PUK 12345678, Standard-Management-Key."],
    ["OpenPGP", m("ykman openpgp reset"), "Schlüssel gelöscht; PINs wieder 123456 / 12345678."],
    ["OTP-Slot", m("ykman otp delete 1") + " bzw. " + m("2"), "Löscht die Slot-Konfiguration."],
    ["Alles (nur neuere Keys)", m("ykman config reset"), "Kompletter Werksreset, sofern vom Modell unterstützt."],
], [0.17, 0.43, 0.40])

# =====================================================================
# 11 FEHLERBEHEBUNG
# =====================================================================
H1("11  Fehlerbehebung")
TABLE([
    ["Symptom", "Ursache / Lösung"],
    ["Yubico Authenticator: »Failed connecting to the YubiKey. Make sure the application has the required "
     "permissions« im Bereich Passkeys", "App ohne Adminrechte gestartet. Button zum Anheben nutzen oder App "
     "<b>als Administrator</b> starten. Store-Version gegen die .msi tauschen."],
    ["ykman: »FIDO access on Windows requires running as Administrator.«", "Terminal als Administrator öffnen."],
    ["Key blinkt, Browser reagiert nicht", "Goldene Fläche berühren (nicht nur einstecken). Bei Nachfrage im "
     "Windows-Dialog »Sicherheitsschlüssel« wählen."],
    ["Beim Registrieren wird eine PIN verlangt, obwohl keine gesetzt ist", "Normal: Windows fordert zum Anlegen "
     "einer FIDO2-PIN auf. Seit den Oktober-Updates für Windows 11 24H2/25H2 (Build 26100/26200.6725) passiert "
     "das auch, wenn der Dienst nur »UV preferred« anfordert. PIN setzen (5.2)."],
    ["PIN kann in den Windows-Einstellungen nicht gesetzt/geändert werden", "Windows 11 24H2 mit KB5062553: "
     "Update installieren (≥ 26100.6584) oder Yubico Authenticator/ykman nutzen."],
    ["»PIN blockiert« / »PIN blocked«", "8 Fehlversuche. Nur FIDO-Reset möglich (löscht alle Passkeys). "
     "Mit dem Ersatzschlüssel anmelden und den Key nach dem Reset neu registrieren."],
    ["Zufällige Zeichenfolge »cccc…« erscheint beim Berühren", "OTP-Schnittstelle, Slot 1. Harmlos, aber "
     "abschaltbar: " + m("ykman config usb --disable OTP") + "."],
    ["Konten-Bereich zeigt nichts / CCID-Fehler", "Dienst <b>Smartcard</b> (SCardSvr) läuft nicht: "
     + m("services.msc") + " › Smartcard › Starten, Starttyp »Manuell (Trigger)«. Andere Smartcard-Software "
     "(z. B. exklusiver Zugriff durch Drittanbieter-Middleware) schließen."],
    ["Key wird gar nicht erkannt", "Anderen USB-Port bzw. keinen Hub verwenden. Im Geräte-Manager müssen "
     "»HID-Tastaturgerät«, »USB-Eingabegerät (FIDO)« und ggf. »Smartcard-Leser« erscheinen. "
     "Yubico Authenticator › Hilfe &amp; Info › <b>Diagnose ausführen</b>."],
    ["Sophos Central bietet »Passkey« nicht an", "Browser aktualisieren. Bei föderierter Anmeldung (IdP) wird MFA "
     "ggf. beim IdP geregelt (8.5)."],
], [0.38, 0.62])

# =====================================================================
# 12 TESTPROTOKOLL
# =====================================================================
story.append(PageBreak())
H1("12  Testprotokoll (Abnahme der Anleitung)")
P("Dieses Protokoll dient als Testlauf der Anleitung. Arbeiten Sie es an einem Windows-10- und einem Windows-11-"
  "Rechner durch und haken Sie jeden Punkt ab.")
chk = '<font name="Sym" size="11">☐</font>'
TABLE([
    ["#", "Prüfschritt", "Erwartetes Ergebnis", "Win 10", "Win 11"],
    ["1", "Downloads laden, SHA-256 und MD5 mit Tabelle 3.1 vergleichen", "Werte identisch", chk, chk],
    ["2", m("Get-AuthenticodeSignature") + " auf beide .msi", "Status Valid, Signer CN=Yubico AB", chk, chk],
    ["3", "Yubico Authenticator installieren, Key einstecken", "Modell, SN, Firmware angezeigt", chk, chk],
    ["4", "ykman installieren, " + m("ykman info"), "Geräteinfos erscheinen", chk, chk],
    ["5", "FIDO2-PIN über Windows-Einstellungen setzen", "PIN gesetzt; " + m("ykman fido info") + ": 8 Versuche", chk, chk],
    ["6", "Authenticator als Admin › Passkeys öffnen", "PIN-Abfrage, leere Liste", chk, chk],
    ["7", "Test-Passkey auf " + link("https://webauthn.io", "webauthn.io") + " registrieren und anmelden",
     "Registrierung + Login erfolgreich, Eintrag in Passkeys-Liste", chk, chk],
    ["8", "TOTP-Test: Testkonto anlegen per "
     + m("ykman oath accounts add -t Test JBSWY3DPEHPK3PXP"), "Code erscheint nach Berührung", chk, chk],
    ["9", "Sophos Central: Passkey YK-01 registrieren (8.2)", "Methode in »Manage MFA« gelistet", chk, chk],
    ["10", "Sophos Central: Passkey YK-02 (Ersatz) registrieren", "Zweite Methode gelistet", chk, chk],
    ["11", "Abmelden, Anmelden mit YK-01, dann mit YK-02", "Beide Logins erfolgreich", chk, chk],
    ["12", "Testeinträge aufräumen (webauthn.io-Passkey, OATH »Test« löschen)", "Nur produktive Einträge übrig", chk, chk],
], [0.05, 0.41, 0.34, 0.1, 0.1])
P("Getestet von: ______________________   Datum: ____________   Key-Seriennummern: ______________________", "small")

# =====================================================================
# ANHANG A QUELLEN
# =====================================================================
H1("Anhang A  Quellen (offizielle Dokumentation)")
P("Stand der Recherche: 25.09.2026. Primärquellen sind die Dokumentation und die Quelltexte von Yubico und "
  "Sophos. Die Menüpfade von Sophos Central wurden aus der Sophos-Dokumentation übernommen. Bitte beim ersten "
  "Durchlauf mit der tatsächlichen Oberfläche abgleichen (Testprotokoll Kapitel 12).", "small")
H3("Yubico")
BL([t + '<br/><font size="7" color="#5B6770">' + link(u) + "</font>" for t, u in [
    ("Yubico Authenticator – Produktseite", "https://www.yubico.com/products/yubico-authenticator/"),
    ("Yubico Authenticator – Benutzerhandbuch", "https://docs.yubico.com/software/yubikey/tools/authenticator/auth-guide/"),
    ("Yubico Authenticator – Releases", "https://developers.yubico.com/yubioath-flutter/Releases/"),
    ("Yubico Authenticator – GitHub", "https://github.com/Yubico/yubioath-flutter/releases"),
    ("YubiKey Manager CLI – Releases", "https://developers.yubico.com/yubikey-manager/Releases/"),
    ("ykman – Benutzerhandbuch", "https://docs.yubico.com/software/yubikey/tools/ykman/"),
    ("YubiKey Manager GUI – End-of-Life-Hinweis", "https://developers.yubico.com/yubikey-manager-qt/"),
    ("Software Signing (GPG-Schlüssel, Authenticode)", "https://developers.yubico.com/Software_Projects/Software_Signing.html"),
    ("YubiKey 5 Technical Manual", "https://docs.yubico.com/hardware/yubikey/yk-tech-manual/"),
    ("Firmware 5.7 – Neuerungen und Kapazitäten", "https://docs.yubico.com/hardware/yubikey/yk-tech-manual/yk5-firmware-5.7.html"),
    ("Understanding YubiKey PINs", "https://support.yubico.com/hc/en-us/articles/4402836718866-Understanding-YubiKey-PINs"),
    ("Resetting the FIDO2 application", "https://support.yubico.com/hc/en-us/articles/360016648899-Resetting-the-FIDO2-application-on-the-YubiKey"),
    ("How many accounts can I register my YubiKey with?", "https://support.yubico.com/hc/en-us/articles/360013790319-How-many-accounts-can-I-register-my-YubiKey-with"),
    ("Can I duplicate or back up a YubiKey?", "https://support.yubico.com/hc/en-us/articles/360016614880-Can-I-Duplicate-or-Back-Up-a-YubiKey-"),
    ("YubiKey firmware is not upgradable", "https://support.yubico.com/hc/en-us/articles/360013708760-YubiKey-firmware-is-not-upgradable"),
    ("Troubleshooting: required permissions (Windows/FIDO)", "https://support.yubico.com/hc/en-us/articles/360016648939-Troubleshooting-Failed-connecting-to-the-YubiKey-Make-sure-the-application-has-the-required-permissions"),
    ("Windows 11 24H2: FIDO-Verwaltung (behoben)", "https://support.yubico.com/hc/en-us/articles/21190316012444--resolved-Windows-Account-Management-in-Windows-11-24H2-Unable-to-manage-FIDO-application-on-Security-Key-YubiKey-or-YubiKey-Bio"),
    ("Smart Card Minidriver", "https://www.yubico.com/support/download/smart-card-drivers-tools/"),
    ("Yubico Login for Windows – Configuration Guide", "https://support.yubico.com/hc/en-us/articles/360013708460-Yubico-Login-for-Windows-Configuration-Guide"),
]])
H3("Sophos")
BL([t + '<br/><font size="7" color="#5B6770">' + link(u) + "</font>" for t, u in [
    ("Sophos Central – Modern Authentication (Übersicht)", "https://docs.sophos.com/central/customer/help/en-us/ManageYourAccount/ModernAuthentication/ModernAuthAbout/index.html"),
    ("Sophos Central – Passkeys", "https://docs.sophos.com/central/customer/help/en-us/ManageYourAccount/ModernAuthentication/ModernAuthPasskeys/index.html"),
    ("Sophos Central – Passkey einrichten", "https://docs.sophos.com/central/customer/help/en-us/ManageYourAccount/ModernAuthentication/ModernAuthSetUpPasskey/index.html"),
    ("Sophos Central – Zwei Methoden registrieren", "https://docs.sophos.com/central/customer/help/en-us/ManageYourAccount/ModernAuthentication/ModernAuthRegisterTwoMethods/index.html"),
    ("Sophos Central – Authenticator-App einrichten", "https://docs.sophos.com/central/customer/help/en-us/ManageYourAccount/ModernAuthentication/ModernAuthSetUpApp/index.html"),
    ("Sophos Central – MFA verwalten", "https://docs.sophos.com/central/customer/help/en-us/ManageYourAccount/ModernAuthentication/ModernAuthManage/index.html"),
    ("Sophos Central – MFA zurücksetzen", "https://docs.sophos.com/central/customer/help/en-us/ManageYourAccount/ModernAuthentication/ModernAuthReset/index.html"),
    ("Sophos Central Enterprise – MFA einrichten", "https://docs.sophos.com/central/enterprise/help/en-us/ManageYourAccount/MFA/SetupMFA/index.html"),
    ("Sophos Central Enterprise – Reset MFA", "https://docs.sophos.com/central/enterprise/help/en-us/GlobalSettings/AccessControl/AdminsandRoles/ResetMFA/index.html"),
    ("Sophos Central – Federated sign-in (IdP)", "https://docs.sophos.com/central/customer/help/en-us/ManageYourProducts/GlobalSettings/AccessControl/SignIn/FederatedIDP/index.html"),
    ("Sophos Community – Passkeys für Sophos Central", "https://community.sophos.com/sophos-central/b/blog/posts/coming-soon-passkey-authentication-for-sophos-central"),
    ("Sophos Community – Abkündigung SMS und E-Mail-PIN", "https://community.sophos.com/sophos-fusion/b/blog/posts/retiring-sms-and-email-pin-for-sophos-central-sign-ins"),
    ("Sophos Firewall – One-time password", "https://docs.sophos.com/nsg/sophos-firewall/21.5/Help/en-us/webhelp/onlinehelp/AdministratorHelp/Authentication/OneTimePassword/index.html"),
]])

# =====================================================================
# ANHANG B GLOSSAR
# =====================================================================
H1("Anhang B  Glossar")
TABLE([
    ["Begriff", "Erklärung"],
    ["2FA / MFA", "Zwei-/Mehr-Faktor-Authentifizierung: Anmeldung mit mindestens zwei unabhängigen Faktoren."],
    ["AAGUID", "Kennung des Authenticator-Modells, die ein Dienst bei FIDO2 sehen kann (z. B. »YubiKey 5 NFC«)."],
    ["CCID", "USB-Klasse für Smartcard-Leser; Transport für PIV, OATH, OpenPGP."],
    ["FIDO2 / WebAuthn / CTAP2", "Standards der FIDO Alliance und des W3C für phishing-resistente Anmeldung mit "
     "Public-Key-Kryptografie."],
    ["HID", "Human Interface Device, z. B. Tastatur. Über HID laufen OTP und FIDO."],
    ["OATH, TOTP, HOTP", "Offene Standards für Einmalpasswörter (zeitbasiert bzw. zählerbasiert)."],
    ["Passkey", "Auf einem Authenticator gespeicherte (auffindbare) FIDO2-Anmeldeinformation."],
    ["PIV", "Personal Identity Verification: Smartcard-Standard (NIST SP 800-73) für Zertifikate."],
    ["Relying Party (RP)", "Der Dienst, bei dem man sich anmeldet (z. B. sophos.com)."],
    ["Touch / User Presence", "Berührung der Kontaktfläche als Nachweis, dass ein Mensch anwesend ist."],
    ["User Verification (UV)", "Nachweis, <i>wer</i> den Key benutzt: FIDO2-PIN oder Fingerabdruck (Bio)."],
], [0.25, 0.75])

doc = Doc(OUT)
doc.multiBuild(story)
print("OK:", OUT)
