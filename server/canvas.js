'use strict';
let paper = require('paper');

let Canvas = function() {
  this.canvas = paper.setup(new paper.Canvas(500, 500));
};

Canvas.prototype.clear = function () {
  this.canvas.project.clear();
};
Canvas.prototype.mouseDown = function (x, y) {
  this.path = new this.canvas.Path();
  this.path.add(new this.canvas.Point(x, y));
  this.path.strokeColor = 'black';
};
Canvas.prototype.mouseDrag = function (x, y) {
  this.path.add(new this.canvas.Point(x, y));
};
Canvas.prototype.exportJSON = function () {
  return this.canvas.project.exportJSON();
};

module.exports = Canvas;