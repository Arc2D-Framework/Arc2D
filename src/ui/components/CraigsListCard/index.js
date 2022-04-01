
namespace `ui.components` (
	class CraigsListCard extends WebComponent  {
		async onConnected(){
			await super.onConnected(this.data);
		}

		setData(category){
			this.data = category
		}
	}
)

