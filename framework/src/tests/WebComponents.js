@traits([core.traits.UnitTest]);
namespace `tests` (
    class WebComponents {
        constructor(){
            // alert(this.getNs())
        }



        test (){
            var self=this;

            namespace `com` (
                class ToggleButton extends w3c.ui.WebComponent {
                    async onConnected(){
                        await super.onConnected()
                    }
                    template(){
                        return `
                            <template>
                                <div>Toggle</div>
                            </template>
                        `
                    }
                }
            );


            
            this.expected("the ability to create a simple WebComponent class", (resolve,reject) => {
                

                if(com.ToggleButton) {
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

                if(new com.ToggleButton) {
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

                if(new com.ToggleButton instanceof HTMLElement) {
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
                var b = new com.ToggleButton;
                try{
                    application.appendChild(b)
                    // console.log(b)
                    resolve(true)
                } catch(e){
                    reject("was unable to append instance to DOM: " + e.message)
                }

                
            });

        }
        
    }
);