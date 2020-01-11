
namespace `docs.components` (
    @stylesheets(["/src/./index.css"]);
    class LanguageSelector extends w3c.ui.WebComponent {
        constructor(element){
            super(element);
        }
        
        onConnected() {
            this.render();
            this.bind("a", "click", e => this.onSelect(e), false);
            this.last_active = this.querySelector("a.active");
            this.lang = this.getLanguage(this.last_active);
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
