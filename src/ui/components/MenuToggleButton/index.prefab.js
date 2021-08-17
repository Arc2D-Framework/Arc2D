
                
namespace `ui.components` (
	class MenuToggleButton extends WebComponent  {
		async onConnected(){
			super.onConnected();
			this.on("click", e=>this.onClick(e), false, ".nav-icon");
		}

		onClick(e){
			e.target.classList.toggle("active")
		}
	}
)


                ui.components.MenuToggleButton.prototype.template = function(){
                    return `<template>
	<div class="nav-icon">
		<div></div>
	</div>
</template>
`
                };

                ui.components.MenuToggleButton.prototype.cssStyle = function(){
                    return `:host .nav-icon {
  margin: 1em;
  width: 40px;
}

:host .nav-icon:after, 
:host .nav-icon:before, 
:host .nav-icon div {
  background-color: black;
  border-radius: 3px;
  content: '';
  display: block;
  height: 5px;
  margin: 7px 0;
  transition: all .2s ease-in-out;
}

:host .nav-icon.active:before {
  transform: translateY(12px) rotate(135deg);
}

:host .nav-icon.active:after {
  transform: translateY(-12px) rotate(-135deg);
}

:host .nav-icon.active div {
  transform: scale(0);
}
`
                };

                ui.components.MenuToggleButton.prototype.onLoadInstanceStylesheet = function(){ return false }
