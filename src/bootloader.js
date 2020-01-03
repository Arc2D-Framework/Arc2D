import 'src/core/http/ClassLoader.js';
import 'src/core/http/ModuleLoader.js';
import 'src/mainloop.js';


document.addEventListener("DOMContentLoaded", e => {
  async function bootup() {
    var ns = Config.NAMESPACE;
    if (Config.DYNAMICLOAD) {
      var filename_path;
      if(location.pathname=="/"||location.pathname.includes("index.html")){
        filename_path = (
          Config.SRC_PATH + (ns.replace(/\./g, "/"))  + "/" + Config.FILENAME
        )
      }
      else {
        filename_path = (
          "framework/src/w3c/ui/UnknownApplication.js"
        )
        if(!Config.NAMESPACE){
          var c = new core.http.ClassLoader;
          c.load("", filename_path, data => {
            window.application = new w3c.ui.UnknownApplication(document.body);
          })
          return;
        } else {
          filename_path = (
            Config.SRC_PATH + (ns.replace(/\./g, "/"))  + "/" + Config.FILENAME
          )
        }
      }

      var path = filename_path.replace("*", Config.USE_COMPRESSED_BUILD ? "min.":"");
      var c = (Config.ENABLE_TRANSPILER) ?
        new core.http.ClassLoader :
        new core.http.ModuleLoader;
          c.load(ns, Config.ROOTPATH + path, data => {
            MainLoop
              .setUpdate(window.application.onUpdate.bind(window.application))
              .setDraw(window.application.onDraw.bind(window.application))
              .setEnd(window.application.onEnd.bind(window.application))
              .start();
          });
    }
  };


  ("cordova" in window) ? 
    document.addEventListener('deviceready', ()=>{
      AndroidFullScreen.immersiveMode(e=>{}, e=>{});
      bootup()
    }, false) : bootup()
}, false);