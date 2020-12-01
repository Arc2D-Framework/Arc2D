import {NodeTest} from '/src/system/libs/sample_modules/nodejsmod.js';
import 'display.components.Splash';
import! 'domain.collections.Movies';
import 'display.components.MovieMenu';
import 'display.components.MoviesList';
import '/src/system/drivers/templating/Nunjucks/nunjucks-driver.js';

namespace `display.screens` (
    class MoviesApp extends w3c.ui.Application {
        constructor(element){
            super(element);
            // alert(NodeTest)
            //sow seeds for mock/testing (optional)
            // domain.collections.Movies.seed();
            
            //listen to core.ui.Menu -> 'genrechanged' event
            this.addEventListener("genrechanged", (e)=>this.onGenreChanged(e), false);
            //listen to core.ui.MovieList -> 'moviedeleted' event
            this.addEventListener("moviedeleted", (e)=>this.onMovieDeleted(e), false);
            //listen to MainApp -> 'click', only from div#nowhere
            // this.addEventListener("click", (e)=> this.onShowErrorScreen(e), false, "#nowhere");
        }

        async onConnected() {
            await domain.collections.Movies.seed();
            await super.onConnected();
        }


        async onGenreChanged(e){
            //core.ui.Menu's event passes genre in event data{}
            var g = e.data.genre;
            //use null for All, mongo behavior for getting all
            var query = (g=="All") ? {} : {genre: g};
            //store it for later
            this.query = query;
            //execute query, cursor is [] of results.
            var cursor = await domain.collections.Movies.find({
                query : query,
                skip:0,
                limit:2,
                totals:true
            }); 
            //update movies list
            this.onMovieResultsChanged({results : cursor});
        }

        async onMovieDeleted(e){
            //when movie deleted, re-render
            var cursor = await domain.collections.Movies.find(this.query);//await is synchronous; reuse stored query
            //update movies list
            this.onMovieResultsChanged({results : cursor});
        }

        onMovieResultsChanged(data){
            //core.ui.MoviesList -> handles 'movieschanged'
            this.dispatchEvent("movieschanged", data);
        }
    }
);
