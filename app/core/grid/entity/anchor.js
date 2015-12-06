"use strict";

/**
 * Get a anchors coordinate
 * @param {Number} xy    Entity x y
 * @param {Number} xy    Entity width height
 * @param {Number} coord Anchor coord
 * @method getAnchorCoordinate
 * @return {Number}
 */
CORE.Grid.prototype.getAnchorCoordinate = function(xy, wh, coord) {

  return (xy - wh + (coord / this.scale));

};

/**
 * Get a anchors radius
 * @param {Object} entity
 * @param {Object} anchor
 * @method getAnchorRadius
 * @return {Number}
 */
CORE.Grid.prototype.getAnchorRadius = function(entity, anchor) {

  return (
    (this.sizeToRadius(entity.width, entity.height) -
    (this.radiusToDiameter(anchor.radius / this.scale) / 2)) - this.scale / 2
  );

};

/**
 * Connect root connection
 * entity with passed in entity
 * @param {Object} entity
 * @param {Object} anchor
 * @method connectWithEntity
 */
CORE.Grid.prototype.connectWithEntity = function(entity, anchor) {

  var rootEntity = this.rootConnection.entity;

  rootEntity.connections.push({
    id: entity.id,
    anchor_1: anchor.id,
    anchor_2: this.rootConnection.anchor.id
  });

  entity.connections.push({
    id: rootEntity.id,
    anchor_1: this.rootConnection.anchor.id,
    anchor_2: anchor.id
  });

};

/**
 * Get a circular entity anchor
 * by coordinates
 * @param {Object} entity
 * @param {Object} model Entity model
 * @param {Number} x Mouse x
 * @param {Number} x Mouse y
 * @method getAnchorByPosition
 * @return {Object}
 */
CORE.Grid.prototype.getAnchorByPosition = function(entity, x, y) {

  var ii     = 0;
  var length = 0;

  var radius = .0;

  var model = null;

  var obj = {
    id: -1,
    x: .0,
    y: .0
  };

  model  = this.root.models[entity.model];
  length = model.anchors.length;

  for (; ii < length; ++ii) {
    radius = this.getAnchorRadius(entity, model.anchors[ii]);
    obj.x = this.getAnchorCoordinate(entity.x, entity.width, model.anchors[ii].x);
    obj.y = this.getAnchorCoordinate(entity.y, entity.height, model.anchors[ii].y);
    if (
      this.circularCollision(
        obj.x, obj.y, radius, radius, x, y
      )
    ) {
      obj.id = ii;
      return (obj);
    }
  };

  return void 0;

};

/**
 * Kill a entity connection
 * @param {Object}  entity
 * @param {Object}  anchor
 * @param {Boolean} deep
 * @method killAnchorConnection
 */
CORE.Grid.prototype.killAnchorConnection = function(entity, anchor, deep) {

  var ii   = 0;
  var id   = 0;
  var node = 0;

  if (!entity || !entity.hasOwnProperty("connections") || !entity.connections.length) return void 0;

  for (ii = 0; ii < entity.connections.length; ++ii) {
    if (entity.connections[ii].anchor_2 === anchor) {
      id = entity.connections[ii].id;
      node = entity.connections[ii].anchor_1;
      entity.connections.splice(ii, 1);
      if (!deep) {
        this.killAnchorConnection(
          this.layers[this.currentLayer][this.getEntityById(id)],
          node,
          true
        );
        return void 0;
      }
      console.log("Delete connected entity: ", id, node);
    }
  };

  return void 0;

};