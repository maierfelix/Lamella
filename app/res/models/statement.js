"use strict";

/**
 * Statement
 * @class Statement
 * @constructor
 */
function Statement() {

  /**
   * Collision type
   * @type {String}
   * @default Circular
   */
  this.collisionType = "Circular";

  /**
   * Main context pointer
   * @type {Object}
   */
  this.context = void 0;

};

Statement.prototype.constructor = Statement;

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
Statement.prototype.update = function(buffer, entity, x, y, width, height) {

  this.context.drawImage(
    buffer.canvas,
    x - width, y - height
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
Statement.prototype.draw = function(ctx, entity, x, y, scale) {

  x = ctx.canvas.width;
  y = ctx.canvas.height;

  ctx.canvas.width *= 2;
  ctx.canvas.height *= 2;

  var radius = this.parent.sizeToRadius(entity.width, entity.height);

  if (entity.scalable === void 0 || entity.scalable === true) {
    radius *= scale;
    radius = radius << 0;
  }

  ctx.lineWidth = entity.width / 2;

  ctx.beginPath();

  ctx.arc(
    x, y,
    radius,
    0,
    PI2,
    false
  );

  ctx.strokeStyle = entity.color;
  ctx.stroke();

  return void 0;

};

LAMELLA.models.Statement = Statement;