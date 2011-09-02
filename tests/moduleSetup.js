var Apitite = require("../lib/apitite.js");
var fs = require("fs");

// Try to register two modules of the same name
(function doubleRegistration() {
	Apitite.register({
		"name" : "test"
	});

	Apitite.register({
		"name" : "test"
	});
})();

// Test twitter
(function testTwitter() {
	Apitite.register(JSON.parse(fs.readFileSync("../maps/apitite-twitter/apitite-twitter.json", "utf8")));
	Apitite.query.twitter.timelines.publicTimeline.GET({
		"format" : "json",
		"PARAMS" : ""
	}, "json", function(response) {
		if(response.success) {
			console.log("SUCCESS!");
			console.log(response.data);
		} else {
			console.log("FAILURE!");
			console.log(response.debug.error_msg);
		}
	});
})();