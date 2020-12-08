namespace `docs.demos` (
	class DatePicker  extends WebComponent  {
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

        onLoadInstanceStylesheet(){return false}

        cssStyle(){
            return `
                :host {
                    height:34px;
                    width:140px;
                    border:1px solid green;
                    border-radius:3px;
                }

                :host input {
                    width: 100%;
                    height: 100%;
                    padding:0px;
                    margin:0px;
                    border-radius:3px;

                    font-size:14px;
                }
            `
        }
	}
)