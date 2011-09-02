/*
*
* Apitite - A generic API handler
*
* Copyright 2011 - Benji Schwartz-Gilbert
*
*
TODO:

-- Verifying mandatory parameter types and ranges
-- Verifying optional parameter types and ranges
-- OAuth authentication requests
-- OAuth deauthentication requests
-- JSON schema validation
-- Switching between authenticated and unauthenticated queries
-- Handling malformed JSON
-- Breaking mapped function from their scope
-- Precompiling the query base
-- Responding to command line "list" command

*/

/* Setup the includes */
var fs = require("fs");
var restler = require("../thirdparty/restler/index.js");
// var validator = require("schema")("default");
var colors = require("colors");

/* Setup module resources */
// TODO: Implement JSON schema validation
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
        /* Generates all of the query functions for each route in the given API as specified in the API map file */
        generate : function(name, base, services) {
            var success = true;
            try {
                if(services != null) {
                    for(var service_name in services) {
                        if(services.hasOwnProperty(service_name)) {
                            var service_base = (services[service_name].service || service_name), routes = services[service_name].routes;
                            for(var route_name in routes) {
                                if(routes.hasOwnProperty(route_name)) {
                                    var rest_params = routes[route_name];
                                    for(var rest_param in rest_params) {
                                        var rest_spec = rest_params[rest_param];
                                        if((rest_param === "GET") || (rest_param === "POST") || (rest_param === "DELETE") || (rest_param === "PUT")) {
                                            var auth_required = (((rest_spec.auth != null) && (rest_spec.auth === "required")) ? true : false);
                                            var description = (rest_spec.description || "No route description given");
                                            var formats = (rest_spec.formats || []);
                                            var optional_params_exist = ((Object.keys(rest_spec.params).length > 0) ? true : false);
                                            var base_url = ((auth_required) ? "https" : "http") + "://" + base + service_base;
                                            
                                            /* Start the objects as needed */
                                            if(Apitite.query[name][service_name] == null) {
                                                Apitite.query[name][service_name] = {};
                                            }
                                            if(Apitite.query[name][service_name][route_name] == null) {
                                                Apitite.query[name][service_name][route_name] = {};
                                            }
                                            
                                            if(Apitite.query[name][service_name][route_name][rest_param] != null) {
                                                /* There shouldn't be two routes mapped to the same REST protocol */
                                                throw("Overlapping REST query definition for " + rest_param + " in " + name + "." + service_name + "." + route_name);
                                            } else {
                                                var routeStructure = api.parseRouteStructure(rest_spec.structure);
                                                console.log(routeStructure);
                                                if(routeStructure.length > 0) {
                                                    (function(property_names, property_name_prefixes) {
                                                        Apitite.query[name][service_name][route_name][rest_param] = function(options, format, callback) {
                                                            var successful = true, error_message = "", data = "", validFormats = (Apitite.query[name][service_name][route_name].formats || []);
                                                            if(options != null) {
                                                                var query = "", parser = "auto";
                                                                for(var i = 0, len = property_names.length; i < len; i++) {
                                                                    if(options[property_names[i]] != null) {
                                                                        /* Handle the special PARAMS keyword */
                                                                        if((property_names[i] === "PARAMS") && (optional_params_exist)) {
                                                                            var query_params = "", available_params = rest_spec.params;
                                                                            /* For now, assume only 1 instance of a given parameter can be used (we know this changes with linkedin) */
                                                                            for(var param in available_params) {
                                                                                if(available_params.hasOwnProperty(param)) {
                                                                                    if((options[param] != null) && (options[param] !== "")) {
                                                                                        query_params = query_params + param + "=" + options[param];
                                                                                    }
                                                                                }
                                                                            }
                                                                            if(query_params !== "") {
                                                                                if(rest_param === "POST") {
                                                                                    query_params = fixedEncodeURIComponent(query_params);
                                                                                } else {
                                                                                    query_params = encodeURIComponent(query_params);
                                                                                }
                                                                                query = query + "?" + query_params;
                                                                            }
                                                                        } else {
                                                                            query = query + property_name_prefixes[i] + options[property_names[i]];
                                                                        }
                                                                    } else {
                                                                        successful = false;
                                                                        error_message = "Query options missing mandatory [" + property_names[i] + "] property";
                                                                        break;
                                                                    }
                                                                }
                                                                
                                                                if(successful) {
                                                                    if(i == property_name_prefixes.length - 1) {
                                                                        var postfix = property_name_prefixes[i + 1];
                                                                        if(postfix !== "") {
                                                                            query += postfix;
                                                                        }
                                                                    }
                                                                    
                                                                    if((format != null) && (formats.length > 0)) {
                                                                        for(var i = 0, len = formats.length; i < len; i++) {
                                                                            if(format === formats[i]) {
                                                                                /* We aren't concerned about assigning this to an unknown parser as restler handles this case */
                                                                                parser = format;
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                    
                                                                    // restler query
                                                                        // TODO: format setup
                                                                        // TODO: params setup
                                                                    console.log(base_url + query);
                                                                    restler.request(base_url + query, {"parser" : parser}).on("success", function(error, data) {
                                                                        console.log(callback);
                                                                        if(callback != null) {
                                                                            callback({
                                                                                "success" : true,
                                                                                "data" : data,
                                                                                "debug" : {
                                                                                    "error_msg" : ""
                                                                                }
                                                                            });
                                                                        }
                                                                    }).on("error", function(error, data) {
                                                                        if(callback != null) {
                                                                            callback({
                                                                                "success" : false,
                                                                                "data" : {},
                                                                                "debug" : {
                                                                                    "error_msg" : error
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            } else if(property_names.length > 0) {
                                                                error_message = "Required options were not supplied to query";
                                                            }
                                                            
                                                            // return failure with error message
                                                            if(!successful) {
                                                                if(callback != null) {
                                                                    callback({
                                                                        "success" : successful,
                                                                        "data" : data,
                                                                        "debug" : {
                                                                            "error_msg" : error_message
                                                                        }
                                                                    });
                                                                } else if(!successful) {
                                                                    console.log("[" + "ERROR".yellow + "] Request unsuccessful and no callback registered");
                                                                }
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
        
        /* Parses the given route structuree and returns an array of two parts: 
                1) the names of each variable parameter 
                2) the static prefixes surrounding each variable in the query 
        */
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
    
/* Private Helpers */

/* Properly encode a URI component for an HTTP POST; courtesy of MDC */
function fixedEncodeURIComponent(str) {  
    return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
}
    

