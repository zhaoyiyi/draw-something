"use strict";

let User = function(id) {
  this.id = id;
  this.name = '';
  this.isReady = false;
  this.score = 0;
  this.imageId = Math.floor(Math.random() * 9) + 1;
};

export default User;