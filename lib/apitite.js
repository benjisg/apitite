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
					Apitite.query[name] = {};
					api.generate(name, module.base, module.services);
					console.dir(Apitite.query);
					console.log("[" + "SUCCESS".green + "] Registered " + name + " API module");
				} else {
					throw("Module of that name has already been registered");
				}
			} catch(exception) {
				if(exception) {
					console.log("[" + "ERROR".red + "] " + exception);
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
	
/* Private Helper Methods */
	var apiStructurePattern = /\{([a-zA-Z](?:[a-zA-Z0-9]*\_)*[a-zA-Z0-9]+)\}/;

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
	
	/* API interface generation helpers */
	var api = {
		generate : function(name, base, services) {
			try {
				if(services != null) {
					for(var service_name in services) {
						if(services.hasOwnProperty(service_name)) {
							var serviceBase = services[service_name].service, routes = services[service_name].routes;
							for(var route_name in routes) {
								if(routes.hasOwnProperty(route_name)) {
									var rest_params = routes[route_name];
									for(var rest_param in rest_params) {
										var rest_spec = rest_params[rest_param];
										if((rest_param === "GET") || (rest_param === "POST") || (rest_param === "DELETE") || (rest_param === "PUT")) {
											var auth_required = (rest_spec.auth || false);
											var description = (rest_spec.description || "No route description given");
											var formats = (rest_spec.formats || []);
											
											/* Start the objects as needed */
											if(Apitite.query[name][service_name] == null) {
												Apitite.query[name][service_name] = {};
											}
											if(Apitite.query[name][service_name][route_name] == null) {
												Apitite.query[name][service_name][route_name] = {};
											}
											
											/* There shouldnt be two routes mapped to the same REST protocol */
											if(Apitite.query[name][service_name][route_name][rest_param] != null) {
												throw("Overlapping REST query definition for " + rest_param + " in " + name + "." + service_name + "." + route_name);
											} else {
												var routeStructure = api.parseRouteStructure(rest_spec.structure);
												
												
											}
										}
									}
								}
							}
						}
					}
				} else {
					throw("No services are defined for " + name);
				}
			} catch(exception) {
				console.log("[" + "ERROR".red + "] " + exception);
			}
		},
		parseRouteStructure : function(structure) {
			var pieces = [];
			if((typeof structure === "string") && (structure.length > 0)) {
				// If our structure starts with a variable, first prefix string will be an empty string
				var prefixParts = structure.split(apiStructurePattern);
				for(var i = 0, len = prefixParts.length; i < len - 1; i += 2) {
					var variableSet = {};
					variableSet[prefixParts[i]] = prefixParts[i + 1];
					pieces.push(variableSet);
				}
				var postfix = prefixParts[i];
				if(postfix !== "") {
					pieces.push({ "" : postfix });
				}
			}
			return pieces;
		}
	};
	
	
	

