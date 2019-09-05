if ("logging" in Config && Config.LOGGING != true) {
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

window.imported_classes = window.imported_classes || {};
window.imports = async function (x, opts, isError) {
    opts = opts || { cache: Config.IMPORTS_CACHE_POLICY || "no-store" };
    return new Promise(async (resolve, reject) => {
        // var path = /^https?:/.test(x)? x : Config.ROOTPATH + x;
        var path = x;
        path = path.replace(/^\/+/, Config.ROOTPATH);
        var error = "Unable to load: " + path;

        if (window.imported_classes[x]) {
            console.warn("redundant imports to : " + x + " detected");
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
                console.error(error, src);
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
