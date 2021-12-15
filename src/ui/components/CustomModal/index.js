namespace `ui.components` (
	class CustomModal extends WebComponent  {
		async onConnected(){
            await super.onConnected();
			
			this.on("click", (e) => this.onModalBtnClick(e), false, '#modal_open-btn');
		}

		onModalBtnClick(e) {
			console.log("e.target: ", e.target);
		}
	}
);