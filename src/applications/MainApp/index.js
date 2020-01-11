import '/src/applications/FirebaseProtected/index.js';
import '/framework/src/core/ui/ProtectedChildComponent.js';
import '/src/core/data/Movies.js';
import '/src/core/ui/protected/UserLoginBar/index.js';
import '/src/core/ui/protected/MovieMenu/index.js';
import '/src/core/ui/MoviesList/index.js';


namespace `applications` (
    class MainApp extends applications.FirebaseProtected { //protected by OAuth
        constructor(element){
            super(element);

            //sow seeds for mock/testing (optional)
            core.data.Movies.seed();
            
            //listen to core.ui.Menu -> 'genrechanged' event
            this.addEventListener("genrechanged", (e)=>this.onGenreChanged(e), false);
            //listen to core.ui.MovieList -> 'moviedeleted' event
            this.addEventListener("moviedeleted", (e)=>this.onMovieDeleted(e), false);
            //listen to MainApp -> 'click', only from div#nowhere
            this.bind("#nowhere", "click", (e)=> this.onShowErrorScreen(e), false);
        }


        onAuthStateChanged(cb){
            firebase.auth().onAuthStateChanged(user => {
              if (user) { cb(user) } else { cb(null) }
            })
        }
        

        //onLoggedOut() called, then triggers -> onAuthenticated(null) again
        onLoggedOut(){
            //do cleanup
            alert("Goodbye");
        }
        
        onConnected() {
            //supers authentication checks
            super.onConnected();//triggers -> onAuthenticated
        }

        //triggered by super.onConnected()
        //passes <user> (<null>, if no login session)
        onAuthenticated(user){
            if(!user){
                location.href = "login.html"
            } else {
                this.user=user;
                this.render();
            }
        }

        async onGenreChanged(e){
            //core.ui.Menu's event passes genre in event data{}
            var g = e.data.genre;
            //use null for All, mongo behavior for getting all
            var query = (g=="All") ? null : {genre: g};
            //store it for later
            this.query = query;
            //execute query, cursor is [] of results.
            var cursor = await core.data.Movies.find(null,query); //await is synchronous
            //update movies list
            this.onMovieResultsChanged({results : cursor});
        }

        async onMovieDeleted(e){
            //when movie deleted, re-render
            var cursor = await core.data.Movies.find(null,this.query);//await is synchronous; reuse stored query
            //update movies list
            this.onMovieResultsChanged({results : cursor});
        }

        onMovieResultsChanged(data){
            //core.ui.MoviesList -> handles 'movieschanged'
            this.dispatchEvent("movieschanged", data);
        }
    }
);
