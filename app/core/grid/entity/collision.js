"use strict";

/**
 * Cubic collision
 * @param {Number} xx     Entity x
 * @param {Number} yy     Entity y
 * @param {Number} width  Entity width
 * @param {Number} height Entity height
 * @param {Number} x
 * @param {Number} y
 * @method cubicCollision
 * @return {Boolean}
 */
CORE.Grid.prototype.cubicCollision = function(xx, yy, width, height, x, y) {

  return (
    Math.abs(2 * (x - (this.x + (xx * this.scale))) + -(width * this.scale)) <= (width * this.scale) &&
    Math.abs(2 * (y - (this.y + (yy * this.scale))) + -(height * this.scale)) <= (height * this.scale)
  );

};

/**
 * Circular collision
 * @param {Number} xx     Entity x
 * @param {Number} yy     Entity y
 * @param {Number} width  Entity width
 * @param {Number} height Entity height
 * @param {Number} x
 * @param {Number} y
 * @method circularCollision
 * @return {Boolean}
 */
CORE.Grid.prototype.circularCollision = function(xx, yy, width, height, x, y) {

  var radius = this.sizeToRadius(width, height);

  var sX = this.square(x, this.x + (xx * this.scale)) * (PI_2);
  var sY = this.square(y, this.y + (yy * this.scale)) * (PI_2);

  return (
    Math.sqrt(sX + sY) - (radius * this.scale) <= 0
  );

};