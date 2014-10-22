"use strict";

/*
	Fire Bootstrap

	Adds Bootstrap to the project it is called within.

	Author:	Liam Howell <lhowell@mobiquityinc.com>
	Since:	10-22-2014
*/

// --------------------------------------------------------------------- Imports

var yeoman = require("yeoman-generator");
var chalk = require("chalk");

// ----------------------------------------------------------------- Main action

module.exports = yeoman.generators.Base.extend({

	constructor: function () {
		// Call the super constructor.
		yeoman.generators.Base.apply(this, arguments);

		if (arguments && arguments[0]) {
			var configJSON = JSON.parse(arguments[0]);
			this.config.set("project_config", configJSON);
		}
	},

	welcomeMessage: function () {
		this.log("Adding Bootstrap...");
	}

});
