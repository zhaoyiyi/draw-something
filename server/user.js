"use strict";

export default class User {
  constructor(id) {
    this._IMG_NUM = 9;

    this.id = id;
    this.name = '';
    this.isReady = false;
    this.score = 0;
    this.imageId = this._newImage();
  }

  _newImage() {
    let id = this._randomImageId();
    if (this.usedImage.indexOf(id) !== -1 &&
        this.usedImage.length <= this._IMG_NUM) {

      return this._newImage();
    }
    this.usedImage.push(id);
    return id;
  }

  _randomImageId() {
    return Math.floor(Math.random() * this._IMG_NUM) + 1
  }
};

User.prototype.usedImage = [];