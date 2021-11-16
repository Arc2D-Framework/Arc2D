
namespace `ui.components` (
	class Sprite extends Component  {
		onUpdate(){
			console.log("onUpdate")
		}

		async onConnected() {
            await super.onConnected();
		}
		
		onLoadInstanceStylesheets(){return false}

	}
)