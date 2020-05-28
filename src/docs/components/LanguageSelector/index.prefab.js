;(()=> {
                

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



                docs.components.LanguageSelector.prototype.template = function(){
                    return `<template>
	<nav class="lang-selector">
        <a data-language-name="shell" class="active">Shell<span class="snippet-count hidden"></span></a>
        <a data-language-name="javascript">JavaScript<span class="snippet-count hidden"></span></a>
        <a data-language-name="html">HTML<span class="snippet-count hidden"></span></a>
        <a data-language-name="css">CSS<span class="snippet-count hidden"></span></a>
    </nav>
</template>
`
                };

                docs.components.LanguageSelector.prototype.cssStyle = function(){
                    return `.LanguageSelector a {
	position:relative;
}

.LanguageSelector .snippet-count {
	position: absolute;
	right: 19px;
	top: 17px;
	font-size: 10px;
	background:red;
	display: block;
	height: 18px;
	width: 18px;
	line-height: 19px;
	text-align: center;
	border-radius: 50px;
}

.LanguageSelector .snippet-count.hidden{
	display:none;
}


.LanguageSelector [data-language-name='shell'] .snippet-count {
	background:blue;
}

.LanguageSelector [data-language-name='html'] .snippet-count {
	background:burlywood;
}

.LanguageSelector [data-language-name='javascript'] .snippet-count {
	background:red;
}

.LanguageSelector [data-language-name='css'] .snippet-count {
	background:#a18dcc;
}
`
                };

                docs.components.LanguageSelector.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();
