/**IMPORTANT**/
/*
    Each imageObject looks like this:
    {
        image: renderable (image element, canvas, etc),
        bouds: {x, y, w, h}, need for sorting
        uvs : {x, y, w, h}, optional
        pos : {x. y, w, h} need x and and y
    }
*/
namespace `experiments.tiled.renderers.canvas` (
    class Renderer{
        constructor(map){
            this.map = map;
            this.context = document.createElement('canvas').getContext('2d');
            this.context.canvas.width = this.map.width * this.map.tilewidth;
            this.context.canvas.height = this.map.height * this.map.tileheight
            this.layerImages = [];
            this.otherImages = [];

            for(let i = 0; i < this.map.layers.length; i++){
                const layer = this.map.layers[i];
                    layer.visible && this.drawLayer(i, layer);
            }
        }

        onDraw(objects = [], clear = false){
            const images = [...objects, ...this.layerImages];
            images.sort((a, b) => {
                return (a.bounds.y + a.bounds.h) - (b.bounds.y + b.bounds.h)
            });
            

            images.forEach(imageObject => {
                this.context.drawImage(
                    imageObject.image,
                    imageObject.uvs.x,
                    imageObject.uvs.y,
                    imageObject.uvs.w,
                    imageObject.uvs.h,
                    imageObject.pos.x,
                    imageObject.pos.y,
                    imageObject.pos.w,
                    imageObject.pos.h
                );
            });

            clear&&(this.otherImages = []);
        }

        addImage(image_object){ //used snek case to keep it interesting 😏
            this.otherImages.push(image_object);
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
                        this.layerImages.push({
                            image:img.canvas,
                            uvs: {x: 0, y: 0, w: img.canvas.width, h: img.canvas.height},
                            pos: {x: 0, y: 0, w: img.canvas.width, h: img.canvas.height},

                            /*We can overide the z by pushing the bounds to a negitive amount*/
                            bounds:{
                                x: 0,
                                y: 0,
                                h: -(this.map.layers.length - layerIndex),
                            }
                        })
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
                            console.log(object)
                            let tileset = this.map.getTilesetByGid(object.gid);
                            this.layerImages.push({
                                image: tileset.image,
                                uvs: {x: 0, y: 0, w: tileset.image.width, h: tileset.image.height},
                                pos: {x: object.x, y: object.y, w: tileset.image.width, h: tileset.image.height},
                                bounds: object.bounds
                            })
                        }
                    }
                break;
            }
        }
    }
);