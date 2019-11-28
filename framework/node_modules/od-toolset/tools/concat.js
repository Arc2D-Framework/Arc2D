importPackage(java.io);
importPackage(java.net);
importPackage(java.util);
importPackage(java.lang);

var BUILDCONFIG=null;

var Koncat = {
    Transpile : function(src){
        // if(src.indexOf("@transpile") == -1) {return src;}

        var transpileSettings = /@transpile\([\'\"]*([a-zA-Z0-9]*)[\'\"]*\)/;
        var transpileLevel = src.match(transpileSettings);
        if(transpileLevel && transpileLevel[1]) {
            return this.TranspileToLevel(transpileLevel[1],src)
        }
        else {
            return src
        }

        

        // var func = /(function|[A-Za-z\s?]*)(\([a-zA-Z,\s\t]*\))\{/gm;
        // src = src.replace(func, function(fullmatch, funcName, argments, index, match){
        //     return  (/function/gm.test(funcName))? (funcName + argments + "{") : (funcName + " : function" + argments + "{")
        // });


        // var traits = /(@traits\(([A-Za-z\.\,\s\(\)]+)\))[\n\s]*class/;
        // var traitMatches = src.match(traits);
        // var traitClasses = (traitMatches!=null)?traitMatches[2]:"";
        // src = traitClasses ? src.replace(traitMatches[1],""):src;

        // var clsNm = /class\s+([A-Za-z\.]+)[\n\s]*(extends\s([A-Za-z\.]+))?[\s\n]*(with\s+([A-Za-z\.\,\s\(\)]+))?\{/gm;
        // src = src.replace(clsNm, function(fullmatch, classNm, _extends, ext, withStatement, withClasses){
        //     withClasses = traitClasses||withClasses;
        //     //alert("withClasses: " + withClasses);
        //     var inherits = ext? ("'@inherits' : " + ext + ",\n"):"";
        //     var mixins = withClasses? ("'@traits' : [" + withClasses + "],\n"):"";
        //     return " namespace('" +  classNm + "', {" + inherits + mixins;
        // });

        // var staticMembers = /static\s+([A-Za-z\s?]*)/gm;
        // src = src.replace(staticMembers, function(fullmatch, funcName){
        //     return  ("'@static " + funcName.trim() + "'").trim();
        // });


        // var commaDelemiter = /\}([\n\s]*\b[a-zA-Z\s]*)\:\s*function/gm;
        // src = src.replace(commaDelemiter, function(fullmatch, closingCurly){
        //     return fullmatch.replace("}","},");
        // });

        // var cctor = /constructor\s?/gm;
        // src = src.replace(cctor, function(fullmatch, argments){
        //     return  "initialize"
        // });

        // var superParent = /super([\.A-Za-z0-9]*)?/gm;
        // src = src.replace(superParent, function(fullmatch, superParentStatement){
        //     //alert(fullmatch);
        //     if(fullmatch) { return "this.parent"}
        //     return ""
        // });

        // src = src.replace(/['"]*\@transpile['";]*/,"");

        // return src + ");\n";
    },

    TranspileToLevel : function(level, src){
        if(level == "es7") {
          var decorators = /@(([a-zA-Z0-9]*\()([\'\"]*[A-Za-z\s0-9\.\/.\{\}\,\:\[\]\'\"]*[\'\"]*\)[\;\s\t]*)*)/gm;
          var nsReg = /namespace\([\'\"]+([A-Za-z\.\_0-9]*)/;
          var nsMatch = src.match(nsReg);
      
          var dS = src.match(decorators);
          src = src.replace(decorators,"");
          dS=dS.join("");
          dS =  dS.replace(/@[a-zA-Z0-9]*\(/mg, function(full){
              return (full+nsMatch[1] + ",").replace("@","")
          });
          var fullsrc = src + "\n" + dS;
          //console.log("fullsrc",fullsrc)
          return fullsrc
        }
        else {
          return src;
        }
    },


    Build: function(source, savePath){
        var prefix = "";
        var suffix= "";
        var reg;
        var sourceIsHtml=false;
        if(source.getName().indexOf(".html") >=0){
            sourceIsHtml = true;
            prefix = "<script>";
            suffix = "</script>";
            reg 	 = /(?:<script\s*|\/\/\=\s*)require(?:="true" src="|\s)([0-9A-Za-z\-\_\.\/\\]*)(?:"><\/script>)?/im;
        } else {
            // reg 	 = /\/\/\=\s*require\s([0-9A-Za-z\-\_\.\/\\]*)/im;
            reg = /^(?:\/\/\=\s*require|import\W)\s*[\'\"]?([0-9A-Za-z\-\_\.\/\\]*)[\'\"]?/im;
        }
    	var finished = false;
	    // var reg 	 = /\/\/\=\s*require\s([0-9A-Za-z\-\_\.\/\\]*)/im; ///\'@require\s([0-9A-Za-z\-\_\.\/\\]*)\'/im;
	    var usages   = {};

        var code = (source instanceof File) ? 
        	Koncat.Read(source) : source;
        do {
        	code = code.replace(reg, function(fullmatch, namespace, index, match){
                var path = Koncat.ResolvePath(namespace);
                var file = Koncat.File(path);
                if (file) {
                	if(!usages[path]) {
                		BUILDCONFIG.Verbos && 
                		print("Scanning Loadpaths For: " + path);
                        usages[path] = true;
                        // tempSrc = Koncat.Read(file) + "\n";
                        // code = prefix + tempSrc
                        // prefix="";
                        // code += (!reg.test(code)) ? suffix:("");

                        // tempSrc += Koncat.Read(file) + "\n";
                        // code = Koncat.Read(file) + "\n";
                        code = Koncat.Read(file) + "\n";
                        code = Koncat.Transpile(code);
					} else {code=""; }
				} else {
                    print("Unable to locate file: " + path);
                }
                return code;
            });
            finished = (!reg.test(code)) ? 1:0; 
        }
        while (!finished);

        if(sourceIsHtml){
            code=code.replace(/SEAMSTART/gm,"<script>");
            code=code.replace(/SEAMEND/gm,"</script>")
        }
        return code
    },
    
    ResolvePath: function(nsPath){
        var path = (/\.js$/.test(nsPath)) ? 
        	nsPath : (nsPath.replace(/\./ig, "/") + ".js");
        return path;
    },
    
    Read: function(file){
        var stream, line, lineno, lines = [];
        if (!BufferedReader || !FileReader) {
            throw new Error("This operation requires Mozilla Rhino.");
        }
        stream = new BufferedReader(new FileReader(file));
        lineno = 1;
        while ((line = stream.readLine()) !== null) {
            lines.push(line);
        }
        stream.close();
        return lines.join("\n");
    },
    
    File: function(filename){
        filename = filename;//.replace(/\.js$/, "") + ".js";
      	
        var file, location, index = 0;
        while ((location = BUILDCONFIG.LoadPaths[index++])) {
            file = new File(location + "/", filename);
            //print("location: " + (location + "/", filename));
            if (file && file.isFile()) {
                break;
            }
		};
        return file;
    },
    
    DumpSource: function(data, destination){
        var directory, stream;
        if (!File || !BufferedWriter || !FileWriter) {
            throw new Error("This operation requires Mozilla Rhino.");
        }
        if (!(destination && destination instanceof File)) {
            destination = new File(destination);
        }
        destination = new File(destination).getCanonicalFile();
        directory = destination.getParent();
        if (!directory) {
            throw new Error("The destination directory '" + directory.getPath() + "' could not be created.");
        }
        stream = new BufferedWriter(new FileWriter(destination));
        stream.write(data);
        stream.close();
        return true;
    },
    
    MakeSourcePath : function(){
    	var sourceFileDir = new File(BUILDCONFIG.Output.SourcePath.substr(0,BUILDCONFIG.Output.SourcePath.lastIndexOf("/")+1)).mkdirs();
    	return sourceFileDir;
    },
    
    // Compress : function(){
    //     return;
    // 	var OS = java.lang.System.getProperty("os.name").toLowerCase();
    // 	try {
    //         var cmd = "java -jar tools/yuicompressor-2.4.2.jar " + BUILDCONFIG.Output.SourcePath + " -o " + BUILDCONFIG.Output.CompressedPath + " --line-break 200 --nomunge --preserve-semi --disable-optimizations";
	// 		(OS.indexOf("mac") >= 0) ? 
	// 			runCommand("sh",  "-c", cmd) :
	// 			runCommand("cmd", "/C", cmd);
    //     }
    //     catch (e) {
    //         if(BUILDCONFIG.Verbos){print("WARNING: Build OK, but unable to compress output.")}
    //     }
    // },
    Compress : function(){
        print("COMPRESSING...")
    	var OS = java.lang.System.getProperty("os.name").toLowerCase();
    	try {
            // var cmd = "java -jar node_modules/od-toolset/tools/yuicompressor-2.4.8.jar " + BUILDCONFIG.Output.SourcePath + " -o " + BUILDCONFIG.Output.CompressedPath + " --nomunge --disable-optimizations";
            var cmd = "java -jar node_modules/od-toolset/tools/closure-compiler-v20180716.jar --compilation_level WHITESPACE_ONLY --js " + BUILDCONFIG.Output.SourcePath + "  --js_output_file " + BUILDCONFIG.Output.CompressedPath + " -W QUIET --language_in ECMASCRIPT_2017 --language_out ECMASCRIPT_2017";
			(OS.indexOf("mac") >= 0) ? 
				runCommand("sh",  "-c", cmd) :
				runCommand("cmd", "/C", cmd);
        }
        catch (e) {
            if(BUILDCONFIG.Verbos){
                print("WARNING: Build OK, but unable to compress output.\n" + e.message)
            }
        }
    },
    
    Log : function(){
    	var sourceFile = new File(BUILDCONFIG.Output.SourcePath).getCanonicalFile();
		var compressedFile = new File(BUILDCONFIG.Output.CompressedPath).getCanonicalFile();
		// var compressedFile = false;
		if (sourceFile && sourceFile.isFile()) {
			print("\nBUILD SUCCESSFULL");
			print("source >> \n" + BUILDCONFIG.Output.SourcePath + " -- " + (Math.round(sourceFile.length() / 1024)) + "KB");
		}
		
		if (compressedFile && compressedFile.isFile()) {
			if(BUILDCONFIG.Verbos){print("\n\ncompressed >> \n" + BUILDCONFIG.Output.CompressedPath + " -- " + (Math.round(compressedFile.length() / 1024)) + "KB\n\n");}
		}
    },
    
    Configure : function(){
    	var configFile;
		try{configFile = new File(arguments[0]+"/", "-buildconfig.js");}catch(ex){}
		
		if(configFile.isFile() && configFile.exists()) {
			load(arguments[0] + "/-buildconfig.js");
			if(BUILDCONFIG.Verbos){print("using " + (arguments[0]+"/") + "-buildconfig.js")}
			
			for(var j=0; j<=BUILDCONFIG.LoadPaths.length-1; j++) {
				BUILDCONFIG.LoadPaths[j] = arguments[0] + "/" + BUILDCONFIG.LoadPaths[j];
			};
			BUILDCONFIG.Output.SourcePath =  arguments[0] + "/" + BUILDCONFIG.Output.SourcePath;
			BUILDCONFIG.Output.CompressedPath =  arguments[0] + "/" + BUILDCONFIG.Output.CompressedPath;
			BUILDCONFIG.ApplicationFolderName = arguments[0];
			if(!BUILDCONFIG.Input) {
				BUILDCONFIG.Input = arguments[0] + "/main.js";
			}
		}
		else {
			print("missing -buildconfig.js: " + arguments[0] + "/")
		}
    }
};


function main(p) {
	try{ 
		Koncat.Configure(p);
		var file = Koncat.File(BUILDCONFIG.Input);
		var newcode = Koncat.Build(file);
		Koncat.MakeSourcePath();
		Koncat.DumpSource(newcode, BUILDCONFIG.Output.SourcePath);
		Koncat.Compress();
		Koncat.Log();
	} catch(e) {
		print("BUILD ERROR:\n" + e.message);
	}
};

main(arguments[0]);
