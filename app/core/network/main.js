"use strict";

/**
 * Network
 * @class CORE_Network
 * @constructor
 */
CORE.Network = function() {

};

CORE.Network.prototype.constructor = CORE.Network;

/**
 * Connect
 * @param {Function} resolve Callback
 * @method connect
 */
CORE.Network.prototype.connect = function(resolve) {

  resolve();

  return void 0;

};

/**
 * Ajax GET api
 * @param {String} path File path
 * @param {Function} resolve
 * @method GET
 */
CORE.Network.prototype.GET = function(path, resolve) {

  AJAX.GET(path, function(data) {
    resolve(data);
  });

  return void 0;

};

/**
 * Ajax POST api
 * @param {String} path File path
 * @param {*} data
 * @param {Function} resolve
 * @method POST
 */
CORE.Network.prototype.POST = function(path, data, resolve) {

  AJAX.POST(path, data, function(data) {
    resolve(data);
  });

  return void 0;

};