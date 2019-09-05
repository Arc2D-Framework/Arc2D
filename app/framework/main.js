Session = top.Session||{State:{}};
Config = window.Config||{
    SRC_PATH:"src/",
    ROOTPATH : "../../../",
    LOGGING:true,
    DYNAMICLOAD:true,
    FILENAME:"index.*js",
    ENABLE_TRANSPILER : true

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
import 'src/w3c/ui/Application.js';

//--------BOOTLOADER---------
import 'src/bootloader.js';