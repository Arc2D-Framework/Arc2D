import 'system.ui.Splash';

async function include(ns){
    ns = arguments[1]
    return new Promise((resolve, reject) => {
        let c = new system.http.ClassLoader;
        c.import(ns).then(async function init(){
            var klass = NSRegistry[ns];
            resolve(klass)
        })
    })
}

namespace `system.ui` (
    class ComponentViewer extends Application {
        async onConnected() {
            await super.onConnected();
            var ns = location.search.split("?ns=")[1]
            var klass = await include `${ns}`;
            document.body.appendChild(new klass)
        }
    }
);


