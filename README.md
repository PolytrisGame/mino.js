# mino.js

GameCube controller library for JavaScript. Plug in any GameCube adapter and get normalized, event-driven input in the browser — zero dependencies, ~5 KB minified.

## Features

- **Adapter auto-detection** — Nintendo WUP-028, Mayflash, Raphnet, 8BitDo GBros, Brook, and generic USB adapters
- **Normalized state** — every adapter maps to the same `GCButton` / `GCAxis` constants
- **Edge-detected events** — `press`, `release`, `connect`, `disconnect`
- **Full analog support** — main stick, C-stick, L/R trigger analog values with configurable deadzone
- **8-way stick direction** — `mainStickDirection()` / `cStickDirection()` helpers
- **Vibration** — rumble support (where the browser/adapter allows)
- **Zero dependencies** — pure W3C Gamepad API

## Install

```bash
npm install mino.js
```

Or use a CDN:

```html
<script src="https://unpkg.com/mino.js/dist/mino.min.js"></script>
```

## Quick Start

```js
import { Mino, GCButton } from 'mino.js';

const gc = new Mino();

// Listen for button presses
gc.on('press', ({ port, button }) => {
  console.log(`Port ${port}: ${button} pressed`);
});

gc.on('release', ({ port, button }) => {
  console.log(`Port ${port}: ${button} released`);
});

// Connection events
gc.on('connect', ({ port, adapter }) => {
  console.log(`Controller connected on port ${port} (${adapter})`);
});

// Poll loop — read state every frame
gc.on('poll', ({ port, state }) => {
  const { x, y } = state.mainStick;
  // Move character by (x, y)

  if (state.isPressed(GCButton.A)) {
    // A is held
  }
});
```

## API

### `new Mino(options?)`

Create a new GameCube controller manager.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `deadzone` | `number` | `0.15` | Stick deadzone (0–1) |
| `triggerThreshold` | `number` | `0.5` | Analog trigger → digital press threshold |
| `smoothing` | `boolean` | `false` | Enable low-pass filter on stick axes |
| `smoothFactor` | `number` | `0.5` | Smoothing strength (lower = smoother) |
| `autoStart` | `boolean` | `true` | Auto-start polling on construction |
| `debug` | `boolean` | `false` | Log adapter connections to console |

### Reading State

```js
// Get state for first connected controller
const state = gc.getState();

// Get state for a specific port
const state = gc.getState(0);

// All states
const all = gc.getAllStates();
// → [{ port: 0, adapter: 'Nintendo WUP-028', state: GCState }]
```

### `GCState` Properties

| Property | Type | Description |
|----------|------|-------------|
| `buttons` | `Record<GCButton, boolean>` | All 12 button states |
| `axes` | `Record<GCAxis, number>` | All 6 axis values |
| `mainStick` | `{ x, y }` | Main stick (−1 to +1) |
| `cStick` | `{ x, y }` | C-stick (−1 to +1) |
| `leftTrigger` | `number` | L trigger analog (0–1) |
| `rightTrigger` | `number` | R trigger analog (0–1) |
| `mainStickAngle` | `number` | Main stick angle (radians) |
| `mainStickMagnitude` | `number` | Main stick distance (0–1) |
| `connected` | `boolean` | Connection status |

### Methods

| Method | Description |
|--------|-------------|
| `isPressed(button)` | Check if button is held |
| `mainStickDirection(deadzone?)` | 8-way direction string or null |
| `cStickDirection(deadzone?)` | 8-way direction string or null |
| `clone()` | Deep copy state |
| `toJSON()` | Serialize to plain object |

### Frame-Perfect Queries

```js
// Did the button JUST go down this frame?
if (gc.justPressed(GCButton.A)) { /* jump */ }

// Did it JUST go up?
if (gc.justReleased(GCButton.B)) { /* release charge */ }

// Is it currently held?
if (gc.isHeld(GCButton.Z)) { /* shield */ }
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `connect` | `{ port, adapter, gamepad }` | Controller plugged in |
| `disconnect` | `{ port, adapter }` | Controller unplugged |
| `press` | `{ port, button }` | Button just pressed |
| `release` | `{ port, button }` | Button just released |
| `poll` | `{ port, state }` | Every frame (RAF) |

```js
const unsub = gc.on('press', handler);
unsub(); // remove listener

gc.once('connect', handler); // fire once
gc.off('press', handler);    // manual remove
```

### Configuration

```js
gc.setDeadzone(0.2);
gc.setTriggerThreshold(0.4);
gc.setSmoothing(true, 0.3);
```

### Vibration

```js
gc.vibrate(0, {
  duration: 300,       // ms
  weakMagnitude: 0.5,  // 0–1
  strongMagnitude: 1.0 // 0–1
});
```

### Lifecycle

```js
gc.startPolling();  // begin RAF loop
gc.stopPolling();   // pause
gc.destroy();       // full cleanup
```

## Button Constants

```js
import { GCButton, GCAxis } from 'mino.js';

GCButton.A            GCButton.DPAD_UP
GCButton.B            GCButton.DPAD_DOWN
GCButton.X            GCButton.DPAD_LEFT
GCButton.Y            GCButton.DPAD_RIGHT
GCButton.Z            GCButton.L
GCButton.START        GCButton.R

GCAxis.MAIN_X         GCAxis.C_X
GCAxis.MAIN_Y         GCAxis.C_Y
GCAxis.L_ANALOG       GCAxis.R_ANALOG
```

## Supported Adapters

| Adapter | Detection | Status |
|---------|-----------|--------|
| Nintendo WUP-028 (Official) | VID `057e` PID `0337` | ✅ Full support |
| Mayflash 4-Port (PC Mode) | VID `0079` PID `1844` | ✅ Full support |
| Mayflash 4-Port (Wii U Mode) | VID `0079` PID `1800` | ✅ Full support |
| Raphnet Technologies | VID `289b` | ✅ Full support |
| 8BitDo GBros Wireless | VID `2dc8` | ✅ Standard mapping |
| Brook Super Converter | Name match | ✅ Standard mapping |
| Generic USB GC Adapter | Fallback | ⚠️ Best-effort |

## Browser Support

Any browser implementing the [W3C Gamepad API](https://w3c.github.io/gamepad/):
- Chrome 21+
- Firefox 29+
- Edge 12+
- Safari 10.1+
- Opera 15+

## License

MIT
