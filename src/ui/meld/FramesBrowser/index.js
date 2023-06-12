

namespace `ui.meld` (
    class FramesBrowser extends WebComponent {
        async onConnected(){
            await super.onConnected();
            this.onMouseMove = this.onMouseMove.bind(this);
            this.on("click", e=>this.onFrameSelected(e), true, "#frames li");
            this.on("click", e=>this.onObjectSelected(e), true, "#objects li");
            this.on("mousedown", e=> this.onMouseDown(e), false, ".drag-handle");
            this.on("mouseup", e=> this.onMouseUp(e), false);
            document.addEventListener("editorselected", e=> this.onEditorSelected(e), false)
            this.nav = document.querySelector("#nav");
            await this.onLoadLessonFrames();
            await this.onLoadObjectsMenu()
            this.setDefault();
        }

        onEditorSelected(e){
            var ns = e.detail.namespace;
            var o = this.querySelector(`#objects li[data-namespace='${ns}']`)
            if(o) {
                this.lastObject && this.lastObject.classList.remove("active");
                this.lastObject = o;
                this.lastObject.classList.add("active");
            }
        }

        onLoadObjectsMenu() {
            var ul = this.querySelector("#objects");
                ul.innerHTML = "";
            var resize_handle = `<i class="fas fa-grip-vertical drag-handle"></i>`.toNode();
            ul.appendChild(resize_handle)

            for(var key in Config.OBJECT_TYPES) {
                var o = Config.OBJECT_TYPES[key];
                if(!o.enabled||!o.editor) { continue }
                var li = `
                    <li data-type="${key}" data-namespace="${o.editor.namespace}">
                        <i class="fas ${o.icon}"></i>
                        <label>${o.label}</label>
                    </li>`.toNode();
                    li.data = o;
                ul.appendChild(li);
            }

            
        }

        async onLoadLessonFrames(){
            var params = new URLSearchParams(location.search);
            var curriculumID = params.get("cid");
            var data = await domain.services.Meld.GetLessonData(curriculumID);
            console.log(data)
            this.onRender(data);
        }

        onRender(data) {
            var ul = this.querySelector("ul#frames");
                ul.innerHTML = "";
            for(let frame of data) {
                var li = `<li data-id="${frame.ID}" data-template="${frame.Template}">${frame.Title}</li>`.toNode();
                li.data = frame;
                ul.append(li)
            }
        }

        onMouseUp(){
            document.removeEventListener("mousemove", this.onMouseMove, false);
        }
        onMouseDown(e){
            const compStyles = window.getComputedStyle(this.nav);
            var w = parseInt(compStyles.getPropertyValue("min-width"),10);

            this.startWidth = w;
            this.startX = e.pageX;
            document.addEventListener("mousemove", this.onMouseMove, false)
        }

        onMouseMove(e) {
            var deltaX = e.pageX - this.startX;
            var width = this.startWidth + deltaX;
            this.nav.style.minWidth = `${width}px`
        }

        async setDefault(){
            var li = this.querySelector("#frames li");
                li.classList.add("active");
            this.last = li;
            await sleep (300)
            this.last.click()
        }

        async onFrameSelected(e){
            e.preventDefault();
            e.stopPropagation();
            this.last && this.last.classList.remove("active");
            this.last=e.matchedTarget;
            this.last.classList.add("active");
            this.onUpdateObjectsMenu();
            // debugger
            var musedata = await domain.services.Meld.GetMuseFrameData(this.last.data.ID);
            if(musedata){
                this.last.data.Muse = musedata;
            }
            
            this.fire("frameselected", this.last.data)
        }

        onObjectSelected(e) {
            e.preventDefault();
            e.stopPropagation();
            this.lastObject && this.lastObject.classList.remove("active");
            this.lastObject=e.matchedTarget;
            this.lastObject.classList.add("active");
            this.dispatchEvent("objectselected", {namespace:this.lastObject.dataset.namespace})
        }

        getSelectedFrame() {
            return this.last;
        }

        async onUpdateObjectsMenu() {
            this.disableAllObjects()
            var frame = this.getSelectedFrame()?.data;
            if(frame){
                var allowed_objects = Config.TEMPLATE_TYPES[frame.Template];
                if(allowed_objects?.length) {
                    // await allowed_objects.forEach(async o => {
                    for(let o of allowed_objects){
                        var li = this.querySelector(`#objects li[data-namespace="${o.editor.namespace}"]`);
                        li && li.classList.remove("disabled");
                        // await sleep (200)
                    }
                }
            }

        }

        disableAllObjects() {
            var items = this.querySelectorAll("#objects li");
            items.forEach(item => item.classList.add("disabled"))
        }

        // allowed() {
        //     var objects = {
        //         "text": {"label" : "Rich Text", "icon": "fa-font"},
        //         "graphic": {"label" : "Graphic", "icon": "fa-image"},
        //     }
        //     vap map = {
        //         "BRANCHING_MENU_LARGE" : ["text", "graphic", ]
        //     }
        // }

        inShadow(){
            return false
        }
    }
);