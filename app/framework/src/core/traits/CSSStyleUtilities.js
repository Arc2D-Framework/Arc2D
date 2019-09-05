//= require core.traits.ResourcePathTransformer

namespace("core.traits.CSSStyleUtilities");

core.traits.CSSStyleUtilities = {
	__getInheritableStylesheets : function(){
        if(this.parent){
            return this.parent();
        }

        var ancestor    = this.ancestor;
        var classes     = [];
        var ancestors   = [];
        var stylesheets = [];
        
        //debugger;
        if(this["@cascade"]) {
            while(ancestor){
                classes.unshift(ancestor.prototype.classname);
                var styles = ancestor.prototype["@stylesheets"]||[];
                //stylesheets = stylesheets.concat(styles)
                    ancestors.unshift(ancestor);
                    for(var i=0; i<=styles.length-1; i++){ 
                        stylesheets.push(this.relativeToAbsoluteFilePath(styles[i], ancestor.prototype.namespace));     
                    }
                    
                if(ancestor.prototype["@cascade"]) {
                    ancestor = ancestor.prototype.ancestor;
                }
                else { ancestor=null; break; }
            };

            var this_styles = this["@stylesheets"]||[];
            for(var i=0; i<=this_styles.length-1; i++){ 
                stylesheets.unshift(this.relativeToAbsoluteFilePath(this_styles[i],this.namespace));     
            }
        }
        else {
            stylesheets = ([].concat(this["@stylesheets"]||[]));
        }
        this.classList = classes;
        this.classList.push(this.classname);
        return stylesheets;
    },

    loadcss: function(url){
        if(this.parent){this.parent(url); return;}
        var self=this;
        // var usingSking=false;
        var stylesheets = window.loaded_stylesheets;
        if (!stylesheets) {
            window.loaded_stylesheets = {};
            stylesheets = window.loaded_stylesheets;}
        
        //alert("stylesheets[url]: " + (stylesheets[url]||url))
        if(stylesheets[url]){
            self.__onStylesheetLoaded(stylesheets[url]); 
            return;
        }   
        // if((Config.SKIN && stylesheets[Config.SKIN])){
        //     return;
        // }
        // if(Config.SKIN && !stylesheets[Config.SKIN]) {url=Config.SKIN; usingSking=true;}
        // var something_went_wrong = "Error loading stylesheets. Expected an array of style urls or a single url to a stylesheet for this component.";
        var styles = (url||this["@stylesheets"]);

        if(styles) {
            if(styles instanceof Array) {
                styles = styles.reverse();
                for(var i=0; i<=styles.length-1; i++) {
                    //debugger;
                    var path = styles[i];//this.resourcepath(styles[i]);
                    this.loadcss(path);
                }
            }
            else if(typeof styles === "string" && styles.indexOf("http") != 0) {
                //var path = this.resourcepath(styles);
                var path = styles;
                if(stylesheets[path]){return}
                    
                var stylenode= document.createElement('style');
                    stylenode.setAttribute("type", 'text/css');
                    stylenode.setAttribute("rel", 'stylesheet');
                    stylenode.setAttribute("href", path);
                    stylenode.setAttribute("media", 'all');
                    stylenode.setAttribute("component", this.namespace||"");
                    //head.appendChild(stylenode);
                    this.appendStyleSheet(stylenode);
                    stylesheets[path] = stylenode;
                    var oXMLHttpRequest;
                        oXMLHttpRequest = new XMLHttpRequest;
                        oXMLHttpRequest.open("GET", path, true);
                        oXMLHttpRequest.setRequestHeader("Content-type", "text/css");
                        if(oXMLHttpRequest.overrideMimeType){
                            oXMLHttpRequest.overrideMimeType("text/css")
                        }

                        oXMLHttpRequest.onreadystatechange  = function() {
                            if (this.readyState == XMLHttpRequest.DONE) {
                                //if (this.status == 200) {
                                    var _cssText = self.cssTransform(this.responseText);
                                    self.setCssTextAttribute(_cssText, stylenode); 
                                    self.__onStylesheetLoaded(stylenode);           
                                //}
                            }
                        }
                        oXMLHttpRequest.send(null);
            }
            else if(styles && styles.indexOf("http") == 0){
                var cssNode = document.createElement('link');
                cssNode.type = 'text/css';
                cssNode.setAttribute("component", this.namespace||"");
                cssNode.rel = 'stylesheet';
                cssNode.href = this.resourcepath(styles);
                this.appendStyleSheet(cssNode);
                stylesheets[styles] = cssNode;
                self.__onStylesheetLoaded(cssNode);
            }
            else{
                try{console.warn("Unable to resolve path to stylesheet. Invalid uri: '" + styles + "'")} catch(e){}
            }
        }
        else {}
        
    },
    
    cssTransform : function(_cssText){
		var self=this;
		try{
    		_cssText = _cssText.replace(/resource\(([A-Z0-9a-z\'\"\s\_\.\/\\\-.\$\[\]]*)\)/img, function(){
    		    return "url(" + self.resourcepath(arguments[1]) + ")"
    		});
            _cssText = this.onInterpolateResourcePaths(_cssText);
		} catch(e){console.warn("CSS parse warning: unable to parse custom css function 'resourcepath()'")}
		return _cssText;
	},
    
    onStylesheetLoaded : function (style){},
    
    __onStylesheetLoaded : function(style){
    	this.onStylesheetLoaded(style)
    },
    
    setCssTextAttribute : function(_cssText, stylenode){
		if (stylenode && stylenode.styleSheet) {
            stylenode.styleSheet.cssText = _cssText;
        }
        else {
            stylenode.appendChild(document.createTextNode(_cssText));
        }
	},
    
    
	getStyle : function (styleProp, element) {
	    element = element||this.element;
        if (element.currentStyle){
            var y = element.currentStyle[styleProp];
        }
        else if (window.getComputedStyle) {
            var y = document.defaultView.getComputedStyle(element,null).getPropertyValue(styleProp);
        }
        return y;
	},
	
	up : function(classname, element){
	  	classname = classname.replace(".","");
	  	element   = element||this.element;
	  	while(element && !this.hasClass(classname,element)){
	  		element=element.parentNode;
		};
	  	return element;
	},
	
	down : function(classname, element){
		element   = element||this.element;
	  	return this.querySelector(classname, element);
	},
	
	addClass: function(name, element) {
		element = element||this.element;
		
		if (!this.hasClass(name, element)) { 
			element.className += (element.className ? ' ' : '') + name; 
		}
	},
	
	hasClass : function (name, element) {
		element = element || this.element;
	  //return ((element || this.element).className.indexOf(classname) >= 0);
		return (element.className.indexOf(name) >=0)//new RegExp('(\\s|^)'+name+'(\\s|$)').test(element.className);
	},
	
	removeClass : function(name, element){
		element = element||this.element;
		if (this.hasClass(name, element)) {
      		element.className = element.className.replace(
      			new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
   		}
	},
	
	toggleClass : function(className, element){
		element = element||this.element;
		if(this.hasClass(className,element)) {
    		this.removeClass(className,element)
    	}
    	else{
    		this.addClass(className,element)
    	}
	},
	
	createStyleDocument : function (callback) {
		window.loadedstylesheets = window.loadedstylesheets||{};
		if(window.loadedstylesheets[this.namespace]) {
			return;
		}
		var cssCode 		= (this.cssText && this.cssText.indexOf("<%") >= 0) ?
			this.parseTemplate(this.cssText,{}):
			this.cssText;
			
		if(!cssCode || cssCode.length <= 0) { return };
		this.stylesheet = document.createElement('style');
		this.stylesheet.setAttribute("type", 'text/css');
		this.stylesheet.setAttribute("rel", 'stylesheet');
		this.stylesheet.setAttribute("component", this.namespace||"");
		
		
        if (this.stylesheet.styleSheet) {
            this.stylesheet.styleSheet.cssText = cssCode;
        }
        else {
            this.stylesheet.appendChild(document.createTextNode(cssCode));
        }
        this.appendStyleSheet(this.stylesheet)
		window.loadedstylesheets[this.namespace] = true;
		return this.stylesheet;
	},
	
	appendStyleSheet : function(stylesheet){
		var headNode 		= application.head;
		var configscript 	= application.configscript;
		headNode.insertBefore(stylesheet, configscript);
	}
};
