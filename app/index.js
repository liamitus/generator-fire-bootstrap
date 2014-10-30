"use strict";

/*
	Fire Bootstrap

	Adds Bootstrap to the project it is called within, either directly or
	by adding a Gruntfile task.

	Author:	Liam Howell <lhowell@mobiquityinc.com>
	Since:	10-30-2014
*/

// --------------------------------------------------------------------- Imports

var yeoman = require("yeoman-generator");
var GruntfileEditor = require("gruntfile-editor");
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

	bower: function () {
		var bower = {
			name: this._.slugify(this.appname),
			private: true,
			dependencies: {}
		};

		var bs = "bootstrap";
		bower.dependencies[bs] = "~3.2.0";
		
		this.write("bower.json", JSON.stringify(bower, null, 2));
	},

	install: {
		installBootstrap: function () {
			var done = this.async();
			

			// Retrieve the exiting gruntfile or make a new one.
			// TODO the same thing for gulp?
			// if (this.config.get("project_config").build_system === "grunt") {
			// 	this.log(chalk.yellow("Adding Bootstrap to existing Gruntfile..."));
			// 	// Get the gruntfile.
			// 	var gruntFileContent = this.dest.read("Gruntfile.js");
			// 	// Pass it to the GruntfileEditor and overwrite this.env.gruntfile 
			// 	this.env.gruntfile = new GruntfileEditor(gruntFileContent);

			// 	// Use the GruntfileEditor API to programmatically add tasks
			// 	// this.gruntfile.insertConfig('watch', "......");
			// 	// this.gruntfile.insertConfig('clean', "......");
			// } else {
			// 	// Install bootstrap.css directly.
			// 	this.log(chalk.yellow("Installing Bootstrap..."));
			// 	this.src.copy("bootstrap.v3.2.0.min.css", "app/bootstrap.v3.2.0.min.css");
			// }


			// bower.commands
			// .install(["bootstrap"], { exclude: "bower_components/jquery/dist/jquery.js" })
			// .on("end", function () {
			// 	console.log("Latest Bootstrap successfully installed.");
				done();
			// });
		}
		
	}


});
