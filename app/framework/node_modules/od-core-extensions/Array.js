
if(!Array.prototype.where){
    Array.prototype.where = function(exp){
        var exp = new Function("$", "return " + exp);
        var arr=[];
        for(var i=0; i<=this.length-1; i++){
            if(exp(this[i])){
                arr.push(this[i])
            }
        }
        return arr;
    };
}
