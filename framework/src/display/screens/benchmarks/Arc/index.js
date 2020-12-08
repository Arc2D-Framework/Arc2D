
namespace `applications.benchmarks` (
    @tag("arc-test");
    class Arc extends w3c.ui.Application {
        async onConnected() {
            await super.onConnected();
            this.bind("#run-btn", "click", e=>this.onRunRequested(e))
        }

        onRunRequested(){
            alert("run")
        }
    }
);
