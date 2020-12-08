/*
THIS IS POSSIBLE:
export let Person = namespace `core.things` (
	class Person {
	    constructor(){
	        alert("new person created")
	    }
	}
)
*/




// THIS TOO
export default () => {
  console.log('Hi from the default export!');
};

// AND THIS, named export `doStuff`
export const doStuff = () => {
  console.log('Doing stuff…');
};

