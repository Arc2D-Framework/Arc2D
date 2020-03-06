namespace `docs.demos` (
    class EventPhaseDiagram  extends w3c.ui.WebComponent  {
        async onConnected(){
            await super.onConnected();
            this.setVisiblePhases();
        }

        setVisiblePhases(){
            var phaseid = this.getAttribute("phase");
            var phase = this.querySelector(`#event-flow g.phase[id *= '${phaseid}']`);
            console.log("phase id", phase)
            if(phase){
                phase.classList.add("visible")
            }
        }
    }
)