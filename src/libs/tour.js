// import {
//     querySelectorAllDeep,
//     querySelectorDeep,
// } from "./deep.mjs";

var querySelectorDeep = function (selector) {
    debugger
    return document.querySelector(selector);
    // alert("querySelectorDeep is not implemented")
}

let OVERLAY_ZINDEX = 999999999;
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
                    font-size: 14px;
                    padding: 11px;
                    border: 1px solid gray;
                    border-radius: 4px;
                    box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 50%);
                    z-index:${OVERLAY_ZINDEX + 3};
                    transition : transform .3s;
                    pointer-events:auto !important;
                    will-change:transform;
                  }

                 
                  :host:before {
                    border: 8px solid transparent;
                    content: "";
                    position: absolute;
                  }
                  /*:host:after {
                    background : green;
                    content: "";
                    position: absolute;
                    left:0;
                    top:0;
                    width:100%;
                    height:100%;
                  }*/
                  
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
                  :host #help-tour-title > #close-btn {
                    display: inline-block;
                    float: right;
                    color: black;
                    font-size: 10px;
                    padding: 6px;
                    background: #80808017;
                    cursor: pointer;
                  }
                  :host #help-tour-text {
                    max-height: 100px;
                    overflow-y: auto;
                    color: gray;
                    font-size:inherit;
                  }
                  :host #help-tour-text.larger-font {
                    font-size: 16px;
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
                    text-transform: capitalize;
                  }

                  :host #help-tour-nav button.skip[disabled] {
                      opacity:.4;
                      pointer-events:none;
                  }
                  :host #help-tour-options button.active {
                    background: #00cf00;
                    color: white;
                    border: 1px solid gray;
                    border-radius: 2px;
                  }
            </style>
            <h3 id="help-tour-title">
                <span id="title-label"></span>
                <span id="close-btn">✕</span>
            </h3>
            <div id="help-tour-text">Description Here</div>
            <nav id="help-tour-options" style="display: flex;flex-flow: row nowrap;justify-content: end;margin-bottom: 10px;font-size: 9px;">
                <button class="option" id="options-tint-level-btn" style="font-size: inherit;margin-right: 5px;">◑</button>
                <button class="option" id="options-fontsize-btn" style="font-size: inherit;">Aa</button>
            </nav>
            <nav id="help-tour-nav">
                <button class="skip">Skip</button>
                <button class="next">Next</button>
            </nav>
        `;

        this.root.appendChild(template.content.cloneNode(true));
        this.injectStyle();
        HELP && this.load(HELP)
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
                z-index: ${OVERLAY_ZINDEX};
                /* background: rgba(0,0,0,0.75); */
                pointer-events:auto;
                inset:0;
                pointer-events:none;
            }
            #tour-guide-element-overlay{
                position: fixed;
                z-index: ${OVERLAY_ZINDEX + 2};
                border: 3px solid #00ff4c;
                box-sizing: border-box;
                box-shadow: rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgb(0 0 0 / 68%) 0px 0px 0px 5000px;
                pointer-events: none;
            }

            #tour-guide-element-overlay.less-tint {
                box-shadow: rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgb(0 0 0 / 30%) 0px 0px 0px 5000px;
            }

            @keyframes tour-guide-element-overlay-flash {
                0% {
                   background: transparent;
                }
                50% {
                    background: white;
                }
                100% {
                    background: transparent;
                }
             }

             .tour-guide-element-overlay-flash {
                animation: tour-guide-element-overlay-flash linear .2s 3;
                animation-delay:.4;
             }
        `;

        document.head.appendChild(style);
    }

    connectedCallback() {
        window.tg = this;
        this.titleEl = this.root.querySelector("h3 #title-label");
        this.textEl = this.root.querySelector("#help-tour-text");
        this.btnNext = this.root.querySelector("button.next");
        this.btnNext.addEventListener("click", e => this.onNext(e), false);
        this.closeBtn = this.root.querySelector("#help-tour-title #close-btn");
        this.btnSkip = this.root.querySelector("button.skip");
        this.btnSkip.addEventListener("click", e => this.onSkip(e), false);

        this.optionsFontsizeBtn = this.root.querySelector("button#options-fontsize-btn");
        this.optionsFontsizeBtn.addEventListener("click", e => this.onToggleFontSize(e), false);

        this.optionsTintBtn = this.root.querySelector("button#options-tint-level-btn");
        this.optionsTintBtn.addEventListener("click", e => this.onToggleTint(e), false);

        this.closeBtn.addEventListener("click", e => this.onDismiss(e), false);
        //window.addEventListener("resize", e=> this.onResize(e), true)
        
    }

    onDismiss(e) {
        this.onFinish()
    }

    onResize(){
        
    }

    onToggleFontSize() {
        this.textEl.classList.toggle("larger-font");
        this.optionsFontsizeBtn.classList.toggle("active");
        this.setPosition(this.current)
    }

    onToggleTint() {
        this.target_overlay.classList.toggle("less-tint");
        this.optionsTintBtn.classList.toggle("active");
    }

    async waitForVisibility(el, step) {
        var t1, t2;
        var elapsed = 0;
        var totalTime = step.waitfor || 500;

        return new Promise((resolve, reject) => {
            t1 = setTimeout(_t1 => {
                clearInterval(t2); clearTimeout(t1); resolve(null);
            }, totalTime);

            t2 = setInterval(_t2 => {
                elapsed += 100;
                if (this.isVisible(el)) {
                    clearInterval(t2);
                    clearTimeout(t1);
                    resolve(el);
                }
                if (elapsed >= totalTime) {
                    clearInterval(t2);
                    clearTimeout(t1);
                    resolve(null);
                }
                console.log("waiting for visibility:", elapsed + "ms")
            }, 100);
        });
    }

    isVisible(elem) {
        if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
        const style = getComputedStyle(elem);
        if (style.display === 'none') return false;
        if (style.visibility !== 'visible') return false;
        if (style.opacity < 0.1) return false;
        if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
            elem.getBoundingClientRect().width === 0) {
            return false;
        }
        const elemCenter = {
            x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
            y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
        };
        if (elemCenter.x < 0) return false;
        if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
        if (elemCenter.y < 0) return false;
        if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
        //let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
        // do {
        //     if (pointContainer === elem) return true;
        // } while (pointContainer = pointContainer.parentNode);
        // return false;
        return true
    }

    async waitForElm(selector, step) {
        var f = function (string) {
            return (new Function(`return ${string}`)());
        }

        return new Promise((resolve, reject) => {
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

            var tid = setTimeout(_t => resolve(null), step.waitfor || 1000)
        });
    }

    load(obj) {
        this.data = obj;
    }

    show(items) {
        this.current = null;
        this.nextStep = null;
        this.setOverlay();
        this.classList.add("active");
        // if(!this.current) {
        this.iterator = this.getIterator(items instanceof Array ? items : this.data[items]);
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

    onSkip() {
        this.next(true);
    }

    * getIterator(array) {
        for (var item of array) {
            item.success = false;
            yield item;
            if (item.items) {
                for (let subitem of item.items) {
                    subitem.success = false;
                    yield subitem;
                }
            }
        }
    }

    async next(skip = false) {
        if (skip) {
            if (this?.current?.skipto || this?.current?.next) {
                this.show(this.current.skipto || this.current.next);
                return;
            }
            else {
                this.current = this.nextStep = this.iterator.next().value
            }
        }
        if (this?.current?.onadvance == "valid") {
            if (!this.target.checkValidity()) {
                alert("Invalid Input");
                return;
            }
            else {
                this.current.success = true;
            }
        }
        if (this?.current?.onadvance && !this?.current?.success == true && !skip) {
            alert("Click to continue");
            return;
        }
        if (this?.current?.next) {
            this.show(this.current.next);
            return
        }

        this.current = this.nextStep || this.iterator.next().value;
        this.update();
        var step = this.current;
        if (step) {
            this.unsetTarget();
            var el = await this.setTarget(step);
            if (el) {
                this.setTitle(step.title);
                this.setText(step.text);
                setTimeout(e => this.setPosition(step), 100);
            }
            else {
                console.warn(`'target node' for step not found. Skipping Step "${step.title}"`, step.target, step);
                this.next(true);
                return
            }
        }
        else {
            this.onFinish();
        }
        this.nextStep = this.iterator.next().value;
        this.update();
    }


    update() {
        if (!this.current || (!this.nextStep && !this?.current?.next)) {
            this.btnNext.innerHTML = "Finish"
        }
        else {
            this.btnNext.innerHTML = "Next";
        }
        if (this?.current?.skipto || this?.current?.next && !this.current.onadvance) {
            this.btnSkip.removeAttribute("disabled");
            this.btnSkip.innerHTML = "Skip To: " + (this.current.skipto || this.current.next)
        }
        else {
            this.btnSkip.setAttribute("disabled", true);
            this.btnSkip.innerHTML = "Skip"
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
        var dir = step.vpos || "top";
        this.classList.remove("top", "bottom", "middle");
        this.classList.add(dir)
        if (dir == "top") {
            return target_coords.top - label_coords.height - VOFFSET;
        }
        else if (dir == "bottom") {
            return target_coords.top + target_coords.height + VOFFSET
        }
        else if (dir == "middle") {
            return ((target_coords.top + target_coords.height / 2))
        }
    }

    getHorizontalPositionOn(step, target_coords, label_coords) {
        var dir = step.hpos || "left";
        this.classList.remove("left", "right", "center");
        this.classList.add(dir)
        if (dir == "left") {
            return target_coords.left;
        }
        else if (dir == "right") {
            return ((target_coords.left + target_coords.width) - label_coords.width)
        }
        else if (dir == "center") {
            return ((target_coords.left + target_coords.width / 2) - label_coords.width / 2)
        }
    }

    makeOverlayForTarget(step, el) {
        var coords = el.getBoundingClientRect();
        var d;
        if (!this.target_overlay) {
            d = document.createElement("div");
            d.id = "tour-guide-element-overlay";
            d.style.width = coords.width + "px";
            d.style.height = coords.height + "px";
            d.style.top = coords.top + "px";
            d.style.left = coords.left + "px";
            this.target_overlay = d;
            document.body.append(d);
        }
        else {
            d = this.target_overlay;
            d.style.width = coords.width + "px";
            d.style.height = coords.height + "px";
            d.style.top = coords.top + "px";
            d.style.left = coords.left + "px";
        }
        d.classList.remove("tour-guide-element-overlay-flash");

        if (step.interactive) {
            d.style.pointerEvents = "none";
            d.classList.remove("tour-guide-element-overlay-flash");
            setTimeout(e => d.classList.add("tour-guide-element-overlay-flash"), 300);
            this.hideOverlay();
        }
        else {
            d.style.pointerEvents = "auto";
            d.classList.remove("tour-guide-element-overlay-flash");
            this.showOverlay();
        }

        if(this.optionsTintBtn.classList.contains("active")){
            d.classList.add("less-tint")
        }
        else {
            d.classList.remove("less-tint")
        }

        return d;
    }

    async setTarget(step) {
        this.target = await this.waitForElm(step.target, step);
        if (this.target) {
            var isVisible = await this.waitForVisibility(this.target, step);
            if (!isVisible) { return false }
            this.makeOverlayForTarget(step, this.target);
            this.target.focus && this.target.focus();
            if (step.onadvance && step.onadvance != "valid") {
                let func = async e => {
                    step.success = true;
                    setTimeout(e => this.next(), step.waitfor || 500);
                    this.target.removeEventListener(step.onadvance, func, true);
                };
                this.target.addEventListener(step.onadvance, func, true)
            }

            let target = this.lastTarget = this.target;
            while (target) {
                const style = window.getComputedStyle(target);
                target.originalZ = style.getPropertyValue("z-index");
                target.originalP = style.getPropertyValue("position");
                if (target == this.target) { target.style.zIndex = OVERLAY_ZINDEX + 1; }
                else { target.style.zIndex = "auto"; }
                target.style.position = target.originalP == "static" ? "relative" : target.originalP;
                target.originalPointerEvents = style.getPropertyValue("pointer-events");
                if (target == this.target) {
                    if (step.interactive) {
                        target.style.pointerEvents = "auto"
                    }
                    else {
                        target.style.pointerEvents = "initial"
                    }
                }
                else {
                    target.style.pointerEvents = "initial"
                }
                target = target.parentElement || target?.parentNode?.host;
            }
            return true
        }

        else {
            return false
        }
    }


    unsetTarget() {
        if (this.lastTarget) {
            let target = this.lastTarget;
            while (target) {
                target.style.zIndex = target.originalZ;
                target.style.position = target.originalP;
                target.style.pointerEvents = target.originalPointerEvents || "auto";
                target = target.parentElement || target?.parentNode?.host;
            }
        }
        this.lastTarget = null;
    }
    setTitle(str) {
        var title = str || this.target.getAttribute("data-tour-title");
        this.titleEl.innerHTML = title || "Title Here";
    }

    setText(str) {
        var text = str || this.target.getAttribute("data-tour-text");
        this.textEl.innerHTML = text || "Title Here";
    }

    setOverlay() {
        this.overlay = this.overlay || document.createElement("div");
        this.overlay.id = "tour-guide-overlay";
        document.body.append(this.overlay);
    }

    removeOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }

    hideOverlay() {
        if (this.overlay) {
            this.overlay.style.pointerEvents = "none"
        }
    }
    showOverlay() {
        if (this.overlay) {
            this.overlay.style.pointerEvents = "auto"
        }
    }

    onload(e) {
        // setTimeout(e => {

        // }, 1000)

    }
}

customElements.define('tour-guide', TourGuide);
document.body.append(new TourGuide);