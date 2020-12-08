
namespace `core.ui` (
    class ChildComponent extends w3c.ui.WebComponent {
        constructor (element){
            super(element);
        }

        //Child components never gets defined right away as the w3c spec says 
        //they should for normal web components. Child components are (see w3c/moz: window.customElements.define)
        //defined by their parent component owners during render 
        //of parent (see: w3c.ui.WebComponent.initializeChildComponents())

        //defined means the component gets connected to the DOM, fully initialized and rendered.
        //onConnected normally fires where a call to render() shows the template.
        //this never happens with a child component automatically, again, parents
        //control when this happens.

        //override define() to stop auto definition
        static define(proto,bool){
            var tag = proto.classname.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
            if(/\-/.test(tag)){
                proto["ns-tagname"] = tag;
                window.registered_tags=window.registered_tags||{};
                window.registered_tags[tag]=this;
                if(!bool || this.isDefined){return}
                try {
                    this.defineAncestors();
                    this.defineAncestralClassList();
                    window.customElements && window.customElements.define(tag, this);
                    this.isDefined=true;
                }
                catch(e){console.error(e)}
            }       
        }
    }
);