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
