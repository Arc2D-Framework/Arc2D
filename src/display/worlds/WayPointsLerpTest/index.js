
import! 'system.input.KeyBoard';
import! 'system.math.Utils';
import! 'system.math.Vector';
var {Easing} = await import('/src/system/math/Easing.js');
let Vector = system.math.Vector;

namespace `display.worlds` (
    class WayPointsLerpTest extends World {
        async onConnected() {
            await super.onConnected();
            this.coords=this.position = new Vector(250,300);

            this.box = this.querySelector("#box")
            this.wayPoints = [
               new Vector(200,300),
               new Vector(400,100),
               new Vector(700,100),
               new Vector(700,800)
            ];
            this.currentWP = 0;
            this.duration = 200;
            this.totaltime=0
             
        }

        onFixedUpdate = (time,delta) =>{
            if(!this.box.ismoving){;return}
            if(this.wayPoints.length<=0){
                return
            }

            var elapsed = (Date.now() - this.starttime);
            var percent = elapsed / this.duration;
            this.totaltime+=time;
            // if(percent > 1){
            //     this.box.ismoving=false;
            // }


            var waypoint = this.wayPoints[this.currentWP];
            var distance = waypoint.dist(this.position);
            if(distance <= 7){
                // console.log(elapsed)
                // this.starttime=Date.now();
                // this.position.x = waypoint.x;
                // this.position.y = waypoint.y;
                this.currentWP++;
                if(this.currentWP>=this.wayPoints.length){
                    this.currentWP=0;
                    this.box.ismoving=false;
                    // console.log(this.totaltime)
                    // this.totaltime=0;
                }
            }
            var angleDeg = this.getAngle(this.coords,waypoint);
            console.log("angleDeg",angleDeg)
            var pos = Vector.moveTowards(this.coords,waypoint, 7);
            this.coords.x+=pos.x;
            this.coords.y+=pos.y;
            // console.log(this.position.x,this.position.y)
            // this.coords.x = Math.lerp(this.coords.x, waypoint.x, percent,true);
            // this.coords.y = Math.lerp(this.coords.y, waypoint.y, percent,true);

        }
        getAngle = (anchor, point) => Math.atan2(anchor.y - point.y, anchor.x - point.x) * 180 / Math.PI + 180

        onUpdate=()=>{
            const dir = KeyBoard.held_directions[0];
            if (dir) {
                if (dir === KeyBoard.directions.right){
                    this.starttime = Date.now();
                    this.box.ismoving=true
                }
            }
        }

        onDraw = () => {
            var x = Math.round(this.coords.x);
            var y = Math.round(this.coords.y);
            this.box.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0px)`);
        }
    }
);