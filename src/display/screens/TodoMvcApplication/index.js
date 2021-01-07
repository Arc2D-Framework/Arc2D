import 'display.components.todo.TodoList';
import 'display.components.todo.FooterNav';

namespace `display.screens` (
    class TodoMvcApplication extends Application {
        async onConnected(element){
            await super.onConnected();
            location.hash=location.hash||"#/"
        }

        async onHashChange(e){
            var hash = location.hash.replace("#/","");
            await wait(50);
            this.dispatchEvent("filterchanged", {hash:location.hash,filter:hash})
        }
    }
);
