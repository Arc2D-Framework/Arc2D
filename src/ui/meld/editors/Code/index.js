import {CodeJar} from 'https://medv.io/codejar/codejar.js';

namespace `ui.meld.editors` (
    class Code extends WebComponent {
        static get is() {return "code-editor"}
        
        async onConnected() {
            await super.onConnected();
            let jar = CodeJar(this.querySelector('.editor'), hljs.highlightElement,{
                tab: ' '.repeat(4), // default is '\t'
                indentOn: /[(\[]$/, // default is /{$/
            })

            jar.updateCode(`
            const editor = document.querySelector('#editor');
            const jar = CodeJar(editor, Prism.highlightElement, {tab: '\t'});
            
            // Update code
            jar.updateCode('let foo = bar');
            
            // Get code
            let code = jar.toString();
            
            // Listen to updates
            jar.onUpdate(code => {
                console.log(code);
            });
            `);
        }

        inShadow() {
            return false
        }
    }
);