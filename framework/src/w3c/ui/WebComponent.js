import 'src/core/ui/templating/CustomTemplateEngines.js';
import 'src/core/ui/templating/TemplateLiterals.js';

namespace `w3c.ui` (
    class WebComponent extends HTMLElement {
        constructor() {
            super();
            this.__proto = this.constructor.prototype;
            this.root = this.onEnableShadow() ? 
                this.attachShadow({ mode: 'open' }) : this;
        }

        getDefaultStyleSheet(){
            return relativeToAbsoluteFilePath("/src/./index.css",this.namespace);
        }

        static define(proto,bool){
            var tag = proto.classname.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
            if(/\-/.test(tag)){
                proto["ns-tagname"] = tag;
                this.defineAncestors();
                this.defineAncestralClassList();
                try{window.customElements && window.customElements.define(tag, this);}
                catch(e){console.error(e)}
            }       
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
        querySelector(cssSel, e){
            if(e){
                return this.getParentNodeFromEvent(e,cssSel)
            } else {
            return this.onEnableShadow() ?
                this.root.querySelector(cssSel):
                super.querySelector(cssSel)
            }
        }

        querySelectorAll(cssSel, deep){
            return this.onEnableShadow() ?
                this.root.querySelectorAll(cssSel):
                super.querySelectorAll(cssSel)
        }

        appendStyleSheet(stylesheet) {
            if(this.onEnableShadow()){
                try{
                    var style = new CSSStyleSheet();
                    style.replace(stylesheet.innerText);
                    this.root.adoptedStyleSheets = [stylesheet]
                } catch(e){
                    console.error(`${e.message} Unable to adopt stylesheet 
                        into shadow dom -- ${this.namespace}#appendStyleSheet(), 
                        see: https://bugzilla.mozilla.org/show_bug.cgi?id=1520690.
                        As a workaround, @import the css from within <template>`)
                }
            }
            else {
                var headNode = application.head;
                var configscript = application.configscript;
                headNode.insertBefore(stylesheet, configscript);
            }
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
        bind(el, evtName, handler, bool=false) {
            var self = this;
            if (typeof el == "string") {
                this.addEventListener(evtName, e => {
                    var t = this.getParentNodeFromEvent(e, el);
                    if (t) {
                        handler({
                            target: t,
                            realtarget: e.target,
                            src: e,
                            preventDefault: () => e.preventDefault,
                            stopPropagation: () => e.stopPropagation
                        });
                    }
                }, bool);
            } else {
                el.addEventListener(evtName, handler, bool);
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

        cssTransform(css) {return css}

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
            return  this.querySelector("template")||    //node
                    this.src||                          //uri
                    this.template()||                   //string
                    "/src/./index.html"                 //default
        }


        onConnected() { }
        
        onPreConnected() { 
            this.onConnected()
        }

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
            this.onPreConnected();
        }


        getSlots() {
            return Array.from(this.children)
        }


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
                    this.onPreConnected()
                }
            }
        }

        cssStyle(){return ""}

        setStyleDocuments() {
            this.loadcss(this.getStyleSheets());
            if(this.onLoadInstanceStylesheet()){this.loadcss([this.getDefaultStyleSheet()])}
            this.setStylesheet();
        }

        onLoadInstanceStylesheet(){
            return true;
        }

        static defineAncestors(){
            this.ancestors=[];
            var a=this;
            while(a && this.ancestors.push(a)){
                a = a.prototype.ancestor;
            }
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

        setClassList() {
            this.className += this.className + (" " + this.constructor.prototype.classes.join(" ")).trim()
        }

        getStyleSheets() {
            var styles = this["@stylesheets"]||[];
            return styles.reverse();
        }

        async loadcss(urls) {//TODO:rename to onLoadStyle()
            urls=urls.reverse();
            var stylesheets = window.loaded_stylesheets = window.loaded_stylesheets|| {};
            for(let path of urls){
                path = this.onLoadStyle(path);
                if(path && !stylesheets[path]){
                    var tagName = /^http/.test(path) ? "link" : "style";
                    var tag = document.createElement(tagName);
                        tag.setAttribute("type", 'text/css');
                        tag.setAttribute("rel",  'stylesheet');
                        tag.setAttribute("href",  path);
                        tag.setAttribute("component", this.namespace);
                        stylesheets[path] = tag;
                        if(tagName.toLowerCase() == "style"){
                            var _cssText = await window.imports(path);
                                _cssText = this.cssTransform(_cssText);//TODO: rename to onTransformStyle()
                                this.setCssTextAttribute(_cssText, tag);
                                this.onStylesheetLoaded(tag);
                        }
                        this.appendStyleSheet(tag);//TODO: rename to onAppendStyle
                }
            }
        }

        onLoadStyle(url){
            return url;
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
