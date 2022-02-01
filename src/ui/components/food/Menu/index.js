namespace `ui.components.food` (
	class Menu extends Component  {
        async onConnected() {
			this.cursor = await this.search();
            await super.onConnected({items : this.cursor});
			this.on("click", (e) => this.onPrevious(e), false , '#prev-btn');
			this.on("click", (e) => this.onNext(e), false , '#next-btn');
        }

		async search(){
			return await domain.collections.Foods.find({
				query : {},//keywords
				skip:0,
				limit:2,
				totals:true
			})
		}

		async onPrevious(){
			await this.cursor.previous();
			await this.render({items : this.cursor})
		}

		async onNext(){
			await this.cursor.next();
			debugger;
			await this.render({items : this.cursor})
		}

		isComposable(){
			return false
		}
	}
)