

namespace `ui.meld` (
    class FramesBrowser extends WebComponent {
        async onConnected(){
            await super.onConnected();
            this.onMouseMove = this.onMouseMove.bind(this);
            this.on("click", e=>this.onFrameSelected(e), true, "#frames li");
            this.on("mousedown", e=> this.onMouseDown(e), false, ".drag-handle");
            this.on("mouseup", e=> this.onMouseUp(e), false)
            this.nav = document.querySelector("#nav");
            await this.onLoadLessonFrames();
            await this.onLoadFrameObjects()
            this.setDefault();
        }

        onLoadFrameObjects() {
            var ul = this.querySelector("ul#objects");
                ul.innerHTML = "";
            var resize_handle = `<i class="fas fa-grip-vertical drag-handle"></i>`.toNode();
            ul.append(resize_handle)

            for(var key in Config.OBJECT_TYPES) {
                var o = Config.OBJECT_TYPES[key];
                var li = `
                    <li data-type="${key}">
                        <i class="fas ${o.icon}"></i>
                        <label>${o.label}</label>
                    </li>`.toNode();
                    li.data = o;
                ul.append(li);
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
                li.frame = frame;
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

        setDefault(){
            var li = this.querySelector("#frames li");
                li.classList.add("active");
            this.last = li;
        }

        onFrameSelected(e){
            e.preventDefault();
            e.stopPropagation();
            this.last && this.last.classList.remove("active");
            this.last=e.matchedTarget;
            this.last.classList.add("active");
            this.onUpdateAllowedObjects()
        }

        getSelectedFrame() {
            return this.last;
        }

        onUpdateAllowedObjects() {
            var frame = this.getSelectedFrame()?.frame;
            if(frame){
                var template = frame.Template;

            }

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
            return true
        }
    }
);