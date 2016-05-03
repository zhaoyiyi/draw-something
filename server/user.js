"use strict";

let User = function(id) {
  this.id = id;
  this.name = '';
  this.isReady = false;
  this.score = 0;
};


module.exports = User;