;(()=> {
                
namespace `docs.components` (
	class ReadingProgress  extends w3c.ui.WebComponent  {
	   async onConnected(){
        await super.onConnected();
        // await this.render();
            // variables for progress bar and post container elements
            const progressContainerEl = document.querySelector(".article-content");
            const progressBarEl = document.querySelector(".progress-bar-container__progress");

            // function to check scroll position and update scroll progress bar accordingly
            const updateScrollProgressBar = () => {
              // get full scroll height
              const scrollHeight = progressContainerEl.scrollHeight - this.heightInViewport(progressContainerEl);
              // console.log(scrollHeight);
              // get current scroll position
              const scrollPosition = progressContainerEl.scrollTop;
              
              // get scroll percentage and set width of progress bar
              const scrollPercentage = (scrollPosition / scrollHeight) * 100;
              progressBarEl.style.width = scrollPercentage + "%";
            }

            // bind window onload and onscroll events to update scroll progress bar width
            progressContainerEl.addEventListener("scroll", updateScrollProgressBar)
            progressContainerEl.addEventListener("load", updateScrollProgressBar)

            // function to get visible height in viewport
            // some code taken from user Roko C. Buljan on https://stackoverflow.com/questions/24768795/get-the-visible-height-of-a-div-with-jquery
            
       }	

       heightInViewport (el) {
            var elH = el.offsetHeight,
                H   = document.body.offsetHeight,
                r   = el.getBoundingClientRect(), t=r.top, b=r.bottom;
            return Math.max(0, t>0? Math.min(elH, H-t) : Math.min(b, H));
        }
	}
)


                docs.components.ReadingProgress.prototype.template = function(){
                    return `<template>
	<div class="progress-bar-container">
        <div class="progress-bar-container__progress"></div>
    </div>
</template>
`
                };

                docs.components.ReadingProgress.prototype.cssStyle = function(){
                    return `.ReadingProgress {
	display:block;
    display: block;
    z-index: 10000;
    position: fixed;
}



/* progress bar container */
.ReadingProgress .progress-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
}

/* progress bar */
.ReadingProgress .progress-bar-container__progress {
  height: 4px;
  background-color: #a2fca2;
  width: 0%;
  float: left;
  transform:translate3d(0px,0px,0px);
}
`
                };

                docs.components.ReadingProgress.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();
