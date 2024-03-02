class Parser {
    static parse(obj) {
                // function jsonToXml(obj) {
                function buildXml(parent, data) {
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            const value = data[key];
                            if (Array.isArray(value)) {
                                value.forEach((item) => {
                                    const childNode = document.createElement(key); // Remove 's' from the key for sibling elements
                                    buildXml(childNode, item);
                                    parent.appendChild(childNode);
                                });
                            } else if (typeof value === 'object') {
                                if(key == "@") {
                                    debugger
                                    for(let attrbkey in data[key]) {
                                        parent.setAttribute(attrbkey,data[key][attrbkey])
                                    } 
                                }
                                else {
                                    const childNode = document.createElement(key);
                                    buildXml(childNode, value);
                                    parent.appendChild(childNode);
                                }
                            } else {
                                const childNode = document.createElement(key);
                                const textNode = document.createTextNode(value.toString());
                                childNode.appendChild(textNode);
                                parent.appendChild(childNode);
                            }
                        }
                    }
                }
            
                const rootTagName = "xml";
                const root = document.createElement(rootTagName);
                buildXml(root, obj);
                
                const xmlString = new XMLSerializer().serializeToString(root);
                return xmlString;
            // }
        }
    }
    var XsltTransformer = {
        name : "XsltTransformer",
        ext : ".xslt",
        parse : function(tempStr, data, self){
            debugger;
            const parser = new DOMParser();
            const xsltProcessor = new XSLTProcessor();
            const xslStylesheet = parser.parseFromString(tempStr, "application/xml");
            xsltProcessor.importStylesheet(xslStylesheet);
            const xmlDoc = parser.parseFromString(Parser.parse(data), "application/xml");
            const fragment = xsltProcessor.transformToFragment(xmlDoc, document);
            
            return fragment
            // return "";
        },
        install : function(){}
    };
    

    window.customTemplateEngines.define("template/xslt", XsltTransformer);


export{ XsltTransformer};