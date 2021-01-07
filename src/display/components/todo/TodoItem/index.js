var {Todos} = domain.collections;

namespace `display.components.todo` (
	class TodoItem extends WebComponent {
        constructor(data){
            super();
            this.data = data;
        }
		async onConnected(){
            await super.onConnected(this.data);
            this.data.completed && this.classList.add("completed");
            
            this.toggle = this.querySelector(".toggle");
            this.label  = this.querySelector("label");
            this.input  = this.querySelector("input.edit");

            this.on("click",    e => this.onToggle(e), false, ".toggle");
            this.on("click",    e => this.onRemove(e), false, ".destroy");
            this.on("dblclick", e => this.onEdit(e),   false, "label");
            this.on("change",   e => this.onSave(e),   false, "input.edit");
            this.on("blur",     e => this.onSave(e),   false, "input.edit");
        }

        onSave(e){
            this.label.textContent = e.target.value;
            this.data.title = e.target.value;
            Todos.update(this.data)
            this.classList.remove("editing");
        }

        async onEdit(){
            this.classList.add("editing");
            var len = this.input.value.length;
            this.input.focus();
            this.input.setSelectionRange(len,len)
        }

        setCaretPosition(input, pos){
            input.setSelectionRange(pos, pos);
        }
        

        isComposable(){
            return true;
        }

        async onRemove(){
            var res = await Todos.remove({_id:this.data._id});
            res && res.length && this.dispatchEvent("destroyed", this)
        }

        onToggle(){
            this.data.completed = this.classList.toggle("completed");
            Todos.update(this.data)
        }

        select(checked){
            checked  && this.classList.add("completed");
            !checked && this.classList.remove("completed");
            this.data.completed = this.toggle.checked = checked;
            Todos.update(this.data)
        }
	}
)