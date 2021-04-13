namespace `system.renderers.html` (
    class Topdown {
        constructor(context, map){
            this.map=map;
            this.context=context;
        }

        onDraw(){
            if(!this.already_drawn){
                for(let i = 0; i < this.map.layers.length; i++){
                    var layer = this.map.layers[i];
                        layer.visible && this.drawLayer(i,layer);
                }
            }
            this.already_drawn=true;

            // else {
            //     for(let i = 0; i < this.map.layers.length; i++){
            //         var layer = this.map.layers[i];
            //             layer.visible && this.drawLayer(i,layer);
            //     }
            // }
            
        }

        // drawDepth(){
        //     var objects = this.map.objects;
        //     if(objects){
        //         for(var i=0; i<=objects.length-1;i++){
        //             let object = objects[i];
        //                 (object.image||object).style.zIndex=i
        //             /*if(object.gid){
        //                 let img = object.image;
        //                 img&&(img.style.zIndex=i);
        //             }
        //             else {
        //                 object&&(object.style.zIndex=i);
        //             } */ 
        //         }
        //     }
        // }

        drawLayer (layerIndex, layerObject) {
            var layerdiv = document.createElement("div");
                layerdiv.classList.add("layer");
                layerdiv.classList.add(layerObject.name);

            if(layerObject.type=="tilelayer"){
                for (var r = 0; r < this.map.height; r++) {
                  for (var c = 0; c < this.map.width; c++) {
                    var tileTypeID = this.map.getTile(layerIndex,c, r);
                    if( tileTypeID === 0) continue;
                    var tileset = layerIndex === 0 ?
                        this.map.getTilesetByIndex(layerIndex):
                        this.map.getTilesetForLayerByMaterialSource(layerObject);
                    var tilepos = this.map.getTilePositionFor(tileset, tileTypeID, layerIndex);//returns {col,row,x,y}
                    var x = c * this.map.tilewidth;
                    var y = r * this.map.tileheight;
                    this.appendTile(tilepos, {x, y}, c, r, layerdiv)
                  }
                }
            }
            else if(layerObject.type=="imagelayer"){
                var img = layerObject.image;
                    img.style.position="absolute";
                    img.style.left = layerObject.offsetx+"px";
                    img.style.top  = layerObject.offsety+"px";
                layerdiv.appendChild(img);
            }
            else if(layerObject.type=="objectgroup"){
                var objects = this.map.objects;

                if(objects){
                    for(var i=0; i<=objects.length-1;i++){
                        var object = objects[i];
                        if(object.gid){
                            var tileset = this.map.getTilesetByGid(object.gid);
                            var img = object.image;
                            img.style.position="absolute";
                            // img.style.left = `${object.x}px`;
                            // img.style.top  = `${object.y}px`;
                            // img.style.height = `${object.height}px`;
                            img.style.left = `0px`;
                            img.style.top  = `0px`;
                            img.style.transform = `translate3d(${object.x}px, ${object.y}px, 0px)`;
                            layerdiv.appendChild(img);
                        }
                        else {
                            object.style.position="absolute";
                            // object.style.left = `${object.x}px`;
                            // object.style.top  = `${object.y}px`;
                            object.style.left = `0px`;
                            object.style.top  = `0px`;
                            object.style.transform = `translate3d(${object.x}px, ${object.y}px, 0px)`;
                            // img.style.height = `${object.height}px`;
                            layerdiv.appendChild(object);
                        }  
                    }
                }
            }
            this.context.appendChild(layerdiv)
        }


        // voffset(layer){
        //     if(layer.properties){
        //         var voffset = layer.properties.filter(prop => prop.name == "voffset");
        //         if(voffset && voffset[0]){
        //             return voffset[0].value;
        //         } else {return 0}
        //     }
        //     return 0;
        // }

        //place a tile at <pt>, <tilepos> for background image from sprite sheet
        appendTile(tilepos, pt, map_col, map_row, layer){
            var xpos = pt.x + "px";
            var ypos = pt.y + "px";
            var tile = document.createElement("div");
                tile.classList.add("tile");
                // tile.setAttribute("tile-type",JSON.stringify(tilepos));
                tile.setAttribute("tile-col",map_col);
                tile.setAttribute("tile-row",map_row);
                tile.style.left = xpos;
                tile.style.top  = ypos;
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