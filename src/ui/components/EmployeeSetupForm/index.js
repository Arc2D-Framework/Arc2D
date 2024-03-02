
import {XsltTransformer} from 'xslt-transformer';
import {TemplateLiterals2} from 'template-iterals2';

namespace `ui.components` (
	class EmployeeSetupForm extends WebComponent  {
		static is = "employee-setup-form"

		async onConnected() { 
            await super.onConnected();
			this.on("input", e => this.onInput(e), false, "input");
        }

		onInput(e) {
			if(e.target.value.length) {
				e.target.classList.add("has-value")
			}
			else {
				e.target.classList.remove("has-value")
			}
		}

        // getTemplateEngine() {
        //     return new TemplateLiterals2
        // }

		inShadow() {
			return false
		}
		hasOwnTemplate() {
			return true
		}
	}
);