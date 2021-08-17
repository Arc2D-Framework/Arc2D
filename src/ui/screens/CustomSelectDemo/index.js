import 'ui.components.Splash';
import 'ui.components.SingleSelect';
import 'ui.components.MultiSelect';
var {SingleSelect, MultiSelect} = ui.components;


namespace `ui.screens` (
    class CustomSelectDemo extends Application {
        async onConnected() {
            await super.onConnected();
            var ss = new SingleSelect("My Single Select", "Place Holder Label", [
                {text:"This Week", value:"xxx"},
                {text:"Last Week", selected:true},
                {text:"Last 30 Days"},
                {text:"Last 90 Days"},
                {text:"Last 180 Days"}
            ]);
            ss.on("change", e=> this.onChange(e), true);

            var ms = new MultiSelect("My MultiSelect", "Place Holder Label", [
                {text:"This Week", value:"xxx"},
                {text:"Last Week", selected:true},
                {text:"Last 30 Days"},
                {text:"Last 90 Days"},
                {text:"Last 180 Days"}
            ]);

            application.appendChild(ss);
            application.appendChild(ms);
        }

        onChange(e){
            alert("single select updated!: " + e.data.display)
            console.log(e)
        }
    }
);
