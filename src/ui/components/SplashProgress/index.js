

namespace `ui.components` (
    class Splash extends Component {
		static get is(){
			return "splash-loader"
		}
        async onConnected() {
			await super.onConnected();
			this.duration = this.getAttribute("duration")||1200;
            document.addEventListener("showsplash", e => this.onShow(), false);
			document.addEventListener("hidesplash", e => this.onHide(), false);
			this.on("transitionend", e=>this.onTransitionEnd(e), false);
			this.progress = this.querySelector("progress");

			await sleep(1000);
			// this.progress.setAttribute('value', 100);
    		// this.progress.style.setProperty('--value', 100 + '%');
			// this.progress.addEventListener("change", e=> this.onProgress(e))
			this.interval = setInterval(this.onProgress.bind(this), parseInt(this.duration)/60);
			// this.on("mozTransitionend", e=>this.onTransitionEnd(e));
			// this.fade();
        }

		onProgress(e){
			if(this.progress.value >= 100){
				clearInterval(this.interval);
				this.fade();
			}
			else {
				this.progress.value += 1
			}	
		}

		onTransitionEnd(e){
			e.propertyName=="opacity" && this.onHide()
		}

		async fade(){
			// await wait(parseInt(this.duration));
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
					<div class='container'>
					  <i class='layer'></i>
					  <i class='layer'></i>
					  <i class='layer'></i>
					  <progress class="animated" value="0" max="100" style="
					  		position: absolute;bottom: -50px;
						  	width: 100px;;
							border: 0; 
							height: 10px;
							background-color: white;
							border: 1px solid black;
							overflow: hidden;
							border-radius:20px;
					  "></progress>
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

    			:host .layer {
    			  display: block;
    			  position: absolute;
    			  height: 3em;
    			  width: 3em;
    			  box-shadow: 3px 3px 2px rgba(0, 0, 0, 0.2);
    			  -webkit-transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg);
    			          transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg);
    			}
    			:host .layer:nth-of-type(1) {
    			  background: #534a47;
    			  margin-top: 1.5em;
    			  -webkit-animation: movedown 1.8s cubic-bezier(0.39, 0.575, 0.565, 1) 0.9s infinite normal;
    			          animation: movedown 1.8s cubic-bezier(0.39, 0.575, 0.565, 1) 0.9s infinite normal;
    			}
    			:host .layer:nth-of-type(1):before {
    			  content: '';
    			  position: absolute;
    			  width: 85%;
    			  height: 85%;
    			  background: #37332f;
    			}
    			:host .layer:nth-of-type(2) {
    			  background: #5a96bc;
    			  margin-top: 0.75em;
    			}
    			:host .layer:nth-of-type(3) {
    			  background: rgba(255, 255, 255, 0.6);
    			  -webkit-animation: moveup 1.8s cubic-bezier(0.39, 0.575, 0.565, 1) infinite normal;
    			          animation: moveup 1.8s cubic-bezier(0.39, 0.575, 0.565, 1) infinite normal;
    			}

    			:host .container {
    			  width: auto !important;
    			  position: absolute;
    			  top: 50%;
    			  left: 50%;
    			  margin-top: -30px;
    			  
    			  -webkit-transform: translate(-50%, -50%);
    			          transform: translate(-50%, -50%);
					height: 3em;
					width: 3em !important;
					display: flex;
					justify-content: center;
					align-items: center;
					align-content: center;
    			}
				
				progress {
					width: 100px;;
					border: 0; 
					height: 10px;
					background-color: white;
					border: 1px solid black;
					overflow: hidden;
					border-radius:20px;
				}

				/* necessary to style the progress bar background */
				::-webkit-progress-bar {
					background-color: white; 
				}

				/** ---------
					ANIMATED
				*/
				.animated::-webkit-progress-value {
					/*transition: width 3s;*/
					background-color: rgb(90, 150, 188);
				}
				.animated::-moz-progress-bar {
					/*transition: padding-bottom 3s;*/
					padding-left: 60px;
					padding-bottom: var(--value);
					background-color: rgb(90, 150, 188);
					height: 0;
					transform-origin: 0 0;
					transform: rotate(-90deg) translateX(-60px) ;
				}
				.animated::-ms-fill {
					background-color: rgb(90, 150, 188);
					border:0;
				}
			`
        }
    }
);
