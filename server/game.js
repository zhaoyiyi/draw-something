'use strict';

export default class Game {

  constructor() {
    this.answer = '';
    this.drawer = {};
    this._wordList = ['apple', 'elephant', 'cup', 'computer', 'house'];
    this._wordsGen = this._nextWord(this._wordList);
    this._TIME = 30000;
  }

  end() {
    this.isPlaying = false;
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

  match(guess) {
    return this.answer.toLowerCase() === guess.toLowerCase();
  };

  newWord() {
    this.answer = this._wordsGen.next().value;
  };

  start(io) {
    this.newWord();
    this.isPlaying = true;
    this._gameTimeout(io);
  }

  _gameTimeout(io) {
    this.timeout = setTimeout( () => {
      io.emit('game:end', {message: `Answer is ${this.answer}`})
    }, this._TIME);

    let time = this._TIME / 1000 - 1;
    this.interval = setInterval( () => {
      io.emit('game:timeLeft', time);
      time = time - 1;
    }, 1000);
  }

  *_nextWord(list) {
    let index = 0;
    while (index < list.length) {
      yield list[index];
      index += 1;
      if (index === list.length) index = 0
    }
  };
}
