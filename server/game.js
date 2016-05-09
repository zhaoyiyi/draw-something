'use strict';

export default class Game {

  constructor() {
    this.answer = '';
    this._wordList = ['apple', 'elephant', 'cup', 'computer', 'house'];
    this._wordsGen = this._nextWord(this._wordList);
  }

  match(guess) {
    return this.answer.toLowerCase() === guess.toLowerCase();
  };

  newWord() {
    this.answer = this._wordsGen.next().value;
  };

  *_nextWord(list) {
    let index = 0;
    while (index < list.length) {
      yield list[index];
      index += 1;
      if (index === list.length) index = 0
    }
  };
}
