/*
*
* Apitite - A generic API handler
*
* Copyright 2011 - Benji Schwartz-Gilbert
*
*
*/

/* Setup the includes */
var fs = require("fs");
var restler = require("restler");
var validator = require("schema")("default");
var colors = require("colors");

/* Setup module resources */
var spec = eval(fs.readFileSync("./spec-schema.js", "utf8"));
var schema = validator.Schema.create(spec);

/* Setup the core namespace */
var Apitite = exports;

/* Publicly Accessible Methods */
	/* Register an API module with a JSON file */
	Apitite.register = function(module) {
		if(module != null) {
			try {
				// [TODO] Add actual schema validation
				var name = module.name;				
				if(Apitite.query[name] == null) {
					Apitite.query[module.name] = {};
					// [TODO] Smart version handling
					if(Apitite.version != null) {
						Apitite.query[module.name
					}
				} else {
					throw("Module of that name has already been registered");
				}
			} catch(e) {
				if(e) {
					console.log("[" + "ERROR".red + "] " + e);
				} else {
					console.log("[" + "ERROR".red + "] Invalid JSON used for module registration");
				}
			}
		}
	};
	
	/* Register an API module with a JSON file */
	Apitite.auth = function(module) {
		
	};

	/* Register an API module with a JSON file */
	Apitite.deauth = function(module) {
		
	};
	
	/* Register an API module with a JSON file */
	Apitite.query = {
		
	};
	
	/* Register an API module with a JSON file */
	Apitite.creds = function(module) {
		
	};
	
/* Private Helper Methods */