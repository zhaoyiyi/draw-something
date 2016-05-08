'use strict';

let Game = function () {
  this.answer = '';
  this._wordList = ['apple', 'elephant', 'cup', 'computer', 'house'];
  this._wordsGen = this._nextWord(this._wordList);
};

Game.prototype.match = function(guess) {
  return this.answer.toLowerCase() === guess.toLowerCase();
};
Game.prototype.newWord = function () {
  this.answer = this._wordsGen.next().value;
};

Game.prototype._nextWord = function* (list) {
  let index = 0;
  while (index < list.length) {
    yield list[index];
    index += 1;
    if (index === list.length) index = 0
  }
};

module.exports = Game;