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

        // onEnableRouting(){ return true }

        async onConnected() {
            await super.onConnected();
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
