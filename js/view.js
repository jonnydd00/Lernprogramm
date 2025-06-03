export class QuizView {
  constructor(root) {
    // Root verweist auf das <main class="container">
    this.root         = root;

    // 1. Kategorie-Auswahl-Section und Buttons
    this.catSection   = document.getElementById('category-selection');
    this.categoriesEl = document.getElementById('categories');

    // 2. Quiz-Section (anfangs versteckt)
    this.quizSection  = document.getElementById('quiz');
    this.qEl          = this.quizSection.querySelector('#question');
    this.answersEl    = this.quizSection.querySelector('#answers');
    this.progressEl   = this.quizSection.querySelector('.progressbar__fill');
  }

  /**
   * Binde Klick-Handler auf Kategorie-Buttons.
   * callback erhält den Kategorienamen ("mathe", "web", "allgemein").
   */
  bindCategorySelection(callback) {
    this.categoriesEl.addEventListener('click', e => {
      if (e.target.matches('.category-btn')) {
        const category = e.target.getAttribute('data-cat');
        callback(category);
      }
    });
  }

  /**
   * Blendet die Kategorie-Auswahl aus und zeigt den Quiz-Bereich an.
   */
  showQuizScreen() {
    this.catSection.classList.add('hidden');
    this.quizSection.classList.remove('hidden');
  }

  /**
   * Binde Klick-Handler auf Antwort-Buttons.
   */
  bindAnswer(handler) {
    this.answersEl.addEventListener('click', e => {
      if (e.target.matches('.answer-btn')) {
        handler(e.target.textContent);
      }
    });
  }

  /**
   * Zeigt eine Frage an: setzt Frage-Text und generiert vier Antwort-Buttons.
   * @param {{a: string, l: string[]}} q - Ein Frage-Objekt mit Feld a (Aufgabe) und l (Antworten)
   */
  showQuestion(q) {
    this.qEl.textContent = `Was ist die Lösung aus: ${q.a} ?`;
    const answers = this._shuffle(q.l);
    this.answersEl.innerHTML = answers
      .map(a => `<button class="answer-btn">${a}</button>`)
      .join('');
  }

  /**
   * Zeigt Feedback (grün für korrekt, rot für falsch).
   * @param {boolean} correct
   */
  showResult(correct) {
    this.quizSection.classList.add(correct ? 'correct' : 'wrong');
    setTimeout(() => this.quizSection.classList.remove('correct', 'wrong'), 500);
  }

  /**
   * Aktualisiert die Progressbar-Breite.
   * @param {{current: number, total: number}} progress
   */
  updateProgress({ current, total }) {
    this.progressEl.style.width = `${(current / total) * 100}%`;
  }

  /**
   * Zeigt das Ende des Quiz und die Statistik.
   * @param {number} score - Anzahl richtiger Antworten
   * @param {number} total - Gesamtzahl der Fragen
   */
  showSummary(score, total) {
    this.quizSection.innerHTML = `
      <h2>Quiz beendet</h2>
      <p>Du hast ${score} von ${total} richtig beantwortet.</p>
    `;
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

