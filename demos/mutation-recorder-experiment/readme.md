# Mutation Recorder NextGen Lab

This folder is the hardening lab for DemoGeeni's future `CustomDomRecorder` strategy. It records user-driven DOM changes as named clips, exports compact replay data, and supports open shadow roots, nested shadow roots, and dynamically created shadow-root components.

The important file is `mRecorderNextGen.js`. The surrounding `index.html` page is a stress harness for the recorder. `mRecorder.js` is the older spike kept for reference only.

## What This Recorder Is

`MutationRecorderNextGen` is a custom DOM mutation recorder designed for exported DemoGeeni HTML demos. It does not record video and it does not keep application JavaScript. Instead, it records the DOM mutations produced by a user gesture and replays those mutations later against a static snapshot.

The core model is:

```txt
recording
  clips[]
    trigger
    events[]  // mutation events only in exported JSON
```

Each clip is started by a hard user gesture such as `click`, `keydown`, `submit`, or `dblclick`. Form events such as `input` and `change` do not split clips; they record the latest control state inside the active clip, and only start a fallback clip when no gesture clip is active. Mutations that follow the gesture are grouped into the active clip until the next hard gesture or idle timeout. If a gesture produces no exportable mutations, the empty clip is discarded when it closes.

## Why This Exists For DemoGeeni

DemoGeeni already captures static HTML snapshots. This recorder adds a replay layer for interactions that are normally lost in a static export:

- dropdowns opening and closing
- modal insertion
- text updates
- attribute toggles
- list additions/removals
- input state changes
- open shadow-root mutations
- nested open shadow-root mutations
- dynamically inserted shadow-root components

A future DemoGeeni export can store this data in a `recordings.json` file and bind clips to triggers through runtime actions such as `PlayClipAction`.

## Running The Lab

From this folder:

```sh
http-server -o ./
```

Then use the recorder controls in the right pane:

1. Click `Start Recording`.
2. Interact with the stage.
3. Click `Stop`.
4. Inspect the generated JSON.
5. Click `Restore Baseline`, `Play Selected Clip`, or `Play All Clips`.

## Test Cases In The Harness

The lab intentionally includes several mutation patterns that DemoGeeni needs to survive:

- Light-DOM dropdown state changes.
- Light-DOM modal insertion and text changes.
- List insertion/removal with activity feed ordering.
- Attribute changes on ordinary elements.
- Undo payload fixtures for checkbox, text input, single select, multi-select, and scroll state.
- Open shadow-root note and badge mutations.
- Nested open shadow-root text mutation.
- Dynamic shadow dropdown insertion from a normal light-DOM button.
- Shadow dropdown option that opens a dynamic shadow-root modal component.
- Mutations inside that dynamic shadow modal.
- Nested shadow-root controls inside the dynamic shadow modal, including a second deeper shadow root.

The dynamic shadow dropdown flow is especially important:

```txt
light DOM button
  -> inserts shadow dropdown host
  -> user clicks option inside dropdown shadow root
  -> inserts shadow modal host
  -> user mutates text inside modal shadow root
  -> user mutates controls inside nested modal shadow roots
```

That flow exercises dynamic root discovery, `attachShadow()` patching, nested `>>>` selector paths, and replay of component host snapshots with open shadow trees.

## Programmatic Usage

Basic recording:

```js
const recorder = new MutationRecorderNextGen({
  idleMs: 3000,
  recorderKind: 'custom-dom',
  ignoreSelector: '[data-recorder-control]'
});

recorder.start(document.querySelector('#recording-stage'), {
  name: 'Checkout interactions',
  namespace: 'snapshots.Checkout',
  url: location.href,
  snapshotId: 'checkout-index7'
});

// User interacts with the page.

const recording = recorder.stop();
console.log(recording);
```

Replay:

```js
recorder.restoreBaseline();
recorder.playAllClips();
```

Replay one clip against the current DOM state:

```js
recorder.playClip('clip-2');
```

This is intentionally additive. If `clip-2` depends on DOM inserted by `clip-1`, play `clip-1` first or use `playAllClips()` from a restored baseline.

## Constructor Options

```js
new MutationRecorderNextGen({
  idleMs: 3000,
  recorderKind: 'custom-dom',
  recordMouseMoves: false,
  includeUndo: false,
  ignoreSelector: '[data-recorder-control]'
});
```

`idleMs` controls auto-closing the active clip after no meaningful activity.

`recorderKind` is exported as metadata. DemoGeeni can use it to route recordings to the matching playback strategy.

`recordMouseMoves` is available for diagnostics, but should stay `false` for exported demos unless there is a concrete need.

`includeUndo` adds reverse-playback payloads such as `oldValue`, `oldSelection`, and scroll old/new state. Keep it off for the leanest forward-only recordings. Turn it on when the editor/runtime needs future undo or timeline backtracking support.

`ignoreSelector` marks recorder UI that should not become part of the captured interaction. The harness uses `data-recorder-control` for the right-side controls.

## Public API

`start(target, context)` starts recording a target subtree. The target is usually the captured page root or snapshot stage. `context` can include `name`, `url`, `namespace`, and `snapshotId`.

`stop()` stops recording, flushes pending mutations, closes the active clip, disconnects observers, and returns the compact exported recording.

`exportRecording()` returns the current compact recording without stopping.

`restoreBaseline()` restores the target to the baseline snapshot captured at `start()`.

`playClip(clipOrId)` replays one clip against the current DOM.

`playClipAt(index)` replays one clip by zero-based index and moves the playback cursor to that index.

`playNextClip()` replays the clip after the current playback cursor and advances the cursor.

`getCurrentClipIndex()` returns the current playback cursor. It starts at `-1` and resets to `-1` after `restoreBaseline()`.

`playAllClips()` replays all clips in order. In the harness, the UI restores baseline first before calling this.

`destroy()` stops and removes the recorder instance from global shadow-root hooks.

## Exported JSON Shape

The exported shape is intentionally compact. It omits recorder internals, duplicated top-level event lists, root metadata, viewport data, timestamps per mutation, old values, and derived counts.

Example shape:

```json
{
  "version": 1,
  "id": "recording-1781796318373",
  "name": "Mutation Recorder Lab",
  "url": "http://127.0.0.1:8084/",
  "namespace": "demos.mutationRecorderExperiment",
  "createdAt": "2026-06-18T15:25:18.373Z",
  "stoppedAt": "2026-06-18T15:25:25.689Z",
  "recorder": {
    "kind": "custom-dom",
    "version": 1
  },
  "clips": [
    {
      "id": "clip-1",
      "name": "Clip1",
      "trigger": {
        "event": "click",
        "target": "body > main > section > div#recording-stage > button#example"
      },
      "events": [
        {
          "type": "attributes",
          "target": "body > main > section > div#recording-stage > div#panel",
          "name": "open",
          "newValue": ""
        }
      ]
    }
  ]
}
```

## Mutation Event Types

Attribute mutation:

```json
{
  "type": "attributes",
  "target": "body > main > section > div#panel",
  "name": "open",
  "newValue": ""
}
```

If `newValue` is omitted, replay removes that attribute.

Character data mutation:

```json
{
  "type": "characterData",
  "target": {
    "selector": "body > main > section > p#copy",
    "childIndex": 0,
    "nodeType": 3
  },
  "newValue": "Updated text"
}
```

Property mutation, used for input/change state:

```json
{
  "type": "property",
  "target": "body > main > input#name",
  "property": "value",
  "newValue": "Jason"
}
```

Child list mutation:

```json
{
  "type": "childList",
  "target": "body > main > ul#items",
  "adds": [
    {
      "node": {
        "nodeType": 1,
        "tag": "li",
        "children": [
          { "nodeType": 3, "textContent": "New item" }
        ]
      },
      "previousSibling": "body > main > ul#items > li:nth-of-type(1)"
    }
  ],
  "removes": []
}
```

## Undo Payloads

When `includeUndo: true` is enabled, mutation events include enough old/new state for a future reverse player or editor timeline.

Attributes and text include `oldValue` and `newValue`.

Property mutations include `oldValue` and `newValue`. Text inputs may also include `oldSelection` and `newSelection`:

```json
{
  "type": "property",
  "target": "body > main > input#name",
  "property": "value",
  "oldValue": "Jason",
  "newValue": "Jason Smith",
  "oldSelection": { "start": 5, "end": 5 },
  "newSelection": { "start": 11, "end": 11 }
}
```

Checkboxes and radios use `property: "checked"`. Single selects use `property: "value"` and include selected-index selection metadata. Multi-select controls use `property: "selectedValues"` with an array of selected option values.

Scroll changes are recorded as mutation events when scroll state changes:

```json
{
  "type": "scroll",
  "target": "body > main > div#scroll-panel",
  "oldValue": { "scrollTop": 0, "scrollLeft": 0 },
  "newValue": { "scrollTop": 240, "scrollLeft": 0 }
}
```

Child-list mutations already carry forward and reverse material: added node snapshots, removed node snapshots, parent target, and sibling anchors. Undoing an add means removing the added snapshot. Undoing a remove means reinserting the removed snapshot at its recorded boundary.

## Locators

Element locators are reverse selector paths from `body` to the target:

```txt
body > main > section > div#recording-stage > button#open-modal
```

Open shadow roots are crossed with `>>>`:

```txt
body > main > section > div#shadow-host >>> div > button#shadow-toggle
```

Nested shadow roots chain multiple `>>>` boundaries:

```txt
body > main > section > div#shadow-host >>> div > div#nested-shadow-host >>> div > button#nested-change
```

Text and comment nodes cannot be returned by `querySelector()`, so they use a parent selector plus child index:

```json
{
  "selector": "body > main > p#summary",
  "childIndex": 0,
  "nodeType": 3,
  "textHint": "Ready for recording."
}
```

`textHint` is optional and used as a fallback when child indexes drift.

## Shadow DOM Behavior

The recorder supports open shadow roots. It discovers existing open shadow roots at `start()` and patches `Element.prototype.attachShadow` so newly created roots are observed too.

It also recursively discovers shadow roots inside other shadow roots. This is required for arc-kernel style components that render nested shadow trees.

Closed shadow roots are not a reliable replay target unless the recorder observes them from creation time and keeps a reference. This lab focuses on open roots because that is what the current DemoGeeni export model can inspect and serialize.

When a new host with an open shadow root is inserted, the serialized node snapshot can include:

```json
{
  "nodeType": 1,
  "tag": "div",
  "attributes": {
    "id": "dynamic-shadow-modal-host"
  },
  "shadowRoot": {
    "mode": "open",
    "children": []
  }
}
```

That larger snapshot is intentional. It is how replay can recreate a dynamically inserted component host and its initial shadow DOM without the original application JavaScript.

## Clip Semantics

A selected clip replays against the current DOM. This lets later clips depend on earlier clips.

Example:

```txt
Clip1 opens modal
Clip2 changes modal text
```

`Clip2` only works after `Clip1` has created the modal. This is correct for timeline playback.

For deterministic full playback, restore the baseline and play all clips in order:

```js
recorder.restoreBaseline();
recorder.playAllClips();
```

## DemoGeeni Integration Notes

Recommended architecture:

```txt
DomRecorderStrategy
  -> CustomDomRecorder      // default
  -> RrwebRecorder          // optional future strategy
```

Suggested DemoGeeni pieces:

- A left-toolbar `DomRecorder` plugin to start/stop recording against the active page webview.
- A preload bridge that injects or owns `MutationRecorderNextGen` inside the captured page context.
- A `recordings.json` file stored beside `snapshots.json` and `triggers.json`.
- A playback editor pane for renaming recordings and clips.
- A runtime `PlayClipAction` that loads a clip and calls the mutation player.
- Trigger binding that maps click/key/input events to `PlayClipAction`.

A possible `recordings.json` container:

```json
{
  "version": 1,
  "recordings": [
    {
      "id": "recording-1781796318373",
      "snapshotId": "index7",
      "url": "http://localhost:8083/demo.html",
      "clips": []
    }
  ]
}
```

For export/runtime, the mutation player does not need the full recorder class. It only needs:

- selector resolution with `>>>`
- node deserialization
- mutation application
- baseline restore supplied by the snapshot runtime

## What Is Intentionally Not Exported

The compact recording omits:

- top-level duplicate `events`
- internal observed root metadata
- viewport metadata
- per-mutation timestamps
- derived mutation counts
- clip `eventRange`
- clip `startTime` and `endTime`
- gesture events inside `clip.events`

Old values are omitted by default, but are exported when `includeUndo: true` is enabled.

If any of those become useful later, add them deliberately under a clear diagnostic or editor-only section rather than mixing them into the replay schema.

## Known Hard Parts

- Replaying events out of order may fail if a later clip depends on DOM created by an earlier clip.
- Selectors can drift if the static snapshot structure changes after recording.
- Whitespace text nodes are faithfully captured because they affect child indexes; future optimization may compress them where safe.
- Event listeners are not replayed. The recorder replays resulting DOM mutations, not application behavior.
- Closed shadow roots remain a special case.

## Current Status

This POC is strong enough to guide DemoGeeni integration, but it should still be treated as a lab artifact until moved behind a real `CustomDomRecorder` strategy module and paired with a runtime `PlayClipAction`.
