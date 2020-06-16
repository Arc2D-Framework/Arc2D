import 'core.ui.ProjectExplorer';

namespace `core.ui` (
	class CodeEditor extends w3c.ui.WebComponent  {
		async onConnected(){
            this.explorer = new core.ui.ProjectExplorer;
            await super.onConnected();
            // this['panel_pane'].appendChild(this.explorer)
        }
	}
)