import '/src/core/ui/FlyoutButton/index.js';
import '/node_modules/od-import-polyfill/import.js';


namespace("applications.MyApp", class extends w3c.ui.Application {
    constructor(element){
        super(element);
        this.mutations = [];
        require("/src/modules/test.mjs").then(res => res.myExport());
        // require("/src/core/ui/FlyoutButton/index.js").then(res => res);
        // this.router = new core.http.Router(this,window);
        document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
        this.setupMutationObserver();
    }

    setupMutationObserver(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        this.observer = new MutationObserver( (mutations, ob) => this.onMutationOccured(mutations,ob));
    }

    serialize(mutationList){
        if(!this.is_recording){return}

        mutationList.forEach(m => {
            if(m.type == "childList"){
                console.log("childlist",m)
            }
            else if(m.type == "attributes"){
                var serializedMutation = {
                    type : m.type,
                    attributeName: m.attributeName,
                    oldValue : m.oldValue,
                    newValue : m.target.getAttribute(m.attributeName)
                }
                this.mutations.push(serializedMutation)
            }
        })
    }

    onMutationOccured(mutationList, observer){
        this.serialize(mutationList)
    }


    onKeyUp(e){
        if(e.keyCode == 32){
            if(this.is_recording){
                this.is_recording=false
                console.log("Recoding Stopped");
                // console.log("records",this.observer.takeRecords())
                this.observer.disconnect();
                console.log("serialized mutations", this.mutations)
            }
            else{
                this.is_recording=true
                console.log("Recoding Started...");
                this.observer.observe(document.body, {
                    attributes: true,
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributeOldValue: true,
                    attributes: true
                });
            }
        }
    }

    // onDisplayActivity(c){
    //     var slot = this.querySelector('div[slot="screen"]');
    //     slot.innerHTML="";
    //     slot.appendChild(c);
    // }

    onEnableShadow(){
        return false
    }

    onConnected() {
        this.render();
    }
})
