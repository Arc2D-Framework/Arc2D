namespace `docs.demos.templates` (
	class HealthCarePackage  extends w3c.ui.WebComponent  {
		onConnected(){
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

			this.render(family)
		}
	}
)