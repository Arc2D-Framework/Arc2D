
namespace `applications.benchmarks` (
    @tag("benchmark-comparison");
    class Comparison extends w3c.ui.Application {
        async onConnected() {
            await super.onConnected();
            this.bind("#run-btn", "click", e=>this.onRunRequested(e))
        }

        onRunRequested(){
            alert("run")
        }
    }
);
