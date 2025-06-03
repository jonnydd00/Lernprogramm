export class QuizPresenter {
  constructor(model, view) {
    this.model = model;
    this.view  = view;

    // 1. Binde Kategorie-Auswahl (erstes Verhalten)
    this.view.bindCategorySelection(this.handleCategory.bind(this));
  }

  /**
   * Wird aufgerufen, wenn der Benutzer eine Kategorie gewählt hat.
   * @param {string} category - "mathe", "web" oder "allgemein"
   */
  async handleCategory(category) {
    // 1. Quiz-Screen anzeigen
    this.view.showQuizScreen();

    // 2. Antworten-Handler erst jetzt aktivieren
    this.view.bindAnswer(this.handleAnswer.bind(this));

    // 3. Fragen aus Model laden (für die gewählte Kategorie)
    await this.model.loadQuestions(category);
    this.total = this.model.questions.length;

    // 4. Erste Frage anzeigen
    this.next();
  }

  /**
   * Holt die nächste Frage vom Model und zeigt sie in der View.
   */
  next() {
    const q = this.model.getNext();
    this.view.showQuestion(q);
    this.view.updateProgress(this.model.getProgress());
  }

  /**
   * Wird aufgerufen, wenn der Benutzer eine Antwort wählt.
   * @param {string} answer - Der Text der angeklickten Antwort
   */
  handleAnswer(answer) {
    const correct = this.model.check(answer);
    this.view.showResult(correct);

    if (this.model.hasMore()) {
      this.next();
    } else {
      this.view.showSummary(this.model.getScore(), this.total);
    }
  }
}
