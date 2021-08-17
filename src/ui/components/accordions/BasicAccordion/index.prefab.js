
                
namespace `ui.components.accordions` (
	class BasicAccordion extends WebComponent  {
		
	}
)


                ui.components.accordions.BasicAccordion.prototype.template = function(){
                    return `<template>
	<div class="tabs">
		<slot name="content" append>
			<div class="tab">
				<input type="checkbox" id="chck1">
				<label class="tab-label" for="chck1">Item 1</label>
				<div class="tab-content">
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, reiciendis!
				</div>
			</div>
			<div class="tab">
				<input type="checkbox" id="chck2">
				<label class="tab-label" for="chck2">Item 2</label>
				<div class="tab-content">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. A, in!
				</div>
			</div>
		</slot>
	</div>
</template>
`
                };

                ui.components.accordions.BasicAccordion.prototype.cssStyle = function(){
                    return `
/* 
h1 {
  margin: 0;
  line-height: 2;
  text-align: center;
}

h2 {
  margin: 0 0 0.5em;
  font-weight: normal;
} */
:host {
    width: 300px;
}
:host input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}
/* 
.row {
  display: flex;
}
.row .col {
  flex: 1;
}
.row .col:last-child {
  margin-left: 1em;
} */

/* Accordion styles */
:host .tabs {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 4px -2px rgba(0, 0, 0, 0.5);
}

:host .tab {
  width: 100%;
  color: white;
  overflow: hidden;
}
:host .tab-label {
  display: flex;
  justify-content: space-between;
  padding: 1em;
  background: #2c3e50;
  font-weight: bold;
  cursor: pointer;
  /* Icon */
}
:host .tab-label:hover {
  background: #1a252f;
}
:host .tab-label::after {
  content: "❯";
  width: 1em;
  height: 1em;
  text-align: center;
  transition: all 0.35s;
  transform: rotate(90deg);

}

:host .tab-content {
  /* max-height: 0; */
  display: none;
  max-height: 100vh;
  padding: 0 1em;
  color: #2c3e50;
  background: white;
  transition: all 0.35s;
}
:host .tab-close {
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  font-size: 0.75em;
  background: #2c3e50;
  cursor: pointer;
}
:host .tab-close:hover {
  background: #1a252f;
}

:host input:checked + .tab-label {
  background: #1a252f;
}
:host input:checked + .tab-label::after {
  transform: rotate(-90deg);
}
:host input:checked ~ .tab-content {
  /* max-height: 100vh; */
  padding: 10px;
  display: block;
}
`
                };

                ui.components.accordions.BasicAccordion.prototype.onLoadInstanceStylesheet = function(){ return false }
