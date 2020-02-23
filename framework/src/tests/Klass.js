
namespace `tests` (
    @traits([core.traits.UnitTest]);
    class Klass {
        constructor(){
            // alert(this.getNs())
        }



        test (){
            var self=this;



            
            this.expected("the ability to create a simple Class", (resolve,reject) => {
                namespace `com` (
                    class Employee {

                    }
                );

                if(com.Employee) {
                    resolve(true)
                } else {
                    reject("a is small")
                }
                
            });




            this.expected("the ability to create a simple Class with arguments", (resolve,reject) => {
                namespace `com` (
                    class Employee {
                        constructor(f,a){
                            this.firstname = f;
                            this.age=a
                        }
                    }
                );

                if(com.Employee){
                    var me = new com.Employee("Tom", 24);
                    if(me) {
                        resolve(me.firstname + " age: " + me.age)
                    }
                }
                reject("unable to define a new Class with arguments")
            });




            this.expected("Class inheritance to work", (resolve,reject) => {
                namespace `com` (
                    class Manager {
                        constructor(f,a){
                            this.firstname = f;
                            this.age=a
                        }
                    }
                );

                namespace `com` (
                    class Employee extends com.Manager {
                        constructor(f,a){
                            super(f,a)
                        }
                    }
                );

                if(com.Employee){
                    var me = new com.Employee("Tom", 24);
                    if(me && me instanceof com.Manager) {
                        resolve(me.firstname + " is an " + me.classname + " and also a Manager")
                    } else if(me && !(me instanceof com.Manager)) {
                        reject("the instance was not able to act like parent Class")
                    } else {
                        reject("something went wrong. Unable to inherit from parent base class")
                    }
                }
                reject("unable to define inheritance")
            });






            this.expected("inherited methods to return correct instance value", (resolve,reject) => {
                namespace `com` (
                    class Manager {
                        constructor(f,a){
                            this.firstname = f;
                            this.age=a
                        }

                        getName(){
                            return this.firstname
                        }
                    }
                );

                namespace `com` (
                    class Employee extends com.Manager {
                        constructor(f,a){
                            super(f,a)
                        }
                    }
                );

                if(com.Employee){
                    var me = new com.Employee("Tom", 24);
                    if(me) {
                        if(me.getName() == "Tom"){
                            resolve(true)
                        }
                    }
                }
                reject("method lookup failed from subclass to parent class")
            });





            this.expected("altering ancestors prototype chain to dynamically affect subclasses", (resolve,reject) => {
                namespace `com` (
                    class Manager {
                        constructor(f,a){
                            this.firstname = f;
                            this.age=a
                        }

                        getName(){
                            return this.firstname
                        }
                    }
                );

                namespace `com` (
                    class Employee extends com.Manager {
                        constructor(f,a){
                            super(f,a)
                        }
                    }
                );

                if(com.Employee){
                    var me = new com.Employee("Tom", 24);
                    if(me) {
                        com.Manager.prototype.getName = function(){
                            return "hello";
                        }
                        if(me.getName() == "hello"){
                            resolve(true)
                        }
                    }
                }
                reject("modifying prototype chain had no affect on subclass")
            });






            this.expected("altering prototype chain of a subclass to never affect it's ancestors", (resolve,reject) => {
                namespace `com` (
                    class Manager {
                        constructor(f,a){
                            this.firstname = f;
                            this.age=a
                        }

                        getName(){
                            return this.firstname
                        }
                    }
                );

                namespace `com` (
                    class Employee extends com.Manager {
                        constructor(f,a){
                            super(f,a)
                        }
                    }
                );

                if(com.Employee){
                    com.Employee.prototype.getName = function(){
                        return "hello";
                    }

                    var me = new com.Employee("Tom", 24);
                    var manager = new com.Manager("Brad", 40);
                    if(me && manager) {
                        if(me.getName() == "hello" && manager.getName() == "Brad"){
                            resolve(true)
                        }
                    }
                }
                reject("modifying a subclass prototype caused ancestor prototype to change.")
            });





            this.expected("the subclass to have a link back to it's parent ancestor", (resolve,reject) => {
                namespace `com` (
                    class Manager {
                        constructor(f,a){
                            this.firstname = f;
                            this.age=a
                        }

                        getName(){
                            return this.firstname
                        }
                    }
                );

                namespace `com` (
                    class Employee extends com.Manager {
                        constructor(f,a){
                            super(f,a)
                        }
                    }
                );

                if(com.Employee){
                    var me = new com.Employee("Tom", 24);
                    var ancestor = new com.Employee().ancestor;//.prototype.classname

                    if(ancestor == com.Manager) {
                        resolve(me.firstname + " is first an " +me.classname + " but also a " + ancestor.prototype.classname)
                    } 
                }
                reject("something went wrong. Unable to determin ancestor of subclass")
            });









            this.expected("the subclass to have a link back to it's parent ancestor", (resolve,reject) => {
                namespace `com` (
                    class Manager {
                        constructor(f,a){
                            this.firstname = f;
                            this.age=a
                        }

                        getName(){
                            return this.firstname
                        }
                    }
                );

                namespace `com` (
                    class Employee extends com.Manager {
                        constructor(f,a){
                            super(f,a)
                        }
                    }
                );

                if(com.Employee){
                    var me = new com.Employee("Tom", 24);
                    var ancestor = new com.Employee().ancestor;//.prototype.classname

                    if(ancestor == com.Manager) {
                        resolve(me.firstname + " is first an " +me.classname + " but also a " + ancestor.prototype.classname)
                    } 
                }
                reject("something went wrong. Unable to determin ancestor of subclass")
            });




        }
        
    }
);