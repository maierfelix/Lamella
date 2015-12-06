"use strict";

/**
 * Grid
 * @class CORE_Grid
 * @constructor
 */
CORE.Grid = function() {

  /**
   * Dom query caching
   * @type {Object}
   */
  this.mainNode   = $("#main");
  this.fpsNode    = $("#fps");
  this.entityNode = $("#entityAmount");
  this.layerNode  = $("#currentLayer");

  /**
   * Contexts
   * @type {Object}
   */
  this.mainContext = this.mainNode.getContext("2d");

  /**
   * Pixel ratio
   * @type {Number}
   */
  this.pixelRatio = window.devicePixelRatio;

  /**
   * Valid targets
   * @type {Object}
   */
  this.targets = [
    "main"
  ];

  /**
   * Model type control
   * @type {Object}
   * @default {}
   */
  this.models = {};

  /**
   * Cursor change state
   * @type {Boolean}
   * @default false
   */
  this.changeCursor = false;

  /**
   * Current layer
   * @type {Number}
   * @default 1
   */
  this.currentLayer = 1;

  /**
   * Running timer
   * @type {Number}
   */
  this.now = 0;

  /**
   * Fps
   * @type {Number}
   */
  this.fps     = 0;
  this.lastFps = 0;
  this.nextFps = 0;

  /**
   * Fps container
   * display state
   * @type {Boolean}
   * @default false
   */
  this.displayFps = false;

  /**
   * Scale factor
   * @type {Number}
   * @default 0
   */
  this.scale = .0;

  /**
   * Grid size
   * @type {Number}
   * @default 0
   */
  this.width  = 0;
  this.height = 0;

  /**
   * Actual grid offsets
   * @type {Number}
   * @default 0
   */
  this.x = .0;
  this.y = .0;
  this.z = .0;

  /**
   * Last z factor
   * @type {Number}
   * @default 0
   */
  this.lastZ = .01;

  /**
   * Actual mouse offset
   * @type {Number}
   * @default 0
   */
  this.mouseX = 0;
  this.mouseY = 0;

  /**
   * Grid move helper
   * @type {Object}
   */
  this.drag = {
    /** Start grid offsets */
    sx: .0,
    sy: .0,
    /** Previous grid offsets */
    px: .0,
    py: .0,
    pz: .0
  };

  /**
   * Pinch zoom helper
   * @type {Object}
   */
  this.pinchZoom = {
    x:  0,
    y:  0
  };

  /**
   * Entity drag helper
   * @type {Object}
   */
  this.entityDrag = {
    x: 0,
    y: 0
  };

  /**
   * Entity connection helper
   * @type {Object}
   */
  this.rootConnection = {
    entity: null,
    anchor: null
  };

  /**
   * Grid modes
   * @type {Object}
   */
  this.MODES = {
    NAVIGATE: false,
    DRAG:     false,
    SNAP:     false,
    CONNECT:  false,
    RESIZE:   false,
    EDIT:     false
  };

  /**
   * Grid pinch zoom state
   * @type {Boolean}
   * @default false
   */
  this.pinchZoomGrid = false;

  /**
   * Selected entity
   * @type {Object}
   * @default NULL
   */
  this.entitySelected = null;

  /**
   * Layer entity pool
   * @type {Object}
   */
  this.layers = {};

  /**
   * Device platform
   * @type {String}
   * @default NULL
   */
  this.device = null;

  /** Root collison type pointer */
  this.collisions = void 0;

  /** Root keys pointer */
  this.keyPressed = void 0;

  /** Parent config pointer */
  this.config = void 0;

  /** Root pointer */
  this.root = void 0;

};

CORE.Grid.prototype.constructor = CORE.Grid;

/**
 * Initialisation
 * @method init
 */
CORE.Grid.prototype.init = function() {

  this.link();

  this.getDevicePlatform();

  /** Get fps container state */
  this.displayFps = this.fpsNode.style.display === "block" ? true : false;

  this.resize(false);

  this.mainContext.imageSmoothingEnabled = this.config.imageSmoothing;

  Hammer(this.mainNode).on('pinch', this.pinch);

  this.addListeners([
    "mousedown",  "mouseup",  "mousemove",
    "keydown", "keyup",
    "touchstart", "touchend", "touchmove",
    "mousewheel", "DOMMouseScroll",
    "contextmenu", "selectstart",
    "resize"
  ]);

  return void 0;

};

/**
 * Link
 * @method link
 */
CORE.Grid.prototype.link = function() {

  /** Link to the root */
  this.root = this.parent.root;

  /** Link with root grid config */
  this.config = this.root.Config.grid;

  /** Link with root keys */
  this.keyPressed = this.root.keys;

  /** Link with root collisions */
  this.collisions = this.root.collisions;

  return void 0;

};

/**
 * Rescale
 * @method rescale
 */
CORE.Grid.prototype.rescale = function() {

  this.rescaleMainNode();

  this.scaleEntities();

  this.lastZ = this.z;

  return void 0;

};

/**
 * Performance hack
 * Rescales main node to a new size
 *
 * Gains a pretty high performance
 * increase (up to 10ms)
 *
 * Maybe caused by a browser bug
 *
 * @method rescaleMainNode
 */
CORE.Grid.prototype.rescaleMainNode = function() {

  this.mainNode.width = this.width + 1;

};

/**
 * Calculate fps
 * @method calcFps
 * @return {Number}
 */
CORE.Grid.prototype.calcFps = function() {

  this.fps = 1E3 / (this.now - this.lastFps);

  this.lastFps = this.now;

  return void 0;

};

/**
 * Get current layer
 * @method getCurrentLayer
 * @return {Number}
 */
CORE.Grid.prototype.getCurrentLayer = function() {

  return (this.layers[this.currentLayer] || void 0);

};

/**
 * Update mouse cursor
 * @param {Object} entity
 * @method updateCursor
 */
CORE.Grid.prototype.updateCursor = function(entity) {

  /** Reset */
  if (!this.changeCursor && !this.MODES.DRAG && !this.MODES.NAVIGATE) {
    this.mainNode.classList.remove("drag");
    this.mainNode.classList.add("hover");
    this.changeCursor = true;
  }

  if (this.changeCursor && this.MODES.NAVIGATE) {
    this.mainNode.classList.remove("hover");
    this.mainNode.classList.add("drag");
    this.changeCursor = false;
  }

  return void 0;

};

/**
 * Get device platform
 * @method getDevicePlatform
 */
CORE.Grid.prototype.getDevicePlatform = function() {

  var windows = navigator.userAgent.indexOf("Windows Phone") >= 0;

  var android = navigator.userAgent.indexOf('Android') > 0 && !windows;

  var ios = /iP(ad|hone|od)/.test(navigator.userAgent) && !windows;

  if (!windows && !android && !ios) {
    return (this.device = false);
  }

  if (windows && !android && !ios) {
    return (this.device = "wp");
  }

  if (android && !ios) {
    return (this.device = "android");
  }

  if (ios) {
    return (this.device = "ios");
  }

  return void 0;

};

/**
 * Stress test
 * @param {Number} n
 * @method stressTest
 */
CORE.Grid.prototype.stressTest = function(n) {

  n = n || 100;

  var ii = 0;

  var entity = {
    id: 0,
    width: 32,
    height: 32,
    color: "#FFF",
    model: "DataType",
    value: "",
    x: 0,
    y: 0,
    connections: []
  };

  this.layers[1] = [];

  for (ii = 0; ii < n; ++ii) {
    entity.id = ii;
    entity.x = Math.floor(Math.random() * ((window.innerWidth * 1.5) + Math.random() * 100));
    entity.y = Math.floor(Math.random() * ((window.innerHeight * 1.5) + Math.random() * 100));
    if (Math.random() < 0.5) {
      entity.value = "Hello World";
    } else {
      entity.value = Math.floor(Math.random() * 100);
    }
    this.layers[1].push(JSON.parse(JSON.stringify(entity)));
  };

  this.rescale();

  this.resize();

  return void 0;

};

/**
 * Generate entities
 * @method generateEntities
 */
CORE.Grid.prototype.generateEntities = function() {

  this.layers[1] = [
    {
      id: 1,
      width: 32,
      height: 32,
      color: "rgba(255, 255, 255, 0.45)",
      model: "DataType",
      value: "Hello World",
      x: -44,
      y: 110,
      connections: []
    },
    {
      id: 2,
      width: 32,
      height: 32,
      color: "rgba(255, 255, 255, 0.45)",
      model: "DataType",
      value: 1.618,
      x: 78,
      y: 50,
      connections: []
    },
    {
      id: 3,
      width: 32,
      height: 32,
      color: "rgba(255, 255, 255, 0.45)",
      model: "DataType",
      value: PI,
      x: 18,
      y: 110,
      connections: []
    },
    {
      id: 7,
      width: 64,
      height: 64,
      color: "#152638",
      strokeColor: "#00d5f6",
      model: "Operator",
      operator: "%",
      x: 350,
      y: 250,
      connections: []
    },
    {
      id: 8,
      width: 64,
      height: 64,
      color: "#152638",
      strokeColor: "#ff28ff",
      model: "Operator",
      operator: "+",
      animate: true,
      x: 475,
      y: 250,
      connections: []
    },
    {
      id: 10,
      width: 64,
      height: 64,
      color: "#e5ee01",
      strokeColor: "#e5ee01",
      model: "Operator",
      operator: "-",
      x: 475,
      y: 99,
      connections: []
    },
    {
      id: 12,
      width: 64,
      height: 64,
      color: "#7becb4",
      strokeColor: "#7becb4",
      outputAnchorColor: "#4d9471",
      model: "Operator",
      operator: "×",
      x: 325,
      y: 99,
      connections: []
    },
    {
      id: 9,
      width: 64,
      height: 64,
      color: "#152638",
      strokeColor: "#ff82e6",
      innerColor: "#00f2fd",
      model: "Event",
      x: -279,
      y: 266,
      connections: []
    },
    {
      id: 11,
      width: 64,
      height: 64,
      color: "#152638",
      strokeColor: "#fff",
      innerColor: "#00f2fd",
      model: "Event",
      x: -233,
      y: 55,
      connections: []
    }
    /*,
    {
      id: 0,
      width: 88,
      height: 88,
      color: "#fff",
      strokeColor: "#02ad4f",
      model: "Perceptron",
      x: -155,
      y: 110,
      connections: [
        2
      ]
    },
    {
      id: 2,
      width: 44,
      height: 44,
      color: "#fff",
      strokeColor: "#02ad4f",
      model: "Perceptron",
      x: -255,
      y: 110,
      connections: [
        2
      ]
    },
    {
      id: 4,
      width: 64,
      height: 32,
      color: "#7becb4",
      model: "Neuron",
      x: 235,
      y: 110,
      connections: [
        5,
        7,
        13
      ]
    },
    {
      id: 5,
      width: 64,
      height: 64,
      color: "#ff377b",
      model: "Neuron",
      x: 125,
      y: -30,
      connections: [
        2,
        11,
        12
      ]
    },
    {
      id: 7,
      width: 64,
      height: 32,
      color: "#14becf",
      model: "Neuron",
      x: 345,
      y: -30,
      connections: [
        1,
        5,
        11
      ]
    }*/
  ];

  this.layers[2] = [
    {
      id: 12,
      width: 83,
      height: 48,
      color: "#7becb4",
      radialGradient: "rgba(0,0,0,0)",
      model: "Neuron",
      x: -277,
      y: 136,
      connections: [
        2,
        13
      ]
    },
    {
      id: 10,
      width: 64,
      height: 32,
      color: "#7becb4",
      radialGradient: "rgba(0,0,0,0)",
      model: "Neuron",
      x: 218.5,
      y: 136,
      connections: [
        12, 7
      ]
    },
    {
      id: 7,
      width: 55,
      height: 55,
      color: "#7becb4",
      radialGradient: "rgba(0,0,0,0)",
      model: "Neuron",
      x: 714,
      y: 136,
      connections: [
        9,
        14
      ]
    },
    {
      id: 9,
      width: 64,
      height: 64,
      color: "#7becb4",
      radialGradient: "rgba(0,0,0,0)",
      model: "Neuron",
      x: -277,
      y: -334,
      connections: [
        13,
        8
      ]
    },
    {
      id: 11,
      width: 64,
      height: 32,
      color: "#7becb4",
      radialGradient: "rgba(0,0,0,0)",
      model: "Neuron",
      x: 714,
      y: -334,
      connections: [
        2,
        12,
        14,
        8
      ]
    },
    {
      id: 8,
      width: 64,
      height: 32,
      color: "#7becb4",
      radialGradient: "rgba(0,0,0,0)",
      model: "Neuron",
      x: 218.5,
      y: -334
    },
    {
      id: 13,
      width: 64,
      height: 32,
      color: "#7becb4",
      radialGradient: "rgba(0,0,0,0)",
      model: "Neuron",
      x: -277,
      y: -99
    },
    {
      id: 14,
      width: 64,
      height: 32,
      color: "#7becb4",
      radialGradient: "rgba(0,0,0,0)",
      model: "Neuron",
      x: 714,
      y: -99
    }
  ];

  this.layers[3] = [
    {
      id: 15,
      width: 32,
      height: 32,
      color: "#be7bee",
      model: "Condition",
      x: -50,
      y: 55,
      connections: [2, 3, 4]
    },
    {
      id: 16,
      width: 64,
      height: 64,
      color: "hsl(200, 100%, 50%)",
      model: "Condition",
      x: -128,
      y: -128
    },
    {
      id: 17,
      width: 32,
      height: 32,
      color: "#be7bee",
      model: "Neuron",
      x: 256,
      y: 128,
      connections: [4]
    },
    {
      id: 18,
      width: 44,
      height: 44,
      color: "#be7bee",
      model: "Neuron",
      x: 321,
      y: -166,
      connections: []
    },
    {
      id: 19,
      width: 83,
      height: 48,
      color: "hsl(200, 100%, 50%)",
      model: "Condition",
      x: 256,
      y: 256,
      connections: [6]
    },
    {
      id: 20,
      width: 8,
      height: 8,
      color: "hsl(200, 100%, 50%)",
      shadowColor: "white",
      model: "Statement",
      x: 256 * 1.5,
      y: 128 * 1.25,
      scalable: false,
      connections: [2]
    },
    {
      id: 21,
      width: 66,
      height: 99,
      color: "hsl(200, 100%, 50%)",
      shadowColor: "white",
      model: "Condition",
      x: -100,
      y: 322
    }
  ];

  return void 0;

};