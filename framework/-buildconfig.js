BUILDCONFIG = {
	Input : "main.js",
	
	Output : {
		SourcePath:"../node_modules/od-cocoon/framework.src.js",
		CompressedPath: "../node_modules/od-cocoon/framework.min.js"
	},

	LoadsAsync : true,

	Verbos:true,

    CompilationLevel : "WHITESPACE_ONLY",

    InputLanguage : "ECMASCRIPT_2018",

    OutputLanguage : "ECMASCRIPT_2018",

	Prefabs : {
        Enabled : false,
        Components : []
    }
};

/*Languages
The Closure Compiler supports the following languages:
    ECMASCRIPT3, ECMASCRIPT5 and ECMASCRIPT5_STRICT
    ECMASCRIPT6 and ECMASCRIPT6_STRICT
    ECMASCRIPT6_TYPED (experimental)
    ECMASCRIPT_2017 (experimental)


CompilationLevel(compilationLevel)
    WHITESPACE_ONLY, SIMPLE, ADVANCED
*/

module.exports = BUILDCONFIG;