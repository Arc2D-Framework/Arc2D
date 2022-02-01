
namespace `system.diagnostics.unit.com` (
    class ShadowDOM extends Component {
        async onConnected (){
            await super.onConnected();
            // this.addEventListener('click', e => {
            //     alert(this.namespace + ": " + e.target.tagName, e)
            // });
            // this.dispatchEvent(new CustomEvent('ready', {bubbles: true }))
            // return this;
        }

        inShadow (){
            return true
        }

        template(){ return `
            <template>
                <b>Shadow DOM Component</b>
            </template>
        `}
    }
);