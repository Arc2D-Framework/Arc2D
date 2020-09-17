Audio.prototype.playsync = async function(){
    return new Promise((resolve,reject) =>{
        this.addEventListener('ended', function () {
            resolve()
        }, true);
        this.play();
    })
}