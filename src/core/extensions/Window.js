window.registered_tags=window.registered_tags||{};//see: core.ui.ManagedComponent and initializeChildComponents for usage

if ("LOGGING" in Config && Config.LOGGING != true) {
    for (var k in console) {
        console[k] = function () { };
    }
}

window.getParameterByName = function (name, url) {
    var match = RegExp("[?&]" + name + "=([^&]*)").exec(
        url || window.location.href
    );
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};

window.toAbsoluteURL = function(url) {
    const a = document.createElement("a");
    a.setAttribute("href", url);
    return a.cloneNode(false).href; 
}
//TDOD: Not returning what i expected, a class ref
//ex, classof `core.drivers.storage.Memory`;
window.classof = function(ns){
    return NSRegistry[ns];
}


window.imported_classes = window.imported_classes || {};
window.imports = async function (x, opts, isError) {
    opts = opts || { cache: Config.IMPORTS_CACHE_POLICY || "no-store" };
    return new Promise(async (resolve, reject) => {
        var path = x;
        path = path.replace(/^\/+/, Config.ROOTPATH);
        var error = "404 import: " + toAbsoluteURL(path)||path;

        if (window.imported_classes[x]) {
            resolve(window.imported_classes[x]);
            return;
        }

        try {
            const response = await fetch(path, opts);
            if (response.ok) {
                const res = await response.text().then(src => {
                    window.imported_classes[x] = src;
                    resolve(src);
                });
            } else {
                //then()-else{} when ran from server. catch() block never runs
                var src = await response.text();
                console.error(error);
                resolve(null);
            }
        } catch (e) {
            var request = new XMLHttpRequest();
            request.open('GET', path, false);
            request.send(null);

            if (request.status == 0 || request.status == 200) {
                src = request.responseText;
                window.imported_classes[x] = src;
                resolve(src);
            }
        }
    });
};




window.Key = {
  _pressed: {},

  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  A: "KeyA",
  D: "KeyD",

  isDown: function(code) {
    return this._pressed[code];
  },
  
  onKeydown: function(e) {
    this._pressed[e.code] = true;
  },
  
  onKeyup: function(e) {
    delete this._pressed[e.code];
  }
};
window.addEventListener('keyup', function(e) { Key.onKeyup(e); }, false);
window.addEventListener('keydown', function(e) { Key.onKeydown(e); }, false);
