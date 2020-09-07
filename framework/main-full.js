var Session = window.Session = window.Session||{State:{}};
var Config = window.Config = window.Config||{
    SRC_PATH:"/src/",
    ENVIRONMENT:"prod",
    ROOTPATH : "./",
    LOGGING:true,
    DYNAMICLOAD:true,
    FILENAME:"index.*js",
    ENABLE_TRANSPILER : true,
    NAMESPACE : null,
    DEBUG:true
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
import 'src/w3c/ui/RoutableApplication.js';
import 'src/core/ui/World.js';

import 'src/core/data/Repository.js';
import 'src/core/drivers/storage/IStorageInterface.js';
import 'src/core/drivers/storage/Memory.js';

import 'src/bootloader.js';