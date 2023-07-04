class ArcThreadTest  {
    constructor(){
        var thread = new core.lang.Thread(this.fibonacci)
            thread.onmessage = this.onThreadMesssage;
            thread.postMessage(50);//kick it off
    }

    fibonacci(num){
        var a = 1, b = 0, temp;
        while (num >= 0){
        temp = a;
        a = a + b;
        b = temp;
        num--;
        }

        return postMessage(b);
    }

    onThreadMesssage = (event) => {
        console.log("fibonacci val", event.data);
    }
}