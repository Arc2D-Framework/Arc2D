namespace `applications.box2d.entities.html` (
    class Box2DEntity extends w3c.ui.WebComponent  {
        constructor(hWidth,hHeight,world,stage,scale,element){
            super(element);
            this.hw     =hWidth;
            this.hh     =hHeight;
            this.world  =world;
            this.scale  =scale;
            this.stage  =stage;
        }

        cssStyle(){
            return `
                .Box2DEntity{
                    position:absolute;
                    top:0;left:0;
                    border: 2px solid black;
                    box-sizing:border-box;
                    z-index:1;
                }
            `
        }

        v2w(viewUnit) {
        // convert view to world units
        return (viewUnit / this._scaleFactor);
        }

        w2v(worldUnit) {
            // convert world to view units
            return (worldUnit * this._scaleFactor);        
        }

        onLoadInstanceStylesheet(){return false}
    }
)