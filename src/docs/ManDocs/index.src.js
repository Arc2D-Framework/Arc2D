(()=>{ 

namespace `docs.topics` (
    class LoaderActivity extends w3c.ui.WebComponent {
        constructor() {
            super();
        }

        onLoadInstanceStylesheet(){return false}//no .css file to load

        fade(){
        	setTimeout(_=> this.classList.add("fade"), 2000);
        }

        onTransitionEnded(e){
        	this.classList.add("hidden");
        	this.classList.remove("fade")
        }

        show(){
        	this.classList.remove("hidden");
        	this.classList.remove("fade")
        }

        onShow(){
        	this.show();
        	this.fade();
        }


        onConnected() {
            this.render();
            application.addEventListener("showsplash", e => this.onShow(), false);
            this.addEventListener('transitionend', e => this.onTransitionEnded(e), false);
            this.fade()
        }

        template (){
        	return `
        		<template>
					<div class='container'>
					  <i class='layer'></i>
					  <i class='layer'></i>
					  <i class='layer'></i>
					</div>
				</template>
        	`
        }

        cssStyle(){
        	return `

        	.LoaderActivity {
				border: 0;
				display: block;
				padding: 10px;
				position: fixed;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				background:
				#1c2336;
				color:
				white;
				opacity: 1;
				z-index: 10000000;
				transition: opacity .4s;
				box-sizing: border-box;
			}

			.LoaderActivity.fade{
				opacity:0;
			}

			.LoaderActivity.hidden{
				visibility:hidden;
				z-index:-100;
			}


			/**
			 * Create the loop delay with
			 * the extra keyframes
			 */
			@-webkit-keyframes moveup {
			  0%, 60%, 100% {
			    -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
			            transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
			  }
			  25% {
			    -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(1em);
			            transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(1em);
			  }
			}
			@keyframes moveup {
			  0%, 60%, 100% {
			    -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
			            transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
			  }
			  25% {
			    -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(1em);
			            transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(1em);
			  }
			}
			@-webkit-keyframes movedown {
			  0%, 60%, 100% {
			    -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
			            transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
			  }
			  25% {
			    -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(-1em);
			            transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(-1em);
			  }
			}
			@keyframes movedown {
			  0%, 60%, 100% {
			    -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
			            transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
			  }
			  25% {
			    -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(-1em);
			            transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(-1em);
			  }
			}
			/**
			 * Square layer styles
			 */
			.LoaderActivity .layer {
			  display: block;
			  position: absolute;
			  height: 3em;
			  width: 3em;
			  box-shadow: 3px 3px 2px rgba(0, 0, 0, 0.2);
			  -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg);
			          transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg);
			}
			.LoaderActivity .layer:nth-of-type(1) {
			  background: #534a47;
			  margin-top: 1.5em;
			  -webkit-animation: movedown 1.8s cubic-bezier(0.39, 0.575, 0.565, 1) 0.9s infinite normal;
			          animation: movedown 1.8s cubic-bezier(0.39, 0.575, 0.565, 1) 0.9s infinite normal;
			}
			.LoaderActivity .layer:nth-of-type(1):before {
			  content: '';
			  position: absolute;
			  width: 85%;
			  height: 85%;
			  background: #37332f;
			}
			.LoaderActivity .layer:nth-of-type(2) {
			  background: #5a96bc;
			  margin-top: 0.75em;
			}
			.LoaderActivity .layer:nth-of-type(3) {
			  background: rgba(255, 255, 255, 0.6);
			  -webkit-animation: moveup 1.8s cubic-bezier(0.39, 0.575, 0.565, 1) infinite normal;
			          animation: moveup 1.8s cubic-bezier(0.39, 0.575, 0.565, 1) infinite normal;
			}

			/* Stage and link styles */

			.LoaderActivity .container {
			  width: auto !important;
			  position: absolute;
			  top: 50%;
			  left: 50%;
			  margin-top: -30px;
			  margin-left: -25px;
			  -webkit-transform: translate(-50%, -50%);
			          transform: translate(-50%, -50%);
			}

        	`
        }
    }
);



;(()=> {
                

namespace `docs.components` (
    class TocMenu extends w3c.ui.WebComponent {
        constructor(element){
            super(element);
        }
        
        async onConnected() {
            await this.render();
            application.addEventListener("topichanged",e=> this.onTopicChanged(e),false);
            this.on("click", e => this.onToggleExpandable(e), false, "ol > li.expandable");
            this.on("click", e => this.onLinkClicked(e), false, "ol > li > a");
            this.last_active = this.querySelector("ol > li.active");
            var activeHref = this.querySelector(`a[href = "${location.hash}"]`);
            if(activeHref){
                this.collapse(this.last_active);
                var li = this.getParentBySelectorUntil(activeHref, ".toc", "li.expandable");
                this.expand(li);

                activeHref.classList.add("active");
                this.last_active_a=activeHref;
            }
        }

        onTopicChanged(e){
            var activeHref = this.querySelector(`a[href = "${location.hash}"]`);
            if(activeHref){
                this.collapse(this.last_active);
                var li = this.getParentBySelectorUntil(activeHref, ".toc", "li.expandable");
                this.expand(li);

                activeHref.classList.add("active");
                activeHref.scrollIntoView({behavior:"smooth",block:"start"})
                this.onLinkClicked({target:activeHref})
            }
        }


        onToggleExpandable(e){
        	if(this.last_active){ 
                this.collapse(this.last_active)
        	}
            this.expand(e.target)
        }

        expand(li){
            li && li.classList.add("active")
            li && li.classList.add("expand");
            this.last_active = li;
        }

        collapse(li){
            li && li.classList.remove("active")
            li && li.classList.remove("expand");
        }

        onLinkClicked(e){
        	if(this.last_active_a){ 
        		this.last_active_a.classList.remove("active");
        	}
        	e.target.classList.add("active")
        	this.last_active_a = e.target;
        }
    }
);



                docs.components.TocMenu.prototype.template = function(){
                    return `<template>
	<div class="toc" style="margin-top:0;">
        <ol>
            <li class="expandable active expand">
              <a href="#docs.topics.DocHome">Home</a>
            </li> 
            <li class="expandable">
              <a href="#docs.topics.InstallFramework">Installation</a>
              <ol>
                <li><a href="#docs.topics.UpstreamRepo">Upstream Repo</a></li>
                <li><a href="#docs.topics.PlopGenerator">Generator</a></li>
                <li><a href="#docs.topics.BootServer">Booting a server</a></li>
                <li><a href="#docs.topics.FrameworkUsage">Usage</a></li>
              </ol>
            </li> 
            <li class="expandable">
              <a href="javascript:void(null)">Getting Started</a>
              <ol>
                <li><a href="#docs.topics.HelloWorldGenerated">Hello World (generator)</a></li>
                <li><a href="#docs.topics.HelloApplication">Hello World (manually)</a></li>

                <!-- <li><a href="#docs.topics.TheDiv">The div element</a></li> -->
                <!-- <li><a href="#docs.topics.CustomTags">Custom elements</a></li> -->
                <!-- <li><a href="#docs.topics.HelloApplication">Applications</a></li> -->
                <!-- <li><a href="#docs.topics.HelloApplication2">Applications pt. 2</a></li>
                <li><a href="#docs.topics.LinkingApplications">Linking Applications</a></li> -->
              </ol>
            </li>   
            <li class="expandable">
              <a href="javascript:void(null)">Language & Syntax</a>
              <ol>
                <li><a href="#docs.topics.AboutClasses">Classes</a></li>
                <li><a href="#docs.topics.JavascriptImports">Imports</a></li>
                <li>
                  <a href="#docs.topics.JavascriptNamespaces">Namespaces</a>
                  <ol>
                    <li><a href="#docs.topics.NamespaceRegistry">NSRegistry</a></li>
                  </ol>
                </li>
                <li><a href="#docs.topics.JavascriptDecorators">Decorators</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Custom Decorators</a></li>
                <li><a href="#docs.topics.JavascriptDecorators/traits">Traits</a></li>
                <li><a href="#docs.topics.ClassLoader">Class Loader</a></li>
              </ol>
            </li>
            <li class="expandable">
              <a href="javascript:void(null)">Components In Depth</a>
              <ol>
                <li><a href="#docs.topics.ComponentNamespaces">Namespaces</a></li>
                <li><a href="#docs.topics.ComponentPackaging">Component Packaging</a></li>
                <li><a href="#docs.topics.ComponentPrefabs">Component Prefabs</a></li>
                <li><a href="#docs.topics.ComponentLifecycle">Component Life-Cycle</a></li>
                <!-- <li class="disabled"><a href="#docs.topics.TheApplication">Class Syntax</a></li> -->
                <li><a href="#docs.topics.ComponentUsage">Using Components</a></li>
                <li>
                  <a href="#docs.topics.ComponentEvents">Events</a>
                  <ol>
                    <li><a href="#docs.topics.ComponentEvents/intro">Introduction</a></li>
                    <li><a href="#docs.topics.ComponentEvents/propagation">Propagation</a></li>
                    <li><a href="#docs.topics.ComponentEvents/capture">Capturing Phase</a></li>
                    <li><a href="#docs.topics.ComponentEvents/target">Targeting Phase</a></li>
                    <li><a href="#docs.topics.ComponentEvents/bubble">Bubbling Phase</a></li>
                    <li><a href="#docs.topics.ComponentEvents/target_phase_registration">Target Phase Registration</a></li>
                    <li><a href="#docs.topics.ComponentEvents/bubble_phase_registration">Bubble Phase Registration</a></li>
                    <li><a href="#docs.topics.ComponentEvents/capture_phase_registration">Capture Phase Registration</a></li>
                    <li><a href="#docs.topics.ComponentEvents/example">Examples</a></li>
                  </ol>
                </li>
                <li><a href="#docs.topics.StyleSheets">Style Sheets</a></li>
                <li><a href="#docs.topics.CascadingStylesheets">Cascade Styling</a></li>
                <li><a href="#docs.topics.StylesheetTransformation">CSS Transformer</a></li>
                <li><a href="#docs.topics.ComponentTemplates">Templates</a></li>
                <li class="disabled"><a href="#docs.topics.TheApplication">Shadow DOM</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Child Components</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Protected Components (OAuth)</a></li>
              </ol>
            </li> 
            <li class="expandable">
              <a href="javascript:void(null)">Progressive Enhancement</a>
              <ol>
                <li><a href="#docs.topics.ProgressiveEnhancementIntro">Introduction</a></li>
                <li><a href="#docs.topics.AdoptingNodes">Adopting Nodes</a></li>
                <!-- <li><a href="#docs.topics.ReplacingNodes">Replacing Nodes</a></li> -->
                <li><a href="#docs.topics.DecoratingNodes">Decorating Nodes</a></li>
              </ol>
            </li> 
            <li class="expandable">
              <a href="javascript:void(null)">2D Gaming</a>
              <ol>
                <li class="disabled"><a href="#docs.topics.TheDiv">The Game Loop</a></li>
                <li class="disabled"><a href="#docs.topics.HelloWorld">Input</a></li>
                <li class="disabled"><a href="#docs.topics.TheApplication">Update</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Render</a></li>
                <li class="disabled"><a href="#docs.topics.CustomTags">Delta Time</a></li>
                <li class="disabled"><a href="#docs.topics.TheApplication">Interpolation</a></li>
                <li class="disabled"><a href="#docs.topics.TheApplication">Sprites</a></li>
                <li class="disabled"><a href="#docs.topics.TheApplication">FPS</a></li>
              </ol>
            </li>
            <li class="expandable">
              <a href="javascript:void(null)">Templating</a>
              <ol>
                <li><a href="#docs.topics.TemplateBasics">Basic Templates</a></li>
                <li><a href="#docs.topics.InlineTemplates">Inline</a></li>
                <li><a href="#docs.topics.ExternalTemplates">External</a></li>
                <li><a href="#docs.topics.BakedTemplates">Baked</a></li>
                <li><a href="#docs.topics.TemplateData">Rendering Data</a></li>
                <li><a href="#docs.topics.TemplateDataToHtml">Transform data to HTML</a></li>
                <li><a href="#docs.topics.MultiTemplates">Dynamic Template Sources</a></li>
                <li><a href="#docs.topics.TemplateSlots">Slots</a></li>
                <li><a href="#docs.topics.CompositComponents">Composit Components</a></li>
                <li><a href="#docs.topics.PluggableTemplateEngines">Pluggable Engines</a></li>
                <li><a href="#docs.topics.UsingCustomDriver">Using a custom template drivers</a></li>
              </ol>
            </li>
            <li class="expandable">
              <a href="javascript:void(null)">Applications In Depth</a>
              <ol>
                <li class="disabled"><a href="#docs.topics.TheDiv">Namespaces</a></li>
                <li class="disabled"><a href="#docs.topics.HelloWorld">Application Life-Cycle</a></li>
                <li class="disabled"><a href="#docs.topics.HelloWorld">Folder Structure/Setup</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Instantiation</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Redirects/Flow</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Protected Applications (OAuth)</a></li>
              </ol>
            </li> 
            <li class="expandable">
              <a href="javascript:void(null)">Importing Dependencies</a>
              <ol>
                <li class="disabled"><a href="#docs.topics.TheDiv">static imports</a></li>
                <li class="disabled"><a href="#docs.topics.HelloWorld">dynamic imports</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">script imports</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Transpilation</a></li>
              </ol>
            </li>
            <li class="expandable">
              <a href="javascript:void(null)">Single Page Architecture</a>
              <ol>
                <li><a href="#docs.topics.SpaIntroduction">Introduction</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Activities</a></li>
                <li><a href="#docs.topics.ActivityLifeCycle">Activity Life-Cycle</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Redirects/Flow</a></li>
                <li><a href="#docs.topics.DestroyingActivities">Destroying Activities</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Activity Loaders (animation)</a></li>
              </ol>
            </li> 
            <li class="expandable">
              <a href="javascript:void(null)">Data Access</a>
              <ol>
                <li><a href="#docs.topics.DataAccessIntro">Introduction</a></li>
                <li><a href="#docs.topics.DataRepositories">
                  Repositories
                  <ol>
                    <li><a href="#docs.topics.DataRepositories/how">How it Works</a></li>
                    <li><a href="#docs.topics.DataRepositories/create">Create Repositories</a></li>
                    <li><a href="#docs.topics.DataRepositories/seeding">Seeding</a></li>
                    <li><a href="#docs.topics.DataRepositories/using">Using Repositories</a></li>
                    <li><a href="#docs.topics.DataRepositories/customize">Extending Repositories</a></li>
                  </ol>
                </a></li>
                <li>
                  <a href="#docs.topics.DataRepositoryDrivers/intro">Drivers</a>
                  <ol>
                    <li><a href="#docs.topics.DataRepositoryDrivers/what">What is a Driver?</a></li>
                    <li><a href="#docs.topics.DataRepositoryDrivers/a-db-problem">A Database Problem</a></li>
                    <li><a href="#docs.topics.DataRepositoryDrivers/memory-driver">The Memory Driver</a></li>
                    <li><a href="#docs.topics.DataRepositoryDrivers/couch-db">Creating a CouchDB Driver</a></li>
                  </ol>
                </li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Seeding</a></li>
              </ol>
            </li>
            <li class="expandable">
              <a href="javascript:void(null)">Data Binding</a>
              <ol>
                <li><a href="#docs.topics.DataBindingIntroduction">Introduction</a></li>
                <li><a href="#docs.topics.DataBindingEventDriven">Event-driven</a></li>
                <li><a href="#docs.topics.DataBindingReflection">Live Data Binding</a></li>
                <li><a href="#docs.topics.DataBindingLoop">Environment Loop</a></li>
              </ol>
            </li>
            <li class="expandable disabled">
              <a href="#docs.topics.InstallFramework">Advanced Configuration</a>
            </li> 
            <li class="expandable disabled">
              <a href="#docs.topics.InstallFramework">Multi-threading</a>
            </li> 
            <li class="expandable disabled">
              <a href="#docs.topics.InstallFramework">Modules & Libraries</a>
            </li> 
            <li class="expandable disabled">
              <a href="#docs.topics.InstallFramework">Performance</a>
            </li> 
            <li class="expandable disabled">
              <a href="#docs.topics.InstallFramework">Diagnostics</a>
            </li> 
            <li class="expandable disabled">
              <a href="#docs.topics.InstallFramework">OAuth</a>
              <ol>
                <li class="disabled"><a href="#docs.topics.TheDiv">Configuration</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Protected Applications</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">Protected Components</a></li>
                <li class="disabled"><a href="#docs.topics.TheDiv">OAuth and the Backend</a></li>
              </ol>
            </li>
        </ol>
    </div>
</template>
`
                };

                docs.components.TocMenu.prototype.cssStyle = function(){
                    return `.TocMenu {
	overflow: auto;
    scrollbar-width: none;
}

.TocMenu::-webkit-scrollbar { display: none; }

.TocMenu ol > li > a.active {
	background:#d2cbe2;
}


.TocMenu ol > li.disabled {
	opacity:.3;
	pointer-events:none;
}

.TocMenu .toc li.expand ol {
    max-height: 1000px !important;
}
`
                };

                docs.components.TocMenu.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();



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



;(()=> {
                

namespace `docs.topics` (
    class Topic extends w3c.ui.WebComponent {
        constructor() {
            super();
            application.addEventListener("lang-selected", e=>this.onLanguageChange(e), false);
            hljs.getLanguage('javascript').keywords += ' namespace'; // note the leading space
        }

        onLoadStyle(url){ return "/src/docs/topics/index.css" }

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
            super.onConnected()
            setTimeout(_=>this.applyHighlighting(),1000);
            this.onLanguageChange();

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

cascade(docs.topics.Topic, true);


namespace `docs.topics` (
    class DocHome extends docs.topics.Topic {
        
    }
);



                docs.topics.DocHome.prototype.template = function(){
                    return `<template>
  <div>

    <div style="display: flex;flex-direction: row;flex-wrap: nowrap;">
      <div style="width: 50%;padding: 22px;">
        <h1 id="api-reference">Welcome</h1>
        <p>
          <em>Oros is in incubation as a private repository on github. <b>You'll need to be added as a collaborator</b> in order to fork/install. Reach out to jaysmith024@gmail.com for access.</em>
        </p>
        <p>
          Oros is an SDK for building customized framework architectures and apps. You'll want to
          start with <a href="#docs.topics.InstallFramework">installation</a> and then <a href="#docs.topics.HelloWorld">getting started.</a>
        </p>
      </div>
      <div style="width: 50%;display: block;">
        <div class="shell lang"></div>
        <div class="javascript lang"></div>
        <div class="html lang"></div>
        <div class="css lang"></div>
      </div>
    </div>

  </div>
</template>
`
                };

                docs.topics.DocHome.prototype.cssStyle = function(){
                    return `
`
                };

                docs.topics.DocHome.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();



;(()=> {
                
namespace `docs.components` (
	class ReadingProgress  extends w3c.ui.WebComponent  {
	   async onConnected(){
        await super.onConnected();
        // await this.render();
            // variables for progress bar and post container elements
            const progressContainerEl = document.querySelector(".article-content");
            const progressBarEl = document.querySelector(".progress-bar-container__progress");

            // function to check scroll position and update scroll progress bar accordingly
            const updateScrollProgressBar = () => {
              // get full scroll height
              const scrollHeight = progressContainerEl.scrollHeight - this.heightInViewport(progressContainerEl);
              // console.log(scrollHeight);
              // get current scroll position
              const scrollPosition = progressContainerEl.scrollTop;
              
              // get scroll percentage and set width of progress bar
              const scrollPercentage = (scrollPosition / scrollHeight) * 100;
              progressBarEl.style.width = scrollPercentage + "%";
            }

            // bind window onload and onscroll events to update scroll progress bar width
            progressContainerEl.addEventListener("scroll", updateScrollProgressBar)
            progressContainerEl.addEventListener("load", updateScrollProgressBar)

            // function to get visible height in viewport
            // some code taken from user Roko C. Buljan on https://stackoverflow.com/questions/24768795/get-the-visible-height-of-a-div-with-jquery
            
       }	

       heightInViewport (el) {
            var elH = el.offsetHeight,
                H   = document.body.offsetHeight,
                r   = el.getBoundingClientRect(), t=r.top, b=r.bottom;
            return Math.max(0, t>0? Math.min(elH, H-t) : Math.min(b, H));
        }
	}
)


                docs.components.ReadingProgress.prototype.template = function(){
                    return `<template>
	<div class="progress-bar-container">
        <div class="progress-bar-container__progress"></div>
    </div>
</template>
`
                };

                docs.components.ReadingProgress.prototype.cssStyle = function(){
                    return `.ReadingProgress {
	display:block;
    display: block;
    z-index: 10000;
    position: fixed;
}



/* progress bar container */
.ReadingProgress .progress-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

/* progress bar */
.ReadingProgress .progress-bar-container__progress {
  height: 4px;
  background-color: #a2fca2;
  width: 0%;
  float: left;
  transform:translate3d(0px,0px,0px);
}
`
                };

                docs.components.ReadingProgress.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();



;(()=> {
                

namespace `docs.components` (
    class DomView extends w3c.ui.WebComponent {
        async onConnected() {
            await super.onConnected();
            this.lastMouseX=0;
            this.lastMouseY=0;
            this.rotX=0;
            this.rotY=0;

            this.addEventListener("mousedown", e=> this.onMouseDown(e));
            this.addEventListener("mouseup", e=> this.onMouseUp(e));
            this.addEventListener("mousemove", e=> this.onMouseMove(e));
        }


        onStyleComputed(style){//wait for styles
            var canvasBounds = this.getBoundingClientRect();
            wait(300).then(e => {
                var node = this.querySelector(".WebComponent");
                var rect = node.getBoundingClientRect();
                var node_half_w = (rect.width/2);
                var node_half_h = (rect.height/2);

                node.style.left = ((canvasBounds.width/2)-node_half_w) + "px";
                node.style.top = ((canvasBounds.height/2)-node_half_h) + "px"
            })
        }


        onMouseDown(e){
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
            this.activeEl = this.querySelector(".WebComponent");//this.querySelector(".transformed", e);
            if(this.activeEl){
                // var style = window.getComputedStyle(this.activeEl);
                // var matrix = new DOMMatrix(style.transform);
                // this.matrix = matrix;
                // // console.log("matrix",matrix)
            }
        }

        onMouseUp(e){
            this.activeEl=null;
        }

        onMouseMove(e){
            if(!this.activeEl) { return };
            var deltaX = e.pageX - this.lastMouseX;
            var deltaY = e.pageY - this.lastMouseY;

            this.lastMouseX = e.pageX;
            this.lastMouseY = e.pageY;

            this.rotY -= deltaX * 0.5;
            this.rotX += deltaY * 0.5;
            // $("#mainWrapper").css("transform", "rotateY(" + rotY + "deg)" + " " + "rotateX(" + -rotX + "deg)");
            this.activeEl.style.transform = "rotateY(" + this.rotY + "deg)" + " " + "rotateX(" + -this.rotX + "deg)"

        }
    }
);



                docs.components.DomView.prototype.template = function(){
                    return `<template>
    <div id="canvas">
        <slot name="component">Hello</slot>
    </div>
</template>
`
                };

                docs.components.DomView.prototype.cssStyle = function(){
                    return `dom-view {
    width:100%;
    display:block;
    min-height:200px;
    position:relative;
    border:1px solid gray;
    background-size: 10px 10px;
    background-image:
        linear-gradient(to right, rgba(0,0,0,.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,.1) 1px, transparent 1px);
}

dom-view #canvas {
    height: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;

    background-image: url(src/docs/components/DomView/axis_icon.png);
    background-size: 42px;
    background-repeat: no-repeat;
    background-position: right top;
}


dom-view #canvas slot {
    display: block;
    height: 100%;
}

dom-view #canvas slot > .WebComponent {
    position: absolute;
}



dom-view slot *{
  background-color: rgba(0, 0, 0, 0.22) !important;
  transform: translateZ(30px) scale(0.940);
  border:1px solid red;
  transform-style: preserve-3d;
  box-shadow: 6px 6px 3px -3px rgba(0,0,0,.5);
}
`
                };

                docs.components.DomView.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();



;(()=> {
                

namespace `docs.components` (
    class DomTreeView extends w3c.ui.WebComponent {
        async onConnected() {
            await super.onConnected();
            wait(300).then(e => {
                this.init()
            })
        }

        // onStyleComputed(style){//wait for styles
        //     wait(1000).then(e => {
        //         this.init()
        //     })
        // }

        getLevelNodes(node) {
            return Array.from(node.parentNode.children)
        }
      
        getChildIndex(node) {
            return this.getLevelNodes(node).indexOf(node)
        }
      
        tagNodeName(node) {
            node.innerHTML = (node.getAttribute("tag")||node.nodeName) + node.innerHTML
        }
      
        clearInside(node) {
            Array.from(node.childNodes).forEach(child => {
              if (child.nodeName === '#text') {
                child.remove()
              }
            })
        }
      
        handleImage(node) {
            if (node.nodeName === 'IMG') {
              node.src = ''
              node.alt = 'IMG'
            }
        }
      
        walk(node, cb) {
            cb(node)
            if (node.children.length) {
              this.walk(node.children[0], cb)
            }
            if (node.nextElementSibling) {
              this.walk(node.nextElementSibling, cb)
            }
        }
    

        init() {
            var el = this.querySelector('slot')
            this.walk(el.children[0], node => {
              var levelNodes = this.getLevelNodes(node);
              var childIndex = this.getChildIndex(node);
              var width = 90 / levelNodes.length;
              var leftSlice = 100 / levelNodes.length;
              var left = leftSlice * childIndex;
              this.clearInside(node)
              this.tagNodeName(node)
              this.handleImage(node)
              node.style.cssText += `;
                width: ${width}%;
                left: ${left}%;
              `
            })
        }
    }
);



                docs.components.DomTreeView.prototype.template = function(){
                    return `<template>
    <div id="canvas">
        <slot name="component">Hello</slot>
    </div>
</template>
`
                };

                docs.components.DomTreeView.prototype.cssStyle = function(){
                    return `dom-tree-view {
    /*width:100%;
    display:block;
    position:relative;
    border:1px solid gray;*/
    width: 100%;

    display: block;

    position: relative;

    border: 1px solid gray;

    background: white;

    height: 300px;
    clear: both;
}

dom-tree-view #canvas {
    height: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
}


dom-tree-view #canvas slot {
    display: block;
    height: 100%;
}



dom-tree-view #canvas slot {
  position: relative;
}
dom-tree-view #canvas slot * {
    box-sizing: border-box;

position: absolute;

display: block;

height: 2.5vw;

-webkit-transform: translateX(5%);

transform: translateX(5%);

font-size: .95em;

text-align: center;

line-height: 40px;

border: 1px solid transparent;

border-radius: 3px;

background: #999;

color: #fff;

-webkit-transition: all .3s;

transition: all .3s;

margin: 0;

margin-top: 24px;
  /*box-sizing: border-box;
  position: absolute;
  display: block;
  height: 2.5vw;

bottom: -4vw;
  -webkit-transform: translateX(5%);
          transform: translateX(5%);
  font-size: .95em;
  text-align: center;
  line-height: 40px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: #999;
  color: #fff;
  -webkit-transition: all .3s;
  transition: all .3s;
  margin:0;*/
}
dom-tree-view #canvas slot *:active,
dom-tree-view #canvas slot *:focus {
  background: #27f;
  border-color: black;
}
dom-tree-view #canvas slot *:hover::before {
  background: black;
}
dom-tree-view #canvas slot *::before {
  content: "";
  position: absolute;
  /*top: -4.5vw;*/
  top: -1.5vw;
  left: 50%;
  -webkit-transform: translate(-5%);
          transform: translate(-5%);
  width: 2px;
  /*height: calc(4.5vw - 1px);*/
  height: 24px;
  background: inherit;
}

@media (max-width: 500px) {
  dom-tree-view #canvas slot {
    width: 175%;
  }
  dom-tree-view #canvas slot * {
    height: 30px;
    bottom: -60px;
    line-height: 30px;
  }
  dom-tree-view #canvas slot *::before {
    top: -30px;
    height: 29px;
  }
}
@media (max-width: 300px) {
  dom-tree-view #canvas slot {
    width: 250%;
  }
}

`
                };

                docs.components.DomTreeView.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();




namespace `docs` (
    class ManDocs extends w3c.ui.Application {
        constructor(element){
            super(element);
            this.addEventListener("lang-selected", e => this.onLanguageChange(e));
        }

        async onConnected() {
            await this.render();
            this.article_content = this.querySelector(".article-content");
            this.router = new core.http.Router(this,window);// <- onConnected, best place
        }


        onLanguageChange(e){
            this.current_language = e.data;
        }
    
        //When activity exits view
        onExitActivitySaveScroll(){
            if(this.currentActivity){
                this.currentActivity._scrollpos = this.article_content.scrollTop;
            }
        }

        //When activity enters view
        onEnterActivityRestoreScroll(scrollToElement=null){
            if(this.currentActivity){
                //like an achor
                if(scrollToElement){
                    wait(100).then(_=> {
                        var el = this.currentActivity.querySelector("#"+scrollToElement);
                        if (el) {
                            el.scrollIntoView({
                                behavior : "smooth",
                                block : "start"
                            });
                        }

                    })
                } else {//scroll to last y-axis
                    this.article_content.scrollTop = this.currentActivity._scrollpos||0;
                }
            }
        }

        onEnterActivity(c,scrollToElement){
            console.log("onEnterActivity", c);
            var slot = this.querySelector('.content');
	            slot.appendChild(c);
            this.currentActivity = c;
            this.onEnterActivityRestoreScroll(scrollToElement)
            this.dispatchEvent("onactivityshown",c);
        }

        onExitCurrentActivity(c){
            this.onExitActivitySaveScroll()
            console.log("onExitCurrentActivity", c);
            var slot = this.querySelector('.content');
                slot.innerHTML="";
        }

        onResumeActivity(c){
            console.log("onResumeActivity", c);
            this.dispatchEvent("topichanged",{});
        }

        onLoadingActivity(c){
            // application.dispatchEvent("showsplash")
            console.log("onLoadingActivity", c);
            this.dispatchEvent("topichanged",{});
        }
    }
);


 })()