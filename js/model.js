export class QuizModel {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
  }

  /**
   * Lädt die JSON-Datei komplett und mischt anschließend nur die gewählte Kategorie.
   * @param {string} category - Der Schlüssel in fragen.json (z.B. "mathe", "web", "allgemein")
   */
  // … Konstruktor unverändert …

  async loadQuestions(category = 'mathe') {
    console.log(`[Model] loadQuestions aufgerufen für Kategorie: "${category}"`);
    try {
      const res = await fetch(
        'https://www.informatik.htw-dresden.de/~s87547/Lernprogramm/data/fragen2.json'
      );
      console.log('[Model] fetch Status:', res.status);

      if (!res.ok) {
        throw new Error(`HTTP-Fehler: ${res.status}`);
      }

      const data = await res.json();
      console.log('[Model] JSON geladen, keys:', Object.keys(data));

      // Prüfen, ob data[category] überhaupt existiert
      if (!(category in data)) {
        console.warn(`[Model] data["${category}"] ist undefined! Möglicher Tippfehler im JSON-Key oder im data-cat-Attribut.`);
      } else {
        console.log(`[Model] data["${category}"] gefunden:`, data[category]);
      }

      this.questions = this._shuffle(data[category] || []);
      console.log('[Model] Fragen nach Shuffle:', this.questions);

      this.currentIndex = 0;
      this.score = 0;
    } catch (err) {
      console.error('[Model] Fehler beim Laden der Fragen:', err);
      // Damit model.questions nicht undefiniert bleibt, setze es wenigstens auf leeres Array:
      this.questions = [];
      this.currentIndex = 0;
      this.score = 0;
    }
  

  // … restliche Methoden unverändert …
}

  /**
   * Gibt die nächste Frage zurück (oder undefined, wenn nichts mehr da ist).
   */
  getNext() {
    return this.questions[this.currentIndex++];
  }

  /**
   * Prüft, ob eine Antwort korrekt ist und erhöht den Score gegebenenfalls.
   * @param {string} answer - Der angeklickte Antworttext
   * @returns {boolean} true, wenn korrekt, sonst false
   */
  check(answer) {
    const correct = this.questions[this.currentIndex - 1].l[0] === answer;
    if (correct) this.score++;
    return correct;
  }

  /**
   * Gibt zurück, ob noch weitere Fragen vorhanden sind.
   */
  hasMore() {
    return this.currentIndex < this.questions.length;
  }

  /**
   * Liefert ein Objekt mit aktuellem Index und Gesamtzahl für die Progressbar.
   */
  getProgress() {
    return {
      current: this.currentIndex,
      total: this.questions.length
    };
  }

  /**
   * Gibt den aktuellen Score zurück.
   */
  getScore() {
    return this.score;
  }

  /**
   * Hilfsfunktion: mischt ein Array zufällig.
   */
  _shuffle(arr) {
    return arr
      .map(v => [Math.random(), v])
      .sort((a, b) => a[0] - b[0])
      .map(v => v[1]);
  }
}
