BUILDCONFIG = {
    Input : "src/display/screens/MoviesApp/index.js",
    
    Output : {
        SourcePath:"src/display/screens/MoviesApp/index.src.js",
        CompressedPath: "src/display/screens/MoviesApp/index.min.js"
    },

    LoadsAsync : true,

    Verbos:true,

    CompilationLevel : "WHITESPACE_ONLY",

    InputLanguage : "ECMASCRIPT_2018",

    OutputLanguage : "ECMASCRIPT_2018",

    Prefabs : {
        Enabled : true,
        Components : [
          
        ]
    }
};
module.exports = BUILDCONFIG;