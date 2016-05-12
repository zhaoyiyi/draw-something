'use strict';

export class Game {

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

  start(endCb) {
    this.newWord();
    this.isPlaying = true;
    this._gameTimeout(endCb);
  }

  _gameTimeout(endCb) {
    this.timeout = setTimeout( () => {
      endCb();
    }, this._TIME);
    
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

let game;

export let GameInstance = (function () {
  return function () {
    if (!game) game = new Game();
    return game;
  }
})();