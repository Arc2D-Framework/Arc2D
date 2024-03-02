import 'ui.components.MessageBarExtended';

namespace `ui.components` (
	class MessageBarExtendedChild extends ui.components.MessageBarExtended  {
		static get is(){
			return "message-bar-extended-child"
		}

		constructor() {
			super();
			var style = document.querySelector("link#style-test");
			// this.stylesheets.add(style.sheet);
			//(async () => {
			// 	debugger
			// 	await await this.defineAncestralStylesheets()
			//})();
			
		}
	
		async onConnected() {
			await super.onConnected();
			this.on("click", e=> this.onClick(e), false, "h3")
			console.log(this.stylesheets)
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