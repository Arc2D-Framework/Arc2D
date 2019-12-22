var Session = top.Session||{State:{}};
var Config = window.Config||{
    SRC_PATH:"src/",
    ENVIRONMENT:"prod",
    ROOTPATH : "./",
    LOGGING:true,
    DYNAMICLOAD:true,
    FILENAME:"index.*js",
    ENABLE_TRANSPILER : true,
    NAMESPACE : "applications.MainApp"
};


import 'version.js';

//--------EXTENSIONS---------
import 'src/core/extensions/Math.js';
import 'src/core/extensions/Object.js';
import 'src/core/extensions/String.js';
import 'src/core/extensions/Document.js';
import 'src/core/extensions/Function.js';
import 'src/core/extensions/Array.js';
import 'src/core/extensions/Window.js';

//-----------LIBS------------
import 'src/core/lang/Class.js';


//------------UI-------------
import 'src/w3c/ui/WebComponent.js';
import 'src/patches/3.0.1.js';
import 'src/w3c/ui/Application.js';

//--------BOOTLOADER---------
import 'src/bootloader.js';

console.log(`🦏 Oros Engine - v${$framework.current}`)