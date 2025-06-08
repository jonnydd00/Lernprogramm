# Webbasiertes Lernprogramm (PWA)

Dieses Projekt ist ein webbasiertes Lernprogramm als Progressive Web App (PWA). Ziel war es, die im Kurs "Internettechnologien" erlernten Techniken praktisch anzuwenden und eine interaktive Quiz-App zu realisieren.

---

## Implementierte Funktionen

1. **Aufgabenkategorien**
  - **Lokal gespeicherte Kategorien**:
    - "Allgemein" (z.B Geschichte, Allgemeinwissen)
    - "Mathe" (Mathematikaufgaben, gerendert als Text)
    - "Web" (Fragen zu HTTP, REST, Protokollen)
  - **Remote-Kategorie**:
    - Laden von Fragen & Überprüfung via AJAX/REST-API (Web-Quiz-Server)
    - Dynamisches Nachladen von Aufgaben 

2. **Quiz-Mechanik** 
  - Zufällige Auswahl einer Aufgabe und Mischen der vier Antwortoptionen 
  - Fortschrittanzeige mittels Progessbar nach jeder Antwort
  (- Ergebnis-Feedback: kurzzeitig grüne oder rote Einfärbung des Quiz-Containers) hat Stand jetzt nicht funktioniert
  - Zusammenfassende Statistik am Ende: "x von y richtig"

3. **PWA-Grundlage**
  - **Manifest** mit App-Namen, Icons und Start-URL
  - **Service Worker** für Caching aller statistischen Ressourcen und Offline-Betrieb
  - Installation der Webapp auf Desktop und Mobilen Geräten

4. **Responsives Design**
  - Anpassung an verschiedene Bilschirmgrößen (Desktop, Smartphone)
  - Flexibles Grid-Layout für Kategorie- und Antwort-Buttons
  - Media-Queries für kompaktere Darstellung auf kleinen Displays

5. **Technische Details** 
  - **HTML5/CSS3/ES6+** im strikten Modus ("use strict")
  - **Model-View-Presenter**-Architektur
  - JSON-Datenformat lokal und serverseitig
  - AJAX mit **XMLHttpRequest** (Eigenbau-Helper `_xhrGet` und `_xhrPost`)  
  - Basic-Auth-Header für Remote-API  
  - Modulares JavaScript (ES Modules)  
  - Keine externen Frameworks (jQuery, Bootstrap o. Ä.)
  
6. **Genutzte Hilfsmittel**  
   - **ChatGPT (OpenAI, GPT-4, Juni 2025)**  
     Prompt-basiertes Refactoring, Debugging-Hinweise und Teile der Dokumentation generiert.  
   - **GitHub Copilot (v1.85.0)**  
     Code-Vervollständigungen, Boilerplate-Generierung und Vorschläge im Editor.

  ---

  ## Probleme und Herausforderungen

  1. **Shuffle vs. erkennung der richtigen Antwort**
  - Beim Mischen der Antwort-Buttons war das Erkennen der korrekten Option schwierig.
  - Abhilfe durch explizites Zwischenspeichern der aktuellen Frage im Presenter un Vergleiche mit dem ersten Eintrag im Array.

 2. **Service Worker Caching**
 - Beim Entwickeln führte aggressive Cache-Nutzung immer wieder dazu, dass neue Skripte nicht geladen wurden.
 - Gefixt durch Versionierung des Cache-Names und sauberes Invaliedieren alter Caches.

 3. **Responsive Progressbar**m
 - Die Progressbar hatte auf schmalen Bildschirmen ein Pixel-Stottern.
 - Mit 'transition: width 0.3s' und flexiblen Einheiten (Prozenten)  glättete sich die Animation.

 4.**Remote-API Interaktion**
 - Unterschiedliche JSON-Formate lokal vs. remote erforderten bedingte Presenter-Logik ('isRemote'-Flag).

 ## Ausblick 

 - **Notenlernen**-Kategorie mit VexFlow-Notation, virtuellem Keyboard und Web Audio API.
 - Integration weiterer JS-Bibliotheken (z.B. KaTeX für Formeln).

 -> zeitlich leider nicht weitergekommen

 ---

