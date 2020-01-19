import 'docs.demos.templates.HealthCarePackage';

namespace `docs.topics` (
	class TemplateDataToHtml  extends docs.topics.Topic  {
		onConnected(){
			super.onConnected();
			this.bind("#json-to-html-demo1", "click", e => this.runDemo(e))
		}

		runDemo(){
			var component = new docs.demos.templates.HealthCarePackage;
			console.log("component",component);
			var results = this.querySelector("#json-to-html-demo1-results");
			results.appendChild(component)
		}
	}
)