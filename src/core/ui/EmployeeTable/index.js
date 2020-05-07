namespace `core.ui` (
	class EmployeeTable  extends w3c.ui.WebComponent  {
		async onConnected() {
			await super.onConnected(this.empData());			
		}
		
		empData() {
            let employeeData = [
                {name:"Jamie", active:"No", department:"IT/Computer Software"},
                {name:"Rachel", active:"Yes", department:"Sales"},
                {name:"Jay", active:"Yes", department:"Engineering"},
                {name:"Yvette", active:"Yes", department:"Customer Support"}
            ];

            return {employees:employeeData};
        }
	}
)