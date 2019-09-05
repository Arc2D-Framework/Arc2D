; 
Selectables = {
    initialize: function(){
        this._dragselectstart = this._dragselectstart.bind(this);
        this._dragselecting   = this._dragselecting.bind(this);
        this._dragselectend   = this._dragselectend.bind(this);
        
        this.addEventListener("mousedown", this._dragselectstart, false);
    },
    
    _dragselectstart: function(e){
		if(!e) {e = window.event;}
		window.currentDragSelectEvent = this.__buildDragSelectEvent(e, "selectstart");
		window.currentDragSelectEvent.source = this;
		this.dispatchEvent(window.currentDragSelectEvent);
		if (!window.currentDragSelectEvent || window.currentDragSelectEvent.defaultPrevented()) {
			window.currentDragSelectEvent = null;
			try{delete window.currentDragSelectEvent;} catch(e){return false;}
			return false;
		}
		
		this.deselectall(e);
		if(e.preventDefault) {
			e.preventDefault();
		}
		if (e.stopPropagation) {
			e.stopPropagation()
		}
		e.returnValue = false;
		e.cancelBubble=true;
		
        
		if(!this.dragselectstart(e)) {return false;};
        var mouse = Selectables._xyFromEvent(e);
        this.lastMouseX = mouse.x;
        this.lastMouseY = mouse.y;
        
        var d = document.createElement('div');
        d.className = 'square';
        d.style.left = mouse.x + 'px';
        d.style.top = mouse.y + 'px';
		d.style.position = "absolute";
        d.style.border = "1px dashed blue";
		d.style["zIndex"] = application.absoluteZindex();
        document.getElementsByTagName('body')[0].appendChild(d);
        this.selectbox = d;
		this.getSelectableElements();
        document.addEventListener("mousemove", this._dragselecting, false);
        document.addEventListener("mouseup", this._dragselectend, false);
		
    },
	
	deselectall : function(e){
		var nodes = [].toArray(this.querySelectorAll(this.selectabletype + ".selected"));
		for (var i = 0; i <= nodes.length - 1; i++) {
			if(nodes[i].prototype && nodes[i].prototype.deselect){
				nodes[i].prototype.deselect(e);
			} 
		}
	},
    
	dragselectstart : function(e){
		if(e.target !== this.element) {return false};
		return true;
	},
	
    _xyFromEvent: function(e){
        var posx = 0;
        var posy = 0;
        var ev = (!e) ? window.event : e;//Moz:IE
        if (ev.pageX) {//Moz
            posx = ev.pageX;// + window.pageXOffset;
            posy = ev.pageY;// + window.pageYOffset;
        }
        else {
            if (ev.clientX) {//IE
                posx = ev.clientX;// + document.body.scrollLeft;
                posy = ev.clientY;// + document.body.scrollTop;
            }
            else {
                return false;
            }//old browsers
        }
        return {
            x: posx,
            y: posy
        };
    },
    
    _dragselecting: function(e){
        var mouse = Selectables._xyFromEvent(e);
		var selectableElements = this.__selectableElementsCache;
        if (this.selectbox) {
            this.selectbox.style.width = Math.abs(mouse.x - this.lastMouseX) + 'px';
            this.selectbox.style.height = Math.abs(mouse.y - this.lastMouseY) + 'px';
            this.selectbox.style.left = mouse.x - this.lastMouseX < 0 ? mouse.x + 'px' : this.lastMouseX + 'px';
            this.selectbox.style.top = mouse.y - this.lastMouseY < 0 ? mouse.y + 'px' : this.lastMouseY + 'px';
			
			for(var i=0; i<=selectableElements.length-1; i++){
				var proto = selectableElements[i].prototype;
				if(hitTest(this.selectbox, selectableElements[i])){
					/*if(proto && proto.select) {
						window.currentDragSelectEvent.type = "dragselected"
						proto.dispatchEvent(window.currentDragSelectEvent);
						proto.select(e);
					}*/
					window.currentDragSelectEvent.type = "dragselected";
					window.currentDragSelectEvent.target = proto;
					proto.dispatchEvent(window.currentDragSelectEvent);
				}
				else {
					//proto.deselect(e);
					window.currentDragSelectEvent.type = "deselected";
					window.currentDragSelectEvent.target = proto;
					proto.dispatchEvent(window.currentDragSelectEvent);
				}
			}
        }
    },
    
	getSelectableElements : function(){
		var components =[];
		var selectables = this['@selectables'];
		selectables = (selectables instanceof Function) ? selectables() : selectables;
		
		if(selectables instanceof Array) {
		 	for(var i=0; i<=selectables.length-1; i++) {
				var component = selectables[i];
				if(component && component.classname){
					var result = this.querySelectorAll("." + component.classname)||[];
					components = components.concat(result);
				}
			};
			this.__selectableElementsCache = components||[];
			return this.__selectableElementsCache;
		 }
		 else {
		 	try{
				console.warn(this.namespace + "#getSelectableElements() - WARNING:\n\
				The component class attribute named '@selectables' expected to be an array or a function which returns an array of Component namespaces.t")
			} catch(e) {}
		 }
	},
	
    _dragselectend: function(){
        this.selectbox.parentNode.removeChild(this.selectbox);
        this.selectbox = null;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        document.removeEventListener("mousemove", this._dragselecting, false);
        document.removeEventListener("mouseup", this._dragselectend, false);
    },
	
	__buildDragSelectEvent : function(e, evtName){
		var dragevent = new w3c.DragEvent();
		dragevent.type = evtName;
		dragevent.clientX 	= e.clientX;
		dragevent.clientY		= e.clientY;
		dragevent.offsetX 	= e.layerX||e.offsetX;
		dragevent.offsetY 	= e.layerY||e.offsetY;
		dragevent.pageX 	= e.pageX;
		dragevent.pageY 		= e.pageY;
		dragevent.screenX 	= e.screenX;
		dragevent.screenY 	= e.screenY;
		dragevent.layerX 		= e.layerX||e.offsetX;
		dragevent.layerY 		= e.layerY||e.offsetY;
		dragevent.x 			= e.x;
		dragevent.y 			= e.y;
		return dragevent;
	}
};
