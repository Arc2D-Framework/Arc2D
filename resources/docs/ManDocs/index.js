import 'docs.topics.LoaderActivity';
import 'docs.components.TocMenu';
import 'docs.components.LanguageSelector';
import 'docs.topics.DocHome';
import 'docs.components.ReadingProgress';
import 'docs.components.DomView';
import 'docs.components.DomTreeView';

namespace `docs` (
    class ManDocs extends Application {
        constructor(element){
            super(element);
            this.addEventListener("lang-selected", e => this.onLanguageChange(e));
        }

        async onConnected() {
            await super.onConnected();
            this.add2DLogoEffect();
        }

        add2DLogoEffect(){
            this.text = this.querySelector('#frameworkname span')
            this.movement = 20;//total distance
            document.body.addEventListener("mousemove", e => this.onMouseMove(e));
            // this.wrapper = document.querySelector()
        }

        onMouseMove(e) {
          const { offsetWidth: width, offsetHeight: height } = document.body;
          let { offsetX: x, offsetY: y } = e
          const xMovement = Math.round((x / width * this.movement) - (this.movement / 2)*.8) 
          const yMovement = Math.round((y / width * this.movement) - (this.movement / 2)*.8) 

          this.text.style.textShadow = `${xMovement* -1}px ${yMovement* -1}px 4px rgba(0,0,0,.3)`
        }


        onLanguageChange(e){
            this.current_language = e.data;
        }


        onResumeActivity(c){
            super.onResumeActivity(c);
            this.dispatchEvent("topichanged",{});
        }

        onLoadingActivity(c){
            super.onLoadingActivity(c);
            this.dispatchEvent("topichanged",{});
            // application.dispatchEvent("showsplash"); //fire to show splash for each load
        }
        
    }
);
