@transpile("es7");
@traits([new Observer]);
namespace("core.ui.Binding", class {
  
    constructor (el, evtName, handler){
      this.observations = [];
      this.subscribers  = {};
  
      this.element = el;
      this.evtName = evtName;
      this.handler = handler;
      this.bound=true;
    }
  
    unbind (){
      this.element.removeEventListener(this.evtName, this.handler, false);
      // console.log("unbound", this.evtName,this.handler);
      this.bound=false;
    }
  
    bind (){
      this.element.addEventListener(this.evtName, this.handler, false);
      // console.log("bounded", this.element);
      this.bound=true;
    }
  
    toggle(){
      this.bound?
        this.unbind():
        this.bind();
  
      this.dispatchEvent("change", {isbound:this.bound, target:this.element, binding:this}, this)
    }
  });