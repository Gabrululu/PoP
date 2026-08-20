import { COLS, ROWS } from './index';

export interface Mark {
  id: string;
  name: string;
  tagline: string;
  color: string;           // primary brand color
  borderColor: string;
  bgOpacity: number;       // 0-1
  x1: number;              // display canvas coords (0 to COLS-1)
  y1: number;              // display canvas coords (0 to ROWS-1)
  x2: number;
  y2: number;
  logo: 'celo' | 'custom';
  official: boolean;
  website?: string;
  createdBy?: string;      // wallet address for user marks
}

// Season genesis: Monday Jul 7 2026 00:00 UTC
export const SEASON_GENESIS_MS = new Date('2026-07-07T00:00:00Z').getTime();
export const SEASON_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// Official Celo brand colors (from celo.org, July 2026)
export const CELO_BRAND = {
  green:  '#56df7c',  // primary brand green
  yellow: '#fcff52',  // brand yellow
  dark:   '#1e002b',  // near-black / brand dark
  cream:  '#fcf6f1',  // brand light background
  forest: '#476520',  // deep green accent
} as const;

// Centered zone: 8×6 cells
const CELO_ZONE_WIDTH  = 8;
const CELO_ZONE_HEIGHT = 6;
const CELO_ZONE_X1 = Math.floor((COLS - CELO_ZONE_WIDTH) / 2);
const CELO_ZONE_Y1 = Math.floor((ROWS - CELO_ZONE_HEIGHT) / 2);

export const OFFICIAL_MARKS: Mark[] = [
  {
    id: 'celo',
    name: 'Celo',
    tagline: 'Prosperity for All',
    color: CELO_BRAND.green,
    borderColor: CELO_BRAND.green,
    bgOpacity: 0.08,
    x1: CELO_ZONE_X1,
    y1: CELO_ZONE_Y1,
    x2: CELO_ZONE_X1 + CELO_ZONE_WIDTH - 1,
    y2: CELO_ZONE_Y1 + CELO_ZONE_HEIGHT - 1,
    logo: 'celo',
    official: true,
    website: 'https://celo.org',
  },
];
