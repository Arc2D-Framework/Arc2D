

namespace `root` (
    class Main extends Application {
        async onConnected() {
            await super.onConnected();
            alert("asd")
            window.meld = meld;
            this.on("dragstart", e=> this.onDragStart(e),   true, ".draggable");
            this.on("dragend",   e=> this.onDragEnd(e),     true, ".draggable");
            this.on("dragover",  e=> this.onDragOver(e),    true, ".slot");
            this.on("dragenter", e=> this.onDragEnter(e),   true, ".slot");
            this.on("dragleave", e=> this.onDragLeave(e),   true, ".slot");
            this.on("drop",      e=> this.onDrop(e),        true, ".slot");
            // this.before('onDragStart', e => {
            //     // debugger;
            //     console.log("onDragStart",e)
            //     // console.log(methodCall.args)
            //     // methodCall.proceed();
            // });
            // this.before('onDrop', e => {
            //     console.log("onDrop",e)
            // })
        }

        around(method,func){
            meld.around(this, method, func)
        }
        before(method,func){
            meld.before(this, method, func)
        }

        after(method,func){
            meld.after(this, method, func)
        }

        async onDragStart(e) {
            // e.target.classList.add("hold");
            // await wait(100);
            // e.target.className = "";
            this.item = e.target;
        }

        onDragEnd(e) {
            // e.target.className = "fill";
        }

        onDragOver(e) {
            e.preventDefault();
        }

        onDragEnter(e) {
            e.preventDefault();
            e.target.classList.add("hovered");
        }

        onDragLeave(e) {
            e.target.classList.remove("hovered");
        }

        onDrop(e) {
            e.target.classList.remove("hovered");
            e.target.append(this.item);
        }
    }
);
var m = root.Main;
    export {m}
