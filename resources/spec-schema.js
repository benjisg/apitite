{
	description : "The core API module specification",
	type : "object",
	properties : {
		name : {
			description : "Name that should be registered by apitite to call the API with",
			type : "string",
			minLength : 1,
			maxLength : 100,
			optional : false,
			fallbacks : {
				maxLength : "truncateToMaxLength"
			}
		},
		version : {
			description : "Version of the API this spec is detailing; if left blank then assumed to be latest major",
			type : "string",
			optional : true,
			"default" : ""
		},
		services : {
			description : "Provides a list of the REST queries each API provides",
			type : "array",
			minItems : 1,
			items : {
				{
					description : "A REST service group",
					type : "object",
					properties : {
						name : {
							description : "Name of REST service group; if left blank then group is defaulted to global for the API",
							type : "string",
							maxLength : 100,
							optional : false,
							fallbacks : {
								maxLength : "truncateToMaxLength"
							}
						}
					}
				}
			}
		}
	},
	additionalProperties : false
}