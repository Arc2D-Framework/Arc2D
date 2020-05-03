
namespace `applications` (
    class InlineTest extends w3c.ui.Application {
        async onConnected() {
            await super.onConnected();
            this.addEventListener("click", e=> this.onClick(e))
            this.addEventListener("click", e=> this.onTestClick(e), false, "#test");
            alert(this.querySelector("#test"))
        }

        onClick(e){
            console.log(e.target)
        }

        onTestClick(e){
            console.log("onTestClick", e.target)
        }
    }
);
