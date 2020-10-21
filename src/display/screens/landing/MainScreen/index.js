import 'display.components.FrameworkSizeChart';
import 'display.components.LinesOfCodeChart';
import 'display.worlds.entities.Box2DDemo';

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
        }

        onShowSizeChart(){
            this.size_button.classList.add("active-link");
            this.loc_button.classList.remove("active-link");

            this.size_chart.style.display="block";
            this.loc_chart.style.display="none";
        }

        onShowLOCChart(){
            this.size_button.classList.remove("active-link");
            this.loc_button.classList.add("active-link");

            this.size_chart.style.display="none";
            this.loc_chart.style.display="block";
        }

        // onUpdate(){

        // }

        // randomizeHeading() {
        //     this.headingContainer.innerHTML = this.headingsArray[Math.floor(Math.random() * this.headingsArray.length)];
        // }
    }
);
