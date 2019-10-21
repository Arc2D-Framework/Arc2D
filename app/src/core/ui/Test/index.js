
namespace `core.ui` (
    class MyTest extends w3c.ui.WebComponent{
		constructor(){
        	super();
		}

		onConnected(){
			this.render()
		}

		template(){
			return `
				<template>
						<div>Hello World</div>
				</template>`
		}
    }
);