
import {XsltTransformer} from 'xslt-transformer';
import {TemplateLiterals2} from 'template-iterals2';

namespace `ui.components` (
	class MessageBar extends HtmlComponent  {
		static is = "message-bar"

        // constructor(el, options) {
        //     super(el, options);
            
        // }

		async onConnected() { 
            this._countries = [
                {name:"United States", code:"US"},
                {name:"Canada", code:"CA"},
                {name:"Afghanistan", code:"AF"},
                {name:"Albania", code:"AL"}
            ]
            await super.onConnected({countries:this._countries});

            this.dispatchEvent("test", {message:"MessageBar test"});
        }

     

        addCountry(country) {
            this._countries.push(country);
        }

        // async render(data=this.data) {
        //     if(!this.constructor.extends) {
		// 		debugger
        //         if((!this.element && !this.hasDSD) || this.hasOwnTemplate()){
        //             var engine   = this.getTemplateEngine();
        //             var template = await this.loadTemplate(true);
        //             var fragment = await engine.parse(template.decode(), data, this);
        //                 fragment = !(fragment instanceof DocumentFragment) ? 
        //                 fragment.toNode()?.content : fragment;
                    
        //             this.root.innerHTML = ""; 
        //             this.root.appendChild(fragment);
        //         }
        //         // if(!this.hasDSD && !this.hasOwnTemplate()) {
		// 		// 	this.root.innerHTML = `<slot></slot>`
		// 		// }
        //     }
		// }

        getTemplateEngine() {
            return new TemplateLiterals2
            // return XsltTransformer
            
            // return window.customTemplateEngines.getEngineByMimeType("template/xslt")
        }

        get countries() {
            return this._countries;
        }

		inShadow() {
            // debugger
			return true
		}


		hasOwnTemplate() {
			return true
		}

        test_prop() {
            return `color: red;`
        }

        // cssStyle() {
        //     return `
        //         :host {
        //             ${this.test_prop()};
        //             background-color: #f2f2f2;
        //             padding: 20px;
        //             border: 1px solid #ccc;
        //             border-radius: 5px;
        //             margin-bottom: 20px;
        //         }
        //     `
        // }

		// template = () => 
		// `
		// 	<template>
		// 		Message Bar Inner template
		// 		<slot></slot>
		// 	</template>
		// `
	}
);