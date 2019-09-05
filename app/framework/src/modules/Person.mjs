/*export let Person = namespace("Person", class {
    constructor(){
        alert("new person created")
    }
});*/

/*namespace("Person", class {
    constructor(){
        alert("new person created")
    }
});*/



// Default export
export default () => {
  console.log('Hi from the default export!');
};

// Named export `doStuff`
export const doStuff = () => {
  console.log('Doing stuff…');
};

