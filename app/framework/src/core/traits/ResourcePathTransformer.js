namespace("core.traits.ResourcePathTransformer");

core.traits.ResourcePathTransformer = {
    resourcepath : function(url, ns){
        url = url.replace(/\$\{ns\}/gm, ns.replace(/\./gim,"/"));
        return Config.ROOTPATH + url;
    },
    
    relativeToAbsoluteFilePath : function(path, ns, appendRoot){
        /*appendRoot = (typeof appendRoot=="boolean")?
            appendRoot : true;
        var apppath = (Config.ROOTPATH && appendRoot) ? 
            (Config.ROOTPATH + "/") : "";*/
        ns = ns||this.namespace;
        ns = ns.replace(/\./gim,"/");
        if(path.indexOf("/./") >= 0){
            path = path.replace("./", ns+"/");
        } 
        path = /http:/.test(path)? path : path.replace("//","/");
        return path;
    }
};
