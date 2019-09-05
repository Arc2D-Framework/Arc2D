/**
 * The HandlePanelCloseButton constructor runs during parent app initialize().
 * Hanles the closing of panels globally.
 * @example
 * var app = new apps.SearchResults;  // <-- all traits are initialized here as well
 * @return {core.ui.WebApplication}
 */
HandlePanelCloseButton = {
    initialize : function(){
        this.parent()
        this.addEventListener("close", this.onClosePanel.bind(this), false);
    },

    /**
     * Triggered when user clicks the 'X' of the current app/window
     * @param {Event} e - The click event
     */
    onClosePanel : function(){
        history.back(-1)    
    }
};