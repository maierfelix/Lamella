"use strict";

/**
 * Language manager
 * @class CORE_Language
 * @constructor
 */
CORE.Language = function() {

  /**
   * Active language packet
   * Stores json parsed lang
   * @type {Object}
   * @default NULL
   */
  this.lang = null;

};

CORE.Language.prototype.constructor = CORE.Language;

/**
 * Get a language specific text
 * @param {String} str
 * @method get
 * @return {String}
 */
CORE.Language.prototype.get = function(str) {

  try {
    str = this.lang[str];
  } catch(e) {
    str = this.parent.Config.language.invalidLanguageIndex + str + "!";
  };

  return (str);

};

/**
 * Set a language
 * @param {String} data Language data
 * @method set
 * @return {Boolean}
 */
CORE.Language.prototype.set = function(data) {

  try {
    this.lang = JSON.parse(data);
    return (true);
  } catch(e) {
    console.error(this.parent.Config.language.invalidLanguageFile);
  };

  return (false);

};

/**
 * Get navigators env language
 * @method init
 * @return {String}
 */
CORE.Language.prototype.getNavigatorLanguage = function() {

  return (
    window.navigator.userLanguage ||
    window.navigator.language
  );

};

/**
 * Change language
 * @param {String} lang Language
 * @param {Function} resolve
 * @method change
 */
CORE.Language.prototype.change = function(lang, resolve) {

  var config = this.parent.Config.language;

  config.currentLang = lang;

  var path = this.parent.Config.assetPath + config.langFilePath + config.currentLang + config.langFileType;

  this.parent.Cache.get(path, true, function(data) {
    /** Environment lang file not found */
    if (data instanceof Error) {
      this.change(config.baseLang, function() {
        resolve();
      });
    /** Valid language file */
    } else {
      this.set(data);
      resolve();
    }
  }.bind(this));

  return void 0;

};