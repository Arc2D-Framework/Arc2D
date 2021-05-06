import 'system.ui.Modal';
//import 'core.ui.ProgressBar';

@cascade(false);
namespace `display.components` (
    class SampleDialog extends system.ui.Modal {
        constructor() {
            super();
            this.hide();
        }


        async onConnected() {
            await super.onConnected();
            this.firstname = this.querySelector("#first-name");
            this.addEventListener("submit", e=> this.onComplete(e));
            // this.progressbar = this.querySelector("progress-bar");
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
                    resolve(this.firstname.value);
                }
                // setTimeout(e => {resolve(123);this.hide()}, 2000)
                this.addEventListener("success",succCB,false);
                this.addEventListener("cancel",failCB,false)
            })
        }

        onHide(){
            this.hide();
            
        }

        hide(){
            this.classList.add("hidden");
        }

        show(){
            this.classList.remove("hidden");
        }

        async onComplete(e){
            // alert("onComplete")
            // this.progressbar.step(0);
            e.preventDefault();
            e.stopPropagation();
            this.onHide();
            this.dispatchEvent("success")
        }
    }
);
