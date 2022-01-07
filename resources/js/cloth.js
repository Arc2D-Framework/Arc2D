class Cloth {
    constructor(){
        this.points = [];
                                                                    // spacing variable lives in constraint.js class
        var start_x = canvas.width / 2 - cloth_width * spacing / 2; // canvas, cloth_width variables live in src/ui/components/TearableCloth.js class
    
        for (var y = 0; y <= cloth_height; y++) { // cloth_height variable live in src/ui/components/TearableCloth.js class
            for (var x = 0; x <= cloth_width; x++) {
                var p = new Point(start_x + x * spacing, start_y + y * spacing); // new Point instance class created (point.js)
    
                x != 0 && p.attach(this.points[this.points.length - 1]); // attach() method lives in Point class
                y == 0 && p.pin(p.x, p.y);                               // pin() method lives in Point class
                y != 0 && p.attach(this.points[x + (y - 1) * (cloth_width + 1)])
    
                this.points.push(p);
            }
        }
    }

    update() {
        var i = physics_accuracy;
    
        while (i--) {
            var p = this.points.length;
            while (p--) this.points[p].resolve_constraints(); // resolve_constraints() method lives in Point class
        }
    
        i = this.points.length;
        while (i--) this.points[i].update(.016);
    }

    draw() {
        ctx.beginPath(); // ctx variable lives in src/ui/components/TearableCloth.js class
    
        var i = cloth.points.length; // cloth variable lives in src/ui/components/TearableCloth.js class
        while (i--) cloth.points[i].draw();
    
        ctx.stroke();
    }
}