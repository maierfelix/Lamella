"use strict";

/**
 * Lamella
 * @class LAMELLA
 * @constructor
 */
function LAMELLA() {

  /**
   * Playing state
   * @type {Boolean}
   * @default false
   */
  this.paused = false;

  /**
   * Ready state
   * @type {Boolean}
   * @default false
   */
  this.ready = false;

  /**
   * Plugins
   * @type {Object}
   * @default Object
   */
  this.plugins = {};

  /**
   * Models
   * @type {Object}
   * @default Object
   */
  this.models = {};

  /**
   * Scenes
   * @type {Object}
   * @default Object
   */
  this.scenes = {};

  /**
   * Keypress map
   * @type {Object}
   */
  this.KEYMAP = {
    BACKSPACE: 8,
    TAB:       9,
    ENTER:     13,
    SHIFT:     16,
    CTRL:      17,
    ALT:       18,
    SPACE:     32,
    ARROW_L:   37,
    ARROW_U:   38,
    ARROW_R:   39,
    ARROW_D:   40,
  };

  /**
   * Collision map
   * @type {Object}
   */
  this.collisions = {
    CUBIC:    1,
    CIRCULAR: 2
  };

  /**
   * Pressed keys
   * @type {Object}
   */
  this.keys = {};

};

LAMELLA.prototype.constructor = LAMELLA;

/**
 * Run
 * @param {Boolean} ready
 * @method run
 */
LAMELLA.prototype.run = function(ready) {

  switch (ready) {

    /** Initialise system */
    case true:
      this.syncSettings();
      this.watchKeys();
      watch(this.Config, function(){
        this.setStorage(this.Config.storageKey, this.Config);
      }.bind(this));
      /** @async */
      this.Core.init(0, (function() {
        this.Hud.init(0, (function() {
          this.Interpreter.init(0, (function() {
            this.ready = true;
            this.Core.Grid.draw();
            console.info(this.getText("s_SystemLoaded"));
          }).bind(this));
        }).bind(this));
      }).bind(this));
    break;

    /** Fade in ui */
    case false:
      FastClick.attach(document.body);

      $("#progress-container").style.opacity = 0;
      $("#progress-logo").style.opacity      = 0;

      $("#nav").style.opacity  = 1;
      $("#main").style.opacity = 1;

      setTimeout(function() {
        $("#progress-container").style.display = "none";
        $("#progress-logo").style.display      = "none";

        this.run(true);
      }.bind(this), 50);
    break;

  };

  return void 0;

};

/**
 * Shortcut
 * Language specific text call
 * @param {String} key
 * @method getText
 * @return {String}
 */
LAMELLA.prototype.getText = function(key) {

  return this.Core.Language.get(key);

};

/**
 * Dynamic session rebuild
 * Rebuild language instance
 * Refresh grid instance
 * @param {Function} resolve
 * @method rebuild
 */
LAMELLA.prototype.rebuild = function(resolve) {

  this.Core.Language.change(this.Config.language.currentLang, function() {

    this.Hud.rebuildScenes();

    this.Core.Grid.drawTexts(true);

    if (resolve instanceof Function) resolve();

  }.bind(this));

  return void 0;

};

/**
 * Synchronize settings
 * @method syncSettings
 */
LAMELLA.prototype.syncSettings = function() {

  if (!this.getStorage(this.Config.storageKey)) {
    this.setStorage(this.Config.storageKey, this.Config);
  }

  var config = JSON.parse(this.getStorage(this.Config.storageKey));

  /** Synchronize grid settings */
  for (var key in config.grid) {
    this.Config.grid[key] = config.grid[key];
  };

  return void 0;

};

/**
 * Valid key code
 * @param {Number} key
 * @method validKey
 * @return {String}
 */
LAMELLA.prototype.validKey = function(key) {

  for (var ii in this.KEYMAP) {
    if (key === this.KEYMAP[ii]) {
      return (ii);
    }
  };

  return void 0;

};

/**
 * Watch pressed keys
 * @method watchKeys
 */
LAMELLA.prototype.watchKeys = function() {

  var keyDown = null;
  var keyUp   = null;

  window.addEventListener('keydown', function(e) {
    if (keyDown = this.validKey(e.keyCode)) {
      this.keys[keyDown] = true;
    }
  }.bind(this));

  window.addEventListener('keyup', function(e) {
  
    if (keyUp = this.validKey(e.keyCode)) {
      this.keys[keyUp] = false;
    }
  }.bind(this));

  return void 0;

};