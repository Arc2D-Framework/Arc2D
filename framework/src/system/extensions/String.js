;String.prototype.toNode = function(fragment=false){
  var n = document.createRange().createContextualFragment(this.toString())
  return fragment?fragment:n.firstElementChild;
}
String.prototype.toDomElement = function(){
  console.warn(".toDomElement() is deprecated. Use <String>.toNode()");
  return this.toNode();
}