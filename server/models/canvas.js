'use strict';
const paper = require('paper-jsdom-canvas');

class Canvas {

  constructor() {
    this.canvas = paper.setup(new paper.Canvas(500, 500));
    this.path = {};
    this.strokeColor = '#000000';
    this.strokeWidth = 3;
  }

  clear() {
    this.canvas.project.clear();
  }
  mouseDown(x, y) {
    this._setPath({point: new this.canvas.Point(x, y)})
  }
  mouseDrag(x, y) {
    this.path.add(new this.canvas.Point(x, y));
  }
  exportJSON() {
    return this.canvas.project.exportJSON();
  }

  _setPath(event) {
    this.path = new this.canvas.Path();
    this.path.strokeColor = this.strokeColor;
    this.path.strokeWidth = this.strokeWidth;
    this.path.strokeCap = 'round';
    this.path.strokeJoin = 'round';

    this.path.add(event.point);
  }
}

let canvas;

exports.CanvasInstance = (function () {
  return function () {
    if (!canvas) canvas = new Canvas();
    return canvas;
  }
})();

exports.Canvas = Canvas;

