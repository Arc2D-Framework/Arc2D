namespace `experiments.tiled.renderers.canvas`(
    class Scene{
        constructor(map){
            this.map = map;
            this.buffer = document.createElement('canvas').getContext('2d');
            this.objects = {};
        }

        drawLayer(layerIndex, layerObject){

            switch(layerObject.type){
                case "tilelayer":
                    const img = document.createElement('canvas').getContext('2d');
                    img.canvas.width = layerObject.width * this.map.tilewidth;
                    img.canvas.height = layerObject.height * this.map.tileheight;
                    for(let row = 0; row < layerObject.height; row++){
                        for(let col = 0; col < layerObject.width; col++){
                            let tileTypeID = this.map.getTile(layerIndex,col, row);
                            if( tileTypeID === 0) continue;
                            let tileset = layerIndex === 0 ?
                                this.map.getTilesetByIndex(layerIndex):
                                this.map.getTilesetForLayerByMaterialSource(layerObject);
                            let tilepos = this.map.getTilePositionFor(tileset, tileTypeID, layerIndex);//returns {col,row,x,y}
                            let x = col * this.map.tilewidth;
                            let y = row * this.map.tileheight;
                            img.drawImage(
                                tileset.image, 
                                tilepos.x, 
                                tilepos.y, 
                                this.map.tilewidth, 
                                this.map.tileheight, 
                                x,
                                y,
                                this.map.tilewidth,
                                this.map.tilewidth
                            );
                        }   
                    }
                break;
                case "imagelayer":
                    //Screw image layers
                break;
                case "objectgroup":
                    let objects = layerObject.objects;
                    if(objects){
                        for(let i=0; i < objects.length; i++){
                            let object = objects[i];
                            if(object.gid){
                                var tileset = this.map.getTilesetByGid(object.gid);
                                var img = object.image;
                                img.style.position="absolute";
                                img.style.left = `${object.x}px`;
                                img.style.top  = `${object.y}px`;
                                layerdiv.appendChild(img);
                            }
                            else {
                            }  
                        }
                    }
                break;
            }
        }
        addObject(){

        }

        onDraw(){

        }

        render(camera, context){
            camera.render(this.buffer, context);
        }
    }
)