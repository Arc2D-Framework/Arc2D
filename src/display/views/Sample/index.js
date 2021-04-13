
@tag("sample-page");
namespace `display.views` (
	class Sample extends WebComponent  {
		async onConnected(){
			await super.onConnected();
		}

		onBeforeAwake(){
			// alert("onBeforeAwake " + this.namespace)
		}

		onBeforeSleep(){
			// cons("onBeforeSleep " + this.namespace)
		}
	}
)