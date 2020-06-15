(async ()=>{ (()=> {
  var modulemap = window.modulemap ={};
  window.require = async function importModule(url) {
    var absURL = toAbsoluteURL(url);
    var mod=modulemap[absURL];
    return new Promise(async (resolve, reject) => {
      if (mod) { return resolve(mod)};
      var s1 = document.createElement("script");
          s1.type = "module";
          s1.onerror = () => reject(new Error(`404: ${url}`));
          s1.onload  = () => {
            resolve(modulemap[absURL]);URL.revokeObjectURL(s1.src);s1.remove();
          };
      const loader = `import * as m from "${absURL}"; modulemap['${absURL}'] = m;`;
      const blob = new Blob([loader], { type: "text/javascript" });
      s1.src = URL.createObjectURL(blob);
      document.head.appendChild(s1);
    });
  };
  function supportsDynamicImport() {
    try { new Function('import("")'); return true;} catch (err) {return false;}
  }
})();
await require('/framework/src/core/drivers/templating/Nunjucks/nunjucks-driver.js');

                
namespace `core.ui` (
	class NotificationsToggleSwitch  extends w3c.ui.WebComponent  {
		async onConnected(){
            await super.onConnected();
            
            this.knob = this.querySelector(".knob");
            this.direction = -1;
            this.addEventListener("click", e => this.onHandleToggleClick(e), false, "notifications-toggle-switch");
            this.addEventListener("transitionend", e => this.onStyleComputed(e));
            this.nameSlot = this.querySelector("span#nameSlot");

            this.setSlotText();
            this.onReset = this.onHandleToggleClick;
        }

        setSlotText(){
            this.nameSlot.innerHTML = this.name || this.getAttribute("name");
        }

        onStyleComputed(style){
            this.bounds = this.getBoundingClientRect();
            this.knob_bounds = this.knob.getBoundingClientRect();
            var style = window.getComputedStyle(this.knob);
            var matrix = new DOMMatrix(style.transform);
            this.matrix = matrix;
        }

        onHandleToggleClick(){
            this.direction == 1 ? this.direction = 0 : this.direction = 1;
            this.onRender();
        }

        toggleActive(){
            this.classList.toggle("active");
            this.nameSlot.classList.toggle("active-color");
            this.dispatchEvent("toggleit",{toggleState:this.classList.contains("active")})
        }

        get x() {
            return this.direction > 0 ?
                this.bounds.width-this.knob_bounds.width-6 : 0;
        }

        onRender(){
            var vector = {x: this.x, y:0, z:0 }
            this.knob.style.transform = `
                translate3d(${vector.x||0}px,${vector.y||0}px,${vector.z||this.matrix.m43}px)
            `;
            this.toggleActive();
        }
	}
)


                core.ui.NotificationsToggleSwitch.prototype.template = function(){
                    return `<template>
    <div class="knob"></div>
    <span id="nameSlot"></span>
</template>
`
                };

                core.ui.NotificationsToggleSwitch.prototype.cssStyle = function(){
                    return `
notifications-toggle-switch {
    width: 40px;
    height: 20px;
    display: block;
    background: lightgray;
    border-radius: 30px;
    box-sizing: content-box;
    padding: 3px;
    perspective: 3000px;
    transition: all .3s ease-out;
    transition-delay: .2s;
    position: relative;
    cursor: pointer;
}

notifications-toggle-switch .knob {
    transition: all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    width: 20px;
    height: 20px;
    background: white;
    box-sizing: border-box;
    border-radius: 50%;
    cursor: pointer;
}

notifications-toggle-switch span{
    font-family: 'Inter', sans-serif;
    font-size: 22px;
    transition: all .2s ease-out;
    color: #828181;
    position: absolute;
    top: -3px;
    left: 60px;
    user-select: none;
}

.active{
    background: #55b982 !important;
}

.active-color{
    color: #333 !important;
}
`
                };

                core.ui.NotificationsToggleSwitch.prototype.onLoadInstanceStylesheet = function(){ return false }



//mport 'core.ui.Test2';

namespace `applications` (
    class NotificationsApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        getTemplateEngine() {
            return window.customTemplateEngines.getEngineByMimeType("template/nunjucks")
        }

        async onConnected() {
            await super.onConnected({items: ["News Feeds", "Likes and Comments", "Live Stream", "Upcoming Events", "Friend Requests", "Nearby Friends", "Birthdays", "Account Sign-In"]});
            this.addEventListener("toggleit", (e) => this.toggleContent(e), false, "#main-toggle");
            this.bottomContent = this.querySelector("#bottom-content");
            this.allToggleSwitches = Array.from(this.querySelectorAll("notifications-toggle-switch"));
        }

        toggleContent(e){
            e = e.src;
            this.bottomContent.classList.toggle("show");
            if(!e.data.toggleState){
                this.allToggleSwitches.forEach(node => {
                    if(node.classList.contains("active")){
                        node.onReset();
                    }
                });
            }
        }
    }
);

 })()