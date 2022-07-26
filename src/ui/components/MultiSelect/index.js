import 'ui.components.SingleSelect';

namespace `ui.components` (
    class MultiSelect extends ui.components.SingleSelect {
        // static get is(){
        //     return "multi-select"
        // }

        // static skin = "";



        async onToggle(e){
            await sleep(60) 
            this.classList.toggle("active");
        }

        // getSkin(){
        //     // debugger;
        //     var name = Config.SKIN||this.skin||this.getAttribute("skin")||"";
        //     var path = name ? `skins/${name}/`:"";
        //     return {name, path}
        // }

        // async loadcss() {
            
        //     var invalidClasses=[WebComponent,Application,World,HTMLElement];
        //     var ancestors = this.constructor.ancestors.reverse();
        //     var stylesheets = window.loaded_stylesheets = window.loaded_stylesheets|| {};
        //     var skin = this.getSkin();

        //     return new Promise(async (resolve,reject) => {
        //         for(let ancestor of ancestors){
        //             if(ancestor.name =="_mixin_"){continue}
        //             if(!invalidClasses.includes(ancestor) && ancestor.prototype.onLoadInstanceStylesheet() ){
        //                 var paths = [];
        //                 debugger;
		// 				if(ancestor != this.constructor){
        //                     debugger
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

        constructor(label,placeholder="",items){
            super();
            this.items=items;
            this.strLabel = label;
            this.strPlaceholder = placeholder;
            this.extractedValues=[];
        }


        async onConnected(){
            await super.onConnected();
            document.addEventListener("click", e=> this.onScreenClicked(e));
            this.input = this.querySelector("input");
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
