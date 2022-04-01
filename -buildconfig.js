BUILDCONFIG = {
    Input : "src/ui/screens/ComponentsDemo/index.js",
    
    Output : {
        SourcePath:"src/ui/screens/ComponentsDemo/index.src.js",
        CompressedPath: "src/ui/screens/ComponentsDemo/index.min.js",
        EncryptPath: "src/ui/screens/ComponentsDemo/index.encrypt.js",
    },

    Encrypt : true,

	LoadsAsync : true,

    Verbos:true,

    CompilationLevel : "WHITESPACE_ONLY",

    InputLanguage : "ECMASCRIPT_2018",

    OutputLanguage : "ECMASCRIPT_2018",

    Prefabs : {
        Enabled : true,
        Components : [
            'ui.components.RippleButton'
        ]
    }
};
module.exports = BUILDCONFIG;