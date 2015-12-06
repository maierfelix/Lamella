"use strict";

/**
 * Zoom
 * @param {Object} e
 * @method zoom
 */
CORE.Grid.prototype.zoom = function(e) {

  this.scale = this.zoomScale(this.z);

  e.amount = (e.dir ? -this.config.zoomFactor : this.config.zoomFactor) + e.amount;
  e.amount = e.amount / (this.distance(0, 0, this.width, this.height) / this.config.gridFactor) * this.zoomScale(this.z);

  if ((this.currentLayer + this.z) + e.amount <= 1) return void 0;

  if (this.MODES.NAVIGATE) {
    this.move(e.clientX, e.clientY);
  } else {
    this.click(e.clientX, e.clientY);
  }

  if (this.MODES.DRAG) {
    /** Drag zoom entity to a different layer */
    if (this.entitySelected) {
      /** Drag entity into deeper layer */
      if (this.z + e.amount >= this.config.zFactor) {
        /** Layer not existing yet */
        if (!this.layers[this.currentLayer + 1]) this.layers[this.currentLayer + 1] = [];
        this.layers[this.currentLayer + 1].push(this.entitySelected);
        this.layers[this.currentLayer].splice(this.getEntityIndexById(this.entitySelected.id), 1);
      /** Drag entity into higher layer */
      } else if (this.z < 0) {
        if (!this.layers[this.currentLayer - 1]) this.layers[this.currentLayer - 1] = [];
        this.layers[this.currentLayer - 1].push(this.entitySelected);
        this.layers[this.currentLayer].splice(this.getEntityIndexById(this.entitySelected.id), 1);
      }
    }
    this.click(e.clientX, e.clientY);
  }

  this.drag.pz = this.z;

  if (this.z + e.amount >= this.config.zFactor) {
    this.z = 0;
    this.killEntityConnection();
    this.currentLayer++;
    this.move(e.clientX, e.clientY);
    this.click(e.clientX, e.clientY);
  } else if (this.z < 0) {
    this.z = this.config.zFactor;
    this.killEntityConnection();
    this.currentLayer--;
    this.move(e.clientX, e.clientY);
    this.click(e.clientX, e.clientY);
  } else {
    this.z += e.amount;
  }

  this.x -= (this.drag.sx) * (this.zoomScale(this.z) - this.zoomScale(this.drag.pz));
  this.y -= (this.drag.sy) * (this.zoomScale(this.z) - this.zoomScale(this.drag.pz));

  /** Dirty hack */
  if (!this.MODES.NAVIGATE && this.z + e.amount < this.config.zFactor && this.z >= 0) {
    this.getEntities(e.clientX, e.clientY);
  }

  return void 0;

};