// import {ctx} from '../../src/ui/components/TearableCloth.js';
// import remove_constraint from './point.js';

export default class Constraint {
    constructor(p1, p2){
        this.p1     = p1;
        this.p2     = p2;
        this.length = spacing; // cloth class uses the spacing variable
    }

    resolve() {
        var diff_x  = this.p1.x - this.p2.x,
            diff_y  = this.p1.y - this.p2.y,
            dist    = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
            diff    = (this.length - dist) / dist;
    
        if (dist > tear_distance) this.p1.remove_constraint(this); // remove_constraint method lives in point.js class
    
        var px = diff_x * diff * 0.5;
        var py = diff_y * diff * 0.5;
    
        this.p1.x += px;
        this.p1.y += py;
        this.p2.x -= px;
        this.p2.y -= py;
    }

    draw() {
        ctx.moveTo(this.p1.x, this.p1.y); // ctx variable lives in src/ui/components/TearableCloth.js class
        ctx.lineTo(this.p2.x, this.p2.y);
    }
}