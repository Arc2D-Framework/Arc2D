import {
    querySelectorAllDeep,
    querySelectorDeep,
  } from "/src/libs/deep.mjs";


class TourGuide extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        let template = document.createElement("template");
        this.stepIndex = -1;
        template.innerHTML = `
            <style>
                :host {
                    visibility:hidden;
                }

                :host(.active) {
                    visibility:visible;
                }

                :host {
                    left : 0px; 
                    top : 0px;
                    position: absolute;
                    background-color: white;
                    max-width: 320px;
                    min-width: 320px;
                    display: block;
                    font-size: .8rem;
                    z-index: 1000;
                    padding: 11px;
                    border: 1px solid gray;
                    border-radius: 4px;
                    box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 50%);
                    z-index:110;
                    transition : transform .3s;
                  }

                 
                  :host:before {
                    border: 8px solid transparent;
                    content: "";
                    position: absolute;
                  }
                  
                  :host(.bottom):before {
                    top: -16px;
                    border-bottom-color: #fff;
                  }
                  :host(.right):before {
                    right: 20px;
                  }

                  :host(.center):before {
                    left: 50%;
                    transform: translateX(-50%);
                  }
                  
                  :host(.top):before {
                    bottom: -16px;
                    border-top-color: #fff;
                  }

                  :host(.bottom):before {
                    top: -15px;
                    border-bottom-color: #fff;
                    border-top-color: #ef000000 !important;
                  }

                  :host(.left):before {
                    left: 20px;
                    border-top-color: #fff;
                  }

                  :host #help-tour-title {
                    color: black;
                    font-size: 20px;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                  }
                  :host #help-tour-title:after {
                    content: "\\274C";
                    display: inline-block;
                    float: right;
                    color: black;
                    font-size: 10px;
                    padding: 6px;
                    background: #80808017;
                  }
                  :host #help-tour-text {
                    max-height: 100px;
                    overflow-y: auto;
                    color: gray;
                  }
                  :host #help-tour-nav{
                    background: #80808021;
                    padding: 11px;
                    text-align: center;
                    border-radius: 3px;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    margin: 0 !important;
                  }
                  :host #help-tour-title,
                  :host #help-tour-text,
                  :host #help-tour-nav {
                      margin: 10px;
                      text-align: left;
                  }

                  :host #help-tour-nav button {
                    height: 40px;
                    min-width: 70px;
                    border: 1px solid #8080803b;
                    border-radius: 3px;
                  }

                  :host #help-tour-nav button.next {
                    background: #4ca76a;
                    color: white;
                  }      
                  
                  :host #help-tour-nav button.skip {
                    border: none;
                    background: none;
                    color: #dd0000;
                    text-decoration: underline;
                    cursor: pointer;
                  }
            </style>
            <h3 id="help-tour-title">Title Here</h3>
            <div id="help-tour-text">Description Here</div>
            <nav id="help-tour-nav">
                <button class="skip">Skip</button>
                <button class="next">Next</button>
            </nav>
        `;
        
        this.root.appendChild(template.content.cloneNode(true));
        this.injectStyle();
    }

    injectStyle() {
        const style = document.createElement('style');

        style.textContent = `
            #tour-guide-overlay {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 100;
                /* background: rgba(0,0,0,0.75); */
            }
            #tour-guide-element-overlay{
                position: fixed;
                z-index: 101;
                border: 2px solid red;
                box-sizing: border-box;
                box-shadow: rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgb(0 0 0 / 34%) 0px 0px 0px 5000px;
                pointer-events: none;
            }
        `;

        document.head.appendChild(style);
    }
    
    connectedCallback() {
        window.tg=this;
        this.titleEl = this.root.querySelector("h3");
        this.textEl = this.root.querySelector("#help-tour-text");
        this.btnNext = this.root.querySelector("button.next");
        this.btnNext.addEventListener("click", e=>this.onNext(e), false);

        this.btnPrevious = this.root.querySelector("button.skip");
        this.btnPrevious.addEventListener("click", e=>this.onPrevious(e), false);
        // this.iterator = this.getIterator(HELP.items);
    }

    async waitForElm(selector) {
        var f = function(string) {
            return (new Function( `return ${string}`)());
        }

        return new Promise(resolve => {
            var elm = /\.querySelector/.test(selector) ? f(selector) : querySelectorDeep(selector);
            if (elm) {
                return resolve(elm);
            }
    
            const observer = new MutationObserver(mutations => {
                var elm = /\.querySelector/.test(selector) ? f(selector) : querySelectorDeep(selector);
                if (elm) {
                    resolve(elm);
                    observer.disconnect();
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    show(items) {
        this.current=null;
        this.nextStep = null;
        this.setOverlay();
        this.classList.add("active");
        // if(!this.current) {
            this.iterator = this.getIterator(items);
        // }
        this.next()
    }

    hide() {
        this.removeOverlay();
        this.classList.remove("active");
    }
    
    onFinish() {
        this.unsetTarget();
        this.hide();
        this.target_overlay && this.target_overlay.remove();
        this.target_overlay = null;
    }

    * getIterator (array) {
        for (var item of array) {
            yield item;
            if(item.items) {
                for(let subitem of item.items) {
                    subitem.clicked=false; 
                    yield subitem;
                }
            }
        }
    }

    async next() {
        if(this?.current?.next=="click" && !this?.current?.clicked==true){
            alert("Click to continue"); 
            return;
        }

        this.current = this.nextStep||this.iterator.next().value;
        this.update();
        var step = this.current;
        if(step) {
            this.unsetTarget();
            await this.setTarget(step);
            this.setTitle(step.title);
            this.setText(step.text);
            setTimeout(e=>this.setPosition(step), 100);
        }
        else {
            this.onFinish();
        }
        this.nextStep = this.iterator.next().value;
        this.update();
    }


    update() {
        if(!this.current||!this.nextStep){
            this.btnNext.innerHTML = "Finish"
        }
        else {
            this.btnNext.innerHTML = "Next";
            // if(this.current.type=="clickable") {
            //     this.btnNext.disabled = true;
            // }
            // else {
            //     this.btnNext.disabled = false;
            // }
        }
    }

    onNext() {
        this.next();
    }

    onPrevious() {
    }

    setPosition(step) {
        var target_coords = this.target.getBoundingClientRect();
        var label_coords = this.getBoundingClientRect();
        this.style.transform = `translate3d(${this.getHorizontalPositionOn(step, target_coords, label_coords)}px, ${this.getVerticalPositionOn(step, target_coords, label_coords)}px, 0px)`
    }

    getVerticalPositionOn(step, target_coords, label_coords) {
        var VOFFSET = 8;
        var dir = step.vpos||"top";
        this.classList.remove("top","bottom", "middle");
        this.classList.add(dir)
        if(dir=="top"){
            return target_coords.top-label_coords.height - VOFFSET;
        }
        else if(dir == "bottom"){
            return target_coords.top + target_coords.height + VOFFSET
        }
        else if(dir == "middle"){
            return ((target_coords.top+target_coords.height/2))
        }
    }

    getHorizontalPositionOn(step, target_coords, label_coords) {
        var dir = step.hpos||"left";
        this.classList.remove("left","right", "center");
        this.classList.add(dir)
        if(dir=="left"){
            return target_coords.left;
        }
        else if(dir == "right"){
            return ((target_coords.left+target_coords.width)-label_coords.width)
        }
        else if(dir == "center"){
            return ((target_coords.left+target_coords.width/2)-label_coords.width/2)
        }
    }

    makeOveryFroTarget(step, el){
        var coords = el.getBoundingClientRect();
        var d;
        if(!this.target_overlay) {
            d = document.createElement("div");
            d.id="tour-guide-element-overlay";
            d.style.width = coords.width + "px";
            d.style.height = coords.height+"px";
            d.style.top = coords.top + "px";
            d.style.left = coords.left + "px";
            this.target_overlay = d;
            document.body.append(d)
        }
        else {
            d = this.target_overlay;
            d.style.width = coords.width + "px";
            d.style.height = coords.height+"px";
            d.style.top = coords.top + "px";
            d.style.left = coords.left + "px";
        }

        if(step.interactive) {
            d.style.pointerEvents = "none"
        }
        else {
            d.style.pointerEvents = "auto"
        }
        return d;
    }

    async setTarget(step) {
        this.target = await this.waitForElm(step.target);
        if(this.target) {
            this.makeOveryFroTarget(step, this.target);
            if(step.next=="click"){
                let func = e=> {
                    // debugger
                    step.clicked=true;
                    this.next();
                    this.target.removeEventListener("click", func, false)
                };
                this.target.addEventListener("click", func, false)
            }
            
            //TODO: Handle 'fixed' targets
            //this.lastTarget = this.target;
            // this.target.originalZ = this.target.style.zIndex;
            // this.target.originalP = this.target.style.position;
            // this.target.style.zIndex = 101;
            // this.target.style.position = this.target.style.position||"relative";
            this.lastTarget = this.target;

            let target = this.lastTarget;
            // debugger;
            while(target) {
                // if(target.style.zIndex) {
                    target.originalZ = target.style.zIndex;
                    target.originalP = target.style.position;
                    target.style.zIndex = 101;
                    target.style.position = target.style.position||"relative";
                // }
                target = target.parentElement||target?.parentNode?.host;
            }
        }
    }


    unsetTarget() {
        if(this.lastTarget) {
            // this.lastTarget.style.zIndex = this.lastTarget.originalZ;
            // this.lastTarget.style.position = this.lastTarget.originalP;
            let target = this.lastTarget;
            while(target) {
                // if(target.style.zIndex) {
                    target.style.zIndex = target.originalZ;
                    target.style.position = target.originalP;
                    
                // }
                target = target.parentElement||target?.parentNode?.host;
            }
        }
        this.lastTarget=null;
    }
    setTitle(str) {
        var title = str||this.target.getAttribute("data-tour-title");
        this.titleEl.innerHTML = title||"Title Here";
    }

    setText(str){
        var text = str||this.target.getAttribute("data-tour-text");
        this.textEl.innerHTML = text||"Title Here";
    }

    setOverlay() {
        this.overlay = this.overlay||document.createElement("div");
        this.overlay.id = "tour-guide-overlay";
        document.body.append(this.overlay)
    }

    removeOverlay() {
        if(this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }

    hideOverlay() {
        if(this.overlay) {
            this.overlay.style.pointerEvents = "none"
        }
    }
    showOverlay() {
        if(this.overlay) {
            this.overlay.style.pointerEvents = "auto"
        }
    }

    onload(e){
        // setTimeout(e => {

        // }, 1000)
        
    }
}

customElements.define('tour-guide', TourGuide);
document.body.append(new TourGuide);