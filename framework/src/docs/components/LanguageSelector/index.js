
namespace `docs.components` (
    class LanguageSelector extends w3c.ui.WebComponent {
        constructor(element){
            super(element);
        }
        
        async onConnected() {
            await super.onConnected();
            this.on("click", e => this.onSelect(e), false, "a");
            this.last_active = this.querySelector("a.active");
            this.lang = this.getLanguage(this.last_active);
            this["shell"] = this.querySelector("[data-language-name='shell'] .snippet-count");
            this["javascript"] = this.querySelector("[data-language-name='javascript'] .snippet-count");
            this["html"] = this.querySelector("[data-language-name='html'] .snippet-count");
            this["css"] = this.querySelector("[data-language-name='css'] .snippet-count");

            application.addEventListener("onactivityshown", e => this.onActivityDisplayed(e), false);
        }


        // getTemplateEngine() {
        //     return window.customTemplateEngines.getEngineByMimeType("template/threadedliterals")
        // }

        onActivityDisplayed(e){
            var currentActivity = e.data;
            if(currentActivity){
                this.updateSnippetCounters(currentActivity);
                setTimeout(_=> this.selectDefaultTab(currentActivity), 300);
            }
        }

        selectDefaultTab(currentActivity){
            var snippets = currentActivity.getExampleSnippets();
            if(snippets){
                if(snippets.shell.length >0){
                    this["shell"].parentNode.click();
                }
                else if(snippets.javascript.length > 0){
                    this["javascript"].parentNode.click();
                }
                else if(snippets.html.length > 0){
                    this["html"].parentNode.click();
                }
                else if(snippets.css.length > 0){
                    this["css"].parentNode.click();
                }
            }
        }

        updateSnippetCounters(currentActivity){

            setTimeout(_=> this.setSnippetCounters(currentActivity),300)
        }

        setSnippetCounters(currentActivity){
            var snippets = currentActivity.getExampleSnippets();
            this["shell"].innerHTML = snippets.shell.length;
            this["javascript"].innerHTML = snippets.javascript.length;
            this["html"].innerHTML = snippets.html.length;
            this["css"].innerHTML = snippets.css.length;
            this.toggleEmptyCounters(snippets);
        }

        toggleEmptyCounters(snippets){
            for(var langName in snippets){
                if(snippets[langName].length<=0){
                    this[langName].classList.add("hidden")
                } else {
                    this[langName].classList.remove("hidden")
                }
            }
        }

        getLanguage(tab){
        	return tab.getAttribute("data-language-name");
        }

        onSelect(e){
        	if(this.last_active){ 
        		this.last_active.classList.remove("active");
        	}
        	e.target.classList.add("active")
        	this.last_active = e.target;
        	this.lang = this.getLanguage(e.target);
        	this.notify();
        }

        notify(){
        	application.dispatchEvent("lang-selected", this.lang);
        }
    }
);
