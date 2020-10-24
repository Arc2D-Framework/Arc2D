BUILDCONFIG = {
    Input : "src/display/worlds/HelloDomNode/index.js",
    
    Output : {
        SourcePath:"src/display/worlds/HelloDomNode/index.src.js",
        CompressedPath: "src/display/worlds/HelloDomNode/index.min.js"
    },

    LoadsAsync : true,

    Verbos:true,

    CompilationLevel : "WHITESPACE_ONLY",

    InputLanguage : "ECMASCRIPT_2018",

    OutputLanguage : "ECMASCRIPT_2018",

    Prefabs : {
        Enabled : true,
        Components : [
            "display.worlds.entities.html.GroundBox",
            "display.worlds.entities.svg.CircleShape",
            "display.worlds.entities.html.PolygonShape"
        ]
    }
};
module.exports = BUILDCONFIG;