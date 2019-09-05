/*
  This is a background process that highlights anchor
  links on a page that are enabled for an offline demo.
*/
namespace("core.processes.HrefDemoHighlightMonitor", {
  '@inherits' : core.processes.Activity,

 
  start : function(){
  	this.parent(arguments);
    core.utilities.URIHelpers.highlight(document.querySelectorAll("a"));
    setInterval(function(){
    	core.utilities.URIHelpers.highlight(document.querySelectorAll("a"));
    },10000)
  }

});








