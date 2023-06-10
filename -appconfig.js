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

Config.OBJECT_TYPES = {
    "SCRIPT": {
        "label" : "Custom Script", 
        "icon": "fa-code", 
        "editor" : {
            "namespace" : "ui.meld.editors.Script", "options" : null
        },
        "enabled" : true
    },
    "TEXT": {
        "label" : "Rich Text", 
        "icon": "fa-font", 
        "editor" : {
            "namespace" : "ui.meld.editors.RichText", "options" : null
        },
        "example" : "var text='text content here';\n",
        "enabled" : true
    },
    "GRAPHIC": {
        "label" : "Graphic", 
        "icon": "fa-image",
        "editor" : {
            "namespace" : "ui.meld.editors.Graphic", "options" : null
        },
        "enabled" : true
    },
    "BRANCHES": {
        "label" : "Branching", 
        "icon": "fa-seedling",
        "editor" : {
            "namespace" : "ui.meld.editors.Branches", "options" : null
        },
        "enabled" : true
    },
    "FLASH_CARDS": {
        "label" : "Flash Cards", 
        "icon": "fa-portrait",
        "editor" : {
            "namespace" : "ui.meld.editors.FlashCards", "options" : null
        },
        "enabled" : false
    },
    "SWAPS": {
        "label" : "Swaps", 
        "icon": "fa-images",
        "editor" : {
            "namespace" : "ui.meld.editors.ImageSwaps", "options" : null
        },
        "enabled" : false
    },
    "TABS": {
        "label" : "Tabs", 
        "icon": "fa-folder",
        "editor" : {
            "namespace" : "ui.meld.editors.Tabs", "options" : null
        },
        "enabled" : false
    },
    "REMEDIATION": {
        "label" : "Remediation", 
        "icon": "fa-first-aid",
        "editor" : {
            "namespace" : "ui.meld.editors.Remediation", "options" : null
        },
        "enabled" : false
    },
    "WCN": {
        "label" : "WCN's", 
        "icon": "fa-exclamation-triangle",
        "editor" : {
            "namespace" : "ui.meld.editors.Wcn", "options" : null
        },
        "enabled" : false
    },
    "BRANCHING_MENU" : {
        "label" : "Branching Menu", 
        "icon": "fa-th-large",
        "editor" : {
            "namespace" : "ui.meld.editors.BranchingMenu", "options" : null
        },
        "enabled" : false
    },
    "TITLE" : {
        "label" : "Lesson Title", 
        "icon" : "fa-info-circle",
        "editor" : {
            "namespace" : "ui.meld.editors.LessonTitle", "options" : null
        },
        "enabled" : false
    }
}

Config.TEMPLATE_TYPES = {
    "GRAPHIC_RIGHT" : [
        Config.OBJECT_TYPES.TEXT, Config.OBJECT_TYPES.GRAPHIC
    ],
    "GRAPHIC_RIGHT_LARGE" : [
        Config.OBJECT_TYPES.TEXT, Config.OBJECT_TYPES.GRAPHIC
    ],
    "GRAPHIC_LEFT" : [
        Config.OBJECT_TYPES.TEXT, Config.OBJECT_TYPES.GRAPHIC
    ],
    "BRANCHING_MENU_LARGE" : [
        Config.OBJECT_TYPES.SCRIPT, Config.OBJECT_TYPES.TEXT, Config.OBJECT_TYPES.BRANCHING_MENU
    ],
    "BRANCHING_MENU_SMALL" : [
        Config.OBJECT_TYPES.TEXT, Config.OBJECT_TYPES.BRANCHING_MENU
    ],
    "TITLE" : [
        Config.OBJECT_TYPES.TITLE
    ]
}

// try{export {Session, Config};}catch(e){}
try{module.exports = Config;}catch(e){}

