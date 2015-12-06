"use strict";

/**
 * Cache
 * @class CORE_Cache
 * @constructor
 */
CORE.Cache = function() {

  /**
   * Cached paths
   * @type {Object}
   */
  this.paths = {};

  /**
   * Cached files
   * @type {Object}
   */
  this.files = {};

  /**
   * Cached buffers
   * @type {Object}
   */
  this.buffers = {};

};

CORE.Cache.prototype.constructor = CORE.Cache;

/**
 * Check if a file exists in here
 * @param {String} path File path
 * @return {String}
 * @method exists
 * @return {Boolean}
 */
CORE.Cache.prototype.exists = function(path) {

  return (this.paths.hasOwnProperty(path));

};

/**
 * Get file cache index
 * @param {String} path File path
 * @param {Boolean} cache Cache data or path only
 * @param {Function} resolve Callback
 * @method get
 */
CORE.Cache.prototype.get = function(path, cache, resolve) {

  /** File already cached */
  if (this.exists(path)) {
    resolve(this.files[path]);
  } else {
    this.set(path, cache, function(data) {
      resolve(data);
    }.bind(this));
  }

  return void 0;

};

/**
 * Cache a buffer
 * @param {String} name
 * @param {Object} data
 * @method cacheBuffer
 */
CORE.Cache.prototype.cacheBuffer = function(name, data) {

  if (this.buffers[name]) {
    this.buffers[name] = null;
    delete this.buffers[name];
  }

  this.buffers[name] = data;

  return void 0;

};

/**
 * Cache a file
 * @param {String} path File path
 * @param {Boolean} cache Cache data or path only
 * @param {Function} resolve
 * @method set
 */
CORE.Cache.prototype.set = function(path, cache, resolve) {

  if (this.exists[path]) {
    return void 0;
  }

  /** Maybe future cache date expire? */
  this.paths[path] = +new Date();

  this.parent.Network.GET(path + "?" + this.paths[path], function(data) {
    if (data instanceof Error) {
      delete this.paths[path];
      resolve(data);
    } else {
      if (cache) this.files[path] = data;
      resolve(this.files[path]);
    }
  }.bind(this));

  return void 0;

};

/**
 * Update data of cached file
 * @param {String} path
 * @param {*} data
 * @method update
 * @return {Boolean}
 */
CORE.Cache.prototype.update = function(path, data) {

  if (!this.exists(path)) return (false);

  this.files[path] = data;

  return (true);

};

/**
 * Get full cached file path
 * @param {String} path File path
 * @return {String} Cached file path
 * @method getPath
 * @return {String}
 */
CORE.Cache.prototype.getPath = function(path) {

  /** File got propably cached */
  if (this.exists(path)) {
    return (path + "?" + this.paths[path]);
  }

  return void 0;

};

/**
 * Clear the cache
 * @method clear
 */
CORE.Cache.prototype.clear = function() {

  this.files = this.paths = {};

  return void 0;

};