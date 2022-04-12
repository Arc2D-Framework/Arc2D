import '@system.input.KeyBoard';
import * as THREE from '3d';
import { FBXLoader } from 'FBXLoader';
import RGBELoader from 'RGBELoader';
import OrbitControls from 'OrbitControls';
import { RoughnessMipmapper } from '/src/system/libs/RoughnessMipmapper.js';

namespace `ui.worlds` (
    class ThreeDemo2 extends World {
        async onConnected() {
            await super.onConnected();
            window.addEventListener( 'resize', e=>this.onWindowResize(e) );
            this.clock = new THREE.Clock();
            var scene       = this.scene    = new THREE.Scene();
            var camera      = this.camera   = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            var renderer    = this.renderer = new THREE.WebGLRenderer({ antialias: true });
            var controls    = this.controls = new OrbitControls( camera, renderer.domElement );
            const roughnessMipmapper = new RoughnessMipmapper( renderer );
            
            //HDR LIGHTING
            // new RGBELoader()
            //     .setDataType( THREE.UnsignedByteType )
            //     .setPath( '/resources/3d/textures/equirectangular/' )
            //     .load( 'quarry_01_1k.hdr', function ( texture ) {
            //         var pmremGenerator = new THREE.PMREMGenerator( renderer );
            //             pmremGenerator.compileEquirectangularShader();
            //         const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
            //         scene.background  = envMap;
            //         scene.environment = envMap;
            //         texture.dispose();
            //         pmremGenerator.dispose();
            //     });
                    
            
            //MODEL
            // var loader = new GLTFLoader();//.setPath( '/resources/3d/DamagedHelmet/glTF/' );
                // new GLTFLoader().load('/resources/3d/DamagedHelmet/glTF/DamagedHelmet.gltf', gltf => {
                //     gltf.scene.traverse( function ( child ) {

                //         if ( child.isMesh ) {

                //             roughnessMipmapper.generateMipmaps( child.material );

                //         }

                //     } );
                    
                //     scene.add(gltf.scene);
                //     roughnessMipmapper.dispose();
                // });


            //CAMERA
            camera.position.set(0.8, 1.4, 1.0)
            // camera.position.x = 3;
            // camera.position.y = 1;
            // camera.position.z = 0;
            // camera.lookAt(this.scene.position);
            // camera.position.setLength(-2);
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
            // controls.minDistance = 2;
            // controls.maxDistance = 10;
            controls.target.set( 0, 1, 0);
            controls.update();
            
            //SCENE
            scene.add( new THREE.AmbientLight( 0xcccccc, 1) );
            scene.add(camera);
            
            this.mixer=null;
            this.activeAction=null;
            this.lastAction=null;
            var fbxLoader = new FBXLoader;
            this.animationActions = [];
            fbxLoader.load('/resources/3d/vanguard/vanguard_t_choonyung.fbx', (object) => {
                    object.scale.set(0.01, 0.01, 0.01)
                    this.mixer = new THREE.AnimationMixer(object)

                    // var animationAction = this.mixer.clipAction(object.animations[0])
                        // this.animationActions.push(animationAction)
                        // animationsFolder.add(animations, 'default')
                    // activeAction = animationActions[0]

                    scene.add(object)
                    // this.ready=true;


                    fbxLoader.load('/resources/3d/vanguard/vanguard@meele1.fbx', (object) => {
                            console.log('loaded meele1 animation');
                            // (object as THREE.Object3D).animations[0].tracks.shift() //delete the specific track that moves the object forward while running
                            //console.dir((object as THREE.Object3D).animations[0])
                            var animationAction = this.mixer.clipAction(object.animations[0])
                            this.animationActions.push(animationAction)
                            // animationsFolder.add(animations, 'goofyrunning')
                            // this.activeAction = this.animationActions[0];
                            // modelReady = true
                            this.ready=true;
                            console.log("this.animationActions",this.animationActions)
                        },
                        (xhr) => {
                            console.log(
                                (xhr.loaded / xhr.total) * 100 + '% loaded'
                            )
                        },
                        (error) => {
                            console.log(error)
                        }
                    )
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            )
            // this.ready=true;
        }


        setAction(toAction) {
            // debugger;
            if (toAction != this.activeAction) {
                this.lastAction = this.activeAction
                this.activeAction = toAction
                //lastAction.stop()
                this.lastAction && this.lastAction.fadeOut(1)
                // this.activeAction.reset()
                // this.activeAction.fadeIn(1)
                this.activeAction.play()
            }
        }

        getSimulationTimestep(){ return 1000/30 }

        onFixedUpdate = (time,delta) =>{
            // console.log(time)
        }

        onUpdate = (timestamp, delta)=>{
            // console.log(delta)
            // this.mixer.update(this.clock.getDelta())
            // this.mixer.update(this.clock.getDelta())
        }

        onDraw = (interpolation) => {
            if(this.ready){
                this.renderer.render( this.scene, this.camera );
                // console.log(this.clock.getDelta())
                this.mixer.update(this.clock.getDelta())
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