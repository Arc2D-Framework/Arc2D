
namespace `docs.components` (
    @stylesheets(["/src/./index.css"]);
    class TocMenu extends w3c.ui.WebComponent {
        constructor(element){
            super(element);
        }
        
        async onConnected() {
            await this.render();
            application.addEventListener("topichanged",e=> this.onTopicChanged(e),false);
            this.on("click", e => this.onToggleExpandable(e), false, "ol > li.expandable");
            this.on("click", e => this.onLinkClicked(e), false, "ol > li > a");
            this.last_active = this.querySelector("ol > li.active");
            var activeHref = this.querySelector(`a[href = "${location.hash}"]`);
            if(activeHref){
                this.collapse(this.last_active);
                var li = this.getParentBySelectorUntil(activeHref, ".toc", "li.expandable");
                this.expand(li);

                activeHref.classList.add("active");
                this.last_active_a=activeHref;
            }
        }

        onTopicChanged(e){
            var activeHref = this.querySelector(`a[href = "${location.hash}"]`);
            if(activeHref){
                this.collapse(this.last_active);
                var li = this.getParentBySelectorUntil(activeHref, ".toc", "li.expandable");
                this.expand(li);

                activeHref.classList.add("active");
                activeHref.scrollIntoView({behavior:"smooth",block:"start"})
                this.onLinkClicked({target:activeHref})
            }
        }


        onToggleExpandable(e){
        	if(this.last_active){ 
                this.collapse(this.last_active)
        	}
            this.expand(e.target)
        }

        expand(li){
            li && li.classList.add("active")
            li && li.classList.add("expand");
            this.last_active = li;
        }

        collapse(li){
            li && li.classList.remove("active")
            li && li.classList.remove("expand");
        }

        onLinkClicked(e){
        	if(this.last_active_a){ 
        		this.last_active_a.classList.remove("active");
        	}
        	e.target.classList.add("active")
        	this.last_active_a = e.target;
        }
    }
);
