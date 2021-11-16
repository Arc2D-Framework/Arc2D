
namespace `system.ui` (
    class Modal extends WebComponent {
        constructor() {
            super();
            try{this.hide();}catch(e){}
        }

        // static get template(){
        //     var ns = this.prototype.namespace;
        //     return Config.SRC_PATH + ns.replace(/\./g,"/") + "/index.html"
        // }
        

        async onConnected() {
            await super.onConnected();
            this.form = this.querySelector("form");
            this.formheader = this.querySelector("form > header");
            this.originalTransition = this.form.style.transition;
            this.addEventListener("click", e=>this.onCancel(e), false, "#cancel-button");
            this.addEventListener("submit", e=> this.onComplete(e), true);
            this.on("mousedown", e=> this.onGrab(e), false, "form > header");
            this.addEventListener("click", e=>this.onHide(e), false, ".close-button");
            this.addEventListener("mouseup", e=> this.onRelease(e), false);
            this.addEventListener("mousemove", e=> this.onDrag(e), false);
            //validation
            this.addEventListener("input",   e => this.setCustomValidity(e), true, "*[required]");
            this.addEventListener("invalid", e => this.setValidityMessage(e), true, "*[required]");
            if(this.isDismissable){
                this.insertAdjacentHTML('afterbegin', '<div id="overlay"></div>');
                this.on("click", e=> this.onCancel(e), false, "#overlay");
            }
            
        }
        
        get isDismissable(){
            return false;
        }

        async prompt(){
            if(!this.parentNode){
                document.body.appendChild(this);
                await wait(100);
            }
            this.show();
            return new Promise((resolve,reject)=>{
                var failCB = e => {
                    this.removeEventListener("success",succCB,false);
                    this.removeEventListener("cancel",failCB,false);
                    resolve(null);
                }
                var succCB = e => {
                    this.removeEventListener("success",succCB,false);
                    this.removeEventListener("cancel",failCB,false);
                    resolve(this.value);
                }
                this.addEventListener("success",succCB,false);
                this.addEventListener("cancel",failCB,false)
            })
        }

        onRelease(){
            this.form.style.transition = this.originalTransition;
            this.active = false;
            this.dragItem = null;
            this.form.style.transform = "translateZ(0px) scale(1)";
            this.formheader.style.cursor = "grab";
        }

        onGrab(e){
            e.preventDefault();
            e.stopPropagation();
            var style = window.getComputedStyle(this.form);
            var matrix = new DOMMatrix(style.transform);
            this.matrix = matrix;
            this.initialX = e.src.pageX;
            this.initialY = e.src.pageY;
            if (e.target) {
                this.formheader.style.cursor = "grabbing";
                this.form.style.transition = "none";
                this.dragItem = this.form;
                this.active = true;
            } else {
                this.form.style.transition = this.originalTransition;
                this.active = false;
                this.dragItem = null;
            }
        }

        onDrag(e){
            e.preventDefault();
            e.stopPropagation();
            if (this.active && this.dragItem) {
          
                e.preventDefault();
              
                this.currentX = (e.pageX - this.initialX)+this.matrix.m41;
                this.currentY = (e.pageY - this.initialY)+this.matrix.m42;
                this.setTranslate(this.currentX, this.currentY, this.dragItem);
            }
        }
    
        setTranslate(xPos, yPos, el) {
          el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }

        setCustomValidity(e){
            e.target.setCustomValidity('')
        }

        setValidityMessage(e){
            if(!e.target.getAttribute("required")){e.target.setCustomValidity("");return}

            if (e.target.value.length<=0) {
                var msg = e.target.getAttribute("validation-message")
                e.target.setCustomValidity(msg);
                this.classList.add("shake");
                setTimeout(e=>this.classList.remove("shake"),700);
            } else {
                e.target.setCustomValidity("")
            }
        }

        onCancel(e){
            this.dispatchEvent("cancel")
            this.onHide(e);
            return null
        }
        
        async onComplete(e){
            e.preventDefault();
            e.stopPropagation();
            this.onHide();
            this.dispatchEvent("success");
            return this.value
        }

        onHide(e){
            this.hide();
        }

        hide(){
            try{
                this.classList.add("hidden");
            }catch(e){}
        }

        show(){
            this.classList.remove("hidden");
        }

        set value(data){
            this.data = data;
        }

        get value(){
            return this.data
        }
    }
);
