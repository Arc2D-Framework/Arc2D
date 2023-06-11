{
    "id" : 30203,
    
    "script" : {
        "value" : "parent.isIFIT=true;"
    },

    "graphic" : {
        "src" : "graphic1.png",
        "mediaDescription" : "graphic 1 media desc",
        "alt" : "graphic 1 alt"
    },
    "text" : {
        "value" : "<h2>Hello World</h2><br/>text here, visit ${branch_1} and then ${swap_2} <br/> ${branches} ${swaps}"
    },
    "branches": [
        {
            "label" : "Branch 1"
        },
        {
            "label" : "Branch 2"
        }
    ],
    "swaps" : [
        {
            "label" : "Graphic 1 Swap", 
            "graphic": "picture_swap1.png", 
            "alt": "alt text swap 1", 
            "mediaDescription": "swap 1 desc"
        },
        {
            "label" : "Graphic 2 Swap", 
            "graphic": "picture_swap2.png", 
            "alt": "alt text swap 2", 
            "mediaDescription": "swap 2 desc"
        }
    ],
    "wcns" : [
        {"type": "w", "label": "warning note 1"},
        {"type": "c", "label": "caution note 1"},
        {"type": "n", "label": "regular note 1"}
    ],
    "menuitems" : [
        {"graphic": "image1.png", "label":"label 1", "branch": "branch label 1"},
        {"graphic": "image2.png", "label":"label 2", "branch": "branch label 2"},
        {"graphic": "image3.png", "label":"label 3", "branch": "branch label 3"}
    ],
    "tabs" : [
        {
            "label":"Tab 1", 
            "text" : {
                "value" : "text here, visit ${branch_1} and then ${swap_2} <br/> ${swaps}${branches}"
            }, 
            "selected":false, 
            "graphic":"tab1_graphic.png", 
            "mediaDescription":"media desc tab 1", 
            "alt":"alt desc tab 1"
        }
    ],
    "flashcards" : [
        {
            "graphic":"flashcard_1.png", 
            "label":"flashcard 1 label", 
            "img_in_front":true, 
            "mediaDescription":"flashcard 1 media desc", 
            "alt":"flashcard 1 alt"
        }
    ]
}