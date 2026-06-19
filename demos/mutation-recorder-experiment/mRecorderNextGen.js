class MutationRecorderNextGen {
  static instances = new Set();
  static attachShadowPatched = false;
  static nativeAttachShadow = null;

  static installGlobalHooks() {
    if (MutationRecorderNextGen.attachShadowPatched || typeof Element === 'undefined') {
      return;
    }

    MutationRecorderNextGen.nativeAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function(init) {
      const root = MutationRecorderNextGen.nativeAttachShadow.call(this, init);
      for (const recorder of MutationRecorderNextGen.instances) {
        recorder.onShadowRootCreated(this, root, init || {});
      }
      return root;
    };

    MutationRecorderNextGen.attachShadowPatched = true;
  }

  constructor(options = {}) {
    MutationRecorderNextGen.installGlobalHooks();
    MutationRecorderNextGen.instances.add(this);

    this.options = {
      idleMs: 3000,
      recorderKind: 'custom-dom',
      recordMouseMoves: false,
      includeUndo: false,
      ignoreSelector: '[data-recorder-control]',
      ...options
    };

    this.reset();
  }

  reset() {
    this.isRecording = false;
    this.isApplying = false;
    this.target = null;
    this.context = {};
    this.nextClipNumber = 1;
    this.rootToId = new WeakMap();
    this.rootMeta = {};
    this.observers = [];
    this.listenerDisposers = [];
    this.listenerRoots = new WeakSet();
    this.handledGestureEvents = new WeakSet();
    this.handledFormEvents = new WeakSet();
    this.elementState = new WeakMap();
    this.events = [];
    this.clips = [];
    this.activeClip = null;
    this.currentPlaybackIndex = -1;
    this.idleTimer = null;
    this.baseline = null;
    this.startedAt = null;
    this.stoppedAt = null;
  }

  start(target = document.body, context = {}) {
    this.stop({ silent: true });
    this.reset();

    if (!(target instanceof Node)) {
      throw new Error('MutationRecorderNextGen.start requires a DOM Node target.');
    }

    this.target = target;
    this.context = context || {};
    this.startedAt = Date.now();
    this.baseline = this.serializeNode(target);
    this.rememberTreeState(target);
    this.observeTree(target);
    this.installGestureListeners(document);

    this.isRecording = true;
    this.pushSystemEvent('recording-started', {
      target: this.getNodeLocator(target),
      url: location.href
    });

    return this;
  }

  stop(options = {}) {
    this.flushPendingMutations();

    if (this.activeClip) {
      this.closeActiveClip('stop');
    }

    this.clearIdleTimer();
    this.disconnect();
    this.stoppedAt = Date.now();

    if (this.isRecording && !options.silent) {
      this.pushSystemEvent('recording-stopped', {});
    }

    this.isRecording = false;
    return this.exportRecording();
  }

  disconnect() {
    this.flushPendingMutations();

    for (const entry of this.observers) {
      entry.observer.disconnect();
    }
    this.observers = [];

    for (const dispose of this.listenerDisposers) {
      try { dispose(); } catch (error) {}
    }
    this.listenerDisposers = [];
  }

  observeTree(node) {
    const root = this.getObservationRoot(node);
    this.observeRoot(root, null, node);
    this.walk(node, current => {
      if (current.nodeType === Node.ELEMENT_NODE && current.shadowRoot) {
        this.observeShadowTree(current, current.shadowRoot, { mode: 'open', existing: true });
      }
    });
  }

  observeShadowTree(host, root, init = {}) {
    this.onShadowRootCreated(host, root, init);
    this.walk(root, current => {
      if (current.nodeType === Node.ELEMENT_NODE && current.shadowRoot) {
        this.observeShadowTree(current, current.shadowRoot, { mode: 'open', existing: true });
      }
    });
  }

  observeRoot(root, host = null, observeTarget = root) {
    if (!root || this.rootToId.has(root)) {
      return this.rootToId.get(root);
    }

    if (!observeTarget) {
      observeTarget = root;
    }

    const hostSelector = host ? this.selectorFor(host) : null;
    const rootId = hostSelector ? `shadow:${hostSelector}` : 'document';
    this.rootToId.set(root, rootId);
    this.rootMeta[rootId] = {
      id: rootId,
      kind: host ? 'shadow-root' : 'document',
      hostSelector,
      observedTarget: observeTarget === root ? null : this.getNodeLocator(observeTarget)
    };

    this.installGestureListeners(root);

    const observer = new MutationObserver(records => this.onMutations(records, rootId));
    observer.observe(observeTarget, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true
    });
    this.observers.push({ observer, rootId });
    return rootId;
  }

  onShadowRootCreated(host, root, init = {}) {
    if (!host || !root) {
      return;
    }

    const rootId = this.observeRoot(root, host);

    if (this.isRecording && !this.isApplying) {
      this.recordEvent({
        kind: 'mutation',
        type: 'shadowRoot',
        host: this.getNodeLocator(host),
        rootId,
        mode: init.mode || 'open',
        timestamp: Date.now()
      });
    }
  }

  onMutations(records) {
    if (!this.isRecording || this.isApplying) {
      return;
    }

    for (const record of records) {
      const event = this.serializeMutation(record);
      if (!event) {
        continue;
      }

      this.recordEvent(event);
    }
  }

  serializeMutation(record) {
    if (record.type === 'attributes') {
      return {
        kind: 'mutation',
        type: 'attributes',
        target: this.getNodeLocator(record.target),
        name: record.attributeName,
        namespace: record.attributeNamespace || null,
        oldValue: record.oldValue,
        newValue: record.target.getAttribute(record.attributeName),
        timestamp: Date.now()
      };
    }

    if (record.type === 'characterData') {
      return {
        kind: 'mutation',
        type: 'characterData',
        target: this.getNodeLocator(record.target),
        oldValue: record.oldValue,
        newValue: record.target.nodeValue,
        timestamp: Date.now()
      };
    }

    if (record.type === 'childList') {
      const adds = Array.from(record.addedNodes || [])
        .map(node => {
          const serialized = this.serializeNode(node);
          this.rememberTreeState(node);
          return {
            node: serialized,
            previousSibling: this.getNodeLocator(record.previousSibling),
            nextSibling: this.getNodeLocator(record.nextSibling)
          };
        });
      const removes = Array.from(record.removedNodes || [])
        .map(node => ({
          node: this.serializeNode(node),
          target: this.getNodeLocator(node),
          parent: this.getNodeLocator(record.target),
          previousSibling: this.getNodeLocator(record.previousSibling),
          nextSibling: this.getNodeLocator(record.nextSibling)
        }));

      if (!adds.length && !removes.length) {
        return null;
      }

      return {
        kind: 'mutation',
        type: 'childList',
        target: this.getNodeLocator(record.target),
        adds,
        removes,
        timestamp: Date.now()
      };
    }

    return null;
  }

  installGestureListeners(root) {
    if (!root || this.listenerRoots.has(root)) {
      return;
    }

    const listeners = [
      ['click', event => this.onHardGesture(event), true],
      ['dblclick', event => this.onHardGesture(event), true],
      ['keydown', event => this.onHardGesture(event), true],
      ['input', event => this.onFormStateEvent(event), true],
      ['change', event => this.onFormStateEvent(event), true],
      ['submit', event => this.onHardGesture(event), true],
      ['scroll', event => this.onActivity(event, { store: true, type: 'scroll' }), true],
      ['mousemove', event => this.onActivity(event, { store: this.options.recordMouseMoves, type: 'mousemove' }), true],
      ['pointermove', event => this.onActivity(event, { store: false, type: 'pointermove' }), true]
    ];

    for (const [type, handler, capture] of listeners) {
      root.addEventListener(type, handler, capture);
      this.listenerDisposers.push(() => root.removeEventListener(type, handler, capture));
    }

    this.listenerRoots.add(root);
  }

  onHardGesture(event) {
    if (!this.isRecording || this.isApplying || this.shouldIgnoreEvent(event)) {
      return;
    }

    if (this.handledGestureEvents.has(event)) {
      return;
    }
    this.handledGestureEvents.add(event);

    this.flushPendingMutations();

    const target = this.getComposedTarget(event);
    if (!this.isInsideTarget(target)) {
      return;
    }

    if (this.activeClip) {
      this.closeActiveClip('next-gesture');
    }

    const gesture = this.createGestureEvent(event, target);
    this.startClip(gesture);
    this.recordEvent(gesture);
    this.bumpActivity();
  }

  onFormStateEvent(event) {
    if (!this.isRecording || this.isApplying || this.shouldIgnoreEvent(event)) {
      return;
    }

    if (this.handledFormEvents.has(event)) {
      return;
    }
    this.handledFormEvents.add(event);

    this.flushPendingMutations();

    const target = this.getComposedTarget(event);
    if (!this.isInsideTarget(target)) {
      return;
    }

    if (!this.activeClip) {
      const gesture = this.createGestureEvent(event, target);
      this.startClip(gesture);
      this.recordEvent(gesture);
    }

    this.recordInputStateMutation(event, target);
    this.bumpActivity();
  }

  recordInputStateMutation(event, target) {
    if (!target || (event.type !== 'input' && event.type !== 'change')) {
      return;
    }

    const state = this.getFormState(target);
    if (!state) {
      return;
    }

    const oldState = this.elementState.get(target) || {};
    const oldValue = oldState.form ? oldState.form.value : undefined;
    const oldSelection = oldState.form ? oldState.form.selection : undefined;
    if (oldState.form && this.valuesEqual(oldValue, state.value) && this.valuesEqual(oldSelection, state.selection)) {
      return;
    }

    this.elementState.set(target, {
      ...oldState,
      form: this.cloneData(state)
    });

    this.recordEvent({
      kind: 'mutation',
      type: 'property',
      target: this.getNodeLocator(target),
      property: state.property,
      oldValue,
      newValue: state.value,
      value: state.value,
      oldSelection,
      newSelection: state.selection,
      timestamp: Date.now()
    });
  }

  onActivity(event, options = {}) {
    if (!this.isRecording || this.isApplying || !this.activeClip || this.shouldIgnoreEvent(event)) {
      return;
    }

    const target = this.getComposedTarget(event);
    if (!this.isInsideTarget(target)) {
      return;
    }

    this.bumpActivity();

    if (options.type === 'scroll') {
      this.recordScrollStateMutation(target);
    } else if (options.store) {
      this.recordEvent({
        kind: 'activity',
        type: options.type || event.type,
        target: this.getNodeLocator(target),
        x: event.clientX ?? null,
        y: event.clientY ?? null,
        timestamp: Date.now()
      });
    }
  }

  recordScrollStateMutation(target) {
    if (!target || !('scrollTop' in target) || !('scrollLeft' in target)) {
      return;
    }

    const state = {
      scrollTop: target.scrollTop,
      scrollLeft: target.scrollLeft
    };
    const oldState = this.elementState.get(target) || {};
    const previous = oldState.scroll || { scrollTop: 0, scrollLeft: 0 };
    if (previous.scrollTop === state.scrollTop && previous.scrollLeft === state.scrollLeft) {
      return;
    }

    this.elementState.set(target, {
      ...oldState,
      scroll: this.cloneData(state)
    });

    this.recordEvent({
      kind: 'mutation',
      type: 'scroll',
      target: this.getNodeLocator(target),
      oldValue: previous,
      newValue: state,
      timestamp: Date.now()
    });
  }

  flushPendingMutations() {
    if (this.isApplying) {
      return;
    }

    for (const entry of this.observers) {
      const records = entry.observer.takeRecords();
      if (records.length) {
        this.onMutations(records, entry.rootId);
      }
    }
  }

  shouldIgnoreEvent(event) {
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    return path.some(node => node?.nodeType === Node.ELEMENT_NODE && node.matches?.(this.options.ignoreSelector));
  }

  createGestureEvent(event, target) {
    const targetLocator = this.getNodeLocator(target);
    return {
      kind: 'gesture',
      type: event.type,
      target: targetLocator,
      selector: targetLocator?.selector || null,
      key: event.type === 'keydown' ? event.key : null,
      value: this.getGestureValue(event, target),
      x: event.clientX ?? null,
      y: event.clientY ?? null,
      timestamp: Date.now()
    };
  }

  getGestureValue(event, target) {
    if (!target || !('value' in target)) {
      return null;
    }

    if (target.type === 'password') {
      return null;
    }

    if (target.type === 'checkbox' || target.type === 'radio') {
      return !!target.checked;
    }

    return target.value;
  }

  startClip(gesture) {
    const clip = {
      id: `clip-${this.nextClipNumber}`,
      name: `Clip${this.nextClipNumber}`,
      trigger: {
        event: gesture.type,
        selector: gesture.selector,
        target: gesture.target,
        x: gesture.x,
        y: gesture.y,
        key: gesture.key
      },
      startTime: gesture.timestamp,
      endTime: null,
      eventRange: [this.events.length, null],
      events: [],
      meta: {
        status: 'suggested',
        mutationCount: 0,
        activityEndedBy: null,
        idleMs: this.options.idleMs
      }
    };

    this.nextClipNumber += 1;
    this.activeClip = clip;
    this.clips.push(clip);
    this.bumpActivity();
    return clip;
  }

  closeActiveClip(reason = 'idle') {
    if (!this.activeClip) {
      return null;
    }

    const clip = this.activeClip;
    clip.endTime = Date.now();
    clip.eventRange[1] = Math.max(clip.eventRange[0], this.events.length - 1);
    clip.meta.activityEndedBy = reason;
    this.activeClip = null;
    this.clearIdleTimer();

    if (!this.hasExportableMutations(clip)) {
      this.discardClip(clip);
      return null;
    }

    return clip;
  }

  hasExportableMutations(clip) {
    return !!clip && (clip.events || []).some(event => event.kind === 'mutation');
  }

  discardClip(clip) {
    const index = this.clips.indexOf(clip);
    if (index !== -1) {
      this.clips.splice(index, 1);
    }

    if (clip?.id === `clip-${this.nextClipNumber - 1}`) {
      this.nextClipNumber = Math.max(1, this.nextClipNumber - 1);
    }
  }

  bumpActivity() {
    this.clearIdleTimer();
    if (!this.activeClip) {
      return;
    }

    this.idleTimer = setTimeout(() => {
      this.closeActiveClip('idle');
    }, this.options.idleMs);
  }

  clearIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  recordEvent(event) {
    event.timestamp = event.timestamp || Date.now();
    const index = this.events.length;
    this.events.push(event);

    if (this.activeClip) {
      this.activeClip.events.push(event);
      this.activeClip.eventRange[1] = index;
      if (event.kind === 'mutation') {
        this.activeClip.meta.mutationCount += 1;
      }
    }

    if (event.kind === 'mutation') {
      this.bumpActivity();
    }

    return event;
  }

  pushSystemEvent(type, data = {}) {
    this.events.push({
      kind: 'system',
      type,
      data,
      timestamp: Date.now()
    });
  }

  playClip(clipOrId, options = {}) {
    const clip = typeof clipOrId === 'string'
      ? this.clips.find(item => item.id === clipOrId)
      : clipOrId;

    if (!clip) {
      console.warn('[MutationRecorderNextGen] clip not found:', clipOrId);
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
      this.clearRuntimeState();
      this.restoreElementFromSnapshot(this.target, this.baseline);
      this.rememberTreeState(this.target);
      this.observeTree(this.target);
    } finally {
      this.isApplying = false;
    }

    this.currentPlaybackIndex = -1;
  }

  clearRuntimeState() {
    this.rootToId = new WeakMap();
    this.rootMeta = {};
    this.elementState = new WeakMap();
    for (const observer of this.observers) {
      observer.observer.disconnect();
    }
    this.observers = [];
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
      return;
    }

    const root = host.shadowRoot || host.attachShadow({ mode: shadowSnapshot.mode || 'open' });
    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    for (const child of shadowSnapshot.children || []) {
      root.appendChild(this.deserializeNode(child));
    }
    this.onShadowRootCreated(host, root, { mode: shadowSnapshot.mode || 'open' });
  }

  serializeNode(node) {
    if (!node) {
      return null;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return {
        nodeType: Node.TEXT_NODE,
        textContent: node.nodeValue || ''
      };
    }

    if (node.nodeType === Node.COMMENT_NODE) {
      return {
        nodeType: Node.COMMENT_NODE,
        textContent: node.nodeValue || ''
      };
    }

    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE || node instanceof ShadowRoot) {
      return {
        nodeType: Node.DOCUMENT_FRAGMENT_NODE,
        children: Array.from(node.childNodes).map(child => this.serializeNode(child)).filter(Boolean)
      };
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return {
        nodeType: node.nodeType
      };
    }

    const attributes = {};
    for (const attr of Array.from(node.attributes || [])) {
      attributes[attr.name] = attr.value;
    }

    const data = {
      nodeType: Node.ELEMENT_NODE,
      tag: node.tagName.toLowerCase(),
      namespaceURI: node.namespaceURI || null,
      attributes,
      children: Array.from(node.childNodes).map(child => this.serializeNode(child)).filter(Boolean)
    };

    if (node.shadowRoot) {
      data.shadowRoot = {
        id: this.rootToId.get(node.shadowRoot) || `shadow:${this.selectorFor(node)}`,
        mode: 'open',
        children: Array.from(node.shadowRoot.childNodes).map(child => this.serializeNode(child)).filter(Boolean)
      };
    }

    return data;
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

  walk(node, callback) {
    if (!node) {
      return;
    }

    callback(node);

    const children = node.childNodes ? Array.from(node.childNodes) : [];
    for (const child of children) {
      this.walk(child, callback);
    }
  }

  rememberTreeState(node) {
    this.walk(node, current => {
      if (current.nodeType === Node.ELEMENT_NODE) {
        this.rememberElementState(current);
        if (current.shadowRoot) {
          this.rememberTreeState(current.shadowRoot);
        }
      }
    });
  }

  rememberElementState(element) {
    if (!(element instanceof Element)) {
      return;
    }

    const state = {};
    const form = this.getFormState(element);
    if (form) {
      state.form = this.cloneData(form);
    }
    if ('scrollTop' in element && 'scrollLeft' in element) {
      state.scroll = {
        scrollTop: element.scrollTop,
        scrollLeft: element.scrollLeft
      };
    }

    if (Object.keys(state).length) {
      this.elementState.set(element, state);
    }
  }

  getFormState(element) {
    if (!(element instanceof Element)) {
      return null;
    }

    if (element instanceof HTMLSelectElement) {
      if (element.multiple) {
        return {
          property: 'selectedValues',
          value: Array.from(element.selectedOptions || []).map(option => option.value),
          selection: { selectedIndex: element.selectedIndex }
        };
      }

      return {
        property: 'value',
        value: element.value,
        selection: { selectedIndex: element.selectedIndex }
      };
    }

    if (element instanceof HTMLInputElement && (element.type === 'checkbox' || element.type === 'radio')) {
      return {
        property: 'checked',
        value: !!element.checked
      };
    }

    if ('value' in element) {
      return {
        property: 'value',
        value: element.value,
        selection: this.getTextSelectionState(element)
      };
    }

    return null;
  }

  getTextSelectionState(element) {
    if (!element || typeof element.selectionStart !== 'number' || typeof element.selectionEnd !== 'number') {
      return undefined;
    }

    return this.compactObject({
      start: element.selectionStart,
      end: element.selectionEnd,
      direction: element.selectionDirection || undefined
    });
  }

  cloneData(value) {
    if (typeof structuredClone === 'function') {
      try {
        return structuredClone(value);
      } catch (error) {}
    }
    return JSON.parse(JSON.stringify(value));
  }

  valuesEqual(left, right) {
    if (left === right) {
      return true;
    }
    if (typeof left !== typeof right) {
      return false;
    }
    try {
      return JSON.stringify(left) === JSON.stringify(right);
    } catch (error) {
      return false;
    }
  }

  getNodeLocator(node) {
    if (!node) {
      return null;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (!this.isInsideTarget(node)) {
        return null;
      }
      return {
        kind: 'element',
        selector: this.selectorFor(node)
      };
    }

    const parent = node.parentElement || node.parentNode;
    if (parent && parent.nodeType === Node.ELEMENT_NODE) {
      return {
        kind: node.nodeType === Node.TEXT_NODE ? 'text' : 'node',
        selector: this.selectorFor(parent),
        childIndex: Array.prototype.indexOf.call(parent.childNodes, node),
        nodeType: node.nodeType,
        textHint: this.previewText(node.nodeValue || '')
      };
    }

    return null;
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

  selectorFor(node) {
    if (!(node instanceof Element)) {
      return null;
    }

    return this.serializeSelectorChain(this.buildSelectorChain(node));
  }

  buildSelectorChain(el) {
    const chain = [];
    let node = el;

    while (node && node.nodeType === Node.ELEMENT_NODE) {
      chain.unshift({ node, shadowBefore: false, piece: '' });

      if (node === document.body) {
        break;
      }

      if (node.parentElement) {
        node = node.parentElement;
      } else if (node.parentNode instanceof ShadowRoot) {
        chain[0].shadowBefore = true;
        node = node.parentNode.host;
      } else {
        node = null;
      }
    }

    chain.forEach(item => {
      item.piece = this.selectorPiece(item.node);
    });

    return chain;
  }

  serializeSelectorChain(chain) {
    return chain.map((item, index) => {
      if (index === 0) {
        return item.piece;
      }
      return `${item.shadowBefore ? ' >>> ' : ' > '}${item.piece}`;
    }).join('');
  }

  selectorPiece(node) {
    const tag = (node.tagName || '').toLowerCase();
    if (!tag) {
      return null;
    }

    if (node.id) {
      const escapedId = this.cssEscape(node.id);
      try {
        const root = node.getRootNode();
        if (root.querySelectorAll(`#${escapedId}`).length === 1) {
          return `${tag}#${escapedId}`;
        }
      } catch (error) {}
    }

    let index = 1;
    let sibling = node;
    while ((sibling = sibling.previousElementSibling)) {
      if (sibling.tagName === node.tagName) {
        index += 1;
      }
    }

    let hasMore = false;
    for (sibling = node.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
      if (sibling.tagName === node.tagName) {
        hasMore = true;
        break;
      }
    }

    return index === 1 && !hasMore ? tag : `${tag}:nth-of-type(${index})`;
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

  getObservationRoot(node) {
    if (!node) {
      return document;
    }
    const root = node.getRootNode ? node.getRootNode() : document;
    return root || document;
  }

  getComposedTarget(event) {
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    return path[0] || event.target;
  }

  isInsideTarget(node) {
    if (!this.target || !node) {
      return false;
    }

    if (node === this.target || this.target.contains?.(node)) {
      return true;
    }

    const pathRoot = node.getRootNode?.();
    if (pathRoot instanceof ShadowRoot) {
      return this.isInsideTarget(pathRoot.host);
    }

    return false;
  }

  previewText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  cssEscape(value) {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(String(value));
    }
    return String(value).replace(/["\\]/g, '\\$&');
  }

  exportRecording() {
    const recording = this.compactObject({
      version: 1,
      id: this.context.id || `recording-${this.startedAt || Date.now()}`,
      name: this.context.name || 'Untitled Recording',
      url: this.context.url || location.href,
      snapshotId: this.context.snapshotId || undefined,
      namespace: this.context.namespace || undefined,
      createdAt: this.startedAt ? new Date(this.startedAt).toISOString() : new Date().toISOString(),
      stoppedAt: this.stoppedAt ? new Date(this.stoppedAt).toISOString() : undefined,
      recorder: {
        kind: this.options.recorderKind,
        version: 1,
        undo: this.options.includeUndo ? true : undefined
      }
    });
    recording.clips = this.clips
      .filter(clip => this.hasExportableMutations(clip))
      .map(clip => this.exportClip(clip));
    return recording;
  }

  exportClip(clip) {
    const exportedClip = this.compactObject({
      id: clip.id,
      name: clip.name,
      trigger: this.exportTrigger(clip.trigger)
    });
    exportedClip.events = (clip.events || [])
      .filter(event => event.kind === 'mutation')
      .map(event => this.exportMutationEvent(event))
      .filter(Boolean);
    return exportedClip;
  }

  exportTrigger(trigger = {}) {
    return this.compactObject({
      event: trigger.event,
      target: this.exportLocator(trigger.target),
      key: trigger.key || undefined
    });
  }

  exportMutationEvent(event) {
    if (!event || event.kind !== 'mutation') {
      return null;
    }

    if (event.type === 'attributes') {
      return this.compactObject({
        type: event.type,
        target: this.exportLocator(event.target),
        name: event.name,
        namespace: event.namespace || undefined,
        oldValue: this.options.includeUndo ? event.oldValue : undefined,
        newValue: event.newValue
      });
    }

    if (event.type === 'characterData') {
      return this.compactObject({
        type: event.type,
        target: this.exportLocator(event.target),
        oldValue: this.options.includeUndo ? event.oldValue : undefined,
        newValue: event.newValue
      });
    }

    if (event.type === 'childList') {
      return this.compactObject({
        type: event.type,
        target: this.exportLocator(event.target),
        adds: (event.adds || []).map(item => this.exportChildListItem(item, false)).filter(Boolean),
        removes: (event.removes || []).map(item => this.exportChildListItem(item, true)).filter(Boolean)
      });
    }

    if (event.type === 'property') {
      return this.compactObject({
        type: event.type,
        target: this.exportLocator(event.target),
        property: event.property,
        oldValue: this.options.includeUndo ? event.oldValue : undefined,
        newValue: 'newValue' in event ? event.newValue : event.value,
        oldSelection: this.options.includeUndo ? event.oldSelection : undefined,
        newSelection: this.options.includeUndo ? event.newSelection : undefined
      });
    }

    if (event.type === 'scroll') {
      return this.compactObject({
        type: event.type,
        target: this.exportLocator(event.target),
        oldValue: this.options.includeUndo ? event.oldValue : undefined,
        newValue: event.newValue
      });
    }

    return null;
  }

  exportChildListItem(item, isRemove) {
    if (!item) {
      return null;
    }

    return this.compactObject({
      node: this.exportNodeSnapshot(item.node),
      target: isRemove ? this.exportLocator(item.target) : undefined,
      previousSibling: this.exportLocator(item.previousSibling),
      nextSibling: this.exportLocator(item.nextSibling)
    });
  }

  exportNodeSnapshot(node) {
    if (!node) {
      return undefined;
    }

    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE) {
      return {
        nodeType: node.nodeType,
        textContent: node.textContent || ''
      };
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      return this.compactObject({
        nodeType: node.nodeType,
        tag: node.tag,
        namespaceURI: node.namespaceURI && node.namespaceURI !== 'http://www.w3.org/1999/xhtml'
          ? node.namespaceURI
          : undefined,
        attributes: node.attributes && Object.keys(node.attributes).length ? node.attributes : undefined,
        children: (node.children || []).map(child => this.exportNodeSnapshot(child)).filter(Boolean),
        shadowRoot: node.shadowRoot ? this.exportShadowRootSnapshot(node.shadowRoot) : undefined
      });
    }

    if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      return this.compactObject({
        nodeType: node.nodeType,
        children: (node.children || []).map(child => this.exportNodeSnapshot(child)).filter(Boolean)
      });
    }

    return { nodeType: node.nodeType };
  }

  exportShadowRootSnapshot(shadowRoot) {
    if (!shadowRoot) {
      return undefined;
    }

    return this.compactObject({
      mode: shadowRoot.mode,
      children: (shadowRoot.children || []).map(child => this.exportNodeSnapshot(child)).filter(Boolean)
    });
  }

  exportLocator(locator) {
    if (!locator) {
      return undefined;
    }

    if (typeof locator === 'string') {
      return locator;
    }

    if (locator.kind === 'element') {
      return locator.selector || undefined;
    }

    return this.compactObject({
      selector: locator.selector,
      childIndex: locator.childIndex,
      nodeType: locator.nodeType,
      textHint: locator.textHint || undefined
    });
  }

  compactObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return value;
    }

    return Object.fromEntries(Object.entries(value).filter(([, entry]) => {
      if (typeof entry === 'undefined') {
        return false;
      }
      if (Array.isArray(entry) && entry.length === 0) {
        return false;
      }
      return true;
    }));
  }

  destroy() {
    this.stop({ silent: true });
    MutationRecorderNextGen.instances.delete(this);
  }
}

if (typeof window !== 'undefined') {
  window.MutationRecorderNextGen = MutationRecorderNextGen;
}
