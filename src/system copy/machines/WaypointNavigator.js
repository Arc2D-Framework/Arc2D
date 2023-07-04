class WaypointNavigator {
    constructor(obj){
        this.currentWP = obj.currentWP;
        this.wayPoints = obj.wayPoints;
        this.velocity = obj.velocity;
        this.coords = obj.coords;
    }

    onFixedUpdate = async (time,d) =>{
        // console.log(time)
        // if(!this.box.ismoving){;return}
        if(this.wayPoints.length<=0){
            return
        }

        // var elapsed = (Date.now() - this.starttime);
        // var percent = elapsed / this.duration;
        // this.totaltime+=time;
        // if(percent > 1){
        //     this.box.ismoving=false;
        // }
        var vel=this.velocity;
        var waypoint = this.wayPoints[this.currentWP];
        var pos      = Vector.towards(this.coords,waypoint,vel*time);
        var distance = waypoint.distance(this.coords);
        // console.log(distance)
        if(distance <= vel*time){
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
}