

class DebugOptions {
    debug(){
        this.on("click", e=> this.onSmoothTransitionsClick(e), true, "input#smooth_transitions")
        this.on("click", e=> this.onDisableHoverClick(e), true, "input#disable_hover")
        this.on("click", e=> this.onDisableDebugBorders(e), true, "input#disable_debug")
    }

    onSmoothTransitionsClick(e){
        this.classList.toggle("with-transitions")
    }
    onDisableHoverClick(e){
        this.classList.toggle("disable_hover")
    }
    onDisableDebugBorders(e){
        this.classList.toggle("disable_debug")
    }
}
