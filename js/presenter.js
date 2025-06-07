export class QuizPresenter {
  constructor(model, view) {
    this.model = model;
    this.view  = view;

    // Kategorie-Auswahl binden
    this.view.bindCategorySelection(this.handleCategory.bind(this));
    // Zurück-Button binden
    this.view.bindBack(this.handleBack.bind(this));
    // merkt sich die zuletzt gewählte Kategorie
    this.currentCategory = null;

  }

  async handleCategory(category) {

    this.currentCategory = category;
    // Quiz-Screen anzeigen und Antwort-Handler binden
    this.view.showQuizScreen();
    this.view.bindAnswer(this.handleAnswer.bind(this));

    // Fragen laden (remote oder lokal)
    if (category === 'remote') {
      await this.model.loadRemoteList();
      this.total = this.model.remoteList.length;
    } else {
      await this.model.loadLocalQuestions(category);
      this.total = this.model.questions.length;
    }

    this.next();
  }

  next() {
    const q = this.model.getNext();

    if (this.model.isRemote) {
      this.view.showQuestionRemote(q);
    } else {
      this.view.showQuestion(q);
    }
    this.view.updateProgress(this.model.getProgress());
  }

  async handleAnswer(answerText) {
    const correct = await this.model.check(answerText);
    this.view.showResult(correct, answerText);

  //Nächste Frage oder Zusammenfassung anzeigen
   if (this.model.hasMore()) {
      this.next();
    } else {
      this.view.showSummary(this.model.getScore(), this.total);
    }
  }

  handleBack() {
    window.location.reload();
  }
}
