@tag("label-output");
namespace `display.components` (
    class Label extends WebComponent {
        async onConnected(){
            this.name="Jay";
            alert(global)
            await super.onConnected();
            // console.log(application.namespace)
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

        template(){
            return `
                <template>
                    <div>${this.name}</div>
                    <i style="color:orange;"><slot name="title">[label here]</slot></i>
                </template>
            `
        }
    }
);
