"use strict";

/**
 * Add scene
 * @class Add
 * @constructor
 */
function Add() {

  /**
   * Title
   * @type {String}
   */
  this.title = "Add";

  /**
   * Scene ready
   * @type {Boolean}
   * @default false
   */
  this.ready = false;

  /**
   * Interactions
   * @type {Array}
   */
  this.interact = [];

};

Add.prototype.constructor = Add;

/**
 * Build scene
 * @method build
 */
Add.prototype.build = function() {

  /*this.interact.push({
    id:     "[name=showFps]",
    type:   "switch",
    listen: "change",
    sync:   "grid:showFps",
    fire: function(node, state) {
      node.checked = state;
      this.Config.grid.showFps = state ? true : false;
    }.bind(this.parent.root)
  });*/

  return void 0;

};

/**
 * Show scene
 * @method show
 */
Add.prototype.show = function() {

  var scene = this.parent.scenes[this.title.toLowerCase()];

  this.parent.clearTimers();

  this.parent.mainNode.style.opacity = 1;

  this.parent.root.Core.Grid.mainNode.classList.add("blur");

  this.parent.mainNode.appendChild(scene);

  return void 0;

};

/**
 * Hide scene
 * @method hide
 */
Add.prototype.hide = function() {

  this.parent.clearCurrentScene();

  return void 0;

};

LAMELLA.scenes["Add"] = Add;