import '/src/docs/topics/Topic.js';

namespace `docs.topics` (
    @cascade(true);
    class TheDiv extends docs.topics.Topic {
    	onLoadInstanceStylesheet(){
            return false;
        }   
    }
);
