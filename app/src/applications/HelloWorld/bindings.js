// import '/resources/package.js';
//mport 'https://unpkg.com/@polymer/paper-checkbox@next/paper-checkbox.js?module';
import '/node_modules/od-watcher/wrist.js';
import '/node_modules/od-core-extensions/Object.js';


@tag("application-view");
namespace("applications.HelloWorld", class extends w3c.ui.Application {
    constructor(element){
        super(element);


        // alert("omg omg, it works!")
        // // // var x = document.createElement("x-sample");
        // // var x = new core.ui.Sample();
        // // var b = document.querySelector("#test");
        // // x.adopts(b)

        
        // // var y = document.createElement("x-sample");
        // // var c = document.querySelector("#test2");
        // // console.log(c)
        // // y.replaces(c)
        // // y.innerHTML = "jason";

        // console.log("x-test tags", this.querySelectorAll("x-test"))
        // // Session.Interceptor.enable();
        // this.movies = new core.models.Movies;
        // //core.ui.Menu -> fires 'genrechanged'
        // this.bind("#nowhere", "click", (e)=> this.onShowErrorScreen(e), false);
        // this.addEventListener("genrechanged", (e)=>this.onGenreChanged(e), false);
        // this.addEventListener("moviedeleted", (e)=>this.onMovieDeleted(e), false);
    }

    

    template(){ return `
        <template>
            Application-view:<br/>
            <slot name="container"></slot>
        </template>
    `}

    onEnableShadow(){return false}

    onConnected() {
        this.render();
        var personname = this.querySelector("#personname");
        var input = this.querySelector("input");

        this.person = {
        	name:"jason"
        };
        Session.person = this.person;

        wrist.watch(this.person, 'name',  (prop, old, val) => {
		  input.value = val;
		  // console.log("this.person",this.person)
		});
		
		// bind inputs to post related properties
		wrist.watch(input, 'value',  (prop, old, val) => {
		  // post.title = val;
		  this.person.name = val;
          personname.innerHTML = this.person.name;
		  // console.log("this.person",this.person)
		});
    }
})
