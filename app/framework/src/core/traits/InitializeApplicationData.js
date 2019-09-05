namespace("core.traits.InitializeApplicationData");

core.traits.InitializeApplicationData = {
    initialize : function () {
        this.parent();
        application.db = {};
        application.db.user = Session.localStorage.session["user"];//core.data.StorageManager.get("user");
        Session.user = application.db.user;
    }
};