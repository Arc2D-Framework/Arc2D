

namespace `ui.components` (
	class MessageBar extends HtmlComponent  {
		static is = "message-bar"

        constructor() {
            super();
            this._countries = [
                // {name:"United States", code:"US"},
                {name:"Canada", code:"CA"},
                {name:"Afghanistan", code:"AF"},
                {name:"Albania", code:"AL"}
            ]
        }
		async onConnected() { 
            await super.onConnected();
            
            // await sleep (3000)
            // this.dispatchEvent("countries:updated");
            new Proxy(this, {
                set: (target, property, value) => {
                    target[property] = value;
                    debugger
                    // this.notify(property, value); // Notify observers about the change
                    return true; // Indicate success
                }
            });
        }

        addCountry(country) {
            this._countries.push(country);
        }


        get countries() {
            return this._countries;
        }

		// inShadow() {
		// 	return false
		// }

		// attachShadow() {
		// 	return false
		// }

		// attachInternals() {
		// 	return false
		// }

		hasOwnTemplate() {
			return true
		}

		// template = () => 
		// `
		// 	<template>
		// 		Message Bar Inner template
		// 		<slot></slot>
		// 	</template>
		// `
	}
)