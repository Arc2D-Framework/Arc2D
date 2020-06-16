import '/src/core/ui/game/KenSprite/index.js';

namespace `applications` (
    @stylesheets(["src/./index.css"]);
    class StreetFighter extends core.ui.World {
        constructor(element){
            super(element);
        }

        onConnected() {
            super.onConnected();
            window.sprites.push(this.querySelector("ken-sprite"));
        }
    }
);
