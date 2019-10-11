;
(() => {
    //PATCHES

    /**
        getParentBySelectorUntil() - refactored for 3.0.1, simpler
    **/
	w3c.ui.WebComponent.prototype.getParentBySelectorUntil = function(elem=this, terminator="html", selector) {
        var parent_node = null;
        do {
            if(elem.matches(selector)){
                parent_node = elem;
                break;
            }
            if(elem.matches(terminator)){
                break;
            }
            elem=elem.parentNode;
        } while(elem) 

        return parent_node;
    }


    /**
        support for captured phase bool flag. Default=false
    **/
    w3c.ui.WebComponent.prototype.bind = function(el, evtName, handler, bool=false) {//previously bool not accepted
        var self = this;
        if (typeof el == "string") {
            this.addEventListener(evtName, (e) => {
                var t = this.getParentNodeFromEvent(e, el);
                if (t) {
                    handler({
                        target: t,
                        realtarget: e.target,
                        src: e,
                        preventDefault: () => e.preventDefault,
                        stopPropagation: () => e.stopPropagation
                    });
                }
            }, bool);//previously bool=true
        } else {
            el.addEventListener(evtName, handler, bool);//previously bool=false
        }
    };


    /**
        getRealTargetFromEvent() deprecated, use getParentNodeFromEvent() instead
    **/
    w3c.ui.WebComponent.prototype.getRealTargetFromEvent = function(e,selector, terminator) {
        console.warn(`DEPRECATED: ${this.namespace}.getRealTargetFromEvent() - use getParentNodeFromEvent()`, arguments.callee);
        return this.getParentNodeFromEvent(e, selector, terminator)
    }

})()
;
