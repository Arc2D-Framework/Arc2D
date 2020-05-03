import 'docs.demos.templates.HealthCarePackage';

namespace `docs.topics` (
	class UsingCustomDriver  extends docs.topics.Topic  {
		onConnected(){
            super.onConnected();
            this.on("click", e => this.runDemo(e), false, "#render-mustache-component")
        }

        runDemo(){
            var component = new docs.demos.templates.HealthCarePackage;
            console.log("component",component);
            var results = this.querySelector("#render-mustache-component-results");
            results.appendChild(component)
        }
	}
)