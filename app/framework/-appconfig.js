Session = top.Session||{State:{}};

Config = {
	'core.ui.WebComponent' : {},

	'core.ui.templating.CustomTemplateEngines' : {
		DEFAULT_TEMPLATE_ENGINE_MIMETYPE : 'template/literals'
	},

	'core.extensions.window' : {
		LOGGING : true,
		IMPORTS_CACHE_POLICY : "no-store", //"default", "no-store", "reload", "no-cache", "force-cache", or "only-if-cached"  (https://fetch.spec.whatwg.org/)
	},

	'core.lang.Transpiler' : {
		ENABLE_TRANSPILER : true
	}
};

Config.USE_COMPRESSED_BUILD = false;
Config.FILENAME = "index.*js"
Config.DYNAMICLOAD = true;
Config.DEBUG = false;
Config.CHARSET = "utf-8";
Config.ROOTPATH = "../../../";
Config.SRC_PATH = "src/";
Config.ENVIRONMENT = "dev";
// Config.STORAGEKEY;
// Config.APPID = "4X27-B54B-D49339AZ7CE8";
Config.FOUCDELAY = 300;
// Config.FORCE_MOBILE_USERAGENT = false;
Config.LOGGING = true;
Config.ENABLE_TRANSPILER = true;
Config.DEFAULT_TEMPLATE_ENGINE_MIMETYPE = "template/literals";
Config.TEMPLATE_NAMES_USE_ENGINE_EXTENSION = false;//ex: "index.kruntch.html"
// Config.ENABLE_LOGIN = true;
// Config.ENABLE_SPLASH = true;
// Config.DEFAULT_ROLE = Constants.EMPLOYEE;
// Config.DEFAULT_LANG = Constants.Languages.EN_US;
// Config.PERSIST_SESSION = true;
// Config.ALLOW_LANG_SELECTION = true;
// Config.SHOW_FRAMEWORK_RELEASE_NOTES = false;
Config.IMPORTS_CACHE_POLICY = "no-store"; //"default", "no-store", "reload", "no-cache", "force-cache", or "only-if-cached"  (https://fetch.spec.whatwg.org/)
Config.ALLOW_RUN_FROM_DISK = false;
// Config.DEFAULT_APP_NAME = "x-app";
// Config.CORDOVA = false;

//Shortcuts
Config.Applications = {
	SPLASH: "src/applications/SplashScreen/index.html",
	LOGIN: "src/applications/Login/index.html",
	// MAIN: "src/applications/Home/index.html"
	MAIN: "src/applications/HelloWorld/index.html"
};
/*
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
*/
