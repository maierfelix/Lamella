"use strict";

/**
 * Add event listeners
 * @param {Array} types
 * @method addListeners
 */
CORE.Grid.prototype.addListeners = function(types) {

  while (types.length) {
    window.addEventListener(types.shift(), this.event.bind(this), false);
  };

  return void 0;

};

/**
 * Valid target
 * @param {String} target
 * @method validTarget
 * @return {Boolean}
 */
CORE.Grid.prototype.validTarget = function(target) {

  for (var ii = 0; ii < this.targets.length; ++ii) {
    if (target.id === this.targets[ii]) {
      return (true);
    }
  };

  return (false);

};

/**
 * Event handling
 * @param {Object} e Event
 * @method event
 */
CORE.Grid.prototype.event = function(e) {

  if (this.root.Hud.activeScene) {
    /** Following events are invulnerable */
    if (e.type !== "resize" &&
        e.type !== "contextmenu" &&
        e.type !== "selectstart") {
      return void 0;
    }
  }

  switch (e.type) {

    case "keydown":
    case "keyup":
      /** CTRL key pressed */
      this.MODES.SNAP = this.keyPressed["CTRL"] || false;
      /** SHIFT key pressed */
      this.MODES.RESIZE = this.keyPressed["SHIFT"] || false;
      /** Handle key */
      this.keyFire(e);
    break;

    case "mousedown":
      this.MODES.NAVIGATE = this.validTarget(e.target);
      this.click(e.clientX, e.clientY);
      this.move(e.clientX, e.clientY);
    break;

    case "touchstart":
      e.preventDefault();
      e.stopPropagation();
      this.MODES.NAVIGATE = this.validTarget(e.target);
      this.getEntities(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
      this.click(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
    break;

    case "mousemove":
      this.move(e.clientX, e.clientY);
    break;

    case "touchmove":
      e.preventDefault();
      e.stopPropagation();
      /** Pinch zoom? */
      if (e.touches.length === 2) {
        this.pinch(e);
      } else {
        this.move(
          e.changedTouches[0].clientX,
          e.changedTouches[0].clientY
        );
      }
    break;

    case "mouseup":
    case "touchend":
      this.killEntityInteraction();
    break;

    case "mousewheel":
    case "DOMMouseScroll":
      e.preventDefault();
      e.stopPropagation();
      this.zoom(crossBrowserScroll(e));
      return (false);
    break;

    case "contextmenu":
    case "selectstart":
      if (this.validTarget(e.target)) {
        this.killEntityConnection();
        /** Open entity settings */
        if (this.dragEntities(e.clientX, e.clientY) && this.entitySelected) {
          var anchor = null;
          if (anchor = this.getAnchorByPosition(this.entitySelected, e.clientX, e.clientY)) {
            this.killAnchorConnection(this.entitySelected, anchor.id, false);
          } else {
            console.log("Open entity settings scene");
          }
        }
        e.preventDefault();
      }
    break;

    case "resize":
      this.resize();
    break;

  };

  return void 0;

};

/**
 * Handle specific keys
 * @param {Object} e
 * @param {Number} key
 * @method keyFire
 */
CORE.Grid.prototype.keyFire = function(e) {

  switch (e.keyCode) {

    /** Kill entity connection by ESC key */
    case 27:
      if (this.root.Core.Grid.activeRootConnection()) {
        this.root.Core.Grid.killEntityConnection();
      }
    return void 0;

    /** Delete entity */
    case 46:
      //this.deleteEntity(this.entitySelected);
    return void 0;

    /** Refresh page */
    case 116:
      window.location.reload();
      //this.evalEntities();
    break;

    /**
     * Invulnerable keys:
     *
     * Fullscreen
     * Developer tools
     */
    case 122:
    case 123:
    return void 0;

  };

  e.preventDefault();
  e.stopPropagation();

  return void 0;

};

/**
 * Click
 * @param {Number} x
 * @param {Number} y
 * @method click
 */
CORE.Grid.prototype.click = function(x, y) {

  this.drag.sx = (x - this.x) / this.scale;
  this.drag.sy = (y - this.y) / this.scale;

  this.entityDrag.x = x;
  this.entityDrag.y = y;

  this.sync(x, y);

  return void 0;

};

/**
 * Grid only drag state check
 * @method draggingGridOnly
 * @return {Boolean}
 */
CORE.Grid.prototype.draggingGridOnly = function() {

  if (
    !this.entitySelected &&
    !this.MODES.DRAG &&
    this.MODES.NAVIGATE
  ) { return (true); }

  return (false);

};

/**
 * Active root connection
 * @method activeRootConnection
 * @return {Boolean}
 */
CORE.Grid.prototype.activeRootConnection = function() {

  return (
    this.rootConnection.entity !== null &&
    this.rootConnection.anchor !== null
  );

};

/**
 * Move the grid
 * @param {Number} x
 * @param {Number} y
 * @method move
 */
CORE.Grid.prototype.move = function(x, y) {

  /** Mouse position for displaying mouse coordinates */
  this.mouseX = x;
  this.mouseY = y;

  if (
    !this.draggingGridOnly() &&
    this.dragEntities(x, y) ||
    this.MODES.DRAG
  ) { return void 0; }

  this.x += x - this.drag.px;
  this.y += y - this.drag.py;

  this.sync(x, y);

  return void 0;

};

/**
 * Touch pinch
 * @param {Object} e Event
 * @method pinch
 */
CORE.Grid.prototype.pinch = function(e) {

  /** Valid touch targets */
  if (e.touches !== void 0) {
    if (
      !this.validTarget(e.touches[0].target) ||
      !this.validTarget(e.touches[1].target)
    ) { return void 0; }
  }

  if (this.MODES.DRAG) return void 0;

  if (!this.pinchZoomGrid) {
    this.pinchZoom.x = this.drag.px;
    this.pinchZoom.y = this.drag.py;
    this.pinchZoomGrid = true;
  }

  var midpoint = this.midpoint(
    this.drag.px,
    this.drag.py,
    this.pinchZoom.x,
    this.pinchZoom.y
  );

  this.zoom({
    clientX: midpoint.x,
    clientY: midpoint.y,
    dir: e.scale >= 1 ? 0 : 1,
    amount: e.scale >= 1 ? -(this.config.zoomFactor * 0.5) : (this.config.zoomFactor * 0.5)
  });

  midpoint = null;

  return void 0;

};

/**
 * Resize
 * @param {Boolean} redraw
 * @method resize
 */
CORE.Grid.prototype.resize = function(redraw) {

  this.width  = window.innerWidth;
  this.height = window.innerHeight;

  this.mainNode.width  = this.width;
  this.mainNode.height = this.height;

  this.centerDrag();

  return void 0;

};

/**
 * Kill entity connection mode
 * @method killEntityConnection
 */
CORE.Grid.prototype.killEntityConnection = function() {

  this.MODES.CONNECT = false;
  this.rootConnection.entity = null;
  this.rootConnection.anchor = null;

};

/**
 * Kill entity interactions
 * @method killEntityInteraction
 */
CORE.Grid.prototype.killEntityInteraction = function() {

  this.MODES.NAVIGATE = false;
  this.MODES.DRAG     = false;
  this.MODES.SNAP     = false;
  this.pinchZoomGrid  = false;

  this.entitySelected = null;

  return void 0;

};