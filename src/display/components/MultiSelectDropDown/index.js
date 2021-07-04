import 'display.components.DropDown';

namespace `display.components` (
    class MultiSelectDropDown extends display.components.DropDown {
        constructor(label,placeholder="",items){
            super();
            this.items=items;
            this.strLabel = label;
            this.strPlaceholder = placeholder;
            this.extractedValues=[];
        }

        async onConnected(){
            await super.onConnected();
            application.addEventListener("click", e=> this.onScreenClicked(e))
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
            // debugger;
            var self = this.querySelector(`.${this.classname}`,e);
            !self && this.classList.remove("active")
        }

        querySelector(cssSel, e){
            // debugger;
            if(e){
                return this.getParentNodeFromEvent(e,cssSel)
            } else {
            return (this.inShadow()||this.element) ?
                this.root.querySelector(cssSel):
                super.querySelector(cssSel)
            }
        }

        getParentBySelectorUntil(elem=this.root, terminator="html", selector) {
            // debugger;
            var parent_node = null;
            do {
                if(elem.host){
                    parent_node = elem.host; break;
                }
                if(elem.matches(selector)){
                    parent_node = elem;
                    break;
                }
                if(elem.matches(terminator)){
                    break;
                }
                elem=elem.parentNode;
            } while(elem && elem.matches || elem && elem.host) 

            return parent_node;
        }
        

        onSelect(e){
            var li = e.target;
                li.querySelector("input").checked = li.classList.toggle("selected");
                // debugger;
                if(li.querySelector("input").value == "all"){
                    this.selectAll();
                }
            this.extractValues();
            this.dispatchEvent("change", {target:this, value:this.input.value});
        }

        selectAll(){
            debugger;
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
            debugger;
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

        onAppendStyle(stylesheet) {
            
            if(this.inShadow()){
                try{
                    // debugger;
                    var sheet = new CSSStyleSheet();
                        sheet.replace(stylesheet.innerText);
                    this.root.adoptedStyleSheets=this.root.adoptedStyleSheets.concat([sheet]);
                } catch(e){
                    try{
                        let blob = new Blob([`${stylesheet.innerText}`]);
                        let blobURL = window.URL.createObjectURL(blob);
                        var tag = document.createElement("link");
                            tag.setAttribute("type", 'text/css');
                            tag.setAttribute("rel",  'stylesheet');
                            tag.setAttribute("href",  blobURL);
                            this.root.appendChild(tag);
                    } catch(be){
                        console.error(be)
                    }
                    //TODO: use code
                    console.warn(`${this.namespace}#onAppendStyle(): CSSStyleSheet not yet supported. 
                    See https://bugzilla.mozilla.org/show_bug.cgi?id=1520690.`);
                }
            }
            else {
                //TODO: refactor, simplify
                var headNode = document.querySelector("head")
                var configscript = document.querySelector("script");
                headNode.insertBefore(stylesheet, configscript);
            }
        }

        addEventListener(evtName, handler, bool=false, el) {
            var self = this;
            if (typeof el == "string") {
                this.addEventListener(evtName, e => {
                    // var t = this.getParentNodeFromEvent(e, el);
                    var t = e.composedPath?e.composedPath()[0]:e.target;
                    // if(target.matches(el))
                    if (t && t.matches(el)) {
                        handler({
                            target: t,
                            realtarget: e.target,
                            src: e,
                            preventDefault:  () => e.preventDefault(),
                            stopPropagation: () => e.stopPropagation()
                        });
                    }
                }, bool);
            } else {
                if(this.isExistingDomNode(this.element)){
                    this.element.addEventListener(evtName, handler, bool);
                    if(evtName == "connected"){
                        handler({target:this});
                    }
                }
                else{
                    super.addEventListener(evtName, handler, bool);
                    if(evtName == "connected" && this._is_connected){
                        handler({target:this});
                    }
                }
            }
        }
    }
);
