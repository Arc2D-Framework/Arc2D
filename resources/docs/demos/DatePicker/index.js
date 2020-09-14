namespace `docs.demos` (
	class DatePicker  extends w3c.ui.WebComponent  {
        constructor(el){
            super(el);
        }
        async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e=>this.onClick(e), false);
            var input = this.querySelector("input");
                input.setAttribute("type","date")
        }

        onClick(e){
            console.log(e.target)
        }
	}
)