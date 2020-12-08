import! 'core.ui.game.Point';
import! 'core.ui.game.Map';
import! 'core.ui.game.renderers.html.Isometric';

namespace `applications` (
    class IsoMap extends Application {
        constructor(element){
            super(element);
            this.addEventListener("click", e => this.onTileClicked(e), false, ".tile");
        }

        async onConnected() {
            await super.onConnected();
            this.map = new core.ui.game.Map("resources/maps/ShiningWars2.json");
            await this.map.load();
            this.renderer = new core.ui.game.renderers.html.Isometric(this/*Context*/, this.map/*Map*/);
            this.renderer.onDraw();
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
                });
                tilenodes.sort(function(a, b) {
                  return (a.dist == b.dist) ? 0 : (a.dist > b.dist ? 1 : -1);
                });
            console.log("objects in proximity of click", tilenodes)
            var target = tilenodes.shift();
            console.log(mx,my)
            console.log("top most object", target);
            this.renderer.screenXY_to_mapXY(mx+scrollLeft,my+scrollTop);
        }
    }   
);
