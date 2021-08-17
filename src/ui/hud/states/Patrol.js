import '@system.math.Vector';
import '@ui.hud.states.State';
import '@ui.hud.states.Observation';

namespace `ui.hud.states` (
    class Patrol extends ui.hud.states.State {
        constructor(sprite, machine){
            super(sprite, machine);
            this.sprite = sprite;
            this.machine=machine;
            this.currentWP = sprite.currentWP;
            this.wayPoints = sprite.wayPoints;
            this.velocity = sprite.velocity;
            this.position = sprite.position;
            this.observe = new ui.hud.states.Observation(this.sprite,this.machine);
        }


        


        //------------------------------MACHINE CALLED----------------------------

        //Called when machine awakes this component. Usualy we hide/show onAwake.
        //and do anything else like play music, sfx, animation etc
        onAwake(){
            console.log(this.namespace + " Awake");
            // this.isPatrolling=true;
            this.currentWP = this.currentWP||0;
            this.sprite.classList.remove("left");
            this.sprite.classList.remove("right");
            this.sprite.classList.remove("up");
            this.sprite.classList.remove("down");
            this.sprite.classList.add("walking");
        }

        //Machine puts it to sleep.Usually hide itself, pause music, animate out.
        onSleep(){
            console.log(this.namespace + " Sleeping");
            // this.isPatrolling=false;
            // this.stop()
            this.sprite.classList.remove("walking");
        }

        //Machine calls it once if never started, hence the isStarted flag. Usually,
        //you append this component to DOM, which fires onConnected() above.
        onStart(dir) {
            // if(this.isPatrolling){return}
            // this.isPatrolling=true;
            this.isStarted=true;
            console.log(this.namespace + " Started");
        }


        //Machine calls if isFinished is ever true. Destroy self and cleanup. 
        onExit(){
            console.log(this.namespace + " Exit")
            // this.stop()
        }

        //onUpdate, runs 1x per frame. Good place to handle user input
        onFixedUpdate(time, d){
            // console.log(time)
            if(this.wayPoints.length<=0){
                return
            }
    
            var vel=this.velocity;
            var waypoint = this.wayPoints[this.currentWP];
            var pos      = Vector.towards(this.position,waypoint,vel*time);
            var distance = waypoint.distance(this.position);

            var angleDeg = this.getAngle(this.position,waypoint);
            this.dir = this.getCardinal(angleDeg).toLowerCase();
            if(this.dir!=this.lastDir||!this.lastDir){
                this.sprite.classList.remove(this.lastDir);
                this.sprite.classList.add(this.dir);
                this.lastDir = this.dir;
                this.sprite.lastDir = this.dir;
            }
            if(distance <= vel*time){
                this.currentWP++;
                if(this.currentWP>=this.wayPoints.length){
                    this.currentWP=0;
                }
                this.sprite.position.x += pos.x;
                this.sprite.position.y += pos.y;
                this.sprite.y=this.sprite.position.y;
                this.sprite.x=this.sprite.position.x;
                this.machine.push(this.observe);
            }
            else {
                this.sprite.position.x += pos.x;
                this.sprite.position.y += pos.y;
                this.sprite.y=this.sprite.position.y;
                this.sprite.x=this.sprite.position.x;
            }
        }

        getAngle = (anchor, point) => Math.atan2(anchor.y - point.y, anchor.x - point.x) * 180 / Math.PI + 180

        getCardinal(angle) {
          if (typeof angle === 'string') angle = parseInt(angle);
          if (angle <= 0 || angle > 360 || typeof angle === 'undefined') return '☈';
          const arrows = { north: 'Right', east: 'Down', south: 'Left', west: 'Up' };
          const directions = Object.keys(arrows);
          const degree = 360 / directions.length;
          angle = angle + degree / 2;
          for (let i = 0; i < directions.length; i++) {
            if (angle >= (i * degree) && angle < (i + 1) * degree) return arrows[directions[i]];
          }
          return arrows['north'];
        }

        //onDraw, runs 1x per frame. Good place to paint
        onDraw(interpolation){
            var x = Math.round(this.sprite.position.x);
            var y = Math.round(this.sprite.position.y);
            this.sprite.style.transform = `translate3d(${x}px,${y}px,0px)`;
        }
    }
);
