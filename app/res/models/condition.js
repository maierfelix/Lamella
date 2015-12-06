"use strict";

/**
 * Condition
 * @class Condition
 * @constructor
 */
function Condition() {

  /**
   * Collision type
   * @type {String}
   * @default Cubic
   */
  this.collisionType = "Cubic";

  /**
   * Main context pointer
   * @type {Object}
   */
  this.context = void 0;

};

Condition.prototype.constructor = Condition;

/**
 * Draw buffered model
 * @param {Object} buffer
 * @param {Object} entity
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @method update
 */
Condition.prototype.update = function(buffer, entity, x, y, width, height) {

  this.context.drawImage(
    buffer.canvas,
    x, y
  );

  return void 0;

};

/**
 * Draw model
 * @param {Object} ctx
 * @param {Object} entity
 * @param {Number} x
 * @param {Number} y
 * @param {Number} scale
 * @method draw
 */
Condition.prototype.draw = function(ctx, entity, x, y, scale) {

  var width  = entity.width;
  var height = entity.height;

  ctx.fillStyle = entity.color;

  if (entity.scalable === void 0 || entity.scalable === true) {
    width *= scale;
    height *= scale;
  }

  ctx.fillRect(
    0, 0,
    width, height
  );

  return void 0;

};

LAMELLA.models.Condition = Condition;