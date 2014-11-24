"use strict";

/*
	Fire Bootstrap

	Adds Bootstrap to the project it is called within, either directly or
	by adding a Gruntfile task.

	Author:	Liam Howell <lhowell@mobiquityinc.com>
	Since:	11-20-2014
*/

// --------------------------------------------------------------------- Imports

var yeoman = require("yeoman-generator");
var GruntfileEditor = require("gruntfile-editor");
var chalk = require("chalk");
var fs = require("fs");
var utils = require("gruntfile-editor-utils");
var _ = require("lodash");
var jsdom = require("jsdom");

// ----------------------------------------------- Private Methods and Variables

var BootstrapGenBase = yeoman.generators.Base.extend({

    settings: {
        indexPage: "app/index.html",
        bootstrapFilename: "bootstrap.min.css",
        bootstrapSource: function () { return "bower_components/bootstrap/dist/css/" + this.bootstrapFilename},
        bootstrapDestination: function () { return "app/" + this.bootstrapFilename; }
    },

    /**
     * Add the lines to an existing gruntfile to load bootstrap dynamically.
     */
    addToGruntfile: function () {
        this.log(chalk.yellow("Adding Bootstrap to existing Gruntfile..."));
        
        // Get the gruntfile.
        var gruntfileContent = this.dest.read("Gruntfile.js");
        
        // Pass it to the GruntfileEditor and overwrite this.env.gruntfile 
        this.env.gruntfile = new GruntfileEditor(gruntfileContent);                

        var copyBootstrap = {
            expand: true,
            dot: true,
            cwd: "bower_components/bootstrap/dist",
            src: "css",
            dest: "<%= config.dist %>"
        };
        
        // Extract the copy property from gruntfile
        var extractedCopyProp = utils.extractJSON(gruntfileContent, "copy");

        // Add the extracted copy property (if it exists) to the new one.
        if (extractedCopyProp) {
            extractedCopyProp = JSON.parse(extractedCopyProp);
            copyBootstrap = _.merge(copyBootstrap, extractedCopyProp);
        }
        
        var copyBootstrapString = JSON.stringify(copyBootstrap, null, 2);

        // Use the GruntfileEditor API to programmatically add tasks
        this.gruntfile.insertConfig("copy", copyBootstrapString);

        fs.writeFileSync("Gruntfile.js", this.env.gruntfile.toString());
        
    },

    /**
     * Add the Bootstrap css file to the project (if not using grunt or gulp).
     */
    addBootstrapCssFile: function () {
        var root = this.destinationRoot() + "/";
        utils.copyFile(root + this.settings.bootstrapSource(), root + this.settings.bootstrapDestination());
    },


    /**
     * Returns the doctype tag of the given window.document.
     *
     * Thanks to stackoverflow user Patrick McElhaney
     * http://stackoverflow.com/a/12523515/1729686 
     */
    getDocTypeAsString: function (doc) { 
        var node = doc.doctype;
        return node ? "<!DOCTYPE "
            + node.name
            + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
            + (!node.publicId && node.systemId ? ' SYSTEM' : '') 
            + (node.systemId ? ' "' + node.systemId + '"' : '')
            + '>\n' : '';
    },

    /**
     * Add the bootstrap css link to the index.html file.
     */
    addBootstrapToHTML: function () {
        var root = this.destinationRoot() + "/";
        var doctype = this.getDocTypeAsString;
        var indexPage = root + this.settings.indexPage;
        var indexHTMLString;
        jsdom.env(indexPage, ["http://code.jquery.com/jquery.js"], function (errors, window) { 
            var $head = window.$("head");
            var $lastLink = $head.find("link:last");
            var linkElement = "\t<link rel='stylesheet' href='bootstrap.min.css' type='text/css' media='screen'>";
            if ($lastLink.length) {
                $lastLink.after("\n" + linkElement);
            } else {
                $head.append(linkElement + "\n");
            }
            // This gets added by jsdom and is not needed/wanted.
            window.$(".jsdom").remove(); 
            indexHTMLString = doctype(window.document) + window.document.documentElement.outerHTML; 
            fs.writeFileSync(indexPage, indexHTMLString);
        });
        console.log("Added bootstrap script to index.html");
    },

    /**
     * Adds the bootstrap file to the project, and adds a script tag to the
     * index.html page.
     */
    addBootstrapCss: function () {
        this.addBootstrapCssFile();
        this.addBootstrapToHTML();
    }

});

// ----------------------------------------------------------------- Main action

module.exports = BootstrapGenBase.extend({

	constructor: function () {
		// Call the super constructor.
		yeoman.generators.Base.apply(this, arguments);

		// this.log("Bootstrap constructor running...");

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
			if (this.config.get("project_config").build_system === "grunt") {
				
				this.addToGruntfile();
				
			} else {
				// Install bootstrap.css directly.
				this.log(chalk.yellow("Installing Bootstrap..."));
                this.addBootstrapCss();

            }


			// bower.commands
			// .install(["bootstrap"], { exclude: "bower_components/jquery/dist/jquery.js" })
			// .on("end", function () {
			// 	console.log("Latest Bootstrap successfully installed.");

				done();
			
			// });
		}
		
	}


});
