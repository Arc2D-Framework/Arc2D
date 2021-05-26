import 'display.components.Label';

@tag("test-app");
namespace `apps` (
    class Test extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
