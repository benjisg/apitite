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
					var success = api.generate(name, module.base, module.services);
					if(success) {
						console.log("[" + "SUCCESS".green + "] Registered " + name + " API module");
					} else {
						console.log("[" + "FAILURE".red + "] Registering " + name + " failed");
					}
				} else {
					throw("Module of that name has already been registered");
				}
			} catch(exception) {
				if(exception) {
					console.log("[" + "ERROR".yellow + "] " + exception);
				} else {
					console.log("[" + "ERROR".yellow + "] Invalid JSON used for module registration");
				}
			}
			console.log();
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
			var success = true;
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
												if(routeStructure.length > 0) {
													(function(property_names, property_name_prefixes) {
														Apitite.query[name][service_name][route_name][rest_param] = function(options, callback) {
															var valid = true, error_message = "", query = "";
															for(var i = 0, len = property_names.length; i < len; i++) {
																if(options[property_names[i]] != null) {
																	query = query + property_name_prefixes[i] + options[property_names[i]];
																} else {
																	valid = false;
																	error_message = "Query options missing mandatory [" + property_names[i] + "] property";
																	break;
																}
															}
															if(valid) {
																if(i == property_name_prefixes.length - 1) {
																	var postfix = property_name_prefixes[i + 1];
																	if(postfix !== "") {
																		query += postfix;
																	}
																}
																// restler query
																	// TODO: format setup
																	// TODO: params setup
																callback({
																	"success" : true,
																	"data" : query
																});
															} else {
																// return failure with error message
																callback({
																	"success" : false,
																	"data" : "",
																	"debug" : {
																		"error_msg" : error_message
																	}
																});
															}
														};
													})(routeStructure[0], routeStructure[1]);
												} else {
													throw("Parsing of route structure for " + name + "." + service_name + "." + route_name + " failed");
												}
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
				console.log("[" + "ERROR".yellow + "] " + exception);
				success = false;
			}
			return success;
		},
		parseRouteStructure : function(structure) {
			var pieces = [];
			if((typeof structure === "string") && (structure.length > 0)) {
				// If our structure starts with a variable, first prefix string will be an empty string
				var prefixParts = structure.split(apiStructurePattern), names = [], prefixes = [];
				for(var i = 0, len = prefixParts.length; i < len - 1; i += 2) {
					prefixes.push(prefixParts[i]);
					names.push(prefixParts[i + 1]);
				}
				var postfix = prefixParts[i];
				if(postfix !== "") {
					prefixes.push(postfix);
				}
				pieces = [names, prefixes];
			}
			return pieces;
		}
	};
	
	
	

