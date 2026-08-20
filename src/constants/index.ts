export const PALETTE = [
  '#35d07f', '#e24b4a', '#f59e0b', '#378add',
  '#d4537e', '#e0e0f0', '#7f77dd', '#ef9f27',
];

export const COLOR_NAMES: Record<string, string> = {
  '#35d07f': 'Celo Green',
  '#e24b4a': 'Crimson',
  '#f59e0b': 'Amber',
  '#378add': 'Celo Blue',
  '#d4537e': 'Fuchsia',
  '#e0e0f0': 'Frost',
  '#7f77dd': 'Violet',
  '#ef9f27': 'Gold',
};

export const COLS = 22;
export const ROWS = 14;
export const PIXEL_SCALE = 16;
export const TOTAL_PIXELS = 512 * 512; // 262144

export const DEMO_ADDRESSES = [
  '0x4a2f9e1c3d8b7a0f2e5c9b3d6a1f8e2c',
  '0x9d1e7b2f4a8c3e6d0b5f1a9e3c7b2d4f',
  '0xc3a8f2e1b4d7a0c9e5f3b1d6a2e8c4f0',
  '0x2210b3d9f1e4a7c0b6d2f8e5a3c1b9d7',
  '0x7f2ba1e4c8d3f0b5e9a2d6c1f7b3e8a0',
  '0xab33d0f2e7b4a1c9d5f3e0b8a6c2d1f4',
];

export function shortAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

