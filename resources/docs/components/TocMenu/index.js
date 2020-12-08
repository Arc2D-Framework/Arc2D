
namespace `docs.components` (
    class TocMenu extends WebComponent {
        constructor(element){
            super(element);
        }
        
        async onConnected() {
            await this.render();
            application.addEventListener("topichanged",e=> this.onTopicChanged(e),false);
            this.on("click", e => this.onToggleExpandable(e), false, "ol > li.expandable");
            this.on("click", e => this.onLinkClicked(e), false, "ol > li > a");
            this.last_chapter = this.querySelector("ol > li.active");
            this.collapseSiblings(this.last_chapter.parentNode)
            this.highlightTOConLoad();
        }

        async highlightTOConLoad(){
            var hash = location.hash;
            if(hash&&hash.length){
                var a = this.querySelector(`a[href = "${hash}"]`);
                if(a){
                    this.expand(a);
                    var parent=a.parentNode;
                    do {
                        if(parent.classList.contains("expandable")){
                            this.expand(parent);
                        }
                        parent=parent.parentNode;
                    } while(parent&&parent.nodeType==1 && !parent.classList.contains("toc"));

                    await wait(500);
                    a.scrollIntoView({behavior:"smooth",block:"start"})
                }
            }
        }

        onTopicChanged(e){
            var activeHref = this.querySelector(`a[href = "${location.hash}"]`);
            if(activeHref){
                this.collapse(this.last_active);
                var li = this.getParentBySelectorUntil(activeHref, ".toc", "li.expandable");
                this.collapseSiblings(li.parentNode)
                this.expand(li);

                activeHref.classList.add("active");
                activeHref.scrollIntoView({behavior:"smooth",block:"start"})
                this.onLinkClicked({target:activeHref})
            }
        }

        onToggleExpandable(e){
            var li = e.target;
            this.collapseSiblings(li.parentNode)
            this.expand(li);
        }

        collapseSiblings(ol){
            var lis = Array.from(ol.querySelectorAll("li.active"));
                lis.forEach(li => this.collapse(li))
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
