BUILDCONFIG = {
    LoadPaths:[
        "/", 
        "src", 
        "libs"
    ],
    
    Input : "src/docs/ManDocs/index.js",
    
    Output : {
        SourcePath:"src/docs/ManDocs/index.src.js",
        CompressedPath: "src/docs/ManDocs/index.min.js"
    },

    // Output : {
    //  SourcePath:"node_modules/od-cocoon/framework.src.js",
    //  CompressedPath: "node_modules/od-cocoon/framework.min.js"
    // },
    
    Verbos:true
};
module.exports = BUILDCONFIG;