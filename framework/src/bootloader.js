import 'src/core/http/ClassLoader.js';
import 'src/core/http/ModuleLoader.js';
import 'src/mainloop.js';

document.addEventListener("DOMContentLoaded", e => {
  async function bootup() {
    var ns = document.body.getAttribute("namespace");
        ns = ns||Config.NAMESPACE;
    if (Config.DYNAMICLOAD) {
      var filename_path = Config.SRC_PATH + (ns.replace(/\./g, "/"))  + "/" + Config.FILENAME;
      var path = filename_path.replace("*", Config.USE_COMPRESSED_BUILD ? "min.":"");
      var c = (Config.ENABLE_TRANSPILER) ?
        new core.http.ClassLoader :
        new core.http.ModuleLoader;
        c.load(ns, Config.ROOTPATH + path, res => {
          var app = window.application;
          if(!app) {
            app = new NSRegistry[ns](document.body);
          }
          MainLoop
            .setUpdate(app.onUpdate.bind(app))
            .setDraw(app.onDraw.bind(app))
            .setEnd(app.onEnd.bind(app))
            .start();
        });
    }
  };

  ("cordova" in window) ? 
    document.addEventListener('deviceready', ()=>{
      AndroidFullScreen && AndroidFullScreen.immersiveMode(e=>{}, e=>{});
      bootup()
    }, false) : bootup()
}, false);