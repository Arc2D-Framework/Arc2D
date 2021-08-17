

    export class Label extends WebComponent {
        async onConnected(){
            this.name="Jay";
            await super.onConnected();
            this.on("click", e=>this.onClick(e), true)
        }

        onClick(){
            this.classList.toggle("active")
        }
        isComposable(){
            return true
        }

        onLoadInstanceStylesheet(){
            return false
        }

        inShadow(){
            return false
        }

        cssStyle(){return `
            :host {
                border:1px solid green;
            }
            :host(.active) {
                border:3px solid red;
            }
        `}

        template(){
            return `
                <template>
                    <div>${this.name}</div>
                    <i style="color:orange;"><slot name="title">[label here]</slot></i>
                </template>
            `
        }
    }
    tag(Label,'label-output');
