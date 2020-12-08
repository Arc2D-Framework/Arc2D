import '/src/system/drivers/templating/Nunjucks/nunjucks-driver.js';

namespace `docs.demos.templates` (
	class HealthCarePackage  extends WebComponent  {

		getTemplateEngine() {
            return window.customTemplateEngines.getEngineByMimeType("template/nunjucks")
        }
        
		async onConnected(){
			var family = {
		        husband: "Joe",
		        spouse : "Anna",
		        children : [
		            {name : "Jordan", age: 10},
		            {name : "Sally", age: 5}
		        ],
		        coverage: {
		            type : "PPO",
		            effective : "03/23/2020",
		            end : "03/23/2021",
		            dental : false,
		            cost : "$800.45"
		        }
		    };

			await this.render(family)
		}
	}
)