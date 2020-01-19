
namespace `docs.topics` (
	class AssetStore  extends docs.topics.Topic  {
		onConnected(){
			super.onConnected();
			this.bind("#launchit", "click", e => this.onLaunch(e));
		}

		onLaunch(){
			var loader = new docs.topics.LoaderActivity;
			application.appendChild(loader)
		}
	}
)