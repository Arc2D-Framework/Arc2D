
@tag("splash-loader");
namespace `display.loaders` (
    class ProgressRing extends WebComponent {
		constructor(){
			super();
			this.progress=0;
		}
        async onConnected() {
			await super.onConnected();
			this.duration = this.getAttribute("duration")||1200;
            document.addEventListener("showsplash", e => this.onShow(), false);
			document.addEventListener("hidesplash", e => this.onHide(), false);
			this.on("transitionend", e=>this.onTransitionEnd(e), false);
			// this.on("mozTransitionend", e=>this.onTransitionEnd(e));
			// this.fade();

			// await wait(3000)
			this.setProgress(this.getAttribute("progress")||20);
        }

		async setProgress(percent=this.progress) {
			this.stroke = this.getAttribute('stroke')||4;
			this.radius = this.getAttribute('radius')||60;
			this.normalizedRadius = this.radius - this.stroke * 2;
			this._circumference = this.normalizedRadius * 2 * Math.PI;

			this.offset = this._circumference - (percent / 100 * this._circumference);
			const circle = this.querySelector('circle#marker');
			const bg = this.querySelector('circle#bg');
			var svg = this.querySelector("svg");
				svg.setAttribute("width",this.radius*2);
				svg.setAttribute("height",this.radius*2);

			
				circle.style.strokeDashoffset = this.offset; 
				circle.setAttribute("stroke-dasharray",`${this._circumference} ${this._circumference}`);
				circle.setAttribute("stroke-width",this.stroke);
				circle.setAttribute("r",this.normalizedRadius);
				circle.setAttribute("cx",this.radius);
				circle.setAttribute("cy",this.radius);
				bg.setAttribute("stroke-width",this.stroke);
				bg.setAttribute("r",this.normalizedRadius);
				bg.setAttribute("cx",this.radius);
				bg.setAttribute("cy",this.radius);

			if(this.progress>=100){this.fade();}
		}

		static get observedAttributes() {
			return ['progress'];
		}

		async attributeChangedCallback(name, oldValue, newValue) {

			if (name === 'progress') {
				this.progress = this.getAttribute("progress");
				this.isConnected && this.setProgress();
			}
		}

		onTransitionEnd(e){
			e.propertyName=="opacity" && this.onHide()
		}

		async fade(){
			await wait(parseInt(this.duration));
			this.classList.add("fade");//fires 'transitionend'
		}
		
        async onShow(){
            this.classList.remove("hidden");
			this.classList.remove("fade");
			this.fade();
        }

        onHide(){
            this.classList.add("hidden");
        }

        //Override. No css file to load, it's baked.
        onLoadInstanceStylesheet(){
            return false
        }

        //template baked: fast loading
        template (){
        	return `
        		<template>
					<div class="loader">
						<svg height="60" width="60">
							<circle id="bg" stroke="white" fill="transparent"/>
							<circle id="marker" stroke="red" fill="transparent"/>
						</svg>
					</div>
				</template>
        	`
        }

        //css baked: fast loading
        cssStyle(){
        	return `
				:host {
					border: 0;
    				display: block;
    				padding: 0px;
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
    				transition: opacity .7s;
    				box-sizing: border-box;
				}
				:host(.fade),
				:host.fade{
    				opacity:0;
    			}

				:host(.hidden),
				:host.hidden{
    				display:none;
    			}
				
				:host .loader  {
					transform: translate3d(-50%,-50%,0);
					position:absolute;
					top:50%;
					left:50%;
				}

				:host circle {
					transition: stroke-dashoffset 0.35s;
					transform: rotate(-90deg);
					transform-origin: 50% 50%;
				}
			`
        }
    }
);
