

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

import! 'docs.topics.Topic';

namespace `docs.topics` (
    class DocHome extends docs.topics.Topic {
        
    }
);

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
