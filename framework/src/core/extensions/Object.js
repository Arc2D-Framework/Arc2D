Object.defineProperty(Object.prototype, 'toQueryString', {
  enumerable: false,
  configurable: false,
  value: function(obj,prefix) {
    obj=obj||this;
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ?
          this.toQueryString(v, k) :
          k + "=" + v);
      }
    }
    return str.join("&");
  }
});