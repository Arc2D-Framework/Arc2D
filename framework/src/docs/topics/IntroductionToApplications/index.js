import 'docs.components.NamespaceExplorer';
import 'docs.components.ProjectExplorer';

namespace `docs.topics` (
	class IntroductionToApplications  extends docs.topics.Topic  {
		async onConnected(){
            await super.onConnected();
            this.project_explorer = this.querySelector("project-explorer");
            await wait(300);
            // this.renderProjectFiles();
        }

        renderProjectFiles(){
            this.project_explorer.reset();
            // var folders = ["applications","StoreCatalog"];

            var lastFolder = this.project_explorer.getSrcFolder();
            while(folders && folders.length>0 && lastFolder){
                var folder = folders.shift();
                var dir = this.project_explorer.mkDir(folder);
                lastFolder = this.project_explorer.addChildDirectory(lastFolder, dir);
            }
            this.project_explorer.addFileToDirectory(lastFolder, "index.html");
            this.project_explorer.addFileToDirectory(lastFolder, "index.css");
            this.project_explorer.addFileToDirectory(lastFolder, "index.js");

            this.project_explorer.update();
        }
	}
);