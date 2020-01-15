
namespace `docs.topics` (
    @cascade(true);
    @stylesheets(["/src/docs/topics/index.css"]);
    class Topic extends w3c.ui.WebComponent {
        constructor() {
            super();
            application.addEventListener("lang-selected", e=>this.onLanguageChange(e), false);
            hljs.getLanguage('javascript').keywords += ' namespace'; // note the leading space

        }

        onLanguageChange(){
        	var lang = application.current_language;;
        	if(this.last_lang){
        		this.classList.remove(this.last_lang)
        	}
        	if(lang){
                this.classList.add(lang);
                this.last_lang=lang;
            }
        }

        onConnected() {
            this.render();
            setTimeout(_=>this.applyHighlighting(),1000);
            this.onLanguageChange()
        }

        applyHighlighting(){
            var code = Array.from(this.querySelectorAll(".lang code"));
            code.forEach(block => hljs.highlightBlock(block))
        }

        getExampleSnippets(){
            var shell = this.querySelectorAll(".shell.lang pre code");
            var javascript = this.querySelectorAll(".javascript.lang pre code");
            var html = this.querySelectorAll(".html.lang pre code");
            var css = this.querySelectorAll(".css.lang pre code");
            return {shell,javascript,html,css}
        }
    }
);
