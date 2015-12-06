"use strict";

/**
 * Interpreter
 * @class INTERPRETER
 * @constructor
 */
function INTERPRETER() {

  /** Root config pointer */
  this.Config = void 0;

  /** Root pointer */
  this.root = void 0;

};

INTERPRETER.prototype.constructor = INTERPRETER;

/**
 * Initialise the core
 * Recursive async build step system
 * @param {Number} stage Stage process
 * @param {Function} resolve Deep callback
 * @method init
 */
INTERPRETER.prototype.init = function(stage, resolve) {

  /** Link to root */
  if (!this.Config && this.root) {
    this.Config = this.root.Config;
  }

  /**
   * 0: Initialise
   */
  switch (stage) {

    case 0:
      this.init(++stage, resolve);
    return void 0;

  };

  /** Initialised successfully */
  resolve();

  return void 0;

};

/**
 * Calculate
 * @param {String} op
 * @param {Number} a
 * @param {Number} b
 * @method calc
 * @return {Number}
 */
INTERPRETER.prototype.calc = function(op, a, b) {

  if (op === "+") return (a + b);
  if (op === "-") return (a - b);
  if (op === "*") return (a * b);
  if (op === "×") return (a * b);
  if (op === "/") return (a / b);
  if (op === "%") return (a % b);
  if (op === "^") return (Math.pow(a, b));

  return (0);

};