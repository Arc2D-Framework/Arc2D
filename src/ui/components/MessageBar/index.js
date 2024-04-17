
import {XsltTransformer} from 'xslt-transformer';
import {TemplateLiterals2} from 'template-iterals2';

namespace `ui.components` (
	class MessageBar extends HtmlComponent  {
		static is = "message-bar"
        static synchronous = true;
        
        // static skin = "test";
        lazy = this.getAttribute("lazy") || false;
        
        
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
            // alert(this.synchronous)
            this.dispatchEvent("test", {message:"MessageBar test"});
        }

     
        // async render(data=this.data) {
        //     debugger
        //     if((!this.hasDeclarativeTemplate) || this.hasOwnTemplate()){
        //         debugger
        //         var engine   = await this.getTemplateEngine();
        //         var template = await this.loadTemplate(true);
        //         var fragment = await engine.parse(template.decode(), data, this);
				
		// 		if(typeof fragment == "string"){
		// 			this.shadowRoot.appendChild(fragment.toNode().content);
		// 			// this.root.setHTMLUnsafe  && this.root.setHTMLUnsafe(fragment);
		// 			// !this.root.setHTMLUnsafe && (this.root.innerHTML = fragment);
		// 		}
		// 		else {
		// 			this.root.innerHTML = "";
		// 			this.root.appendChild(fragment);
		// 			// fragment = !(fragment instanceof DocumentFragment) ? 
        //             // 	fragment.toNode()?.content : fragment;
		// 			// this.root.innerHTML = ""; 
		// 			// this.root.appendChild(fragment);
		// 		}
		// 		this.onRendered();
        //     }
		// }

        addCountry(country) {
            this._countries.push(country);
        }

        

        getTemplateEngine() {
            
            // return new TemplateLiterals2
            // return XsltTransformer
            
            return window.customTemplateEngines.default;
        }

        get countries() {
            return this._countries;
        }

		inShadow() {
            // debugger
			return true
		}


		hasOwnTemplate() {
			return false
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