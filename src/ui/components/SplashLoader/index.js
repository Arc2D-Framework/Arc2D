import '/src/system/libs/AssetLoader.min.js';

namespace `ui.components` (
    class SplashLoader extends Component {
		static get is(){ return "splash-loader" }

        async onConnected() {
			await super.onConnected();
			this.progress = this.querySelector("progress");
			this.load();
			this.duration = parseInt(this.getAttribute("duration")||1200,10);
            document.addEventListener("showsplash", e => this.onShow(), false);
			document.addEventListener("hidesplash", e => this.onHide(), false);
			this.on("transitionend", e=>this.onTransitionEnd(e), false);
        }

		inShadow(){
			return true
		}

		load(){
			kontra.loadManifest(Config.ROOTPATH+'manifest.json').then(
				this.onProgressComplete.bind(this), 
				this.onProgressError.bind(this), 
				this.onProgress.bind(this)
			);

			// //v1
			// GortLoader.load(Config.ROOTPATH+'manifest.json').then(
			// 	this.onProgressComplete.bind(this), 
			// 	this.onProgressError.bind(this), 
			// 	this.onProgress.bind(this)
			// );

			// //v2
			// GortLoader.setOptions({
			// 	manifest : Config.ROOTPATH+'manifest.json',
			// 	completed : this.onProgressComplete.bind(this),
			// 	error : this.onProgressError.bind(this),
			// 	progress : this.onProgress.bind(this),
			// });
			// await GortLoader.load();


			// //v3 - 'w3c' feel
			// GortLoader.addEventListener("complete", e => this.onProgressComplete(e));
			// GortLoader.addEventListener("error", e => this.onProgressError(e));
			// GortLoader.addEventListener("progress", e => this.onProgress(e));
			// await GortLoader.load(Config.ROOTPATH+'manifest.json');


			// //v4 - 'w3c' feel with load bundle
			// GortLoader.addEventListener("complete", e => this.onProgressComplete(e));
			// GortLoader.addEventListener("error", e => this.onProgressError(e));
			// GortLoader.addEventListener("progress", e => this.onProgress(e));
			// await GortLoader.load(Config.ROOTPATH+'manifest.json', "level2");
		}

		async onProgressComplete(error=null){
			if(this.progress.value >= 100 || error){
				this.dispatchEvent("loaded")
				await sleep(this.duration)
				this.fade();
			}
		}

		async onProgressError(e){
			console.error("manifest.json - ", e);
			this.progress.value = 100;
			this.onProgressComplete(new Error(e))
		}

		async onProgress(progress){
			var val = Math.round(progress.loaded / progress.total * 100);
			this.progress.value = val;
		}
	
		onTransitionEnd(e){
			e.propertyName=="opacity" && this.onHide()
		}

		async fade(){
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

        onLoadInstanceStylesheet(){
            return false
        }

        template (){
        	return `
        		<template>
					<div class='container' style="
						position: absolute;
						margin-top: -30px;
						height: 3em;
						width: 3em !important;
						display: flex;
						justify-content: center;
					">
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

        cssStyle(){
        	return `
            	:host {
    				display: block;
    				position: fixed;
    				left: 0;
    				top: 0;
    				right: 0;
    				bottom: 0;
    				background:#1c2336;
    				color:white;
    				opacity: 1;
    				z-index: 1000000000;
    				transition: opacity .7s;
    				box-sizing: border-box;
					display: flex;
					justify-content: center;
					align-items: center;
    			}

				:host(.fade),
				:host.fade{
    				opacity:0;
    			}

				:host(.hidden),
				:host.hidden{
    				display:none;
    			}

    			:host .layer {
					display: block;
					position: absolute;
					height: 3em;
					width: 3em;
					box-shadow: 3px 3px 2px rgba(0, 0, 0, 0.2);
					transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg);
    			}
    			:host .layer:nth-of-type(1) {
					background: #534a47;
					margin-top: 1.5em;
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
					animation: moveup 1.8s cubic-bezier(0.39, 0.575, 0.565, 1) infinite normal;
    			}

				::-webkit-progress-bar {
					background-color: white; 
				}

				/** ---------ANIMATED-------- **/
				.animated::-webkit-progress-value {
					background-color: rgb(90, 150, 188);
				}
				:host ::-webkit-progress-value {
					transition: width 2s;
				}
				.animated::-moz-progress-bar {
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

				@keyframes moveup {
					0%, 60%, 100% {
						transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
					}
					25% {
						transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(1em);
					}
    			}
    			
    			@keyframes movedown {
					0%, 60%, 100% {
						transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(0);
					}
					25% {
						transform: rotateX(50deg) rotateY(0deg) rotateZ(45deg) translateZ(-1em);
					}
    			}
			`
        }
    }
);
