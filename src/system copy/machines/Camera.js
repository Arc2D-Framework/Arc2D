namespace `system.machines`(
    class Camera{
        constructor(tag,scale){
            this.tag = tag;
            this.x = 0;
            this.y = 0;
            this.ang = 0;
            this.scaleX = scale||2;
            this.scaleY = scale||2;
            this.animations = []
        }

        moveBy(x, y, frameCount, interpolation = 'linear'){
            switch(interpolation){
                case 'linear':
                    return new Promise(res => {
                        this.animations.push(new CameraAnimation(frameCount, () =>{
                            this.x += x/frameCount;
                            this.y += y/frameCount;
                        }, res))
                    })
                case 'logorithmic':

                    return new Promise(res => {
                        this.animations.push(new CameraAnimation(frameCount, frame =>{
                            let distX = (this.x - x)/2;
                            let distY = (this.y - y)/2;
                            if(frame === frameCount){distX *= 2; distY *= 2;} //needed so animation finishes
                            this.x += distX;
                            this.y += distY;
                        }, res))
                    })
                break;
            }
        }

        lookAt(object){
            this.x=object.x;
            this.y=object.y;
        }

        moveTo(x, y, frameCount){
            return this.moveBy(this.x - x, this.y - y, frameCount)
        }

        scale(x, y, frameCount, interpolation = 'linear'){
            switch(interpolation){
                case 'linear':
                    return new Promise(res => {
                        const mx = ((this.scaleX * x) - this.scaleX) / frameCount;
                        const my = ((this.scaleY * y) - this.scaleY) / frameCount;
                        console.log(mx, my)
                        this.animations.push(new CameraAnimation(frameCount, frame => {
                                this.scaleX +=  mx;
                                this.scaleY +=  my;
                        }, res)) 
                    })   
                break;
            }
        }

        
        onDraw(){
            this.animations.forEach((animation, index) => {
                animation.run();
                animation.currentFrame === animation.frameCount && this.animations.splice(index, 1)
            });
            this.setTagFromData();
        }

        setTagFromData(){
            var x = -this.clamp((this.x-256),0,256);
            var y = -this.clamp((this.y-100),0,256);
            this.tag.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${this.ang}deg) scale(${this.scaleX}, ${this.scaleY})`;
            // console.log(this.tag.style.transform)
        }

        clamp(num, min, max) {
          return num <= min ? min : num >= max ? max : num;
        }
    }
)


class CameraAnimation{
    /**
     * @callback animationFunct
     * @param {number} frame The current frame of the animation
    */
   /**
    * @callback finishFunct
    */

    /** 
     * @param {number} frameCount The total number of frames the animation will run on.
     * @param {animationFunct} animationFunct Called for each frame of animation
     * @param {finishFunct} finishFunct Called once the animation is finihsed 
     */
    constructor(frameCount, animationFunct, finishFunct){
        //alert("CameraAnimation")
        this.currentFrame = 0;
        this.frameCount = frameCount;
        this.animationFunct = animationFunct;
        this.finishFunct = finishFunct
    }

    run = () => {
        this.currentFrame++;
        this.animationFunct(this.currentFrame);
        this.currentFrame === this.frameCount && this.finishFunct(); 
    }
}