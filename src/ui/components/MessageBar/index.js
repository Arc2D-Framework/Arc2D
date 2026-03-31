
import {XsltTransformer} from 'xslt-transformer';
import {TemplateLiterals2} from 'template-iterals2';

namespace `ui.components` (
	class MessageBar extends HtmlComponent  {
		static is = "message-bar"
        // static synchronous = true;
        // static skin = "test";
        lazy = this.getAttribute("lazy") || false;
        

		async onConnected() { 
            
            this._countries = [
                {name:"United States", code:"US"},
                {name:"Canada", code:"CA"},
                {name:"Afghanistan", code:"AF"},
                {name:"Albania", code:"AL"}
            ]
            await super.onConnected({
                testing : 123
            });
            this.dispatchEvent("test", {message:"MessageBar test"});
        }

        async hello(){
            return new Promise(resolve => resolve("YYYYY"))
        }

        getCountries(){
            return this._countries
        }

        addCountry(country) {
            this._countries.push(country);
        }

        get countries() {
            return this._countries;
        }

		inShadow() {
			return true
		}


		hasOwnTemplate() {
			return true
		}

        css() {
			return `
				:host {
					border: 4px solid orange;
				}
			`
		}
	}
);