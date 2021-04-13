namespace `experiments.tiled.renderers.html` (
    class Isometric {
        //context for this renderer is the parent component (a dom element).
        //For a canvas, it would be 2D Context. <map> is an instance of 
        //a Tiled Map
        constructor(context, map){
            this.map=map;
            this.context=context;
        }

        //onDraw on tthis renderer only called once, because DOM
        //never needs redrawing. For a canvas renderer, should be 
        //called in Worlds onDraw loop.
        onDraw(){
            var layers    = this.map.layers;
            for(var layer = 0; layer <= layers.length-1; layer++){
                if(!layers[layer].visible){
                    continue
                }
                var d = document.createElement("div");//make a new layer nodee
                    d.classList.add("layer");//a general class for styling
                    d.classList.add(layers[layer].name)//a more specific class for styling (Ex: Boulders, or Trees)
                for (var r = 0; r < this.map.height; r++) {
                  for (var c = 0; c < this.map.width; c++) {
                    var x = (c - r) * this.map.tilewidth/2;//isometric x
                    var y = (c + r) * this.map.tileheight/2;//isometric y
                    var tileType = this.map.getTile(layer,c, r);//get tiletype in map at col, row for this layer
                    var voffset  = this.voffset(layers[layer]);//voffset is a custom layer property i created in Tiled for tthis layer
                    d.setAttribute("voffset",voffset)
                    if(tileType!=0){
                        var tileset;
                        //****IMPORTANT***: Tiled bug. Need this check.
                        if(layer == 0){//A bug in tiled. Must gett ttilesett for layer 0 differently, by it's index
                            tileset = this.map.getTilesetByIndex(layer);
                        }
                        else if(layer > 0){//else if not layer 0, get tileset as usual by 'MaterialSource', custom property on layer.
                            //Each layer in Tiled is painted on with 1 material. I've assigned another
                            //custom property in Tiled for each layer, called 'MaterialSource'. Ex:
                            //MaterialSource: TilesetPack_Trees.tsx. So getTilesetForLayerByMaterialSource()
                            //will return the loaded tilesest/spritesheet atlas.
                            tileset = this.map.getTilesetForLayerByMaterialSource(layers[layer]);
                        }
                        var tilepos = this.map.getTilePositionFor(tileset, tileType, layer);//returns {col,row,x,y}
                        this.placeTile2(tilepos, new experiments.tiled.Point(x, y+voffset), c, r, d)
                    }
                  }
                }
                //render to context. Since this is DOM-based, appendchild.
                this.context.appendChild(d)
            }
        }


        //voffset is a custom property i created in Tiled for this Layer. I am
        //picking it out from layer.properties. You can assign many. It allowed me to offsett my layer
        //vertically for more precise rendering in the DOM. Only had to offseset the Trees layer.
        voffset(layer){
            if(layer.properties){
                var voffset = layer.properties.filter(prop => prop.name == "voffset");
                if(voffset && voffset[0]){
                    return voffset[0].value;
                } else {return 0}
            }
            return 0;
        }

        //place a tile at <pt>, <tilepos> for background image from sprite sheet
        placeTile2(tilepos, pt, map_col, map_row, layer){
            var xpos = (pt.x) + "px";
            var ypos = (pt.y) + "px";
            var tile = document.createElement("div");
                tile.classList.add("tile");
                tile.setAttribute("tile-type",JSON.stringify(tilepos));
                tile.setAttribute("tile-col",map_col);
                tile.setAttribute("tile-row",map_row);
                tile.style.left = xpos;
                tile.style.top = ypos;
                tile.setAttribute("cart-x",xpos);
                tile.setAttribute("cart-y",ypos);
                tile.style["background-position"] = `-${tilepos.x}px -${tilepos.y}px`;
                layer.appendChild(tile)
        }

        //converts a screen x/y coord to map coords (row and col)
        screenXY_to_mapXY (x,y) {
            var coords = {};
            var w = this.map.tilewidth/2;
            var h = this.map.tileheight/2;
            coords.x = ((x / w) + (y / h))/2;
            coords.y = ((y / h) - (x / w))/2;
            coords.x -=1; // ?
            coords.x = Math.abs(Math.round(coords.x))
            coords.y = Math.abs(Math.round(coords.y))
            console.log("MAP COORDS", coords, [x,y])
        }
    }
)