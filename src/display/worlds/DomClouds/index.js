import 'display.components.Splash';

namespace `display.worlds` (
    class DomClouds extends World {
        constructor(element){
            super(element);
            this.layers = [];
            this.objects = [];
        }

        async onConnected() {
            await super.onConnected();
            this.world = this.querySelector( '#world' );
            this.viewport = this.querySelector( '#viewport1' );
            this.fpsCounter = this.querySelector("#fpscounter");

            this.d = 700;//depth
            this.p = 400;//perspective
            this.worldXAngle = 0;
            this.worldYAngle = 0;

            this.viewport.style.perspective= this.p;

            window.addEventListener( 'mousewheel', e=>this.onContainerMouseWheel(e) );
            window.addEventListener( 'DOMMouseScroll', e=>this.onContainerMouseWheel(e) );
            window.addEventListener( 'mousemove', e=>this.onMouseMove(e) );
            window.addEventListener( 'touchmove', e=>this.onMouseMove(e) );
            this.generate();//make clouds
        }

        onFixedUpdate = (delta) => {
            for( var j = 0; j < this.layers.length; j++ ) {
                var layer = this.layers[ j ];
                layer.data.a += layer.data.speed*delta;
            }
        }

        //LETS DRAW ALL OF THE UPDATES
        onDraw = (delta) => {
            if(!this.world){return}

            var t = 'translateZ( ' + this.d + 'px ) rotateX( ' + this.worldXAngle + 'deg) rotateY( ' + this.worldYAngle + 'deg)';
            this.world.style.transform = t;

            for( var j = 0; j < this.layers.length; j++ ) {
                var layer = this.layers[ j ];
                var t = `translate3d(${layer.data.x}px,${layer.data.y}px,${layer.data.z}px)` + ' rotateY( ' + ( - this.worldYAngle ) + 'deg ) rotateX( ' + ( - this.worldXAngle ) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
                layer.style.transform = t;
            }
        }

        onUpdateEnd = (fps, panic) =>{
            super.onUpdateEnd(fps, panic);
            if(this.fpsCounter){
                this.fpsCounter.textContent = Math.round(fps) + ' FPS';
            }
        }


        //Updates worldYAngle, worldXAngle with mouse.
        onMouseMove ( e ) {
            var x = e.clientX || e.touches&&e.touches[ 0 ].clientX;
            var y = e.clientY || e.touches&&e.touches[ 0 ].clientY;

            this.worldYAngle = -( .5 - ( x / window.innerWidth ) ) * 180;
            this.worldXAngle = ( .5 - ( y / window.innerHeight ) ) * 180;
            // e.preventDefault();
        }

        //Updates depth on zoom in|out with mouse
        onContainerMouseWheel( e ) {
            e = e ? e : window.event;
            this.d = this.d - ( e.detail ? e.detail * -5 : e.wheelDelta / 8 );
            //e.preventDefault();
        }


        //generate many clouds
        generate() {
            this.objects = [];
            this.world.innerHTML="";

            for( var j = 0; j < 10; j++ ) {
                this.objects.push( this.createCloud() );
            }
        }

        //make 1 cloud, add it to world
        createCloud() {
            var x = 256 - ( Math.random() * 512 );
            var y = 256 - ( Math.random() * 512 );
            var z = 256 - ( Math.random() * 512 );
            var t = `translate3d(${x}px,${y}px,${z}px)`;
            var div = document.createElement( 'div'  );
                div.className = 'cloudBase';
                div.style.transform = t;
            

            for( var j = 0; j < 5 + Math.round( Math.random() * 10 ); j++ ) {
                var cloud = document.createElement( 'img' );
                    cloud.style.opacity = .8;
                    cloud.setAttribute( 'src', '/src/display/worlds/DomClouds/images/cloud.png' );
                    cloud.className = 'cloudLayer';

                var x = 256 - ( Math.random() * 512 );
                var y = 256 - ( Math.random() * 512 );
                var z = 100 - ( Math.random() * 200 );
                var a = Math.random() * 360;
                var s = .25 + Math.random();
                x *= .2; 
                y *= .2;
                cloud.data = {
                    x: x,
                    y: y,
                    z: z,
                    a: a,
                    s: s,
                    speed: .003 * Math.random()
                };
                var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
                cloud.style.transform = t;
                div.appendChild( cloud );
                this.layers.push( cloud );
            }
            this.world.appendChild(div);
            return div;
        }
    }
);










