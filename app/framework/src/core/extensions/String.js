
if(!String.prototype.toDomElement){
    String.prototype.toDomElement = function(){
      var n = document.createRange().createContextualFragment(this.toString())
      if(!n) {console.error("#toDomElement() - Error parsing html",this.toString())}
      return n.firstElementChild;
    }
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