var Session = top.Session||{State:{}};
var Config = {};
Config.NAMESPACE = "applications.MainApp";
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
Config.TEMPLATE_NAMES_USE_ENGINE_EXTENSION = false;//ex: "index.kruntch.html"
Config.IMPORTS_CACHE_POLICY = "no-store"; //"default", "no-store", "reload", "no-cache", "force-cache", or "only-if-cached"  (https://fetch.spec.whatwg.org/)


