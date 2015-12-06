"use strict";

/**
 * Hud
 * @class HUD
 * @constructor
 */
function HUD() {

  /**
   * Main node
   * @type {Object}
   */
  this.mainNode = $("#currentScene");

  /**
   * Main node fade timer
   * @type {Object}
   * @default NULL
   */
  this.mainFade = null;

  /**
   * Scene switch fade timer
   * @type {Object}
   * @default NULL
   */
  this.sceneSwitchFade = null;

  /**
   * Switch scene helper
   * @type {Boolean}
   * @default false
   */
  this.switchScene = false;

  /**
   * Registered nodes
   * @type {Object}
   */
  this.nodes = {};

  /**
   * Registered events
   * @type {Object}
   */
  this.events = {};

  /**
   * Registered switches
   * @type {Object}
   */
  this.switches = {};

  /**
   * Scenes
   * @type {Object}
   */
  this.scenes = {};

  /** Root config pointer */
  this.Config = void 0;

  /** Root pointer */
  this.root = void 0;

};

HUD.prototype.constructor = HUD;

/**
 * Initialise the hud
 * Recursive async build step system
 * @param {Number} stage Stage process
 * @param {Function} resolve Deep callback
 * @method init
 */
HUD.prototype.init = function(stage, resolve) {

  /** Link to root */
  if (!this.Config && this.root) {
    this.Config = this.root.Config;
  }

  /**
   * 0: Initialise & build models
   * 1: Build hud controller
   * 2: Kill scenes by clicking outside (bg)
   */
  switch (stage) {

    case 0:
      this.root.initialiseScenes();
      this.buildScenes();
      this.init(++stage, resolve);
    return void 0;

    case 1:
      this.buildController();
      this.init(++stage, resolve);
    return void 0;

    case 2:
      this.buildListeners();
      this.init(++stage, resolve);
    return void 0;

  };

  /** Initialised successfully */
  resolve();

  return void 0;

};

/**
 * Build listeners
 * @method buildListeners
 */
HUD.prototype.buildListeners = function() {

  var self = this;

  function kill(e) {
    if (self.activeScene && e.target.id === "background") {
      self.killScene(self.activeScene.title.toLowerCase());
    }
  };

  /** Kill scene by clicking outside */
  this.mainNode.addEventListener('mousedown', function(e) { kill(e); });
  this.mainNode.addEventListener('touchstart', function(e) { kill(e); });

  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 27 && this.activeScene) {
      this.killScene(this.activeScene.title.toLowerCase());
    }
  }.bind(this));

  return void 0;

};

/**
 * Rebuild loaded scenes
 * @method rebuildScenes
 */
HUD.prototype.rebuildScenes = function() {

  for (var key in this.scenes) {
    this.scenes[key] = this.translateScene(this.scenes[key]);
    this.connectScene(key.charAt(0).toUpperCase() + key.slice(1));
  };

  if (this.activeScene) {
    this.clearCurrentScene();
    setTimeout(function() {
      this.syncScene(this.activeScene.title);
      this.activeScene.show();
    }.bind(this), this.Config.scene.sceneSwitchTime);
  }

  return void 0;

};

/**
 * Synchronize scenes
 * @method syncScene
 */
HUD.prototype.syncScene = function(key) {

  var scene   = null;
  var scenes  = null;
  var sync    = null;
  var setting = null;

  if (this.root.scenes[key]) {

    scenes = this.root.scenes[key].interact;

    for (var ii = 0; ii < scenes.length; ++ii) {
      if (scenes[ii].sync) {
        setting = this.getSyncKey(scenes[ii].sync);
        if (setting !== void 0 && (scene = this.scenes[key.toLowerCase()])) {
          scene = scene.querySelector(scenes[ii].id);
          this.switches[scene.id] = setting;
          scenes[ii].fire(scene, setting);
        }
      }
    };

  };

  return void 0;

};

/**
 * Get synchronize key
 * @param {String} str
 * @method getSyncKey
 * @return {*}
 */
HUD.prototype.getSyncKey = function(str) {

  var sync = str.split(":");

  if (sync && this.root.Config[sync[0]]) {
    return (this.root.Config[sync[0]][sync[1]]);
  }

  return void 0;

};

/**
 * Clear the current scene
 * @method clearCurrentScene
 */
HUD.prototype.clearCurrentScene = function() {

  this.mainNode.style.opacity = 0;
  this.root.Core.Grid.mainNode.classList.remove("blur");

  this.clearTimers();

  this.switchScene = true;

  this.mainFade = setTimeout(function() {
    this.switchScene = false;
    this.mainNode.innerHTML = "";
  }.bind(this), this.Config.scene.sceneSwitchTime);

  return void 0;

};

/**
 * Clear timers
 * @method clearTimers
 */
HUD.prototype.clearTimers = function() {

  clearTimeout(this.mainFade);
  clearTimeout(this.sceneSwitchFade);

  return void 0;

};

/**
 * Build all registered scenes
 * @method buildScenes
 */
HUD.prototype.buildScenes = function() {

  for (var ii in this.root.scenes) {
    this.root.scenes[ii].build();
  };

  return void 0;

};

/**
 * Register a node
 * @param {String} id
 * @method registerNode
 */
HUD.prototype.registerNode = function(id, fun) {

  id = id.charAt(0) === "#" ? id.split("#").slice(1) : id;

  var node = fun("#" + id);

  if (!node) return void 0;

  this.nodes[id] = null;
  this.nodes[id] = node;

  return void 0;

};

/**
 * Register switch event
 * @param {String} id
 * @method registerSwitch
 */
HUD.prototype.registerSwitch = function(id) {

  this.switches[id] = null;
  this.switches[id] = 0;

  return void 0;

};

/**
 * Watch a node
 * @param {String}   id
 * @param {String}   listener
 * @param {String}   type
 * @param {String}   sync
 * @param {Function} fire
 * @param {Boolean}  autofire
 * @method watchNode
 */
HUD.prototype.watchNode = function(id, listener, type, sync, fire, autofire) {

  if (!this.nodes[id]) {
    if (typeof id === "string") {
      this.registerNode(id, $);
    } else if (typeof id === "object") {
      if (id instanceof HTMLElement) {
        this.nodes[id.getAttribute("id")] = null;
        this.nodes[id.getAttribute("id")] = id;
        id = this.nodes[id.getAttribute("id")].getAttribute("id");
      }
    }
  }

  this.events[id] = null;

  if (listener instanceof Array) {
    for (var ii = 0; ii < listener.length; ++ii) {
      this.registerListener(id, listener[ii], type, fire);
    };
  } else {
    this.registerListener(id, listener, type, fire);
  }

  if (autofire === true) {
    var key = this.getSyncKey(sync);
    this.switches[id] = key ? 1 : 0;
    fire(this.nodes[id], key);
  }

  return void 0;

};

/**
 * Register a listener
 * @param {Number}   id
 * @param {String}   listener
 * @param {String}   type
 * @param {Function} fire
 * @method registerListener
 */
HUD.prototype.registerListener = function(id, listener, type, fire) {

  this.events[id] = {
    event: listener,
    type:  type,
    fire:  fire
  };

  switch (type) {
    case "switch":
      this.registerSwitch(id);
      this.nodes[id].addEventListener(listener, function() {
        /** Anti scene switch spamming */
        if (this.switchScene) return void 0;
        this.syncScene(id.charAt(0).toUpperCase() + id.slice(1));
        this.fireSwitch(id, this.events[id].fire);
      }.bind(this), false);
    break;
  };

  return void 0;

};

/**
 * Fire switch event
 * @param {String}   id
 * @param {Function} fire Fire event
 * @method fireSwitch
 */
HUD.prototype.fireSwitch = function(id, fire) {

  this.switches[id] = this.switches[id] ? 0 : 1;

  this.events[id].fire(this.nodes[id], this.switches[id], id);

  return void 0;

};