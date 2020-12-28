import! 'docs.topics.Topic';
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
        }

        onMouseMove(e) {
          const { offsetWidth: width, offsetHeight: height } = document.body;
          let { pageX: x, pageY: y } = e
          const xMovement = Math.round((x / width * this.movement) - (this.movement / 2)*.8) 
          const yMovement = Math.round((y / width * this.movement) - (this.movement / 2)*.8) 
          // console.log(x,y)
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

        // onEnterActivity(c,scrollToElement){
        //     console.log("onEnterActivity", c);
        //     var slot = this.onFindActivitySlot();
        //         slot.innerHTML="";
        //         slot.appendChild(c);
        //     this.currentActivity = c;
        //     this.onEnterActivityRestoreScroll(scrollToElement)
        //     this.dispatchEvent("onactivityshown",c);
        // }

        // onFindActivitySlot(){
        //     var slot = this._activitySlot||this._view_slot;
        //     if(!slot) {
        //         slot=document.body;
        //         console.warn(`${this.namespace}#onFindActivitySlot() - unable to find a <slot|div name='view-port'></slot|div> for loading views. Using <body> as fallback.`)
        //     }
        //     this._activitySlot = slot;
        //     return slot||this
        // }

        // onExitCurrentActivity(c){
        //     this.onExitActivitySaveScroll()
        //     console.log("onExitCurrentActivity", c);
        //     this.lastActivity=c;
        //     // var slot = this.onFindActivitySlot();
        //     //     slot.innerHTML="";
        // }

        // onResumeActivity(c){
        //     console.log("onResumeActivity", c);
        // }

        // onLoadingActivity(c){
        //     console.log("onLoadingActivity", c);
        // }
        
    }
);
