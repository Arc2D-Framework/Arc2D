import '/src/system/physics/sat/Collisions.js';

namespace `display.worlds` (
    class SatCollision extends core.ui.World {
        constructor(element){
            super(element);
            document.addEventListener('keydown', e=>this.onKeyInput(e));
            document.addEventListener('keyup',   e=>this.onKeyInput(e));
        }

        async onConnected() {
            await super.onConnected();
            this.result = Collisions.createResult();
            this.collisions = new Collisions();
            this.bodies  = [];
            this.width=800;
            this.height=600;
            this.canvas  = this.querySelector("#canvas1");
            this.bvh_checkbox = this.querySelector('#bvh');
            this.context = this.canvas.getContext('2d');
            this.player        = null;
            this.up    = false;
            this.down  = false;
            this.left  = false;
            this.right = false;
            this.createPlayer(400, 300);
            this.createMap();
        }

        onUpdate =()=>{
            if(!this.player){return}
            this.up    && (this.player.velocity += 0.9);
            this.down  && (this.player.velocity -= 0.9);
            this.left  && (this.player.angle -= 0.04);
            this.right && (this.player.angle += 0.04);
        }

        onFixedUpdate=()=>{
            this.updateMovement();
            this.updateCollisions();
        }

        onDraw=()=>{
            if(!this.player){return}

            this.context.fillStyle = '#000000';
            this.context.fillRect(0, 0, 800, 600);

            this.context.strokeStyle = '#FFFFFF';
            this.context.beginPath();
            this.player.draw(this.context);
            this.circle1.draw(this.context);
            this.circle2.draw(this.context);
            // this.collisions.draw(this.context);
            this.context.stroke();

            if(this.bvh_checkbox.checked) {
                this.context.strokeStyle = '#00FF00';
                this.context.beginPath();
                this.collisions.drawBVH(this.context);
                this.context.stroke();
            }
        }

        onKeyInput(e){
            const keydown = e.type === 'keydown';
            const key     = e.key.toLowerCase();

            key === 'w' && (this.up = keydown);
            key === 's' && (this.down = keydown);
            key === 'a' && (this.left = keydown);
            key === 'd' && (this.right = keydown);
        }


        createPlayer(x, y) {
            const size = 15;
            this.player = new Polygon(x, y, [
                [-20, -10],
                [20, -10],
                [20, 10],
                [-20, 10],
            ], 0.2);

            this.player.velocity = 0;
            this.collisions.insert(this.player);
        }


        updateMovement() {
            if(!this.player){return}
            const x = Math.cos(this.player.angle);
            const y = Math.sin(this.player.angle);

            if(this.player.velocity > 0) {
                this.player.velocity -= 0.05;

                if(this.player.velocity > 3) {
                    this.player.velocity = 3;
                }
            }
            else if(this.player.velocity < 0) {
                this.player.velocity += 0.05;

                if(this.player.velocity < -2) {
                    this.player.velocity = -2;
                }
            }

            if(!Math.round(this.player.velocity * 100)) {
                this.player.velocity = 0;
            }

            if(this.player.velocity) {
                this.player.x += x * this.player.velocity;
                this.player.y += y * this.player.velocity;
            }
        }

        updateCollisions() {
            var result = this.result;
            this.collisions.update();
            const potentials = this.player.potentials();
            // Negate any collisions
            for(const body of potentials) {
                if(this.player.collides(body, result)) {
                    this.player.x -= result.overlap * result.overlap_x;
                    this.player.y -= result.overlap * result.overlap_y;

                    this.player.velocity *= 0.9
                }
            }
        }

        createMap() {
            // World bounds
            // this.collisions.createPolygon(0, 0, [[0, 0], [this.width, 0]]);
            // this.collisions.createPolygon(0, 0, [[this.width, 0], [this.width, this.height]]);
            // this.collisions.createPolygon(0, 0, [[this.width, this.height], [0, this.height]]);
            // this.collisions.createPolygon(0, 0, [[0, this.height], [0, 0]]);

            // Factory
            // this.collisions.createPolygon(100, 100, [[-50, -50], [50, -50], [50, 50], [-50, 50],], 0.4);
            // this.collisions.createPolygon(190, 105, [[-20, -20], [20, -20], [20, 20], [-20, 20],], 0.4);
            // this.collisions.createCircle(170, 140, 8);
            // this.collisions.createCircle(185, 155, 8);
            // this.collisions.createCircle(165, 165, 8);
            // this.collisions.createCircle(145, 165, 8);

            // // Airstrip
            // this.collisions.createPolygon(230, 50, [[-150, -30], [150, -30], [150, 30], [-150, 30],], 0.4);

            // // HQ
            // this.collisions.createPolygon(100, 500, [[-40, -50], [40, -50], [50, 50], [-50, 50],], 0.2);
            // this.collisions.createCircle(180, 490, 20);
            // this.collisions.createCircle(175, 540, 20);
            this.circle1 = new Circle(180, 490, 20);
            this.circle2 = new Circle(175, 540, 20);
            this.collisions.insert(this.circle1)
            this.collisions.insert(this.circle2)
            // // Barracks
            // this.collisions.createPolygon(400, 500, [[-60, -20], [60, -20], [60, 20], [-60, 20]], 1.7);
            // this.collisions.createPolygon(350, 494, [[-60, -20], [60, -20], [60, 20], [-60, 20]], 1.7);

            // // Mountains
            // this.collisions.createPolygon(750, 0, [[0, 0], [-20, 100]]);
            // this.collisions.createPolygon(750, 0, [[-20, 100], [30, 250]]);
            // this.collisions.createPolygon(750, 0, [[30, 250], [20, 300]]);
            // this.collisions.createPolygon(750, 0, [[20, 300], [-50, 320]]);
            // this.collisions.createPolygon(750, 0, [[-50, 320], [-90, 500]]);
            // this.collisions.createPolygon(750, 0, [[-90, 500], [-200, 600]]);

            // // Lake
            // this.collisions.createPolygon(550, 100, [
            //     [-60, -20],
            //     [-20, -40],
            //     [30, -30],
            //     [60, 20],
            //     [40, 70],
            //     [10, 100],
            //     [-30, 110],
            //     [-80, 90],
            //     [-110, 50],
            //     [-100, 20],
            // ]);
        }
    }
);
