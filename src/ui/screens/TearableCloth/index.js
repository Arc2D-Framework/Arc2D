//global for now, but bad.
window.accuracy = 5
window.gravity = 400
window.clothY = 28
window.clothX = 54
window.spacing = 8
window.tearDist = 60
window.friction = 0.99
window.bounce = 0.5
window.mouse = {
  cut: 8,
  influence: 26,
  down: false,
  button: 1,
  x: 0,
  y: 0,
  px: 0,
  py: 0
}

import {Cloth} from '/resources/js/cloth.js';

namespace `ui.screens` (
    class TearableCloth extends World {
        async onConnected() {
            await super.onConnected();
            this.canvas = this.querySelector('canvas');
            this.canvas.width  = window.innerWidth
            this.canvas.height = window.innerHeight
            this.ctx = this.canvas.getContext('2d');
            this.ctx.strokeStyle = '#555';
            this.bounds = this.canvas.getBoundingClientRect();
            this.cloth = new Cloth(this.canvas, clothX, clothY)

            this.canvas.addEventListener("mousedown", e=> this.onMouseDown(e), false);
            this.canvas.addEventListener("mouseup", e=> this.onMouseUp(e), false);
            this.canvas.addEventListener("mousemove", e=> this.onMouseMove(e), false);
            this.canvas.addEventListener("contextmenu", e=> this.onContextMenu(e), false);
        }

        onFixedUpdate =(delta)=> {
            this.ctx && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.cloth && this.cloth.update(0.016)
        }

        onMouseDown(e){
            mouse.button = e.which
            mouse.down = true
            this.setMouse(e);
        }

        onMouseUp(e){
            mouse.down = false
        }

        onMouseMove(e){
            this.setMouse(e);
        }

        onContextMenu(e){
            e.preventDefault()
        }

        setMouse (e) {
            let rect = this.bounds;
            mouse.px = mouse.x
            mouse.py = mouse.y
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }
    }
);
