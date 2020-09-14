
namespace `docs.components` (
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
            // debugger;
            
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
        	if(this.last_chapter && !this.isChildOf(this.last_chapter, e.target)){ 
                this.collapse(this.last_chapter)
        	}
            if(this.last_active){
                this.collapse(this.last_active);
            }
            this.expand(e.target);
        }

        isChildOf(parent, child) {
            var node = child;
            do {
                if(node.parentNode == parent){
                    return true
                    break;
                }
                node=node.parentNode;
            } while(node && node.parentNode) 

            return false
        }

        expand(li){
            li && li.classList.add("active")
            li && li.classList.add("expand");
            if(li.classList.contains("chapter")){
                this.last_chapter=li;
            }
            else{
                this.last_active = li;
            }
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
