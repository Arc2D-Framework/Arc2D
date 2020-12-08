// mport '/src/applications/FirebaseProtected/index.js';
// mport '/src/core/ui/ProtectedChildComponent.js';
// mport '/src/core/data/Movies.js';
import '/src/core/ui/protected/UserLoginBar/index.js';
// mport '/src/core/ui/protected/MovieMenu/index.js';
// mport '/src/core/ui/MoviesList/index.js';


namespace `applications` (
    class OAuth extends Application { //protected by OAuth
        constructor(element){
            super(element);

            //sow seeds for mock/testing (optional)
            // core.data.Movies.seed();
            
            // //listen to core.ui.Menu -> 'genrechanged' event
            // this.addEventListener("genrechanged", (e)=>this.onGenreChanged(e), false);
            // //listen to core.ui.MovieList -> 'moviedeleted' event
            // this.addEventListener("moviedeleted", (e)=>this.onMovieDeleted(e), false);
            // //listen to MainApp -> 'click', only from div#nowhere
            // this.addEventListener("click", (e)=> this.onShowErrorScreen(e), false, "#nowhere");
        }

        onLoadInstanceStylesheet(){return true}


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

        logout(){
            firebase.auth().signOut().
                then(_  => this.onLoggedOut()).
                catch(e => console.error(e));
        }
        
        async onConnected() {
            var firebaseConfig = {
                apiKey: "AIzaSyD3HTd7BH4DKkvOF2AitWyQsSWMSEPYT4Y",
                authDomain: "test-f6d84.firebaseapp.com",
                databaseURL: "https://test-f6d84.firebaseio.com",
                projectId: "test-f6d84",
                storageBucket: "test-f6d84.appspot.com",
                messagingSenderId: "507958760916",
                appId: "1:507958760916:web:0ba398f0785cf2f4017241"
              };
              firebase.initializeApp(firebaseConfig)
              
              
            this.initApp();
            // await super.onConnected();
        }

        initApp() {
            firebase.auth().onAuthStateChanged(
                user  => this.onAuthenticated(user||null), 
                error => console.log(error)
            );
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

        // async onGenreChanged(e){
        //     //core.ui.Menu's event passes genre in event data{}
        //     var g = e.data.genre;
        //     //use null for All, mongo behavior for getting all
        //     var query = (g=="All") ? null : {genre: g};
        //     //store it for later
        //     this.query = query;
        //     //execute query, cursor is [] of results.
        //     var cursor = await core.data.Movies.find(null,query); //await is synchronous
        //     //update movies list
        //     this.onMovieResultsChanged({results : cursor});
        // }

        // async onMovieDeleted(e){
        //     //when movie deleted, re-render
        //     var cursor = await core.data.Movies.find(null,this.query);//await is synchronous; reuse stored query
        //     //update movies list
        //     this.onMovieResultsChanged({results : cursor});
        // }

        // onMovieResultsChanged(data){
        //     //core.ui.MoviesList -> handles 'movieschanged'
        //     this.dispatchEvent("movieschanged", data);
        // }
    }
);
