namespace `display.components.todo` (
	class FooterNav extends WebComponent {
		async onConnected(){
            await super.onConnected();
            this.counter  = this.querySelector(".todo-count")
            this.addEventListener("click", e => this.onFilter(e), false, ".filters a");
            document.addEventListener("filterchanged", e=>this.onHighlight(e));
            application.on("domain.collections.Todos::changed", e => this.onChanged(e));
            this.onChanged()
        }

        onHighlight(e){
            var a = this.querySelector(`a[href='${e.data.hash}']`);
                a.classList.add("selected");
            this.lastSelected=a;
        }

        async onChanged(e){
            var cursor = await Todos.find({
                query : {completed:false},
                skip:0,
                limit:40,
                totals:true
            });
            this.counter.textContent = `${cursor.items.length} items left`
        }

        onFilter(e){
            this.toggle(this.lastSelected, e.target, "selected");
        }

        toggle(last,current,classname){
            last && last.classList.remove(classname);
            current.classList.add(classname);
            last=current;
        }
	}
)