class MutationRecorder {
  constructor() {
    this.observer = null;
    this.mutations = [];
    this.filmstrip = [];
    this.target = null;
    this.boundingRect = null;
    this.options = {};
  }

  observe(targetOrRect, options = { childList: true, subtree: true, attributes: true, characterData: true, attributeOldValue:true, characterDataOldValue:true  }) {
    // Accepts either a DOM node or a bounding rect {left, top, width, height}
    if (targetOrRect instanceof Element) {
      this.target = targetOrRect;
      this.boundingRect = null;
    } else if (typeof targetOrRect === 'object' && targetOrRect.left !== undefined) {
      this.target = document.body;
      this.boundingRect = targetOrRect;
    } else {
      throw new Error('Invalid target for MutationRecorder.observe');
    }
    this.options = options;
    this.mutations = [];
    if (this.observer) this.observer.disconnect();
    this.observer = new MutationObserver(this._onMutations.bind(this));
    this.observer.observe(this.target, this.options);
  }

  _onMutations(mutationsList) {
    for (const mutation of mutationsList) {
      if (this.boundingRect) {
        // Only record mutations inside bounding rect
        let node = mutation.target.nodeType === 1 ? mutation.target : mutation.target.parentElement;
        if (!node) continue;
        const rect = node.getBoundingClientRect();
        const b = this.boundingRect;
        if (
          rect.right < b.left ||
          rect.left > b.left + b.width ||
          rect.bottom < b.top ||
          rect.top > b.top + b.height
        ) {
          continue;
        }
      }
      this.mutations.push(this._serializeMutation(mutation));
    }
  }

  snapshot() {
    // Save current batch of mutations as a frame
    this.filmstrip.push({
      mutations: this.mutations.slice(),
      timestamp: Date.now()
    });
    this.mutations = [];
  }

  getFilmStrip() {
    return {
      frames: this.filmstrip.slice()
    };
  }

  play(recording, delay = 500) {
    // Replay each frame's mutations in order, with optional delay
    if (!recording || !recording.frames) return;
    let i = 0;
    const playFrame = () => {
      if (i >= recording.frames.length) return;
      this._playMutations(recording.frames[i].mutations);
      i++;
      if (i < recording.frames.length) {
        setTimeout(playFrame, delay);
      }
    };
    playFrame();
  }

  _serializeMutation(m) {
    if (m.type === "childList") {
      const serializeNode = (node, listType) => {
        const parent = node && node.parentElement ? node.parentElement : (m.target && (typeof m.target === 'string' ? document.querySelector(m.target) : m.target));
        const preserveWhitespace = parent && (
          ['pre', 'textarea'].includes(parent.tagName.toLowerCase()) ||
          (window.getComputedStyle(parent)?.whiteSpace?.startsWith?.('pre'))
        );

        // Helper to build a selector from the node itself (works even if node gets removed)
        const buildInlineSelector = (el) => {
          if (!el || el.nodeType !== 1) return null;
          const tag = el.tagName.toLowerCase();
          if (el.id) return `${tag}#${el.id}`;

          // prefer classes + useful attributes (data-*, aria-*, role/name/title)
          const classes = (el.className && typeof el.className === 'string' && el.className.trim())
            ? `.${el.className.trim().replace(/\s+/g, '.')}`
            : '';

          const importantAttrs = Array.from(el.attributes || [])
            .filter(a => a.name.startsWith('data-') || a.name.startsWith('aria-') || ['role','name','title'].includes(a.name))
            .map(a => {
              const val = (a.value || '').replace(/"/g, '\\"');
              return val ? `[${a.name}="${val}"]` : `[${a.name}]`;
            }).join('');

          // at least return tag if nothing else
          return `${tag}${classes}${importantAttrs}` || tag;
        };

        if (node.nodeType === 3) {
          var textContent = (node.textContent || node.nodeValue).trim();
          if(preserveWhitespace || textContent) {
            return {
              nodeType: 3,
              textContent: textContent,
              parentElement: this._getSelector(m.target),
              target : this._getSelector(m.target),
              previousSibling: this._getSelector(m.previousSibling),
              nextSibling: this._getSelector(m.nextSibling)
            };
          }
          return null;
        } else {
          return {
            nodeType: node.nodeType,
            html: node.outerHTML,
            parentElement : this._getSelector(m.target),
            target: this._getSelector(node) || buildInlineSelector(node),
            previousSibling: this._getSelector(m.previousSibling || node.previousSibling),
            nextSibling: this._getSelector(m.nextSibling || node.nextSibling)
          };
        }
      };
      return {
        type: m.type,
        target: this._getSelector(m.target),
        addedNodes: Array.from(m.addedNodes || []).map(node => serializeNode(node, 'added')),
        removedNodes: Array.from(m.removedNodes || []).map(node => serializeNode(node, 'removed'))
      };
    } else if (m.type === "characterData") {
      return {
        type: m.type,
        nodeType: m.target.nodeType,
        target : this._getSelector(m.target),
        textContent: m.target.textContent || m.target.nodeValue,
        parentElement: this._getSelector(m.target.parentNode),
        nextSibling: this._getSelector(m.target.nextSibling),
        previousSibling: this._getSelector(m.target.previousSibling)
      };
    } else if (m.type === "attributes") {
      return {
        type: m.type,
        target: this._getSelector(m.target),
        parentElement: this._getSelector(m.target.parentNode),
        attributeName: m.attributeName,
        oldValue: typeof m.oldValue === "string" ? m.oldValue.trim() : m.oldValue,
        newValue: m.target.getAttribute(m.attributeName)
      };
    } else {
      console.warn("Unknown mutation type:", m.type);
    }
  }

  _getSelector(node) {
    if(node) {
        if(node?.nodeType == 3) {
            var hasValue = (node.textContent || node.nodeValue||"").trim().length > 0;
            if(hasValue){
              return {
                  nodeType: node.nodeType,
                  textContent: node.textContent || node.nodeValue,
                  parentElement: this._getSelector(node.parentNode)
              };
            }
            return null;
        }
        else {
            var selector = null, nthChild = -1, nthOfType = -1;
            if(!node.parentNode) return null;
            nthChild = Array.from(node.parentNode.children).indexOf(node) + 1;
            nthOfType = Array.from(node.parentNode.children).filter(child => child.tagName === node.tagName).indexOf(node);

            
            if (node.id) selector = `#${node.id}`;
            else if (node.className && typeof node.className === 'string') {
              selector = `${node.tagName.toLowerCase()}.${node.className.trim().replace(/\s+/g, '.')}`;
            } else {
              selector = node.tagName ? node.tagName.toLowerCase() : null;
              // if (nthChild > 0) selector += `:nth-child(${nthChild})`;
              if (nthOfType > 0) selector += `:nth-of-type(${nthOfType})`;
            }
            return selector
        }
    }
    return null;
  }

  _playMutations(mutations) {
    for (const m of mutations) {
      // resolve the parent/target element for this mutation
      const parent = (m.target && typeof m.target === 'string') ? document.querySelector(m.target) : null;
      if (!parent && m.type !== 'attributes' && m.type !== 'characterData') continue;

      if (m.type === 'attributes') {
        // apply attribute forward (use newValue when available)
        const el = parent || (m.target ? document.querySelector(m.target) : null);
        if (!el) continue;
        const val = typeof m.newValue !== 'undefined' ? m.newValue : m.value;
        if (val === null) el.removeAttribute(m.attributeName);
        else el.setAttribute(m.attributeName, val);
      } 
      else if (m.type === 'characterData') {
        if(m.nodeType === 3) {
          if(m.nextSibling) {
            const el = this._deserializeNode(m);
            var parentElement = document.querySelector(m.parentElement);
            var nextElement = parentElement.querySelector(m.nextSibling);
            if (parentElement && nextElement) {
              parentElement.insertBefore(el, nextElement);
            }
            else if (parentElement) {
              parentElement.appendChild(el);
            }
          }
          else {
            const el = this._deserializeNode(m);
            var parentElement = document.querySelector(m.parentElement);
            if (parentElement) {
              parentElement.appendChild(el);
            }
          }
        }
      } 
      else if (m.type === 'childList') {
        const added = Array.from(m.addedNodes || []);
        const removed = Array.from(m.removedNodes || []);

        // Remove nodes
        for (const n of removed) {
          if (node && node.parentNode) {
            var sel = (n && typeof n === 'object' && n.target) ? n.target : null;
            var node = sel ? document.querySelector(sel) : null;
            if(n.nodeType === 3) {
              const txtNode = Array.from(node.parentNode.childNodes).find(el => {
                // debugger
                return (
                  (el.nodeType === 3 && el.textContent.trim() === n.textContent.trim()) ||
                  (el.nodeType === 1 && el.textContent.trim() === n.textContent.trim())
                );
              });
              if (txtNode) {
                txtNode.textContent = "";
                //node.parentNode.removeChild(txtNode);
              }
            }
          }
          else if(n.nodeType === 1) {
            //find node to remove from parent using .html string match
            const html = n.html;
            var parentElement = document.querySelector(n.parentElement);
            if(!parentElement) continue;
            const nodeToRemove = parentElement.querySelector(n.target) || Array.from(parentElement.childNodes).find(el => (el.outerHTML || el.textContent ).trim() === html.trim());
            if (nodeToRemove) {
              parentElement.removeChild(nodeToRemove);
            }
          }
          else if(n.nodeType === 3) {
            // Text node removal
            var parentElement = document.querySelector(n.parentElement);
            if(!parentElement) continue;
            const textNodeToRemove = Array.from(parentElement.childNodes).find(el => el.nodeType === 3 && el.textContent.trim() === n.textContent.trim());
            if (textNodeToRemove) {
              // textNodeToRemove.textContent = "";
              parentElement.removeChild(textNodeToRemove);
            }
          }
        }
        // Add nodes
        for (const n of added) {
          const el = this._deserializeNode(n);
          if (el) {
            if(n.nodeType === 3) {
              var hasText = (n.textContent||"").trim().length > 0;
              if(hasText) {
                if(!n.nextSibling && !n.previousSibling) {
                  parent.textContent = n.textContent;
                }
              }
            }
            else if(n.nodeType === 1) {
              // Insert before nextSibling if available
              // var parent = document.querySelector(n.parentElement);
              const nextSel = (n && typeof n === 'object' && n.nextSibling) ? n.nextSibling : null;
              const nextEl = nextSel ? parent.querySelector(nextSel) : null;
              if (nextEl && nextEl.parentNode === parent) {
                parent.insertBefore(el, nextEl);
              } else {
                parent.appendChild(el);
              }
            }
          }
        }
      }
    }
  }

  _deserializeNode(nodeData) {
    if (nodeData.nodeType === 3) {
      if (nodeData.newValue) {
        return document.createTextNode(nodeData.newValue);
      }
      if (nodeData.oldValue) {
        return document.createTextNode(nodeData.oldValue);
      }
      return document.createTextNode(nodeData.textContent);
    }
    if (nodeData.html) {
      const temp = document.createElement('div');
      temp.innerHTML = nodeData.html;
      return temp.firstElementChild;
    }
    return null;
  }
}

// mutation.attributeNamespace is a property of a MutationRecord for 'attributes' mutations.
// It contains the namespace URI of the changed attribute, or null if the attribute has no namespace.
// This is mainly relevant for XML/SVG documents where attributes can be namespaced (e.g., xlink:href).
// For standard HTML attributes, mutation.attributeNamespace will almost always be null.
// Namespaces are mainly used in XML/SVG (e.g., xlink:href), not in regular HTML.

if (typeof window !== 'undefined') {
  window.MutationRecorder = MutationRecorder;
}

// export default MutationRecorder;


