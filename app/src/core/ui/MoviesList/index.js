import '/src/core/data/Movies.js';


namespace `core.ui` (
	@stylesheets(['/src/./index.css']);
	class MoviesList extends w3c.ui.WebComponent {
		constructor(el){
			super(el);
			//the application -> fires 'movieschanged' with cursor
			this.movies = new core.data.Movies;
			document.addEventListener("movieschanged", (e)=>this.onMoviesChanged(e), false);
			this.bind("th", "click", (e)=> this.onColumClicked(e), false);
			this.bind("#previous", "click", (e)=> this.onPrevious(e), false);
			this.bind("#next", "click", (e)=> this.onNext(e), false);
			this.bind(".del-button", "click", (e)=> this.onDelete(e), false);
		}

		async onDelete(e){
			var id = e.target.getAttribute("data-id");
			var o = await this.movies.remove({_id:id});
			if(o){
				this.dispatchEvent("moviedeleted", o);
			}
		}

		onEnableShadow() {
            return false
        }

        onConnected(){
            // this.render({items:[]})
        }

		onColumClicked(e){
			var col = e.target.getAttribute("name");
			this.cursor.sort(col, this.asc=!this.asc);
			this.render({items : this.cursor.first()});
		}

		onNext(e){
			this.render({items : this.cursor.next()});
		}

		onPrevious(e){
			this.render({items : this.cursor.previous()});
		}

		onMoviesChanged(e){
			this.cursor = e.data.results;
			this.render({items : this.cursor.first()});
		}

		onTemplateRendered(){
			this.root.querySelector("#currentpage").innerHTML = this.cursor.pagenumber();
			this.root.querySelector("#totalpages").innerHTML  = this.cursor.totalpages();
		}
	}
);







