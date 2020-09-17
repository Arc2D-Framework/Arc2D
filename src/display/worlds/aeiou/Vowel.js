
namespace `display.worlds.aeiou` (
    @tag("vowel-sound");
    class Vowel extends WebComponent {
        constructor(sound) {
            super();
            this.sound = sound;
        }

        onLoadInstanceStylesheet(){return false}

        async onConnected() {
            await super.onConnected();
            this.addEventListener("click", e => this.onPlaySound());
            this.setAttribute("data-vowel",this.sound.vowel)
        }

        onPlaySound(){
            this.sound.audio.play();
        }

        template(){
            return `
                <template>
                    <div class="btn"><h1>${this.sound.vowel.toUpperCase()}</h1></div>
                </template>
            `
        }
    }
);
