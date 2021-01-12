namespace `display.components` (
    class SpaNav extends WebComponent {
        constructor(element){
            super(element);
        }
        
        async onConnected() {
            await super.onConnected();
            this.on("click", this.onToggleMenu, false, ".topnav a");
        }

        onToggleMenu =e=> {
            if(!e.target.classList.contains("active")){
                this.classList.toggle("responsive");
            }
        }
    }
);