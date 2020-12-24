var Session = Session||{State:{}};
var Config = {};
Config.NAMESPACE = null;
Config.USE_COMPRESSED_BUILD = false;
Config.FILENAME = "index.*js"
Config.DYNAMICLOAD = true;
Config.CHARSET = "utf-8";
Config.ROOTPATH = "../../../";
Config.SRC_PATH = "src/";
Config.ENVIRONMENT = "dev";
Config.LOGGING = true;
Config.ENABLE_TRANSPILER = true;
Config.DEFAULT_TEMPLATE_ENGINE_MIMETYPE = "template/literals";
Config.TEMPLATE_NAMES_USE_ENGINE_EXTENSION = true;//ex: "index.kruntch.html"
Config.IMPORTS_CACHE_POLICY = { cache: "force-cache"}; //"default", "no-store", "reload", "no-cache", "force-cache", or "only-if-cached"  (https://fetch.spec.whatwg.org/)
Config.DEBUG=true;

if(window.screen.width <= 480){
    Config.MOBILEVIEW = true;
}else{
    Config.MOBILEVIEW = false;
}

Config.FIREBASE = {
    apiKey: "AIzaSyD3HTd7BH4DKkvOF2AitWyQsSWMSEPYT4Y",
    authDomain: "test-f6d84.firebaseapp.com",
    databaseURL: "https://test-f6d84.firebaseio.com",
    projectId: "test-f6d84",
    storageBucket: "test-f6d84.appspot.com",
    messagingSenderId: "507958760916",
    appId: "1:507958760916:web:0ba398f0785cf2f4017241"
}

try{module.exports = Config;}catch(e){}

