# Mutation Recorder NextGen Experiment

This folder is a hardening lab for DemoGeeni's future `CustomDomRecorder`.

Open:

```txt
Arc2D/demos/mutation-recorder-experiment/index.html
```

or through a local static server.

## Files

- `index.html` - interactive recorder lab with dropdowns, modal insertion, input changes, list mutations, and nested open shadow roots.
- `mRecorderNextGen.js` - custom DOM recorder proof of concept.
- `mRecorder.js` - older recorder spike kept for reference.

## What The NextGen Recorder Tests

- Reverse selector locators from target back to `body`, including `>>>` shadow-root boundaries.
- Text/comment fallback locators using parent selector plus child index.
- DOM mutation recording:
  - attributes
  - characterData
  - childList additions
  - childList removals
  - input/change property state
- Gesture-based clip creation.
- Auto clip names: `Clip1`, `Clip2`, `Clip3`.
- Three-second idle clip ending.
- Next hard gesture starts a new clip.
- Baseline restore.
- Clip replay against restored DOM.
- Open shadow root observation.
- Nested open shadow root observation.
- `attachShadow()` patching for newly created roots.

## Test Flow

1. Click `Start Recording`.
2. Interact with the stage:
   - open the custom dropdown
   - add pills
   - change text
   - toggle attributes
   - open/close modal
   - click shadow-root buttons
3. Click `Stop`.
4. Click `Restore Baseline`.
5. Play one clip or all clips.
6. Inspect the generated JSON on the right.

## Design Direction

This POC is intentionally not rrweb-based. It is the first iteration of the custom strategy described in DemoGeeni's DOM recorder design document:

```txt
DemoGeeni/DESIGN_GOALS_ARCHITECTURE_NOTES/designs/dom-recorder-recordings-design.md
```

The long-term goal is to move the hardened recorder into DemoGeeni behind a swappable recorder strategy interface:

```txt
DomRecorderStrategy
  -> CustomDomRecorder
  -> RrwebRecorder
```
