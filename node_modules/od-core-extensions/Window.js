if("LOGGING" in Config && Config.LOGGING != true) {
  for(var k in console){
      console[k]=function(){};
  }
};


window.getParameterByName = function(name, url) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(url||window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};


window.toQueryString = function(obj, prefix) {
  var str = [];
  for(var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v == "object" ?
        toQueryString(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}
