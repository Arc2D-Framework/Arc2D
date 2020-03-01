namespace `docs.components` (
	class ReadingProgress  extends w3c.ui.WebComponent  {
	   async onConnected(){
        // super.onConnected();
        await this.render();
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