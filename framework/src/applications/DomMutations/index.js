import '/src/core/ui/FlyoutButton/index.js';
// mport '/node_modules/od-import-polyfill/import.js';
import '/src/core/ui/Test/index.js';
import {myExport} from "/src/modules/test.mjs";
import '/src/applications/DomMutations/reverse_css.js';

namespace `applications` (
    class DomMutations extends w3c.ui.Application {
        constructor(element){
            super(element);
            this.mutations = [];
            // myExport()
            // require("/src/modules/test.mjs").then(res => res.myExport());
            // this.router = new core.http.Router(this,window);
            this.addEventListener("toggled", (e) => this.onToggled(e), true);
            document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
            this.setupMutationObserver();
        }


        onToggled(e){
            e.stopPropagation();
            var title = this.querySelector("h1");
            // alert(title)
            title.classList.add("cool-color")
        }

        async setupMutationObserver(){
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            this.observer = new MutationObserver( (mutations, ob) => this.onMutationOccured(mutations,ob));
        }

        play(){
            this.mutations.forEach(m => {
                var target = document.querySelector(m.target);
                if(target){
                    if(m.type == "attributes"){
                        target.setAttribute(m.attributeName, m.newValue);
                    }
                }
            })
        }

        rewind(){
            this.mutations.forEach(m => {
                var target = document.querySelector(m.target);
                if(target){
                    if(m.type == "attributes"){
                        target.setAttribute(m.attributeName, m.oldValue);
                    }
                }
            })
        }

        serialize(mutationList){
            if(!this.is_recording){return}

            mutationList.forEach(m => {
                console.warn("mutation",m)
                var css_target = ReverseCssSelector.DOMPresentationUtils.cssPath(m.target);
                if(m.type == "childList"){
                    console.log("childlist",m)
                }
                else if(m.type == "attributes"){
                    var serializedMutation = {
                        target:css_target,
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

        // onEnableShadow(){
        //     return false
        // }

        async onConnected() {
            await super.onConnected();
        }
    }
);
