import '/framework/src/core/http/Router.js'
import 'docs.topics.LoaderActivity';
import 'docs.components.TocMenu';
import 'docs.components.LanguageSelector';
import 'docs.topics.DocHome';
import 'docs.components.ReadingProgress';
import 'docs.components.DomView';
import 'docs.components.DomTreeView';

namespace `docs` (
    class ManDocs extends w3c.ui.Application {
        constructor(element){
            super(element);
            this.addEventListener("lang-selected", e => this.onLanguageChange(e));
        }

        async onConnected() {
            await this.render();
            this.article_content = this.querySelector(".article-content");
            this.router = new core.http.Router(this,window);// <- onConnected, best place
        }


        onLanguageChange(e){
            this.current_language = e.data;
        }
    
        //When activity exits view
        onExitActivitySaveScroll(){
            if(this.currentActivity){
                this.currentActivity._scrollpos = this.article_content.scrollTop;
            }
        }

        //When activity enters view
        onEnterActivityRestoreScroll(scrollToElement=null){
            if(this.currentActivity){
                //like an achor
                if(scrollToElement){
                    wait(100).then(_=> {
                        var el = this.currentActivity.querySelector("#"+scrollToElement);
                        if (el) {
                            el.scrollIntoView({
                                behavior : "smooth",
                                block : "start"
                            });
                        }

                    })
                } else {//scroll to last y-axis
                    this.article_content.scrollTop = this.currentActivity._scrollpos||0;
                }
            }
        }

        onEnterActivity(c,scrollToElement){
            console.log("onEnterActivity", c);
            var slot = this.querySelector('.content');
	            slot.appendChild(c);
            this.currentActivity = c;
            this.onEnterActivityRestoreScroll(scrollToElement)
            this.dispatchEvent("onactivityshown",c);
        }

        onExitCurrentActivity(c){
            this.onExitActivitySaveScroll()
            console.log("onExitCurrentActivity", c);
            var slot = this.querySelector('.content');
                slot.innerHTML="";
        }

        onResumeActivity(c){
            console.log("onResumeActivity", c);
            this.dispatchEvent("topichanged",{});
        }

        onLoadingActivity(c){
            // application.dispatchEvent("showsplash")
            console.log("onLoadingActivity", c);
            this.dispatchEvent("topichanged",{});
        }
    }
);
