import '/src/system/diagnostics/UnitTest.js';
import '/src/system/diagnostics/unit/Klass.js';
import '/src/system/diagnostics/unit/WebComponents.js';
import '/src/system/diagnostics/unit/Repositories.js';

namespace `display.screens` (
    class TestHarness extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            var t = new system.diagnostics.unit.Klass;
            t.test();

            await wait(30);

            var t2 = new system.diagnostics.unit.WebComponents;
            t2.test();

            var t3 = new system.diagnostics.unit.Repositories;
            t3.test();
        }

    }
);
