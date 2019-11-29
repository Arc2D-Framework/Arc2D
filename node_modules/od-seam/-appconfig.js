Config = {};
Config.USE_COMPRESSED_BUILD = false;
Config.FILENAME = "index.*js"
Config.DYNAMICLOAD = true;
Config.DEBUG = false;
Config.CHARSET = "utf-8";
Config.ROOTPATH = "";
Config.ENVIRONMENT = "dev";
Config.STORAGEKEY;
Config.APPID = "4X27-B54B-D49339AZ7CE8";
Config.FOUCDELAY = 300;
Config.FORCE_MOBILE_USERAGENT = false;
Config.LOGGING = true;
Config.ENABLE_TRANSPILER = true;
Config.DEFAULT_TEMPLATE_ENGINE_MIMETYPE = "template/literals";
Config.TEMPLATE_NAMES_USE_ENGINE_EXTENSION = false;//ex: "index.kruntch.html"
Config.ENABLE_LOGIN = true;
Config.ENABLE_SPLASH = true;

Config.PERSIST_SESSION = true;
Config.ALLOW_LANG_SELECTION = true;
Config.SHOW_FRAMEWORK_RELEASE_NOTES = false;
Config.IMPORTS_CACHE_POLICY = "no-store"; //"default", "no-store", "reload", "no-cache", "force-cache", or "only-if-cached"  (https://fetch.spec.whatwg.org/)
Config.ALLOW_RUN_FROM_DISK = true;
Config.DEFAULT_APP_NAME = "x-app";

//Shortcuts
Config.Applications = {
	SPLASH: "src/applications/SplashScreen/index.html",
	LOGIN: "src/applications/Login/index.html",
	// MAIN: "src/applications/Home/index.html"
	MAIN: "src/applications/HelloWorld/index.html"
};

Config.StorageManager = {
	ENABLED: true,
	STORE_KEY: (Config.APPID),
	PARTITION_SIZE: 4000,//kb,
	WARNING_THRESHOLD_CAPACITY: .01,
	CAPACITY_WARNING_MSG: "CAPACITY WARNING:\nStorage Quota Exceeded!. New data will be pushed into head, oldest data will be popped from tail-end of partition.",
	CAPACITY_CHECK_TIMER_INTERVAL: 1200000,//Check storage space every 20mins 
	DO_CAPACITY_CHECK_ON_STARTUP: true,
	SHOW_WARNING_TO_USER: true
};


Config.NetDetect = {
	ENABLED: false,
	ENABLE_LOGGING: false,
	INTERVAL: 7000,
	HEARTBEAT_DEBUG_URI: "resources/data/heartbeat.json",
	HEARTBEAT_PROD_URI: "resources/data/heartbeat.json"
}

module.exports = Config;