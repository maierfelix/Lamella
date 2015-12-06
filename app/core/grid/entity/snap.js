"use strict";

/**
 * Snap entity
 * @param {Object} entity
 * @method snapEntity
 */
CORE.Grid.prototype.snapEntity = function(entity) {

  var entities = this.getCurrentLayer();

  var length = entities ? entities.length : 0;
  var ii = length;

  var gridX = this.config.cellSize.x;
  var gridY = this.config.cellSize.y;

  while (ii--) {
    if (entities[ii].id !== entity.id) {
      entity.x = Math.round(entity.x / gridX) * gridX;
      entity.y = Math.round(entity.y / gridY) * gridY;
    }
  };

  return void 0;

};