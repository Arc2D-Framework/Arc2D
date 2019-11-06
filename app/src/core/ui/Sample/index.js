
namespace `core.ui` (
    @tag("x-test");
    @cascade(true);
    @stylesheets(["/src/./index.css"]);
    class Sample extends w3c.ui.WebComponent{
        constructor() {
            super();

            this.addEventListener('click', e => {
                console.warn(this.namespace + ": " + e.target.tagName, e)
            });
            setTimeout(_=> this.onConnected(),3000)
        }

        onConnected(){
            // alert("onConnected")
            //alert(this.templates);
            // debugger;
            this.render({
                name:"jason", 
                items:[
                    {label:"item 1"}, 
                    {label:"item x"}, 
                    {label:"item c"}]
            });
        }

        onSampleReady(e){
            e.stopPropagation();    
            e.target.setRed();
        }

        doit(){
            alert("bro")
        }

        template(){ return `
            <template>
                <b>slot: <slot name="test"></slot></b>
            </template>
        `}


    }
);

