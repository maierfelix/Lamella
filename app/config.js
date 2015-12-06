"use strict";

/**
 * LAMELLA Configuration
 * @class VISLA_Config
 * @constructor
 */
LAMELLA.prototype.Config = function() {

  /**
   * Language config
   * @type {Object}
   */
  this.language = {
    currentLang: null,
    /** Lang to use, if navigator lang unsupported */
    baseLang: "en",
    langFilePath: "res/i18n/",
    langFileType: ".json",
    invalidLanguageIndex: "Invalid language index ",
    invalidLanguageFile: "Language file is invalid"
  };

  /**
   * Scene config
   * @type {Object}
   */
  this.scene = {
    sceneSwitchTime: 300,
    sceneFilePath: "res/scenes/",
    sceneFileType: ".html"
  };

  /**
   * Grid config
   * @type {Object}
   */
  this.grid = {
    editable: true,
    gridFactor: PI,
    zFactor: PI * 2.5,
    zoomFactor: 4,
    cellSize: {
      x: 32,
      y: 32
    },
    depth: {
      0: "y",
      1: "height"
    },
    lineJoin: "round",
    lineCap: "round",
    showFps: true,
    showGrid: true,
    showConnections: true,
    showEntities: true,
    showSnapLines: true,
    showCoordinates: false,
    baseCurveColor: "#bbb",
    lineColor: "hsl(0, 0%, 20%)",
    snapLineColor: "#FF0000",
    lineWidth: 0.5 / (window.devicePixelRatio || 1),
    imageSmoothing: true,
    textColor: "#FFFFFF"
  };

  /**
   * Path to the assets
   * @type {String}
   */
  this.assetPath = "./app/";

  /**
   * Local storage key
   * @type {String}
   */
  this.storageKey = "visla_settings";

  return void 0;

};

/** We dont need access to the parent here */
LAMELLA.prototype.Config.grub = false;