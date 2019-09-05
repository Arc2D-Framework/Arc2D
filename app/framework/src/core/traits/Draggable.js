Draggable = {
	//nativednd : Use true for native DnD architecture. Use false to activate HTML5 DnD-Emulation.
	'@nativednd' : true,
	
	initialize : function(){
		this.setDraggable();
	},
	
	setDraggable : function(){
		if (this["@nativednd"] == false || this.is_ie() || !Modernizr.draganddrop) {
			if (this.element.getAttribute("draggable") == "true") {
				this.element.setAttribute("draggable", false);
				this._dragstart 	= this._dragstart.bind(this);
				this._drag 			= this._drag.bind(this);
				this._dragend 	= this._dragend.bind(this);
				this.addEventListener("mousedown", this._dragstart, false);
			}
		}
		if (this.element.getAttribute("droppable") == "true") {application.addDropContainer(this);}
	},
	
	is_ie: function(){
		var versions = [6,7,8];
		return false; //$.browser.msie && (versions.indexOf(Math.floor(parseInt($.browser.version,10))) >= 0)
	},
	
	_dragstart: function(e){
		if(!e) {e = window.event;}
		if(e.preventDefault) {
			e.preventDefault();
		}
		if (e.stopPropagation) {
			e.stopPropagation()
		}
		e.returnValue = false;
		e.cancelBubble=true;
		
		//this.__normalizeEvent(e)
		window.currentDragEvent = this.__buildDragEvent(e, "dragstart");
		this.dispatchEvent(window.currentDragEvent);
		/*console.log([
			"layerX:"+e.layerX, 
			"offsetX:"+e.offsetX,
			"pageX:"+e.pageX,
			"clientX:"+e.clientX
		].join("\n"));*/
		if (!window.currentDragEvent || window.currentDragEvent.defaultPrevented()) {
			window.currentDragEvent = null;
			try{delete window.currentDragEvent;} catch(e){return false;}
			return false;
		}
		else {
			this.associatedragimage(this.initdragimage(window.currentDragEvent));
			this._acceptableDropContainers = application.getAcceptableDropContainersByInstance(this); //tests this.accepts() on droppable
			this._acceptableDropContainers = this.filterDropContainers(this._acceptableDropContainers);
			this.lastMouseX = parseInt(e.clientX); 
			this.lastMouseY = parseInt(e.clientY);
			this.startMouseX = parseInt(e.clientX); //will be used for threshold
			this.startMouseY = parseInt(e.clientY);  //will be used for threshold
			application.addEventListener("mousemove", this._drag,    		true);
			application.addEventListener("mouseup",    	this._dragend, 	true);
			return;
		}
	},
	
	_drag : function(e){
		var _hidden=true;
		if(_hidden && Math.abs(e.clientX-this.startMouseX) >= 5 || Math.abs(e.clientY-this.startMouseY) >= 5) {
			this.draggableimage.style.display="block"; 
			_hidden=false
		};
		//this.__normalizeEvent(e)
		window.currentDragEvent.type 		= "drag";
		window.currentDragEvent.clientX 	= e.clientX;
		window.currentDragEvent.clientY		= e.clientY;
		window.currentDragEvent.offsetX 	= e.offsetX;
		window.currentDragEvent.offsetY 	= e.offsetY;
		window.currentDragEvent.pageX 	= e.pageX;
		window.currentDragEvent.pageY 		= e.pageY;
		window.currentDragEvent.screenX 	= e.screenX;
		window.currentDragEvent.screenY 	= e.screenY;
		window.currentDragEvent.layerX 		= e.layerX||e.offsetX;
		window.currentDragEvent.layerY 		= e.layerY||e.offsetY;
		window.currentDragEvent.x 			= e.x;
		window.currentDragEvent.y 			= e.y;
		window.currentDragEvent.eventPhase 	= e.eventPhase;
		window.currentDragEvent.component 	= this;
		window.currentDragEvent.target 			= this.element;
		window.currentDragEvent.lastMouseX	= this.lastMouseX||0;
		window.currentDragEvent.lastMouseY	= this.lastMouseY||0;
		this.dispatchEvent(window.currentDragEvent);
		
		var realdraggable = this.draggableimage;//set by this.dragimage();
		var x 	= parseInt(this.getStyle("left",realdraggable));
		var y 	= parseInt(this.getStyle("top",realdraggable));
		var ey	= e.clientY;
		var ex	= e.clientX;
		var nx 	= x + ((ex - this.lastMouseX));
		var ny 	= y + ((ey - this.lastMouseY));
		this.drag({x:nx, y:ny, event:e});
		this.lastMouseX = ex
		this.lastMouseY = ey;
		
		var dropZone = this.droppablesFromPoint(e.clientX, e.clientY);
	
		if (dropZone && (dropZone.element && dropZone.element !== realdraggable)) {
			if (dropZone !== this.currentDropZone) {
					window.currentDragEvent.type = "dragenter";
					dropZone.dispatchEvent(window.currentDragEvent);
					this.currentDropZone = dropZone;
			}
			window.currentDragEvent.type = "dragover";
			var width = dropZone.element.offsetWidth; //$
			var layX = window.currentDragEvent.layerX;
			var pos = (typeof layX  != "undefined") ? layX : 0;
			var half = width/2;
			var left = (pos >=0 && pos <= half);
			var right = (pos >=half && pos <= width);
			var hDir = (left) ? "west" : "east";
			//-------------------------------vertical----------------------------------
			var height = $(dropZone.element).height();
			var layY = window.currentDragEvent.layerY;
			var pos = (typeof layY  != "undefined") ? layY : 0;
			var half_height = height/2;
			var top = (pos >=0 && pos <= half_height);
			var bottom = (pos >=half_height && pos <= height);
			var vDir = (top) ? "north" : "south";
	
			window.currentDragEvent.location = {
				left :left, 
				right:right, 
				layerX:pos, 
				direction : {
					horizontal : hDir, vertical:vDir
				}
			};
			
			dropZone.dispatchEvent(window.currentDragEvent);
		}
		else {
			if(this.currentDropZone){
				window.currentDragEvent.type = "dragleave";
				this.currentDropZone.dispatchEvent(window.currentDragEvent);
				this.currentDropZone = null;
			}
		}
    },
	
	_dragend : function(e){
		this._acceptableDropContainers = null;
		application.removeEventListener("mousemove", this._drag, 	   true);
		application.removeEventListener("mouseup",   	 this._dragend, true);
		if(this.currentDropZone) {
			window.currentDragEvent.type = "drop";
			this.currentDropZone.dispatchEvent(window.currentDragEvent);
			this.__container = this.currentDropZone;
		}
		
		window.currentDragEvent.type = "dragend";
		this.dispatchEvent(window.currentDragEvent);
		this.destroydragimage();
		//this.deactivateDropContainers();
    },
	
	/*deactivateDropContainers : function(){
		var containers = application.getAllDropContainers();

		for(var i=0; i<= containers.length-1; i++) {
			containers[i].prototype.ondragleave({});
		}
	},*/
	
	__buildDragEvent : function(e, evtName){
		var dragevent = new w3c.DragEvent();
		dragevent.type = (evtName||"dragdrop");
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
		
		dragevent.dataTransfer = new w3c.DataTransfer;
		return dragevent;
	},
	
	__normalizeEvent : function(e){
		var fromTarget = e.relatedTarget || e.fromElement;
		var toTarget 	  = e.relatedTarget || e.toElement;
		var srcTarget  = e.target||e.srcElement;
		if (srcTarget && srcTarget.nodeType == 3) {
			// defeat Safari bug
			srcTarget = targ.parentNode;
		};
		var keycode = e.keyCode||e.which;
		var character = String.fromCharCode(keycode);
		var mousebutton = e.which||e.button;
		var rightclicked = ((e.which && mousebutton==3) || (e.button && e.button == 2));
		
		var posx = 0;
		var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		
		var normalized_evt = {
			fromTarget : fromTarget,
			toTarget:toTarget,
			srcTarget:srcTarget,
			mouseX:posx,
			mouseY:posy
		}
		console.log(normalized_evt)
	},
	
	canceldrag : function(e){return true},	
	
	resetdragimage : function(e){return false},
	
	initdragimage : function(e){
		var dragimg = this.element.cloneNode(true);
		var position = $(this.element).position();
		dragimg.originalLeft = position.left;
		dragimg.originalTop = position.top;
		$(dragimg).css({
			position : "absolute", 
			"z-index": application.absoluteZindex(), 
			top 	 : (position.top +e.layerY+4)  + "px", 
			left	 : (position.left+4) + "px",
			display  :"none",
			opacity  : .4
		});
		return dragimg;
	},
	
	destroydragimage : function(){
		var self=this;
		if(!this.draggableimage) {return;}
		
		if (this.animaterevert() && !this.currentDropZone) {
			$(this.draggableimage).animate({
				left : this.draggableimage.originalLeft,
				top : this.draggableimage.originalTop}, {
				queue:false, 
				duration:500, 
				easing:"expoEaseOut", 
				complete: function(){
					self.draggableimage.parentNode.removeChild(self.draggableimage);
					self.draggableimage.realparent = null;
					self.draggableimage = null;
					self.draggableimage = null;
				}});
			return;
		}
		else {
				self.draggableimage.parentNode.removeChild(self.draggableimage);
				self.draggableimage.realparent = null;
				self.draggableimage = null;
				self.draggableimage = null;
		}
	},
	
	dragelement : function() {
		return this.dragimage();
	},
	

	dragimage : function(){
		if(!this.draggableimage || this.resetdragimage()) {this.initdragimage()};
		return this.draggableimage;
	},
	
	associatedragimage : function(dragimg){
		this.draggableimage = dragimg;
		if (this.draggableimage != this.element) {
			this.element.parentNode.appendChild(this.draggableimage);
		}
		return this.draggableimage;
	},
	
	filterDropContainers : function(zones){ /*Example: Limit size of viewport*/		
		/*var zoneslist=[];
		zones.forEach(function(zone){
			var x = zone.element.offsetLeft - application.scrollX();
			if(window.searchbox.isOpen()){
				if(x <= window.innerWidth && x >= 200){
					zoneslist.push(zone);
				}
			}
			else if(x <= window.innerWidth && x>= -130) { 
				zoneslist.push(zone);
			}
		});
		return zoneslist;*/
		return zones||[];
	},
	
	droppablesFromPoint : function(x,y, el){
		var pos = this._acceptableDropContainers.indexOf(document.elementFromPoint(x,y));
		if(pos >=0) {
			var el = this._acceptableDropContainers[pos];
			if(el && el.prototype) {return el.prototype}
		}
	},
	
	dragstart : function(e){
		return this.canDrag;
	},
	
	drag : function(e){
		if (this.constrained()) {
			return this.constraintdrag(e);
		}
		else {
			window.isDragging = true;
			this.draggableimage.style.left = (e.x) + "px";
			this.draggableimage.style.top = (e.y) + "px";
			return true;
		}
	},
	
	constraintdrag : function(e){
		var el = this.__container.element;
		if(e.event.clientX-10 < el.offsetLeft){return false;}
		if(e.x <=0 || e.x >=380) {return false;}
		else {this.draggableimage.style.left = (e.x) + "px";}
		
		if(e.event.clientY < el.offsetTop){return false;}
		if(e.y <=0 || e.y >=380) {return false;}
		else {this.draggableimage.style.top = (e.y) + "px";}
		return true;
	},
	
	ondragend : function(e){
		this.destroydragimage();
		window.isDragging=false;
	},
	
	dragover : function(e){
	},
	
	dragenter : function(e){
	},
	
	dragcanceled : function(e){
		window.isDragging=false;
	},
	
	dragdrop  : function(e){
		window.isDragging=false;
	},
	
	dragdropped  : function(e){
		window.isDragging=false;
	},
	
	
	dragexit : function(e){
	},
	
	accepts : function(){
		return true;
	},
	
	__drag_is_constrained:false,
	constrained : function(_bool){
		if(typeof _bool == "boolean") {
			this.__drag_is_constrained = _bool;
		}
		return this.__drag_is_constrained;
	},
	
	dragcontainer : function(e){
		this.element.parentNode;
	},
	
	animaterevert : function(){
		return true;
	}
};


