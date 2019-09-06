import 'src/core/traits/ResourcePathTransformer.js';
import 'src/core/ui/templating/CustomTemplateEngines.js';
import 'src/core/ui/templating/TemplateLiterals.js';

@transpile("es7");
@cascade(true);
namespace("w3c.ui.WebComponent", class extends HTMLElement {

    constructor() {
        super();
        this.__proto = this.constructor.prototype;
        this.root = this.onEnableShadow() ? 
            this.attachShadow({ mode: 'open' }) : this;
    }

    setStylesheet () {    
        var css = this.cssStyle();
        !!css && !this.__proto._style_defined ? 
            (this.appendStyleSheet(
                `<style type="text/css" rel="stylsheet">\n${css}\n</style>`.toDomElement()), 
                this.__proto._style_defined=true
            ) : null;
    }

    //TODO: Revisit how to make it work wihout passing deep flag
    querySelector(cssSel, deep){
        return deep ?
            this.root.querySelector(cssSel):
            super.querySelector(cssSel)
    }

    querySelectorAll(cssSel, deep){
        return deep ?
            this.root.querySelectorAll(cssSel):
            super.querySelectorAll(cssSel)
    }

    appendStyleSheet(stylesheet) {
        if(this.onEnableShadow()){
            this.root.host.appendChild(stylesheet)
        }
        else {
            var headNode = application.head;
            var configscript = application.configscript;
            headNode.insertBefore(stylesheet, configscript);
        }
    }

    animate(className) {
        this.classList.add("animated", className);
        setTimeout(() => {
            this.classList.remove("animated", className);
        }, 1000)
    }

    adopts(orphan) {
        orphan && orphan.parentNode.replaceChild(this, orphan)
        orphan && this.appendChild(orphan);
    }

    replaces(orphan) {
        orphan && orphan.parentNode.replaceChild(this, orphan);
    }

    dispatchEvent(type, data, details = { bubbles: true, cancelable: true, composed: true }, element = this) {
        var evt = new CustomEvent(type, details);
        evt.data = data;
        return super.dispatchEvent(evt);
    }


    //TODO: refactor to return a Binding that can be enabled/disabled.
    bind(el, evtName, handler) {
        var self = this;
        if (typeof el == "string") {
            this.addEventListener(evtName, (e) => {
                var t = this.getRealTargetFromEvent(e, el);
                if (t) {
                    handler({
                        target: t,
                        realtarget: e.target,
                        src: e,
                        preventDefault: () => e.preventDefault,
                        stopPropagation: () => e.stopPropagation
                    });
                }
            }, true);
        } else {
            el.addEventListener(evtName, handler, false);
        }
    }

    getParentBySelectorUntil(elem, terminator, selector) {
        elem = elem || this;
        terminator = terminator||"body";
        var parent_node = null;
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (terminator) {
                if (elem.matches && elem.matches(terminator)) break;
            }
            if (selector) {
                if (elem.matches && elem.matches(selector)) {
                    parent_node = elem;
                    break;
                }
            }
        }
        return parent_node;
    }

    getRealTargetFromEvent(e, selector, terminator) {
        var el = e.composedPath()[0];
        return this.getParentBySelectorUntil(el, terminator, selector);
    }

    onStylesheetLoaded(style) { }

    cssTransform(css) {
        var ns = this.namespace;
        css = css.replace(/resource\([\'\"]?([^\'\"]*)[\'\"]?\)/mg,
            (full, m1) => "url(" + this.resourcepath(m1, ns) + ")"
        );
        return css;
    }

    setCssTextAttribute(_cssText, stylenode) {
        if (stylenode && stylenode.styleSheet) {
            stylenode.styleSheet.cssText = _cssText;
        }
        else {
            stylenode.appendChild(document.createTextNode(_cssText));
        }
    }


    async loadTemplate() {
        return new Promise(async (resolve, reject) => {
            var tem  =  this.querySelector("template")||    //node
                        this.src||                          //uri
                        this.template()||                   //string
                        "/src/./templates/index.html"       //default
            
            if(/\/*\.html$/.test(tem)){
                // if(!this.src){this.src=tem}
                var src=this.src||tem;//TODO: bug here?
                var opts = { cache: "force-cache" };
                src = src.replace("/./", "/" + this.namespace.replace(/\./gim, "/") + "/");
                this._template = await imports(src, opts);
            }
            else if(/<\s*\btemplate\b/.test(tem)){//from inner template()
                this._template=tem;
            }
            else if(tem && tem.nodeType==1){
                this._template=tem.outerHTML;
            }
            resolve(this._template);
        })
    }


    onConnected() { }

    render(data) {
        data = data || {};
        data.component = this;
        var t = this._template;
        if (t) {
            var html = this.evalTemplate(t, data || {});
            var temNode = html.toDomElement();
            temNode = temNode.content;
            if (!this.onEnableShadow()) {
                this.slots.forEach(slot => {
                    var slotName = slot.getAttribute('slot');
                    var placeholder = temNode.querySelector(`slot[name="${slotName}"]`);
                    if(placeholder){
                        placeholder.innerHTML="";
                        placeholder.appendChild(slot)
                    }
                })
                this.root.innerHTML = "";
            }
            this.root.innerHTML = "";
            this.root.appendChild(temNode);
            this.dispatchEvent("rendered")
        }
    }


    static get observedAttributes() {
        return ['src'];
    }

    get src() {
        return this.getAttribute('src');
    }

    set src(val) {
        this.setAttribute('src', val)
    }

    onEnableShadow() {
        return this.getAttribute('attach-shadow') != 'false';
    }

    attachShadow(options) {
        this._usesShadow = true;
        return super.attachShadow(options);
    }


    async attributeChangedCallback(name, oldValue, newValue) {
        if (name == "src"){
            if(!this._is_connected){return;}
            else {
                var html = await this.loadTemplate();
                this.onConnected()
            }
        }
    }


    async connectedCallback() {
        if( this._is_connected){return;}
        this._is_connected=true;
        var html = await this.loadTemplate();
        this.onTemplateLoaded();

    }

    onTemplateLoaded() {
        this.slots = this.getSlots();
        this.setClassList();
        this.setPrototypeInstance();
        this.setStyleDocuments();
        this.onConnected();
        this.dispatchEvent("connected")
    }


    getSlots() {
        var nodes = [];
        this.childNodes.forEach(node => {
            node.nodeType == 1 &&
                node.getAttribute("slot") &&
                nodes.push(node)
        })
        return nodes;
    }


    cssStyle(){return ""}

    setStyleDocuments() {
        this.loadcss(this.getStyleSheets());
        this.setStylesheet();
    }

    getStyleSheets() {
        var ancestor = this.ancestor;
        var classes = [];
        var ancestors = [];
        var stylesheets = [];

        if (this["@cascade"]) {
            while (ancestor) {
                var p = ancestor.prototype;
                var styles = p["@stylesheets"] || [];
                ancestors.unshift(ancestor);
                for (var i = 0; i <= styles.length - 1; i++) {
                    stylesheets.push(this.relativeToAbsoluteFilePath(styles[i], p.namespace, false));
                }
                ancestor = p["@cascade"] ?
                    p.ancestor : null;
            };
        }

        var this_styles = this["@stylesheets"] || [];
        for (var i = 0; i <= this_styles.length - 1; i++) {
            stylesheets.unshift(this.relativeToAbsoluteFilePath(this_styles[i], this.namespace, false));
        }
        return stylesheets;
    }





    async loadcss(url) {
        var self = this;
        var stylesheets = window.loaded_stylesheets = window.loaded_stylesheets || {};
        if (stylesheets[url]) {
            self.onStylesheetLoaded(stylesheets[url]);
            return;
        }
        var styles = (url || this["@stylesheets"]);

        if (styles) {
            if (styles instanceof Array) {
                styles = styles.reverse();
                styles.forEach(path => this.loadcss(path))
            }
            else if (typeof styles === "string"){
                var path = styles;
                var tagName = /^http/.test(path) ? "link" : "style";
                var tag = document.createElement(tagName);
                    tag.setAttribute("type", 'text/css');
                    tag.setAttribute("rel",  'stylesheet');
                    tag.setAttribute("href",  path);
                    tag.setAttribute("component", this.namespace);
                    this.appendStyleSheet(tag);
                    stylesheets[path] = tag;
                    if(tagName == "style"){
                        var _cssText = await window.imports(path);
                            _cssText = self.cssTransform(_cssText);
                            self.setCssTextAttribute(_cssText, tag);
                            self.onStylesheetLoaded(tag);
                    }
            }
            else {
                try { console.warn("Unable to resolve path to stylesheet. Invalid uri: '" + styles + "'") } catch (e) { }
            }
        }
        else { }

    }

    template(){return null}

    //TODO: new proposal for simpler use and DIP
    evalTemplate(template, data) {
        var eng = this.getTemplateEngine();
        return eng.eval(template, data, this);
    }

    getTemplateEngine() {
        return window.customTemplateEngines.default;
    }

    setPrototypeInstance() {
        this.setAttribute("namespace", this.namespace);
        this.prototype = this;
    }

    setClassList() {
        var classes = [];
        if (this['@cascade'] == true) {
            var ancestor = this.ancestor;
            while (ancestor && ancestor.prototype['@cascade'] == true) {
                var proto = ancestor.prototype;
                classes.unshift(proto.classname)
                ancestor = proto.ancestor;
                if (!ancestor || ancestor == HTMLElement) {
                    break;
                }
            }
        }
        classes.push(this.classname);
        var newClsName = this.className + (" " + classes.join(" "));
        this.className = newClsName.trim();
    }

    // initializeChildComponents (el){
    //     el = el||this;
    // 	var self=this;
    //     var nodes = this.querySelectorAll("*[namespace]");
    //         nodes = [].slice.call(nodes);
    //         nodes.forEach(n => {
    //             if(n && n.nodeType == 1) { 
    //                 var ns = n.getAttribute("namespace");
    //                 var c = NSRegistry[ns];
    //                 c && new c(n);
    //             }
    //         })
    // }


});


transpile(w3c.ui.WebComponent, 'es7');
traits(w3c.ui.WebComponent, [
    core.traits.ResourcePathTransformer
]);