import '/src/core/ui/Sample/index.js';

@tag("x-sample");
@stylesheets(["/src/./index.css"]);
@cascade(true);
namespace("core.ui.SampleX", class extends core.ui.Sample{
    constructor(element) {
        super(element);
        this.addEventListener('click', e => {
            alert(this.namespace + ": " + e.target.tagName, e)
        });
        this.dispatchEvent(new CustomEvent('ready', {bubbles: true }))
        return this;
    }

    onConnected (){
        this.render();
    }

    setRed (){
        this.classList.add("red")
    }

    template(){ return `
        <template>
            <b>x-slot: <slot name="x-sample"></slot></b>
        </template>
    `}
});