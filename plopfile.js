module.exports = function (plop) {
	plop.addHelper('NSToPath', function (ns) {
		return ns.replace(/\./gm,"/");
	});

    // create your generators here
    plop.setGenerator('basics', {
        description: 'this is a skeleton plopfile',
        prompts: [
	        {
	            type: 'input',
	            name: 'namespace',
	            message: 'Component Namespace'
	        },
	        {
	            type: 'input',
	            name: 'class',
	            message: 'Class Name'
	        },
	        {
	            type: 'input',
	            name: 'parent',
	            message: 'Extends Base Class ?'
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
};
