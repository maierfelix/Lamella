"use strict";

(function() {

  var root = this;

  /**
   * Rooty
   * @class Rooty
   * @constructor
   */
  function Rooty() {

    /**
     * Invalid node
     * types hash map
     * @type {Object}
     */
    this.types = {
      "Boolean":  1,
      "String":   1,
      "Number":   1,
      "Function": 1,
      "Array":    1,
      "Object":   1
    };

  };

  Rooty.prototype.constructor = Rooty;

  /**
   * Get constructor of a class
   * @param {Object} c
   * @method getConstructor
   */
  Rooty.prototype.getConstructor = function(c) {

    var constr = c.constructor.toString();

    var match = null;

    if (match = constr.match(/^function\s(.+)\(/)) {
      if (match instanceof Array) {
        return (match[1]);
      }
    }

    return void 0;

  };

  /**
   * Deep grub
   * @param {Object} root
   * @method grub
   */
  Rooty.prototype.grub = function(root) {

    var constr = null;
    var rootString = this.getConstructor(root);

    if (rootString !== rootString.toUpperCase()) {
      throw new Error('Root class "' + rootString + '" has to be full uppercased!');
    }

    for (var key in root) {
      if (root[key] !== void 0) {
        constr = this.getConstructor(root[key]);
        if (constr && !this.types[constr] && root[key].grub !== false) {
          if (root[key].root === void 0) {
            root[key].root = root;
          }
        }
        this.grubSubs(root[key]);
      }
    };

  };

  /**
   * Grub sub classes
   * @param {Object} parent
   * @param {Boolean} deep
   * @method grubSubs
   */
  Rooty.prototype.grubSubs = function(parent, deep) {

    var constr = this.getConstructor(parent);

    for (var ii in parent) {
      if (typeof parent[ii] === 'object') {
        if (ii.charAt(0) === (ii.charAt(0).toUpperCase())) {
          if (parent[ii].parent === void 0 && parent[ii] !== void 0 && parent.constructor) {
            if (constr && !this.types[constr] && parent[ii].inherit !== false) {
              parent[ii].parent = parent;
              if (deep === true) this.grubSubs(parent[ii], deep);
            }
          }
        }
      }
    };

  };

  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = Rooty;
  }

  root.Rooty = new Rooty();

}).call(this);