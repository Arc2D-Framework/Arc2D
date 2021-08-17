import '@system.input.KeyBoard';
import * as THREE from '3d';
import GLTFLoader from 'GLTFLoader';
import RGBELoader from 'RGBELoader';
import OrbitControls from 'OrbitControls';

namespace `ui.worlds` (
    class ThreeDemo extends World {
        async onConnected() {
            await super.onConnected();
            window.addEventListener( 'resize', e=>this.onWindowResize(e) );

            var scene       = this.scene    = new THREE.Scene();
            var camera      = this.camera   = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
            var renderer    = this.renderer = new THREE.WebGLRenderer({ antialias: true });
            var controls    = this.controls = new OrbitControls( camera, renderer.domElement );

            
            //HDR LIGHTING
            new RGBELoader()
                .setDataType( THREE.UnsignedByteType )
                .setPath( '/resources/3d/textures/equirectangular/' )
                .load( 'royal_esplanade_1k.hdr', function ( texture ) {
                    var pmremGenerator = new THREE.PMREMGenerator( renderer );
                        pmremGenerator.compileEquirectangularShader();
                    const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
                    scene.background  = envMap;
                    scene.environment = envMap;
                    texture.dispose();
                    pmremGenerator.dispose();
                });
                    
            
            //MODEL
            var loader = new GLTFLoader();//.setPath( '/resources/3d/DamagedHelmet/glTF/' );
                loader.load('/resources/3d/DamagedHelmet/glTF/DamagedHelmet.gltf', gltf => scene.add(gltf.scene));


            //CAMERA
            camera.position.set( - 1.8, 0.6, 2.7 );
            camera.position.x = 3;
            camera.position.y = 1;
            camera.position.z = 0;
            camera.lookAt(this.scene.position);
            camera.add(new THREE.PointLight( 0xffffff, 0.8) );
            
            //RENDERER
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.setClearColor(0xEEEEEE);
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.physicallyCorrectLights = true;
            renderer.setPixelRatio( window.devicePixelRatio );
            
            this.appendChild( renderer.domElement );
            
            //CONTROLS
            // controls.addEventListener( 'change', this.onDraw ); // use if there is no animation loop
            controls.minDistance = 2;
            controls.maxDistance = 10;
            controls.target.set( 0, 0, - 0.2 );
            controls.update();
            
            //SCENE
            scene.add( new THREE.AmbientLight( 0xcccccc, 0.4) );
            scene.add(camera);

            this.ready=true;
        }

        onFixedUpdate = (time,delta) =>{
            
        }

        onUpdate = (timestamp, delta)=>{
            
        }

        onDraw = (interpolation) => {
            if(this.ready){
                this.renderer.render( this.scene, this.camera );
            }
        }

        onWindowResize(){
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize( width, height );
        }
    }
);