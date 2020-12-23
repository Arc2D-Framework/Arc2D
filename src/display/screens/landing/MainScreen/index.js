import 'display.components.FrameworkSizeChart';
import 'display.components.LinesOfCodeChart';
import 'display.components.SpeedChart';
import 'display.components.MemoryAllocation';
import 'display.components.ToggleButton';
import '/node_modules/sweetalert/dist/sweetalert.min.js';


namespace `display.screens.landing` (
    class MainScreen extends World {
        constructor(element){
            super(element);
            this._mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        }

        async onConnected() {
            await super.onConnected();
            this.onRandomizedHeader();
            this.size_chart     = this.querySelector("framework-size-chart");
            this.loc_chart      = this.querySelector("lines-of-code-chart");
            this.size_button    = this.querySelector("#size-chart-button");
            this.loc_button     = this.querySelector("#loc-chart-button");
            this.box2ddemo      = this.querySelector("box-2d-demo");
            this.addEventListener("click", e => this.onShowSizeChart(), false, "#size-chart-button");
            this.addEventListener("click", e => this.onShowLOCChart(), false, "#loc-chart-button");
            this.size_button.click();//force a click

            this.core_features = this.querySelectorAll(".core");
            this.sdk_features = this.querySelectorAll(".sdk");
            this.watch("#core_vs_sdk", "value", e => this.onToggleFeatures(e), true);

            // this.emailInput = this.querySelector("input#user-email");
            // this.userNameInput = this.querySelector("input#user-name");
            // this.signupInputsArray = [this.emailInput, this.userNameInput];
            // this.on("submit", (e) => this._validateEmail(e), false, ".subscribe-form");
            const docsLink = this.querySelector("#docsLink");
            const downloadLink = this.querySelector("#downloadLink");
            this.cumulutiveShiftElements = [docsLink, downloadLink];
            this.cumulitiveElementsFix();
        }

        cumulitiveElementsFix(){
            setTimeout(() => {
               this.cumulutiveShiftElements.forEach(link =>{
                  link.style.visibility = "visible";
                  link.style.opacity = "1";
               })
            }, 1400);
        }

        onHashChange(e){

        }

        randomNumber(min, max) {
          return Math.random() * (max - min) + min;
        }

        onRandomizedHeader(){
            var headings = Array.from(this.querySelectorAll(".heading-item"));
            var num = Math.round(this.randomNumber(0,headings.length-1))
            // this.headingContainer = this.querySelector(".heading-container");
            headings[num].style.display="block"
        }

        resetSignupInputs = () => {
            this.signupInputsArray.forEach(input => {input.value = ""})
        }

        _validateEmail = (e) => {
            this.emailInput.value.match(this._mailFormat) ? this.onSignupSendForm(e) : alert("error");
        }

        onSignupSendForm(e){
            e.preventDefault();
            emailjs.sendForm('service_m7fro3e', 'signup_form', 'signup-form')
                .then(response => {
                    // console.log('SUCCESS!', response.status, response.text);
                    response.status == 200 
                    ? (swal({title:"Success!",text:"Thanks for signing up to our newsletter!",icon:"success",button:"Close"}), this.resetSignupInputs())
                    : null;
                }, error => {
                    console.log('FAILED...', error);
                    swal("Error!", error, "error");
                });
        }

        onToggleFeatures(e){
            if(e.val == "" || e.val==-1){//core
                this.core_features.forEach(el => el.classList.add("active"))
            }
            else {
                this.core_features.forEach(el => el.classList.remove("active"))
            }
        }

        onShowSizeChart(){
            this.size_button.classList.add("active-link");
            this.loc_button.classList.remove("active-link");
            this.size_chart.classList.add("fadeInLeft");
            this.loc_chart.classList.add("fadeOutRight");

            this.toggleVisibility(this.size_chart, this.loc_chart);
            this.toggleDisplay(this.size_chart, this.loc_chart);

            setTimeout(() => {
                this.size_chart.classList.remove("fadeInLeft");
                this.loc_chart.classList.remove("fadeOutRight");
            }, 1200);
        }

        onShowLOCChart(){
            this.size_button.classList.remove("active-link");
            this.loc_button.classList.add("active-link");
            this.size_chart.classList.add("fadeOutLeft");
            this.loc_chart.classList.add("fadeInRight");

            this.toggleVisibility(this.loc_chart, this.size_chart);
            this.toggleDisplay(this.loc_chart, this.size_chart);

            setTimeout(() => {
                this.size_chart.classList.remove("fadeOutLeft");
                this.loc_chart.classList.remove("fadeInRight");
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
    }
);