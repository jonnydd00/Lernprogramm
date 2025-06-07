export class QuizView {
  constructor(root) {
    this.root             = root;
    this.catSection       = document.getElementById('category-selection');
    this.categoriesEl     = document.getElementById('categories');

    this.quizSection      = document.getElementById('quiz');
    this.qEl              = this.quizSection.querySelector('#question');
    this.answersEl        = this.quizSection.querySelector('#answers');
    this.progressEl       = this.quizSection.querySelector('.progressbar__fill');

    this.summarySection   = document.getElementById('summary');
    this.summaryContent   = document.getElementById('summary-content');
    this.backBtn          = this.summarySection.querySelector('#back-btn');
  }

  /** Kategorie-Auswahl binden */
  bindCategorySelection(callback) {
    this.categoriesEl.addEventListener('click', e => {
      if (e.target.matches('.category-btn')) {
        callback(e.target.dataset.cat);
      }
    });
  }

  /** Antwort-Buttons binden */
  bindAnswer(callback) {
    this.answersEl.addEventListener('click', e => {
      if (e.target.matches('.answer-btn')) {
        callback(e.target.textContent);
      }
    });
  }

  /** Zurück-Button binden */
  bindBack(callback) {
    if (!this.backBtn) return;
      this.backBtn.addEventListener('click', () => callback());
    
  }

  /** Anzeige Kategorie-Auswahl */
  showCategorySelection() {
    this.quizSection.classList.add('hidden');
    this.summarySection.classList.add('hidden');
    this.catSection.classList.remove('hidden');
  }

  /** Anzeige Quiz-Screen */
  showQuizScreen() {
    this.catSection.classList.add('hidden');
    this.summarySection.classList.add('hidden');
    this.quizSection.classList.remove('hidden');
  }

  /** Lokale Frage anzeigen */
  showQuestion(q) {
    this.qEl.textContent = ` ${q.a}`;
    const answers = this._shuffle(q.l);
    this.answersEl.innerHTML = answers
      .map(a => `<button class="answer-btn">${a}</button>`)
      .join('');
  }

  /** Remote-Frage anzeigen */
  showQuestionRemote(q) {
    this.qEl.textContent = q.text;
    const answers = this._shuffle(q.options);
    this.answersEl.innerHTML = answers
      .map(a => `<button class="answer-btn">${a}</button>`)
      .join('');
  }

  showResult(correct, answerText) {
  const buttons = this.answersEl.querySelectorAll('.answer-btn');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === answerText) {
      btn.classList.add(correct ? 'correct' : 'wrong');
      setTimeout(() => btn.classList.remove('correct', 'wrong'), 800);
    }
  });
}

  /** Fortschrittsbalken aktualisieren */
  updateProgress({ current, total }) {
    this.progressEl.style.width = `${(current / total) * 100}%`;
  }

  /** Zusammenfassung anzeigen */
  showSummary(score, total) {
    this.catSection.classList.add('hidden');
    this.quizSection.classList.add('hidden');
    this.summarySection.classList.remove('hidden');
    this.summaryContent.innerHTML = `
      <h2>Quiz beendet</h2>
      <p>Du hast ${score} von ${total} richtig beantwortet.</p>
    `;
  }

  /** Hilfsfunktion zum Mischen */
  _shuffle(arr) {
    return arr
      .map(v => [Math.random(), v])
      .sort((a, b) => a[0] - b[0])
      .map(v => v[1]);
  }
}


