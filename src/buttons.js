export const GCButton = Object.freeze({
  A: 'A', B: 'B', X: 'X', Y: 'Y', Z: 'Z',
  L: 'L', R: 'R', START: 'START',
  DPAD_UP: 'DPAD_UP', DPAD_DOWN: 'DPAD_DOWN',
  DPAD_LEFT: 'DPAD_LEFT', DPAD_RIGHT: 'DPAD_RIGHT',
});

export const GCAxis = Object.freeze({
  MAIN_X: 'MAIN_X', MAIN_Y: 'MAIN_Y',
  C_X: 'C_X', C_Y: 'C_Y',
  L_ANALOG: 'L_ANALOG', R_ANALOG: 'R_ANALOG',
});

export const ALL_BUTTONS = Object.values(GCButton);
export const ALL_AXES    = Object.values(GCAxis);

export const BUTTON_LABELS = Object.freeze({
  [GCButton.A]: 'A', [GCButton.B]: 'B', [GCButton.X]: 'X', [GCButton.Y]: 'Y',
  [GCButton.Z]: 'Z', [GCButton.L]: 'L', [GCButton.R]: 'R',
  [GCButton.START]: 'Start',
  [GCButton.DPAD_UP]: 'D-Up', [GCButton.DPAD_DOWN]: 'D-Down',
  [GCButton.DPAD_LEFT]: 'D-Left', [GCButton.DPAD_RIGHT]: 'D-Right',
});

export const AXIS_LABELS = Object.freeze({
  [GCAxis.MAIN_X]: 'Main Stick X', [GCAxis.MAIN_Y]: 'Main Stick Y',
  [GCAxis.C_X]: 'C-Stick X', [GCAxis.C_Y]: 'C-Stick Y',
  [GCAxis.L_ANALOG]: 'L Trigger', [GCAxis.R_ANALOG]: 'R Trigger',
});
