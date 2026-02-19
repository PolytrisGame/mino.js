export const ADAPTERS = [
  { name: 'Nintendo WUP-028',                    match: /057e.*0337|wup-028|gamecube adapter/i, ports: 1, mapping: 'nintendo' },
  { name: 'Mayflash GameCube Adapter',            match: /mayflash.*gamecube|0079.*1844|0079.*1843/i, ports: 1, mapping: 'mayflash' },
  { name: 'Mayflash GameCube Adapter (Wii U Mode)', match: /0079.*1800/i, ports: 1, mapping: 'nintendo' },
  { name: 'Raphnet GameCube Adapter',             match: /raphnet|289b/i, ports: 1, mapping: 'raphnet' },
  { name: '8BitDo GBros Adapter',                 match: /8bitdo.*gbros|2dc8.*5106/i, ports: 1, mapping: 'standard' },
  { name: 'Brook GameCube Converter',             match: /brook.*gamecube|brook.*gc/i, ports: 1, mapping: 'standard' },
  { name: 'Generic GameCube Adapter',             match: /gamecube|0079|gc.*controller|gc.*adapter/i, ports: 1, mapping: 'generic' },
];

export function identifyAdapter(gamepad) {
  const id = gamepad.id || '';
  for (let i = 0; i < ADAPTERS.length; i++) {
    if (ADAPTERS[i].match.test(id)) {
      return { adapter: ADAPTERS[i], index: i };
    }
  }
  return null;
}
