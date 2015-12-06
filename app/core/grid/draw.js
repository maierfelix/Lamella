"use strict";

/**
 * Draw
 * @method draw
 */
CORE.Grid.prototype.draw = function() {

  var self = this;

  this.update();

  if (this.config.showGrid) {
    this.drawGrid();
  }

  var entities = this.getCurrentLayer();
  var length = entities ? entities.length : 0;
  var ii = length;

  if (this.config.showSnapLines && this.MODES.SNAP) {
    if (this.entitySelected) {
      this.drawSnapLines(this.entitySelected);
    }
  }

  if (this.config.showConnections) {
    this.drawEntityConnections();
  }

  if (this.config.showEntities) {
    while (ii--) {
      this.drawEntity(entities[ii]);
    };
  }

  if (this.MODES.CONNECT) {
    this.drawConnectionLine();
  }

  this.drawTexts(false);

  if (this.config.showCoordinates) {
    this.drawCoordinates(this.mouseX, this.mouseY);
  }

  rAF(function() {
    self.draw();
  });

  return void 0;

};

/**
 * Update
 * @method update
 */
CORE.Grid.prototype.update = function() {

  var key = null;

  this.now = Date.now();

  this.scale = this.zoomScale(this.z);

  this.mainNode.width = this.width;

  /** Fake depth sorting */
  for (key in this.layers) {
    this.layers[key] = this.depthSort(this.layers[key]);
  };

  /** Rescale if necessary */
  if (this.z !== this.lastZ) {
    this.rescale();
  }

  this.calcFps();

  this.drawFps();

  return void 0;

};

/**
 * Draw a grid
 * @method drawGrid
 */
CORE.Grid.prototype.drawGrid = function () {

  var scale = this.cellScale(this.scale);

  var width  = this.config.cellSize.x * scale;
  var height = this.config.cellSize.y * scale;

  var xx = this.x % width;
  var yy = this.y % height;

  for (; xx < this.width; xx += width) {
    this.mainContext.moveTo(xx - this.config.lineWidth, 0);
    this.mainContext.lineTo(xx - this.config.lineWidth, this.height);
  };

  for (; yy < this.height; yy += height) {
    this.mainContext.moveTo(0, yy + this.config.lineWidth);
    this.mainContext.lineTo(this.width, yy + this.config.lineWidth);
  };

  this.mainContext.strokeStyle = this.config.lineColor;
  this.mainContext.lineWidth = this.config.lineWidth;

  this.mainContext.stroke();

  this.mainContext.beginPath();

  return void 0;

};

/**
 * Draw snap lines
 * @param {Object} entity
 * @method drawSnapLines
 */
CORE.Grid.prototype.drawSnapLines = function(entity) {

  var entities = this.getCurrentLayer();

  var length = entities ? entities.length : 0;
  var ii = length;

  var x = entity.x << 0;
  var y = entity.y << 0;

  var xx = 0;
  var yy = 0;

  while (ii--) {
    if (entities[ii].id !== entity.id) {
      xx = entities[ii].x << 0;
      yy = entities[ii].y << 0;
      if (x === xx || y === yy) {
        this.drawCurve(
          entity.x, entity.y,
          entities[ii].x, entities[ii].y
        );
      }
    }
  };

  this.mainContext.strokeStyle = this.config.snapLineColor;
  this.mainContext.lineWidth = 1.4 * this.scale << 0;
  this.mainContext.lineCap = this.config.lineCap;
  this.mainContext.stroke();

  return void 0;

};

/**
 * Draw entity
 * @param {Object} entity
 * @method drawEntity
 */
CORE.Grid.prototype.drawEntity = function(entity) {

  var x = ((entity.x * this.scale) + this.x) << 0;
  var y = ((entity.y * this.scale) + this.y) << 0;

  var width  = (entity.width * this.scale)  << 0;
  var height = (entity.height * this.scale) << 0;

  if (this.inView(x, y, width, height)) {
    this.getEntityModel(entity.model).update(
      this.getEntityBuffer(entity.id),
      entity,
      x, y,
      width, height
    );
  }

  return void 0;

};

/**
 * Draw entity connections
 * @method drawEntityConnections
 */
CORE.Grid.prototype.drawEntityConnections = function() {

  var entities = this.getCurrentLayer();

  var length = entities ? entities.length : 0;
  var ii = length;

  this.mainContext.beginPath();

  while (ii--) {
    this.drawEntityConnection(entities[ii]);
  };

  this.mainContext.strokeStyle = this.config.baseCurveColor;
  this.mainContext.lineWidth = 1.35 * this.scale << 0;
  this.mainContext.lineCap = this.config.lineCap;
  this.mainContext.lineJoin = this.config.lineJoin;
  this.mainContext.stroke();

  return void 0;

};

/**
 * Draw a entity connection
 * @param {Object} root
 * @method drawEntityConnection
 */
CORE.Grid.prototype.drawEntityConnection = function(root) {

  if (!root.connections || !root.connections.length) return void 0;

  var entity = null;

  var model_1 = null;
  var model_2 = null;

  var anchor_1 = null;
  var anchor_2 = null;

  var x  = .0;
  var y  = .0;
  var xx = .0;
  var yy = .0;

  var ii = 0;

  ii = root.connections.length;

  while (ii--) {
    if ((entity = this.layers[this.currentLayer][this.getEntityById(root.connections[ii].id)])) {
      model_1 = this.root.models[root.model];
      model_2 = this.root.models[entity.model];
      anchor_1 = model_2.anchors[root.connections[ii].anchor_1];
      anchor_2 = model_1.anchors[root.connections[ii].anchor_2];
      x  = this.getAnchorCoordinate(entity.x, entity.width, anchor_1.x);
      y  = this.getAnchorCoordinate(entity.y, entity.height, anchor_1.y);
      xx = this.getAnchorCoordinate(root.x, root.width, anchor_2.x);
      yy = this.getAnchorCoordinate(root.y, root.height, anchor_2.y);
      this.drawCurve(
        x, y,
        xx, yy
      );
    }
  };

  return void 0;

};

/**
 * Draw connection line
 * @method drawConnectionLine
 */
CORE.Grid.prototype.drawConnectionLine = function() {

  if (!this.activeRootConnection()) {
    return void 0;
  }

  this.mainContext.beginPath();

  this.drawCurve(
    this.rootConnection.anchor.x,
    this.rootConnection.anchor.y,
    this.mouseX / this.scale - this.x / this.scale,
    this.mouseY / this.scale - this.y / this.scale
  );

  this.mainContext.strokeStyle = this.rootConnection.entity.strokeColor;
  this.mainContext.lineWidth = 1.4 * this.scale << 0;
  this.mainContext.stroke();

  return void 0;

};

/** Text */
(function() {

  var entityAmount     = 0;
  var lastEntityAmount = 0;

  var currentLayer     = 0;
  var lastCurrentLayer = 0;

  /**
   * Draw texts
   * @param {Boolean} strict
   * @method drawTexts
   */
  CORE.Grid.prototype.drawTexts = function(strict) {

    /** Entity amount */
    entityAmount = this.getEntityAmount(this.currentLayer);

    if (strict || entityAmount !== lastEntityAmount) {
      this.entityNode.innerHTML = this.root.getText("s_Entities") + ": " + entityAmount;
    }

    lastEntityAmount = entityAmount;

    /** Current layer */
    currentLayer = this.currentLayer;

    if (strict || currentLayer !== lastCurrentLayer) {
      this.layerNode.innerHTML = this.root.getText("s_Layer") + ": " + currentLayer;
    }

    lastCurrentLayer = currentLayer;

    return void 0;

  };

})();

/**
 * Draw coordinates
 * @param {Number} x
 * @param {Number} y
 * @method drawCoordinates
 */
CORE.Grid.prototype.drawCoordinates = function(x, y) {

  this.mainContext.textAlign = "left";
  this.mainContext.textBaseline = "top";
  this.mainContext.fillStyle = this.config.textColor;

  this.mainContext.fillText(
    ((x - this.x) / this.scale << 0) +
    ", " +
    (-(y - this.y) / this.scale << 0) + ")",
    x + 14,
    y
  );

  return void 0;

};

/**
 * Draw fps
 * @method drawFps
 */
CORE.Grid.prototype.drawFps = function() {

  /** Fps */
  if (this.config.showFps) {
    if (!this.displayFps) {
      this.fpsNode.style.display = "block";
      this.displayFps = true;
    }
    if (this.nextFps <= this.now) {
      this.nextFps = this.now + 1E3;
      this.fpsNode.innerHTML = this.root.getText("s_Fps") + ": " + this.fps.toFixed(1);
    }
  } else {
    if (this.displayFps) {
      this.fpsNode.style.display = "none";
      this.displayFps = false;
    }
  }

  return void 0;

};