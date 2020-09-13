import 'docs.components.NamespaceExplorer';
import 'docs.components.ProjectExplorer';

namespace `docs.topics` (
	class IntroductionToApplications  extends docs.topics.Topic  {
		async onConnected(){
            await super.onConnected();
            this.project_explorer = this.querySelector("project-explorer");
            await wait(300);
            this.renderProjectFiles();
        }

        renderProjectFiles(){
            var explorer = this.project_explorer;
                explorer.reset();
            var components = explorer.getDir("display.screens");
            var folder = explorer.mkDir("HelloWorld");
            explorer.addChildDirectory(components, folder);
            explorer.addFileToDirectory(folder, "index.html");
            explorer.addFileToDirectory(folder, "index.css");
            explorer.addFileToDirectory(folder, "index.js");

            this.project_explorer.update();
        }
	}
);