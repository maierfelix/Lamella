"use strict";

/**
 * Curve in view
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @method curveInView
 * @return {Boolean}
 */
CORE.Grid.prototype.curveInView = function(x1, y1, x2, y2) {

  var width  = Math.abs(x2 - x1);
  var height = Math.abs(y2 - y1);

  return (
    this.inView(
      x1, y1,
      width, height
    ) &&
    this.inView(
      x2, y2,
      width, height
    )
  );

};

/**
 * Zoom scale
 * @param {Number} zoom
 * @method zoomScale
 * @return {Number}
 */
CORE.Grid.prototype.zoomScale = function(zoom) {

  if (zoom >= 0) {
    zoom = zoom + 1;
  } else {
    if (zoom < 0) {
      zoom = -(zoom) + 1;
    } else {
      zoom + 1;
    }
  }

  return (zoom);

};

/**
 * Size to radius
 * @param {Number} width
 * @param {Number} height
 * @method sizeToRadius
 * @return {Number}
 */
CORE.Grid.prototype.sizeToRadius = function(width, height) {

  return ((height / 2) + (Math.pow(width, 2) / (8 * height)));

};

/**
 * Radius to diameter
 * @param {Number} rad
 * @method radiusToDiameter
 * @return {Number}
 */
CORE.Grid.prototype.radiusToDiameter = function(rad) {

  return (2 * rad);

};

/**
 * Square
 * @param {Number} n1
 * @param {Number} n2
 * @method square
 * @return {Number}
 */
CORE.Grid.prototype.square = function(n1, n2) {

  return (Math.pow(Math.abs(n1 - n2), 2));

};

/**
 * Hypotenuse
 * @param {Number} x
 * @param {Number} y
 * @method hypot
 * @return {Number}
 */
CORE.Grid.prototype.hypot = function(x, y) {

  return (Math.sqrt((x * x) + (y * y)));

};

/**
 * Distance between two points
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @method distance
 * @return {Number}
 */
CORE.Grid.prototype.distance = function(x1, y1, x2, y2) {

  return (this.hypot(x1 + x2, y1 + y2));

};

/**
 * Midpoint of two points
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @method midpoint
 * @return {Object}
 */
CORE.Grid.prototype.midpoint = function(x1, y1, x2, y2) {

  return ({
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2
  });

};

/**
 * Cell scale
 * @method cellScale
 * @return {Number}
 */
CORE.Grid.prototype.cellScale = function() {

  /** Infinite grid cell scale */
  //return (this.scale / Math.pow(2, (Math.log(this.scale) / Math.log(this.config.gridFactor)) << 0));

  /** Finite scaling */
  return (this.scale / Math.pow(2, (Math.log(this.scale) / this.config.gridFactor) << 0));

};

/**
 * Cubic in view
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @method inView
 * @return {Boolean}
 */
CORE.Grid.prototype.inView = function(x, y, width, height) {

  return (
    x + width >= 0 && x - width <= this.width &&
    y + height >= 0 && y - height <= this.height
  );

};

/**
 * Z factor is visible
 * in the current layer
 * @param {Number} z
 * @method inCurrentLayer
 * @return {Boolean}
 */
CORE.Grid.prototype.inCurrentLayer = function(z) {

  return (z === this.currentLayer);

};

/**
 * Center dragging
 * @method centerDrag
 */
CORE.Grid.prototype.centerDrag = function() {

  this.click(this.width / 2, this.height / 2);

  return void 0;

};

/**
 * Center the grid
 * @method centerGrid
 */
CORE.Grid.prototype.centerGrid = function() {

  var width = (this.width / 2);
  var height = (this.height / 2);

  this.x = width;
  this.y = height;

  this.move(width, height);

  return void 0;

};

/**
 * Synchronize mouse position
 * @param {Number} x
 * @param {Number} y
 * @method sync
 */
CORE.Grid.prototype.sync = function(x, y) {

  this.drag.px = x;
  this.drag.py = y;

  return void 0;

};

/**
 * Draw a text
 * @param {Number} width
 * @param {Number} height
 * @method createCanvasBuffer
 * @return {Object}
 */
CORE.Grid.prototype.createCanvasBuffer = function (width, height) {

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = this.config.imageSmoothing;

  canvas.width = width;
  canvas.height = height;

  return (ctx);

};