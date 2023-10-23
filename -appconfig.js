var Config = window.Config = window.Config||{
    NAMESPACE : null,//"applications.MainApp",
    USE_COMPRESSED_BUILD : false,
    FILENAME : "index.*js",
    DYNAMICLOAD : true,
    CHARSET : "utf-8",
    ROOTPATH : "../../../",
    SRC_PATH : "/src/",
    ENVIRONMENT : "prod",
    LOGGING : true,
    ENABLE_TRANSPILER : true,
    DEFAULT_TEMPLATE_ENGINE_MIMETYPE : "template/literals",
    TEMPLATE_NAMES_USE_ENGINE_EXTENSION : false,//ex: "index.kruntch.html"
    IMPORTS_CACHE_POLICY : { cache: "force-cache"}, //"default", "no-store", "reload", "no-cache", "force-cache", or "only-if-cached"  (https://fetch.spec.whatwg.org/)
    DEBUG:true,
    DEFAULT_VIEW : "ui.views.Home",
    ROUTER : 'system.http.Router',
    IMPORT_MAPS:true,
    AUTOLOAD_IMPORT_MAPS : true
};

// Config.SCRIPT_SNIPPETS = {
//     "IFIT" : {
//         "name" : "iFIT Setting"
//         "value" : "parent.isIFIT=true"
//     },
//     "IFIT" : {
//         "name" : "iFIT Setting"
//         "value" : "parent.isIFIT=true"
//     }
// };



// try{export {Session, Config};}catch(e){}
try{module.exports = Config;}catch(e){}

