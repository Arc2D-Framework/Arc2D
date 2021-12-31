
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
            this.drag = coroutine(function*() {
                var e;
                while (e = yield) {
                    if (e.type == 'mousedown') {
                        while (e = yield) {
                            if (e.type == 'mousemove') this.onDrag(e);
                            if (e.type == 'mouseup') break;
                        }
                    }
                }
            }.bind(this));
            this.on("mousedown", this.drag, false, "#box")
            document.addEventListener("mousemove", this.drag, false)
            document.addEventListener("mouseup", this.drag, false)
        }

        addEventListener(evtName, handler, bool=false, el) {
            if (typeof el == "string") {
                super.addEventListener(evtName, e => {
					var t = (e.composedPath&&e.composedPath().find(node => node.matches&&node.matches(el)))||e.target;
					    t && t.matches(el) && (e.matchedTarget = t) && handler(e);
                }, bool);
            } else {
                if(this.isExistingDomNode(this.element)){
                    this.element.addEventListener(evtName, handler, bool);
                    if(evtName == "connected"){
                        handler({target:this});
                    }
                }
                else{

                    return super.addEventListener(evtName, handler, bool);
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
