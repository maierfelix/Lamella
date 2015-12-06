"use strict";

/**
 * DataType
 * @class DataType
 * @constructor
 */
function DataType() {

  /**
   * Collision type
   * @type {String}
   * @default Circular
   */
  this.collisionType = "Circular";

  /**
   * Output anchor index
   * @type {Number}
   * @default 0
   */
  this.outputAnchor = 0;

  /**
   * Output anchor color
   * @type {String}
   * @default #CCC
   */
  this.outputAnchorColor = "#CCC";

  /**
   * Main context pointer
   * @type {Object}
   */
  this.context = void 0;

};

DataType.prototype.constructor = DataType;

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
DataType.prototype.update = function(buffer, entity, x, y, width, height) {

  this.context.drawImage(
    buffer.canvas,
    x - width, y - height
  );

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
DataType.prototype.updateAnchors = function(x, y, hW, hH, width, height, radius) {

  this.anchors = [
    {
      x: x,
      y: y,
      radius: radius
    }
  ];

  return void 0;

};

/**
 * Draw model into buffer
 * Cached model gets
 * rendered by update method
 * @param {Object} ctx
 * @param {Object} entity
 * @param {Number} x
 * @param {Number} y
 * @param {Number} scale
 * @method draw
 */
DataType.prototype.draw = function(ctx, entity, x, y, scale) {

  x = ctx.canvas.width;
  y = ctx.canvas.height;

  ctx.canvas.width  *= 2;
  ctx.canvas.height *= 2;

  var radius = (entity.width / 2, entity.height / 2);

  if (entity.scalable === void 0 || entity.scalable === true) {
    radius *= scale;
    radius = radius << 0;
  }

  var color = null;

  if (entity.hasOwnProperty("value")) {
    if (typeof entity.value === "number") {
      color = "rgba(24, 135, 253, 0.65)";
    }
    else if (typeof entity.value === "boolean") {
      color = "rgba(24, 135, 253, 0.65)";
    }
    else if (typeof entity.value === "string") {
      color = "rgba(255, 107, 107, 0.65)";
    }
  }

  ctx.lineWidth = (2.5 * scale) << 0;

  /** Outer bordered circle */
  ctx.strokeStyle = color || entity.color;
  ctx.beginPath();
  ctx.arc(
    x, y,
    radius * 1.2,
    0,
    PI2,
    false
  );
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = color || entity.color;

  ctx.beginPath();
  ctx.arc(
    x, y,
    radius,
    0,
    PI2,
    false
  );
  ctx.closePath();

  ctx.fill();

  ctx.font = (4 * scale) + "px bold Lato, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";

  ctx.fillText(
    (entity.value && typeof entity.value === "number" ? entity.value.toFixed(2) : entity.value),
    x,
    y - ((entity.width + entity.height) / 6) * scale
  );

  this.drawAnchors(ctx, entity, x, y, scale, radius);

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
DataType.prototype.drawAnchors = function(ctx, entity, x, y, scale, radius) {

  var width = 4 * scale;
  var height = 4 * scale;

  var hW = width / 2;
  var hH = height / 2;

  var arcRad = this.parent.sizeToRadius(width, height);

  this.updateAnchors(x, y, hW, hH, width, height, radius);

  ctx.lineWidth = ((width + height) / 4) << 0;

  for (var ii = 0; ii < this.anchors.length; ++ii) {
    if (ii === this.outputAnchor) {
      ctx.strokeStyle = entity.outputAnchorColor || this.outputAnchorColor;
    } else {
      ctx.strokeStyle = entity.strokeColor;
    }
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

LAMELLA.models.DataType = DataType;