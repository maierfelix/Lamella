"use strict";

/**
 * Build the controller
 * @method buildController
 */
HUD.prototype.buildController = function() {

  /** Play button */
  this.watchNode("play", ["mousedown", "touchstart"], "switch", null, function(node, state) {
    node.children[0].className = state ? "ton-li-music-pause" : "ton-li-music-play";
    if (state) this.root.Core.Grid.evalEntities();
  }.bind(this));

  /** Add button */
  this.watchNode("add", ["mousedown", "touchstart"], "switch", null, function(node, state) {
    this.switchColor(node.children[0], state);
    this.runScene(node, state);
  }.bind(this));

  /** Settings button */
  this.watchNode("settings", ["mousedown", "touchstart"], "switch", null, function(node, state) {
    this.switchColor(node.children[0], state);
    this.runScene(node, state);
  }.bind(this));

  return void 0;

};

/**
 * Switch color of a node
 * @param {Object} node
 * @param {Number} state
 * @method switchColor
 */
HUD.prototype.switchColor = function(node, state) {

  node.style.color = state ? "#7becb4" : "#FFFFFF";

  return void 0;

};

/**
 * Run a scene
 * @param {Object} node
 * @param {Number} state
 * @method runScene
 */
HUD.prototype.runScene = function(node, state) {

  var scene = node.getNodeAttribute("scene") || node.children[0].getNodeAttribute("scene");

  /** Scene has to be shown */
  if (state && (scene = this.root.scenes[scene])) {
    /** Scene not cached yet */
    if (!scene.ready) {
      this.prepareScene(scene.title, function() {
        scene.ready = true;
        this.showScene(scene);
      }.bind(this));
    } else {
      this.showScene(scene);
    }
  } else {
    this.hideScene(scene);
  }

  return void 0;

};

/**
 * Show a scene
 * @param {Object} scene
 * @method showScene
 */
HUD.prototype.showScene = function(scene) {

  /** Already active scene, so simply switch it */
  if (this.activeScene) {
    this.activeScene.hide();
    /** Reset switch */
    this.killScene(this.activeScene.title.toLowerCase());
    this.sceneSwitchFade = setTimeout(function() {
      this.activeScene = scene;
      this.activeScene.show();
    }.bind(this), this.Config.scene.sceneSwitchTime);
  } else {
    this.activeScene = scene;
    this.activeScene.show();
  }

  return void 0;

};

/**
 * Kill a scene
 * @param {String} title
 * @method killScene
 */
HUD.prototype.killScene = function(title) {

  this.switches[title] = 0;

  this.events[title].fire(
    this.nodes[title],
    this.switches[title]
  );

  return void 0;

};

/**
 * Hide a scene
 * @param {Object}  scene
 * @method hideScene
 */
HUD.prototype.hideScene = function(scene) {

  this.root.scenes[scene].hide();
  this.activeScene = null;

  return void 0;

};