import 'docs.components.NamespaceExplorer';
import 'core.ui.ProjectExplorer';

namespace `docs.topics` (
    class AboutClasses extends docs.topics.Topic {
        async onConnected(){
            await super.onConnected();
            this.project_explorer = this.querySelector("project-explorer");
            await wait(2000);
            this.renderProjectFiles();
        }

        renderProjectFiles(){
            this.project_explorer.reset();
            // var folders = ["core","ui","ToggleButton"];

            var lastFolder = this.project_explorer.getSrcFolder();
            // while(folders && folders.length>0 && lastFolder){
            //     var folder = folders.shift();
            //     var dir = this.project_explorer.mkDir(folder);
            //     lastFolder = this.project_explorer.addChildDirectory(lastFolder, dir);
            // }
            this.project_explorer.addFileToDirectory(lastFolder, "Weapon.js");
            this.project_explorer.addFileToDirectory(lastFolder, "Sword.js");

            this.project_explorer.update();
        }
    }
);
