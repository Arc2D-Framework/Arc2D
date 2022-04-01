


import 'ui.components.CraigsListCard';

namespace `ui.screens` (
    class CraigsList extends Application {
        async onConnected() {
            this.data = await (await fetch('test.json')).json();
            await super.onConnected();
            for(let category of this.data.Categories) {
                var card = new ui.components.CraigsListCard;
                card.setData(category);
                this.querySelector("#center").append(card)
            }
        }
    }
);