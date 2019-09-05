namespace("core.traits.localStorageData");


core.traits.localStorageData = {
	onDownloaded : function(r, responseText){
        var data;
        try{
            try{
                data = JSON.parse(responseText);
            }
            catch(e) {
                console.error(e.message, responseText);
            }
            if(data){
                this.onMergeWithStorageData(data);
            }
        }
        catch(e){
            //alert("error downloading " + this.namespace + " data");
            console.error(e.message,responseText)
        }
    },

	onMergeWithStorageData : function(data){
		var results = core.data.StorageManager.find(this.getRouteConfig().table);
		data.items = data.items||[];
		data.items = data.items.concat(results);
        this.onDataReceived(data, null);
    },

    insert : function(newDoc){
        var data = this.getData();
        if(newDoc){
            newDoc.id = newDoc.id||this.UUID();
            data.items.push(newDoc);
            core.data.StorageManager.store(this.getRouteConfig().table, newDoc);
            core.data.StorageManager.commit();
            application.bus.dispatchEvent("insert", true, true, newDoc, this);
            this.dispatchEvent("insert", newDoc, this);
            return newDoc;
        }
    },

    update : function(sourceObj){
        this.parent(sourceObj);
        var data = this.getData();
        core.data.StorageManager.set(this.getRouteConfig().table, data.items);
        core.data.StorageManager.commit();
    },

    set : function(key, obj, persist){
        core.data.StorageManager.set(key,obj, true);//force persistence for this trait
    },

    get : function(key){
        return core.data.StorageManager.get(key);
    },

    removeDocumentById : function(id){
        var doc = this.getItemById(id);

        if(doc) {
            var removed = this.remove(id);
            core.data.StorageManager.remove(this.getRouteConfig().table, true).where("$.id == '" + id + "'");
            if(removed) {
                this.dispatchEvent("removed", doc, this);
            }
        }
    },

    removeByQuery : function(query){
        this.parent(query);
        var data = this.getData();
        core.data.StorageManager.set(this.getRouteConfig().table, data.items);
        core.data.StorageManager.commit();
    },

    UUID : function(){
        return Math.uuid(8);
    }
};
