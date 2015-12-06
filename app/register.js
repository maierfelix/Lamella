"use strict";

/**
 * Initialise all registered models
 * @method initialiseModels
 */
LAMELLA.prototype.initialiseModels = function() {

  for (var ii in this.models) {
    if (this.models.hasOwnProperty(ii)) {
      if (typeof this.models[ii] === "function") {
        this.registerModel(this.models[ii]);
      }
    }
  };

  return void 0;

};

/**
 * Initialise all registered scenes
 * @method initialiseScenes
 */
LAMELLA.prototype.initialiseScenes = function() {

  for (var ii in this.scenes) {
    if (this.scenes.hasOwnProperty(ii)) {
      if (typeof this.scenes[ii] === "function") {
        this.registerScene(this.scenes[ii]);
      }
    }
  };

  return void 0;

};

/**
 * Register a plugin
 * @param {Object} plugin
 * @method registerPlugin
 */
LAMELLA.prototype.registerPlugin = function(plugin) {

  var plug = new plugin();
  var constr = Rooty.getConstructor(plug);

  if (this.plugins[constr] === void 0) {
    if (this.plugins.parent === void 0) {
      plug.parent = this;
    }
    this.plugins[constr] = plug;
    return (plug = void 0);
  }

  return void 0;

};

/**
 * Register a model
 * @param {Object} model
 * @method registerModel
 */
LAMELLA.prototype.registerModel = function(model) {

  var mod = new model();

  var constr = Rooty.getConstructor(mod);
  var type = "";

  if (!mod.hasOwnProperty("parent")) {
    mod.parent = this.Core.Grid;
  } else {
    throw new Error("Error in " + constr + " model!");
  }

  if (mod.hasOwnProperty("context")) {
    mod.context = this.Core.Grid.mainContext;
  } else {
    throw new Error("Error in " + constr + " model!");
  }

  this.models[constr] = mod;

  type = (mod.collisionType.charAt(0).toLowerCase() + mod.collisionType.substr(1)) + "Collision";

  mod.collisionType = this.collisions[mod.collisionType.toUpperCase()];

  /** Collision method exists */
  if (this.Core.Grid[type]) {
    this.Core.Grid.models[constr] = this.Core.Grid[type].bind(this.Core.Grid);
  } else {
    throw new Error("Collision method " + type + " does not exist!");
  }

  window[constr] = void 0;

  return void 0;

};

/**
 * Register a scene
 * @param {Object} scene
 * @method registerScene
 */
LAMELLA.prototype.registerScene = function(scene) {

  var scen = new scene();

  var constr = Rooty.getConstructor(scen);

  if (!scen.hasOwnProperty("parent")) {
    scen.parent = this.Hud;
  } else {
    throw new Error("Error in " + constr + " scene!");
  }

  this.scenes[constr] = scen;

  window[constr] = void 0;

  return void 0;

};