import 'ui.components.SingleSelect';

namespace `ui.components` (
    class MultiSelect extends ui.components.SingleSelect {
        // static get is(){
        //     return "multi-select"
        // }

        constructor(label,placeholder="",items){
            super();
            this.items=items;
            this.strLabel = label;
            this.strPlaceholder = placeholder;
            this.extractedValues=[];
        }

        async onConnected(){
            await super.onConnected();
            application.addEventListener("click", e=> this.onScreenClicked(e));
            this.on("keyup", e=>this.onTab(e));
        }

        onTab(e){
            e.stopPropagation();
            e.preventDefault()
            if(e.code == "Tab"){
                this.classList.remove("active")
            }
        }

        onSetDefaults(){
            this.extractValues();
            this.dispatchEvent("change", {target:this, display:this.input.value, value:this.extractedValues});
        }

        extractValues(){
            this.extractedValues=[];
            var items = Array.from(this.querySelectorAll("li.selected"));
                items.forEach(item => this.extractedValues.push(item.getAttribute("value")))
        }

        onScreenClicked(e){
            e.target != this && this.classList.remove("active")
        }

        onSelect(e){
            this.audio.play();
            var li = e.matchedTarget;
                li.querySelector("input").checked = li.classList.toggle("selected");
                if(li.querySelector("input").value == "all"){
                    this.selectAll();
                }
            this.extractValues();
            this.dispatchEvent("change", {target:this, value:this.input.value});
        }

        selectAll(){
            var items = Array.from(this.querySelectorAll("li"));
            if(this.all_selected){
                items.forEach(item => {
                    item.classList.remove("selected");
                    item.querySelector("input").checked = item.classList.contains("selected");
                    this.all_selected=false;
                })
            }
            else {
                items.forEach(item => {
                    item.classList.add("selected");
                    item.querySelector("input").checked = item.classList.contains("selected");
                    this.all_selected=true;
                })
            }
        }

        onClear(){
            var inputs = Array.from(this.querySelectorAll("li input"));
                inputs.forEach(input => input && (input.checked = false));
            super.onClear();
            this.extractedValues=[];
        }

        onChange(e){
            if(this.extractedValues.length){
                this.input.value = this.extractedValues.length + " Selected"
            }
            else {
                this.input.value = ""
            }
        }

        onBlur(e){}

        inShadow(){
            return true
        }
    }
);
