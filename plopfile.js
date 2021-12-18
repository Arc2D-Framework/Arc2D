
//TODO: Revisit paths. Will change since this is in framework folder now.
module.exports = function (plop) {
	// plop.addHelper('NSToPath', function (ns) {
	// 	return ns.replace(/\./gm,"/");
	// });

	plop.addHelper('FQNS_to_NS_and_Class', function (fqns) {
		var parts = fqns.split(".");
		var className = parts.pop();
		var namespace = parts.join(".");
		return {
			namespace: ns,
			className:className 
		}
	});

	plop.addHelper('FQNS_to_NS', function (fqns) {
		var parts = fqns.split(".");
		var className = parts.pop();
		var namespace = parts.join(".");
		return namespace
	});

	plop.addHelper('FQNS_to_NS_Path', function (fqns) {
		var parts = fqns.split(".");
		var className = parts.pop();
		var namespace = parts.join("/");
		return namespace
	});

	plop.addHelper('FQNS_to_Class', function (fqns) {
		var parts = fqns.split(".");
		var className = parts.pop();
		return className
	});


	plop.addHelper('FQNS_to_TagName', function (fqns) {
		var parts = fqns.split(".");
		var className = parts.pop();
		var tag = className.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
		return tag
	});

	plop.addHelper('FQNS_to_NSTagName', function (fqns) {
		// var parts = fqns.split(".");
		// var className = parts.pop();
		var tag = fqns.replace(/\./gm,"-").replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
		return tag
	});

    // create your generators here
    plop.setGenerator('component', {
        description: 'Generates a UI Component',
        prompts: [
        	{
        		type: 'input',
	            name: 'namespace',
	            message: 'Fully-Qualified Namespace',
	            default: "core.ui.HelloWorld"
        	},
	   //      {
	   //          type: 'input',
	   //          name: 'namespace',
	   //          message: 'Component Namespace',
	   //          default: "core.ui"
	   //      },
	   //      {
	   //          type: 'input',
	   //          name: 'class',
	   //          message: 'Class Name',
	   //          validate: function (value) {
				// 	var tag = value.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
				// 	if(tag.indexOf("-")<0){
				// 		return 'Class names should be 2 words in CamelCase.\nEx: SlideShow\nEx: LoginBox\nEx: ToggleSwitch'
				// 	}
				// 	return true;
				// }
	   //      },
	        {
	            type: 'input',
	            name: 'parent',
	            message: 'Extends a parent class ? (a fully-qualified namespace to the parent, ex: w3c.ui.WebComponent)',
	            default: "w3c.ui.WebComponent"
	        }
        ], // array of inquirer prompts
        actions: [
	        {
	            type: 'add',
	            path: 'src/{{FQNS_to_NS_Path namespace}}/{{FQNS_to_Class namespace}}/index.js',
	            templateFile: 'node_modules/od-plopgen-templates/generators/component/index.js.hbs'
	        },
	        {
	            type: 'add',
	            path: 'src/{{FQNS_to_NS_Path namespace}}/{{FQNS_to_Class namespace}}/index.css',
	            templateFile: 'node_modules/od-plopgen-templates/generators/component/index.css.hbs'
	        },
	        {
	            type: 'add',
	            path: 'src/{{FQNS_to_NS_Path namespace}}/{{FQNS_to_Class namespace}}/index.html',
	            templateFile: 'node_modules/od-plopgen-templates/generators/component/index.html.hbs'
	        }
        ]  // array of actions
    });



    // create your generators here
    plop.setGenerator('app', {
        description: 'Generates an Application',
        prompts: [
	        {
	            type: 'input',
	            name: 'namespace',
	            message: 'Application Namespace',
	            default:"applications.HelloWorld"
	        }
	   //      {
	   //          type: 'input',
	   //          name: 'class',
	   //          message: 'Application Class Name',
	   //          validate: function (value) {
				// 	var tag = value.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
				// 	if(tag.indexOf("-")<0){
				// 		return 'Class names should be 2 words in CamelCase.\nEx: UserDashboard\nEx: ShoppingCart\nEx: ReportsTool'
				// 	}
				// 	return true;
				// }
	   //      }
        ], // array of inquirer prompts
        actions: [
	        {
	            type: 'add',
	            path: 'src/{{FQNS_to_NS_Path namespace}}/{{FQNS_to_Class namespace}}/index.js',
	            templateFile: 'node_modules/od-plopgen-templates/generators/application/index.js.hbs'
	        },
	        {
	            type: 'add',
	            path: 'src/{{FQNS_to_NS_Path namespace}}/{{FQNS_to_Class namespace}}/index.css',
	            templateFile: 'node_modules/od-plopgen-templates/generators/application/index.css.hbs'
	        },
	        {
	            type: 'add',
	            path: 'src/{{FQNS_to_NS_Path namespace}}/{{FQNS_to_Class namespace}}/index.html',
	            templateFile: 'node_modules/od-plopgen-templates/generators/application/index.html.hbs'
	        },
	        {
	            type: 'add',
	            path: '{{FQNS_to_TagName namespace}}.html',
	            templateFile: 'node_modules/od-plopgen-templates/generators/application/default.html.hbs'
	        }
        ]  // array of actions
    });
};
