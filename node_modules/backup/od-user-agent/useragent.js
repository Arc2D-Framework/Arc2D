//TODO: make this into an npm module
UserAgent = {
    isIE : function(){
        return /Trident/.test(navigator.userAgent);
    },
    
    isMobile : function(){
       return Config.FORCE_MOBILE_USERAGENT || /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    isIpad : function(){
       return /iPad/i.test(navigator.userAgent);
    },
    
    isAndroid: function() {
        return /Android/i.test(navigator.userAgent);
    },
    
    isBlackBerry: function() {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    
    isIOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    
    isWindowsMobile: function() {
        return /IEMobile/i.test(navigator.userAgent);
    }
};
