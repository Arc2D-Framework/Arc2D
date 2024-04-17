// (() => {
    class Parser {
        static render(tempStr, data={}) {
            tempStr = tempStr.replace(/\<+\%+\=+/gm, "${(e => {return ");
            tempStr = tempStr.replace(/\<+\%+/gm, "${(e => {");
            tempStr = tempStr.replace(/\%+\>+/gm, "})()}");
            return new Function("return `"+tempStr +"`;").call(data);
        }
    }

    // var updateHandler = function(e) {
    //     self.update(e.type.split(":")[0])
    // }

    class TemplateLiterals2 {
        constructor() {
            this.name = "TemplateLiterals2";
            this.ext = ".lit";
        }

        // updateHandler(){

        // }

        async update(templateId, data, self) {
            var temNode = self._template.toNode();
            let template = temNode.content.querySelector(`template[data-id="${templateId}"]`);
            let el = self.querySelector(`[data-template-id="${templateId}"]`);

            if(template && el){
                let fragment = await this.parse(template.outerHTML.decode(), data);
                if(fragment){
                    el.innerHTML = fragment.children[0].innerHTML;
                }
            }
        }

        parse(tempStr, data, self){
            this.updateHandler = this.updateHandler||function(e) {
                self.update(e.type.split(":")[0])
            }
            tempStr = tempStr.replace(/^(<template\b[^>]*>|<\/template>)/gm, '')


            var temNode = document.createElement("template");
                // tempStr = (temNode.setHTMLUnsafe && 
                //     tempStr.replace(/^(<template\b[^>]*>|<\/template>)/gm, ''))||tempStr;
                tempStr = Parser.render(tempStr.decode(), data);
                if(temNode.setHTMLUnsafe) {temNode.setHTMLUnsafe(tempStr);}
                else {
                    // tempStr = tempStr.replace(/^(<template\b[^>]*>|<\/template>)/gm, '')
                    temNode.innerHTML = tempStr;
                }
                return temNode.content;
                // var html = Parser.render(temNode.outerHTML.decode(), data);



            // // var parse = (tempStr, templateVars) => {
            //     if(!/^\<\s*template/.test(tempStr)){
            //         return tempStr
            //     }
            //     else {
            //         // var temNode = tempStr.toNode();
            //         var temNode = document.createElement("template");
            //         tempStr = Parser.render(tempStr.decode(), data);
            //         temNode.setHTMLUnsafe(tempStr);
            //         return temNode.content;


            //         this.template_tags = Array.from(temNode.content.querySelectorAll("template:not(shadowrootmode)"));
            //         debugger
            //         for(let template of this.template_tags){
            //             let template_html = Parser.render(template.outerHTML.decode(), data);
            //             if (template_html){
            //                 let node = template_html.toNode();
            //                 if(node.content.children.length == 1){
            //                     var el = node.content.children[0]
            //                     template.dataset.id && el.setAttribute("data-template-id", template.dataset.id);
            //                     template.replaceWith(el);
            //                 }
            //                 else {
            //                     var fragment = new DocumentFragment();
            //                     let children = Array.from(node.content.childNodes)
            //                     for (let child of children) {
            //                         fragment.append(child);
            //                     }
            //                     template.replaceWith(fragment);
            //                 }
            //             }
            //             if(template.dataset.updateEvent){
            //                 // document.on(template.dataset.updateEvent, e => self.update(template.dataset.id), false);
            //                 document.removeEventListener(template.dataset.updateEvent, this.updateHandler, false);
            //                 document.addEventListener(template.dataset.updateEvent, this.updateHandler, false);
            //                 delete template.dataset.updateEvent;
            //             }
            //             template.remove();
            //         }
            //     }
            //     // var html = Parser.render(temNode.outerHTML.decode(), data);
            //     var html = Parser.render(temNode.innerHTML.decode(), data);
            //     return html.toNode()?.content || html;
            // // }
            // // return parse(tempStr, data)
        }
        install(){}
    };
    

    window.customTemplateEngines.define("template/literals-2", TemplateLiterals2);
// })();

export{ TemplateLiterals2 };