import 'docs.components.ProjectExplorer';

namespace `docs.topics` (
    class DefineComponent extends docs.topics.Topic {
        async onConnected(){
            await super.onConnected();
            this.project_explorer = this.querySelector("project-explorer");
            await wait(2000);
            this.renderProjectFiles();
        }

        renderProjectFiles(){
            var explorer = this.project_explorer;
                explorer.reset();
            var components = explorer.getDir("display.components");
            var folder = explorer.mkDir("ToggleButton");
            explorer.addChildDirectory(components, folder);
            explorer.addFileToDirectory(folder, "index.html");
            explorer.addFileToDirectory(folder, "index.css");
            explorer.addFileToDirectory(folder, "index.js");

            this.project_explorer.update();
        }
    }
);
