namespace `core.traits` (

    class ResourcePathTransformer {
        static resourcepath(url, ns){
            url = url.replace(/\$\{ns\}/gm, ns.replace(/\./gim,"/"));
            return Config.ROOTPATH + url;
        }
        
        static  relativeToAbsoluteFilePath(path, ns, appendRoot){
            ns = ns||this.namespace;
            ns = ns.replace(/\./gim,"/");
            if(path.indexOf("/./") >= 0){
                path = path.replace("./", ns+"/");
            } 
            path = /http:/.test(path)? path : path.replace("//","/");
            return path;
        }
    }
)
