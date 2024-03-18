import {TemplateLiterals2} from 'template-iterals2';
import 'ui.components.MessageBar';

namespace `ui.components` (
	class MessageBarExtended extends ui.components.MessageBar  {
		static is = "message-bar-extended";
		static skin = inherit;

		async onConnected() {
			await super.onConnected();
			// debugger
			// await sleep (1000)
            // console.log("MessageBarExtended <h3>", this.find("h3"))
			// await this.render();
			this.on("click", e=> this.onClick(e), false, "h3")
			// console.log("dsd", [this.hasDSD, this])
		}

		onRendered() {
			console.log("MessageBarExtended <h3>", this.find("h3"))
		}
		

		// async initialize(el,options) {
        //     this.options        = options||this;
        //     this.element        = el;
        //     this.__proto        = this.constructor.prototype;
        //     globalThis._eventObjects = globalThis._eventObjects||[];
		// 	debugger
		// 	this.hasDeclarativeTemplate = this.shadowRoot||this.element?.shadowRoot;
        //     this._eventData     = {};
        //     this._eventFired    = {};
        //     this._eventObjects  = {};
            
        //     if(this.element && this.isExistingDomNode(this.element)){
        //         this.root = this.element
        //         if(this.inShadow()) {
        //             this.root = this.hasDeclarativeTemplate||this.element.attachShadow({mode:'open'});
        //             !this.hasDeclarativeTemplate && (this.root.innerHTML = `<slot></slot>`);
        //         }
		// 		await this.render(this.data);
        //         this.connectedCallback();
        //     }
        //     else {
        //         this.root = !this.constructor.extends && (
		// 			this.attachInternals()?.shadowRoot||
		// 			this.attachShadow({mode:'open'})  || this
		// 		)||this;
		// 		await this.render(this.data);
        //     }
        // }

		// async render(data=this.data) {
        //     if(!this.constructor.extends) {
		// 		debugger
        //         if((!this.hasDeclarativeTemplate) || this.hasOwnTemplate()){
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
        }

		onClick(e) {
			console.log(e.matchedTarget)
		}

		hasOwnTemplate() {
            return false
        }
	}
)

window.MessageBarExtended = ui.components.MessageBarExtended;