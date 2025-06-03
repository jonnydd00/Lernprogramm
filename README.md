# Lernprogramm

## Projektbeschreibung
Ein webbasiertes Quiz-Lernprogramm, umgesetzt als Progressive Web App (PWA) mit Model-View-Presenter-Architektur. Nutzer können Fragen aus verschiedenen Kategorien beantworten und ihren Fortschritt sehen.

---

## Entwicklungsfortschritte

**Stand: 28.05.–02.06.**
- Zunächst das HTML-Gerüst mit dem Button „Mathe“ implementiert.
- Mit CSS die Oberfläche und Buttons gestaltet.
- Die JavaScript-Programmstruktur nach dem Model-View-Presenter-Prinzip erstellt.
- Funktionen zum Laden der Aufgaben und zur Übergabe der gewählten Lösung implementiert.
- In der Datei `fragen2.json` im Verzeichnis `data` sind zunächst Fragen zu Mathe enthalten.
- Lernprogramm auf dem HTW-Server abgelegt und getestet: Fragen können über den Button „Mathe“ abgerufen werden.

**Stand: 03.06.**
- Erweiterung um zwei weitere Buttons „Web“ und „Allgemein“.
- Hinzufügen von Fragen und Antworten in der `fragen.json`-Datei.
- **Problem:** Beim Ausführen der neuen Buttons wurden keine Fragen gefunden, obwohl die Datei mehrfach per hartem Reset neu geladen wurde.
- **Lösung:** Erst nachdem ich die Datei umbenannt und den Link in der Klasse `model` angepasst habe, funktionierte die Auswahl über die Buttons.

---

## Probleme & Lösungen

- **Problem:** Kategorien „Web“ und „Allgemein“ wurden nicht angezeigt.
  - **Ursache:** Alte Version der Fragen-Datei wurde vom Server oder Browser gecacht.
  - **Lösung:** Datei umbenannt und Pfad im Code angepasst, danach funktionierte alles wie gewünscht.

---

## Nächste Schritte

- Einbindung externer Quiz-Aufgaben über den Server.
- Weitere optische Verbesserungen und Animationen.
- Implementierung von Service Worker und Manifest für vollständige PWA-Funktionalität.

---
