
namespace `ui.screens` (
    class BaseApplication extends Application {
        
        static skin = "sample";

      

            
        async onConnected() {
            
            await super.onConnected();
        }

        // getSkin(){
        //     // debugger;
        //     var name = Config.SKIN||this.constructor.skin||this.getAttribute("skin")||"";
        //     var path = name ? `skins/${name}/`:"";
        //     return {name, path}
        // }

        // async loadcss() {
        //     // debugger
        //     var invalidClasses=[WebComponent,Application,World,HTMLElement];
        //     var ancestors = this.constructor.ancestors.reverse();
        //     var stylesheets = window.loaded_stylesheets = window.loaded_stylesheets|| {};
        //     var skin = this.getSkin();

        //     return new Promise(async (resolve,reject) => {
        //         for(let ancestor of ancestors){
        //             if(ancestor.name =="_mixin_"){continue}
        //             if(!invalidClasses.includes(ancestor) && ancestor.prototype.onLoadInstanceStylesheet() ){
        //                 var paths = [];
        //                 debugger
		// 				if(ancestor != this.constructor){
		// 					if(ancestor.skin == skin.name||(!ancestor.skin && !skin.name)){
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
    }
);
