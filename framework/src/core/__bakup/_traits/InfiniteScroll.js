/**
 * InfiniteScroll is a shared trait that can be used by any Class.
 * @example see: apps.SearchResults for implementation use.
 * Classes implementing this trait must provide implementation of a
 * onContentScrolledTop() and onContentScrolledBottom() callbacks which
 * are triggered by this trait at the right moment.
 */

InfiniteScroll = {
    initialize : function(){
        var self=this;
        this.parent();

        if(!this.getInfiniteScrollableItem){
            throw new Error("InfiniteScroll requires " + this.namespace + " to implement the getInfiniteScrollableItem().")
        }

        if(!this.onContentScrolledBottom){
            throw new Error("InfiniteScroll requires " + this.namespace + " to implement the onContentScrolledBottom() callback.")
        }
        if(!this.onContentScrolledTop){
            throw new Error("InfiniteScroll requires " + this.namespace + " to implement the onContentScrolledTop() callback.")
        }

        var scrollArea = this.getInfiniteScrollableItem();
            scrollArea.addEventListener("scroll", this.onContentScrolled.bind(this).debounce(500), false);


        this.addEventListener("scrolltop", this.onContentScrolledTop.bind(this), false);
        this.addEventListener("scrollbottom", this.onContentScrolledBottom.bind(this).debounce(100), false);
    },

    /**
     * Triggered when user scrolls
     * @param {Event} e - The scroll event
     */
    onContentScrolled : function(e) {
        var scrollPos = this.contentPanel.scrollHeight - this.contentPanel.scrollTop;
        var scrollTop = this.contentPanel.scrollTop;
        var cHeight = this.contentPanel.clientHeight;
        var scrollHeightOffset = (this.contentPanel.scrollHeight-cHeight);
        var n = parseFloat(((scrollTop/scrollHeightOffset)/100)*100).toFixed(1)
        var threshold = parseFloat(n);
            threshold = threshold >= 1?1:threshold;
            threshold = threshold <= 0?0:threshold;

        console.log("scroll threshold",threshold)

        if(threshold ==0){
            this.dispatchEvent("scrolltop", true,true, {value:threshold});
        }
        if(threshold ==1){
            this.dispatchEvent("scrollbottom", true,true, {value:threshold});
        }
    }
};