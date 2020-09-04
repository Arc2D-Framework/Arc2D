import '/src/core/traits/UnitTest.js';
import '/src/tests/Klass.js';
import '/src/tests/WebComponents.js';
import '/src/tests/Repositories.js';

namespace `applications` (
    class TestHarness extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            var t = new tests.Klass;
            t.test();

            await wait(30);

            var t2 = new tests.WebComponents;
            t2.test();

            var t3 = new tests.Repositories;
            t3.test();
        }

    }
);
