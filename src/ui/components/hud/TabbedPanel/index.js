namespace `ui.components.hud` (
    class TabbedPanel extends Component {
        static skin = "default";

        async onConnected() {
            await super.onConnected();
            this.on("click", e=>this.onTabClicked(e), false, "li.tab");
        }

        onTabClicked(e){
            console.log(e.matchedTarget)
        }
    }
)