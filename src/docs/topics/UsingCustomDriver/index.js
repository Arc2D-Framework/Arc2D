import 'docs.demos.templates.HealthCarePackage';

namespace `docs.topics` (
	class UsingCustomDriver  extends docs.topics.Topic  {
		onConnected(){
            super.onConnected();
            this.bind("#render-mustache-component", "click", e => this.runDemo(e))
        }

        runDemo(){
            var component = new docs.demos.templates.HealthCarePackage;
            console.log("component",component);
            var results = this.querySelector("#render-mustache-component-results");
            results.appendChild(component)
        }
	}
)