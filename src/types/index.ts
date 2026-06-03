export type Screen = 'canvas' | 'zonas' | 'stats';
export type Tool = 'paint' | 'picker' | 'zoom';
export type ZoneStatus = 'dominada' | 'activa' | 'creciendo' | 'nueva' | 'bajo ataque';

export interface FeedItem {
  id: string;
  address: string;
  x: number;
  y: number;
  color: string;
  timestamp: number;
}

export interface Zone {
  name: string;
  color: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  pixels: number;
  status: ZoneStatus;
}

export interface InspectorPixel {
  x: number;
  y: number;
  color: string;
}
