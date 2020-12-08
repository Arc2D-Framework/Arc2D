import 'core.ui.LipSyncAvatar';

namespace `applications` (
    class LipSync extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
