export type Lang = 'es' | 'en';

const es = {
  // Nav
  navCanvas: 'Canvas',
  navZones: 'Zonas',
  navStats: 'Stats',

  // Top bar
  live: '● vivo',
  miniPay: 'MiniPay ✓',
  langToggle: 'EN',

  // Canvas screen
  muralLabel: 'mural 512×512',
  toolPaint: 'pintar',
  toolColor: 'color',
  toolZoom: 'zoom',
  cursor: (x: number, y: number) => `cursor (${x}, ${y})`,
  paintCta: 'Pintar píxel — 0.01 cUSD',
  insufficientBalance: 'Balance insuficiente',
  pixelsToday: 'píxeles pintados hoy',

  // Zonas screen
  zonesHeader: 'Zonas activas',
  zonesThisWeek: 'esta semana',
  zonesEmptyTitle: 'No hay zonas aún',
  zonesEmptySub: 'Crea la primera zona territorial\ny empieza a reclamar el canvas',
  zonesCreateBtn: '+ Crear mi zona',
  zonesCostInfo: (balance: string) => `Cuesta 1.00 cUSD · balance: ${balance} cUSD`,
  zonesFormTitle: 'Crear zona',
  zonesFormNameLabel: 'Nombre de la zona',
  zonesFormNamePlaceholder: 'Mi zona épica…',
  zonesFormColorLabel: 'Color de la zona',
  zonesFormConfirm: 'Crear zona — 1.00 cUSD',
  zoneStatusDominada: 'dominada',
  zoneStatusActiva: 'activa',
  zoneStatusCreciendo: 'creciendo',
  zoneStatusNueva: 'nueva',
  zoneStatusAttack: '⚡ bajo ataque',
  zoneCoords: (x1: number, y1: number, x2: number, y2: number) =>
    `zona (${x1},${y1})→(${x2},${y2})`,

  // Stats screen
  statsHeader: 'Stats globales',
  statsPixelsLabel: 'Píxeles pintados',
  statsCusdLabel: 'cUSD recaudado',
  statsTxsLabel: 'Txs hoy',
  statsCompletedLabel: 'Canvas completado',
  statsTopPainters: 'Top pintores · esta semana',
  statsEmptyTitle: 'Sé el primero en pintar',
  statsEmptySub: 'El ranking aparecerá aquí',
  statsYou: 'tú',
  statsProgressLabel: 'canvas completado',
  statsPixelsCount: (n: string, total: string) => `${n} / ${total} píxeles`,

  // Pixel inspector
  inspectorOwner: 'propietario actual',
  inspectorAgo: (m: number) => `hace ${m} min`,
  inspectorHistory: 'últimos pintores',
  inspectorReclaim: 'Reclamar este píxel — 0.01 cUSD',
  inspectorInsufficient: 'Balance insuficiente',

  // Live feed
  feedTitle: 'Actividad en vivo',
  feedEmpty: 'Esperando actividad…',
  feedNow: 'ahora',
  feedMin: (m: number) => `${m} min`,
  feedHour: (h: number) => `${h} h`,
};

const en: typeof es = {
  // Nav
  navCanvas: 'Canvas',
  navZones: 'Zones',
  navStats: 'Stats',

  // Top bar
  live: '● live',
  miniPay: 'MiniPay ✓',
  langToggle: 'ES',

  // Canvas screen
  muralLabel: 'mural 512×512',
  toolPaint: 'paint',
  toolColor: 'color',
  toolZoom: 'zoom',
  cursor: (x: number, y: number) => `cursor (${x}, ${y})`,
  paintCta: 'Paint pixel — 0.01 cUSD',
  insufficientBalance: 'Insufficient balance',
  pixelsToday: 'pixels painted today',

  // Zonas screen
  zonesHeader: 'Active zones',
  zonesThisWeek: 'this week',
  zonesEmptyTitle: 'No zones yet',
  zonesEmptySub: 'Create the first territorial zone\nand start claiming the canvas',
  zonesCreateBtn: '+ Create my zone',
  zonesCostInfo: (balance: string) => `Costs 1.00 cUSD · balance: ${balance} cUSD`,
  zonesFormTitle: 'Create zone',
  zonesFormNameLabel: 'Zone name',
  zonesFormNamePlaceholder: 'My epic zone…',
  zonesFormColorLabel: 'Zone color',
  zonesFormConfirm: 'Create zone — 1.00 cUSD',
  zoneStatusDominada: 'dominated',
  zoneStatusActiva: 'active',
  zoneStatusCreciendo: 'growing',
  zoneStatusNueva: 'new',
  zoneStatusAttack: '⚡ under attack',
  zoneCoords: (x1: number, y1: number, x2: number, y2: number) =>
    `zone (${x1},${y1})→(${x2},${y2})`,

  // Stats screen
  statsHeader: 'Global stats',
  statsPixelsLabel: 'Pixels painted',
  statsCusdLabel: 'cUSD raised',
  statsTxsLabel: 'Txs today',
  statsCompletedLabel: 'Canvas completed',
  statsTopPainters: 'Top painters · this week',
  statsEmptyTitle: 'Be the first to paint',
  statsEmptySub: 'The ranking will appear here',
  statsYou: 'you',
  statsProgressLabel: 'canvas completed',
  statsPixelsCount: (n: string, total: string) => `${n} / ${total} pixels`,

  // Pixel inspector
  inspectorOwner: 'current owner',
  inspectorAgo: (m: number) => `${m} min ago`,
  inspectorHistory: 'last painters',
  inspectorReclaim: 'Claim this pixel — 0.01 cUSD',
  inspectorInsufficient: 'Insufficient balance',

  // Live feed
  feedTitle: 'Live activity',
  feedEmpty: 'Waiting for activity…',
  feedNow: 'now',
  feedMin: (m: number) => `${m} min`,
  feedHour: (h: number) => `${h} h`,
};

export const translations = { es, en } as const;
export type T = typeof es;
