namespace `system.diagnostics.unit.com` (
	class SampleD extends w3c.ui.WebComponent  {
        constructor(el){
            super(el)
        }
		async onConnected(){
            super.onConnected();
            this.addEventListener("click", this.onClick)
        }

        onClick(e){
            alert("you clicked me")
        }
	}
)