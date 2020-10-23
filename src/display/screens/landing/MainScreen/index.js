import 'display.worlds.entities.Box2DDemo';
import 'display.components.FrameworkSizeChart';
import 'display.components.LinesOfCodeChart';
// import 'display.components.SpeedChart';

namespace `display.screens.landing` (
    class MainScreen extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.size_chart     = this.querySelector("framework-size-chart");
            this.loc_chart      = this.querySelector("lines-of-code-chart");
            this.size_button    = this.querySelector("#size-chart-button");
            this.loc_button     = this.querySelector("#loc-chart-button");

            this.addEventListener("click", e => this.onShowSizeChart(), false, "#size-chart-button");
            this.addEventListener("click", e => this.onShowLOCChart(), false, "#loc-chart-button");
            this.size_button.click();//force a click

            // this.headingContainer = this.querySelector(".heading-container");
            // this.heading1 = "<h1>An Agnostic, W3C/ES6 Compliant <div class='highlight'> 2D World & GUI Engine</div></h1><h5 style='margin-bottom: 33px;'>Native ES6 and HTML5 with time dependent simulation stepper for AI, DOM Physics and 2D Canvas games up to 60fps. No compilers, pre or post processors, no webpack, grunt or babel, no typescript or parsers</h5>";
            // this.heading2 = "<h1>The Dawn of a New Age –<div class='highlight'> Arc2D</div> a Dynamic HTML W3C/ES6 Compliant Framework</h1><h5 style='margin-bottom: 33px;'>Arc2D is a dynamic HTML Framework used for its architecture, building apps, 2D games and more!</h5>";
            // this.heading3 = "<h1>Lorem ipsum dolor sit atmet si <div class='highlight'> Lorem ipsum dolor sit</div></h1><h5 style='margin-bottom: 33px;'>Lorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit atmet siLorem ipsum dolor sit </h5>";
            // this.headingsArray = [this.heading1, this.heading2, this.heading3];

            // this.randomizeHeading();
        }

        onShowSizeChart(){
            this.size_button.classList.add("active-link");
            this.loc_button.classList.remove("active-link");
            this.size_chart.classList.add("slide-in-blurred-left");
            this.loc_chart.classList.add("fadeOutRight");

            this.toggleVisibility(this.size_chart, this.loc_chart);
            this.toggleDisplay(this.size_chart, this.loc_chart);

            setTimeout(() => {
                this.size_chart.classList.remove("slide-in-blurred-left");
                this.loc_chart.classList.remove("fadeOutRight");
            }, 1200);
        }

        onShowLOCChart(){
            this.size_button.classList.remove("active-link");
            this.loc_button.classList.add("active-link");
            this.size_chart.classList.add("fadeOutLeft");
            this.loc_chart.classList.add("slide-in-blurred-right");

            this.toggleVisibility(this.loc_chart, this.size_chart);
            this.toggleDisplay(this.loc_chart, this.size_chart);

            setTimeout(() => {
                this.size_chart.classList.remove("fadeOutLeft");
                this.loc_chart.classList.remove("slide-in-blurred-right");
            }, 1200);
            
        }

        toggleVisibility(element1, element2){
            setTimeout(() => {
                element1.style.visibility = "visible";
                element2.style.visibility = "hidden";
            }, 300);
        }

        toggleDisplay(element1, element2){
            setTimeout(() => {
                element1.style.display="block";
                element2.style.display="none";
            }, 500);
        }

        // randomizeHeading() {
        //     this.headingContainer.innerHTML = this.headingsArray[Math.floor(Math.random() * this.headingsArray.length)];
        // }
    }
);
