"use strict";

/**
 * Drag entities
 * @param {Number} x
 * @param {Number} y
 * @method dragEntities
 * @return {Boolean}
 */
CORE.Grid.prototype.dragEntities = function(x, y) {

  /** Entity editing disabled */
  if (!this.config.editable) {
    this.MODES.DRAG = false;
    this.entitySelected = null;
    return (true);
  }

  /** Drag entities */
  if (this.MODES.NAVIGATE) {

    /** Watch for a entity to drag */
    if (!this.MODES.DRAG) {
      if (this.getEntities(x, y)) {
        this.MODES.DRAG = true;
      }
    }

    if (this.MODES.DRAG) {
      this.dragEntity(this.entitySelected, x, y);
    }

  } else {
    this.getEntities(x, y);
    return (true);
  }

  return (false);

};

/**
 * Drag a entity
 * @param {Object} entity
 * @param {Number} x
 * @param {Number} y
 * @method dragEntity
 */
CORE.Grid.prototype.dragEntity = function(entity, x, y) {

  if (!entity) return void 0;

  var anchor = null;

  entity.x += (x - this.entityDrag.x) / this.scale;
  entity.y += (y - this.entityDrag.y) / this.scale;

  /** Snap entity */
  if (this.MODES.SNAP) {
    this.snapEntity(entity);
  }

  /** Resize entity */
  if (this.MODES.RESIZE) {
    this.resizeEntity(entity);
  }

  /** Anchor connection start? */
  this.MODES.CONNECT = (anchor = this.getAnchorByPosition(entity, x, y)) !== void 0;
  if (this.MODES.CONNECT) {
    if (this.activeRootConnection()) {
      /** User want to connect two entities */
      if (this.rootConnection.entity.id !== entity.id) {
        this.connectWithEntity(entity, anchor);
      }
    }
    this.rootConnection.entity = entity;
    this.rootConnection.anchor = anchor;
  } else {
    this.rootConnection.entity = null;
    this.rootConnection.anchor = null;
  }

  this.entityDrag.x = x;
  this.entityDrag.y = y;

  return void 0;

};