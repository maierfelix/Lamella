"use strict";

/**
 * Event
 * @class Event
 * @constructor
 */
function Event() {

  /**
   * Collision type
   * @type {String}
   * @default Circular
   */
  this.collisionType = "Circular";

  /**
   * Anchor amount
   * @type {Number}
   */
  this.anchors = 6;

  /**
   * Main context pointer
   * @type {Object}
   */
  this.context = void 0;

};

Event.prototype.constructor = Event;

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
Event.prototype.update = function(buffer, entity, x, y, width, height) {

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
Event.prototype.draw = function(ctx, entity, x, y, scale) {

  x = ctx.canvas.width;
  y = ctx.canvas.height;

  ctx.canvas.width  *= 2;
  ctx.canvas.height *= 2;

  var radius = (entity.width, entity.height);

  radius -= this.parent.sizeToRadius(this.parent.config.cellSize.x, this.parent.config.cellSize.y) / 4.5;

  if (entity.scalable === void 0 || entity.scalable === true) {
    radius *= scale;
    radius = radius << 0;
  }

  ctx.lineWidth = (4.5 * scale) << 0;

  ctx.fillStyle = entity.color;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.5, y + radius * 0.25);
  ctx.lineTo(x - radius * 0.5, y - radius * 0.25);
  ctx.lineTo(x, y - radius * 0.5);
  ctx.lineTo(x + radius * 0.5, y - radius * 0.25);
  ctx.lineTo(x + radius * 0.5, y + radius * 0.25);
  ctx.lineTo(x, y + radius * 0.5);
  ctx.closePath()
  ctx.fill();

  ctx.strokeStyle = entity.strokeColor;
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.5, y + radius * 0.25);
  ctx.lineTo(x - radius * 0.5, y - radius * 0.25);
  ctx.lineTo(x, y - radius * 0.5);
  ctx.lineTo(x + radius * 0.5, y - radius * 0.25);
  ctx.lineTo(x + radius * 0.5, y + radius * 0.25);
  ctx.lineTo(x, y + radius * 0.5);
  ctx.closePath();
  ctx.stroke();

  /** Inner inner filled circle */
  ctx.fillStyle = entity.innerColor;
  ctx.beginPath();
  ctx.arc(
    x, y,
    (this.parent.sizeToRadius(entity.width, entity.height) * scale) / 2,
    0,
    PI2,
    false
  );
  ctx.closePath();
  ctx.fill();

  this.drawAnchors(ctx, entity, x, y, scale, radius / 2);

  return void 0;

};

/**
 * Update anchors
 * @param {Number} x
 * @param {Number} y
 * @param {Number} hW
 * @param {Number} hH
 * @param {Number} width
 * @param {Number} height
 * @param {Number} radius
 * @method updateAnchors
 */
Event.prototype.updateAnchors = function(x, y, hW, hH, width, height, radius) {

  this.anchors = [
    {
      x: x,
      y: (y - radius) + (hH / 2),
      radius: radius
    },
    {
      x: (x + radius),
      y: (y - radius * 0.25) + hH * 4,
      radius: radius
    },
    {
      x: x,
      y: (y + radius) - (hH / 2),
      radius: radius
    },
    {
      x: (x - radius),
      y: (y + radius * 0.25) - hH * 4,
      radius: radius
    }
  ];

  return void 0;

};

/**
 * Draw anchors
 * @param {Object} ctx
 * @param {Object} entity
 * @param {Number} x
 * @param {Number} y
 * @param {Number} scale
 * @param {Number} radius
 * @method drawAnchors
 */
Event.prototype.drawAnchors = function(ctx, entity, x, y, scale, radius) {

  var width = 4 * scale;
  var height = 4 * scale;

  var hW = width / 2;
  var hH = height / 2;

  var arcRad = this.parent.sizeToRadius(width, height);

  this.updateAnchors(x, y, hW, hH, width, height, radius);

  ctx.strokeStyle = entity.innerColor;
  ctx.lineWidth = ((width + height) / 4) << 0;

  for (var ii = 0; ii < this.anchors.length; ++ii) {
    ctx.beginPath();
    ctx.arc(
      this.anchors[ii].x,
      this.anchors[ii].y,
      arcRad,
      0,
      PI2,
      false
    );
    ctx.stroke();
    ctx.closePath();
  };

  return void 0;

};

LAMELLA.models.Event = Event;