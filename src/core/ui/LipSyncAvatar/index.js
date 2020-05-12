import 'src/core/ui/LipSyncAvatar/num2str.js';

namespace `core.ui` (
	class LipSyncAvatar extends w3c.ui.WebComponent  {
        constructor(element){
            super(element);
            this.synth = window.speechSynthesis;
            this.voices = this.synth.getVoices();
            window.spk = this.spk.bind(this);
        }

        async onConnected(){
            await super.onConnected();
            this.botmouth   = this.querySelector("#botmouth");
            this.botLeye    = this.querySelector("#botLeye");
            this.botReye    = this.querySelector("#botReye");
            this.oldmouth   = this.botmouth.innerHTML;
            this.oldeye     = this.botLeye.innerHTML;
            setInterval(e=>this.blink(),4000);
        }

        spk(text) {
            this.mouthshape(text);
            const utterThis = new SpeechSynthesisUtterance(text);
            const selectedOption = "Alex";
            var voices = this.voices;
            for (var i = 0; i < voices.length-1; i++) {
                if(voices[i].name == selectedOption){
                    utterThis.voice = voices[i];
                }
            }
            utterThis.lang = "en-US";
            utterThis.pitch = 2.9;// * (text.length * 0.3);
            utterThis.rate = 1;
            this.synth.speak(utterThis);
        }

        async blink() {
          this.botReye.innerHTML = '-'; 
          this.botLeye.innerHTML = '-';
          await wait(100);//wait 100ms
              this.botReye.innerHTML = "o"; 
              this.botLeye.innerHTML = "o";
        }

        mouthshape(text) {
            var self=this;
          for (let i = 0, len = text.length; i < len; i++) {
                setTimeout( (function( i ) {
                  return function() {
                    self.lipsync(text[i]);
                  };
                }( i )), (80 * i) );
            } //for

            setTimeout(function() { 
                self.botmouth.innerHTML = self.oldmouth;
            }, text.length*90);
        } // end mouthshape

        lipsync(arg) {
            arg=arg.toLowerCase();
            var botmouth = this.botmouth;
            if (arg == ' ' || arg == '.') { botmouth.innerHTML = this.oldmouth;}
            if (arg == 'a') { botmouth.innerHTML = 'D';}
            if (arg == 'b') { botmouth.innerHTML = '|';}
            if (arg == 'c') { botmouth.innerHTML = 'D';}
            if (arg == 'd') { botmouth.innerHTML = '|';}
            if (arg == 'e') { botmouth.innerHTML = 'D';}
            if (arg == 'f') { botmouth.innerHTML = '|';}
            if (arg == 'g') { botmouth.innerHTML = '|';}
            if (arg == 'h') { botmouth.innerHTML = '|';}
            if (arg == 'i') { botmouth.innerHTML = 'D';}
            if (arg == 'j') { botmouth.innerHTML = 'I';}
            if (arg == 'k') { botmouth.innerHTML = 'I';}
            if (arg == 'l') { botmouth.innerHTML = 'P';}
            if (arg == 'm') { botmouth.innerHTML = '(';}
            if (arg == 'n') { botmouth.innerHTML = ')';}
            if (arg == 'o') { botmouth.innerHTML = 'o';}
            if (arg == 'p') { botmouth.innerHTML = '|';}
            if (arg == 'q') { botmouth.innerHTML = 'D';}
            if (arg == 'r') { botmouth.innerHTML = 'o';}
            if (arg == 's') { botmouth.innerHTML = ')';}
            if (arg == 't') { botmouth.innerHTML = '|';}
            if (arg == 'u') { botmouth.innerHTML = 'o';}
            if (arg == 'v') { botmouth.innerHTML = '/';}
            if (arg == 'w') { botmouth.innerHTML = 'o';}
            if (arg == 'x') { botmouth.innerHTML = 'x';}
            if (arg == 'y') { botmouth.innerHTML = 'D';}
            if (arg == 'z') { botmouth.innerHTML = '/';}
        }
    }
)