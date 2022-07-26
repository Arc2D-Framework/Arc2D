BUILDCONFIG = {
    Input : "src/ui/screens/ComponentsDemo/index.js",
    
    Output : {
        SourcePath:"src/ui/screens/ComponentsDemo/index.src.js",
        CompressedPath: "src/ui/screens/ComponentsDemo/index.min.js",
        EncryptPath: "src/ui/screens/ComponentsDemo/index.encrypt.js",
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