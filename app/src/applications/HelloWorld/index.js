
import '/src/core/models/Movies.js';
import '/src/core/ui/MoviesList/index.js';
import '/src/core/ui/Menu/index.js';
import '/src/core/ui/Sample/index.js';
import '/src/core/ui/SampleX/index.js';
import "/src/core/ui/CoverFlow/index.js";
import "/node_modules/od-core-extensions/Function.js";
import '/node_modules/od-import-polyfill/import.js';
import '/framework/src/core/http/Router.js';


@tag("application-view");
namespace("applications.HelloWorld", class extends w3c.ui.Application {
    constructor(element){
        super(element);
        // tx()
        // require('/src/modules/Person.mjs').then(mod =>{
        //     mod.doStuff()
        // });
        // alert("omg omg, it works!")
        // // var x = document.createElement("x-sample");
        // var x = new core.ui.Sample();
        // var b = document.querySelector("#test");
        // x.adopts(b)

        
        // var y = document.createElement("x-sample");
        // var c = document.querySelector("#test2");
        // console.log(c)
        // y.replaces(c)
        // y.innerHTML = "jason";

        
        // wait(200).then( _=> console.log("x-test tags", this.querySelectorAll("x-test")))
        // Session.Interceptor.enable();
        this.movies = new core.models.Movies;
        //core.ui.Menu -> fires 'genrechanged'
        this.bind("#nowhere", "click", (e)=> this.onShowErrorScreen(e), false);
        this.addEventListener("genrechanged", (e)=>this.onGenreChanged(e), false);
        this.addEventListener("moviedeleted", (e)=>this.onMovieDeleted(e), false);

        // setTimeout(()=>this.setupMatchMediaDecorators(),200);

        // this.router = new core.http.Router(this,window);
        
    }

    onDisplayActivity(c){
        var slot = this.querySelector('div[slot="screen"]');
        slot.innerHTML="";
        slot.appendChild(c);
    }


    onShowErrorScreen(e){
        e.preventDefault();
        location.href = "../../../src/applications/ErrorScreen/index.html"
    }

    async onGenreChanged(e){
        var g = e.data.genre;
        var query = (g=="All") ? null : {genre: g};
        this.query = query;
        var cursor = await this.movies.find(null,query);
        console.log("cursor",cursor)
        //core.ui.MoviesList -> handles 'movieschanged'
        this.dispatchEvent("movieschanged", {results : cursor});
    }

    async onMovieDeleted(e){
        alert("deleted...refreshing")
        var cursor = await this.movies.find(null,this.query);
        //core.ui.MoviesList -> handles 'movieschanged'
        this.dispatchEvent("movieschanged", {results : cursor});
    }

    /*template(){ return `
        <template>
            Application-view:<br/>
            <slot name="container"></slot>
        </template>
    `}
    */

    onEnableShadow(){return false}

    onConnected() {
        this.render();
        console.log("x-test tags", this.querySelectorAll("x-test"))
        // setTimeout(_=> this.render(), 5000);

    }
})
