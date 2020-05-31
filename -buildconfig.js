BUILDCONFIG = {
    // LoadPaths:[
    //     "/", 
    //     "src", 
    //     "libs"
    // ],
    
    Input : "src/applications/NotificationsApp/index.js",
    
    Output : {
        SourcePath:"src/applications/NotificationsApp/index.src.js",
        CompressedPath: "src/applications/NotificationsApp/index.min.js"
    },

    // Output : {
    //     SourcePath:"src/applications/InlineTest/index.src.js",
    //     CompressedPath: "src/applications/InlineTest/index.min.js"
    // },

    // Output : {
    //  SourcePath:"node_modules/od-cocoon/framework.src.js",
    //  CompressedPath: "node_modules/od-cocoon/framework.min.js"
    // },
    
    Verbos:true,

    Prefabs : {
        Enabled : true,
        Components : [
            "applications.NotificationsApp",
            "core.ui.NotificationsToggleSwitch"
        ]
    }
};
module.exports = BUILDCONFIG;