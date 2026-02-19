import { GCButton, GCAxis } from './buttons.js';

const nintendo = {
  buttons: {
    [GCButton.A]: 0, [GCButton.B]: 1, [GCButton.X]: 2, [GCButton.Y]: 3,
    [GCButton.Z]: 7, [GCButton.L]: 4, [GCButton.R]: 5, [GCButton.START]: 9,
    [GCButton.DPAD_UP]: 12, [GCButton.DPAD_DOWN]: 13, [GCButton.DPAD_LEFT]: 14, [GCButton.DPAD_RIGHT]: 15,
  },
  axes: {
    [GCAxis.MAIN_X]:   { index: 0, invert: false, range: 'full' },
    [GCAxis.MAIN_Y]:   { index: 1, invert: false, range: 'full' },
    [GCAxis.C_X]:      { index: 2, invert: false, range: 'full' },
    [GCAxis.C_Y]:      { index: 3, invert: false, range: 'full' },
    [GCAxis.L_ANALOG]: { index: 4, invert: false, range: 'trigger' },
    [GCAxis.R_ANALOG]: { index: 5, invert: false, range: 'trigger' },
  },
};

const mayflash = {
  buttons: {
    [GCButton.A]: 1, [GCButton.B]: 2, [GCButton.X]: 0, [GCButton.Y]: 3,
    [GCButton.Z]: 7, [GCButton.L]: 4, [GCButton.R]: 5, [GCButton.START]: 9,
    [GCButton.DPAD_UP]: 12, [GCButton.DPAD_DOWN]: 13, [GCButton.DPAD_LEFT]: 14, [GCButton.DPAD_RIGHT]: 15,
  },
  axes: {
    [GCAxis.MAIN_X]:   { index: 0, invert: false, range: 'full' },
    [GCAxis.MAIN_Y]:   { index: 1, invert: false, range: 'full' },
    [GCAxis.C_X]:      { index: 2, invert: false, range: 'full' },
    [GCAxis.C_Y]:      { index: 3, invert: false, range: 'full' },
    [GCAxis.L_ANALOG]: { index: 4, invert: false, range: 'trigger' },
    [GCAxis.R_ANALOG]: { index: 5, invert: false, range: 'trigger' },
  },
};

const raphnet = {
  buttons: {
    [GCButton.A]: 0, [GCButton.B]: 1, [GCButton.X]: 2, [GCButton.Y]: 3,
    [GCButton.Z]: 5, [GCButton.L]: 6, [GCButton.R]: 7, [GCButton.START]: 9,
    [GCButton.DPAD_UP]: 12, [GCButton.DPAD_DOWN]: 13, [GCButton.DPAD_LEFT]: 14, [GCButton.DPAD_RIGHT]: 15,
  },
  axes: {
    [GCAxis.MAIN_X]:   { index: 0, invert: false, range: 'full' },
    [GCAxis.MAIN_Y]:   { index: 1, invert: true,  range: 'full' },
    [GCAxis.C_X]:      { index: 2, invert: false, range: 'full' },
    [GCAxis.C_Y]:      { index: 3, invert: true,  range: 'full' },
    [GCAxis.L_ANALOG]: { index: 4, invert: false, range: 'trigger' },
    [GCAxis.R_ANALOG]: { index: 5, invert: false, range: 'trigger' },
  },
};

const standard = {
  buttons: {
    [GCButton.A]: 0, [GCButton.B]: 1, [GCButton.X]: 2, [GCButton.Y]: 3,
    [GCButton.Z]: 5, [GCButton.L]: 4, [GCButton.R]: 5, [GCButton.START]: 9,
    [GCButton.DPAD_UP]: 12, [GCButton.DPAD_DOWN]: 13, [GCButton.DPAD_LEFT]: 14, [GCButton.DPAD_RIGHT]: 15,
  },
  axes: {
    [GCAxis.MAIN_X]:   { index: 0, invert: false, range: 'full' },
    [GCAxis.MAIN_Y]:   { index: 1, invert: false, range: 'full' },
    [GCAxis.C_X]:      { index: 2, invert: false, range: 'full' },
    [GCAxis.C_Y]:      { index: 3, invert: false, range: 'full' },
    [GCAxis.L_ANALOG]: { index: 4, invert: false, range: 'trigger' },
    [GCAxis.R_ANALOG]: { index: 5, invert: false, range: 'trigger' },
  },
};

const generic = { ...standard };

export const MAPPINGS = Object.freeze({ nintendo, mayflash, raphnet, standard, generic });

export function getMapping(type) {
  return MAPPINGS[type] || MAPPINGS.generic;
}
