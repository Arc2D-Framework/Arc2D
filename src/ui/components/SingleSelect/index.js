namespace `ui.components` (
    class SingleSelect extends Component {
        constructor(label,placeholder="",items){
            super();
            this.items=items;
            this.strPlaceholder = placeholder;
            this.strLabel = label;
            this.audio = new Audio("/resources/sfx/ES_Beep Tone Signal 14 - SFX Producer.mp3")
            this.clear = new Audio("/resources/sfx/ES_Multimedia Click - SFX Producer.mp3")
        }

        async onConnected(){
            await super.onConnected();
            this.input = this.querySelector("input[type='text']");
            this.label = this.strLabel;
            this.placeholder = this.strPlaceholder;
            this.on("click",    e => this.onReset(e),   true, ".icon.clear");
            this.on("click",    e => this.onToggle(e),  true, "input[type='text']");
            this.on("blur",     e => this.onBlur(e),    true, "input[type='text']");
            this.on("click",    e => this.onSelect(e),  true, "li");
            this.on("change",   e => this.onChange(e));
            this.onSetDefaults();
        }

        // querySelector(cssSel, e){
        //     return (this.inShadow()||this.element) ? 
        //         this.root.querySelector(cssSel) : super.querySelector(cssSel)
        // }

        // querySelectorAll(cssSel, deep){
        //     return (this.inShadow()||this.element) ?
        //         this.root.querySelectorAll(cssSel) : super.querySelectorAll(cssSel)
        // }

        inShadow(){
            return false
        }

        onReset(e){
            // debugger;
            this.clear.play()
            this.onClear();
            this.dispatchEvent("change", {target:this, display:this.input.value, value:this.value});
        }

        onSetDefaults(){
            var item = this.querySelector("li.selected");
            if(item){
                this.value = item.getAttribute("value");
                this.input.value = item.innerHTML;
                this.dispatchEvent("change", {target:this, display:this.input.value, value:this.value});
            }
        }

        set label(strLabel=this.strLabel||"[Label Here]"){
            this.querySelector("label").innerHTML = strLabel
        }
        set placeholder(strPlaceholder=this.strPlaceholder||""){
            this.input.setAttribute("placeholder", strPlaceholder)
        }

        onToggle(e){
            // debugger;
            this.classList.toggle("active");
        }

        async onBlur(){
            await wait(300);
            this.classList.remove("active");
            this.dispatchEvent("change", {target:this, display:this.input.value, value:this.value});
        }

        onSelect(e){
            this.audio.play();
            this.onClear();
            e.matchedTarget.classList.add("selected");
            this.value= this.input.value = e.matchedTarget.getAttribute("value");
        }

        onClear(){
            debugger;
            this.value = null;
            this.input.value = "";
            var items = Array.from(this.querySelectorAll("li.selected"));
                items.forEach(item => item.classList.remove("selected"));
        }

        async onChange(e){
            if(this.input.value){
                this.classList.add("has-value")
            }
            else {
                this.classList.remove("has-value");
                this.onClear();
            }
        }

        
    }
);