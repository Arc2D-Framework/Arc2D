import '/src/applications/ProtectedApplication/index.js';

import '/src/core/data/Movies.js';
import '/src/core/ui/Menu/index.js';
import '/src/core/ui/MoviesList/index.js';
import '/src/core/ui/AuthoAvatar/index.js';

namespace `applications` (
	@cascade(true);
    @tag("main-app");
    class MainApp extends applications.ProtectedApplication {
        constructor(element){
            super(element);

            this.movies = new core.data.Movies;
            //core.ui.Menu -> fires 'genrechanged'
            this.bind("#nowhere", "click", (e)=> this.onShowErrorScreen(e), false);
            this.addEventListener("genrechanged", (e)=>this.onGenreChanged(e), false);
            this.addEventListener("moviedeleted", (e)=>this.onMovieDeleted(e), false);
        }

        onEnableShadow(){
            return false;
        }

        onConnected() {
        	super.onConnected();
            this.render();

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
    }
);
