// import './Constraint.js';
// import {Constraint} from "./constraint.js";
// import {resolve} from "./constraint.js";

export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.px = x;
        this.py = y;
        this.vx = 0;
        this.vy = 0;
        this.pin_x = null;
        this.pin_y = null;
        this.boundsx = boundsx;
        this.boundsy = boundsy;
        this.mouse = mouse;

        this.constraints = [];
    }

    update(delta) {
        if (mouse.down) { // mouse variable lives in src/ui/components/TearableCloth.js class
            var diff_x = this.x - mouse.x,
                diff_y = this.y - mouse.y,
                dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
    
            if (mouse.button == 1) {
                if (dist < mouse_influence) { //mouse_influence variable lives in src/ui/components/TearableCloth.js class
                    this.px = this.x - (mouse.x - mouse.px) * 1.8;
                    this.py = this.y - (mouse.y - mouse.py) * 1.8;
                }
              
            } else if (dist < mouse_cut) this.constraints = []; // mouse_cut variable lives in src/ui/components/TearableCloth.js class
        }
    
        this.add_force(0, gravity);
    
        delta *= delta;
        nx = this.x + ((this.x - this.px) * .99) + ((this.vx / 2) * delta);
        ny = this.y + ((this.y - this.py) * .99) + ((this.vy / 2) * delta);
    
        this.px = this.x;
        this.py = this.y;
    
        this.x = nx;
        this.y = ny;
    
        this.vy = this.vx = 0
    }

    draw(){
        if (!this.constraints.length) return;
		var i = this.constraints.length;
		while (i--) this.constraints[i].draw();
    }

    resolve_constraints(){
        if (this.pin_x != null && this.pin_y != null) {
            this.x = this.pin_x;
            this.y = this.pin_y;
            return;
        }

        var i = this.constraints.length;
		while (i--) this.constraints[i].resolve(); // resolve method lives in constraint class
			  
		this.x > this.boundsx ? this.x = 2 * this.boundsx - this.x : 1 > this.x && (this.x = 2 - this.x);
		this.y < 1 ? this.y = 2 - this.y : this.y > this.boundsy && (this.y = 2 * this.boundsy - this.y);
    }

    attach(point){
        this.constraints.push(
            new Constraint(this, point) // a new instance of Constraint is created (constraint.js)
        );
    }

    remove_constraint(constraint){ // constraint.js uses this method in it's class
        this.constraints.splice(this.constraints.indexOf(constraint), 1);
    }

    add_force(x, y){
        this.vx += x;
        this.vy += y;
      
        var round = 400;
        this.vx = ~~(this.vx * round) / round;
        this.vy = ~~(this.vy * round) / round;
    }

    pin(pinx, piny) {
        this.pin_x = pinx;
        this.pin_y = piny;
    }
}
