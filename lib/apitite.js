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
// var validator = require("schema")("default");
var colors = require("colors");

/* Setup module resources */
// var spec = eval(fs.readFileSync("./spec-schema.js", "utf8"));
// var schema = validator.Schema.create(spec);

/* Setup the core namespace */
var Apitite = exports;

/* Publicly Accessible Methods */
	/* Register an API module with a JSON file */
	Apitite.register = function(module) {
		if(module != null) {
			try {
				// TODO: Implement JSON schema validation
				// var validation = schema.validate(module);
				// console.log(validation.getError());
				
				var name = module.name;		
				if(Apitite.query[name] == null) {
					Apitite.auth[name] = {};
					Apitite.creds[name] = {};
					Apitite.deauth[name] = {};
					Apitite.query[name] = {};
					console.log("[" + "SUCCESS".green + "] Registered " + name + " API module");
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
	
	/* Setup API authentication method storage */
	Apitite.auth = {};

	/* Setup API deauthentication method storage */
	Apitite.deauth = {};
	
	/* Setup API REST query method storage */
	Apitite.query = {};
	
	/* Setup API credential storage */
	Apitite.creds = {};
	
/* Private Helper Methods */
	/* Generic authentication management */
	var authenicate = {
		user : function(options) {
			
		},
		api : function(options) {
			
		}
	};
	
	/* Generic deauthentication management */
	var deauthenicate = {
		user : function(options) {
			
		},
		api : function(options) {
			
		}
	};
	
	/* Generic credentials management */
	var credentials = {
		query : function(options) {
			
		},
		store : function(options) {
			
		},
		wipe : function(options) {
			
		}
	};
	
	/* Generic REST interface management */
	var api = {
		generate : function(options) {
			
		}
	};
	
	
	

