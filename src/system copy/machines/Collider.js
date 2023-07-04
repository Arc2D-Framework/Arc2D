import {boxBox} from '/src/system/libs/boxBox.js';

namespace `system.machines` (
    class Collider {
        constructor(hero,objects){
            this.hero=hero;
            this.objects = objects;
        }
        
        onFixedUpdate(){
            // var hero=this.hero;
            var objects=this.objects;
            for(var i=0; i<=objects.length-1;i++){
                var object1 =objects[i];
                var bounds1 = object1.bounds?object1.bounds[0] : {x:0,y:0,width:0,height:0}
                // var x1 = object1.position?object1.position.x:object1.x;
                var x1 = object1.x;
                    x1 += bounds1.x;
                // var y1 = object1.position?object1.position.y:object1.y;
                var y1 = object1.y;
                    y1 += bounds1.y;
                var w1 = bounds1.width;
                var h1 = bounds1.height;

                for (let j = i + 1; j < objects.length; j++)
                {
                    var object2 = objects[j];
                    var bounds2 = object2.bounds?object2.bounds[0] : {x:0,y:0,width:0,height:0}
                    // var x2 = object2.position?object2.position.x:object2.x;
                    var x2 = object2.x;
                        x2 += bounds2.x;
                    // var y2 = object2.position?object2.position.y:object2.y;
                    var y2 = object2.y;
                        y2 += bounds2.y;
                    var w2 = bounds2.width;
                    var h2 = bounds2.height;

                    //boxBox(x1, y1, w1, h1, x2, y2, w2, h2)
                    if(boxBox(x1,y1,w1,h1,x2,y2,w2,h2)){
                        object1.onCollide?object1.onCollide(object2):null;
                        object2.onCollide?object2.onCollide(object1):null;
                    }
                }
                // if(object==hero){continue}
                // else {
                    // var bounds = object.bounds?object.bounds[0] : {x:0,y:0,width:0,height:0}
                    // var obX = object.position?object.position.x:object.x;
                    // var obY = object.position?object.position.y:object.y;
                    // if(boxBox(hero.x+hero.bounds[0].x,hero.y+hero.bounds[0].y,hero.bounds[0].width,hero.bounds[0].height,Math.round(obX+bounds.x),Math.round(obY+bounds.y),bounds.width,bounds.height)){
                    //     hero.onCollide(object);
                    // }
                // }
            }
        }
    }
)



