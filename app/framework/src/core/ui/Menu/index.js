import '/src/core/models/Movies.js';


@stylesheets(["/src/./index.css"]);
@tag("movie-menu");
namespace('core.ui.Menu', class extends w3c.ui.WebComponent{
    constructor (element){
        super(element);
    }

    onConnected(){
        this.bind("li", "click", (e) => this.onClick(e), false);
        this.movies = new core.models.Movies;
        this.onRenderGenres();
    }

    async onRenderGenres(){
        var cursor = await this.movies.find();
        var all_genres = cursor.map(movie => movie.genre);
        var only_unique_genres = [...new Set(all_genres)];//new Set filters out duplicates.
        this.render({items : only_unique_genres})
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
});
