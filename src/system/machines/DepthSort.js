
namespace `system.machines` (
    class DepthSort {
        constructor(objects){
            this.objects = objects;
        }
        
        onDraw(){
            this.objects.sort((a, b) => {
                //if a or b have bounds, add them in, else use height 
                var a_bounds = a.bounds? (a.bounds[0].y+a.bounds[0].height) : a.height;
                var b_bounds = b.bounds? (b.bounds[0].y+b.bounds[0].height) : b.height;

                var a_y = a.y + a_bounds;
                var b_y = b.y + b_bounds;
                return (a_y > b_y) ? 1 : -1
            })
            this.updateZ();
        }

        updateZ(){
            var objects = this.objects;
            if(objects){
                for(var i=0; i<=objects.length-1;i++){
                    let object = objects[i];
                    (object.image||object).style.zIndex=i
                }
            }
        }
    }
)



