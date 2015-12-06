"use strict";

/**
 * Depth sorting
 * @param {Array} array
 * @method depthSort
 * @return {Array}
 */
CORE.Grid.prototype.depthSort = function(array) {

  var ii = 0;
  var jj = 0;

  var key = null;

  var length = array.length;

  var configAxis = this.config.depth[0];
  var configSize = this.config.depth[1];

  for (; ii < length; ++ii) {
    jj = ii;
    key = array[jj];
    for (; jj > 0 && array[jj - 1][configAxis] + (array[jj - 1][configSize] / 2) < key[configAxis] + (key[configSize] / 2); --jj) {
      array[jj] = array[jj - 1];
    };
    array[jj] = key;
  };

  return (array);

};