@cascade(false);
namespace `plugins` (
    class LoadHar extends w3c.ui.WebComponent {
        static get WEIGHT(){return 110}

        async onConnected(){
            await super.onConnected();
            // ipcRenderer.on('cachecleared', (event, arg) => this.onHandleResponse());
            this.addEventListener("click", e => this.onHandleClick(e));
        }

        static async install(activity){
            var tooltray = activity.getToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onLoadInstanceStylesheet(){return false}

        onHandleClick(e){
            // ipcRenderer.send('clearcache', "Im ready");
            e.preventDefault();
            e.stopPropagation();
            const options = {
              title: 'Load .HAR file',
              defaultPath: '/Downloads',
              buttonLabel: 'Open HAR',
              filters: [
                { name: 'har', extensions: ['har'] }
              ],
              message: 'Load a .HAR file for capturing'
            };
            dialog.showOpenDialog(null, options, (filePath) => {
              if (!filePath) { return }
              var contents = fs.readFileSync(filePath[0], 'utf8');
              var json = JSON.parse(contents);
              native_HAR_file_was_used = true;
              har = json;
              var doit = prompt("Do you want to reload the page?");
              if (doit) {
                application.currentActivity.navigateTo(json.log.entries[0].request.url);
                alert("HAR Loaded. Resize the window manually to force load\nany responsive css, dynamic images etc before capturing.");
                alert("Do a full vertical scroll from top->bottom to load any lazy assets before capture.")
              } else {
                application.currentActivity.updateAddressBar(json.log.entries[0].request.url);
              }
            });
        }

        onHandleResponse(){
            console.log("Cache Cleared");
            alert("Done")
        }

        template(){
            return `
                <template>
                    <i id="loadhar" title="Import .HAR" class="toolbar-icon fa fa-folder-open"></i>
                    <div class="plugin-icon-label">.HAR</div>
                </template>
            `
        }
    }
);





