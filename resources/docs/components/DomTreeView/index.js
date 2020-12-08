
namespace `docs.components` (
    class DomTreeView extends WebComponent {
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
