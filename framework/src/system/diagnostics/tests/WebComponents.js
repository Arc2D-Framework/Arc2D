@traits([system.traits.UnitTest]);
namespace `tests` (
    class WebComponents {
        constructor(){
            // alert(this.getNs())
        }



        test (){
            var self=this;

            namespace `tests.com` (
                class ToggleButton extends w3c.ui.WebComponent {
                    async onConnected(){
                        await super.onConnected();
                        // alert("ToggleButton")
                    }
                    onLoadInstanceStylesheet(){return true}
                    
                    template(){
                        return `
                            <template>
                                <div>Toggle</div>
                            </template>
                        `
                    }

                    cssStyle(){
                        return `
                            .ToggleButton {
                                display:block;
                                width:100px;
                                height:50px;
                                background-color:blue;
                            }
                        `
                    }
                }
            );


            namespace `tests.com` (
                class ToggleButtonExtended extends tests.com.ToggleButton {
                    async onConnected(){
                        // await super.onConnected();
                        await this.render();
                    }

                    onLoadInstanceStylesheet(){return true}

                    cssStyle(){
                        return `
                            .ToggleButtonExtended {
                                display:block;
                                width:200px;
                                height:50px;
                                background-color:rgb(255, 0, 0);
                            }
                        `
                    }
                    template(){
                        return `
                            <template>
                                <div>Toggle Extended!</div>
                            </template>
                        `
                    }
                }
            );


            
            this.expected("the ability to create a simple WebComponent class", (resolve,reject) => {
                if(tests.com.ToggleButton) {
                    resolve(true)
                } else {
                    reject("is not a WebComponent")
                }
            });



            this.expected("the ability to create a simple WebComponent instance", (resolve,reject) => {
                // namespace `com` (
                //     class ToggleButton extends w3c.ui.WebComponent {

                //     }
                // );

                if(new tests.com.ToggleButton) {
                    resolve(true)
                } else {
                    reject("is not a WebComponent")
                }
                
            });
            



            this.expected("ToggleButton to be instanceof HTMLElement", (resolve,reject) => {
                // namespace `com` (
                //     class ToggleButton extends w3c.ui.WebComponent {

                //     }
                // );

                if(new tests.com.ToggleButton instanceof HTMLElement) {
                    resolve(true)
                } else {
                    reject("is not a WebComponent")
                }
                
            });



            this.expected("ToggleButton to be in DOM", async (resolve,reject) => {
                // namespace `com` (
                //     class ToggleButton extends w3c.ui.WebComponent {

                //     }
                // );
                // console.log("app",application)
                // await wait(300);
                var b = new tests.com.ToggleButton;
                try{
                    application.appendChild(b)
                    // console.log(b)
                    resolve(true)
                } catch(e){
                    reject("was unable to append instance to DOM: " + e.message)
                }

                
            });



            //TODO: move to style tests
            this.expected("ToggleButtonExtended subclass to have red or [rgb(255, 0, 0)] as background-color", async (resolve,reject) => {
                var b = new tests.com.ToggleButtonExtended;
                application.appendChild(b);
                

                await wait(500);
                try{
                    var style = window.getComputedStyle(b)
                    var bg=style.getPropertyValue('background-color');

                    if(bg == "rgb(255, 0, 0)"||bg == "red"){
                        resolve(true)
                    }
                    else{
                        reject(`ToggleButtonExtended background is '${bg}' from inherited ToggleButton, not blue`)
                    }
                }
                catch(e){
                    reject(`something went wrong, ${e.message}`)
                }
            });

            


            this.expected("components to initialized using non-connected DOM node as innerHTML template source, ex: `new core.ui.SampleD(aDiv)`, where 'aDiv' is a node, not yet in the DOM -- i.e: doc.createElement();", async (resolve,reject) => {
                await import('/framework/src/core/ui/SampleD/index.js');
                var el = `<div id="sample-d-html-123">Adoption: a custom tag will wrap a new non-connected DIV in the DOM</div>`.toDomElement();
                var n = new core.ui.SampleD(el);
                application.appendChild(n);
                await wait(100);
                var dampled = application.querySelector("sample-d #sample-d-html-123");
                if(dampled){
                    // n.remove();
                    resolve(true)
                } else {
                    reject("no sample d")
                }
            });



            this.expected("components to be stealth initialized: using already connected DOM node as is: `new core.ui.SampleD(aDomDiv)`, where 'aDomDiv' is an existing node already in the DOM", async (resolve,reject) => {
                await import('/framework/src/core/ui/SampleD/index.js');
                var el = `<div id="html-123" class="mybox">Camouflaged: Uses existing Dom-Connected Div as is, no wrapping or physical decoration apparent</div>`.toDomElement();
                application.appendChild(el);
                var el = application.querySelector("#html-123");
                var n = new core.ui.SampleD(el);
                
                await wait(100);
                
                if(n && application.querySelector("#html-123")){
                    resolve(true)
                } else {
                    reject("no sample d")
                }
            });


            this.expected("stealth component querySelector() to find child nodes", async (resolve,reject) => {
                await import('/framework/src/core/ui/SampleD/index.js');
                var el = `<div id="html-123-querySelector1"><div id="test-camo-qs">Camouflaged: QuerySelector test</div></div>`.toDomElement();
                application.appendChild(el);
                var el = document.querySelector("#html-123-querySelector1");
                var n = new core.ui.SampleD(el);
                
                await wait(100);
                // debugger;
                if(n && n.querySelector("#test-camo-qs")){
                    // alert(n.querySelector("#test-camo-qs"))
                    resolve(true)
                } else {
                    reject("no sample d")
                }
            });


            this.expected("stealth component querySelector() to find child nodes on sample DatePicker", async (resolve,reject) => {
                await import('/resources/docs/demos/DatePicker/index.js');
                var el = `<div id="html-123-querySelector2"><input/></div>`.toDomElement();
                application.appendChild(el);
                await wait(50);
                var el = document.querySelector("#html-123-querySelector2");
                var n = new docs.demos.DatePicker(el);
                
                await wait(100);
                // debugger;
                if(n && n.querySelector("input")){
                    // alert(n.querySelector("#test-camo-qs"))
                    resolve(true)
                } else {
                    reject("no sample d")
                }
            });

            this.expected("components to be initialized from index.html template", async (resolve,reject) => {
                await import('/framework/src/core/ui/SampleD/index.js');

                var n = new core.ui.SampleD();
                n.id="my-sample-d-from-template";
                application.appendChild(n);
                await wait(100);
                
                if(n && application.querySelector("#my-sample-d-from-template")){
                    resolve(true)
                } else {
                    reject("no sample d")
                }
            });


            this.expected("components to be initialized from inline template()", async (resolve,reject) => {
                await import('/framework/src/core/ui/SampleD/index.js');

                var n = new core.ui.SampleD();
                n.template = function(){return `<template><div>Inline innerHTML Template</div></template>`}
                n.id="my-sample-d-from-inline-template";
                application.appendChild(n);
                await wait(100);
                
                if(n && application.querySelector("#my-sample-d-from-inline-template")){
                    resolve(true)
                } else {
                    reject("no sample d")
                }
            });
        }
        
    }
);