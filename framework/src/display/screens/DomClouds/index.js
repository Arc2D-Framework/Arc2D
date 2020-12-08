
namespace `applications` (
    class DomClouds extends core.ui.World {
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

            this.d = 700;
            this.p = 400;
            this.worldXAngle = 0;
            this.worldYAngle = 0;

            // this.viewport.style.webkitPerspective = this.p;
            // this.viewport.style.MozPerspective = this.p;
            // this.viewport.style.oPerspective = this.p;
            this.viewport.style.perspective

            window.addEventListener( 'mousewheel', e=>this.onContainerMouseWheel(e) );
            window.addEventListener( 'DOMMouseScroll', e=>this.onContainerMouseWheel(e) );
            window.addEventListener( 'mousemove', e=>this.onMouseMove(e) );
            window.addEventListener( 'touchmove', e=>this.onMouseMove(e) );
            this.generate();
        }

        onEnd(fps, panic){
            super.onEnd(fps, panic);
            if(this.fpsCounter){
                this.fpsCounter.textContent = Math.round(fps) + ' FPS';
            }
        }

        generate() {
            this.objects = [];
            if ( this.world.hasChildNodes() ) {
                while ( this.world.childNodes.length >= 1 ) {
                    this.world.removeChild( this.world.firstChild );
                }
            }

            for( var j = 0; j < 10; j++ ) {
                this.objects.push( this.createCloud() );
            }
        }

        updateView(delta) {
            var t = 'translateZ( ' + this.d + 'px ) rotateX( ' + this.worldXAngle + 'deg) rotateY( ' + this.worldYAngle + 'deg)';
            this.world.style.transform = t;
        }

        onDraw (delta){
            if(!this.world){
                return
            }
            this.updateView(delta);
            for( var j = 0; j < this.layers.length; j++ ) {
                var layer = this.layers[ j ];
                layer.data.a += layer.data.speed*delta;
                // var t = 'translateX( ' + layer.data.x + 'px ) translateY( ' + layer.data.y + 'px ) translateZ( ' + layer.data.z + 'px ) rotateY( ' + ( - this.worldYAngle ) + 'deg ) rotateX( ' + ( - this.worldXAngle ) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
                var t = `translate3d(${layer.data.x}px,${layer.data.y}px,${layer.data.z}px)` + ' rotateY( ' + ( - this.worldYAngle ) + 'deg ) rotateX( ' + ( - this.worldXAngle ) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
                layer.style.transform = t;
            }
        }

        onMouseMove ( e ) {
            var x = e.clientX || e.touches[ 0 ].clientX;
            var y = e.clientY || e.touches[ 0 ].clientY;

            this.worldYAngle = -( .5 - ( x / window.innerWidth ) ) * 180;
            this.worldXAngle = ( .5 - ( y / window.innerHeight ) ) * 180;
            e.preventDefault();
        }

        onContainerMouseWheel( e ) {
            e = e ? e : window.event;
            this.d = this.d - ( e.detail ? e.detail * -5 : e.wheelDelta / 8 );
            e.preventDefault();
        }

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
                    cloud.setAttribute( 'src', 'src/applications/DomClouds/images/cloud.png' );
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
                    speed: .1 * Math.random()
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










