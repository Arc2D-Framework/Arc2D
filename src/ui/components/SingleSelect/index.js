namespace `ui.components` (
    class SingleSelect extends Component {
        static skin = "test";

        constructor(label,placeholder="",items){
            super();
            this.items=items;
            this.strPlaceholder = placeholder;
            this.strLabel = label;
            this.audio = new Audio("/resources/sfx/ES_Beep Tone Signal 14 - SFX Producer.mp3")
            this.clear = new Audio("/resources/sfx/ES_Multimedia Click - SFX Producer.mp3");
            
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
            // alert(`${this.namespace}:  ${this.skin}`)
        }

        inShadow(){
            return false
        }

        // async loadcss() {
        //     debugger;
        //     var invalidClasses=[WebComponent,Application,World,HTMLElement];
        //     var ancestors = this.constructor.ancestors.reverse();
        //     var stylesheets = window.loaded_stylesheets = window.loaded_stylesheets|| {};
        //     var skin = this.getSkin();

        //     return new Promise(async (resolve,reject) => {
        //         for(let ancestor of ancestors){
        //             if(ancestor.name =="_mixin_"){continue}
        //             if(!invalidClasses.includes(ancestor) && ancestor.prototype.onLoadInstanceStylesheet() ){
        //                 var paths = [];
		// 				if(ancestor != this.constructor){
		// 					if(ancestor.prototype.skin == skin.name||(!ancestor.prototype.skin && !skin.name)){
		// 						paths = paths.concat([relativeToAbsoluteFilePath(Config.SRC_PATH+`/./${skin.path}index.css`,ancestor.prototype.namespace)]);
        //                         paths = paths.concat((ancestor.prototype["@stylesheets"]||[]).reverse());
		// 					}
		// 				}
		// 				else if(ancestor == this.constructor){
		// 					if(this.onLoadInstanceStylesheet()){
		// 						paths.push(this.getNSStyleSheet(this.namespace))
		// 					}
		// 					if(this.__proto.hasOwnProperty("@stylesheets")){
		// 						paths.push(...this.__proto["@stylesheets"].reverse()||[]);
		// 					}
		// 				}
        //                 for(let path of paths){
        //                     if(stylesheets[path] && !this.inShadow()){continue}
        //                     path = this.onLoadStyle(path);
        //                     if((path && !stylesheets[path]) || this.inShadow()){
        //                         console.log("STYLE", path)
        //                         !this.inShadow() && (stylesheets[path]=true);
        //                         var tagName = /^http/.test(path) ? "link" : "style";
        //                         var tag = document.createElement(tagName);
        //                             tag.setAttribute("type", 'text/css');
        //                             tag.setAttribute("rel",  'stylesheet');
        //                             tag.setAttribute("href",  path);
        //                             tag.setAttribute("component", ancestor.prototype.namespace);
        //                             !this.inShadow() && await this.onAppendStyle(tag)
        //                         if(tagName == "style"){
        //                             var _cssText;
		// 							try{_cssText = await window.imports(path);}catch(e){}
        //                             if( _cssText){
        //                                 _cssText = this.onTransformStyle(_cssText, ancestor);
        //                                 _cssText && this.setCssTextAttribute(_cssText, tag);
        //                                 this.inShadow() && await this.onAppendStyle(tag)
        //                                 this.onStylesheetLoaded(tag);
        //                             }
        //                         }
        //                         else { document.head.append(tag) }
        //                     }
        //                 }
        //             }
        //         }
        //         resolve(true);
        //     })
        // }

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

        inShadow(){
            return false
        }        
    }
);