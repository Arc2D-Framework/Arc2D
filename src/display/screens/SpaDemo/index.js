
import 'display.components.Splash';
import 'display.components.SpaNav';
import '@system.http.HistoryRouter';
import '@system.http.QueryRouter';


namespace `display.screens` (
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
