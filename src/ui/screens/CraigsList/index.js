


import 'ui.components.CraigsListCard';

namespace `ui.screens` (
    class CraigsList extends Application {
        async onConnected() {
            this.data = await (await fetch('test.json')).json();
            await super.onConnected();
            var element = document.querySelector('.homepage-search+div');
            caleandar(element, [], {});

            this.index=[];
            for(let category of this.data.Categories) {
                for(let link of category.links){
                    this.index.push(link)
                }
                var card = new ui.components.CraigsListCard;
                card.setData(category);
                this.querySelector("#center").append(card)
            }
            
            this.index = this.index.sort(function(a, b) {
                var textA = a.title.toUpperCase();
                var textB = b.title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });

            this.renderIndex();
        }

        renderIndex(){
            var ul = this.querySelector(".menu.collapsible ul");
            for(let link of this.index){
                var li = `
                    <li class="s">
                        <a href="${link.href}">${link.title}</a>
                    </li>
                `.toNode();
                ul.append(li)
            }
        }
    }
);