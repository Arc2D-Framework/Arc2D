import 'core.ui.ExplorerPanel';
import! 'core.data.Simulation';


namespace `plugins` (
    class ScreensExplorer extends core.ui.ExplorerPanel {
        static get WEIGHT(){return 2}

        constructor() {
            super();
            this.activity = application.currentActivity;
        }

        async onConnected() {
            this.installShortcut();
            var project = application.getProject();
            console.log("project",project[0])
            this.ft = new core.data.FileTree(project[0].devpath+"/"+project[0].projectfolder + "/src/applications/");
            var filetree = this.ft.build();
                filetree.expanded=true;
            console.log("filetree",filetree);
            await super.onConnected({item:filetree});
            
            this.addEventListener("click", e=>this.onToggleExpand(e), false, "li[aria-expanded]")
            this.addEventListener("click", e=>this.onFileClicked(e), true, ".doc");
            this.addEventListener("click", e=> this.onRefresh(e), true, ".icons-try .fa-refresh");
        }

        onShowSitemapEditor(e){
            e.preventDefault();
            e.stopPropagation();
        }

        installShortcut(){
            this.tray_icon = `<i id="" title="Site Map" class="toolbar-icon fa fa-sitemap"></i>`.toDomElement();
            var tray = this.activity.getToolTray();
            tray.appendChild(this.tray_icon);
            this.tray_icon.addEventListener("click", e=> this.onShowSitemapEditor(e));
        }

        static async install(activity){
            var pane = activity.getPrimaryPane();
            var el = await new this;
            pane.appendChild(el)
        }

        onFileClicked(e){
            e.stopPropagation();
            e.preventDefault();
            var path = e.target.getAttribute("path");
            var ext = e.target.getAttribute("ext");
            if(ext && ext == ".html"){
                this.dispatchEvent("previewhtml", {path,ext})
            }
        }

        onToggleExpand(e){
            var li = e.target;
            li.classList.toggle("expanded");
        }

        async onRefresh(e){
            e.preventDefault();
            e.stopPropagation();
            var refreshBtn = this.querySelector('.fa-refresh');
                refreshBtn.classList.add("fa-spin");
            await wait(500);
            var filetree = this.ft.build();
            await this.render({item:filetree});
                refreshBtn.classList.add("fa-spin");
        }

        getTemplateEngine() {
            return window.customTemplateEngines.getEngineByMimeType("template/nunjucks")
        }
    }
);
