

namespace `display.components` (
    class CoverFlow extends WebComponent {
        async onConnected(){
            await super.onConnected();
            this.isHorizontal = true;
            this.tiles = Array.from(this.querySelectorAll("#carousel .tile"));
            
            this.panelWidth = this.isHorizontal ? 720 : 420;//TODO: dynamically get tiles width/height
            this.panelCount = this.tiles.length;
            this.axis = this.isHorizontal ? 'Y' : 'X';
            this.theta = 360 / this.tiles.length;
            this.radius = Math.round( ( this.panelWidth / 2 ) / Math.tan( ( ( Math.PI * 2 ) / this.tiles.length ) / 2 ) );
            this.rotation = 0;
            this.rotation = Math.round( this.rotation / this.theta ) * this.theta;

            this.on('click', e=>this.onRotate(-1), false, ".fa-caret-left");
            this.on('click', e=>this.onRotate(+1), false, ".fa-caret-right");
            this.align();
            this.rotate();
        }

        isComposable(){return true}//to allow slots

        //carousel spin direction
        onRotate(dir){
            this.rotation += this.theta * dir;
            this.rotate();
        }

        //aligns tiles within carousel into 3d circular layout
        align(){
            var tiles = this.tiles;
            for(var i=0; i<=tiles.length-1; i++){     
                tiles[i].style.transform = `
                    rotate${this.axis}(${i*this.theta}deg) 
                    translateZ(${this.radius}px)
                `
            }
        }

        //spins whole carousel in-place around X or Y
        rotate (){
            var carousel = this.querySelector("#carousel");
                carousel.style.transform = `
                    translateZ(-${this.radius}px) 
                    rotate${this.axis}(${this.rotation}deg)
                `
        }
    }
);