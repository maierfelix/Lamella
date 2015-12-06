"use strict";

/**
 * Prepare a scene
 * Load it from cache
 * Parse it into a fragment
 * Connect it with the javascript scene
 * @param {String} name
 * @param {Function} resolve
 * @method prepareScene
 */
HUD.prototype.prepareScene = function(name, resolve) {

  var smName = name.toLowerCase();

  var config = this.Config.scene;

  var path = this.Config.assetPath + config.sceneFilePath + smName + config.sceneFileType;

  this.root.Core.Cache.get(path, true, function(data) {
    if (data instanceof Error) {
      throw new Error("Invalid scene data");
    } else {
      if (!this.scenes[smName]) {
        this.scenes[smName] = this.parseScene(data);
        this.connectScene(name);
        this.syncScene(name);
        resolve();
      } else {
        resolve();
      }
    }
  }.bind(this));

  return void 0;

};

/**
 * Parse a scene
 * @param {String} data
 * @method parseScene
 * @return {Object}
 */
HUD.prototype.parseScene = function(data) {

  var node = document.createElement("container");

  node.insertAdjacentHTML("beforeend", data);

  node = this.translateScene(node);

  return (node);

};

/**
 * Connect a scene with its
 * javascript scene file
 * @param {String} name
 * @method connectScene
 */
HUD.prototype.connectScene = function(name) {

  var scene = this.root.scenes[name];

  var documentScene = this.scenes[name.toLowerCase()];

  var node = null;

  for (var ii = 0; ii < scene.interact.length; ++ii) {
    if (node = documentScene.querySelector(scene.interact[ii].id)) {
      this.watchNode(node, scene.interact[ii].listen, scene.interact[ii].type, scene.interact[ii].autofire, scene.interact[ii].fire, false);
    }
  };

  return void 0;

};