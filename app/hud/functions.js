"use strict";

/**
 * Translate a HTML scene
 * @param {Object} html
 * @method translateScene
 */
HUD.prototype.translateScene = function(html) {

  html = this.parseHTML(html);

  var self = this;

  var _translateNode = function(str) {
    return (self.root.getText(str));
  };

  var _translate = function(node) {
    for (var key in node) {
      if (node.key !== "style" && key === "data-lang") {
        node.text = _translateNode(node[key]);
      }
    };
    if (node.inside) {
      for (var ii = 0; ii < node.inside.length; ++ii) {
        _translate(node.inside[ii]);
      };
    }
    return (node);
  };

  return (this.parseJSON(_translate(html))[0]);

};

/**
 * HTML to Object
 * @param {Object} html
 * @method parseHTML
 */
HUD.prototype.parseHTML = function(html) {

  if (!(html instanceof HTMLElement)) {
    if (typeof html === "string") {
      var el = document.createElement("container");
      el.insertAdjacentHTML("beforeend", html);
      html = el;
    }
  }

  var node = {
    key: html.tagName.toLowerCase(),
    inside: []
  };

  var child = null;

  if (html.hasAttribute) {
    for (var ii = 0; ii < html.attributes.length; ++ii) {
      node[html.attributes[ii].name] = html.attributes[ii].value;
    };
  }

  if (html.hasChildNodes()) {

    child = html.firstChild;

    if (child.nodeType === 3 && child.data.trim() !== "") {
      node.text = child.data;
    }

    if ((child.nodeType === 3 && child.nextSibling) || child.nodeType === 1) {
      node.inside = [];
    }

    while (child) {
      if (child.nodeType === 1) {
        node.inside.push(this.parseHTML(child));
      }
      child = child.nextSibling;
    };

  }

  return (node);

};

/**
 * Object to HTML
 * @param {Object} object
 * @method parseJSON
 */
HUD.prototype.parseJSON = function(object) {

  var element = null;
  var array = [];

  var self = this;

  var _compile = function(data) {

    for (var ii in data) {

      if (ii === "key") {
        element = document.createElement(data.key);
      } else if (element && ii === "text") {
        element.innerHTML = data.text;
      } else {
        if (!element && ii === "text") {
          element = document.createTextNode(data[ii]);
        }
        if (ii === "inside") {
          if (data.inside) {
            for (var ii = 0; ii < data.inside.length; ++ii) {
              var insideElements = self.parseJSON(data.inside[ii]);
              for (var ll in insideElements) {
                element.appendChild(insideElements[ll]);
              };
            };
          }
        } else {
          element.setAttribute(ii, data[ii]);
        }
      }

    };

    array.push(element);

  };

  _compile(object);

  return (array);

};