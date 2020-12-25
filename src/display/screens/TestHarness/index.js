import '/src/system/diagnostics/UnitTest.js';
import '/src/system/diagnostics/unit/Class.js';
import '/src/system/diagnostics/unit/WebComponents.js';
import '/src/system/diagnostics/unit/Repositories.js';


namespace `display.screens` (
    class TestHarness extends Application {

        async onConnected() {
            await super.onConnected();
            for(var ns in system.diagnostics.unit){
                var unit = new system.diagnostics.unit[ns];
                    unit && unit.test();
                await wait(1000);
            }
        }
    }
);
