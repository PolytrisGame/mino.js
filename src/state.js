import { GCButton, GCAxis, ALL_BUTTONS } from './buttons.js';

export class GCState {
  constructor() {
    this.buttons = {};
    for (const btn of ALL_BUTTONS) this.buttons[btn] = false;
    this.axes = {
      [GCAxis.MAIN_X]: 0, [GCAxis.MAIN_Y]: 0,
      [GCAxis.C_X]: 0, [GCAxis.C_Y]: 0,
      [GCAxis.L_ANALOG]: 0, [GCAxis.R_ANALOG]: 0,
    };
    this.connected = false;
  }

  isPressed(button) { return !!this.buttons[button]; }

  get mainStick() { return { x: this.axes[GCAxis.MAIN_X], y: this.axes[GCAxis.MAIN_Y] }; }
  get cStick()    { return { x: this.axes[GCAxis.C_X], y: this.axes[GCAxis.C_Y] }; }
  get leftTrigger()  { return this.axes[GCAxis.L_ANALOG]; }
  get rightTrigger() { return this.axes[GCAxis.R_ANALOG]; }

  get mainStickAngle()     { return Math.atan2(this.axes[GCAxis.MAIN_Y], this.axes[GCAxis.MAIN_X]); }
  get mainStickMagnitude() { return Math.min(1, Math.hypot(this.axes[GCAxis.MAIN_X], this.axes[GCAxis.MAIN_Y])); }
  get cStickAngle()        { return Math.atan2(this.axes[GCAxis.C_Y], this.axes[GCAxis.C_X]); }
  get cStickMagnitude()    { return Math.min(1, Math.hypot(this.axes[GCAxis.C_X], this.axes[GCAxis.C_Y])); }

  mainStickDirection(deadzone = 0.5) {
    return _stickDirection(this.axes[GCAxis.MAIN_X], this.axes[GCAxis.MAIN_Y], deadzone);
  }

  cStickDirection(deadzone = 0.5) {
    return _stickDirection(this.axes[GCAxis.C_X], this.axes[GCAxis.C_Y], deadzone);
  }

  clone() {
    const copy = new GCState();
    copy.connected = this.connected;
    for (const btn of ALL_BUTTONS) copy.buttons[btn] = this.buttons[btn];
    for (const axis of Object.keys(this.axes)) copy.axes[axis] = this.axes[axis];
    return copy;
  }

  toJSON() {
    return { connected: this.connected, buttons: { ...this.buttons }, axes: { ...this.axes } };
  }
}

function _stickDirection(x, y, deadzone) {
  if (Math.abs(x) < deadzone && Math.abs(y) < deadzone) return null;
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  if (angle >= -22.5 && angle < 22.5)    return 'right';
  if (angle >= 22.5 && angle < 67.5)     return 'down-right';
  if (angle >= 67.5 && angle < 112.5)    return 'down';
  if (angle >= 112.5 && angle < 157.5)   return 'down-left';
  if (angle >= 157.5 || angle < -157.5)  return 'left';
  if (angle >= -157.5 && angle < -112.5) return 'up-left';
  if (angle >= -112.5 && angle < -67.5)  return 'up';
  if (angle >= -67.5 && angle < -22.5)   return 'up-right';
  return null;
}
