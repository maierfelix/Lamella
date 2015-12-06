"use strict";

/**
 * Get settings from localstorage
 * @param {String} key
 * @method getStorage
 * @return {String}
 */
LAMELLA.prototype.getStorage = function(key) {

  return (localStorage.getItem(key));

  return void 0;

};

/**
 * Update localstorage settings
 * @param {String} key
 * @param {*}      value
 * @method setStorage
 */
LAMELLA.prototype.setStorage = function(key, value) {

  localStorage.setItem(key, JSON.stringify(value));

  return void 0;

};

/**
 * Remove localstorage settings
 * @param {String} key
 * @method rmStorage
 */
LAMELLA.prototype.rmStorage = function(key) {

  localStorage.removeItem(key);

  return void 0;

};