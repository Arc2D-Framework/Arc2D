
//TODO: Revisit paths. Will change since this is in framework folder now.
module.exports = function (plop) {
	plop.addHelper('NSToPath', function (ns) {
		return ns.replace(/\./gm,"/");
	});

	plop.addHelper("ClassToTagName", function(classname){
		var tag = classname.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
		return tag;
	});



    // create your generators here
    plop.setGenerator('component', {
        description: 'Generates a UI Component',
        prompts: [
	        {
	            type: 'input',
	            name: 'namespace',
	            message: 'Component Namespace',
	            default: "core.ui"
	        },
	        {
	            type: 'input',
	            name: 'class',
	            message: 'Class Name',
	            validate: function (value) {
					var tag = value.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
					if(tag.indexOf("-")<0){
						return 'Class names should be 2 words in CamelCase.\nEx: SlideShow\nEx: LoginBox\nEx: ToggleSwitch'
					}
					return true;
				}
	        },
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
	            path: 'src/{{NSToPath namespace}}/{{class}}/index.js',
	            templateFile: 'framework/resources/generators/component/index.js.hbs'
	        },
	        {
	            type: 'add',
	            path: 'src/{{NSToPath namespace}}/{{class}}/index.css',
	            templateFile: 'framework/resources/generators/component/index.css.hbs'
	        },
	        {
	            type: 'add',
	            path: 'src/{{NSToPath namespace}}/{{class}}/index.html',
	            templateFile: 'framework/resources/generators/component/index.html.hbs'
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
	            default:"applications"
	        },
	        {
	            type: 'input',
	            name: 'class',
	            message: 'Application Class Name',
	            validate: function (value) {
					var tag = value.replace(/([a-zA-Z])(?=[A-Z0-9])/g, (f,m)=> `${m}-`).toLowerCase();
					if(tag.indexOf("-")<0){
						return 'Class names should be 2 words in CamelCase.\nEx: UserDashboard\nEx: ShoppingCart\nEx: ReportsTool'
					}
					return true;
				}
	        }
        ], // array of inquirer prompts
        actions: [
	        {
	            type: 'add',
	            path: 'src/applications/{{class}}/index.js',
	            templateFile: 'framework/resources/generators/application/index.js.hbs'
	        },
	        {
	            type: 'add',
	            path: 'src/applications/{{class}}/index.css',
	            templateFile: 'framework/resources/generators/application/index.css.hbs'
	        },
	        {
	            type: 'add',
	            path: 'src/applications/{{class}}/index.html',
	            templateFile: 'framework/resources/generators/application/index.html.hbs'
	        },
	        {
	            type: 'add',
	            path: '{{ClassToTagName class}}.html',
	            templateFile: 'framework/resources/generators/application/default.html.hbs'
	        }
        ]  // array of actions
    });
};
