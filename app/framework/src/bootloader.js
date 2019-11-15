import 'src/core/http/ClassLoader.js';
import 'src/core/http/ModuleLoader.js';

document.addEventListener("DOMContentLoaded", e => {
  async function bootup() {
    var ns = Config.NAMESPACE||resolveNs()||'applications.AppEnvironment';
    if (Config.DYNAMICLOAD) {
      var filename_path = (
        Config.SRC_PATH + (ns.replace(/\./g, "/"))  + "/" + Config.FILENAME
      );

      var path = filename_path.replace("*", Config.USE_COMPRESSED_BUILD ? "min.":"");
      var c = (Config.ENABLE_TRANSPILER) ?
        new core.http.ClassLoader :
        new core.http.ModuleLoader;
          c.load(ns, Config.ROOTPATH + path, data => init(ns));
    }
    else { init(ns); }
  };

  function  resolveNs() {
    var nsPath = location.href.split(Config.SRC_PATH)[1];
    var parts  = nsPath?nsPath.split("/"):null;;
        parts  = !parts||parts.length <=0?null:`${parts[0]}.${parts[1]}`;
    return parts;
  }

  function init(ns) {
    var ac = NSRegistry[ns];
    (/\bApplicationContainer\b/.test(ns) && ac) ? new ac(document) : void(null)
  }

  ("cordova" in window) ? 
    document.addEventListener('deviceready', ()=>{
      AndroidFullScreen.immersiveMode(function () { }, function () { });
      bootup()
    }, false) : bootup()

}, false);