
import 'ui.components.Splash';
import 'ui.components.SpaNav';
import '@system.http.HistoryRouter';
import '@system.http.QueryRouter';


namespace `ui.screens` (
    class SpaDemo extends Application {
        constructor(element){
            super(element);
            location.hash = location.hash||Config.DEFAULT_VIEW;
        }
        
        async onConnected() {
            await super.onConnected();
        }
    }
);
