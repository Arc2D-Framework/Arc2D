import 'src/core/http/ClassLoader.js';
import 'src/mainloop.js';

document.addEventListener("DOMContentLoaded", e => {
  var link = function(func,scope){
    func.self=scope;
    return func;
  }
  async function bootup() {
    var ns = document.body.getAttribute("namespace");
        ns = ns||Config.NAMESPACE;
    if (Config.DYNAMICLOAD) {
      var filename_path = Config.SRC_PATH + (ns.replace(/\./g, "/"))  + "/" + Config.FILENAME;
      var path = Config.USE_COMPRESSED_BUILD ? 
        filename_path.replace("*", Config.DEBUG ? "src.":"min."):
        filename_path.replace("*","");
      var c = (Config.ENABLE_TRANSPILER) ?
        new core.http.ClassLoader :
        null;
        c.load(ns, Config.ROOTPATH + path, async function init(res) {
          Config.USE_COMPRESSED_BUILD=false;
          if(!NSRegistry[ns]) {
            await wait(1000/30);
            init();
            return;
          }
          var app = window.application = (
            window.application||new NSRegistry[ns](document.body)
          );
          (app instanceof core.ui.World) ? 
            MainLoop
              .setBegin(app.onUpdate)
              .setUpdate(app.onFixedUpdate)
              .setDraw(app.onDraw)
              .setEnd(app.onUpdateEnd)
              .setSimulationTimestep(app.getSimulationTimestep())
              .start() : null;
            // MainLoop
            //   .setBegin(link(app.onUpdate, app))
            //   .setUpdate(link(app.onFixedUpdate,app))
            //   .setDraw(link(app.onDraw,app))
            //   .setEnd(link(app.onUpdateEnd,app))
            //   .setSimulationTimestep( linkapp.getSimulationTimestep())
            //   .start() : null;
        });
    }
  };

  ("cordova" in window) ? 
    document.addEventListener('deviceready', ()=>{
      AndroidFullScreen && AndroidFullScreen.immersiveMode(e=>{}, e=>{});
      bootup()
    }, false) : bootup()
}, false);