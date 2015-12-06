"use strict";

(function() {

  var AJAX = AJAX || {};

  /**
   * Initialise
   * @method init
   */
  AJAX.init = function() {

    var modes = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Microsoft.XMLHTTP"];

    if (window.ActiveXObject) {
      for (var ii = 0; ii < modes.length; ++ii) {
        try {
          return new window.ActiveXObject(modes[ii]);
        } catch (e) {
          throw Error(e);
        }
      };
    } else {
      if (window.XMLHttpRequest) {
        return (new window.XMLHttpRequest());
      } else {
        return (new window.XMLHttpRequest());
      }
    }

  };

  /**
   * POST request
   * @param {String} url
   * @param {*} data
   * @param {Function} resolve Callback
   * @method POST
   */
  AJAX.POST = function(url, data, resolve) {

    var req = new this.init();

    req.onload = function() {

      if (4 === this.readyState && 200 === this.status) {
        resolve(this.responseText);
      } else {
        throw Error("Status code was " + this.status);
      }

    };

    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send("data=" + data);

  };

  /**
   * GET request
   * @param {String} url
   * @param {Function} resolve Callback
   * @method GET
   */
  AJAX.GET = function(url, resolve) {

    var req = new this.init();

    req.onload = function() {

      if (this.status === 200) {
        resolve(this.responseText);
      } else {
        resolve(Error("Status code was " + this.status));
      }

    };

    req.open("GET", url, true);
    req.send();

  };

  this.AJAX = AJAX;

}).call(this);