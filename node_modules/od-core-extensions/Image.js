
Session.State.loaded_background_images = {};

Image.prototype.load = function(url){
    url = url||this.src;
    var thisImg = this;
    if(Session.State.loaded_background_images[url]){
        console.info("loading bg image from cache instead of network request")
        thisImg.completedPercentage = 100;
        thisImg.onprogress(100);
        thisImg.src = Session.State.loaded_background_images[url];
    } else {

    var xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open('GET', url,true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.timeout = 10000;
        xmlHTTP.ontimeout = function () { 
            console.error("Image.prototype.load() - Timed out while loading: " + url)
            thisImg.completedPercentage = 100;
            thisImg.onprogress(100);
            thisImg.onerror();
        }
        xmlHTTP.onload = function(e) {
            var blob = new Blob([this.response]);
            thisImg.src = window.URL.createObjectURL(blob);
            Session.State.loaded_background_images[url] = thisImg.src;
        };
        xmlHTTP.onprogress = function(e) {
            var amount = parseInt((e.loaded / e.total) * 100);
            thisImg.completedPercentage = amount;
            thisImg.onprogress(amount);
        };
        xmlHTTP.onloadstart = function() {
            thisImg.completedPercentage = 0;
        };
        xmlHTTP.onerror = function(e) {
            thisImg.completedPercentage = 100;
            thisImg.onprogress(100);
            thisImg.src="";
            console.error("Image.prototype.load() error loading image:\n" + url, e);
            var evt = document.createEvent('Event');
            evt.initEvent('load', true, true);
            thisImg.dispatchEvent(evt);
        };
        xmlHTTP.send();
    }
};

Image.prototype.completedPercentage = 0;
