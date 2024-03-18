import 'ui.components.MessageBarExtended';

namespace `ui.components` (
	class MessageBarExtendedChild extends ui.components.MessageBarExtended  {
		static is = "message-bar-extended-child";

		constructor(el,options) {
            super(el,options);
        }
	
		async onConnected() {
			await super.onConnected();
			this.on("click", e=> this.onClick(e), false, "h3")
			console.log("dsd", [this.hasDSD, this])
		}

		onClick(e) {
			console.log(e.matchedTarget)
		}

		hasOwnTemplate() {
            return true
        }

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

		// hasOwnTemplate() {
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