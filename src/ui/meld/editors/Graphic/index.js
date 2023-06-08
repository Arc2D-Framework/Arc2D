
namespace `ui.meld.editors` (
    class Graphic extends ui.meld.editors.Editor {
        static get is() {return "graphic-editor"}
        
        async onConnected() {
            await super.onConnected();
            this.on("click", e=>this.onChooseFile(e), false, ".fa-image")
        }

        async onChooseFile(e){
            let file = await this.selectFile("image/*", false);
            console.log(file.name)
            // var img = `<img src="${URL.createObjectURL(file)}" style="width: 100px; height: 100px;">`.toNode();
            this.querySelector("section img").src = URL.createObjectURL(file);
            this.querySelector("section input#graphic").value = file.name;
            this.querySelector("section input#graphic_alt").value = "Alt text for " + file.name;
            //contentElement.innerHTML = files.map(file => `<img src="${URL.createObjectURL(file)}" style="width: 100px; height: 100px;">`).join('');
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