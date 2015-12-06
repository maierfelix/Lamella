"use strict";

/**
 * Operator
 * @class Operator
 * @constructor
 */
function Operator() {

  /**
   * Collision type
   * @type {String}
   * @default Circular
   */
  this.collisionType = "Circular";

  /**
   * Output anchor index
   * @type {Number}
   * @default 2
   */
  this.outputAnchor = 2;

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

Operator.prototype.constructor = Operator;

/**
 * Evaluate
 * @param {Object} entity
 * @method evaluate
 * @return {Number}
 */
Operator.prototype.evaluate = function(entity) {

  var node = null;

  var connectedEntities = this.parent.getConnectedEntities(entity.id);

  if (!connectedEntities.length) {
    return void 0;
  }

  var result = 1;

  for (var ii = 0; ii < connectedEntities.length; ++ii) {
    if (node = this.parent.getEntityById(connectedEntities[ii])) {
      if (node = this.parent.layers[this.parent.currentLayer][node]) {
        result = this.parent.root.Interpreter.calc(entity.operator, result, node.value);
      }
    }
  };

  return (result);

};

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
Operator.prototype.update = function(buffer, entity, x, y, width, height) {

  /** Run animation */
  if (entity.animate) {
    entity.animFrame = this.parent.now + 2E3;
    entity.animate = false;
    //this.animate(buffer, this.parent.now);
  }

  /** Played animation */
  if (entity.animFrame > 0) {
    /** Stop animation */
    if (this.parent.now > entity.animFrame) {
      entity.animFrame = 0;
    }
  }

  this.context.drawImage(
    buffer.canvas,
    x - width, y - height
  );

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
Operator.prototype.draw = function(ctx, entity, x, y, scale) {

  x = ctx.canvas.width;
  y = ctx.canvas.height;

  ctx.canvas.width  *= 2;
  ctx.canvas.height *= 2;

  var radius = (entity.width / 2, entity.height / 2);

  radius -= this.parent.sizeToRadius(this.parent.config.cellSize.x, this.parent.config.cellSize.y) / 10;

  if (entity.scalable === void 0 || entity.scalable === true) {
    radius *= scale;
    radius = radius << 0;
  }

  /*ctx.fillStyle = "red";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fill();*/

  ctx.lineWidth = (2.5 * scale) << 0;

  /** Outer bordered circle */
  ctx.strokeStyle = entity.strokeColor;
  ctx.beginPath();
  ctx.arc(
    x, y,
    radius,
    0,
    PI2,
    false
  );
  ctx.closePath();
  ctx.stroke();

  ctx.lineWidth = (1.5 * scale) << 0;

  /** Outer bordered circle */
  ctx.strokeStyle = entity.strokeColor;
  ctx.beginPath();
  ctx.arc(
    x, y,
    radius / 1.8,
    0,
    PI2,
    false
  );
  ctx.closePath();
  ctx.stroke();

  /** Outer bordered circle */
  ctx.strokeStyle = entity.strokeColor;
  ctx.beginPath();
  ctx.arc(
    x, y,
    radius / 1.1,
    0,
    PI2,
    false
  );
  ctx.closePath();
  ctx.stroke();

  /** Inner inner filled circle */
  ctx.fillStyle = entity.strokeColor;
  ctx.beginPath();
  ctx.arc(
    x, y,
    radius / 2,
    0,
    PI2,
    false
  );
  ctx.closePath();
  ctx.fill();

  ctx.font = (10 * scale) + "px bold Lato, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#FFF";

  ctx.globalCompositeOperation = "destination-out";

  ctx.fillText(entity.operator, x, y - 7 * scale);

  ctx.globalCompositeOperation = "source-over";

  this.drawAnchors(ctx, entity, x, y, scale, radius);

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
Operator.prototype.updateAnchors = function(x, y, hW, hH, width, height, radius) {

  this.anchors = [
    {
      x: x,
      y: (y - radius) + hH * 4,
      radius: radius
    },
    {
      x: (x + radius * 0.7225),
      y: (y - radius * 0.27375) + hH * 4,
      radius: radius
    },
    {
      x: x,
      y: (y + radius) - hH * 4,
      radius: radius
    },
    {
      x: (x - radius * 0.7225),
      y: (y + radius * 0.275) - hH * 4,
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
Operator.prototype.drawAnchors = function(ctx, entity, x, y, scale, radius) {

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

/**
 * Animation
 * @param {Object} ctx
 * @param {Number} frame
 * @method animate
 */
Operator.prototype.animate = function(ctx, frame) {

  var width = 64;
  var height = 64;

  var i = 1;

  ctx.strokeStyle = i % 20 === 0 ? 'hsl(hue, 80%, 50%)'.replace('hue', (360 / (width / 3) * i - frame) % 360) : 'rgba(0, 0, 0, .08)';
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, frame % width / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();

};

LAMELLA.models.Operator = Operator;