BUILDCONFIG = {
    Input : "tour.js",
    
    Output : {
        SourcePath:"tour.src.js",
        CompressedPath: "tour.min.js",
        EncryptPath: "tour.encrypt.js",
    },

    Encrypt : false,

	LoadsAsync : true,

    Verbos:true,

    CompilationLevel : "WHITESPACE_ONLY",

    InputLanguage : "STABLE", //2019

    OutputLanguage : "NO_TRANSPILE",

    Prefabs : {
        Enabled : true,
        Components : [
            'ui.components.RippleButton'
        ]
    }
};
module.exports = BUILDCONFIG;