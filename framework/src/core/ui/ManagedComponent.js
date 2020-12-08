namespace `core.ui` (
    class ManagedComponent extends WebComponent{
        constructor (element){
            super(element);
        }

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


        render(data){
            super.render(data);
            this.initializeChildComponents();
        }
    }
);


