var Session = window.Session||{State:{}};
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
    DEFAULT_VIEW : "display.views.Home",
    ROUTER : 'system.http.Router',
    IMPORT_MAPS:true,
    AUTOLOAD_IMPORT_MAPS : true,
    ON_AUTO_QUERY_SELECT_IDS: false
};

Config.FIREBASE = {
    apiKey: "AIzaSyD3HTd7BH4DKkvOF2AitWyQsSWMSEPYT4Y",
    authDomain: "test-f6d84.firebaseapp.com",
    databaseURL: "https://test-f6d84.firebaseio.com",
    projectId: "test-f6d84",
    storageBucket: "test-f6d84.appspot.com",
    messagingSenderId: "507958760916",
    appId: "1:507958760916:web:0ba398f0785cf2f4017241"
}

// try{export {Session, Config};}catch(e){}
try{module.exports = Config;}catch(e){}

