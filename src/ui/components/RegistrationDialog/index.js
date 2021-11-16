import 'system.ui.Modal';

namespace `ui.components` (
    class RegistrationDialog extends system.ui.Modal {
        async onConnected() {
            await super.onConnected();
            this.firstname.value = this.value.firstname;

            this.watch(this.firstname,  'value',  e => this.value.firstname = e.value);
            this.watch(this.lastname,   'value',  e => this.value.lastname  = e.value);
            this.watch(this.address,    'value',  e => this.value.address   = e.value);
            this.watch(this.color,      'value',  e => this.value.color     = e.value);
            this.watch(this.register,   'checked',e => this.value.register  = e.checked);
        }

        // get isDismissable(){
        //     return true;
        // }
    }
);
