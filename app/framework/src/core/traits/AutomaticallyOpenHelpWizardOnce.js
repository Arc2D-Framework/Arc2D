/**
 * The AutomaticallyOpenHelpWizardOnce constructor runs during parent app initialize()
 * This trait will check if the auto help wizard have already been seen by
 * the user and will set a flag to not show it again.
 * @example
 * var app = new apps.SearchResults;  // <-- all traits are initialized here as well
 * @return {core.ui.WebApplication}
 */
AutomaticallyOpenHelpWizardOnce = {
    initialize : function(){
        this.parent()
        if(!this.isAutoHelpWizardDisabled()){
            this.setAutoHelpWizardEnabled(false);
            this.showHelpWizard();
        }
    },

    /**
     * Helper used to determine if the 'disableHelpWizard' was set already
     * @param {Event} e - The click event
     */
    isAutoHelpWizardDisabled : function(){
        var res = StorageManager.find(this.namespace + ".disableHelpWizard");
        if(res.length<=0){ return false }
        else {
            return res[0] == true
        }
    },

    /**
     * Helper used for setting the 'disableHelpWizard' flag
     */
    setAutoHelpWizardEnabled : function(){
        StorageManager.store(this.namespace + ".disableHelpWizard",true);
        StorageManager.persist();
    }
};