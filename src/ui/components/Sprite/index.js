@tag("sprite-2d");
namespace `ui.components` (
	class Sprite extends core.ui.Component2D  {
		onUpdate(){
			console.log("onUpdate")
		}

		async onConnected() {
            await super.onConnected();
		}
		
		onLoadInstanceStylesheets(){return false}

		onAwake(){
            debugger;
            window.component2d_instances = window.component2d_instances||[];
            window.component2d_instances.push(this);
        }
	}
)