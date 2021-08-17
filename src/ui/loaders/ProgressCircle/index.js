
@tag("splash-loader");
namespace `ui.loaders` (
    class ProgressCircle extends WebComponent {
        async onConnected() {
			await this.render();
			this.duration = this.getAttribute("duration")||1200;
            document.addEventListener("showsplash", e => this.onShow(), false);
			document.addEventListener("hidesplash", e => this.onHide(), false);
			this.on("transitionend", e=>this.onTransitionEnd(e), false);
			// this.on("mozTransitionend", e=>this.onTransitionEnd(e));
			// this.fade();
			this.onProgress();
        }

		onProgress(){

			var el = this.querySelector('.loader'); // get canvas
			var options = {
				percent:  el.getAttribute('data-percent') || 70,
				size: el.getAttribute('data-size') || 80,
				lineWidth: el.getAttribute('data-line') || 5,
				rotate: el.getAttribute('data-rotate') || 0
			}

			var canvas = el.querySelector("canvas");
			var span = el.querySelector("span");
			span.textContent = options.percent + '%';

			if (typeof(G_vmlCanvasManager) !== 'undefined') {
				G_vmlCanvasManager.initElement(canvas);
			}
			var ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;
			canvas.width = canvas.height = options.size;
			ctx.translate(options.size / 2, options.size / 2); // change center
			ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg
			var radius = (options.size - options.lineWidth) / 2;
			var drawCircle = function(color, lineWidth, percent) {
				percent = Math.min(Math.max(0, percent || 1), 1);
				ctx.beginPath();
				ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
				ctx.strokeStyle = color;
				ctx.lineCap = 'round'; // butt, round or square
				ctx.lineWidth = lineWidth
				ctx.stroke();
			};
			drawCircle('#efefef', options.lineWidth, 100 / 100);
			drawCircle('green', options.lineWidth, options.percent / 100);
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
						<span></span>
						<canvas></canvas>
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

				:host span {
					position: absolute;
					transform: translate3d(-50%, -50%, 0px);
					top: 50%;
					font-size: 12px;
					margin-left: 2px;
					left: 50%;
					margin-top: -2px;
				}
			`
        }
    }
);
