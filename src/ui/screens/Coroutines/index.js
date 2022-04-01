
function coroutine(f) {
    var o = f(); // instantiate the coroutine
    o.next(); // execute until the first yield
    return function(x) {
        o.next(x);
    }
}

namespace `ui.screens` (
    class Coroutines extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.box = this.querySelector("#box");
            this.drag = coroutine(this.mouse.bind(this));
            this.on("mousedown", this.drag, false, "#box");

            
            // this.on("mousemove mouseup", this.drag, false)
            document.addEventListener("mousemove", this.drag, false)
            document.addEventListener("mouseup", this.drag, false)
        }

        *mouse() {
            var e;
            while (e = yield) {
                if (e.type == 'mousedown') {
                    while (e = yield) {
                        if (e.type == 'mousemove') this.onDrag(e);
                        if (e.type == 'mouseup') break;
                    }
                }
            }
        }

        addEventListener(evtName, handler, bool=false, el) {
            evtName = evtName.split(" ");
            if (typeof el == "string") {
                for(let evt of evtName) {
                    this.addEventListener(evt, e => {
                        var t = (e.composedPath&&e.composedPath().find(node => node.matches&&node.matches(el)))||e.target;
                            t && t.matches(el) && (e.matchedTarget = t) && handler(e);
                    }, bool);
                }
            } else {
                if(this.isExistingDomNode(this.element)){
                    for(let evt of evtName) {this.element.addEventListener(evt, handler, bool);}
                    if(evtName == "connected"){
                        handler({target:this});
                    }
                }
                else{
                    for(let evt of evtName) {super.addEventListener(evt, handler, bool);}
                    if(evtName == "connected" && this._is_connected){
                        handler({target:this});
                    }
                }
            }
        }

        onDrag(e){
            this.box.style.left = e.clientX + "px";
            this.box.style.top = e.clientY + "px";
        }
    }
);
