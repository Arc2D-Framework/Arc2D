import 'docs.topics.LoaderActivity';

namespace `landing` (
    class MainScreen extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            var amChartLink = this.querySelector("a[href='http://www.amcharts.com']");
                amChartLink.remove();
        }
    }
);
