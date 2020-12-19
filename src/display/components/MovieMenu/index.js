
namespace `display.components` (
    class MovieMenu extends WebComponent{
        constructor (element){
            super(element);
            this.items=[]
        }

        async onConnected(){
            // await super.onConnected({items:[]});
            // document.addEventListener("movieschanged", (e)=>this.onMoviesChanged(e), false);
            application.addEventListener("domain.collections.Movies::changed", e => this.onRenderGenres(), false);

            this.on("click", (e) => this.onClick(e), false,"li");
            await this.onRenderGenres();
        }

        async onRenderGenres(){
            await domain.collections.Movies.seed();//seed with test data
            var cursor = await domain.collections.Movies.find({
                query : {},
                skip:0,
                limit:40,
                totals:true
            });
            await cursor.next();
            var all_genres          = await cursor.map(movie => movie.genre);
            var only_unique_genres  = [...new Set(all_genres)];//Set() filters out duplicates.
            // this.items = only_unique_genres;

            await this.render({items:only_unique_genres});
        }

        onMoviesChanged(){
            this.onRenderGenres();
        }

        getTemplateEngine() {
            // return window.customTemplateEngines.getEngineByMimeType("template/threadedliterals")
            return window.customTemplateEngines.getEngineByMimeType("template/nunjucks")
            // return window.customTemplateEngines.getEngineByMimeType("template/literals")
        }

        // inShadow() {
        //     return true
        // }

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
