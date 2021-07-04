import 'system.ui.Modal';

namespace `display.components` (
    class SampleDialog extends system.ui.Modal {
        constructor() {
            super();
            try{this.hide();}catch(e){}
        }

        async onConnected() {
            await super.onConnected();
            this.watch("#first-name", 'value',  e=> this.firstname = e.val);
            this.watch("#last-name",  'value',  e=> this.lastname  = e.val);
            this.watch("#fav-color",  'value',  e=> this.color     = e.val);
            this.watch("#register",  'checked', e=> this.register  = e.val);
        }

        get value(){
            return {
                firstname : this.firstname,
                lastname : this.lastname,
                color : this.color,
                register_me : this.register
            }
        }

        async onComplete(e){
            e.preventDefault();
            e.stopPropagation();
            this.onHide();
            this.dispatchEvent("success")
        }
    }
);
