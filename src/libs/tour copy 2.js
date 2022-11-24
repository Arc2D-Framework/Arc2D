var HELP = {
    "items" : [
        /*{
            "title" : "Step A",
            "target" : "#btn-toggle-a",
            "text" : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here",
            "items" : [
                {
                    "target":"#btn-toggle-a button", 
                    "title" : "Step A.1",  
                    "text": "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text"
			    }
            ]
        },*/
        {
            "title" : "Step B",
            "target" : "#btn-toggle-b",
            "text" : "Finalizes item",
            "items" : [
                {
                  "type" : "clickable",
                  "target":"#btn-toggle-b button", 
                  "title" : "Step B.1",  
                  "text": "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text"
			    },
                {
                    "target":".test", 
                    "title" : "Step B.2",  
                    "text": "Many desktop publishing packages and web."
                },
                {
                  "target":"#btn-toggle-b button", 
                  "title" : "Step B.1",  
                  "text": "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text"
			    }
            ]
        }
    ]
}


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
                    right: 16px;
                  }
                  
                  :host(.top):before {
                    bottom: -16px;
                    border-top-color: #fff;
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
    }
    
    connectedCallback() {
        window.tg=this;
        this.titleEl = this.root.querySelector("h3");
        this.textEl = this.root.querySelector("#help-tour-text");
        this.btnNext = this.root.querySelector("button.next");
        this.btnNext.addEventListener("click", e=>this.onNext(e), false);

        this.btnPrevious = this.root.querySelector("button.skip");
        this.btnPrevious.addEventListener("click", e=>this.onPrevious(e), false);
        // window.addEventListener("load", e=> this.onload(e), false)
        this.iterator = this.getIterator(HELP.items);
        //this.current = this.iterator.next().value;
    }

    async waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    show() {
        this.setOverlay();
        this.classList.add("active");
        if(!this.current) {
            this.iterator = this.getIterator(HELP.items);
            // this.current = this.iterator.next().value;
        }
        this.next()
    }

    hide() {
        this.removeOverlay();
        this.classList.remove("active");
    }
    
    * getIterator (array) {
        for (var item of array) {
            yield item;
            if(item.items) {
                for(let subitem of item.items) {subitem.clicked=false; yield subitem}
            }
        }
    }

    async next() {
        // debugger
        // var step = HELP.guides[this.stepIndex];
        // var step = this.iterator.next().value;
        if(this?.current?.type=="clickable" && !this?.current?.clicked==true){alert("Click to continue"); return}
        debugger
        this.current = this.nextStep||this.iterator.next().value;
        this.update();
        // 
        // debugger
        var step = this.current;
        if(step) {
            //if(step.type=="clickable"){return}
            this.unsetTarget();
            await this.setTarget(step);
            this.setTitle(step.title);
            this.setText(step.text);
            setTimeout(e=>this.setPosition(), 400);
        }
        else {
            this.hide();
        }
        this.nextStep = this.iterator.next().value;
        // this.current = this.iterator.next().value;
        this.update();
    }


    update() {
        // debugger
        if(!this.current||!this.nextStep){
            this.btnNext.innerHTML = "Finish"
        }
        else {
            this.btnNext.innerHTML = "Next"
        }
    }

    onNext() {
        // this.stepIndex++;
        // if(this.stepIndex > HELP.guides.length) {
        //     this.stepIndex = HELP.guides.length
        // }
        this.next();
    }

    onPrevious() {
        // this.stepIndex--;
        // if(this.stepIndex < 0) {this.stepIndex=0}
        // this.next();
    }

    setPosition() {
        var target_coords = this.target.getBoundingClientRect();
        var label_coords = this.getBoundingClientRect();
        // this.style.top = `${target_coords.top-label_coords.height}px`;
        // this.style.left = `${target_coords.left}px`;
        // this.style.top = `${target_coords.top-label_coords.height}px`;
        // this.style.left = `${target_coords.left}px`;
        // debugger
        this.style.transform = `translate3d(${target_coords.left}px, ${target_coords.top-label_coords.height}px, 0px)`
    }

    async setTarget(step) {
        this.target = await this.waitForElm(step.target);//document.querySelector(cssSelector);
        console.log("done")
        if(this.target) {
            if(step.type=="clickable"){
                this.target.addEventListener("click", e=> {
                    step.clicked=true;
                    this.next()
                }, false)
            }
            
            this.lastTarget = this.target;
            this.target.originalZ = this.target.style.zIndex;
            this.target.originalP = this.target.style.position;
            this.target.style.zIndex = 101;
            this.target.style.position = this.target.style.position||"relative";
        }
    }

    unsetTarget() {
        if(this.lastTarget) {
            this.lastTarget.style.zIndex = this.lastTarget.originalZ;
            this.lastTarget.style.position = this.lastTarget.originalP;
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

    onload(e){
        // setTimeout(e => {

        // }, 1000)
        
    }
}

customElements.define('tour-guide', TourGuide);