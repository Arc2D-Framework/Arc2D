
namespace `ui.meld.editors` (
    class Graphic extends ui.meld.editors.Editor {
        static get is() {return "graphic-editor"}
        
        async onConnected() {
            await super.onConnected();
            this.on("click", e=>this.onChooseFile(e), false, ".fa-image");
// 
            // debugger
            this.fields = {
                // "src" : this.querySelector("section input#src"),
                // "alt" : this.querySelector("section input#alt"),
                // "mediaDescription" : this.querySelector("section #mediaDescription")
            }
        }


        onBind() {
            if(this.museobject) {
                for (let [key, value] of Object.entries(this.museobject)) { 
                    this.fields[key] = this.querySelector(`section .input#${key}`);
                    // debugger
                    this.fields[key].value = value;
                    this.watch(this.fields[key], "value", e=> {
                        // debugger
                        this.museobject[e.object.id] = e.value;
                        this.fire("framechanged", this.museframe)
                    }, true)
                }
            }
        }

        async onChooseFile(e){
            let file = await this.selectFile("image/*", false);
            console.log(file.name)

            this.querySelector("section img").src = URL.createObjectURL(file);
            this.fields["src"].value = file.name;
            this.fields["src"].dispatchEvent(new Event("change"))
            this.fields["alt"].value = "Alt text for " + file.name;
        }

        selectFile (contentType, multiple){
            return new Promise(resolve => {
                let input = document.createElement('input');
                input.type = 'file';
                input.multiple = multiple;
                input.accept = contentType;
        
                input.onchange = _ => {
                    let files = Array.from(input.files);
                    if (multiple)
                        resolve(files);
                    else
                        resolve(files[0]);
                };
        
                input.click();
            });
        }

        inShadow() {
            return true
        }
    }
);