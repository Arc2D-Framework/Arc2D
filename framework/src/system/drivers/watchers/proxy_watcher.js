//TODO: put this in a class, edit "onChange" to be "watch" 
//REF ARTICLE: https://codeburst.io/understanding-javascript-proxies-by-examining-on-change-library-f252eddf76c2

const onChange = (objToWatch, onChangeFunction) => { 
  const handler = {
    get(target, property, receiver) {
      onChangeFunction();
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value) {
      onChangeFunction();
      return Reflect.set(target, property, value);
    },
    deleteProperty(target, property) {
      onChangeFunction();
      return Reflect.deleteProperty(target, property);
    }
  };
return new Proxy(objToWatch, handler);
};