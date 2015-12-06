"use strict";

(function() {

  Importer.addToQueue([
    /** Libraries */
    "./vendor/libs/hammer.min.js",
    "./vendor/libs/fastclick.min.js",
    "./vendor/libs/watch.min.js",
    "./vendor/libs/ajax.js",
    "./vendor/libs/rooty.js",
    /** Main */
    "./app/functions.js",
    "./app/index.js",
    "./app/storage.js",
    "./app/config.js",
    /** Core */
    "./app/core/index.js",
    /** Cache */
    "./app/core/cache/main.js",
    /** Lang */
    "./app/core/lang/main.js",
    /** Grid */
    "./app/core/grid/main.js",
    "./app/core/grid/draw.js",
    "./app/core/grid/functions.js",
    "./app/core/grid/connection.js",
    "./app/core/grid/depth.js",
    "./app/core/grid/event.js",
    "./app/core/grid/zoom.js",
    /** Grid entities */
    "./app/core/grid/entity/entity.js",
    "./app/core/grid/entity/anchor.js",
    "./app/core/grid/entity/collision.js",
    "./app/core/grid/entity/drag.js",
    "./app/core/grid/entity/snap.js",
    "./app/core/grid/entity/resize.js",
    /** Networking */
    "./app/core/network/main.js",
    /** Hud */
    "./app/hud/index.js",
    "./app/hud/functions.js",
    "./app/hud/build.js",
    "./app/hud/scenes.js",
    /** Interpreter */
    "./app/interpreter/index.js",
    /** Setup */
    "./app/register.js",
    "./app/setup.js",
    /** Plugins */
    "./app/res/plugins/screenshot.js",
    /** Models */
    "./app/res/models/condition.js",
    "./app/res/models/operator.js",
    "./app/res/models/event.js",
    "./app/res/models/datatype.js",
    "./app/res/models/statement.js",
    /** Scenes */
    "./app/res/scenes/settings.js",
    "./app/res/scenes/add.js"
  ]);

  Importer.onProgress = function(value) {

    document.querySelector("#progress-value").style.width = value + "%";

  };

  Importer.onFinish = function() {

    console.log("Finished loading!");

    setTimeout(function() {

      LAMELLA.run(false);

    }, 750);

  };

  Importer.run();

}).call(this);