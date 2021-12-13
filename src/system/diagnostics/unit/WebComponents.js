
namespace `system.diagnostics.unit` (
    class WebComponents extends system.diagnostics.UnitTest {
        constructor(){
            super()
        }



        test (){
            var self=this;

            //========================= BUILD A COMPONENT TO TEST ======================
                namespace `system.diagnostics.unit.com` (
                    class ToggleButton extends WebComponent {
                        async onConnected(){
                            await super.onConnected();
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
                                :host {
                                    display:block;
                                    width:100px;
                                    height:50px;
                                    background-color:blue;
                                }
                            `
                        }
                    }
                );

                namespace `system.diagnostics.unit.com` (
                    class ToggleButtonExtended extends system.diagnostics.unit.com.ToggleButton {
                        cssStyle(){
                            return `
                                :host {
                                    display:block;
                                    width:200px;
                                    height:50px;
                                    background-color:red;
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
            //============================== END COMPONENT =============================









            this.expected("to make an instance of ToggleButtonExtended using createElement", (resolve,reject) => {
                var b = document.createElement("system-diagnostics-unit-com-toggle-button-extended")
                if(b) {
                    if(b instanceof system.diagnostics.unit.com.ToggleButton){
                        document.body.appendChild(b)
                        resolve(true)
                    } else {
                        reject("the instance created from '<toggle-button-extended>', is not an instanceof ToggleButton")
                    }
                } else {
                    reject("tagname '<toggle-button-extended>', the default, is not working")
                }
            });


            this.expected(`@tag trait to not re-define a new/custom tag for ToggleButtonExtended class, which is already defined with a tag in CustomElementsRegistrty`, (resolve,reject) => {

                try {
                    tag(system.diagnostics.unit.com.ToggleButtonExtended,"toggle-extended")
                }
                catch(e){//should throw error which is right
                    resolve(true);
                    return
                };
            });


            // this.expected(`@tag trait to define a tag when a Class cannot generate its own from the Class name`, (resolve,reject) => {
            //     namespace `system.diagnostics.unit.com` (
            //         class Toggle extends system.diagnostics.unit.com.ToggleButton {
                        
            //         }
            //     );

            //     try{
            //         tag(system.diagnostics.unit.com.Toggle,"toggle-custom");
            //     }
            //     catch(e){
            //         reject(e)
            //         return
            //     };
            //     var b = document.createElement("toggle-custom")

            //     if(b) {
            //         if(b instanceof system.diagnostics.unit.com.Toggle){
            //             resolve(true)
            //         } else {
            //             reject("the instance created from '<toggle-custom>' tage, is not an instanceof Toggle")
            //         }
            //     } else {
            //         reject("tagname '<toggle-custom>', the custom tag, is not working")
            //     }
            // });

            
            this.expected("the ability to create a simple WebComponent class", (resolve,reject) => {
                if(system.diagnostics.unit.com.ToggleButton) {
                    resolve(true)
                } else {
                    reject("is not a WebComponent")
                }
            });



            this.expected("the ability to create a simple WebComponent instance", (resolve,reject) => {
                if(new system.diagnostics.unit.com.ToggleButton) {
                    resolve(true)
                } else {
                    reject("is not a WebComponent")
                }
                
            });
            



            this.expected("ToggleButton to be instanceof HTMLElement", (resolve,reject) => {
                if(new system.diagnostics.unit.com.ToggleButton instanceof HTMLElement) {
                    resolve(true)
                } else {
                    reject("is not a WebComponent")
                }
                
            });



            this.expected("ToggleButton to be in DOM", async (resolve,reject) => {
                var b = new system.diagnostics.unit.com.ToggleButton;
                try{
                    application.appendChild(b)
                    resolve(true)
                } catch(e){
                    reject("was unable to append instance to DOM: " + e.message)
                }
            });



            //TODO: move to style tests
            this.expected("ToggleButtonExtended subclass to have red or [rgb(255, 0, 0)] as background-color", async (resolve,reject) => {
                var b = new system.diagnostics.unit.com.ToggleButtonExtended;
                application.appendChild(b);
                

                await wait(1000);
                try{
                    // debugger;
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

            


            this.expected("components to initialize using non-connected DOM node as innerHTML template source, ex: `new system.diagnostics.unit.com.SampleD(aDiv)`, where 'aDiv' is a node (not in the DOM)", async (resolve,reject) => {

                await import('/src/system/diagnostics/unit/com/SampleD/index.js');
                var el = `<div id="sample-d-html-123">
                            Adoption: a custom tag will wrap a new non-connected DIV in the DOM
                          </div>`.toNode();
                // debugger;
                document.body.appendChild(el);

                var n = new system.diagnostics.unit.com.SampleD(el);
                
                console.log(n)
                // document.body.appendChild(n);
                // n.adopts(el)
                await wait(100);
                console.log(n)
                var dampled = document.querySelector("#sample-d-html-123");
                if(dampled){
                    resolve(true)
                } else {
                    reject("no sample d")
                }
            });



            this.expected("components to be stealth initialized: using already connected DOM node as is: `new system.diagnostics.unit.com.SampleD(aDomDiv)`, where 'aDomDiv' is an existing node already in the DOM", async (resolve,reject) => {
                await import('/src/system/diagnostics/unit/com/SampleD/index.js');
                var el = `<div id="html-123" class="mybox">Camouflaged: Uses existing Dom-Connected Div as is, no wrapping or physical decoration apparent</div>`.toNode();
                application.appendChild(el);
                var el = application.querySelector("#html-123");
                var n = new system.diagnostics.unit.com.SampleD(el);
                
                await wait(100);
                
                if(n && n.element == el){
                    resolve(true)
                } else {
                    reject("no sample d")
                }
            });


            this.expected("stealth component querySelector() to find child nodes", async (resolve,reject) => {
                await import('/src/system/diagnostics/unit/com/SampleD/index.js');
                var el = `<div id="html-123-querySelector1"><div id="test-camo-qs">Camouflaged: QuerySelector test</div></div>`.toNode();
                application.appendChild(el);
                var el = document.querySelector("#html-123-querySelector1");
                var n = new system.diagnostics.unit.com.SampleD(el);
                
                await wait(100);
                // debugger;
                if(n && n.querySelector("#test-camo-qs")){
                    // alert(n.querySelector("#test-camo-qs"))
                    resolve(true)
                } else {
                    reject("no sample d")
                }
            });


            // this.expected("stealth component querySelector() to find child nodes on sample DatePicker", async (resolve,reject) => {
            //     await import('/src/system/diagnostics/unit/com/DatePicker/index.js');
            //     var el = `<div id="html-123-querySelector2"><input/></div>`.toDomElement();
            //     application.appendChild(el);
            //     await wait(50);
            //     var el = document.querySelector("#html-123-querySelector2");
            //     var n = new docs.demos.DatePicker(el);
                
            //     await wait(100);
            //     // debugger;
            //     if(n && n.querySelector("input")){
            //         // alert(n.querySelector("#test-camo-qs"))
            //         resolve(true)
            //     } else {
            //         reject("no sample d")
            //     }
            // });

            this.expected("components to be initialized from index.html template", async (resolve,reject) => {
                await import('/src/system/diagnostics/unit/com/SampleD/index.js');

                var n = new system.diagnostics.unit.com.SampleD();
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
                await import('/src/system/diagnostics/unit/com/SampleD/index.js');

                var n = new system.diagnostics.unit.com.SampleD();
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




            this.expected("components to fire 'connected' state event", async (resolve,reject) => {
                await import('/src/system/diagnostics/unit/com/SampleD/index.js');
                let fired=false;
                var n = new system.diagnostics.unit.com.SampleD();
                    n.on("connected", e=> resolve(true));

                application.appendChild(n);
                await wait(400);
                
                if(!fired){
                    reject("'connected' event does not fire")
                } else {
                    resolve()
                }
            });




        }
        
    }
);