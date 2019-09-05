
namespace("w3c.CSSSelectors");

w3c.CSSSelectors = {
	querySelectorAll : function(cssSelector, element){
		element = element || this.element;
		if(document.querySelectorAll) {
			return [].toArray(element.querySelectorAll(cssSelector))}
		else {
			throw new Error("'#querySelectorAll()' api not defined")
		}
	},
	
	querySelector : function(cssSelector, element){
		element = element || this.element;
		if(document.querySelector) {
			return element.querySelector(cssSelector);}
		else {
			throw new Error("'#querySelector()' api not defined");
		}
	}
};

