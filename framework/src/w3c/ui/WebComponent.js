import 'src/core/ui/templating/CustomTemplateEngines.js';
import 'src/core/ui/templating/TemplateLiterals.js';
import 'src/core/ui/templating/ThreadedTemplateLiterals.js';

namespace `w3c.ui` (
    class WebComponent extends HTMLElement {
        constructor(el) {
            super();
            this.element = el;
            this.__proto = this.constructor.prototype;
            this.root = this.onEnableShadow() ? 
                this.attachShadow({ mode: 'open' }) : 
                (this.element||this);

            if(this.element){
                this.decorate();
            }
        }

        static define(proto,bool){
            var tag = proto.classname.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
            if(/\-/.test(tag)){
                if(window.customElements.get(tag)){return}
                console.info("Defining tag", tag);
                proto["ns-tagname"] = tag;
                this.defineAncestors();
                this.defineAncestralClassList();
                // this.defineAncestralStyleList();
                try{window.customElements && window.customElements.define(tag, this);}
                catch(e){console.error(e)}
            }else {
                console.warn(`${proto.namespace}#define() - invalid tag name. Dashes required for`, tag)
            }       
        }

        setStylesheet () {    
            var css = this.cssStyle();
            !!css && !this.__proto._style_defined ? 
                (this.onAppendStyle(
                    `<style>\n${css}\n</style>`.toDomElement()), //TODO:do i really need text/css attrbs?
                    this.__proto._style_defined=true
                ) : null;
        }

        querySelector(cssSel, e){
            if(e){
                return this.getParentNodeFromEvent(e,cssSel)
            } else {
            return (this.onEnableShadow()||this.element) ?
                this.root.querySelector(cssSel):
                super.querySelector(cssSel)
            }
        }

        querySelectorAll(cssSel, deep){
            return (this.onEnableShadow()||this.element) ?
                this.root.querySelectorAll(cssSel):
                super.querySelectorAll(cssSel)
        }

        onAppendStyle(stylesheet) {
            if(this.onEnableShadow()){
                try{
                    var style = new CSSStyleSheet();
                    style.replace(stylesheet.innerText);
                    this.root.adoptedStyleSheets = [stylesheet];
                    // this.onStyleComputed(stylesheet);
                } catch(e){
                    console.error(`${e.message} Unable to adopt stylesheet 
                        into shadow dom -- ${this.namespace}#onAppendStyle(), 
                        see: https://bugzilla.mozilla.org/show_bug.cgi?id=1520690.
                        As a workaround, @import the css from within <template>`)
                }
            }
            else {
                var headNode = application.head;
                var configscript = application.configscript;
                headNode.insertBefore(stylesheet, configscript);
                // this.onStyleComputed(stylesheet);
            }
        }

        onStyleComputed(stylesheet){}

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

        on(evtName, handler, bool=false, el) {
            this.addEventListener(evtName, handler, bool, el)
        }

        addEventListener(evtName, handler, bool=false, el) {
            var self = this;
            if (typeof el == "string") {
                this.addEventListener(evtName, e => {
                    var t = this.getParentNodeFromEvent(e, el);
                    if (t) {
                        handler({
                            target: t,
                            realtarget: e.target,
                            src: e,
                            preventDefault: () => e.preventDefault(),
                            stopPropagation: () => e.stopPropagation()
                        });
                    }
                }, bool);
            } else {
                super.addEventListener(evtName, handler, bool);
            }
        }

        getParentBySelectorUntil(elem=this, terminator="html", selector) {
            var parent_node = null;
            do {
                if(elem.matches(selector)){
                    parent_node = elem;
                    break;
                }
                if(elem.matches(terminator)){
                    break;
                }
                elem=elem.parentNode;
            } while(elem && elem.matches) 

            return parent_node;
        }

        getParentNodeFromEvent(e, selector, terminator) {
            var el = e.composedPath()[0];
            return this.getParentBySelectorUntil(el, terminator, selector);
        }

        onStylesheetLoaded(style) { }

        onTransformStyle(css) {return css}

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
                var tem  =  this.getTemplateToLoad();
                
                if(/\/*\.html$/.test(tem)){
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

        getTemplateToLoad(){
            var engine = this.getTemplateEngine();
            return  this.querySelector("template")||    //node
                    this.src||                          //uri
                    this.template()||                   //string
                    "/src/./index" + (engine.ext||"") + ".html" //default
        }


        async onConnected(data) { 
            // debugger; 
            await this.render(data);
        }
        
        //TODO:Don't ever use await in here!!
        // onPreConnected() { 
        //     debugger; 
        //     this.onConnected()
        // }

        async render(data) {
            if(this.element){return}
            data = data || {};
            var t = this._template;
            if (t) {
                var html = await this.evalTemplate(t, data || {});
                var temNode = html.toDomElement();
                temNode = temNode.content;
                if (!this.onEnableShadow()) {
                    this.slots.forEach(slot => {
                        var slotName = slot.getAttribute('slot');
                        var placeholder = temNode.querySelector(`slot[name="${slotName}"]`);
                        if( placeholder){
                            if(!placeholder.hasAttribute("append")){
                                placeholder.innerHTML="";
                            }
                        }
                        (placeholder||temNode).appendChild(slot)
                    })
                }
                this.root.innerHTML = "";
                this.root.appendChild(temNode);
                this.onTemplateRendered(temNode);
            }
        }

        template(){return null}

        async evalTemplate(template, data) {
            var eng = this.getTemplateEngine();
            return await eng.parse(template, data, this);
        }

        getTemplateEngine() {
            return window.customTemplateEngines.default;
        }

        async connectedCallback() {
            if( this._is_connected){return;}
            this._is_connected=true;
            var html = await this.loadTemplate();
            this.onTemplateLoaded();
        }

        decorate(){
            this.setClassList();
            this.setPrototypeInstance();
            this.defineAncestralStyleList();
            this.setStyleDocuments();
            this.onConnected();
        }

        async onTemplateLoaded() {
            this.slots = this.getSlots();
            this.setClassList();
            this.setPrototypeInstance();
            this.defineAncestralStyleList();
            
            await this.onConnected();
            await this.setStyleDocuments();
        }

        getSlots() { return Array.from(this.children) }


        onTemplateRendered(){
            this.initializeChildComponents();
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
            return this.hasAttribute('shadow');
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
                    await this.onConnected()
                }
            }
        }

        cssStyle(){ return "" }

        onLoadInstanceStylesheet(){ return true }

        static defineAncestors(){
            this.ancestors=[];
            var a=this;
            while(a && this.ancestors.push(a))
                  a = a.prototype.ancestor;
        }

        static defineAncestralClassList(){
            this.prototype.classes = [];
            for(let ancestor of this.ancestors){
                var proto = ancestor.prototype;
                if( proto['@cascade']||ancestor==this){
                    this.prototype.classes.unshift(proto.classname)
                } else { break }
            }
        }


        defineAncestralStyleList(){
            var stylesheets = this.prototype["stylesheets"] = this.prototype["stylesheets"]||[];
            if(this.onLoadInstanceStylesheet()){stylesheets.push(this.getNSStyleSheet(this.namespace));}
                stylesheets.push(...this.prototype["@stylesheets"]||[]);
            if(!this['@cascade']){return}
            var ancestor = this.constructor.prototype.ancestor;

            while(ancestor) {
                if( ancestor != w3c.ui.WebComponent && 
                    ancestor != w3c.ui.Application){
                    
                    stylesheets.unshift(...ancestor.prototype["@stylesheets"]||[]);
                    stylesheets.unshift(this.getNSStyleSheet(ancestor.prototype.namespace));
                    ancestor = ancestor.prototype.ancestor;
                } else { break }
            }
        }

        getNSStyleSheet(ns){
            return relativeToAbsoluteFilePath("/src/./index.css",ns);
        }

        setClassList() {
            this.root.className = this.root.className + (this["@cascade"]? 
                " " + (this.constructor.prototype.classes.join(" ")).trim():
                " " + this.classname);
        }

        getStyleSheets() {
            var styles = this["stylesheets"]||[];
            if(styles.length<=0 && this.onLoadInstanceStylesheet()){styles.push(this.getNSStyleSheet(this.namespace))}
            return styles.reverse();
        }

        async setStyleDocuments() {
            await this.loadcss(this.getStyleSheets());
            this.setStylesheet();
            this.onStyleComputed(this.stylesheets);
        }

        async loadcss(urls) {
            return new Promise(async (resolve,reject) => {
                if(this.constructor.prototype._css_loaded){
                    resolve(true);
                    return
                }
                else {
                    console.log(this.namespace + " loading", urls)
                }
                this.constructor.prototype._css_loaded=true;

                urls=urls.reverse();
                var stylesheets = window.loaded_stylesheets = window.loaded_stylesheets|| {};
                for(let path of urls){
                    path = this.onLoadStyle(path);
                    if(path && !stylesheets[path]){
                        var tagName = /^http/.test(path) ? "link" : "style";
                        var tag = document.createElement(tagName);
                        this.onAppendStyle(tag);
                            tag.setAttribute("type", 'text/css');
                            tag.setAttribute("rel",  'stylesheet');
                            tag.setAttribute("href",  path);
                            tag.setAttribute("component", this.namespace);
                            stylesheets[path] = tag;
                            if(tagName.toLowerCase() == "style"){
                                var _cssText = await window.imports(path);
                                if(_cssText){
                                    _cssText = this.onTransformStyle(_cssText);
                                    _cssText && this.setCssTextAttribute(_cssText, tag);
                                    this.onStylesheetLoaded(tag);
                                }
                            }
                    }
                }
                resolve(true);
            })
        }

        onLoadStyle(url){ return url }


        setPrototypeInstance() {
            this.root.setAttribute("namespace", this.namespace);
            this.prototype = this;
        }

        resourcepath(url, ns){
            url = url.replace(/\$\{ns\}/gm, ns.replace(/\./gim,"/"));
            return Config.ROOTPATH + url;
        }

        initializeChildComponents (el){
            el = el||this;
            var self=this;
            var nodes = this.querySelectorAll("*");
                nodes = [].slice.call(nodes);
                nodes.forEach(n => {
                    if(n && n.nodeType == 1) { 
                        var tag = n.tagName.toLowerCase();
                        var c = window.registered_tags[tag];
                        c && c.define(c.prototype,true);
                    }
                })
        }

        isAnyPartOfElementInViewport(el=this) {
            var rect = el.getBoundingClientRect();
            var v = (rect.top  <= window.innerHeight) && ((rect.bottom) >= 0);
            var h = (rect.left <= window.innerWidth)  && ((rect.right)  >= 0);
            return (v && h);
        }
    }
);

cascade(w3c.ui.WebComponent,true);