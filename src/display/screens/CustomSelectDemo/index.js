import 'core.ui.SingleSelect';
import 'core.ui.MultiSelect';

namespace `display.screens` (
    class CustomSelectDemo extends Application {
        async onConnected() {
            await super.onConnected();
            var ss = new core.ui.SingleSelect("My Single Select", "Place Holder Label", [
                {text:"This Week", value:"xxx"},
                {text:"Last Week", selected:true},
                {text:"Last 30 Days"},
                {text:"Last 90 Days"},
                {text:"Last 180 Days"}
            ]);

            var ms = new core.ui.MultiSelect("My MultiSelect", "Place Holder Label", [
                {text:"This Week", value:"xxx"},
                {text:"Last Week", selected:true},
                {text:"Last 30 Days"},
                {text:"Last 90 Days"},
                {text:"Last 180 Days"}
            ]);

            application.appendChild(ss);
            application.appendChild(ms);
        }
    }
);
