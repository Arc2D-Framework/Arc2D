var Session = Session||{State:{}};
var Config = window.Config||{
    SRC_PATH:"src/",
    ENVIRONMENT:"prod",
    ROOTPATH : "./",
    LOGGING:true,
    DYNAMICLOAD:true,
    FILENAME:"index.*js",
    ENABLE_TRANSPILER : true,
    NAMESPACE : null
};


import 'src/core/extensions/Math.js';
import 'src/core/extensions/Object.js';
import 'src/core/extensions/String.js';
import 'src/core/extensions/Document.js';
import 'src/core/extensions/Function.js';
import 'src/core/extensions/Array.js';
import 'src/core/extensions/Window.js';
import 'src/core/lang/Class.js';
import 'src/w3c/ui/WebComponent.js';
import 'src/w3c/ui/Application.js';

//--------BOOTLOADER---------
import 'src/bootloader.js';