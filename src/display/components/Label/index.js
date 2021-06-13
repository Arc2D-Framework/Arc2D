

    class Label extends WebComponent {
        async onConnected(){
            this.name="Jay";
            await super.onConnected();
            this.on("click", e=>this.onClick(e))
        }

        onClick(){
            this.classList.toggle("active")
        }
        isComposable(){
            return true
        }

        // getNSStyleSheet(ns){
        //     debugger;
        //     if(/\.WebComponent/.test(ns)){
        //         console.log()
        //         return import.meta.url.replace(".js",".css")
        //     }
        //     return window.relativeToAbsoluteFilePath(Config.SRC_PATH+"/./index.css",ns);
        // }

        // async loadcss(urls) {
        //     if(!this.__proto._css_loaded){
        //         this.__proto._css_loaded={}
        //     }
        //     return new Promise(async (resolve,reject) => {
        //         urls=urls.reverse();
        //         var stylesheets = window.loaded_stylesheets = window.loaded_stylesheets|| {};
        //         for(let path of urls){
        //             if(this.__proto._css_loaded[path] && !this.inShadow()){continue}
        //             path = this.onLoadStyle(path);
        //             this.__proto._css_loaded[path]=true;
        //             if((path && !stylesheets[path]) || this.inShadow()){
        //                 var tagName = /^http/.test(path) ? "link" : "style";
        //                 var tag = document.createElement(tagName);
        //                     tag.setAttribute("type", 'text/css');
        //                     tag.setAttribute("rel",  'stylesheet');
        //                     tag.setAttribute("href",  path);
        //                     tag.setAttribute("component", this.namespace);
        //                     stylesheets[path] = tag;
        //                     debugger;
        //                     if(tagName.toLowerCase() == "style"){
        //                         var _cssText = await window.imports(path);
        //                         if( _cssText){
        //                             _cssText = this.onTransformStyle(_cssText);
        //                             _cssText && this.setCssTextAttribute(_cssText, tag);
        //                             this.onAppendStyle(tag);
        //                             this.onStylesheetLoaded(tag);
        //                         }
        //                     }
        //                     else {
        //                         document.head.append(tag)
        //                     }
        //             }
        //         }
        //         resolve(true);
        //     })
        // }

        onLoadInstanceStylesheet(){
            return false
        }

        inShadow(){
            return true
        }

        cssStyle(){return `
            :host {border:1px solid green;}
            :host(.active) {border:3px solid red;}
        `}

        template(){
            return `
                <template>
                    <div>${this.name}</div>
                    <i style="color:orange;"><slot name="title">[label here]</slot></i>
                </template>
            `
        }
    }
    tag(Label,'label-output');

    export {Label}
