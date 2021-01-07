import '@domain.collections.Todos';
import 'display.components.todo.TodoItem';
import 'system.math';
var {Todos} = domain.collections;

namespace `display.components.todo` (
	class TodoList extends WebComponent  {
		async onConnected(){
            await super.onConnected([]);
            this.ul = this.querySelector("ul.todo-list");

            this.on("keyup",        e => this.onCreate(e), false, "input.new-todo");
            this.on("destroyed",    e => this.onDestroyed(e));
            this.on("change",       e => this.onToggleAll(e), false, ".toggle-all");
            this.on("click",        e => this.onClear(e), false, ".clear-completed");
            application.on("filterchanged",e => this.onFilter(e));
            application.on("domain.collections.Todos::insert", e => this.onInserted(e));
            application.on("domain.collections.Todos::changed", e => this.onRender(e));
        }

        onClear(){
            Todos.clear({completed:true});
        }

        async onToggleAll(e){
            var todos = this.querySelectorAll("todo-item");
                todos.forEach(item => item.select(e.target.checked));
                this.onFilter();
        }

        onDestroyed(e){
            e.data.remove();
        }

        async onRender(e){
            var filter = this.lastFilter;
            switch(filter){
                case "active":
                    filter = {completed:false};
                    break;
                case "completed":
                    filter = {completed:true};
                    break;
                default:
                    filter = {};
            }
            var cursor = await Todos.find({
                query : filter,
                skip:0,
                limit:40,
                totals:true
            });
            var items = await cursor.next();
                items.length && (this.querySelector(".main").style.display="block")
            await this.render(items, item => this.ul.appendChild(new display.components.todo.TodoItem(item)), this.ul)
        }

        async onFilter(e){
            var filter = this.lastFilter = e?e.data.filter:this.lastFilter;
            switch(filter){
                case "active":
                    filter = {completed:false};
                    break;
                case "completed":
                    filter = {completed:true};
                    break;
                default:
                    filter = {};
            }
            var cursor = await Todos.find({
                query : filter,
                skip:0,
                limit:40,
                totals:true
            });
            var items = await cursor.next();
                items.length && (this.querySelector(".main").style.display="block")
            await this.render(items, item => this.ul.appendChild(new display.components.todo.TodoItem(item)), this.ul)
        }
        

        async onInserted(e){
            this.onFilter();
            this.querySelector(".toggle-all").checked = false;
            this.querySelector(".main").style.display="block";
        }

        onCreate(e){
            if(e.src.key=="Enter"){
                Todos.insert({
                    title : e.target.value, 
                    completed : 
                    false, 
                    _id : Math.uuid(8)
                });
                e.target.value="";
            }
        }
	}
)