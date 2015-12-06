"use strict";

(function() {

  this.PI = Math.PI;
  this.PI2 = 2 * PI;
  this.PI_2 = PI / 2;
  this.MAX_INT = Number.MAX_SAFE_INTEGER;

  /**
   * Round integer to its nearst X integer
   * @param  {number} a Number
   * @param  {number} b Round to
   * @method roundTo
   * @return {number} rounded number
   */
  Math.roundTo = function(a, b) {
    b = 1 / (b);
    return (this.round(a * b) / b);
  };

  /**
   * Deg to rad
   * @param  {Number} deg
   * @method radians
   * @return {Number}
   */
  Math.radians = function(deg) {
    return (deg * this.PI / 180);
  };

  /**
   * Rad to deg
   * @param  {Number} rad
   * @method degrees
   * @return {Number}
   */
  Math.degrees = function(rad) {
    return (rad * 180 / this.PI);
  };

  /**
   * QuerySelector shortcut
   * @param {String} a
   * @method $
   * @return {Object}
   */
  this.$ = function(a) {
    return (document.querySelector(a));
  };

  (function() {

    var array = new Uint32Array(1);

    /**
     * Crypto randomized numbers
     * @return {Number}
     */
    Math.cryptoRand = function() {
      return (window.crypto.getRandomValues(array)[0]);
    };

  })();

  /**
   * Cross browser animation request
   */
  this.rAF = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame
    );
  })();

  /**
   * Cross browser scrolling
   * @param {Object} e Event
   * @method crossBrowserScroll
   */
  this.crossBrowserScroll = function(e) {

    var event = {
      clientX: e.clientX,
      clientY: e.clientY,
      amount: 0,
      dir: 0
    };

    /** IE and Chrome */
    if (e.wheelDelta) {
      event.dir = e.wheelDelta * ( -120 ) > 0 ? 1 : 0;
      event.amount = Math.floor(e.wheelDelta / 10);
    /** Chrome, Firefox */
    } else {
      /** Chrome */
      if (e.deltaY > 0) {
        event.dir = 1;
        event.amount = Math.floor(e.deltaY);
      /** Firefox */
      } else {
        event.dir = e.detail * ( -120 ) < 0 ? 1 : 0;
        event.amount = -(Math.floor(e.detail * 10));
      }
    }

    return (event);

  };

  /**
   * Clear a context
   * @param {String} color Clear by color
   * @method clear
   */
  CanvasRenderingContext2D.prototype.clear = function (color) {

    if (color) {
      var original = this.fillStyle;
      this.fillStyle = color;
      this.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.fillStyle = original;
    } else {
      this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    return void 0;

  };

  /**
   * Get attribute value of a node
   * @param {String} attr
   * @return {String}
   */
  HTMLElement.prototype.getNodeAttribute = function(attr) {

    var node = null;

    if (this.getAttributeNode !== void 0) {
      if (node = this.getAttributeNode(attr)) {
        return (node.value);
      }
      return void 0;
    }

    for (var ii = 0; ii < this.attributes.length; ++ii) {
      if (this.attributes[ii].name === attr ||
          this.attributes[ii].localName === attr) {
        return (
          this.attributes[ii].textContent !== void 0 ?
            this.attributes[ii].textContent :
              this.attributes[ii].value
        );
      }
    };

    return void 0;

  };

}).call(this);