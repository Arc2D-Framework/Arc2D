var frame_data = {
    graphic : {
        src : "graphic1.png",
        mediaDescription : "graphic 1 media desc",
        alt : "graphic 1 alt"
    },
    text : {
        "value" : "text here, visit ${branch_1} and then ${swap_2} <br/> ${branches} ${swaps}"
    },
    branches: [
        {
            label : "Branch 1"
        },
        {
            label : "Branch 2"
        }
    ],
    swaps : [
        {label : "Graphic 1 Swap", graphic: "picture_swap1.png", alt: "alt text swap 1", mediaDescription: "swap 1 desc"},
        {label : "Graphic 2 Swap", graphic: "picture_swap2.png", alt: "alt text swap 2", mediaDescription: "swap 2 desc"}
    ],
    wcn : [
        {type: "w", label: "warning note 1"},
        {type: "w", label: "warning note 2"},
        {type: "c", label: "caution note"},
        {type: "n", label: "regular note"}
    ],
    menuitems : [
        {graphic: "image1.png", label:"label 1", branch: "branch label 1"},
        {graphic: "image2.png", label:"label 2", branch: "branch label 2"},
        {graphic: "image3.png", label:"label 3", branch: "branch label 3"}
    ],
    tabs : [
        {
            label:"Tab 1", 
            text : {
                "value" : "text here, visit ${branch_1} and then ${swap_2} <br/> ${swaps}${branches}"
            }, 
            selected:false, 
            graphic:"tab1_graphic.png", 
            mediaDescription:"media desc tab 1", 
            alt:"alt desc tab 1"
        }
    ],
    flashcards : [
        {graphic:"flashcard_1.png", label:"flashcard 1 label", img_in_front:true, mediaDescription:"flashcard 1 media desc", alt:"flashcard 1 alt"}
    ]
}

function define_inline_branch(item, index) {
    return `<a href='javascript:void(0);' id='link${index+1}' onclick=\"parent.launchBranch('branch_${index+1}', this);\">${item.label}</a>`
}

function define_inline_swap(item, index) {
    return `<a href='javascript:void(0);' id='swap_${index+1}'>${item.label}</a>`
}

function define_branch_list(branches) {
    var items = "";
    for(var i=0; i<= branches.length-1; i++) {
        var item = branches[i];
        items += `\t<li>${define_inline_branch(item, i)}</li>\n`
    }
    var ul = `\n<ul>\n${items}</ul>\n`;
    return ul;
}

function define_swap_list(swaps) {
    var items = "";
    for(var i=0; i<= swaps.length-1; i++) {
        var item = swaps[i];
        items += `\t<li>${define_inline_swap(item, i)}</li>\n`
    }
    var ul = `\n<ul>\n${items}</ul>\n`;
    return ul;
}

function define_swap_statement(items) {
    var src = "";
    for(var i=0; i<=items.length-1; i++){
        var item = items[i];
        src += `var swap_${i+1}_image = "${item.graphic}";\n`;
        src += `var swap_${i+1}_image_alt = "${item.alt}";\n`;
        src += `var swap_${i+1}_image_mediaDescription = "${item.mediaDescription}";\n`;
    }
    return src;
}

function define_branch_statements(items){
    var src = "";
    for(var i=0; i<=items.length-1; i++){
        var item = items[i];
        src += `var branch_${i+1} = createBranch("${item.label}");\n`;
    }
    return src;
}

function define_wcn_statements(items){
    var src = "";
    for(var i=0; i<=items.length-1; i++){
        var item = items[i];
        src += `createWCN("${item.label}", "${item.type}");\n`;
    }
    return src;
}

function define_graphic_statements(item) {
    var src = "";
        src += `var graphic = "${item.src}";\n`
        src += item.alt? `var graphic_alt = "${item.alt}";\n`:'';
        src += item.mediaDescription? `var mediaDescription = "${item.mediaDescription||""}";\n`:'';
    return src;
}

function define_menuitem_statements(items) {
    var src = "";
    for(var i=0; i<=items.length-1; i++){
        var item = items[i];
        src += `createMenuItem("${item.graphic}", "${item.label}", "${item.branch}");\n`;
    }
    return src;
}

function define_tab_statements(items, frame_data) {
    var src = "\n";
    for(var i=0; i<=items.length-1; i++){
        var item = items[i];
        src += `newTab("${item.label}", \`${define_text_statement(item.text.value,item.text, frame_data)}\`, ${item.selected}, "${item.graphic}", ${item.mediaDescription?"'"+item.mediaDescription+"'":null}, "${item.alt}");\n`;
    }
    return src;
}

function define_flashcard_statements(items){
    var src = "\n";
    for(var i=0; i<=items.length-1; i++){
        var item = items[i];
        src += `newFlashcard("${item.graphic}", "${item.label}", ${item.img_in_front}, "${item.graphic}", ${item.mediaDescription?"'"+item.mediaDescription+"'":null}, "${item.alt}");\n`;
    }
    return src;
}

function define_text_statement(str, item, frame_data) {
    str = str.replace(/\$\{([a-z_0-9]*)\}/gm, function(full, m1) {
        if(/branch_[0-9]+/.test(m1)) {
            var index = Number(m1.split("_")[1])-1;
            return define_inline_branch(frame_data.branches[index], index);
        }
        if(/branches/.test(m1)) {
            return define_branch_list(frame_data.branches);
        }
        if(/swap_[0-9]+/.test(m1)) {
            var index = Number(m1.split("_")[1])-1;
            return define_inline_swap(frame_data.swaps[index], index);
        }
        if(/swaps/.test(m1)) {
            return define_swap_list(frame_data.swaps);
        }
    });
    return str;
}
var src = "";

for(var key in frame_data) {
    var item = frame_data[key];
    if(key == "graphic") {
        src += define_graphic_statements(item)
    }
    if(key == "text") {
        src +=  define_text_statement(`var ${key} = \`${item.value}\``, item, frame_data);

        src += ";\n";
        
        if(frame_data.swaps?.length) {
            src += define_swap_statement(frame_data.swaps)
        }

        if(frame_data.branches?.length) {
            src += define_branch_statements(frame_data.branches)
        }
    }
    if(key == "wcn") {
        src += define_wcn_statements(item)
    }
    if(key == "menuitems") {
        src += define_menuitem_statements(item)
    }
    if(key == "tabs") {
        src += define_tab_statements(item, frame_data)
    }
    if(key == "flashcards") {
        src += define_flashcard_statements(item)
    }
};


console.log(src);

