import 'ui.components.KnobSkinTest2';
import 'ui.components.Switch';


namespace `ui.screens` (
    class KnobDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }


        defineAncestralStyleList(){
            // debugger
            // var stylesheets = this.prototype["stylesheets"] = this.prototype["stylesheets"]||[];
            // if(this.onLoadInstanceStylesheet()){
            //     stylesheets.push(this.getNSStyleSheet(this.namespace))
            // }
            // stylesheets.push(...this.prototype["@stylesheets"]||[]);
            // var ancestor = this.__proto.ancestor;
            // if(ancestor==HTMLElement){
            //     ancestor = WebComponent
            // }
            // while(ancestor) {
                // if(ancestor.name =="_mixin_"){break}
                // if( ancestor != WebComponent && 
                //     ancestor != Application  &&
                //     ancestor != World        &&
                //     ancestor.prototype.onLoadInstanceStylesheet() ){
            //         stylesheets.unshift(...ancestor.prototype["@stylesheets"]||[]);
            //         stylesheets.unshift(this.getNSStyleSheet(ancestor.prototype.namespace));
            //         if(!ancestor.prototype['@cascade']){break}
            //         ancestor = ancestor.prototype.ancestor;
            //     } else { break }
            // }
        }

        
    }
);
