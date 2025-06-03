import { QuizModel }     from './model.js';
import { QuizView }      from './view.js';
import { QuizPresenter } from './presenter.js';

document.addEventListener('DOMContentLoaded', () => {
  const root  = document.querySelector('main.container');
  const model = new QuizModel();
  const view  = new QuizView(root);
  new QuizPresenter(model, view);
});
