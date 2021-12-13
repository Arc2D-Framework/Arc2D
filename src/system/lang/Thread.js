namespace `system.lang` (
    class Thread {
        constructor(func){
            this.func = func;
            var blob;
            if(this.func.name == "") {
                blob = new Blob([`self.onmessage = ${this.func.toString()}`]);
            }
            else {
                var src = this.func.toString();
                src = src.replace(this.func.name, "function")
                blob = new Blob([`self.onmessage = ${src}`]);
            }
            var blobURL = window.URL.createObjectURL(blob);
            var worker = new Worker(blobURL);
            return worker;
        }
    }
)