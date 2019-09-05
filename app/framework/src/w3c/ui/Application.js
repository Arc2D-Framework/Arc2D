
import 'w3c.ui.WebComponent';

namespace("w3c.ui.Application", class extends w3c.ui.WebComponent {
    constructor(element) {
        super(element);
        window.application = this;
        this.head           = document.getElementsByTagName("head")[0];
        this.configscript   = document.querySelector("script[id='config']")||
                              document.querySelector("script");
    }

    template(){return ""}
});
