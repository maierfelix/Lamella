"use strict";

(function() {

  var root = this;

  var $ = function() {
    return document.querySelector(arguments[0]);
  };

  /**
   * Script
   * @class Script
   */
  function Script() {

    this.path = arguments[0] || void 0;

    this.fullPath = void 0;

    this.target = arguments[1] || void 0;

  };

  Script.prototype = Script;
  Script.constructor = Script;

  /**
   * Kill a Script, remove it from the DOM
   * @method kill
   */
  Script.prototype.kill = function() {

    var items = document.getElementsByTagName("script");

    for (var ii = 0; ii < items.length; ++ii) {
      if (items[ii].getAttribute("src") === this.fullPath) {
        if (this.target === items[ii].parentNode) {
          if (this.target.nodeName === items[ii].parentNode.nodeName) {
            items[ii].parentNode.removeChild(items[ii]);
          }
        }
        break;
      }
    };

  };

  /**
   * Get full path of a Script
   * @method getFullPath
   */
  Script.prototype.getFullPath = function() {

    return (this.fullPath);

  };

  /**
   * Set full path of a Script
   * @method setFullPath
   */
  Script.prototype.setFullPath = function() {

    this.fullPath = arguments[0];

  };

  /**
   * Get path of a Script
   * @method getPath
   */
  Script.prototype.getPath = function() {

    return (this.path);

  };

  /**
   * Get target of a Script
   * @method getTarget
   */
  Script.prototype.getTarget = function() {

    return (this.target);

  };

  /**
   * Set target of a Script
   * @method setTarget
   */
  Script.prototype.setTarget = function() {

    this.target = arguments[0];

  };

  /**
   * Importer
   * @class Importer
   */
  function Importer() {

    /** @type {boolean} */
    this.antiCache = false;

    /** @type {object} Queued scripts to load */
    this.queue = {};

    /** @type {number} Queue position */
    this.position = 0;

    /** @type {number} Steps to do */
    this.step = void 0;

    /** @type {string} Target to attach scripts to */
    this.target = void 0;

    /** @type {number} Delay between each step */
    this.delay = void 0;

    /** @type {function} Function to be fired each step */
    this.onProgress = void 0;

    /** @type {function} Function to be fired when finished */
    this.onFinish = void 0;

  };

  Importer.prototype = Importer;
  Importer.constructor = Importer;

  /**
   * Add scripts to the queue
   * @method addToQueue
   */
  Importer.prototype.addToQueue = function(data) {

    var script = null;

    if (arguments.length > 1) {
      for (var ii = 0; ii < arguments.length; ++ii) {
        this.addToQueue(arguments[ii]);
      };
      return void 0;
    }

    if (data instanceof Array && data.length) {
      for (var ii = 0; ii < data.length; ++ii) {
        if (data[ii].length) {
          script = new Script(data[ii]);
          this.queue[data[ii]] = script;
        }
      };
      return void 0;
    }

    if (typeof(data) === "string" || data instanceof String) {
      if (data.length) {
        script = new Script(data);
        this.queue[data] = script;
      }
      return void 0;
    }

  };

  /**
   * Load queued scripts
   * @param {object} item Script
   * @param {function} resolve Callback
   * @method loadScript
   */
  Importer.prototype.loadScript = function(item, resolve) {

    var self = this;

    var antiCache = this.antiCache ? "?import&" + (+new Date()) : "";

    item.setTarget(this.target);
    item.setFullPath(item.getPath() + antiCache);
    item = item.getPath();

    var type = item.substr(item.lastIndexOf('.') + 1);

    if (type === "js") type = "javascript";
    if (type === "coffee") type = "coffeescript";

    var script = document.createElement("script");
        script.src = item + antiCache;
        script.type = "text/javascript";

    if (type === "javascript") {
      script.addEventListener('load', function() {
        resolve(item);
      });
    } else if (type === "coffeescript") {
      if (window.AJAX) {
        script.removeAttribute("src");
        AJAX.GET(item, function(data) {
          script.innerHTML = CoffeeScript.compile(data, {bare: true});
          this.appendScript(script);
          resolve(item);
        }.bind(this));
      }
    } else {
      resolve(item);
    }

    this.appendScript(script);

  };

  /**
   * Append a script
   * @param {object} script Script element
   * @method appendScript
   */
  Importer.prototype.appendScript = function(script) {

    if (this.target !== void 0) {
      if (typeof(this.target) === "string" || this.target instanceof String) {
        if ($(this.target)) {
          $(this.target).appendChild(script);
          return void 0;
        }
      }
      if (this.target instanceof Node ||
          this.target instanceof Element ||
          this.target instanceof HTMLElement) {
          if (typeof this.target.appendChild == "function") {
            this.target.appendChild(script);
          }
      }
      return void 0;
    }

    if (document.head) document.head.appendChild(script);
    else if (document.body) document.body.appendChild(script);

  };

  /**
   * Get *first* item from the queue
   * @method getQueueItem
   */
  Importer.prototype.getQueueItem = function() {

    return (this.queue[Object.keys(this.queue)[0]]);

  };

  /**
   * Remove item from the queue
   * @method removeFromQueue
   */
  Importer.prototype.removeFromQueue = function(name) {

    if (this.queue[name]) {
      delete this.queue[name];
    }

  };

  /**
   * Run the importer
   * @method run
   */
  Importer.prototype.run = function() {

    var self = this;

    var length = Object.keys(this.queue).length;

    if (!this.step) {
      this.step = Math.ceil(1e2 / length);
    }

    if (length <= 0) {
      if (this.onFinish && this.onFinish instanceof Function) {
        this.onFinish();
      }
      this.clear();
      return void 0;
    }

    this.position += this.step;

    if (this.delay) {
      setTimeout(function() {
        self.load();
      }, this.delay);
    } else {
      this.load();
    }

  };

  /**
   * Load process
   * @method load
   */
  Importer.prototype.load = function() {

    var self = this;

    var item = this.getQueueItem();
    if (!item) return void 0;
    this.loadScript(item, function(name) {
      if (self.onProgress && self.onProgress instanceof Function) {
        item = self.getQueueItem();
        self.onProgress(self.position, self.queue[name]);
        self.removeFromQueue(item.path);
        self.run();
      } else {
        item = self.getQueueItem();
        self.removeFromQueue(item.path);
        self.run();
      }
    });

  };

  /**
   * Reset instance
   * @method clear
   */
  Importer.prototype.clear = function() {

    this.queue = {};

    this.position = 0;

    this.step = this.delay = this.target = this.onProgress = this.onFinish = void 0;

  };

  Importer = new Importer();
  root.Importer = Importer;

}).call(this);