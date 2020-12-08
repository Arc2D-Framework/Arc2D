import 'core.ui.SampleX';

@cascade(true);
@stylesheets(["src/./xxx.css"]);
namespace `core.ui` (
    class SampleZ extends core.ui.SampleX {
        async onConnected (){
            await super.onConnected();
            // this.addEventListener('click', e => {
            //     alert(this.namespace + ": " + e.target.tagName, e)
            // });
            // this.dispatchEvent(new CustomEvent('ready', {bubbles: true }))
            // return this;
        }

        setRed (){
            this.classList.add("red")
        }

        template(){ return `
            <template>
                <b>asd</b>
            </template>
        `}
    }
);