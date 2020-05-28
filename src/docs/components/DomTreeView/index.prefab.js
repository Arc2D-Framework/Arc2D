;(()=> {
                

namespace `docs.components` (
    class DomTreeView extends w3c.ui.WebComponent {
        async onConnected() {
            await super.onConnected();
            wait(300).then(e => {
                this.init()
            })
        }

        // onStyleComputed(style){//wait for styles
        //     wait(1000).then(e => {
        //         this.init()
        //     })
        // }

        getLevelNodes(node) {
            return Array.from(node.parentNode.children)
        }
      
        getChildIndex(node) {
            return this.getLevelNodes(node).indexOf(node)
        }
      
        tagNodeName(node) {
            node.innerHTML = (node.getAttribute("tag")||node.nodeName) + node.innerHTML
        }
      
        clearInside(node) {
            Array.from(node.childNodes).forEach(child => {
              if (child.nodeName === '#text') {
                child.remove()
              }
            })
        }
      
        handleImage(node) {
            if (node.nodeName === 'IMG') {
              node.src = ''
              node.alt = 'IMG'
            }
        }
      
        walk(node, cb) {
            cb(node)
            if (node.children.length) {
              this.walk(node.children[0], cb)
            }
            if (node.nextElementSibling) {
              this.walk(node.nextElementSibling, cb)
            }
        }
    

        init() {
            var el = this.querySelector('slot')
            this.walk(el.children[0], node => {
              var levelNodes = this.getLevelNodes(node);
              var childIndex = this.getChildIndex(node);
              var width = 90 / levelNodes.length;
              var leftSlice = 100 / levelNodes.length;
              var left = leftSlice * childIndex;
              this.clearInside(node)
              this.tagNodeName(node)
              this.handleImage(node)
              node.style.cssText += `;
                width: ${width}%;
                left: ${left}%;
              `
            })
        }
    }
);



                docs.components.DomTreeView.prototype.template = function(){
                    return `<template>
    <div id="canvas">
        <slot name="component">Hello</slot>
    </div>
</template>
`
                };

                docs.components.DomTreeView.prototype.cssStyle = function(){
                    return `dom-tree-view {
    /*width:100%;
    display:block;
    position:relative;
    border:1px solid gray;*/
    width: 100%;

    display: block;

    position: relative;

    border: 1px solid gray;

    background: white;

    height: 300px;
    clear: both;
}

dom-tree-view #canvas {
    height: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
}


dom-tree-view #canvas slot {
    display: block;
    height: 100%;
}



dom-tree-view #canvas slot {
  position: relative;
}
dom-tree-view #canvas slot * {
    box-sizing: border-box;

position: absolute;

display: block;

height: 2.5vw;

-webkit-transform: translateX(5%);

transform: translateX(5%);

font-size: .95em;

text-align: center;

line-height: 40px;

border: 1px solid transparent;

border-radius: 3px;

background: #999;

color: #fff;

-webkit-transition: all .3s;

transition: all .3s;

margin: 0;

margin-top: 24px;
  /*box-sizing: border-box;
  position: absolute;
  display: block;
  height: 2.5vw;

bottom: -4vw;
  -webkit-transform: translateX(5%);
          transform: translateX(5%);
  font-size: .95em;
  text-align: center;
  line-height: 40px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: #999;
  color: #fff;
  -webkit-transition: all .3s;
  transition: all .3s;
  margin:0;*/
}
dom-tree-view #canvas slot *:active,
dom-tree-view #canvas slot *:focus {
  background: #27f;
  border-color: black;
}
dom-tree-view #canvas slot *:hover::before {
  background: black;
}
dom-tree-view #canvas slot *::before {
  content: "";
  position: absolute;
  /*top: -4.5vw;*/
  top: -1.5vw;
  left: 50%;
  -webkit-transform: translate(-5%);
          transform: translate(-5%);
  width: 2px;
  /*height: calc(4.5vw - 1px);*/
  height: 24px;
  background: inherit;
}

@media (max-width: 500px) {
  dom-tree-view #canvas slot {
    width: 175%;
  }
  dom-tree-view #canvas slot * {
    height: 30px;
    bottom: -60px;
    line-height: 30px;
  }
  dom-tree-view #canvas slot *::before {
    top: -30px;
    height: 29px;
  }
}
@media (max-width: 300px) {
  dom-tree-view #canvas slot {
    width: 250%;
  }
}

`
                };

                docs.components.DomTreeView.prototype.onLoadInstanceStylesheet = function(){ return false }
            })();
