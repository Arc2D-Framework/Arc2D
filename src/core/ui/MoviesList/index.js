import '/src/core/data/Movies.js';


namespace `core.ui` (
	class MoviesList extends w3c.ui.WebComponent {
		constructor(el){
			super(el);
			//the application -> fires 'movieschanged' with db cursor
			document.addEventListener("movieschanged", (e)=>this.onMoviesChanged(e), false);
			this.addEventListener("click", (e)=> this.onColumClicked(e), false,"th");
			this.addEventListener("click", (e)=> this.onPrevious(e), false, "#previous");
			this.addEventListener("click", (e)=> this.onNext(e), false,"#next");
			this.addEventListener("click", (e)=> this.onDelete(e), false,".del-button");
		}

		async onDelete(e){
			var id = e.target.getAttribute("data-id");
			var rev_id = e.target.getAttribute("data-rev-id");
			var o = await core.data.Movies.remove({_id:id, _rev:rev_id});
			if(o){
				this.dispatchEvent("moviedeleted", o);
			}
		}


        onConnected(){}

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







