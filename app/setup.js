"use strict";

LAMELLA = new LAMELLA();

/** Classify configuration */
LAMELLA.Config = new LAMELLA.Config();

/** Classify parent classes */
LAMELLA.Core         = new CORE();
LAMELLA.Hud          = new HUD();
LAMELLA.Interpreter  = new INTERPRETER();

/** Classify sub classes */
LAMELLA.Core.Network     = new CORE.Network();
LAMELLA.Core.Language    = new CORE.Language();
LAMELLA.Core.Cache       = new CORE.Cache();
LAMELLA.Core.Grid        = new CORE.Grid();

/** Deep grub classes */
Rooty.grub(LAMELLA);

/** Disable main classes from gs */
CORE = HUD = INTERPRETER = void 0;