namespace `core.traits` (
    class UnitTest {
        expected (description, promise){
            var self=this;
            new Promise(promise).then(
                function(){ console.log("✅ %c Passed: "  + self.classname + " - " + arguments[0] + " -- expected " + description, 'background: green; color: white; display: block;')  },
                function(){ console.error("❗ %c Failed: " + self.classname + " - " +  " expected " + description + ", but " + arguments[0], 'background: red; color: white; display: block;') }
            )
        }

        wait (ms){
            return new Promise((r, j)=>setTimeout(r, ms));
        }

        getNs(){
            return this.namespace
        }
    }
);
