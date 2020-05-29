BUILDCONFIG = {
    // LoadPaths:[
    //     "/", 
    //     "src", 
    //     "libs"
    // ],
    
    Input : "src/docs/ManDocs/index.js",
    
    Output : {
        SourcePath:"src/docs/ManDocs/index.src.js",
        CompressedPath: "src/docs/ManDocs/index.min.js"
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
            "docs.components.TocMenu",
            "docs.components.LanguageSelector",
            "docs.topics.DocHome",
            "docs.components.ReadingProgress",
            "docs.components.DomView",
            "docs.components.DomTreeView"
        ]
    }
};
module.exports = BUILDCONFIG;