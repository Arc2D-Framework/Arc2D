// DomMutationPlayer
// Standalone replay engine for recordings produced by DomMutationRecorder.
// It has NO observers, NO gesture listeners, and does NOT patch attachShadow,
// so it is safe to ship into an exported demo runtime that only needs to replay.
//
// Give it a target + baseline + clips (via attach() or by setting the fields),
// then call restoreBaseline() / playClip() / playAllClips().
class DomMutationPlayer {
  constructor(options = {}) {
    this.options = {
      recorderKind: 'custom-dom',
      includeUndo: false,
      ...options
    };

    this.target = null;
    this.baseline = null;
    this.clips = [];
    this.currentPlaybackIndex = -1;
    this.isApplying = false;
  }

  attach(target, baseline, clips = []) {
    this.target = target;
    this.baseline = baseline;
    this.clips = clips;
    this.currentPlaybackIndex = -1;
    return this;
  }

  // Load a full exported recording object (or a raw clips array) and point the
  // player at a target, ready for playClip() / playAllClips(). Chainable.
  //
  // Console usage (e.g. paste a copied recording on the page that produced it):
  //   new DomMutationPlayer().loadRecording(recording).playAllClips();
  //   new DomMutationPlayer().loadRecording(recording).playClip('clip-1');
  //
  // Forward playback resolves selectors against `document`, so `target` only
  // matters for restoreBaseline() — which needs a serialized baseline the
  // compact export does not carry, so it is unavailable from a recording alone.
  loadRecording(recording, target = (typeof document !== 'undefined' ? document.body : null)) {
    const clips = Array.isArray(recording)
      ? recording
      : (recording && Array.isArray(recording.clips) ? recording.clips : []);
    this.attach(target, null, clips);
    return this;
  }

  playClip(clipOrId, options = {}) {
    const clip = typeof clipOrId === 'string'
      ? this.clips.find(item => item.id === clipOrId)
      : clipOrId;

    if (!clip) {
      console.warn('[DomMutationPlayer] clip not found:', clipOrId);
      return {
        ok: false,
        error: 'clip-not-found',
        clipId: clipOrId
      };
    }

    const summary = this.applyEvents(clip.events || [], options);
    const index = this.clips.indexOf(clip);
    if (index !== -1 && summary.ok) {
      this.currentPlaybackIndex = index;
    }
    return summary;
  }

  playClipAt(index, options = {}) {
    if (!Number.isInteger(index) || index < 0 || index >= this.clips.length) {
      return {
        ok: false,
        error: 'clip-index-out-of-range',
        index,
        totalClips: this.clips.length
      };
    }

    return {
      clipId: this.clips[index].id,
      index,
      ...this.playClip(this.clips[index], options)
    };
  }

  playNextClip(options = {}) {
    return this.playClipAt(this.currentPlaybackIndex + 1, options);
  }

  getCurrentClipIndex() {
    return this.currentPlaybackIndex;
  }

  playAllClips(options = {}) {
    const summaries = [];
    for (const clip of this.clips) {
      summaries.push({
        clipId: clip.id,
        ...this.playClip(clip, options)
      });
    }
    this.currentPlaybackIndex = this.clips.length ? this.clips.length - 1 : -1;
    return summaries;
  }

  applyEvents(events = [], options = {}) {
    const summary = {
      ok: true,
      total: events.length,
      replayable: 0,
      applied: 0,
      skipped: 0,
      missingTargets: [],
      skippedEvents: []
    };

    this.isApplying = true;
    try {
      for (const event of events) {
        if (event.kind && event.kind !== 'mutation') {
          continue;
        }
        summary.replayable += 1;
        const result = this.applyMutationEvent(event);
        if (result?.ok) {
          summary.applied += 1;
        } else {
          summary.skipped += 1;
          summary.skippedEvents.push({
            type: event.type,
            target: event.target,
            reason: result?.reason || 'unknown'
          });
          if (result?.reason === 'missing-target' && event.target) {
            summary.missingTargets.push(this.describeLocator(event.target));
          }
        }
      }
    } finally {
      this.isApplying = false;
    }

    return summary;
  }

  applyMutationEvent(event) {
    if (event.type === 'attributes') {
      const target = this.findNode(event.target);
      if (!(target instanceof Element)) {
        return { ok: false, reason: 'missing-target' };
      }
      if (event.newValue === null || typeof event.newValue === 'undefined') {
        target.removeAttribute(event.name);
      } else if (event.namespace) {
        target.setAttributeNS(event.namespace, event.name, event.newValue);
      } else {
        target.setAttribute(event.name, event.newValue);
      }
      return { ok: true };
    }

    if (event.type === 'characterData') {
      const target = this.findNode(event.target);
      if (target) {
        target.nodeValue = event.newValue;
        return { ok: true };
      }
      return { ok: false, reason: 'missing-target' };
    }

    if (event.type === 'childList') {
      const parent = this.findNode(event.target);
      if (!parent) {
        return { ok: false, reason: 'missing-target' };
      }

      let applied = 0;
      for (const item of event.removes || []) {
        const node = this.findRemovedNode(parent, item) || this.findScopedRemovedTarget(parent, item);
        if (node && node.parentNode) {
          node.parentNode.removeChild(node);
          applied += 1;
        }
      }

      for (const item of event.adds || []) {
        const node = this.deserializeNode(item.node);
        if (!node) {
          continue;
        }

        const next = this.findNode(item.nextSibling);
        const previous = this.findNode(item.previousSibling);
        if (next && next.parentNode === parent) {
          parent.insertBefore(node, next);
        } else if (previous && previous.parentNode === parent && previous.nextSibling) {
          parent.insertBefore(node, previous.nextSibling);
        } else {
          parent.appendChild(node);
        }
        applied += 1;
      }
      return { ok: true, applied };
    }

    if (event.type === 'property') {
      const target = this.findNode(event.target);
      if (target && this.applyPropertyValue(target, event.property, 'newValue' in event ? event.newValue : event.value)) {
        return { ok: true };
      }
      return { ok: false, reason: 'missing-target' };
    }

    if (event.type === 'scroll') {
      const target = this.findNode(event.target);
      if (!target || !event.newValue) {
        return { ok: false, reason: 'missing-target' };
      }
      if ('scrollTop' in target) {
        target.scrollTop = event.newValue.scrollTop || 0;
      }
      if ('scrollLeft' in target) {
        target.scrollLeft = event.newValue.scrollLeft || 0;
      }
      return { ok: true };
    }

    if (event.type === 'shadowRoot') {
      return { ok: true };
    }

    return { ok: false, reason: 'unsupported-event-type' };
  }

  applyPropertyValue(target, property, value) {
    if (!target || !property) {
      return false;
    }

    if (property === 'selectedValues' && target instanceof HTMLSelectElement) {
      const values = Array.isArray(value) ? new Set(value.map(String)) : new Set();
      for (const option of Array.from(target.options || [])) {
        option.selected = values.has(option.value);
      }
      return true;
    }

    if (property === 'selectedIndex' && target instanceof HTMLSelectElement) {
      const index = Number(value);
      target.selectedIndex = Number.isFinite(index) ? index : -1;
      return true;
    }

    if (property in target) {
      target[property] = value;
      return true;
    }

    return false;
  }

  restoreBaseline() {
    if (!this.target || !this.baseline) {
      return;
    }

    this.isApplying = true;
    try {
      this.restoreElementFromSnapshot(this.target, this.baseline);
    } finally {
      this.isApplying = false;
    }

    this.currentPlaybackIndex = -1;
  }

  restoreElementFromSnapshot(target, snapshot) {
    if (!(target instanceof Element) || !snapshot || snapshot.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    for (const attr of Array.from(target.attributes)) {
      target.removeAttribute(attr.name);
    }
    for (const [name, value] of Object.entries(snapshot.attributes || {})) {
      target.setAttribute(name, value);
    }

    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }

    for (const child of snapshot.children || []) {
      target.appendChild(this.deserializeNode(child));
    }

    if (snapshot.shadowRoot) {
      this.restoreShadowRoot(target, snapshot.shadowRoot);
    }
  }

  restoreShadowRoot(host, shadowSnapshot) {
    if (!(host instanceof Element) || !shadowSnapshot) {
      return null;
    }

    const root = host.shadowRoot || host.attachShadow({ mode: shadowSnapshot.mode || 'open' });
    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    for (const child of shadowSnapshot.children || []) {
      root.appendChild(this.deserializeNode(child));
    }
    return root;
  }

  deserializeNode(data) {
    if (!data) {
      return null;
    }

    if (data.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(data.textContent || '');
    }

    if (data.nodeType === Node.COMMENT_NODE) {
      return document.createComment(data.textContent || '');
    }

    if (data.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const node = data.namespaceURI && data.namespaceURI !== 'http://www.w3.org/1999/xhtml'
      ? document.createElementNS(data.namespaceURI, data.tag)
      : document.createElement(data.tag);

    for (const [name, value] of Object.entries(data.attributes || {})) {
      node.setAttribute(name, value);
    }

    for (const child of data.children || []) {
      const childNode = this.deserializeNode(child);
      if (childNode) {
        node.appendChild(childNode);
      }
    }

    if (data.shadowRoot) {
      this.restoreShadowRoot(node, data.shadowRoot);
    }

    return node;
  }

  findNode(locator) {
    if (!locator) {
      return null;
    }

    if (typeof locator === 'string') {
      return this.querySelectorDeep(locator);
    }

    if (locator.kind === 'element') {
      return this.querySelectorDeep(locator.selector);
    }

    if (locator.selector && typeof locator.childIndex === 'number') {
      const parent = this.querySelectorDeep(locator.selector);
      const child = parent?.childNodes?.[locator.childIndex] || null;
      if (child && (!locator.nodeType || child.nodeType === locator.nodeType)) {
        return child;
      }

      return this.findChildByHint(parent, locator);
    }

    return null;
  }

  findRemovedNode(parent, item) {
    if (!parent || !item) {
      return null;
    }

    const next = this.findNode(item.nextSibling);
    if (next && next.parentNode === parent) {
      const candidate = next.previousSibling;
      if (this.nodeMatchesSnapshot(candidate, item.node)) {
        return candidate;
      }
    }

    const previous = this.findNode(item.previousSibling);
    if (previous && previous.parentNode === parent) {
      const candidate = previous.nextSibling;
      if (this.nodeMatchesSnapshot(candidate, item.node)) {
        return candidate;
      }
    }

    for (const child of Array.from(parent.childNodes || [])) {
      if (this.nodeMatchesSnapshot(child, item.node)) {
        return child;
      }
    }

    return null;
  }

  findScopedRemovedTarget(parent, item) {
    const node = this.findNode(item?.target);
    if (node && node.parentNode === parent && this.nodeMatchesSnapshot(node, item.node)) {
      return node;
    }
    return null;
  }

  nodeMatchesSnapshot(node, snapshot) {
    if (!node || !snapshot || node.nodeType !== snapshot.nodeType) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE) {
      return node.nodeValue === (snapshot.textContent || '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    if ((node.tagName || '').toLowerCase() !== snapshot.tag) {
      return false;
    }

    const snapshotAttrs = snapshot.attributes || {};
    if (snapshotAttrs.id && node.id !== snapshotAttrs.id) {
      return false;
    }
    if (snapshotAttrs.class && node.getAttribute('class') !== snapshotAttrs.class) {
      return false;
    }

    return true;
  }

  querySelectorDeep(selector, root = document) {
    if (!selector) {
      return null;
    }

    const parts = String(selector).split(/\s*>>>\s*/).filter(Boolean);
    let searchRoot = root;
    let found = null;

    for (let index = 0; index < parts.length; index += 1) {
      try {
        found = searchRoot.querySelector(parts[index].trim());
      } catch (error) {
        return null;
      }

      if (!found) {
        return null;
      }

      if (index < parts.length - 1) {
        searchRoot = found.shadowRoot;
        if (!searchRoot) {
          return null;
        }
      }
    }

    return found;
  }

  findChildByHint(parent, locator) {
    if (!parent?.childNodes) {
      return null;
    }

    const children = Array.from(parent.childNodes);
    return children.find(child => {
      if (locator.nodeType && child.nodeType !== locator.nodeType) {
        return false;
      }
      if (!locator.textHint) {
        return true;
      }
      return this.previewText(child.nodeValue || '') === locator.textHint;
    }) || null;
  }

  describeLocator(locator) {
    if (!locator) {
      return 'unknown';
    }
    if (typeof locator === 'string') {
      return locator;
    }
    if (locator.kind === 'element') {
      return locator.selector;
    }
    return `${locator.selector || 'unknown'}::child(${locator.childIndex})`;
  }

  previewText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }
}

if (typeof window !== 'undefined') {
  window.DomMutationPlayer = DomMutationPlayer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DomMutationPlayer;
}
