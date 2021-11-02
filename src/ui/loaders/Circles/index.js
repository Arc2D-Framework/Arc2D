
@tag("splash-loader");
namespace `ui.loaders` (
    class Circles extends WebComponent {
        async onConnected() {
			await this.render();
			this.duration = this.getAttribute("duration")||1200;
            document.addEventListener("showsplash", e => this.onShow(), false);
			document.addEventListener("hidesplash", e => this.onHide(), false);
			this.on("transitionend", e=>this.onTransitionEnd(e), false);
			// this.on("mozTransitionend", e=>this.onTransitionEnd(e));
			this.fade();
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
					<div class="loader"></div>
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
				
				:host .loader  {
					animation: rotate 1s infinite;  
					height: 50px;
					width: 50px;
					transform: translate3d(-50%,-50%,0);
					position:absolute;
					top:50%;
					left:50%;
					margin-left: -15px;
					margin-top: -15px;
				}

				:host .loader:before,
				:host .loader:after {   
					border-radius: 50%;
					content: '';
					display: block;
					height: 20px;  
					width: 20px;
					will-change:transform;
				}
				:host .loader:before {
					animation: ball1 1s infinite;  
					background-color: #cb2025;
					box-shadow: 30px 0 0 #f8b334;
					margin-bottom: 10px;
				}
				:host .loader:after {
					animation: ball2 1s infinite; 
					background-color: #00a096;
					box-shadow: 30px 0 0 #97bf0d;
				}

				@keyframes rotate {
					0% { 
						transform: rotate(0deg) scale(0.8); 
					}
					50% { 
						transform: rotate(360deg) scale(1.2); 
					}
					100% { 
						transform: rotate(720deg) scale(0.8); 
					}
				}

				@keyframes ball1 {
					0% {
						box-shadow: 30px 0 0 #f8b334;
					}
					50% {
						box-shadow: 0 0 0 #f8b334;
						margin-bottom: 0;
						transform: translate(15px,15px);
					}
					100% {
						box-shadow: 30px 0 0 #f8b334;
						margin-bottom: 10px;
					}
				}

				@keyframes ball2 {
					0% {
						box-shadow: 30px 0 0 #97bf0d;
					}
					50% {
						box-shadow: 0 0 0 #97bf0d;
						margin-top: -20px;
						transform: translate(15px,15px);
					}
					100% {
						box-shadow: 30px 0 0 #97bf0d;
						margin-top: 0;
					}
				}`
        }
    }
);
