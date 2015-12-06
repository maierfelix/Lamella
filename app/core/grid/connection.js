"use strict";

/**
 * Draw a curve
 * @param {Number}  x1
 * @param {Number}  y1
 * @param {Number}  x2
 * @param {Number}  y2
 * @method drawCurve
 */
CORE.Grid.prototype.drawCurve = function(x1, y1, x2, y2) {

  x1 = ((x1 * this.scale) + this.x) << 0;
  y1 = ((y1 * this.scale) + this.y) << 0;

  x2 = ((x2 * this.scale) + this.x) << 0;
  y2 = ((y2 * this.scale) + this.y) << 0;

  if (!this.curveInView(x1, y1, x2, y2, this.scale)) {
    return void 0;
  }

  this.mainContext.moveTo(x1, y1);
  this.mainContext.lineTo(x2, y2);

  return void 0;

};