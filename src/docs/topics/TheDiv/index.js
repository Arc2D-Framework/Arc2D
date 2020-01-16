import '/src/docs/topics/Topic.js';

namespace `docs.topics` (
    class TheDiv extends docs.topics.Topic {
    	onLoadInstanceStylesheet(){
            return false;
        }   
    }
);
