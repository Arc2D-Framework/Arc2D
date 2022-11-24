class TourGuide extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        let template = document.createElement("template");
        template.innerHTML = `
            <style>
                :host {
                    width: 100%;
                    position: fixed;
                    height: 100%;
                    display: block;
                    background: #000000b5;
                    z-index: 100;
                }

                :host label {
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
                  }

                  :host(:hover) label {
                    visibility: visible;
                  }
                  
                  :host label:before {
                    border: 8px solid transparent;
                    content: "";
                    position: absolute;
                  }
                  
                  :host label.bottom:before {
                    top: -16px;
                    border-bottom-color: #fff;
                  }
                  :host label.right:before {
                    right: 16px;
                  }
                  
                  :host label.top:before {
                    bottom: -16px;
                    border-top-color: #fff;
                  }

                  :host label.left:before {
                    left: 20px;
                    border-top-color: #fff;
                  }

                  :host label #help-tour-title {
                    color: black;
                    font-size: 20px;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                  }
                  :host label #help-tour-title:after {
                    content: "\\274C";
                    display: inline-block;
                    float: right;
                    color: black;
                    font-size: 10px;
                    padding: 6px;
                    background: #80808017;
                  }
                  :host label #help-tour-text {
                    max-height: 100px;
                    overflow-y: auto;
                    color: gray;
                  }
                  :host label #help-tour-nav{
                    background: #80808021;
                    padding: 11px;
                    text-align: center;
                    border-radius: 3px;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    margin: 0 !important;
                  }
                  :host label #help-tour-title,
                  :host label #help-tour-text,
                  :host label #help-tour-nav {
                      margin: 10px;
                      text-align: left;
                  }

                  :host label #help-tour-nav button {
                    height: 40px;
                    min-width: 70px;
                    border: 1px solid #8080803b;
                    border-radius: 3px;
                  }

                  :host label #help-tour-nav button.next {
                    background: #4ca76a;
                    color: white;
                  }                  
            </style>
            <label class="top left">
                <h3  id="help-tour-title">Title Here</h3>
                <div id="help-tour-text">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here</div>
                <nav id="help-tour-nav">
                    <button>Previous</button>
                    <button class="next">Next</button>
                </nav>
            </label>
        `;
        
        this.root.appendChild(template.content.cloneNode(true));
    }
    
    connectedCallback() {
        window.tg=this;
        // window.addEventListener("load", e=> this.onload(e), false)
    }

    show() {
        debugger    
        this.label = this.root.querySelector("label");
        var el = document.querySelector("ui-components-switch");
        el.style.zIndex = 101;
        var coords = el.getBoundingClientRect();
        var label_coords = this.label.getBoundingClientRect();
        console.log("coords", coords);
        this.label.style.top = `${coords.top-label_coords.height}px`;
        this.label.style.left = `${coords.left}px`;
    }

    onload(e){
        // setTimeout(e => {

        // }, 1000)
        
    }
}

customElements.define('tour-guide', TourGuide);