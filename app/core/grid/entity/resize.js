"use strict";

/**
 * Snap entity
 * @param {Object} entity
 * @method resizeEntity
 */
CORE.Grid.prototype.resizeEntity = function(entity) {

  var entities = this.getCurrentLayer();

  var length = entities ? entities.length : 0;
  var ii = length;

  while (ii--) {
    if (entities[ii].id !== entity.id) {
      console.log(entity);
    }
  };

  return void 0;

};