import { identifyAdapter } from './adapters.js';
import { GCButton, GCAxis, ALL_BUTTONS, ALL_AXES } from './buttons.js';
import { getMapping } from './mappings.js';
import { GCState } from './state.js';

const DEFAULTS = Object.freeze({
  deadzone: 0.15,
  triggerThreshold: 0.5,
  smoothing: false,
  smoothFactor: 0.5,
  autoStart: true,
  debug: false,
});

export class Mino {
  constructor(options = {}) {
    this._opts = { ...DEFAULTS, ...options };
    this._slots = new Map();
    this._listeners = new Map();
    this._polling = false;
    this._rafId = null;

    this._onConnect = (e) => this._handleConnect(e.gamepad);
    this._onDisconnect = (e) => this._handleDisconnect(e.gamepad);
    window.addEventListener('gamepadconnected', this._onConnect);
    window.addEventListener('gamepaddisconnected', this._onDisconnect);

    this._scanExisting();
    if (this._opts.autoStart) this.startPolling();
  }

  // Connection

  _scanExisting() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of gamepads) {
      if (gp) this._handleConnect(gp);
    }
  }

  _handleConnect(gamepad) {
    const result = identifyAdapter(gamepad);
    const adapterInfo = result
      ? result.adapter
      : { name: 'Unknown Adapter', mapping: gamepad.mapping === 'standard' ? 'standard' : 'generic' };

    const mapping = getMapping(adapterInfo.mapping);
    const state = new GCState();
    state.connected = true;

    this._slots.set(gamepad.index, {
      adapter: adapterInfo, mapping, state, prevState: new GCState(), gamepad,
    });

    if (this._opts.debug) console.log(`[mino.js] Connected: ${adapterInfo.name} (port ${gamepad.index})`);
    this._emit('connect', { port: gamepad.index, adapter: adapterInfo.name, gamepad });
  }

  _handleDisconnect(gamepad) {
    const slot = this._slots.get(gamepad.index);
    if (!slot) return;
    slot.state.connected = false;
    this._slots.delete(gamepad.index);
    if (this._opts.debug) console.log(`[mino.js] Disconnected: ${slot.adapter.name} (port ${gamepad.index})`);
    this._emit('disconnect', { port: gamepad.index, adapter: slot.adapter.name });
  }

  // Polling

  startPolling() {
    if (this._polling) return;
    this._polling = true;
    this._poll();
  }

  stopPolling() {
    this._polling = false;
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
  }

  _poll() {
    if (!this._polling) return;
    this._rafId = requestAnimationFrame(() => this._poll());
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of gamepads) {
      if (!gp) continue;
      const slot = this._slots.get(gp.index);
      if (slot) { slot.gamepad = gp; this._readState(slot); }
    }
  }

  // State reading

  _readState(slot) {
    const { gamepad, mapping, state, prevState } = slot;

    for (const btn of ALL_BUTTONS) prevState.buttons[btn] = state.buttons[btn];
    for (const axis of ALL_AXES) prevState.axes[axis] = state.axes[axis];

    for (const [gcBtn, rawIndex] of Object.entries(mapping.buttons)) {
      if (rawIndex < gamepad.buttons.length) {
        state.buttons[gcBtn] = gamepad.buttons[rawIndex].pressed;
      }
    }

    for (const [gcAxis, config] of Object.entries(mapping.axes)) {
      if (config.index < gamepad.axes.length) {
        let value = gamepad.axes[config.index];
        if (config.invert) value = -value;

        if (config.range === 'trigger') {
          if (value < 0) value = (value + 1) / 2;
          value = Math.max(0, Math.min(1, value));
        }

        if (config.range === 'full') value = this._applyDeadzone(value);

        if (this._opts.smoothing) {
          value = (prevState.axes[gcAxis] || 0) + (value - (prevState.axes[gcAxis] || 0)) * this._opts.smoothFactor;
        }

        state.axes[gcAxis] = value;
      }
    }

    // L/R digital from analog trigger
    if (!state.buttons[GCButton.L] && state.axes[GCAxis.L_ANALOG] >= this._opts.triggerThreshold) state.buttons[GCButton.L] = true;
    if (!state.buttons[GCButton.R] && state.axes[GCAxis.R_ANALOG] >= this._opts.triggerThreshold) state.buttons[GCButton.R] = true;

    // Edge detection
    for (const btn of ALL_BUTTONS) {
      const now = state.buttons[btn], was = prevState.buttons[btn];
      if (now && !was) this._emit('press', { port: slot.gamepad.index, button: btn });
      else if (!now && was) this._emit('release', { port: slot.gamepad.index, button: btn });
    }

    this._emit('poll', { port: slot.gamepad.index, state });
  }

  _applyDeadzone(value) {
    const dz = this._opts.deadzone;
    if (Math.abs(value) < dz) return 0;
    const sign = value > 0 ? 1 : -1;
    return sign * (Math.abs(value) - dz) / (1 - dz);
  }

  // Public API

  getState(port) {
    if (port === undefined) {
      for (const slot of this._slots.values()) return slot.state;
      return null;
    }
    const slot = this._slots.get(port);
    return slot ? slot.state : null;
  }

  getAllStates() {
    const result = [];
    for (const [index, slot] of this._slots) {
      result.push({ port: index, adapter: slot.adapter.name, state: slot.state });
    }
    return result;
  }

  justPressed(button, port) {
    const slot = this._getSlot(port);
    return slot ? slot.state.buttons[button] && !slot.prevState.buttons[button] : false;
  }

  justReleased(button, port) {
    const slot = this._getSlot(port);
    return slot ? !slot.state.buttons[button] && slot.prevState.buttons[button] : false;
  }

  isHeld(button, port) {
    const slot = this._getSlot(port);
    return slot ? !!slot.state.buttons[button] : false;
  }

  get connectedCount() { return this._slots.size; }

  get controllers() {
    const result = [];
    for (const [index, slot] of this._slots) {
      result.push({ port: index, adapter: slot.adapter.name, id: slot.gamepad.id });
    }
    return result;
  }

  _getSlot(port) {
    if (port !== undefined) return this._slots.get(port) || null;
    for (const slot of this._slots.values()) return slot;
    return null;
  }

  // Configuration

  setDeadzone(value) { this._opts.deadzone = Math.max(0, Math.min(1, value)); }
  setTriggerThreshold(value) { this._opts.triggerThreshold = Math.max(0, Math.min(1, value)); }

  setSmoothing(enabled, factor) {
    this._opts.smoothing = enabled;
    if (factor !== undefined) this._opts.smoothFactor = Math.max(0.01, Math.min(1, factor));
  }

  get options() { return { ...this._opts }; }

  // Events

  on(event, callback) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const set = this._listeners.get(event);
    if (set) set.delete(callback);
  }

  once(event, callback) {
    const wrapper = (...args) => { this.off(event, wrapper); callback(...args); };
    return this.on(event, wrapper);
  }

  _emit(event, data) {
    const set = this._listeners.get(event);
    if (set) {
      for (const cb of set) {
        try { cb(data); } catch (e) { console.error(`[mino.js] Error in '${event}' handler:`, e); }
      }
    }
  }

  // Vibration

  async vibrate(port, options = {}) {
    const slot = this._getSlot(port);
    if (!slot) return;
    const gp = slot.gamepad;
    if (gp.vibrationActuator) {
      try {
        await gp.vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: options.duration || 200,
          weakMagnitude: options.weakMagnitude || 0.5,
          strongMagnitude: options.strongMagnitude || 0.8,
        });
      } catch { /* not supported */ }
    }
  }

  // Cleanup

  destroy() {
    this.stopPolling();
    window.removeEventListener('gamepadconnected', this._onConnect);
    window.removeEventListener('gamepaddisconnected', this._onDisconnect);
    this._slots.clear();
    this._listeners.clear();
  }
}
