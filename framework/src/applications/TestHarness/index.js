import '/src/core/traits/UnitTest.js';
import '/src/tests/Klass.js';


namespace `applications` (
    class TestHarness extends w3c.ui.Application {
        constructor(element){
            super(element);
            // alert(core.traits.UnitTest)
        }

        async onConnected() {
            await super.onConnected();
            var t = new tests.Klass;
            t.test()
        }

    }
);
