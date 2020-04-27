
namespace `applications` (
    class InlineTest extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.addEventListener("click", e=> this.onClick(e))
        }

        onClick(e){
            console.log(e.target)
        }
    }
);
