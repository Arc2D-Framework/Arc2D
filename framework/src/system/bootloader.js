import 'src/system/http/ClassLoader.js';
import 'src/system/mainloop.js';

document.addEventListener("DOMContentLoaded", e => {
  async function bootup() {
    var ns = document.body.getAttribute("namespace");
        ns = ns||Config.NAMESPACE;
    if (Config.DYNAMICLOAD) {
      var filename_path = Config.SRC_PATH + (ns.replace(/\./g, "/"))  + "/" + Config.FILENAME;
      var path = Config.USE_COMPRESSED_BUILD ? 
        filename_path.replace("*", Config.DEBUG ? "src.":"min."):
        filename_path.replace("*","");
      var c = (Config.ENABLE_TRANSPILER) ?
        new system.http.ClassLoader :
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
            if(app instanceof core.ui.World) {
              window.world=app;
              var af=1;
              try{eval("class T {do=()=>{}}")}catch(e){af=0}
              MainLoop
                .setBegin(af?app.onUpdate:app.onUpdate.bind(app))
                .setUpdate(af?app.onFixedUpdate:app.onFixedUpdate.bind(app))
                .setDraw(af?app.onDraw:app.onDraw.bind(app))
                .setEnd(af?app.onUpdateEnd:app.onUpdateEnd.bind(app))
                .setSimulationTimestep(app.getSimulationTimestep())
                .start();
            }
        });
    }
  };

  ("cordova" in window) ? 
    document.addEventListener('deviceready', ()=>{
      AndroidFullScreen && AndroidFullScreen.immersiveMode(e=>{}, e=>{});
      bootup()
    }, false) : bootup()
}, false);