namespace `docs.demos` (
	class DatePicker  extends w3c.ui.WebComponent  {
        onConnected(){
            super.onConnected();
            var input = this.querySelector("input")
                input.setAttribute("type","date")
        }
	}
)