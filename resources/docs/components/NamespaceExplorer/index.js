import '/resources/docs/libs/fitty.js';

namespace `docs.components` (
	class NamespaceExplorer extends w3c.ui.WebComponent  {
		async onConnected(){
            await this.render();
            setTimeout(_=>{
                fitty(this.querySelector("#nstext"), {
                    maxSize:99.74
                });
            },200)
            
        }
	}
)