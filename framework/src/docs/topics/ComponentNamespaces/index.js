
import 'docs.components.NamespaceExplorer';
import 'core.ui.ProjectExplorer';

namespace `docs.topics` (
    class ComponentNamespaces extends docs.topics.Topic {
        async onConnected(){
            await super.onConnected();
            // await this.render();
            this.nsExplorer = this.querySelector("namespace-explorer");
            this.nsExplorer.addEventListener("input", e=> this.onChanged(e),false);
            this.nsCodeBlock = this.querySelector("#ns-code-block");
            this.cssCodeBlock = this.querySelector("#css-code-block");

            this.msg_ns = this.querySelector("#msg-ns");
            this.where_to_save = this.querySelector("#where_to_save");
            this.where_to_save_css = this.querySelector("#where_to_save_css");
            this.where_to_save_html = this.querySelector("#where_to_save_html");

            this.why_fqns_1 = this.querySelector("#why_fqns_1");
            this.where_to_save_1 = this.querySelector("#where_to_save_1");
            this.classname_1 = this.querySelector("#classname_1");
            this.css_style = this.querySelector("#css_style");
            this.css_style2 = this.querySelector("#css_style2");
            await wait(300);
            // alert(this.css_style)
            this.onChanged()
        }

        onChanged(e){
            var s = this.nsExplorer.textContent.trim();
            this.cls = s.substr(s.lastIndexOf(".")+1);
            this.ns = s.substr(0,s.lastIndexOf("."));
            //application.dispatchEvent("nschanged", {value:val});
            var newCode = this.nsCode();
            this.nsCodeBlock.innerHTML =newCode;
            hljs.highlightBlock(this.nsCodeBlock);
            
            var cssCode = this.cssCode();
            this.cssCodeBlock.innerHTML =cssCode;
            hljs.highlightBlock(this.cssCodeBlock);

            this.msg_ns.textContent=s;
            this.where_to_save.innerHTML = "src/" + s.replace(/\./g,"/") + "/index.js";
            this.where_to_save_css.innerHTML = "src/" + s.replace(/\./g,"/") + "/index.css";
            this.where_to_save_html.innerHTML = "src/" + s.replace(/\./g,"/") + "/index.html";
            // this.where_to_save_1.innerHTML = "src/" + s.replace(/\./g,"/") + ".js";
            // this.why_fqns_1.innerHTML = s;
            // this.classname_1.innerHTML = this.cls;
            // alert(this.cls)
            // this.css_style.textContent = this.cls;
            // this.css_style2.textContent = s;
        }

        nsCode(){
            var code = `
namespace \`${this.ns}\` (
    class ${this.cls} extends WebComponent {
        
    }
);
            `;
            return code;
        }



        cssCode(){
            var code = `
.${this.cls} {
  display:block;
}

/*Alternatively, target the fully-qualified namespace*/
*[namespace='${this.ns}.${this.cls}'] {
  display:block;
}
            `;
            return code;
        }
    }
)