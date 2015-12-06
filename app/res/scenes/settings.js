"use strict";

/**
 * Settings scene
 * @class Settings
 * @constructor
 */
function Settings() {

  /**
   * Title
   * @type {String}
   */
  this.title = "Settings";

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

Settings.prototype.constructor = Settings;

/**
 * Build scene
 * @method build
 */
Settings.prototype.build = function() {

  this.interact.push({
    id:     "[name=showFps]",
    type:   "switch",
    listen: "change",
    sync:   "grid:showFps",
    fire: function(node, state) {
      node.checked = state;
      this.Config.grid.showFps = state ? true : false;
    }.bind(this.parent.root)
  });

  this.interact.push({
    id:     "[name=showGrid]",
    type:   "switch",
    listen: "change",
    sync:   "grid:showGrid",
    fire: function(node, state) {
      node.checked = state;
      this.Config.grid.showGrid = state;
    }.bind(this.parent.root)
  });

  this.interact.push({
    id:     "[name=showConnections]",
    type:   "switch",
    listen: "change",
    sync:   "grid:showConnections",
    fire: function(node, state) {
      node.checked = state;
      this.Config.grid.showConnections = state;
    }.bind(this.parent.root)
  });

  this.interact.push({
    id:     "[name=showEntities]",
    type:   "switch",
    listen: "change",
    sync:   "grid:showEntities",
    fire: function(node, state) {
      node.checked = state;
      this.Config.grid.showEntities = state;
    }.bind(this.parent.root)
  });

  this.interact.push({
    id:     "[name=showCoordinates]",
    type:   "switch",
    listen: "change",
    sync:   "grid:showCoordinates",
    fire: function(node, state) {
      node.checked = state;
      this.Config.grid.showCoordinates = state;
    }.bind(this.parent.root)
  });

  this.interact.push({
    id:     "[name=editable]",
    type:   "switch",
    listen: "change",
    sync:   "grid:editable",
    fire: function(node, state) {
      node.checked = state;
      this.Config.grid.editable = state;
    }.bind(this.parent.root)
  });

  this.interact.push({
    id:     "[id=changeLang-1]",
    type:   "switch",
    listen: "change",
    sync:   "language:currentLang",
    fire: function(node, state) {
      var value = node.parentNode.querySelector("legend").getAttribute("value");
      if (value === this.Config.language.currentLang) {
        node.checked = state;
      }
      if (!state && value !== this.Config.language.currentLang) {
        LAMELLA.Core.Language.change(value, function() {
          this.rebuild();
        }.bind(this));
      }
    }.bind(this.parent.root)
  });

  this.interact.push({
    id:     "[id=changeLang-2]",
    type:   "switch",
    listen: "change",
    sync:   "language:currentLang",
    fire: function(node, state) {
      var value = node.parentNode.querySelector("legend").getAttribute("value");
      if (value === this.Config.language.currentLang) {
        node.checked = state;
      }
      if (!state && value !== this.Config.language.currentLang) {
        LAMELLA.Core.Language.change(value, function() {
          this.rebuild();
        }.bind(this));
      }
    }.bind(this.parent.root)
  });

  return void 0;

};

/**
 * Show scene
 * @method show
 */
Settings.prototype.show = function() {

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
Settings.prototype.hide = function() {

  this.parent.clearCurrentScene();

  return void 0;

};

LAMELLA.scenes["Settings"] = Settings;