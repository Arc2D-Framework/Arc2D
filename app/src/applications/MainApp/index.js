import '/src/applications/ProtectedApplication/index.js';
import '/src/core/data/Movies.js';
import '/src/core/ui/MovieMenu/index.js';
import '/src/core/ui/MoviesList/index.js';
import '/src/core/ui/AuthoAvatar/index.js';

namespace `applications` (
    class MainApp extends w3c.ui.Application {
        constructor(element){
            super(element);

            this.movies = new core.data.Movies;
            //core.ui.Menu -> fires 'genrechanged'
            this.bind("#nowhere", "click", (e)=> this.onShowErrorScreen(e), false);
            this.addEventListener("genrechanged", (e)=>this.onGenreChanged(e), false);
            this.addEventListener("moviedeleted", (e)=>this.onMovieDeleted(e), false);
        }
        
        onConnected() {
            this.render();
        }

        async onGenreChanged(e){
            var g = e.data.genre;
            var query = (g=="All") ? null : {genre: g};
            this.query = query;
            var cursor = await this.movies.find(null,query);
            //core.ui.MoviesList -> handles 'movieschanged'
            this.dispatchEvent("movieschanged", {results : cursor});
        }

        async onMovieDeleted(e){
            var cursor = await this.movies.find(null,this.query);
            //core.ui.MoviesList -> handles 'movieschanged'
            this.dispatchEvent("movieschanged", {results : cursor});
        }
    }
);
