import 'display.components.Label';

namespace `display.components` (
	class MoviesList extends w3c.ui.WebComponent {
		constructor(el){
			super(el);
			this.order=1;
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
			var o = await domain.collections.Movies.remove({_id:id, _rev:rev_id});
			if(o){
				this.dispatchEvent("moviedeleted", o);
			}
		}

        async onConnected(){
        	// for now, dont render anything when connected.
        	// will appear blank/hidden on screen
        }

		async onColumClicked(e){
			var col = e.target.getAttribute("name");
			this.cursor.sort(col, this.order*=-1);
			this.render({items : await this.cursor.next()});
		}

		async onNext(e){
			this.render({items : await this.cursor.next()});
		}

		async onPrevious(e){
			this.render({items : await this.cursor.previous()});
		}

		async onMoviesChanged(e){
			this.cursor = e.data.results;
			this.render({items : await this.cursor.next()});
		}

		onTemplateRendered(){
			this.root.querySelector("#currentpage").innerHTML = this.cursor.pagenumber();
			this.root.querySelector("#totalpages").innerHTML  = this.cursor.totalpages();
		}
	}
);







