BUILDCONFIG = {
    // Input : "src/display/screens/landing/MainScreen/index.js",
    
    // Output : {
    //     SourcePath:"src/display/screens/landing/MainScreen/index.src.js",
    //     CompressedPath: "src/display/screens/landing/MainScreen/index.min.js"
    // },
    Input : "src/display/worlds/TweenTest/index.js",
    
    Output : {
        SourcePath:"src/display/worlds/TweenTest/index.src.js",
        CompressedPath: "src/display/worlds/TweenTest/index.min.js"
    },

    LoadsAsync : true,

    Verbos:true,

    CompilationLevel : "WHITESPACE_ONLY",

    InputLanguage : "ECMASCRIPT_2018",

    OutputLanguage : "ECMASCRIPT_2018",

    Prefabs : {
        Enabled : true,
        Components : [
            // "display.worlds.entities.html.GroundBox",
            // "display.worlds.entities.svg.CircleShape",
            // "display.worlds.entities.html.PolygonShape"
            // "display.components.ToggleButton",
            // "display.worlds.entities.Box2DDemo"
        ]
    }
};
module.exports = BUILDCONFIG;