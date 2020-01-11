BUILDCONFIG = {
	LoadPaths:[
		"/", 
		"src", 
		"libs"
	],
	
	Input : "main.js",
	
	Output : {
		SourcePath:"../node_modules/od-cocoon/framework.src.js",
		CompressedPath: "../node_modules/od-cocoon/framework.min.js"
	},

	// Output : {
	// 	SourcePath:"node_modules/od-cocoon/framework.src.js",
	// 	CompressedPath: "node_modules/od-cocoon/framework.min.js"
	// },
	
	Verbos:true
};

module.exports = BUILDCONFIG;
