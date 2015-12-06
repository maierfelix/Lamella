"use strict";

/**
 * Redraw a entity
 * @param {Number} id
 * @method redrawEntity
 */
CORE.Grid.prototype.redrawEntity = function(id) {

  var entity = this.layers[this.currentLayer][this.getEntityById(id)];

  if (entity === null || entity === void 0) {
    return void 0;
  }

  this.bufferEntity(entity);

  return void 0;

};

/**
 * Scale entities
 * @method scaleEntities
 */
CORE.Grid.prototype.scaleEntities = function() {

  var ii = 0;

  var entities = null;

  entities = this.getCurrentLayer();

  if (!entities) return void 0;

  ii = entities.length;

  while (ii--) {
    this.bufferEntity(entities[ii]);
  };

  entities = null;

  return void 0;

};

/**
 * Buffer a scaled entity
 * @param {Object} entity
 * @method bufferEntity
 */
CORE.Grid.prototype.bufferEntity = function(entity) {

  var buffer = this.createCanvasBuffer(
    (entity.width * this.scale)  << 0,
    (entity.height * this.scale) << 0
  );

  this.root.models[entity.model].draw(
    buffer,
    entity,
    0,
    0,
    this.scale
  );

  this.parent.Cache.cacheBuffer(
    entity.id,
    buffer
  );

  buffer = void 0;
  buffer = null;

};

/**
 * Get entity buffer
 * @param {Number} id Entity id
 * @method getEntityBuffer
 */
CORE.Grid.prototype.getEntityBuffer = function(id) {

  return (this.parent.Cache.buffers[id]);

};

/**
 * Evaluate a entity
 * @param {Number}  layer
 * @method evalEntities
 */
CORE.Grid.prototype.evalEntities = function(layer) {

  var layer = layer >= 0 ? layer : this.currentLayer;

  if (!this.layers.hasOwnProperty(layer)) return void 0;

  for (var ii = 0; ii < this.layers[layer].length; ++ii) {
    this.evalEntity(this.layers[layer][ii].id);
  };

  return void 0;

};

/**
 * Evaluate a entity
 * @param {Number} id Entity id
 * @method evalEntity
 * @return {Number}
 */
CORE.Grid.prototype.evalEntity = function(id) {

  var value = .0;

  var output = null;
  var entity = null;

  entity = this.layers[this.currentLayer][this.getEntityById(id)];

  if (entity === null || entity === void 0) {
    return void 0;
  }

  if (this.root.models[entity.model].evaluate === void 0) {
    return void 0;
  }

  value = this.root.models[entity.model].evaluate(entity);

  output = this.getEntityOutputConnection(entity.id);

  if (output) {
    console.log(value);
  }

  return (value);

};

/**
 * Get entity anchor output connection
 * @param {Number} id Entity id
 * @method getEntityOutputConnection
 * @return {Number}
 */
CORE.Grid.prototype.getEntityOutputConnection = function(id) {

  var model = null;

  var entity = null;

  entity = this.layers[this.currentLayer][this.getEntityById(id)];

  if (entity === null || entity === void 0) {
    return void 0;
  }

  model = this.getEntityModel(entity.model);

  if (model === null || model === void 0) {
    return void 0;
  }

  for (var ii = 0; ii < entity.connections.length; ++ii) {
    if (entity.connections[ii].anchor_2 === model.outputAnchor) {
      return (entity.connections[ii].id);
    }
  };

  return void 0;

};

/**
 * Get connected entities
 * @param {Number} id Entity id
 * @method getConnectedEntities
 * @return {Array}
 */
CORE.Grid.prototype.getConnectedEntities = function(id) {

  var model = null;

  var entity = null;

  var connections = [];

  entity = this.layers[this.currentLayer][this.getEntityById(id)];

  if (entity === null || entity === void 0) {
    return void 0;
  }

  model = this.getEntityModel(entity.model);

  if (model === null || model === void 0) {
    return void 0;
  }

  for (var ii = 0; ii < entity.connections.length; ++ii) {
    if (entity.connections[ii].anchor_2 !== model.outputAnchor) {
      connections.push(entity.connections[ii].id);
    }
  };

  return (connections);

};

/**
 * Get entity model
 * @param {Number} id Entity id
 * @method getEntityModel
 */
CORE.Grid.prototype.getEntityModel = function(model) {

  return (this.root.models[model]);

};

/**
 * Get entity amount
 * @method getEntityAmount
 * @return {Number}
 */
CORE.Grid.prototype.getEntityAmount = function() {

  return (this.layers[this.currentLayer] ? this.layers[this.currentLayer].length : 0);

};

/**
 * Get entity by index
 * @param {Number} index
 * @method getEntityByIndex
 * @return {Object}
 */
CORE.Grid.prototype.getEntityByIndex = function(index) {

  return (this.getEntityById(this.entityIndexToId(index), true));

};

/**
 * Get entity by id
 * @param {Number} layer
 * @param {Boolean} pointer Return entity as object pointer
 * @method getEntityById
 * @return {Number}
 */
CORE.Grid.prototype.getEntityById = function(id, pointer) {

  if (!this.layers[this.currentLayer]) return void 0;

  var ii = this.layers[this.currentLayer].length;

  while (ii--) {
    if (this.layers[this.currentLayer][ii].id === id) {
      if (pointer === true) {
        return (this.layers[this.currentLayer][ii]);
      }
      return (ii);
    }
  };

  return void 0;

};

/**
 * Get entity by id
 * @param {String} id
 * @method getEntityIndexById
 * @return {Number}
 */
CORE.Grid.prototype.getEntityIndexById = function(id) {

  if (!this.layers[this.currentLayer]) return void 0;

  var ii = this.layers[this.currentLayer].length;

  while (ii--) {
    if (this.layers[this.currentLayer][ii].id === id) {
      return (ii);
    }
  };

  return void 0;

};

/**
 * Return entity id by index
 * @param {Number} index
 * @method entityIndexToId
 * @return {Number}
 */
CORE.Grid.prototype.entityIndexToId = function(index) {

  if (this.layers[this.currentLayer]) {
    if (this.layers[this.currentLayer][index]) {
      return (this.layers[this.currentLayer][index].id || void 0);
    }
  }

  return void 0;

};

/**
 * Get entities
 * @param {Number} x
 * @param {Number} y
 * @method getEntities
 * @return {Boolean}
 */
CORE.Grid.prototype.getEntities = function(x, y) {

  var ii = 0;

  var entities = null;
  var model    = null;
  var entity   = null;

  var entities = this.getCurrentLayer();

  if (!entities) return (false);

  var entity = null;

  var ii = entities.length;

  while (ii--) {
    if (model = this.models[entities[ii].model]) {
      if (model !== void 0) {
        if (
          model(
            entities[ii].x, entities[ii].y,
            entities[ii].width, entities[ii].height,
            x, y
          )
        ) {
          entity = entities[ii];
        }
      }
    }
  };

  this.updateCursor(entity);

  this.entitySelected = entity;

  entities = null;

  return (entity !== null);

};