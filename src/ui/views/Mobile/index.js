
@tag("mobile-page");
namespace `ui.views` (
	class Mobile extends WebComponent  {
		async onConnected(){
			await super.onConnected();
			this.onclk = this.onBodyClick.bind(this);
		}

		onBodyClick(e){
			console.log(`CLICK detected from ${this.namespace}`, e)
		}

		onBeforeAwake(){
			// alert("onBeforeAwake " + this.namespace)
		}

		onBeforeSleep(){
			// alert("onBeforeSleep " + this.namespace)
		}

		onAwake(){
			console.log("Awaking " + this.namespace)
			document.addEventListener("click", this.onclk, false)
		}

		onSleep(){
			console.log("Sleeping " + this.namespace)
			document.removeEventListener("click", this.onclk, false)
		}
	}
)
