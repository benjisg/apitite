var Apitite = require("../lib/apitite.js");

// Try to register two modules of the same name
var doubleRegistration = function() {
	Apitite.register({
		"name" : "test"
	});

	Apitite.register({
		"name" : "test"
	});
};

doubleRegistration();
