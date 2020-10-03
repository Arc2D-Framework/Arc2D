BUILDCONFIG = {
    Input : "src/applications/NotificationsApp/index.js",
    
    Output : {
        SourcePath:"src/applications/NotificationsApp/index.src.js",
        CompressedPath: "src/applications/NotificationsApp/index.min.js"
    },

    LoadsAsync : true,

    Verbos:true,

    CompilationLevel : "WHITESPACE_ONLY",

    InputLanguage : "ECMASCRIPT_2018",

    OutputLanguage : "ECMASCRIPT_2018",

    Prefabs : {
        Enabled : true,
        Components : [
            "applications.NotificationsApp",
            "core.ui.NotificationsToggleSwitch"
        ]
    }
};
module.exports = BUILDCONFIG;