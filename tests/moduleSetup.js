var Apitite = require("../lib/apitite.js");

// Try to register two modules of the same name
(function doubleRegistration() {
	Apitite.register({
		"name" : "test"
	});

	Apitite.register({
		"name" : "test"
	});
})();
