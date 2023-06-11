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
            this.editor = jar;
            this.editor.onUpdate(code => this.dispatchEvent("codechanged", {value: this.editor.toString()}))
        }

        clear() {
            this.editor.updateCode("");
            this.dispatchEvent("codechanged", {value: this.editor.toString()})
        }

        append(code) {
            var current = this.editor.toString()
            this.editor.updateCode(current + "\n" + code);
            this.dispatchEvent("codechanged", {value: this.editor.toString()})
        }

        setValue(str) {
            this.clear();
            this.editor.updateCode(str);
            this.dispatchEvent("codechanged", {value: this.editor.toString()})
        }

        inShadow() {
            return false
        }
    }
);