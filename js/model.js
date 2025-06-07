// js/model.js

/**
 * Hilfsfunktion zum Erzeugen des Basic-Auth-Headers.
 * Gibt z.B. "Basic czg3NTQ3OmdlaGVpbQ==" zurück.
 */
function generateBasicAuthHeader(username, password) {
  return "Basic " + btoa(username + ":" + password);
}

export class QuizModel {
  constructor() {
    
    this.remoteUser = "s87547@htw-dresden.de";  
    this.remotePass = "9HzT8+!rxN";            

    this.questions = [];     // Lokaler Modus
    this.remoteList = [];    // Remote-Modus (Web-Quiz)
    this.currentIndex = 0;
    this.score = 0;
    this.isRemote = false;   // Schalter: Lokal vs. Remote
  }

  /*** 1) Lokaler Modus: Fragen aus lokaler JSON-Datei laden ***/
  async loadLocalQuestions(category = 'mathe') {
    try {
      const data = await this._xhrGet(
        'https://www.informatik.htw-dresden.de/~s87547/Lernprogramm/data/fragen2.json'
      );
      this.questions = this._shuffle(data[category] || []);
    } catch (err) {
      console.error('Fehler beim Laden der lokalen Fragen:', err);
      this.questions = [];
    }
    this.currentIndex = 0;
    this.score = 0;
    this.isRemote = false;
  }

  /*** 2) REMOTE-Modus: Seite 0 aller Quizze vom Server holen ***/
  async loadRemoteList() {
    this.currentIndex = 0;
    this.score = 0;
    this.isRemote = true;

    // Basis-URL des Web-Quiz-Servers per HTTPS
    const baseUrl = 'https://idefix.informatik.htw-dresden.de:8888/api';
    // Wir holen Seite 0 (pageNumber = 0) mit allen Quizzen
    const url = `${baseUrl}/quizzes?pages=0`;

    console.log('[Model] (remote) GET:', url);

    try {
      // XHR-GET mit Basic Auth
      const data = await this._xhrGet(url, this.remoteUser, this.remotePass);
      console.log('[Model] Remote-Rohdaten erhalten:', data);

      // Der Web-Quiz-Server liefert ein Objekt mit Pagination:
      // { content: [ {id, title, text, options}, … ], totalPages: …, … }
      // Wir extrahieren hier nur das content-Array
      const quizArray = Array.isArray(data.content) ? data.content : [];
      this.remoteList = this._shuffle(quizArray);
    } catch (err) {
      console.error('Fehler beim Laden der Remote-Quiz-Liste:', err);
      this.remoteList = [];
    }
  }

  /*** 3) REMOTE: Nächste Aufgabe aus dem Array ausliefern ***/
  getNextRemote() {
    return this.remoteList[this.currentIndex++];
  }

  /*** 4) REMOTE: Antwort per POST an /quizzes/{id}/solve senden ***/
  async checkRemoteAnswer(id, answerIdx) {
    const baseUrl = 'https://idefix.informatik.htw-dresden.de:8888/api';
    const url     = `${baseUrl}/quizzes/${encodeURIComponent(id)}/solve`;

    console.log('[Model] (remote) POST:', url, 'mit Body:', answerIdx);

    try {
      const result = await this._xhrPost(
        url,
        answerIdx,
        this.remoteUser,
        this.remotePass
      );
      // Erwartet: { success: true|false, feedback: "…" }
      if (result.success) {
        this.score++;
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Fehler beim Prüfen der Remote-Antwort:', err);
      return false;
    }
  }

  /*** 5) getNext: Je nach Modus weiterleiten ***/
  getNext() {
    if (this.isRemote) {
      return this.getNextRemote();
    } else {
      return this.questions[this.currentIndex++];
    }
  }

  /*** 6) check(answerText): Je nach Modus den jeweiligen Prüfer aufrufen ***/
  async check(answerText) {
    if (this.isRemote) {
      const currentQuiz = this.remoteList[this.currentIndex - 1];
      const idx = currentQuiz.options.indexOf(answerText);
      if (idx < 0) {
        console.warn('Antwort nicht gefunden in Optionen:', answerText);
        return false;
      }
      return await this.checkRemoteAnswer(currentQuiz.id, [idx]);
    } else {
      const correct = this.questions[this.currentIndex - 1].l[0] === answerText;
      if (correct) this.score++;
      return correct;
    }
  }

  /*** 7) hasMore: Prüfen, ob noch Fragen übrig sind ***/
  hasMore() {
    if (this.isRemote) {
      return this.currentIndex < this.remoteList.length;
    } else {
      return this.currentIndex < this.questions.length;
    }
  }

  /*** 8) getProgress: Fortschritt abrufen ***/
  getProgress() {
    if (this.isRemote) {
      return { current: this.currentIndex, total: this.remoteList.length };
    } else {
      return { current: this.currentIndex, total: this.questions.length };
    }
  }

  /*** 9) getScore: aktuellen Punktestand abrufen ***/
  getScore() {
    return this.score;
  }

  /*** 10) Helper: XHR-GET (JSON) mit optionalem Basic-Auth-Header ***/
  _xhrGet(url, username, password) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';

      // Authorization-Header setzen, wenn Credentials übergeben wurden
      if (username && password) {
        xhr.setRequestHeader(
          "Authorization",
          generateBasicAuthHeader(username, password)
        );
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`GET ${url} fehlgeschlagen: Status ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error(`GET ${url} Netzwerkfehler`));
      xhr.send();
    });
  }

  /*** 11) Helper: XHR-POST (JSON) mit optionalem Basic-Auth-Header ***/
  _xhrPost(url, bodyObj, username, password) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.setRequestHeader('Content-Type', 'application/json');

      if (username && password) {
        xhr.setRequestHeader(
          "Authorization",
          generateBasicAuthHeader(username, password)
        );
      }

      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`POST ${url} fehlgeschlagen: Status ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error(`POST ${url} Netzwerkfehler`));
      xhr.send(JSON.stringify(bodyObj));
    });
  }

  /*** 12) Helper: Array mischen (Fisher-Yates) ***/
  _shuffle(arr) {
    return arr
      .map(v => [Math.random(), v])
      .sort((a, b) => a[0] - b[0])
      .map(v => v[1]);
  }
}

