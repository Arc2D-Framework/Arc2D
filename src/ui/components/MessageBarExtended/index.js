import {TemplateLiterals2} from 'template-iterals2';
import 'ui.components.MessageBar';

namespace `ui.components` (
	class MessageBarExtended extends ui.components.MessageBar  {
		static is = "message-bar-extended";
		// static skin = inherit;


        constructor(el, options) {
            super(el, options);
            console.log(this,this.getAttribute("lazy"))
        }

		async onConnected() {
			await super.onConnected();
            
            try {
                this.internals?.states.add("connected");
            } 
			catch {
                this.internals?.states.add("--connected");
            }
			//this.internals?.states.add("connected");

				this.on("click", e=> this.onClick(e), false, "h3");
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

		onRendered() {
			console.log("MessageBarExtended <h3>", this.find("h3"))
		}

		getTemplateEngine() {
            return new TemplateLiterals2
			// return window.customTemplateEngines.getEngineByMimeType("template/literals")
        }

		onClick(e) {
			console.log(e.matchedTarget);
            // this.internals.states.add("--clicked");
		}

		hasOwnTemplate() {
            return true
        }
	}
)

window.MessageBarExtended = ui.components.MessageBarExtended;