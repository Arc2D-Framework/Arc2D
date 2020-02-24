import! 'core.ui.game.Point';
import! 'core.ui.game.Tileset';

namespace `applications` (
    class IsoMap extends w3c.ui.Application {
        constructor(element){
            super(element);
            this.bind(".tile", "click", e => this.onTileClicked(e), false);
        }

        onTileClicked(e){
            var w = this.map.tilewidth/2;
            var h = this.map.tileheight/2;
            var scrollLeft = document.documentElement.scrollLeft;
            var scrollTop = document.documentElement.scrollTop;

            var mx = e.src.pageX-scrollLeft;
            var my = e.src.pageY-scrollTop;
            var nodes = document.elementsFromPoint(mx,my);
            var tilenodes = nodes.filter(n => n.classList.contains("tile"));
                tilenodes.forEach(n =>{
                    var coordsA = n.getBoundingClientRect();
                    n.centerX = coordsA.left+ w;
                    n.centerY = coordsA.top + h;
                    n.distToPointX = Math.abs(n.centerX-mx);
                    n.distToPointY = Math.abs(n.centerY-my);
                    n.dist = n.distToPointX*n.distToPointX + n.distToPointY*n.distToPointY;
                })
                tilenodes.sort(function(a, b) {
                  return a.dist == b.dist
                          ? 0
                          : (a.dist > b.dist ? 1 : -1);
                });
            console.log("objects beneath", tilenodes)
            var target = tilenodes.shift();
            console.log(mx,my)
            console.log("sorted nodes", target);
            this.screen_to_map(mx+scrollLeft,my+scrollTop);
        }

        screen_to_map (x,y) {
            var map = {};
            var w = this.map.tilewidth/2;
            var h = this.map.tileheight/2;
            map.x = ((x / w) + (y / h))/2;
            map.y = ((y / h) - (x / w))/2;
            map.x -=1; // ?
            map.x = Math.abs(Math.round(map.x))
            map.y = Math.abs(Math.round(map.y))
            console.log("MAP COORDS", map, [x,y])
        }


        async onConnected() {
            super.onConnected();
            var response = await fetch('resources/maps/ShiningWars2.json');
            this.map = await response.json();

            this.tileset = new core.ui.game.Tileset(this.map);
            await this.tileset.load();
            this.renderMap()
        }

        getTile (layer, col, row) {
            return this.map.layers[layer].data[row * this.map.height + col];
        }


        placeTile2(tilepos,pt, map_col, map_row, layer){
                var tile = document.createElement("div");
                    tile.classList.add("tile");
                    var xpos = (pt.x) + "px";
                    var ypos = (pt.y) + "px";
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


        voffset(layer){
            if(layer.properties){
                var voffset = layer.properties.filter(prop => prop.name == "voffset");
                if(voffset && voffset[0]){
                    return voffset[0].value;
                } else {return 0}
            }
            return 0;
        }

        renderMap(){
            var layers    = this.map.layers;
            for(var layer = 0; layer <= layers.length-1; layer++){
                if(!layers[layer].visible){
                    continue
                }
                var d = document.createElement("div");
                    d.classList.add("layer");
                    d.classList.add(layers[layer].name)
                for (var r = 0; r < this.map.height; r++) {
                  for (var c = 0; c < this.map.width; c++) {
                    var x = (c - r) * this.map.tilewidth/2;
                    var y = (c + r) * this.map.tileheight/2;
                    var tileType = this.getTile(layer,c, r);
                    var voffset  = this.voffset(layers[layer]);
                    d.setAttribute("voffset",voffset)
                    if(tileType!=0){
                        var tileset = this.tileset.getTilesetByIndex(layer);
                        if(layer > 0){//Tiled Bug
                            tileset = this.tileset.getTilesetForLayerByMaterialSource(layers[layer]);
                        }
                        var tileType2 = this.tileset.getTileTypeById(tileset, tileType, layer);
                        this.placeTile2(tileType2, new core.ui.game.Point(x, y+voffset), c, r, d)
                    }
                  }
                }
                this.appendChild(d)
            }
        }
    }

    
);
