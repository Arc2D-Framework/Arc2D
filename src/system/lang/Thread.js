namespace `core.lang` (
    class Thread {
        constructor(func){
            this.func = func;
            var blob = new Blob([`
                self.onmessage = ${this.func.toString()}
            `]);
            var blobURL = window.URL.createObjectURL(blob);
            var worker = new Worker(blobURL);
            return worker;
        }
    }
)