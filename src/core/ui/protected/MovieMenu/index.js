import '/src/core/data/Movies.js';
import '/src/core/ui/XTest/index.js';


namespace `core.ui.protected` (
    @stylesheets(["/src/./index.css"]);
    class MovieMenu extends core.ui.ProtectedChildComponent {
        constructor (element){
            super(element);
            if (application.user) {
                this.src = "/src/./index2.html"
            } else {
                alert("asdsd")
                this.src = "/src/./index.html"
            }
        }

        // getTemplateToLoad(){
        //     alert(this.user)
        // }

        onConnected(){
            this.bind("li", "click", (e) => this.onClick(e), false);
            this.onRenderGenres();
        }

        async onRenderGenres(){
            var cursor = await core.data.Movies.find();
            var all_genres = cursor.map(movie => movie.genre);
            var only_unique_genres = [...new Set(all_genres)];//Set() filters out duplicates.
            this.render({items : only_unique_genres});
        }

        onEnableShadow() {
            return false
        }

        onClick (e){
            var li = e.target;
            this.highlight(li)
            var genre = li.getAttribute("data-genre");
            this.dispatchEvent("genrechanged", {genre: genre});

        }

        highlight (li){
            if(this.lastLi){
                this.lastLi.classList.remove("active");
            }
            li.classList.add("active");
            this.lastLi = li;
        }
    }
);
