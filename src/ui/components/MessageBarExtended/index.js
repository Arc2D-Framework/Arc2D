import {TemplateLiterals2} from 'template-iterals2';
import 'ui.components.MessageBar';

namespace `ui.components` (
	class MessageBarExtended extends ui.components.MessageBar  {
		static is = "message-bar-extended";
		static skin = inherit;
	
		async onConnected() {
			await super.onConnected();
            // alert(this.querySelector("h3").innerHTML)
			this.on("click", e=> this.onClick(e), false, "h3")
            // debugger
            // this.find("aadsd").test();
		}

		getTemplateEngine() {
            return new TemplateLiterals2
        }


		onClick(e) {
			console.log(e.matchedTarget)
		}

        find(cssSel) {
            debugger
            super.find(cssSel)
        }


		hasOwnTemplate() {
            return true
        }

        // async render(data=this.data) {
        //     if(!this.element && this.hasOwnTemplate()){
        //         var engine = this.getTemplateEngine();
        //         debugger
        //         var template = this.__proto.constructor.__template__||await this.loadTemplate()
        //         this.__proto.constructor.__template__ = template;
        //         var fragment = await engine.parse(template.decode(), data, this);
        //             fragment = !(fragment instanceof DocumentFragment) ? 
        //             fragment.toNode()?.content : 
        //             fragment;
                
        //         this.shadowRoot.innerHTML = ""; 
        //         this.shadowRoot.appendChild(fragment);
        //     }
		// }

		// inShadow() {
		// 	return false
		// }

		// attachShadow() {
		// 	return false
		// }

		// attachInternals() {
		// 	debugger
		// 	return false
		// }

	
		// template = () => 
		// `
		// 	<template>
		// 		Message Bar Inner template
		// 		<slot></slot>
		// 	</template>
		// `
	}
)