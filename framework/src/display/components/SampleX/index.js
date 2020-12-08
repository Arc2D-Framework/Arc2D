import 'core.ui.SampleC';

@cascade(true);
@stylesheets(["src/./test.css"]);
namespace `core.ui` (
    class SampleX extends core.ui.SampleC {
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