import 'src/core/http/ClassLoader.js';
import 'src/core/http/ModuleLoader.js';

document.addEventListener("DOMContentLoaded", e => {
  async function bootup() {
    var ns = Config.NAMESPACE;//||resolveNs();//||'applications.AppEnvironment';
    if (Config.DYNAMICLOAD) {
      var filename_path = (
        Config.SRC_PATH + (ns.replace(/\./g, "/"))  + "/" + Config.FILENAME
      );
      var path = filename_path.replace("*", Config.USE_COMPRESSED_BUILD ? "min.":"");
      var c = (Config.ENABLE_TRANSPILER) ?
        new core.http.ClassLoader :
        new core.http.ModuleLoader;
          c.load(ns, Config.ROOTPATH + path, data => {});
    }
  };

  // function  resolveNs() {
  //   var nsPath = location.href.split(Config.SRC_PATH)[1];
  //   var parts  = nsPath?nsPath.split("/"):null;;
  //       parts  = !parts||parts.length <=0?null:`${parts[0]}.${parts[1]}`;
  //   return parts;
  // }

  ("cordova" in window) ? 
    document.addEventListener('deviceready', ()=>{
      AndroidFullScreen.immersiveMode(e=>{}, e=>{});
      bootup()
    }, false) : bootup()
}, false);