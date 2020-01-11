
if(!String.prototype.toDomElement){
  String.prototype.toHtmlElement = String.prototype.toDomElement = function () {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = this.toString();
        var df= document.createDocumentFragment();
            df.appendChild(wrapper);
        return df.firstElementChild.firstElementChild;
    }
};

function getVendorPrefixed(prop){
    var i, 
    s = window.getComputedStyle(document.documentElement, ''), 
    v = ['ms','O','Moz','Webkit'];
    if( prop in s) return prop;
    prop = prop[0].toUpperCase() + prop.slice(1);
    for( i = v.length; i--; )
        if( v[i] + prop in s) return (v[i] + prop);
};

if(!String.prototype.toVendorPrefix){
    String.prototype.toVendorPrefix = function(){
        return getVendorPrefixed(this.toString());
    }
};


if(!String.prototype.htmlEscape){
    String.prototype.htmlEscape = function(){
      return String(this)
                .replace(/&/g, '&amp;',"g")
                .replace(/"/g, '&quot;',"g")
                .replace(/'/g, '&#39;',"g")
                .replace(/</g, '&lt;',"g")
                .replace(/>/g, '&gt;',"g"); 
    }
};

if(!String.prototype.htmlUnescape){
    String.prototype.htmlUnescape = function(){
      return String(this)
                .replace(/&amp;/g, '&',"g")
                .replace(/&quot;/g, '\"',"g")
                .replace(/&#39;/g, '\'',"g")
                .replace(/&lt;/g, '<',"g")
                .replace(/&gt;/g, '>',"g"); 
    }
};


if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
};


String.prototype.toLocaleString = function(langCode){
  langCode = langCode||Session.State.currentLanguage.CODE;
  var key = this.toString();
  if(Localization){
    if(Localization[langCode]){
      return Localization[langCode][key]||
             Localization[langCode][key.toLowerCase()]||key;
    } else {
      return key;
    }
  }
  else {
    return key;
  }
};

