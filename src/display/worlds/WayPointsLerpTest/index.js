
import! 'system.input.KeyBoard';
import! 'system.math.Utils';
import! 'system.math.Vector';
var {Easing} = await import('/src/system/math/Easing.js');
let Vector = system.math.Vector;

namespace `display.worlds` (
    class WayPointsLerpTest extends World {
        async onConnected() {
            await super.onConnected();
            this.coords=this.position = new Vector(0,0);

            this.box = this.querySelector("#box")
            this.wayPoints = [
        
               new Vector(100,0),
               // new Vector(100,100),
               new Vector(0,0)

            ];
            this.currentWP = 0;
            this.duration = 200;
            this.totaltime=0
             
        }

        onFixedUpdate = async (time,delta) =>{
            if(!this.box.ismoving){;return}
            if(this.wayPoints.length<=0){
                return
            }

            // var elapsed = (Date.now() - this.starttime);
            // var percent = elapsed / this.duration;
            // this.totaltime+=time;
            // if(percent > 1){
            //     this.box.ismoving=false;
            // }


            var waypoint = this.wayPoints[this.currentWP];
            var pos      = Vector.towards(this.coords,waypoint, 3);
            var distance = waypoint.distance(this.coords);

            if(distance <= 3){
                this.currentWP++;
                if(this.currentWP>=this.wayPoints.length){
                    this.currentWP=0;
                }
            }
            else {
                this.coords.x+=pos.x;
                this.coords.y+=pos.y;
            }
        }

        onUpdate=()=>{
            const dir = KeyBoard.held_directions[0];
            if (dir) {
                if (dir === KeyBoard.directions.right){
                    this.starttime = Date.now();
                    this.currentWP=0;
                    this.box.ismoving=true;
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