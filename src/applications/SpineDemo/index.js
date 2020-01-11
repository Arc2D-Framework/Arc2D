
import '/framework/src/core/lang/Thread.js';

namespace `applications` (
    @stylesheets(["/src/./index.css"]);
    class SpineDemo extends w3c.ui.Application {
        onConnected() {
            this.render();
   //          var thread = new core.lang.Thread(function(e){
   //          	console.log(e.data)
   //          	postMessage('msg from worker:' + e.data);
   //          });

   //          thread.onmessage = function (event) {
			//     console.log("worker",event.data);
			// };
   //          thread.postMessage("123");

            // alert(this.render.toString())
            // this.lastFrameTime = Date.now() / 1000;
            // MainLoop.setBegin(this.render)
            // window.addEventListener("resize", e=>this.resize(e),false);
            this.canvas = document.getElementById("canvas");
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			var config = { alpha: false };
			this.gl = this.canvas.getContext("webgl", config) || this.canvas.getContext("experimental-webgl", config);
			if (!this.gl) {
				alert('WebGL is unavailable.');
				return;
			}
			this.mvp = new spine.webgl.Matrix4();
			this.activeSkeleton = "spineboy";
			this.skeletons = {};

			this.shader = spine.webgl.Shader.newTwoColoredTextured(this.gl);
			this.batcher = new spine.webgl.PolygonBatcher(this.gl);
			this.mvp.ortho2d(0, 0, this.canvas.width - 1, this.canvas.height - 1);
			this.skeletonRenderer = new spine.webgl.SkeletonRenderer(this.gl);
			// this.debugRenderer = new spine.webgl.SkeletonDebugRenderer(this.gl);
			// this.debugRenderer.drawRegionAttachments = true;
			// this.debugRenderer.drawBoundingBoxes = true;
			// this.debugRenderer.drawMeshHull = true;
			// this.debugRenderer.drawMeshTriangles = true;
			// this.debugRenderer.drawPaths = true;
			// this.debugShader = spine.webgl.Shader.newColored(this.gl);
			this.shapes = new spine.webgl.ShapeRenderer(this.gl);
			this.assetManager = new spine.webgl.AssetManager(this.gl);


			// Tell AssetManager to load the resources for each model, including the exported .skel file, the .atlas file and the .png
			// file for the atlas. We then wait until all resources are loaded in the load() method.
			this.assetManager.loadBinary("resources/assets/spineboy-pro.skel");
			this.assetManager.loadTextureAtlas("resources/assets/spineboy-pma.atlas");
			// assetManager.loadBinary("assets/raptor-pro.skel");
			// assetManager.loadTextureAtlas("assets/raptor-pma.atlas");
			// assetManager.loadBinary("assets/tank-pro.skel");
			// assetManager.loadTextureAtlas("assets/tank-pma.atlas");
			// assetManager.loadBinary("assets/goblins-pro.skel");
			// assetManager.loadTextureAtlas("assets/goblins-pma.atlas");
			// assetManager.loadBinary("assets/vine-pro.skel");
			// assetManager.loadTextureAtlas("assets/vine-pma.atlas");
			// assetManager.loadBinary("assets/stretchyman-pro.skel");
			// assetManager.loadTextureAtlas("assets/stretchyman-pma.atlas");
			// assetManager.loadBinary("assets/coin-pro.skel");
			// assetManager.loadTextureAtlas("assets/coin-pma.atlas");
			//requestAnimationFrame(load);
			this.load();
        }


        onUpdate(delta){
        	if(this.loading_complete){
	        	if (Key.isDown(Key.RIGHT)) {
	        		if(!this.isWalking){
	        			this.idle=false;
	        			this.animationState.setAnimation(0, "walk", true);
	        			this.isWalking=true;
	        		}
	        		var sprite = this.skeletons["spineboy"];
	        		var skeleton 	= sprite.skeleton;
	        			skeleton.velocity += .0001 * delta;
	        		skeleton.x += skeleton.velocity;
	        		console.log("x",skeleton.x)

	        	}
	        	else  {
	        		// this.animationState.setAnimation(0, "idle", true);
	        		this.isWalking=false;
	        	}

	        	if(!this.isWalking){
	        		if(!this.idle){
	        			this.animationState.setAnimation(0, "idle", true);
	        			this.idle=true;
	        		}
	        	}
	        	
	        	// if (Key.isDown(Key.UP)) {
	        	// 	this.animationState.setAnimation(0, "jump", false);
	        	// 	// this.animationState.setAnimation(0, "idle", true);
	        	// }
	        }
        }

        onDraw(interpolation){
        	if(this.loading_complete){
        		this.gl.clearColor(0.3, 0.3, 0.3, 1);
				this.gl.clear(this.gl.COLOR_BUFFER_BIT);

				// Apply the animation state based on the delta time.
				var sprite = this.skeletons["spineboy"];
				var state 		= sprite.state;
				var skeleton 	= sprite.skeleton;
				var bounds 		= sprite.bounds;
				var premultipliedAlpha = sprite.premultipliedAlpha;
				state.update(0.016);
				state.apply(skeleton);
				skeleton.updateWorldTransform();

				// Bind the shader and set the texture and model-view-projection matrix.
				this.shader.bind();
				this.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0);
				this.shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.mvp.values);

				// Start the batch and tell the SkeletonRenderer to render the active skeleton.
				this.batcher.begin(this.shader);


				this.skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
				this.skeletonRenderer.draw(this.batcher, skeleton);
				this.batcher.end();

				this.shader.unbind();
				// this.resize()
        	}
        }


        load () {
			// Wait until the AssetManager has loaded all resources, then load the skeletons.
			if (this.assetManager.isLoadingComplete()) {
				this.skeletons["spineboy"] = this.loadSkeleton("spineboy-pro", "idle", true);
				this.skeletons["spineboy"].skeleton.velocity=6;
				this.loading_complete=true;
				this.resize()
				console.log("spine boy", this.skeletons["spineboy"]);
				// this.skeletons["spineboy"].skeleton.x=300;

			} else {
				setTimeout(_=>this.load(),100);
			}
		}


		loadSkeleton (name, initialAnimation, premultipliedAlpha, skin) {
			if (skin === undefined) skin = "default";

			// Load the texture atlas using name.atlas from the AssetManager.
			this.atlas = this.assetManager.get("resources/assets/" + name.replace("-ess", "").replace("-pro", "") + (premultipliedAlpha ? "-pma": "") + ".atlas");

			// Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
			this.atlasLoader = new spine.AtlasAttachmentLoader(this.atlas);

			// Create a SkeletonBinary instance for parsing the .skel file.
			var skeletonBinary = new spine.SkeletonBinary(this.atlasLoader);

			// Set the scale to apply during parsing, parse the file, and create a new skeleton.
			var skeletonData = skeletonBinary.readSkeletonData(this.assetManager.get("resources/assets/" + name + ".skel"));
			var skeleton = new spine.Skeleton(skeletonData);
			skeleton.setSkinByName(skin);
			var bounds = this.calculateBounds(skeleton);

			// Create an AnimationState, and set the initial animation in looping mode.
			var animationStateData = new spine.AnimationStateData(skeleton.data);
			var animationState = new spine.AnimationState(animationStateData);
			if (name == "spineboy") {
				// animationStateData.setMix("walk", "jump", 0.4)
				// animationStateData.setMix("jump", "run", 0.4);
				// animationState.setAnimation(0, "walk", true);
				// var jumpEntry = animationState.addAnimation(0, "jump", false, 3);
				// animationState.addAnimation(0, "run", true, 0);
			} else {
				// animationStateData.setDefaultMix(0.1);
				animationStateData.setMix("idle", "walk", 0.05);
				animationStateData.setMix("walk", "idle", 0.5);
				// animationStateData.setMix("jump", "run", 0.25);
				// animationStateData.setMix("walk", "shoot", 0);
				this.animationState=animationState;
				this.animationStateData = animationStateData;
				animationState.setAnimation(0, "idle", true);
			}
			animationState.addListener({
				start: function(track) {
					// console.log("Animation on track " + track.trackIndex + " started");
				},
				interrupt: function(track) {
					// console.log("Animation on track " + track.trackIndex + " interrupted");
				},
				end: function(track) {
					// console.log("Animation on track " + track.trackIndex + " ended");
				},
				disposed: function(track) {
					// console.log("Animation on track " + track.trackIndex + " disposed");
				},
				complete: function(track) {
					// console.log("Animation on track " + track.trackIndex + " completed");
				},
				event: function(track, event) {
					// console.log("Event on track " + track.trackIndex + ": " + JSON.stringify(event));
				}
			})

			// Pack everything up and return to caller.
			return { skeleton: skeleton, state: animationState, bounds: bounds, premultipliedAlpha: premultipliedAlpha };
		}


		calculateBounds(skeleton) {
			skeleton.setToSetupPose();
			skeleton.updateWorldTransform();
			var offset = new spine.Vector2();
			var size = new spine.Vector2();
			skeleton.getBounds(offset, size, []);
			return { offset: offset, size: size };
		}


		resize () {
			var w = window.innerWidth;
			var h = window.innerHeight;
			var bounds = this.skeletons[this.activeSkeleton].bounds;
			if (this.canvas.width != w || this.canvas.height != h) {
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
			}

			// magic
			var centerX = bounds.offset.x + bounds.size.x / 2;
			var centerY = bounds.offset.y + bounds.size.y / 2;
			var scaleX = bounds.size.x / canvas.width;
			var scaleY = bounds.size.y / canvas.height;
			var scale = Math.max(scaleX, scaleY) * 1.2;
			if (scale < 1) scale = 1;
			var width = this.canvas.width * scale;
			var height = this.canvas.height * scale;

			this.mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height);
			this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		}

    }
);
