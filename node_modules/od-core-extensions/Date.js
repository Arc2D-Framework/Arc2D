Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

/*isDstObserved() returns true|false if daylight savings time. Ex:
    var today = new Date();
    if (today.isDstObserved()) { 
        alert ("Daylight saving time!");
    }
*/
Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}