if(!String.prototype.toDomElement){
    String.prototype.toDomElement = function(){
      var n = document.createRange().createContextualFragment(this.toString())
      return n.firstElementChild;
    }
};
