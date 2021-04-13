
namespace `domain.maps` (
    class TiledMap {
        constructor (path){
            this.path       =path;
            this.map        =null;
            this.tilesets   =[];
            this.collisions ={};
            this.objects    =[];
        }

        async load(){
            var response = await fetch(this.path);
            this.map = await response.json();
            

            return new Promise(async (resolve,fail)=>{
                await this.processImageLayers();
                await this.processTilesets();
                await this.processObjects();
                resolve(this)
            })
        }

        async processTilesets(){
            for(let tileset of this.map.tilesets){
                var tilesetPath = this.path.substr(0,this.path.lastIndexOf("/"));
                var response = await fetch(tilesetPath +"/" + tileset.source.replace("tsx","json"));
                var _tileset = await response.json();
                    _tileset.firstgid = tileset.firstgid;
                    var img = new Image;
                        img.src = tilesetPath +"/" + _tileset.image;
                        _tileset.src = _tileset.image;
                        _tileset.image = img;//rewrite prop
                    await awaitLoad(img);
    
                this.tilesets.push(_tileset);
                this.processBounds(_tileset)
            }

            function awaitLoad(img) {
                return new Promise((resolve, fail) => {
                    img.addEventListener('load', () => {
                        resolve();
                    });
                })
            } 
            console.log("All Tilesets For TiledMap",this.tilesets)
        }

        async processImageLayers(){
            for(var i=0; i<=this.layers.length-1; i++){
                var layer = this.layers[i];
                if(layer.type=="imagelayer"){
                    var imagepath = this.path.substr(0,this.path.lastIndexOf("/"));
                    var img = new Image;
                        img.src = imagepath +"/" + layer.image;
                        layer.image=img;
                }
            }
        }

        async processObjects(){
            for(var i=0; i<=this.layers.length-1; i++){
                var layer = this.layers[i];
                if(layer.type=="objectgroup"){
                    for(var j=0; j<=layer.objects.length-1; j++){
                        var object = layer.objects[j];
                            object.bounds = this.collisions[object.gid]
                            object.tileset = this.getTilesetByGid(object.gid)
                            object.image = object.tileset.image.cloneNode();
                        this.objects.push(object)
                    }
                }
            }
        }

        //for each tileset (holding collision bounds as <tilesseet.objectgroup.objects[]>), 
        //add collision objects globally to map.collissions{}, keyed by maps tile type id.
        //ex usage from world/collider:
        //  this.map.collisions[177] where 177 is the tile type id
        //  returns array of collision objects for this 1 tile
        processBounds(tileset){
            tileset.bounds = tileset.tiles;
            if(tileset && tileset.tiles){
                for(var i=0; i<=tileset.tiles.length-1; i++){
                    var tile = tileset.tiles[i];
                    var key  = tileset.firstgid <=1 ? tile.id+1 : tileset.firstgid;
                    this.collisions[key] = tile.objectgroup.objects;
                }
            }
            delete tileset.tiles;
        }

        get layers(){
            return this.map.layers;
        }

        get height(){
            return this.map.height;
        }

        get width(){
            return this.map.width;
        }

        get tilewidth(){
            return this.map.tilewidth;
        }

        get tileheight(){
            return this.map.tileheight;
        }

        getTilesets(){
            return this.tilesets;
        }

        //only used by layer 0 tto get tileset/atlas due to a tiled bug, mussst be accessed differently.
        getTilesetByIndex(index){
            return this.tilesets[index];
        }

        getTile (layer, col, row) {
            return this.map.layers[layer].data[row * this.map.height + col];
        }

        getCol (x) {
            return Math.floor(x / this.width);
        }

        getRow (y) {
            return Math.floor(y / this.height);
        }

        getX (col) {
            return col * this.width;
        }
        
        getY (row) {
            return row * this.height;
        }

        //returns a tileset/atlas for the layer based on MaterialSource property
        getTilesetForLayerByMaterialSource(layer){
            if(layer){
                if(layer.properties){
                    var material = layer.properties.filter(prop => prop.name == "MaterialSource");//ex: "TilesetPack_RockSand.tsx"
                    if(material && material.length>0){
                        var tileset = this.tilesets.filter(tileset => {
                            // debugger;
                            return tileset.name == material[0].value.replace(".tsx","")
                        });//ex: "tileset.name is like "TilesetPack_RockSand"
                        if(tileset && tileset.length>0) {
                            return tileset[0];
                        }
                        else {
                            console.error(`${this.namespace}#getTilesetForLayerByMaterialSource(<layer>) - no tileset matches the material used in this layer`,[layer,material])
                        }
                    }
                    else {
                        console.error(`${this.namespace}#getTilesetForLayerByMaterialSource(<layer>) - no 'MaterialSource' (a Tiled custom property) found for this layer in the map. Layer is:`, layer)
                    }
                }
                else {
                    console.error(`${this.namespace}#getTilesetForLayerByMaterialSource(<layer>) - no Tiled custom properties found for this layer in the map. Layer is:`, layer)
                }
            }
            else {
                console.error(`${this.namespace}#getTilesetForLayerByMaterialSource(<layer>) - <layer> arg is null or undefined. layer is:`, layer)
            }
        }

        getTilePositionFor(tileset, tileType, layerIndex){
            if(tileset.firstgid != 1){
                // debugger;
            }
            var firstgid = Number(tileset.firstgid);
            var tileType = tileType-firstgid;
            // layerIndex <=0 ? (tileType -= 1):null;//Tiled Bug 

            var index = tileType;
            var col = index % tileset.columns; 
            var row = Math.floor(index / tileset.columns);

            var x = col*tileset.tilewidth;
            var y = row*tileset.tileheight;

            return {col,row,x,y}
        }

        getTilesetByGid(gid){
            var tilesets = this.tilesets.filter(ts => ts.firstgid == gid);
            return tilesets[0];
        }

        get2DLayer(layerIndex){
            var layer = this.map.layers[layerIndex];
            var newArr = [];
            while(layer.data.length) newArr.push(layer.data.splice(0,this.map.width));
            return newArr;
        }
    }
);
