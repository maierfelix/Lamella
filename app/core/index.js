"use strict";

/**
 * Core
 * @class CORE
 * @constructor
 */
function CORE() {

  /** Root config pointer */
  this.Config = void 0;

  /** Root pointer */
  this.root = void 0;

};

CORE.prototype.constructor = CORE;

/**
 * Initialise the core
 * Recursive async build step system
 * @param {Number} stage Stage process
 * @param {Function} resolve Deep callback
 * @method init
 */
CORE.prototype.init = function(stage, resolve) {

  /** Link to root */
  if (!this.Config && this.root) {
    this.Config = this.root.Config;
  }

  /**
   * 0: Setup environment language
   * 1: Initialise grid
   * 2: Initialise models
   * 3: Center and draw grid
   */
  switch (stage) {

    case 0:
      this.Language.change(
        this.Language.getNavigatorLanguage()
        , function() {
          this.init(++stage, resolve);
      }.bind(this));
    return void 0;

    case 1:
      this.Grid.init();
      this.init(++stage, resolve);
    return void 0;

    case 2:
      this.root.initialiseModels();
      this.init(++stage, resolve);
    return void 0;

    case 3:
      this.Grid.generateEntities();
      this.Grid.centerGrid();
      this.init(++stage, resolve);
    return void 0;

  };

  /** Initialised successfully */
  resolve();

  return void 0;

};