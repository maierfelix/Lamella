"use strict";

/**
 * Screenshot
 * @class Screenshot
 * @constructor
 */
var Screenshot = function() {};

Screenshot.prototype.constructor = Screenshot;

/**
 * Canvas to image conversion
 * @param {Object} canvas
 * @param {Function} resolve
 * @method canvasToImage
 */
Screenshot.prototype.canvasToImage = function(canvas, resolve) {

  var img = new Image;

  img.addEventListener('load', function() {
    resolve(img);
  });

  img.src = canvas.toDataURL();

  return void 0;

};

/**
 * Draw multiple canvas stacked
 * by their index (from 0)
 * @param {Array} canvases
 * @param {Number} scale
 * @param {Function} resolve
 * @method take
 */
Screenshot.prototype.take = function(canvases, scale, resolve) {

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var length = canvases.length;

  canvases.map((function(cvs) {
    this.canvasToImage(cvs, function(img) {
      --length;
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width / scale, img.height / scale);
      if (length <= 0) {
        resolve(canvas);
      }
    });
  }).bind(this));

  return void 0;

};

LAMELLA.registerPlugin(Screenshot);

/*LAMELLA.plugins.Screenshot.take([canvas], 2, function(canvas) {
  document.body.appendChild(canvas);
});
 */