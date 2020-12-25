namespace `system.2d` (
    class Tween {
        constructor(obj, engine){
            this.obj=obj;
            this.engine = engine;

            this.tween = new engine.Tween(this.obj)
            return this
        }

        to(obj, duration){
            this.tween.to(obj, duration)
        }

        setEasing(easing){
            this.tween.easing(easing)
        }

        start(){
            this.tween.start()
        }

        onUpdate(time,delta){
            this.engine.update(time);
        }


    }
)