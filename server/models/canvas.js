'use strict';
import paper from 'paper';

export default class Canvas {

  constructor() {
    this.canvas = paper.setup(new paper.Canvas(500, 500));
    this.path = {};
  }

  clear() {
    this.canvas.project.clear();
  }
  mouseDown(x, y) {
    this.path = new this.canvas.Path();
    this.path.add(new this.canvas.Point(x, y));
    this.path.strokeColor = 'black';
  }
  mouseDrag(x, y) {
    this.path.add(new this.canvas.Point(x, y));
  }
  exportJSON() {
    return this.canvas.project.exportJSON();
  }
}

