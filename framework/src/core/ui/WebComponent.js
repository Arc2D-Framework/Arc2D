import 'src/system/drivers/templating/Manager.js';
import 'src/system/drivers/templating/TemplateLiterals.js';
import 'src/system/drivers/watchers/default.js';

namespace `core.ui` (
    class WebComponent extends HTMLElement {
        constructor(el) {
            super();
            this.element = el;
            this.__proto = this.constructor.prototype;
            this.root = this.inShadow() ? 
                this.attachShadow({ mode: 'open' }) : 
                (this.element||this);

            if(this.isExistingDomNode(this.element)){
                this.connectedCallback();
            }
        }

        isExistingDomNode(el){
            return el && el.parentNode && el.parentNode.nodeType==1
        }

        // static define(proto=this,name){
        //     if(proto == WebComponent||proto == Application||proto == World){return}
        //     var ce = window.customElements;
        //     var tag = (name||proto.classname||proto.name||'').replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
        //     if(tag && ce.get(tag)){
        //         console.log(`Class ${proto.classname||proto.name} already defined by another tag '${tag}'`);
        //         return
        //     }
            
        //     if(/\-/.test(tag)){
        //         if(ce.get(tag)){return}
        //         this.defineAncestors();
        //         this.defineAncestralClassList();
        //         try{
        //             ce && ce.define(tag, this);
        //             proto["ns-tagname"] = tag;
        //         }
        //         catch(e){
        //             console.warn(`${proto.name} already registerd as tag: '${proto["ns-tagname"]}'. Ignoring tag '${tag}'`)
        //             throw e
        //         }
        //     }    
        // }


        //WORKING::
        static define(proto,bool){
            var ce = window.customElements;
            var tag = proto.classname.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
                tag = /\-/.test(tag)?tag:proto["ns-trait-tagname"];
            if(/\-/.test(tag)){
                if(ce.get(tag)){return}
                proto["ns-tagname"] = tag;
                delete proto["ns-trait-tagname"]
                this.defineAncestors();
                this.defineAncestralClassList();
                try{ce && ce.define(tag, this);}
                catch(e){

                }
            }     
        }


        setStylesheet () {    
            var css = this.cssStyle();
            !!css && !this.__proto._style_defined ? 
                (this.onAppendStyle(
                    `<style>\n${this.onTransformStyle(css)}\n</style>`.toNode()),
                    this.__proto._style_defined=false
                ) : null;
        }

        querySelector(cssSel, e){
            if(e){
                return this.getParentNodeFromEvent(e,cssSel)
            } else {
            return (this.inShadow()||this.element) ?
                this.root.querySelector(cssSel):
                super.querySelector(cssSel)
            }
        }

        querySelectorAll(cssSel, deep){
            return (this.inShadow()||this.element) ?
                this.root.querySelectorAll(cssSel):
                super.querySelectorAll(cssSel)
        }

        onAppendStyle(stylesheet) {
            if(this.inShadow()){
                try{
                    var sheet = new CSSStyleSheet();
                        sheet.replace(stylesheet.innerText);
                    this.root.adoptedStyleSheets = [sheet];
                } catch(e){
                    //TODO: use error code
                    console.error(`${e.message} Unable to adopt stylesheet 
                        into shadow dom -- ${this.namespace}#onAppendStyle(), 
                        see: https://bugzilla.mozilla.org/show_bug.cgi?id=1520690.`)
                }
            }
            else {
                var headNode = document.querySelector("head")
                var configscript = document.querySelector("script");
                headNode.insertBefore(stylesheet, configscript);
            }
        }

        onStyleComputed(stylesheet){}

        adopts(orphan) {
            orphan && orphan.parentNode.replaceChild(this.root, orphan)
            orphan && this.root.appendChild(orphan);
        }

        replaces(orphan) {
            orphan && orphan.parentNode.replaceChild(this.root, orphan);
        }

        dispatchEvent(type, data, details = { bubbles: true, cancelable: true, composed: true }, element = this) {
            var evt = typeof type =="object" ? type : new CustomEvent(type, details);
                evt.data = data;
            if(this.element){return this.element.dispatchEvent(evt);}
            else{return super.dispatchEvent(evt);}
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
                            preventDefault:  () => e.preventDefault(),
                            stopPropagation: () => e.stopPropagation()
                        });
                    }
                }, bool);
            } else {
                if(this.isExistingDomNode(this.element)){
                    this.element.addEventListener(evtName, handler, bool);
                }
                else{
                    super.addEventListener(evtName, handler, bool);
                }
            }
        }

        getParentBySelectorUntil(elem=this.root, terminator="html", selector) {
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


        onTransformStyle(cssText){
            if(!this.inShadow()){
                return cssText.replace(/\:+host/gm, `.${this.classname}`)
            } else{
                return cssText;
            }
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
                var tem  =  this.getTemplateToLoad();
                if(/\/*\.html$/.test(tem)){
                    var src=this.src||tem;//TODO: bug here?
                    var opts = Config.IMPORTS_CACHE_POLICY;
                    src = src.replace("/./", this.namespace.replace(/\./gim, "/") + "/");
                    this._template = await imports(src, opts);
                }
                else if(/<\s*\btemplate\b/.test(tem)){//from inner template()
                    this._template=tem;
                }
                else if(tem && tem.nodeType==1 && tem.tagName.toLowerCase()=="template"){
                    this._template=tem.outerHTML;
                }
                else if(tem && tem.nodeType==1){
                    this._template=`<template>${tem.outerHTML}</template>`;
                }
                resolve(this._template);
            })
        }

        getTemplateToLoad(){
            var engine = this.getTemplateEngine();
            return  this.querySelector("template")||    //node
                    this.src||                          //uri
                    this.template()||                   //string
                    this.element||
                    Config.SRC_PATH+"/./index" + (engine.ext||"") + ".html" //TODO: default but ignores <Config.TEMPLATE_NAMES_USE_ENGINE_EXTENSION>
        }


        async onConnected(data) { await this.render(data) }
        
        //TODO: Refactor
        async render(data={}) {
            if(this.isExistingDomNode(this.element)){
                this.onTemplateRendered(temNode);
                return
            }
            var t = this._template;
            if (t) {
                var html = await this.evalTemplate(t, data);
                var temNode = html.toNode();
                    temNode = temNode.content;
                if (!this.inShadow() && this.isComposable()) {
                    for(let slot of this.slots){
                        var slotName = slot.getAttribute('slot');
                        var placeholder = temNode.querySelector(`slot[name="${slotName}"]`);
                        if( placeholder){
                            if(!placeholder.hasAttribute("append")){
                                placeholder.innerHTML="";
                            }
                        }
                        (placeholder||temNode).appendChild(slot)
                    }
                }
                if(this.element){
                    this.innerHTML = "";
                    this.appendChild(temNode);
                }
                else{
                    this.root.innerHTML = "";
                    this.root.appendChild(temNode);
                }
                this.onTemplateRendered(temNode);
            }
        }

        isComposable(){
            return false
        }

        template(){return null}

        async evalTemplate(template, data) {
            var eng = this.getTemplateEngine();
            return await eng.parse(template, data, this);
        }

        getTemplateEngine() {//TODO: Need to make it configurable, see <Config.DEFAULT_TEMPLATE_ENGINE_MIMETYPE>
            return window.customTemplateEngines.default;
        }

        async connectedCallback() {
            if( this._is_connected){return;}
            this._is_connected=true;
            var html = await this.loadTemplate();
            this.onTemplateLoaded();
        }

        async onTemplateLoaded() {
            this.slots = this.isComposable()&&this.getSlots();
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

        inShadow() {
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
            while(a && this.ancestors.push(a)){
                  a = a.prototype.ancestor}
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
            if(this.onLoadInstanceStylesheet()){
                stylesheets.push(this.getNSStyleSheet(this.namespace))
            }
            stylesheets.push(...this.prototype["@stylesheets"]||[]);
            if(!this['@cascade']){ return }
            var ancestor = this.__proto.ancestor;
            while(ancestor) {
                if( ancestor != WebComponent && 
                    ancestor != Application  &&
                    ancestor != World        &&
                    ancestor.prototype.onLoadInstanceStylesheet() ){
                    stylesheets.unshift(...ancestor.prototype["@stylesheets"]||[]);
                    stylesheets.unshift(this.getNSStyleSheet(ancestor.prototype.namespace));
                    ancestor = ancestor.prototype.ancestor;
                } else { break }
            }
        }

        getNSStyleSheet(ns){
            return relativeToAbsoluteFilePath(Config.SRC_PATH+"/./index.css",ns);
        }

        setClassList() {
            this.root.className += " " + (this["@cascade"]? 
                " " + (this.__proto.classes.join(" ")):
                " " + this.root.classname).trim();
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
            if(!this.__proto._css_loaded){
                this.__proto._css_loaded={}
            }
            return new Promise(async (resolve,reject) => {
                urls=urls.reverse();
                var stylesheets = window.loaded_stylesheets = window.loaded_stylesheets|| {};
                for(let path of urls){
                    if(this.__proto._css_loaded[path] && !this.inShadow()){continue}
                    path = this.onLoadStyle(path);
                    this.__proto._css_loaded[path]=true;
                    if((path && !stylesheets[path]) || this.inShadow()){
                        var tagName = /^http/.test(path) ? "link" : "style";
                        var tag = document.createElement(tagName);
                            tag.setAttribute("type", 'text/css');
                            tag.setAttribute("rel",  'stylesheet');
                            tag.setAttribute("href",  path);
                            tag.setAttribute("component", this.namespace);
                            stylesheets[path] = tag;
                            if(tagName.toLowerCase() == "style"){
                                var _cssText = await window.imports(path);
                                if( _cssText){
                                    _cssText = this.onTransformStyle(_cssText);
                                    _cssText && this.setCssTextAttribute(_cssText, tag);
                                    this.onAppendStyle(tag);
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
            this.setAttribute("namespace", this.namespace);
            this.prototype = this;
        }

        hasChildComponents(){return false}

        initializeChildComponents (el=this.root){
            if(!this.hasChildComponents()){return}
            var nodes = Array.from(el.querySelectorAll("*"));
                nodes.forEach(n => {
                    if(n && n.nodeType == 1) {/*TODO: implement*/}
                })
        }

        isAnyPartOfElementInViewport(el=this.root) {
            var rect = el.getBoundingClientRect();
            var v = (rect.top  <= window.innerHeight) && ((rect.bottom) >= 0);
            var h = (rect.left <= window.innerWidth)  && ((rect.right)  >= 0);
            return (v && h);
        }

        watch(object,prop,cb,force,engine=system.drivers.watchers.Watcher){
            object = typeof object == "string"?this.querySelector(object):object;
            return engine.watch(object,prop,cb,force)
        }
    }
);
window.WebComponent = window.WebComponent||core.ui.WebComponent;
cascade(core.ui.WebComponent,true);
namespace `w3c.ui` (core.ui.WebComponent);
