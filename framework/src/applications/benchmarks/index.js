
namespace `applications` (
    @tag("arc-test");
    class ArcTest extends w3c.ui.Application {

        async onConnected() {
            await super.onConnected();
            this.bind("#run-btn", "click", e=>this.onRunRequested(e))
        }

        onRunRequested(){

        }
    }
);
