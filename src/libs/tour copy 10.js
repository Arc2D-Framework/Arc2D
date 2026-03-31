//v2.6.8

let // ZzFXMicro - Zuper Zmall Zound Zynth - v1.3.1 by Frank Force ~ 1000 bytes
zzfxV=.3,               // volume
zzfxX=new AudioContext, // audio context
zzfx=                   // play sound
(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0
,N=0)=>{let M=Math,d=2*M.PI,R=44100,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,
g=0,H=0,a=0,n=1,I=0,J=0,f=0,h=N<0?-1:1,x=d*h*N*2/R,L=M.cos(x),Z=M.sin,K=Z(x)/4,O=1+K,
X=-2*L/O,Y=(1-K)/O,P=(1+h*L)/2/O,Q=-(h+L)/O,S=P,T=0,U=0,V=0,W=0;e=R*e+9;m*=R;r*=R;t*=
R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;p*=zzfxV;for(h=e+m+r+t+c|0;a<h;k[a++]
=f*p)++J%(100*F|0)||(f=q?1<q?2<q?3<q?Z(g**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2
)%2:1-4*M.abs(M.round(g/d)-g/d):Z(g),f=(l?1-B+B*Z(d*a/l):1)*(f<0?-1:1)*M.abs(f)**D*(a
<e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:(a<h-c?1:(
h-a)/c)*k[a-c|0]/2/p):f,N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0),x=(b+=u+=y)*M.cos(A*
H++),g+=x+x*E*Z(a**5),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=zzfxX.
createBuffer(1,h,R);p.getChannelData(0).set(k);b=zzfxX.createBufferSource();
b.buffer=p;b.connect(zzfxX.destination);b.start()}



let OVERLAY_ZINDEX = 999999999;
class TourGuide extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.stepIndex = -1;
        this.history = [];
        this.historyIndex = -1;
        this.initialDomAttributes = new Map();
        this.isPositioning = false;

        // this.addEventListener("click", e => {
        //     e.stopPropagation();
        //     e.preventDefault();
        // }, false);

        this.isMuted = false;
        this.sounds = {
            "show": new Audio(`data:audio/mp3;base64,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`),
            "error" : new Audio(`data:audio/mp3;base64,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`)
        }

        var hostCss = `
            :host {
                /* Internal defaults pointing to user-specified variables or fallback values */
                --tourguide-default-progress-bg-color: var(--tourguide-progress-bg-color, #3e9ff0);
                --tourguide-default-font-color: var(--tourguide-font-color, #777777);
                --tourguide-default-bg-color: var(--tourguide-bg-color, white);
                --tourguide-default-base-color: var(--tourguide-base-color, #414141);
                --tourguide-default-progress-font-color: var(--tourguide-progress-font-color, white);
                --tourguide-default-border-color: var(--tourguide-border-color, gray);
                --tourguide-default-font-family: var(--tourguide-font-family, inherit);
                --tourguide-default-font-size: var(--tourguide-font-size, 14px);
                --tourguide-default-title-color: var(--tourguide-title-color, var(--tourguide-font-color, #777777));
            }

            :host {
                visibility:hidden;
                opacity:0;
                transform: translate3d(0, 0, 0);
                will-change: translate;
                transition: translate .5s, transform .3s;
                color: var(--tourguide-default-font-color);
            }

            :host(.active) {
                visibility:visible;
                opacity:1;
            }

            :host(.shake) {
                will-change: transform;
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                translate: 0 0 0;
                backface-visibility: hidden;
                perspective: 1000px;
            }

            :host {
                opacity: 0;
                left : 0px; 
                top : 0px;
                position: fixed;
                background-color: var(--tourguide-default-bg-color);
                max-width: 320px;
                min-width: 320px;
                display: block;
                font-family: var(--tourguide-default-font-family);
                font-weight: inherit;
                font-size: var(--tourguide-default-font-size);
                line-height: inherit;
                padding: 11px;
                border: 1px solid var(--tourguide-default-border-color);
                border-radius: 4px;
                box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 50%);
                z-index:${OVERLAY_ZINDEX + 3};
                transition : opacity .5s, transform .3s;
                pointer-events:auto !important;
                will-change:transform;
                transform: translate3d(0px, 0px, 0px);

            }

            :host(.no-controls) #help-tour-nav,
            :host(.no-controls) #progress-bar,
            :host(.no-controls) #help-tour-options{
                display:none !important;
            }

            :host button[disabled] {
                opacity:.2;
                pointer-events:none;
                cursor: not-allowed;
            }

            
            :host .arrow {
                border: 10px solid transparent;
                content: "";
                position: absolute;
                width: 0px;
                border-bottom-color: var(--tourguide-default-border-color);
                border-top-color: #ef000000 !important;
                pointer-events: none;
            }
            :host .arrow::after {
                border: 10px solid transparent;
                content: "";
                position: absolute;
                width: 0px;
                border-bottom-color: var(--tourguide-default-bg-color);
                left: -10px;
                top: -8px;
            }

            :host(.rotate-right) .arrow {
                transform: rotate(90deg);
                top: 20px; /*needs to be dynamically set in setPosition()*/
                left: unset !important;
                right: -20px !important;
                
            }
            :host(.rotate-left) .arrow {
                transform: rotate(-90deg);
                top: 20px;/*needs to be dynamically set in setPosition()*/
                left: -20px !important;
                right: unset !important;
                
            }

            :host(.rotate-up) .arrow {
                transform: rotate(0deg);
                top: -20px;
                left: unset;
                right: 20px;
                
                bottom: unset;
            }

            :host(.rotate-down) .arrow {
                transform: rotate(180deg);
                top: unset;
                left: unset;
                right: 20px;
                
                bottom: -20px;
            }

            :host #help-tour-title {
                color: var(--tourguide-default-title-color);
                font-size: calc(var(--tourguide-default-font-size) *1.35);
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                font-weight: 400;
                margin: 5px 0px 0;
            }
            :host #help-tour-title #step-label {
                font-size: calc(var(--tourguide-default-font-size) * 1.2);
                font-weight: 100;
            }
            :host #help-tour-title > #close-btn {
                display: inline-block;
                float: right;
                color: var(--tourguide-default-font-color);
                font-size: 10px;
                padding: 6px;
                background: color-mix(in srgb, var(--tourguide-default-base-color), var(--tourguide-default-bg-color) 93%);
                cursor: pointer;
                border-radius: 4px;
            }

            :host #tour-container{
                height: 100%;
                display: flex;
                flex-flow: column;
            }

            :host #tour-content {
                overflow-y: auto;
                color: inherit;
                width: 100%;
                font-size: inherit;
                font-weight: 100;
                max-height: 100%;
                height: 100%;
                overflow: hidden;
                margin: 15px 0px;
                overflow-x: auto;
                display: flex;
                overscroll-behavior-x: contain;
                scrollbar-width: none;
                scroll-behavior: smooth;
                scroll-snap-type: x mandatory;
                counter-reset: item;
                padding: 0;
                anchor-name: --carousel;
                box-sizing: border-box;
                scroll-marker-group: after;
                position:relative;
                gap:10px;
                
                &::scroll-marker-group {
                position: fixed;
                position-anchor: --options;
                position-area: center;
                margin: 0px;
                display: none;
                grid-auto-columns: 20px;
                grid-auto-flow: column;
                gap: 8px;
                }

                & > div::scroll-marker {
                content: ' ';
                width: 10px;
                height: 10px;
                background: #e1e1e1;
                border-radius: 50%;
                }

                & > div::scroll-marker:target-current {
                background: #3f9ff0;
                }

                > div {
                scroll-snap-align: center;
                container-type: scroll-state;
                padding: 0;
                display: block;
                width: 100%;
                min-width: 100%;
                }
                
                > div:has(embed) {
                height:300px;
                }
            }

            /*NOTE: Adds border and padding to look better for multiple pieces of content */
            :host #tour-content:has(> *:nth-child(2)) > div {
                background: color-mix(in srgb, var(--tourguide-default-base-color), var(--tourguide-default-bg-color) 93%);
                border: 1px solid 1px solid color-mix(in srgb, #202020, var(--tourguide-default-bg-color) 100%);
                border-radius: 6px;
                align-items: center;
                justify-content: center;
                display: flex;
                flex-flow: row nowrap;
                text-align: center;
                box-sizing: border-box;
            }
            
            /*NOTE: hidden by default; only visible for multiple pieces of content */
            :host #tour-content:has(> *:nth-child(2))::scroll-marker-group {
                display: grid;
            }
            
            :host #tour-content video, :host #tour-content img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                min-width: 100%;
            }

            :host #tour-content.larger-font {
                font-size: 16px;
            }
            :host #help-tour-nav{
                background: linear-gradient(45deg, var(--tourguide-default-bg-color) 57%, #ff000000 53%), color-mix(in srgb, var(--tourguide-default-base-color), var(--tourguide-default-bg-color) 93%);
                padding: 11px;
                text-align: center;
                border-radius: 3px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                margin: 0 !important;
                gap:8px;
                border-top-left-radius:0;
                border-top-right-radius:0;
                border-bottom: 1px solid #ffffff08;
                border-left: 1px solid #ffffff0a;
            }
            :host #help-tour-title,
            :host #tour-content,
            :host #help-tour-nav {
                text-align: left;
            }

            :host #help-tour-nav button {
                height: 40px;
                min-width: 70px;
                border: 1px solid #8080803b;
                border-radius: 3px;
                align-items: center;
                justify-content: center;
                cursor:pointer;
                font-size: var(--tourguide-default-font-size);
                &.label {
                    min-width: fit-content !important;
                    border-radius: 3px !important;
                    font-size: var(--tourguide-default-font-size) !important;
                    padding: 0 10px !important;
                }
                &.last-step {
                    background:#0c7ad7 !important;
                }
            }

            :host #help-tour-nav.iconic button {
                height: 40px;
                min-width: 40px;
                border: 1px solid 1px solid color-mix(in srgb, #202020, var(--tourguide-default-bg-color) 73%);
                border-radius: 50%;
                width: 40px;
                font-size: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                content: "";
            }
            :host #help-tour-nav.iconic button.previous,
            :host #help-tour-nav.iconic button.next {
                content: attr(data-icon);
            }

            :host #help-tour-nav button.previous {
                background: var(--tourguide-default-progress-bg-color);
                color: var(--tourguide-default-progress-font-color);
            }  

            :host #help-tour-nav button.next {
                background: var(--tourguide-default-progress-bg-color);
                color: var(--tourguide-default-progress-font-color);
            }      
            
            :host #help-tour-nav button.skip {
                color: #464646;
                border: 1px solid #cfcfcf;
                &:hover {
                    background: color-mix(in srgb, var(--tourguide-default-base-color), var(--tourguide-default-bg-color) 83%);
                }
            }

            :host #help-tour-options{
                display: flex;
                flex-flow: row nowrap;
                justify-content: end;
                margin-bottom: 0px;
                font-size: 9px;
                gap:4px;
                anchor-name: --options;
            }

            :host #help-tour-options button {
                font-size:inherit;
                font-size: inheritinherit;
                background: color-mix(in srgb, var(--tourguide-default-base-color), var(--tourguide-default-bg-color) 83%);
                border: 0;
                min-width: 24px;
                min-height: 24px;
                color: inherit;
            }

            :host #help-tour-nav button.skip[disabled] {
                opacity: .2;
                pointer-events: none;
                cursor: not-allowed;
                color: white;
            }
            :host #help-tour-options button.active {
                background: #00cf00;
                color: white;
                border: 1px solid gray;
                border-radius: 2px;
            }

            :host #progress-bar {
                position: relative;
                height: fit-content;
                width: 100%;
            }



            div#progress-bar::after {
                position: absolute;
                content: "";
                display: block;
                height: 4px;
                background: color-mix(in srgb, white, var(--tourguide-default-progress-bg-color) 20%);
                width: 100%;
                bottom: 0px;
                z-index: -1;
            }

            :host #progress-bar #counter {
                font-size: 11px;
                width: fit-content;
                background: color-mix(in srgb, var(--tourguide-default-base-color), var(--tourguide-default-progress-bg-color) 93%);
                padding: 2px 6px;
                color: var(--tourguide-default-font-color);
                border-top-left-radius: 3px;
                border-top-right-radius: 3px;
                margin-bottom: -1px;
                color: var(--tourguide-default-progress-font-color);
            }

            :host #progress-bar-fill {
                height: 4px; 
                background: color-mix(in srgb, var(--tourguide-default-base-color), var(--tourguide-default-progress-bg-color) 93%);
                width: 0%; 
                transition: width 0.9s ease; 
            }

            :host button {
                position:relative;
            }
            :host button:after {
                content: " ";
                position: absolute;
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate3d(-50%, -50%, 0);
                width: 0px;
                height: 0px;
                opacity: 0;
                pointer-events: none;
            }
            :host button:hover:after{
                animation: ripple 500ms linear;
                opacity: 1;
                pointer-events: none;
            }

            :host span.ripple {
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                background-color: transparent;
            }

            :host #tour-launch-button {
                right : 20px; 
                bottom  : 20px;
                position: fixed;
                background-color: var(--tourguide-default-bg-color);
                display: block;
                font-family: var(--tourguide-default-font-family);
                font-weight: inherit;
                font-size: var(--tourguide-default-font-size);
                line-height: inherit;
                padding: 11px;
                border: 1px solid var(--tourguide-default-border-color);
                border-radius: 4px;
                box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 50%);
                border-radius: 6px;
                font-size: 12px;
            }
            :host #tour-launch-button.expanded {
                min-width: 200px;
                padding: 12px 16px;
            }

            @keyframes ripple {
                to {
                width: 60px;
                height: 60px;
                background-color: rgba(255, 255, 255, 0.7);
                opacity: 0;
                }
            }

            @keyframes shake {
                10%, 90% {
                translate: -1px 0 0;
                }
                
                20%, 80% {
                translate: 2px 4px 0;
                }
            
                30%, 50%, 70% {
                translate: -4px -4px 0;
                }
            
                40%, 60% {
                translate: 4px 0px 0;
                }
            }
        `

        this.root.innerHTML = `
            <style>
            
            </style>
            <div id="tour-container" 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="help-tour-title" 
            aria-describedby="tour-content" 
            tabindex="-1">
            
             <!-- Arrow/Pointer -->
            <div class="arrow"></div>

            <!-- Title Section -->
            <h3 id="help-tour-title" aria-live="assertive">
                <span id="title-label" aria-live="polite">
                    <div id="tour-title">Employee Management</div>
                    <span id="step-label">Step 1</span>
                </span>
                <span id="close-btn" role="button" tabindex="0" aria-label="Close tour">✕</span>
            </h3>

            <!-- Description Section -->
            <div id="tour-content" aria-live="polite">
                Description Here
            </div>

            <!-- Options Section -->
            <nav id="help-tour-options">
                <button 
                class="option" 
                id="options-tint-level-btn" 
                aria-label="Adjust background tint level">
                ◑
                </button>
                <button 
                class="option" 
                id="options-fontsize-btn" 
                aria-label="Adjust font size">
                Aa
                </button>
            </nav>

            <!-- Progress Bar -->
            <div id="progress-bar" 
                role="progressbar" 
                aria-valuenow="0" 
                aria-valuemin="0" 
                aria-valuemax="100" 
                aria-labelledby="counter">
                <div id="counter" aria-live="polite">0/0</div>
                <div id="progress-bar-fill"></div>
            </div>

            <!-- Navigation Section -->
            <nav id="help-tour-nav" class="iconic">
                <button 
                class="skip" 
                aria-label="Skip to the next step">
                ≡
                </button>
                <span class="fill-space" aria-hidden="true" style="width:100%;"></span>
                <button 
                class="previous" 
                aria-label="Go to the previous step">
                ❮
                </button>
                <button 
                class="next" 
                aria-label="Go to the next step">
                ❯
                </button>
            </nav>
            </div>

        `
        this.injectStyle();
        this.adoptStyleSheets(hostCss);
        // HELP && this.load(HELP)
    }

    adoptStyleSheets(css){
        this._hostSheet = new CSSStyleSheet();
        this._hostSheet.replaceSync(css);
        this.root.adoptedStyleSheets = [...this.root.adoptedStyleSheets, this._hostSheet];
    }

    toNode(strHtml) {
        const template = document.createElement('template');
        template.innerHTML = strHtml.trim();
        return template.content.firstChild;
    }

    //when called after cctor instance, this method will install/inject a launch icon button at bottom-right of webpage
    //when clicked, it will expand itself and show a list of all tours from .json file entries
    async install(options){
        this.install_options = options || {};
        if(this.install_options.data) {
            await this.load(this.install_options.data);
        }
        const button = document.createElement('div');
            button.attachShadow({ mode: 'open' });
        var titlebar = this.toNode(`
            <div style="
                text-align: left;
                display: flex;
                justify-content: space-between;
            " id="title-bar">
                <label>Start Demo</label>
                <i>X</i>
            </div>
        `);
        button.shadowRoot.appendChild(titlebar);
        //convert name like 'tooltip-1' to 'Tooltip 1'
        function prettifyName(name) {
            return name.replace(/(?:^|-)(\w)/g, (_, c) => ` ${c.toUpperCase()}`).trim();
        }

        var style = new CSSStyleSheet();
            style.replaceSync(`
                :host {
                    /* Internal defaults pointing to user-specified variables or fallback values */
                    --tourguide-default-progress-bg-color: var(--tourguide-progress-bg-color, #3e9ff0);
                    --tourguide-default-font-color: var(--tourguide-font-color, #777777);
                    --tourguide-default-bg-color: var(--tourguide-bg-color, white);
                    --tourguide-default-base-color: var(--tourguide-base-color, #414141);
                    --tourguide-default-progress-font-color: var(--tourguide-progress-font-color, white);
                    --tourguide-default-border-color: var(--tourguide-border-color, gray);
                    --tourguide-default-font-family: var(--tourguide-font-family, inherit);
                    --tourguide-default-font-size: var(--tourguide-font-size, 14px);
                    --tourguide-default-title-color: var(--tourguide-title-color, var(--tourguide-font-color, #777777));
                    width: fit-content;
                }
                :host {
                    color: var(--tourguide-default-font-color);
                    background-color: var(--tourguide-default-bg-color);
                    font-family: var(--tourguide-default-font-family);
                    font-size: var(--tourguide-default-font-size);
                    border: 1px solid var(--tourguide-default-border-color);
                    padding: 10px;
                    transition: all 0.3s ease;
                }
                :host(.expanded) {
                    min-width: 220px;
                }
                :host #title-bar {
                    text-align: left;
                    display: flex;
                    justify-content: space-between;
                }
                :host #tour-launch-button {
                    cursor: pointer;
                }

                :host #title-bar i {
                    cursor: pointer;
                    display: none;
                }
                :host(.expanded) #title-bar i {
                    display: inline;
                }
                :host ul li {
                    background: #3e3e3e;
                    padding: 5px 12px;
                    cursor: pointer;
                }
                :host ul li:hover {
                    background: #234671;
                }
                :host ul {
                    display: none;
                    list-style: none;
                    padding: 0;
                    text-align: left;
                    flex-flow: column;
                    gap: 1px;
                }

                :host(.expanded) ul {
                    display: flex;
                }
            `);
        button.shadowRoot.adoptedStyleSheets.push(style);
        button.id = 'tour-launch-button';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.addEventListener('click', (e) => this.onShowTourListing(e, button));
        document.body.appendChild(button);
        document.body.append(this);

        if(this.install_options.show_tour_listing) {
            button.classList.add("expanded");
            //populate tour listing inside the button from this.data
            const tourList = document.createElement('ul');
            debugger
            for (var key in this.data) {
                const tour = this.data[key];
                const listItem = document.createElement('li');
                listItem.textContent = prettifyName(key);
                listItem.addEventListener('click', () => this.show(key));
                tourList.appendChild(listItem);
            }
            button.shadowRoot.appendChild(tourList);
        }
    }

    onShowTourListing(event, button) {
        button.classList.toggle("expanded");
        // if this.install_options are defined, use them
    }

    playSound(type) {
        switch (type) {
            case 'success':
                if (this.isMuted) return; // Handle mute state
                zzfx(...[.2,0,564,.02,.01,.09,1,1.8,,3,132,.09,,.1,,,,.9]); // Pickup 190
                // zzfx(...[.9,,412,.03,.1,.09,,1.4,,,403,.1,.07,,,,,.67,.01,,-891]); // Pickup 
                //vloume
                // this.sounds["show"].volume = 0.2;
                // this.sounds["show"].currentTime = 0; // Reset to start for fast repeat
                // this.sounds["show"].play().catch(() => {}); // Handle browser autoplay restrictions
                break;
            case 'show':
                if (this.isMuted) return; // Handle mute state
                // zzfx(...[.9,,412,.03,.1,.09,,1.4,,,403,.1,.07,,,,,.67,.01,,-891]); // Pickup 
                //vloume
                this.sounds["show"].volume = 0.2;
                this.sounds["show"].currentTime = 0; // Reset to start for fast repeat
                this.sounds["show"].play().catch(() => {}); // Handle browser autoplay restrictions
                break;
            case 'error':
                if (this.isMuted) return;
                this.sounds["error"].volume = 0.2;
                this.sounds["error"].currentTime = 0;
                this.sounds["error"].play().catch(() => {});
                break;
            default:
                break;
        }
    }

    createRipple(event) {
        return;
        const button = event.currentTarget;
      
        const circle = document.createElement("span");
        var bounds = button.getBoundingClientRect();
        const diameter = Math.max(bounds.width, bounds.height);
        const radius = diameter / 2;
      
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - bounds.left - radius}px`;
        circle.style.top = `${event.clientY - bounds.top - radius}px`;
        circle.classList.add("ripple");
      
        const ripple = button.getElementsByClassName("ripple")[0];
      
        if (ripple) {
          ripple.remove();
        }
      
        button.appendChild(circle);
    }

    isLastStep() {
        return this.historyIndex === this.history.length - 1;
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
                pointer-events:auto;
                inset:0;
                cursor: not-allowed;
            }
            #tour-guide-element-overlay{
                position: fixed;
                z-index: ${OVERLAY_ZINDEX + 2};
                border: 3px solid #00ff4c;
                box-sizing: border-box;
                box-shadow: rgb(153 255 119 / 56%) 0px 0px 20px 4px, rgb(0 0 0 / 30%) 0px 0px 0px 5000px;
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

             .pulse {
                height: 24px;
                width: 24px;
                background: linear-gradient(#8a82fb, #407ed7);
                position: absolute;
                border-radius: 50%;
                font-size: 50px;
                color: #ffffff;
                position-area: center;
                z-index: 10;
                place-items: center;
                place-content: center;
                display: flex;
                pointer-events: none;
            }

            .pulse:after,
            .pulse:before {
                content: "";
                position: absolute;
                height: 100%;
                width: 100%;
                background-color: #8a82fb;
                border-radius: 50%;
                z-index: -1;
                opacity: 0.7;
                animation: pulse 2s 1s ease-out infinite;
            }

            .pulse:before {
                animation: pulse 2s ease-out infinite;
            }

            @keyframes pulse {
                100% {
                    transform: scale(1.7);
                    opacity: 0;
                }
            }
        `;

        document.head.appendChild(style);
    }

    shake(){
        this.classList.add("shake");
        // this.fx_error.play();
        setTimeout(e => this.classList.remove("shake"), 600);
    }

    connectedCallback() {
        window.tg = window.tourguide = this;
        window.addEventListener('keydown', e=>this.onHandleKeydown(e), true);
        this.container = this.root.querySelector('#tour-container');
        // this.root.addEventListener('keydown', this.onHandleKeydown.bind(this));
        this.titleEl = this.root.querySelector("h3 #title-label");
        this.progress = this.root.querySelector("#progress-bar");
        this.help_tour_options = this.root.querySelector("#help-tour-options");
        this.counter = this.root.querySelector("#counter");
        this.nav_button_bar = this.root.querySelector("#help-tour-nav");
        this.contentEl = this.root.querySelector("#tour-content");
        this.btnNext = this.root.querySelector("button.next");
        this.btnNext.addEventListener("click", e => this.onNext(e), false);
        this.btnPrevious = this.root.querySelector("button.previous");
        this.btnPrevious.addEventListener("click", e => this.onPrevious(e), false);
        this.closeBtn = this.root.querySelector("#help-tour-title #close-btn");
        this.optionsFontsizeBtn = this.root.querySelector("button#options-fontsize-btn");
        this.optionsFontsizeBtn.addEventListener("click", e => this.onToggleFontSize(e), false);

        this.optionsTintBtn = this.root.querySelector("button#options-tint-level-btn");
        this.optionsTintBtn.addEventListener("click", e => this.onToggleTint(e), false);

        this.closeBtn.addEventListener("click", e => this.onDismiss(e), false);
        window.addEventListener("resize", e=> this.onResize(e), true)
        // ✅ Automatically restore tour state after navigation
        this.restoreState();
    }

  
    onHandleKeydown(e) {
        if (!this.isRunning) return;
    
        const focusableElements = this.root.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    
        if (focusableElements.length === 0) return;
    
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
    
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab → Go back
                if (this.root.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab → Go forward
                if (this.root.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    
        switch (e.key) {
            case 'ArrowRight': // → Next step
                this.next();
                break;
            case 'ArrowLeft': // ← Previous step
                this.previous();
                break;
            case 'Escape': // Esc → Exit tour
                this.onFinish();
                break;
            default:
                break;
        }
    }
    
    onDismiss(e) {
        this.onFinish();
        this.triggerElement?.focus();
    }

    onResize(){
        if(this.current && this.isRunning) {
            requestAnimationFrame(() => {
                this.setPosition(this.current);
                this.setTarget(this.current);
            });
        }
    }

    onToggleFontSize() {
        this.contentEl.classList.toggle("larger-font");
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
        if (!(elem instanceof Element)) throw Error('elem is not an element.');
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
            var elm = /\.querySelector/.test(selector) ? f(selector) : document.querySelector(selector);
            if (elm) {
                return resolve(elm);
            }

            const observer = new MutationObserver(mutations => {
                var elm = /\.querySelector/.test(selector) ? f(selector) : document.querySelector(selector);
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

    async load(obj) {
        if(typeof obj == "object") {
            this.data = obj;
            this.setHighlights();
        }
        else if(this.isValidUrl(obj)){
            const response = await fetch(obj);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            await this.load(data);
        }
        else {
            console.warn(`TourGuide: Invalid object or URL provided.`);
        }
    }


    async show(items, index = null) {
        this.currentTourKey = typeof items === "string" ? items : null;
        document.body.classList.add('tour-active');
        // !this.initialDomAttributes.size && this.setDomAttributes();
    
        items = items instanceof Array ? items : this.data[items];
        if (!items) {
            console.warn(`TourGuide: Tour "${items}" not found.`);
            return;
        }
        items = this.flattenSteps(items);
    
        this.activeTour = items;
        this.history = [...items]; // ✅ This should populate history[]
        // this.historyIndex = index ?? -1;
        this.historyIndex = index !== null ? Math.max(0, index - 1) : -1; // ✅ Make it one-based

        this.current = null;
        // this.nextStep = null;
    
        this.setBodyOverflow();
        this.setOverlay();
        this.showOverlay();
    
        this.isRunning = true;
        index > 0 ? await this.restore(index) : await this.next();
        this.playSound('show');
    }

    async restore(index) {
        if (index > 0) {
            const allSteps = this.flattenSteps(this.activeTour);
            if (index <= allSteps.length) {
                this.historyIndex = index - 1;
                this.current = allSteps[this.historyIndex];
            } else {
                console.warn(`TourGuide: Invalid starting index ${index}`);
                return;
            }
        }

        if (this.current) {
            await this.unsetTarget();
            await this.sleep(100);
            await this._goToIndex(this.historyIndex);
        } else {
            this.next();
        }
    }
    
    
    
    
    shouldRedirect(targetUrl) {
        if (targetUrl) {
            const current = new URL(window.location.href, window.location.origin);
            const target = new URL(targetUrl, window.location.origin);
            return current.pathname != target.pathname;
        }
        return false;
    }

    isValidUrl(value) {
        if (typeof value !== 'string') return false;
    
        // ✅ Absolute URL (http, https, www)
        const absoluteUrlPattern = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
    
        // ✅ Relative URL (./) or Root-Relative URL (/)
        const relativeUrlPattern = /^(\.?\/|\/)[^\s?#].[^\s]*$/;
    
        return absoluteUrlPattern.test(value) || relativeUrlPattern.test(value);
    }

    

    hide() {
        this.hideOverlay();
        this.removeOverlay();
        this.classList.remove("active");
    }


    onFinish() {
        this.isLastStep() && this.playSound("success")
        this.unsetTarget();
        this.resetDomAttributes();
        this.initialDomAttributes.clear();
        this.resetBodyOverflow();
        this.hide();
        this.removeTargetOverlay();
    
        if (this.onReturnToCaller) {
            this.current = null;
            this.onReturnToCaller();
        }
    
        this.current = null;
        this.isRunning = false;
        this.history = [];
        this.historyIndex = -1;
        this.clear();
        // this.nextStep = null; // ✅ Clean reset after finishing
    }

    removeTargetOverlay() {
        this.target_overlay && this.target_overlay.remove();
        this.target_overlay = null;
    }

    setDomAttributes(targetEl) {
        // this.triggerElement = document.activeElement;

        // document.querySelectorAll('body > *:not(tour-guide)').forEach(el => {
            // ✅ Skip <html> and <body>
            if (targetEl === document.body || targetEl === document.documentElement) return;

            // ✅ Store original attributes (including z-index, position, pointer-events)
            this.initialDomAttributes.set(targetEl, {
                style : targetEl.getAttribute('style'),
                tabindex: targetEl.getAttribute('tabindex'),
                ariaHidden: targetEl.getAttribute('aria-hidden'),
                zIndex: targetEl.style.zIndex || window.getComputedStyle(targetEl).zIndex,
                position: targetEl.style.position || window.getComputedStyle(targetEl).position,
                pointerEvents: targetEl.style.pointerEvents || window.getComputedStyle(targetEl).pointerEvents
            });
    
            // ✅ Apply attributes only to content/interactive elements
            // targetEl.setAttribute('aria-hidden', 'true');
            // targetEl.setAttribute('tabindex', '-1');
            // targetEl.setAttribute('inert', '');
        // });
    
        // document.body.classList.add('tour-active');
    }
    
    

    resetDomAttributes(el = null) {
        if (el) {
            const attrs = this.initialDomAttributes.get(el);
            if (attrs) {
                // ✅ Restore aria-hidden
                if (attrs.ariaHidden !== undefined && attrs.ariaHidden !== null) {
                    el.setAttribute('aria-hidden', attrs.ariaHidden);
                } else {
                    el.removeAttribute('aria-hidden');
                }
    
                // ✅ Restore tabindex
                if (attrs.tabindex !== undefined && attrs.tabindex !== null) {
                    el.setAttribute('tabindex', attrs.tabindex);
                } else {
                    el.removeAttribute('tabindex');
                }
    
                // ✅ Restore inert
                el.removeAttribute('inert');
    
                // ✅ Restore z-index, position, and pointer-events
                // el.style.zIndex = attrs.zIndex || "";
                // el.style.position = attrs.position || "";
                // el.style.pointerEvents = attrs.pointerEvents || "";
                el.setAttribute('style', attrs.style);
                // ✅ Clean up stored attributes
                // this.initialDomAttributes.delete(el);
            }
            return;
        }
    

        // ✅ Reset for all stored elements
        this.initialDomAttributes.forEach((attrs, element) => {
            var r = this.initialDomAttributes;
            if (attrs.ariaHidden !== undefined && attrs.ariaHidden !== null) {
                element.setAttribute('aria-hidden', attrs.ariaHidden);
            } else {
                element.removeAttribute('aria-hidden');
            }
    
            if (attrs.tabindex !== undefined && attrs.tabindex !== null) {
                element.setAttribute('tabindex', attrs.tabindex);
            } else {
                element.removeAttribute('tabindex');
            }
    
            element.removeAttribute('inert');
    
            // element.style.zIndex = attrs.zIndex || "";
            // element.style.position = attrs.position || "";
            // element.style.pointerEvents = attrs.pointerEvents || "";
            attrs.style && element.setAttribute('style', attrs.style);
        });
    
        this.initialDomAttributes.clear();
    }
    

    flattenSteps(data) {
        let flat = [];
        if (Array.isArray(data)) {
            for (const step of data) {
                flat.push(step);
                if (step.items) flat = flat.concat(this.flattenSteps(step.items));
            }
        }
        return flat;
    }       

    async next() {
        if (!this.isRunning || this.isPositioning) return;

        if (!this._canAdvance()) return;

        // Handle cross-page navigation via step.next URL
        const nextUrl = this.current?.next;
        if (nextUrl && this.isValidUrl(nextUrl) && this.shouldRedirect(nextUrl)) {
            sessionStorage.setItem('activeTourKey', this.currentTourKey);
            sessionStorage.setItem('activeTourStepIndex', this.historyIndex + 1);
            window.location.href = nextUrl;
            return;
        }

        if (this.historyIndex >= this.history.length - 1) {
            this.onFinish();
            return;
        }

        await this._goToIndex(this.historyIndex === -1 ? 0 : this.historyIndex + 1);
    }

    _canAdvance() {
        const step = this.current;
        if (!step?.onadvance || step.success) return true;

        if (step.onadvance === 'valid') {
            if (!this.target?.checkValidity()) {
                this.shake();
                this.playSound('error');
                setTimeout(() => { alert(this.target.validationMessage); this.target?.focus(); }, 100);
                return false;
            }
            step.success = true;
            return true;
        }

        if (step.onadvance !== 'blur') {
            this.shake();
            this.playSound('error');
            setTimeout(() => this.target?.focus(), 100);
            return false;
        }

        return true;
    }

    async _goToIndex(index) {
        if (this.current) this.current.success = false;
        this.unsetTarget();
        this.historyIndex = index;
        this.current = this.history[index];
        this.current.success ??= false;

        const el = await this.setTarget(this.current);
        if (!el) {
            console.warn(`Target not found for step: "${this.current.title}"`);
            return;
        }

        await this.setStep(this.current);
        this.update();
        setTimeout(() => this.classList.add('active'), 200);
    }

    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async previous() {
        if (!this.isRunning || this.isPositioning || this.historyIndex <= 0) return;
        await this._goToIndex(this.historyIndex - 1);
    }
    
    
    

    async setStep(step) {
        this.clear();
        this.setOptions(step);
        await this.setContent(step.content, step.contentType);
        await this.setPosition(step);
        this.playSound('step');
        this.setTitle(step.title);
        
    }

    setOptions(step) {
        if (step.options) {
            if (step?.options?.dismissable) {
                this.overlay.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.onDismiss(e);
                }, true);
            }
            if (!step?.options?.controls) {
                this.classList.add("no-controls");
            }
            else {
                this.classList.remove("no-controls");
            }
        }
        else{            
            this.classList.remove("no-controls");
        }
    }

    setHighlights() {
        // - Find all elements that have highlight:true in options{}
        // - Attach crypto.randomUUID() to element as anchor name
        // - Set a new highlight, and anchor to target

        var count = 0;
        for(var key in this.data) {
            count=0;
            var tour = this.data[key];
            for(let item of tour){
                count++;
                // if (!item.options) continue;
                if (item.options?.highlight) {
                    const element = document.querySelector(item.target);
                    if (element) {
                        const anchorName = `--${crypto.randomUUID().slice(0, 12)}`; //
                        element.style.anchorName = anchorName;
                        element.setAttribute('anchor-name', anchorName);
                        var pulse = document.createElement('div');
                        pulse.classList.add('pulse');
                        document.body.appendChild(pulse);
                        pulse.style.positionAnchor = anchorName;
                        pulse.style.animation = "pulse 2s infinite";
                    }   
                }
                if(item.activator) {
                    const element = document.querySelector(item.target);
                    if (element) {
                        var index = count;
                        const anchorName = `--${crypto.randomUUID().slice(0, 12)}`; //
                        element.style.anchorName = anchorName;
                        element.setAttribute('anchor-name', anchorName);
                        var pulse = document.createElement('div');
                        pulse.classList.add('pulse');
                        document.body.appendChild(pulse);
                        pulse.style.positionAnchor = anchorName;
                        pulse.style.animation = "pulse 2s infinite";
                        pulse.style.pointerEvents = "auto";
                        
                        // Fallback for positioning
                            // const rect = element.getBoundingClientRect();
                            // const parentRect = this.getBoundingClientRect(); // If appended to the component
                            // pulse.style.position = "absolute";
                            // pulse.style.top = `${rect.top}px`; // Center vertically
                            // pulse.style.left = `${rect.left}px`; // Center horizontally
                            // pulse.style.zIndex = "10";
                            // pulse.style.animation = "pulse 2s infinite";
                        //END

                        pulse.addEventListener("click", e => {
                            debugger
                            e.stopPropagation();
                            e.preventDefault();
                            this.show(key, index);
                        }, {
                            capture: true
                        });
                    }   
                }
            }
        }
    }


    update() {
        // console.log("isLastStep", this.isLastStep());
        const hasNextStep = 
            this.historyIndex < this.history.length - 1 || 
            !!this.current?.next;

        if(this?.current?.nextLabel || this?.current?.prevLabel) {
            // this.nav_button_bar.classList.remove("iconic");
            /*if (!this.current || !hasNextStep) {
                this.btnNext.innerHTML = this.current?.nextLabel || "OK";
            } else {
                this.btnNext.innerHTML = this.current?.nextLabel || "Next";
            }
        
            this.btnPrevious.innerHTML = this.current?.prevLabel || "Previous";*/
            if(this?.current?.nextLabel) {
                this.btnNext.innerHTML = this.current?.nextLabel;
                this.btnNext.classList.add("label")
            }
        }
        else {
            this.btnNext.classList.remove("label");
            this.btnPrevious.classList.remove("label")
            // this.nav_button_bar.classList.add("iconic");
            this.btnNext.innerHTML = "❯";
            this.btnPrevious.innerHTML = "❮";
        }

        if(this.isLastStep()){
            this.btnNext.classList.add("last-step");
        }
        else{
            this.btnNext.classList.remove("last-step");
        }
        // this.btnSkip.innerHTML = this.current?.skipLabel || "Skip";
    
        // Hide buttons if label is set to null
        this.btnNext.style.display = this.current?.nextLabel === null ? "none" : "inline-flex";
        this.btnPrevious.style.display = this.current?.prevLabel === null ? "none" : "inline-flex";

        this.btnPrevious.disabled = this.historyIndex <= 0;
    

        const totalSteps = this.flattenSteps(this.activeTour).length;
        const currentStep = this.historyIndex + 1;
    
        const progress = totalSteps 
            ? (currentStep / totalSteps) * 100 
            : 0;
    
        this.root.querySelector('#progress-bar-fill').style.width = `${progress}%`;
    
        // Update step counter (if added)
        this.counter.textContent = `${currentStep} / ${totalSteps}`;
        
        this.progress.setAttribute('aria-valuenow', progress);
        this.progress.setAttribute('aria-valuetext', `${currentStep} of ${totalSteps} steps complete`);
        this.btnPrevious.setAttribute('aria-disabled', this.historyIndex <= 0 ? "true" : "false");
    }
    
    

    onNext(e) {
        this.createRipple(e)
        this.next();
    }

    onPrevious(e) {
        this.createRipple(e)
        this.previous()
    }


    setPosition(step) {
        return new Promise((resolve) => {
            if (!step || !this.target) return;
        
            // ✅ Force clear previous animation state
            if (this.positioningTimeout) clearTimeout(this.positioningTimeout);
            this.isPositioning = true;
        
            const padding = 8;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
        
            let targetCoords = this.target.getBoundingClientRect();
            let labelCoords = this.getBoundingClientRect();
        
            let finalVpos = step.vpos || "top";
            let finalHpos = step.hpos || "left";
        
            // ✅ Calculate initial positions
            let x = this.getHorizontalPositionOn({ hpos: finalHpos }, targetCoords, labelCoords);
            let y = this.getVerticalPositionOn({ vpos: finalVpos }, targetCoords, labelCoords);
        
            let isHorizontal = false;
        
            // ✅ Handle limited vertical space → Switch to horizontal alignment if needed
            if (
                labelCoords.height > viewportHeight || 
                y + labelCoords.height + padding > viewportHeight || 
                y < padding
            ) {
                console.log("Switching to horizontal alignment...");
        
                if (targetCoords.left + labelCoords.width + padding < viewportWidth) {
                    // Position to the right of target
                    x = targetCoords.left + targetCoords.width + padding;
                    finalHpos = "right";
                    isHorizontal = true;
                } else if (targetCoords.left - labelCoords.width - padding > 0) {
                    // Position to the left of target
                    x = targetCoords.left - labelCoords.width - padding;
                    finalHpos = "left";
                    isHorizontal = true;
                }
        
                // Adjust vertical position within viewport
                y = Math.max(padding, Math.min(y, viewportHeight - labelCoords.height - padding));
            } else {
                // ✅ Vertical alignment fallback
                if (finalVpos === "top" && (y + labelCoords.height + padding > viewportHeight)) {
                    finalVpos = "bottom";
                    y = targetCoords.top - labelCoords.height - padding;
                } else if (finalVpos === "bottom" && y < padding) {
                    finalVpos = "top";
                    y = targetCoords.top + targetCoords.height + padding;
                }
                y = Math.max(padding, Math.min(y, viewportHeight - labelCoords.height - padding));
            }
        
            // ✅ Horizontal flip if needed
            if (finalHpos === "left" && (x + labelCoords.width + padding > viewportWidth)) {
                finalHpos = "right";
                x = this.getHorizontalPositionOn({ hpos: finalHpos }, targetCoords, labelCoords);
            } else if (finalHpos === "right" && x < padding) {
                finalHpos = "left";
                x = this.getHorizontalPositionOn({ hpos: finalHpos }, targetCoords, labelCoords);
            } else if (finalHpos === "center") {
                if (x < padding) {
                    finalHpos = "left";
                    x = this.getHorizontalPositionOn({ hpos: finalHpos }, targetCoords, labelCoords);
                } else if (x + labelCoords.width + padding > viewportWidth) {
                    finalHpos = "right";
                    x = this.getHorizontalPositionOn({ hpos: finalHpos }, targetCoords, labelCoords);
                }
            }
        
            x = Math.max(padding, Math.min(x, viewportWidth - labelCoords.width - padding));
        
            // ✅ Apply calculated position
            this.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
        
            // ✅ Clean up previous positioning classes
            this.classList.remove("top", "bottom", "left", "right", "center", "rotate-left", "rotate-right", "rotate-down", "rotate-up");
        
            if (isHorizontal) {
                // ✅ Horizontal alignment → Use rotation class
                if (finalHpos === "left") {
                    this.classList.add("rotate-right");
                } else if (finalHpos === "right") {
                    this.classList.add("rotate-left");
                }
            } else {
                // ✅ Vertical alignment
                // this.classList.add(finalVpos);
                // this.classList.add(finalHpos);
                if (finalVpos == "top") {
                    this.classList.add("rotate-down");
                } else if (finalVpos == "bottom") {
                    this.classList.add("rotate-up");
                }
            }
        
            // ✅ Handle dynamic arrow positioning
            const arrow = this.root.querySelector('.arrow');
            if (arrow) {
                if (isHorizontal) {
                    // 🔥 Horizontal positioning → Center arrow vertically
                    const arrowTop = Math.max(
                        10,
                        Math.min(labelCoords.height - 30, targetCoords.top + targetCoords.height / 2 - y - 8)
                    );
                    arrow.style.top = `${arrowTop}px`;
                    arrow.style.left = finalHpos === "left" ? '' : '-20px';
                    arrow.style.right = finalHpos === "right" ? '' : '-20px';
                } else {
                    // ✅ Vertical positioning → Center arrow horizontally
                    const targetMidX = targetCoords.left + (targetCoords.width / 2);
                    const dialogOffsetX = targetMidX - x;
        
                    const arrowHalfWidth = 10;
                    const adjustedArrowPosX = dialogOffsetX - arrowHalfWidth;
        
                    // Clamp arrow within dialog boundaries
                    const minArrowX = 15;
                    const maxArrowX = labelCoords.width - 15;
                    const arrowPosX = Math.max(minArrowX, Math.min(adjustedArrowPosX, maxArrowX));
        
                    arrow.style.left = `${arrowPosX}px`;
                    arrow.style.top = '';
                }
            }
        
            // ✅ Clear stuck state after animation finishes
            this.addEventListener('transitionend', () => {
                this.isPositioning = false;

                resolve();
            }, { once: true });
        
            // ✅ Safety timeout (prevents hanging state)
            this.positioningTimeout = setTimeout(() => {
                this.isPositioning = false;
                resolve();
            }, 300);
        })
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
            // ✅ Constrain overlay size to viewport
            d.style.maxWidth = `${window.innerWidth}px`;
            d.style.maxHeight = `${window.innerHeight}px`;
            document.body.append(d);
        } else {
            d = this.target_overlay;
            d.style.width = coords.width + "px";
            d.style.height = coords.height + "px";
            d.style.top = coords.top + "px";
            d.style.left = coords.left + "px";
        }
    
        d.classList.remove("tour-guide-element-overlay-flash");
    
        // ✅ Block interaction with all other elements
        document.body.style.pointerEvents = "none";
    
        if (step.interactive) {
            el.style.pointerEvents = "auto"; // ✅ Allow interaction with target
            d.style.pointerEvents = "none"; // ✅ Overlay itself should not be clickable
            setTimeout(() => d.classList.add("tour-guide-element-overlay-flash"), 300);
        } else {
            el.style.pointerEvents = "none"; // ✅ Disable target if not interactive
            d.style.pointerEvents = "auto"; // ✅ Allow overlay to receive click events
        }
    
        if (this.optionsTintBtn.classList.contains("active")) {
            d.classList.add("less-tint");
        } else {
            d.classList.remove("less-tint");
        }
    
        return d;
    }
    

    

    setBodyOverflow() {  
        const style = window.getComputedStyle(document.body);
        var originalOverflow = style.getPropertyValue("overflow");
        document.body.originalOverflow = originalOverflow;
        document.body.style.overflow = "hidden";
    }

    resetBodyOverflow() { 
        document.body.style.overflow = document.body.originalOverflow||"initial";
        document.body.originalOverflow = null;
    }

    async setTarget(step) {
        if(!step) return;
        this.target = await this.waitForElm(step.target, step);
        if (this.target) {
            this.setDomAttributes(this.target);
            const computedStyle = window.getComputedStyle(this.target);
            if (computedStyle.overflow !== 'hidden') { // ✅ Fix overflow check
                this.target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });
            }            
            var isVisible = await this.waitForVisibility(this.target, step);
            if (!isVisible) { return false }
            
            if (step.interactive) {
                // ✅ Skip if target is <html> or <body>
                if (this.target !== document.documentElement && this.target !== document.body) {
                    this.target.removeAttribute('aria-hidden');
                    this.target.removeAttribute('inert');
                }
    
                // ✅ Walk up the parent chain and remove aria-hidden from ancestors
                let parent = this.target.parentElement;
                while (parent && parent !== document.body && parent !== document.documentElement) {
                    parent.removeAttribute('aria-hidden');
                    parent.removeAttribute('inert');
                    parent = parent.parentElement;
                }
            }


            this.makeOverlayForTarget(step, this.target);
            this.target.focus && this.target.focus();
            if (step.onadvance && step.onadvance != "valid") {
                let func = async e => {
                    step.success = true;
                    setTimeout(e => this.next(), step.waitfor || 100);
                    this.target.removeEventListener(step.onadvance, func, true);
                };
                
                // this.target.addEventListener(step.onadvance, func, true)
                this.target.addEventListener(step.onadvance, func, { once: true });
            }

            // ✅ Apply stored original values (if present)
            const storedAttrs = this.initialDomAttributes.get(this.target);
            if (storedAttrs) {
                this.target.style.zIndex = OVERLAY_ZINDEX + 1;
                this.target.style.pointerEvents = step.interactive ? "auto" : "none";
                if (storedAttrs.position === "static") {
                    this.target.style.position = "relative";
                }
            }
            
            return this.target;
        }

        else {
            return false
        }
    }


    // unsetTarget() {
    //     let target = this.target;
    //     while (target) {
    //         // ✅ Restore all state using resetDomAttributes()
    //         this.resetDomAttributes(target);

    //         // ✅ When moving to next step, hide target (if interactive)
    //         if (target !== document.documentElement && target !== document.body) {
    //             target.setAttribute('aria-hidden', 'true');
    //             target.setAttribute('inert', '');
    //         }

    //         // ✅ Walk up the parent chain but skip <body> and <html>
    //         let parent = target.parentElement;
    //         while (parent && parent !== document.body && parent !== document.documentElement) {
    //             parent.setAttribute('aria-hidden', 'true');
    //             parent.setAttribute('inert', '');
    //             parent = parent.parentElement;
    //         }

    //         target = target.parentElement || target?.parentNode?.host;
    //     }
    // }
    unsetTarget() {
        let node = this.target;
        // Walk up and restore any elements we modified (don't re-set inert/aria-hidden)
        while (node) {
            // restore this node if we saved it
            this.resetDomAttributes(node);

            // move to parent/host (support shadow hosts)
            node = node.parentElement || node?.parentNode?.host;
        }

        // clear current target ref
        this.target = null;
    }
        
    getTourTitle() {
        return this.currentTourKey;
    }

    
    setTitle(str) {
        var title = str || this.target.getAttribute("data-tour-title");
        var tourTitleEl = this.titleEl.querySelector("#tour-title");
        var stepLabelEl = this.titleEl.querySelector("#step-label");

        tourTitleEl.textContent = this.getTourTitle();
        stepLabelEl.textContent = title;
    }

    // setContent(str) {
    //     var text = str || this.target.getAttribute("data-tour-text");
    //     this.contentEl.innerHTML = text || "Title Here";
    // }
    
    getContentType(content, type = null, ){
        if (!type && typeof content === 'string') {
            if (content.startsWith('<speak>')) type = 'ssml';
            else if (content.match(/\.(jpeg|jpg|png|gif)$/)) type = 'image';
            else if (content.match(/\.(mp4|webm)$/)) type = 'video';
            else if (content.match(/\.(mp3|wav)$/)) type = 'audio';
            else if (content.match(/\.pdf$/)) type = 'pdf';
            else if (content.startsWith('<') && content.endsWith('>')) type = 'html';
            else type = 'text';
        }
        return type;
    }

    clear() {
        this.contentEl.innerHTML = '';
    }
    
    setContent(content, type = null) {
        return new Promise((resolve) => {
            const container = this.contentEl;

            var promises=[];
            if(content instanceof Array) {
                for(let item of content) {
                    type = this.getContentType(item);
                    promises.push(this.setContent(item, type));
                }
                Promise.all(promises).then(() => resolve());
            } 
            else {
                type = this.getContentType(content, type);
                switch (type) {
                    case 'text': {
                        var div = document.createElement("div");
                            div.innerHTML = content;
                            div.focus()
                        container.appendChild(div);
                        requestAnimationFrame(resolve);
                        break;
                    }
        
                    case 'image': {
                        const img = new Image();
                        img.src = content;
                        img.onload = () => resolve();
                        img.onerror = () => resolve(); // Avoid breaking on load failure
                        var div = document.createElement("div");
                        div.appendChild(img);
                        container.appendChild(div);
                        break;
                    }
        
                    case 'video': {
                        const video = document.createElement('video');
                        video.src = content;
                        video.autoplay = false;
                        video.controls = true;
                        var div = document.createElement("div");
                        div.appendChild(video);
                        container.appendChild(div);
        
                        video.addEventListener('loadedmetadata', () => resolve());
                        video.onerror = () => resolve(); // Handle broken links gracefully
                        break;
                    }
        
                    case 'audio': {
                        const audio = document.createElement('audio');
                        audio.src = content;
                        audio.controls = true;
                        audio.autoplay = true;
                        var div = document.createElement("div");
                        div.appendChild(audio);
                        container.appendChild(div);
        
                        audio.addEventListener('canplaythrough', () => resolve());
                        audio.onerror = () => resolve(); // Avoid stalling on broken links
                        break;
                    }
        
                    case 'html': {
                        var div = document.createElement("div");
                        div.innerHTML = content;
                        container.appendChild(div);
                        requestAnimationFrame(resolve);
                        break;
                    }
        
                    case 'ssml': {
                        if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance();
                            const parser = new DOMParser();
                            const ssmlDoc = parser.parseFromString(content, 'text/xml');
        
                            utterance.text = ssmlDoc.documentElement.textContent;
                            speechSynthesis.speak(utterance);
                            container.innerHTML = utterance.text;
        
                            // utterance.addEventListener('end', () => resolve());
                        } else {
                            console.warn('Speech Synthesis not supported.');
                            requestAnimationFrame(resolve);
                        }
                        resolve()
                        break;
                    }

                    case "pdf" : {
                        var div = document.createElement("div");
                        // div.innerHTML = content;
                        var iframe = document.createElement("embed");
                        //enable controls
                        iframe.setAttribute("type", "application/pdf");
                        iframe.setAttribute("src", content+"#toolbar=1");
                        iframe.style.width = "100%";
                        iframe.style.height = "100%";
                        div.appendChild(iframe);
                        container.appendChild(div);
                        requestAnimationFrame(resolve);
                        break;
                    }
        
                    default: {
                        var div = document.createElement("div");
                        div.innerText = content;
                        container.appendChild(div);
                        requestAnimationFrame(resolve); // Fallback case
                        break;
                    }
                }
            }
        });
    }
    
    
    

    setOverlay() {
        this.overlay = this.overlay || document.createElement("div");
        this.overlay.id = "tour-guide-overlay";
        this.overlay.addEventListener("click", e => {
            e.stopPropagation();
            e.preventDefault();
            this.onOverlayClicked()
        }, false);
        document.body.append(this.overlay);
    }


    onOverlayClicked(e) {
        // if(this?.current?.options?.dismissable) {
        //     this.onDismiss(e)
        // }
    }

    removeOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }

    hideOverlay() {
        if (this.overlay) {
            this.overlay.style.pointerEvents = "auto";
            document.body.style.pointerEvents = this.originalPointerEvents || ""; // ✅ Restore original value from computed style
            this.originalPointerEvents = null;
        }
    }
    showOverlay() {
        if (this.overlay) {
            this.originalPointerEvents = this.originalPointerEvents || window.getComputedStyle(document.body).pointerEvents; // ✅ Use computed style
            this.overlay.style.pointerEvents = "auto";
            document.body.style.pointerEvents = "none";
        }
    }
    
    

    onload(e) {
        // setTimeout(e => {

        // }, 1000)

    }

    speakSSML(ssml) {
        if (!'speechSynthesis' in window) {
            console.warn('Speech Synthesis not supported in this browser.');
            return;
        }
    
        if (this.speechInstance) {
            window.speechSynthesis.cancel(); // Stop existing speech
        }
    
        // ✅ Strip SSML tags using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(ssml, 'text/xml');
        const text = doc.documentElement.textContent.trim();
    
        if (!text) {
            console.warn('Invalid SSML content — empty string after parsing.');
            return;
        }
    
        console.log(`✅ Speaking: "${text}"`);
    
        this.speechInstance = new SpeechSynthesisUtterance(text);
    
        // ✅ Set voice options (can be customized)
        this.speechInstance.lang = 'en-US'; // Adjust for localization
        this.speechInstance.rate = 1.0; // Speed (1 = normal)
        this.speechInstance.pitch = 1.0; // Pitch (1 = normal)
        this.speechInstance.volume = 1.0; // Volume (1 = max)
    
        // ✅ Debug available voices
        const voices = window.speechSynthesis.getVoices();
        console.log('Available voices:', voices);
    
        // ✅ Select a voice (optional)
        this.speechInstance.voice = voices.find(voice => voice.lang === 'en-US') || voices[0];
    
        // ✅ Handle speech events
        this.speechInstance.onstart = () => console.log('Speech started');
        this.speechInstance.onend = () => console.log('Speech ended');
        this.speechInstance.onerror = (e) => console.error('Speech Error:', e);
    
        // ✅ Start speech
        window.speechSynthesis.speak(this.speechInstance);
    }
    

    restoreState() {
        const savedTourKey = sessionStorage.getItem('activeTourKey');
        const savedIndex = Number(sessionStorage.getItem('activeTourStepIndex'));
    
        if (savedTourKey && this.data[savedTourKey] && savedIndex >= 0) {
            sessionStorage.removeItem('activeTourKey');
            sessionStorage.removeItem('activeTourStepIndex');

            var items = this.flattenSteps(this.data[savedTourKey]);
            this.currentTourKey = savedTourKey;
            this.history = [...items];
            this.historyIndex = savedIndex;
            this.current = this.history[this.historyIndex];
    
            this.setBodyOverflow();
            this.setOverlay();
            this.showOverlay();
    
            // ✅ Update nextStep based on restored historyIndex
            // this.nextStep = this.history[this.historyIndex + 1] || null;
    
            // ✅ FIX: Convert to one-based when calling `show()`  
            this.show(savedTourKey, this.historyIndex + 1);
        }
    }
    
    
    

    
    
}

customElements.define('tour-guide', TourGuide);
globalThis.TourGuide = TourGuide;
export default TourGuide;