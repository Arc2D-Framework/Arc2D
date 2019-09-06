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
Config.FOUCDELAY = 300;
Config.LOGGING = true;
Config.ENABLE_TRANSPILER = true;
Config.DEFAULT_TEMPLATE_ENGINE_MIMETYPE = "template/literals";
Config.TEMPLATE_NAMES_USE_ENGINE_EXTENSION = false;//ex: "index.kruntch.html"
Config.IMPORTS_CACHE_POLICY = "no-store"; //"default", "no-store", "reload", "no-cache", "force-cache", or "only-if-cached"  (https://fetch.spec.whatwg.org/)
Config.ALLOW_RUN_FROM_DISK = false;


//Shortcuts
Config.Applications = {
	SPLASH: "src/applications/SplashScreen/index.html",
	// LOGIN: "src/applications/Login/index.html",
	// MAIN: "src/applications/Home/index.html"
	MAIN: "src/applications/MyApp/index.html"
};

