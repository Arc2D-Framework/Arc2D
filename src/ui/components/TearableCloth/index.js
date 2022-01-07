

namespace `ui.components` (
	class TearableCloth extends WebComponent {
		constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
			
			this.setupVariables();
			this.init_frames();

			window.onload = () => {
				var canvas  = document.getElementById('cloth');
				var ctx     = this.canvas.getContext('2d');

				this.canvas = canvas;
				this.ctx = ctx;
			
				this.canvas.width  = 560;
				this.canvas.height = 350;
			
				this.start();
			}
        }

		setupVariables() {
			this.physics_accuracy  = 3;
			var mouse_influence   = 20;
			var mouse_cut         = 5;
			this.gravity           = 1200;
			this.cloth_height      = 30;
			this.cloth_width       = 50;
			this.start_y           = 20;
			this.spacing           = 7;
			this.tear_distance     = 60;

			this.cloth,
			this.boundsx,
			this.boundsy
			var mouse = {
					  down: false,
					  button: 1,
					  x: 0,
					  y: 0,
					  px: 0,
					  py: 0
			}
			this.mouse = mouse;
			this.mouse_influence = mouse_influence;
			this.mouse_cut = mouse_cut;
		}

		update() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
			this.cloth.update();
			this.cloth.draw();
		
			requestAnimFrame(update);
		}

		start() {
			this.canvas.onmousedown = (e) => {
				this.mouse.button  = e.which;
				this.mouse.px      = this.mouse.x;
				this.mouse.py      = this.mouse.y;
				var rect      = this.canvas.getBoundingClientRect();
				this.mouse.x       = e.clientX - rect.left,
				this.mouse.y       = e.clientY - rect.top,
				this.mouse.down    = true;
				e.preventDefault();
			}
		
			this.canvas.onmouseup = (e) => {
				this.mouse.down = false;
				e.preventDefault();
			}
		
			this.canvas.onmousemove = (e) => {
				this.mouse.px  = this.mouse.x;
				this.mouse.py  = this.mouse.y;
				var rect  = this.canvas.getBoundingClientRect();
				this.mouse.x   = e.clientX - rect.left,
				this.mouse.y   = e.clientY - rect.top,
				e.preventDefault();
			};
		
			this.canvas.oncontextmenu = (e) => {
				e.preventDefault();
			}
		
			this.boundsx = this.canvas.width - 1;
			this.boundsy = this.canvas.height - 1;
		
			this.ctx.strokeStyle = '#888';
		  
			this.cloth = new Cloth();
		  
			this.update();
		}

		init_frames(){
			window.requestAnimFrame =
				window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				}
		}
	}	
)