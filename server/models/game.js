'use strict';
const _ = require('lodash');

class Game {

  constructor() {
    this.answer = '';
    this.drawer = {};
    this.useList = 'regular';
    this._wordList = {
      regular: [
        'apple', 'elephant', 'cup', 'computer', 'house', 'bread', 'brain',
        'bug', 'duck', 'soccer', 'baseball', 'mario', 'star', 'sheep'
      ],
      dev: [
        'angular', 'nodejs', 'jquery', 'wordpresss', 'react', 'bootstrap', 'ruby',
        'rails'
      ]
    };
    this._wordsGen = this.createGenerator(this._wordList);
    this._TIME = 60000;
  }

  end() {
    this.isPlaying = false;
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }
  
  createGenerator(words) {
    return Object.keys(words).reduce((acc, curr) => {
      acc[curr] = this._nextWord(words[curr]);
      return acc;
    }, {});
  }

  match(guess) {
    return this.answer.toLowerCase() === guess.toLowerCase();
  };

  newWord() {
    console.log(this.useList);
    this.answer = this._wordsGen[this.useList].next().value;
  };

  start(endCb) {
    this.newWord();
    this.isPlaying = true;
    this._gameTimeout(endCb);
  }

  _gameTimeout(endCb) {
    this.timeout = setTimeout(() => {
      endCb();
    }, this._TIME);

  }

  *_nextWord(list) {
    let index = 0;
    const wordList = _.shuffle(list);
    console.log(wordList);
    while (index < wordList.length) {
      yield wordList[index];
      index += 1;
      if (index === wordList.length) index = 0;
    }
  };
}

let game;
exports.Game = Game;
exports.GameInstance = (function () {
  return function () {
    if (!game) game = new Game();
    return game;
  }
})();