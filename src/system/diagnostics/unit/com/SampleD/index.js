namespace `system.diagnostics.unit.com` (
	class SampleD extends w3c.ui.WebComponent  {
        constructor(el){
            super(el)
        }
		async onConnected(){
            super.onConnected();
            this.addEventListener("click", e=>this.onClick())
        }

        onClick(){
            alert("you clicked me")
        }
	}
)