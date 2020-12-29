
@tag("splash-loader");
namespace `display.components` (
    class Splash extends WebComponent {
        async onConnected() {
            await this.render();
            /*dispatch from any component; ex:
                application.dispatchEvent("hidesplash")*/
            application.addEventListener("showsplash", e => this.onShow(), false);
            application.addEventListener("hidesplash", e => this.onHide(), false);
            
            //hide immediatetly
            this.onHide();
        }

        onShow(){
            this.classList.remove("hidden");
            this.classList.remove("fade")
        }

        onHide(){
            setTimeout(e=>{
                this.classList.add("hidden");
                this.classList.add("fade")
            },2000)
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
    				transition: opacity .4s;
    				box-sizing: border-box;
    			}

    			:host(.fade){
    				opacity:0;
    			}

    			:host(.hidden){
    				visibility:hidden;
    				z-index:-100;
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
    			  margin-left: -25px;
    			  -webkit-transform: translate(-50%, -50%);
    			          transform: translate(-50%, -50%);
    			}`
        }
    }
);
