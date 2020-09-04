import '/src/core/drivers/templating/ThreadedTemplateLiterals.js';

namespace `core.ui` (
    class MovieMenu extends WebComponent{//try extends core.ui.ManagedComponent
        constructor (element){
            super(element);
        }

        async onConnected(){
            this.on("click", (e) => this.onClick(e), false,"li");
            await this.onRenderGenres();
        }

        async onRenderGenres(){
            await core.data.Movies.seed();//seed with test data

            var cursor = await core.data.Movies.find({
                query : { $or: [ 
                    {title: {$like: "Gladiator"}},{ rating : {$gt: 1 }}
                ]},
                skip:0,
                limit:10,
                totals:true
            });
            await cursor.next();
            var all_genres          = await cursor.map(movie => movie.genre);
            var only_unique_genres  = [...new Set(all_genres)];//Set() filters out duplicates.
            await this.render({items : only_unique_genres});
        }

        getTemplateEngine() {
            return window.customTemplateEngines.getEngineByMimeType("template/threadedliterals")
        }

        inShadow() {
            return true
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
