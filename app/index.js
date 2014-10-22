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

	welcomeMessage: function () {
		this.log("Adding Bootstrap...");
	}

});
