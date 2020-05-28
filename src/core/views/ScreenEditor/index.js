import! 'plugins._';

namespace `core.views` (
    class ScreenEditor extends w3c.ui.WebComponent {
        constructor(element){
            super();
        }

        async onConnected() {
            await super.onConnected();
            await wait(100);
            this.installPlugins();
            this.onload();
            // this.addEventListener("startrecording",  e=> this.onStartRecording(e));
            // this.addEventListener("endrecording",  e=> this.onEndRecording(e));
            this.addEventListener("previewhtml",  e=> this.onPreviewHtmlFile(e));
            // this.addEventListener("previewhtml",  e=> this.onPreviewHtmlFile(e));
            // this.addEventListener("nodeinspect",  e=> this.onToggleNodeInspector(e));
            // this.addEventListener("nodeerase",    e=> this.onEraseNodeFromWebPage(e));
            // this.addEventListener("nodepositioner",e=> this.onRequetToPositionNode(e));
            // this.addEventListener("simulateclick",e=> this.onRequetToSimulateClick(e));//see: plugins.WiringExplorer
            // this.addEventListener("highlighttrigger", e=> this.onHighlightTrigger(e));
            // this.loadGlobalSimululationModel();
            // this.loadLiveToCloneMapping();
        }

        // async loadGlobalSimululationModel(){
        //   var proj = application.getProject()[0];
        //   core.data.GlobalSimulation.load(`${proj.devpath}/${proj.projectfolder}/global.sim.json`);
        //   var data = await core.data.GlobalSimulation.findObjectModel("triggers");
        //   console.log("global triggers", data)
        // }

        // async loadLiveToCloneMapping(){
        //   var proj = application.getProject()[0];
        //   core.data.LiveToCloneMapping.load(`${proj.devpath}/${proj.projectfolder}/urlclonemap.sim.json`);
        // }

        // onHighlightTrigger(e){
        //   // alert("node inspect");
        //   this.getWebView().send('highlighttrigger', {});
        // }

        onStartRecording(e){
          this.getWebView().send('startrecording', e.data);
        }

        onEndRecording(e){
          this.getWebView().send('endrecording', e.data);
        }

        onRequetToSimulateClick(e){
          this.getWebView().send('simulate_click', e.data.wire_id);
        }

        onRequetToPositionNode(e){
          this.getWebView().send('allow_node_positioning', e.data.active);
        }

        onToggleNodeInspector(e){
          // alert("node inspect");
          this.getWebView().send('nodeinspect', e.data.active);
        }

        onEraseNodeFromWebPage(e){
          this.getWebView().send('nodeerase', e.data);
        }

        async onPreviewHtmlFile(e){
          // if(/html?/.test(e.data.ext)){
          //   var proj = application.getProject()[0];
          //       proj.currentScreenPath = e.data.path;
          // }
          // alert(e.data.path)
          // var text = await (await fetch("http://localhost:3001/dom-clouds.html")).text();
          // alert(text)
          // var data = this.getGeneratedPageURL({html:text});
          // console.log("data",data)
          // this.navigateTo(data);
          this.navigateTo("http://localhost:3001/dom-clouds.html")
          // this.goliveBtn.classList.remove("active")
          this.onToggleExplorerPanel();
        }

        getGeneratedPageURL({ html, css, js }) {
          const getBlobURL = (code, type) => {
            const blob = new Blob([code], { type })
            return URL.createObjectURL(blob)
          }

          // const cssURL = getBlobURL(css, 'text/css')
          // const jsURL = getBlobURL(js, 'text/javascript')

          const source = `${html || ''}`

          return getBlobURL(source, 'text/html')
        }

        getToolTray(){
          return this.querySelector("#side-bar #tool-tray")
        }

        getDetailsToolTray(){
          return this.querySelector("#details-side-bar #details-tool-tray")
        }

        getPrimaryPane(){
          return this.querySelector("#side-bar .pane")
        }

        getDetailsPane(){
          return this.querySelector("#details-side-bar .pane")
        }

        getDetailsEditorPane(){
          return this.querySelector("#details-editor-pane")
        }


        installPlugins(){
          var plugins = [];
          for(var key in window.plugins){
            var plugin = window.plugins[key];
            plugins.push(plugin);
            //plugin && plugin.install && plugin.install(this);
          }
          plugins.sort((a, b) => (a.WEIGHT && b.WEIGHT && (a.WEIGHT < b.WEIGHT)) ? -1 : 1);
          plugins.forEach(_plugin => _plugin && _plugin.install && _plugin.install(this))
        }



        // onMouseMove(e){
        //   var el = this.getWebView().elementFromPoint(e.pageX,e.pageY);
        //   if(el == this.lastEl){return}
        //   else {
        //     if(this.lastEl){
        //       this.lastEl.style.border="none";
        //     }
        //   }

        //   this.lastEl = el;
        //   this.lastEl.style.border="1px solid red";
        // }


        // setWebViewDevTools(){
        //   // setTimeout(e => {
        //   //   const wv = document.querySelector('#browser');
        //   //   // wv.addEventListener('dom-ready', () => {
        //   //     alert("adding webtools")
        //   //     const devtoolsView = document.querySelector('#devtools');
        //   //     const browser = wv.getWebContents();
        //   //     browser.setDevToolsWebContents(devtoolsView.getWebContents());
        //   //     // browser.debugger.attach();
        //   //     // browser.openDevTools({mode: "bottom"});
        //   //   // });
        //   // }, 3000)
        // }

        onload () {
          this.goliveBtn = document.querySelector('#go-live-btn');
          this.addressbar = document.querySelector('#location');
          this.addressbar.addEventListener("click", e=>this.addressBarChanging(e), false);
          this.addressbar.addEventListener("kepress", e=>this.addressBarChanging(e), false);

          // window.onresize = this.doLayout.bind(this);
          // this.onUpdateTitleBarWithVersion();
          // this.onUpdateLoadingSpinnerWithVersion();
          var splash = document.querySelector("#splash");
          setTimeout(() => splash.classList.add("hidden"), 300)
          // this.progressBar = document.querySelector("#download-progress");
          // this.progressBar.value = 0;
          this.setWebView(document.querySelector('#browser'));
          // this.setWebViewDevTools();
          // this.getWebView().addEventListener("ipc-message", e => this.onIPCMessageReceived(e), false);
          // this.getWebView().addEventListener("mousemove", e => this.onMouseMove(e), false);
          // this.doLayout();


          // this.addEventListener("click", e => this.onLoadHAR(e), false, "#loadhar");
          // this.addEventListener("click", e => this.onOpenInspector(e), false, "#inspector");
          // this.addEventListener("openwebinspector", e => this.onOpenInspector(e));
          // this.addEventListener("change", e => this.onUserAgentChanged(e), false, "#user-agent-selector");
          // this.addEventListener("click", e => this.onSavePageRequested(e), false, "#save");
          // this.addEventListener("click", e => this.onGoBack(e), false, "#back");
          // this.addEventListener("click", e => this.onGoForward(e), false, "#forward");
          // this.addEventListener("click", e => this.onGoHome(e), false, "#home");
          // this.addEventListener("click", e => this.onReload(e), false, "#reload");
          this.addEventListener("click", e => this.onToggleExplorerPanel(e), false, "#toggle-explorer-btn");
          // this.addEventListener("click", e => this.onToggleExplorerDetailsPanel(e), false, "#toggle-explorer-details-btn");
          // this.goliveBtn.addEventListener("click", e => this.onToggleLiveOfflineOfClone(e), false);
          // this.addEventListener("click", e => this.onToggleInternalDevToolsPanel(e), false, "#toggle-internal-inspector");

          // document.querySelector('#reload').addEventListener(
          //   'webkitAnimationIteration', function () {
          //     if (!isLoading) {
          //       document.body.classList.remove('loading');
          //     }
          // });

          // this.addEventListener("click", e=> this.navigateTo(document.querySelector('#location').value), false, "#go")
          // this.addEventListener("click", e=> this.onCacheCleared(), false, "#cache");

          // this.getWebView().addEventListener('close', this.handleExit.bind(this));
          // this.getWebView().addEventListener('did-start-loading', this.handleLoadStart.bind(this));
          // this.getWebView().addEventListener('did-stop-loading', this.handleLoadStop.bind(this));
          // this.getWebView().addEventListener('did-fail-load', this.handleLoadAbort.bind(this));
          // this.getWebView().addEventListener('did-get-redirect-request', this.handleLoadRedirect.bind(this));
          // this.getWebView().addEventListener('did-finish-load', this.handleLoadCommit.bind(this));
          // window.addEventListener('keydown', this.handleKeyDown.bind(this));

          this.navigateTo("http://www.google.com");
          // this.goliveBtn.classList.add("active");

          // setInterval(e=> {
          //   if(application.currentActivity != this){return}

          //   if(this.addressbar.isEditing){return}
          //   var url = this.getWebView().getURL();
          //   this.addressbar.value = url
          // },1000)
        }


        // loadLiveUrl(){
        //   this.goliveBtn.classList.add("active");
        //   this.navigateTo(application.getProject()[0].href);
        // }

        async onToggleLiveOfflineOfClone(){
          var url = this.getWebView().getURL();
          var hasHttpProtocol = /^https?:/.test(url);
          var hasFileProtocol = /^file?:/.test(url);
          debugger;
          if(hasFileProtocol){
            var mapping = await core.data.LiveToCloneMapping.findLiveByClonedUrl(url)
            if(mapping){
              this.goliveBtn.classList.add("active");
              var label=this.goliveBtn.querySelector("label");
              label.innerHTML = "LIVE";
              this.navigateTo(mapping.live);
            }
          }
          else if(hasHttpProtocol){
            var mapping = await core.data.LiveToCloneMapping.findCloneByLiveUrl(url)
            if(mapping){
              this.goliveBtn.classList.remove("active");
              var label=this.goliveBtn.querySelector("label");
              label.innerHTML = "OFFLINE";
              this.navigateTo("file:///" + mapping.clone);
              
            }
          }
        }

        onToggleExplorerPanel(){
          var p = this.querySelector("#side-bar");
          p.classList.toggle("collapsed")
        }

        onToggleExplorerDetailsPanel(){
          var p = this.querySelector("#details-side-bar");
          p.classList.toggle("collapsed")
        }


        getWebView() {
          return this.webview;
        }


        setWebView(_webview) {
          this.webview = _webview;
        }


        updateAddressBar(url) {
          // if (/start\.html$/.test(url)) {
          //   url = "";
          //   document.querySelector('#location').setAttribute("placeholder", "https://")
          // }
          var hasFileProtocol = /^file?:/.test(url);
          if(hasFileProtocol){
            this.goliveBtn.classList.remove("active")
          } else {
            this.goliveBtn.classList.add("active")
          }
          document.querySelector('#location').value = url;
        }


        onUpdateTitleBarWithVersion() {
          document.title = siteforgeapp.getName() + " - " + siteforgeapp.getVersion();
        }


        onUpdateLoadingSpinnerWithVersion() {
          document.querySelector("#spinner-loading-msg").innerHTML = "Loading Simul8 " + siteforgeapp.getVersion();
        }


        navigateTo(url) {
          var hasHttpProtocol = /^https?:/.test(url);
          var hasFileProtocol = /^file?:/.test(url);
          var hasProtocol = /^https?|file:/.test(url)
          // ipcRenderer.send('navigate_away', "Im ready");
          // this.resetExitedState();
          // if (hasProtocol) { }
          // else {
          //   if (!/^start.html/.test(url)) {
          //     url = "https://" + url;
          //   }
          // }

          this.getWebView().src=url;//, {userAgent:remote.getGlobal("USER_AGENTS").selected});//TODO: https://github.com/electron/electron/issues/12678
          // this.addressbar.isEditing = false;
          // this.updateAddressBar(url)
        }


        setupMenu() {
          let rightClickPosition = null

          const menu = new Menu()
          const menuItem = new MenuItem({
            label: 'Inspect Element',
            click: () => {
              remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y)
            }
          });
          menu.append(menuItem)

          window.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            rightClickPosition = { x: e.x, y: e.y };
            menu.popup(remote.getCurrentWindow())
          }, false)
        }



        doLayout() {
          var webview = document.querySelector('webview');
          var controls = document.querySelector('#controls');
          var controlsHeight = controls.offsetHeight;
          var windowWidth = document.documentElement.clientWidth;
          var windowHeight = document.documentElement.clientHeight;
          var webviewWidth = windowWidth;
          var webviewHeight = windowHeight - controlsHeight;
          var tooltrayWidth = 54;
          var detailsTooltrayWidth = 52;
          this.getWebView().style.width = (webviewWidth-tooltrayWidth-detailsTooltrayWidth) + 'px';
          this.getWebView().style.height = webviewHeight + 'px';
        }


        handleExit(event) {
          // console.log(event.type);
          document.body.classList.add('exited');
          if (event.type == 'abnormal') {
            document.body.classList.add('crashed');
          } else if (event.type == 'killed') {
            document.body.classList.add('killed');
          }
        }


        resetExitedState() {
          document.body.classList.remove('exited');
          document.body.classList.remove('crashed');
          document.body.classList.remove('killed');
        }


        handleKeyDown(event) {
          if (event.ctrlKey) {
            switch (event.keyCode) {
              // Ctrl+F.
              case 70:
                event.preventDefault();
                // openFindBox();
                break;

              // Ctrl++.
              case 107:
              case 187:
                event.preventDefault();
                // increaseZoom();
                break;

              // Ctrl+-.
              case 109:
              case 189:
                event.preventDefault();
                // decreaseZoom();
                break;
              // Ctrl+-.
            }
          }
          else {
            if (event.metaKey) {
              var webview = document.querySelector('webview');
              console.log(event)
              switch (event.keyCode) {
                case 68:
                  this.getWebView().getWebContents().toggleDevTools();
                  this.getWebView().getWebContents().toggleDevTools();
                  break;
              }
            }
            else {
              switch (event.keyCode) {
                case 13:
                  event.preventDefault();
                  this.navigateTo(document.querySelector('#location').value);
                  // decreaseZoom();
                  break;
              }
            }
          }
        }


        handleLoadCommit() {
          this.resetExitedState();
          var webview = document.querySelector('webview');
          setTimeout(() => {
            if(application.currentActivity != this){return}
            // document.querySelector('#location').value = getWebView().getURL()||"Loading...";
            this.updateAddressBar(this.getWebView().getURL() || "Loading...")
          }, 1000)
          document.querySelector('#back').disabled = !this.getWebView().canGoBack();
          document.querySelector('#forward').disabled = !this.getWebView().canGoForward();
          this.addressbar.isEditing = false;
          // closeBoxes();
        }


        handleLoadStart(event) {
          this.addressbar.isEditing = false;
          document.body.classList.add('loading');
          isLoading = true;

          this.resetExitedState();
          if (!event.isTopLevel) {
            return;
          }
          this.updateAddressBar(event.url || "Loading...")
        }


        handleLoadStop(event) {
          this.addressbar.isEditing = false;
          // We don't remove the loading class immediately, instead we let the animation
          // finish, so that the spinner doesn't jerkily reset back to the 0 position.
          isLoading = false;
        }


        handleLoadAbort(event) {
          this.addressbar.isEditing = false;
          console.log('LoadAbort');
          console.log('  url: ' + event.url);
          console.log('  isTopLevel: ' + event.isTopLevel);
          console.log('  type: ' + event.type);
        }


        handleLoadRedirect(event) {
          debugger;
          this.resetExitedState();
          this.updateAddressBar(event.newUrl || "Loading...");
          this.addressbar.isEditing = false;
        }


        onIPCMessageReceived(e){//TODO: Need to handle this ina cleaner way, possible some kind of centralized channel BUS?
            if (e.channel === "navigateto") {
              html = e.args[0];
              this.navigateTo(html)
            }
            else if (e.channel === "opendevtools") {
              this.getWebView().openDevTools()
            }
            else if (e.channel === "inspectelement") {
              var pos = e.args[0];
              this.getWebView().inspectElement(pos.x, pos.y)
            } 
            else if (e.channel === "setastrigger") {
              var data = e.args[0];
              // alert("css path:\n" + data.css_path);
              //this.getWebView().inspectElement(pos.x, pos.y);
              this.dispatchEvent("editor:setastrigger", data);
            }
            else if (e.channel === "recordingdone") {
              var data = e.args[0];
              // alert("css path:\n" + data.css_path);
              //this.getWebView().inspectElement(pos.x, pos.y);
              this.dispatchEvent("editor:recordingdone", data);
            }
            else {
              console.error("getWebView().addEventListener('ipc-message') -- unable to handle ipc message for e.channel ", e.channel);
            }
        }

        // onLoadHAR(e){
        //     e.preventDefault();
        //     e.stopPropagation();
        //     const options = {
        //       title: 'Load .HAR file',
        //       defaultPath: '/Downloads',
        //       buttonLabel: 'Open HAR',
        //       filters: [
        //         { name: 'har', extensions: ['har'] }
        //       ],
        //       message: 'Load a .HAR file for capturing'
        //     };
        //     dialog.showOpenDialog(null, options, (filePath) => {
        //       if (!filePath) { return }
        //       var contents = fs.readFileSync(filePath[0], 'utf8');
        //       var json = JSON.parse(contents);
        //       native_HAR_file_was_used = true;
        //       har = json;
        //       var doit = prompt("Do you want to reload the page?");
        //       if (doit) {
        //         this.navigateTo(json.log.entries[0].request.url);
        //         alert("HAR Loaded. Resize the window manually to force load\nany responsive css, dynamic images etc before capturing.");
        //         alert("Do a full vertical scroll from top->bottom to load any lazy assets before capture.")
        //       } else {
        //         this.updateAddressBar(json.log.entries[0].request.url);
        //       }
        //     });
        // }

        onOpenInspector(){
            this.getWebView().getWebContents().toggleDevTools();
            this.getWebView().getWebContents().toggleDevTools();
        }


        // onUserAgentChanged(e){
        //     var val = e.target.value;
        //     var icon = document.querySelector("#user-agent-icon");
        //     if(val == "desktop"){
        //       remote.getGlobal("USER_AGENTS").selected = remote.getGlobal("USER_AGENTS").desktop;
        //       icon.classList.remove("fa-mobile");
        //       icon.classList.add("fa-desktop");
        //       this.classList.remove("mobile")
        //     } 
        //     else if(val =="mobile"){
        //       remote.getGlobal("USER_AGENTS").selected = remote.getGlobal("USER_AGENTS").mobile;
        //       icon.classList.add("fa-mobile");
        //       icon.classList.remove("fa-desktop");
        //       this.classList.add("mobile");
        //     }
        //     ipcRenderer.send('clearcache', "Im ready");
        //     setTimeout(_ => document.querySelector("#go").click(),300);
        // }


        // async onSavePageRequested(e) {
        //     e.preventDefault();
        //     e.stopPropagation();

        //     if (native_HAR_file_was_used) { alert("saving from HAR") }
        //     var har_copy = JSON.parse(JSON.stringify(har));
        //     har.log.entries = {};

        //     var fileName = dialog.showSaveDialogSync(null,{ filters: [{ name: 'text', extensions: ['html'] }] });
        //     if (fileName === undefined) {
        //         alert("No file name provided");
        //         return;
        //       }

        //       this.getWebView().getWebContents().savePage(fileName, 'HTMLComplete').then(async () => {
        //         fileName = fileName;
        //         var root = fileName.substr(0, fileName.lastIndexOf("/") + 1);
        //         var file = fileName.substr(fileName.lastIndexOf("/") + 1);
        //         var assets = file.replace(".html", "_files");
        //         var assetPath = root + assets;
        //         await HARDownloadManager.save(har_copy, assetPath, this.onDownloadProgress.bind(this));
        //         await AssetPipe.run(assetPath, fileName, har_copy);
        //         this.onDownloadCompleted();
        //         ipcRenderer.send('savecomplete', "Im ready");
        //         native_HAR_file_was_used = false;
        //         har.log.entries = {};
        //       }).catch(e => {
        //         console.error(e)
        //       })
        // }


        onGoForward(){
            ipcRenderer.send('navigate_away', "Im ready");
            this.getWebView().goForward();
        }

        onGoBack(){
          this.getWebView().goBack();
        }


        // onGoHome(){
        //     // this.navigateTo('start');
        //     location.href="#views.WelcomeHome"
        // }


        onReload(){
            if (isLoading) {
              this.getWebView().stop();
            } else {
              this.getWebView().reload();
            }
        }

        // onCacheCleared(){
        //     ipcRenderer.send('clearcache', "Im ready");
        // }

        addressBarChanging(e){
          this.addressbar.isEditing=true;
        }
    }
);