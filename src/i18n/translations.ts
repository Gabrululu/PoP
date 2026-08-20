export type Lang = 'es' | 'en';

const es = {
  // Nav
  navCanvas: 'Canvas',
  navLeader: 'Ranking',
  navStats: 'Stats',

  // Top bar
  live: 'en vivo',
  miniPay: 'MiniPay ✓',
  langToggle: 'EN',

  // Canvas screen
  muralLabel: 'mural 512×512',
  toolPaint: 'pintar',
  toolColor: 'color',
  toolZoom: 'zoom',
  cursor: (x: number, y: number) => `(${x}, ${y})`,
  paintCta: 'Pintar píxel — 0.01 USDm',
  insufficientBalance: 'Balance insuficiente',
  pixelsToday: 'txs hoy',

  // Leaderboard screen
  leaderHeader: 'Ranking de pintores',
  leaderPrizePool: 'Prize Pool',
  leaderPrizeDesc: '80% de cada pintura va al pool',
  leaderTopPainters: 'Top pintores',
  leaderEmpty: 'Sin actividad aún · ¡sé el primero!',
  leaderYourRank: 'Tu posición',
  leaderYourPixels: 'píxeles pintados',
  leaderHowToWin: 'Pinta más para escalar el ranking',
  leaderUnranked: 'Sin ranking',
  leaderPixelUnit: 'px',

  // Stats screen
  statsHeader: 'Stats globales',
  statsPixelsLabel: 'Píxeles pintados',
  statsUsdmLabel: 'USDm recaudado',
  statsTxsLabel: 'Txs hoy',
  statsCompletedLabel: 'Completado',
  statsProgressLabel: 'progreso del canvas',
  statsPixelsCount: (n: string, total: string) => `${n} / ${total}`,

  // Pixel inspector
  inspectorOwner: 'propietario',
  inspectorAgo: (m: number) => `hace ${m} min`,
  inspectorHistory: 'últimos pintores',
  inspectorReclaim: 'Reclamar — 0.01 USDm',
  inspectorInsufficient: 'Balance insuficiente',

  // Live feed
  feedTitle: 'Actividad en vivo',
  feedEmpty: 'Esperando actividad…',
  feedNow: 'ahora',
  feedMin: (m: number) => `${m} min`,
  feedHour: (h: number) => `${h} h`,
};

const en: typeof es = {
  navCanvas: 'Canvas',
  navLeader: 'Ranking',
  navStats: 'Stats',

  live: 'live',
  miniPay: 'MiniPay ✓',
  langToggle: 'ES',

  muralLabel: 'mural 512×512',
  toolPaint: 'paint',
  toolColor: 'color',
  toolZoom: 'zoom',
  cursor: (x: number, y: number) => `(${x}, ${y})`,
  paintCta: 'Paint pixel — 0.01 USDm',
  insufficientBalance: 'Insufficient balance',
  pixelsToday: 'txs today',

  leaderHeader: 'Painter rankings',
  leaderPrizePool: 'Prize Pool',
  leaderPrizeDesc: '80% of every paint goes to the pool',
  leaderTopPainters: 'Top painters',
  leaderEmpty: 'No activity yet · be the first!',
  leaderYourRank: 'Your rank',
  leaderYourPixels: 'pixels painted',
  leaderHowToWin: 'Paint more to climb the rankings',
  leaderUnranked: 'Unranked',
  leaderPixelUnit: 'px',

  statsHeader: 'Global stats',
  statsPixelsLabel: 'Pixels painted',
  statsUsdmLabel: 'USDm raised',
  statsTxsLabel: 'Txs today',
  statsCompletedLabel: 'Completed',
  statsProgressLabel: 'canvas progress',
  statsPixelsCount: (n: string, total: string) => `${n} / ${total}`,

  inspectorOwner: 'owner',
  inspectorAgo: (m: number) => `${m} min ago`,
  inspectorHistory: 'last painters',
  inspectorReclaim: 'Claim — 0.01 USDm',
  inspectorInsufficient: 'Insufficient balance',

  feedTitle: 'Live activity',
  feedEmpty: 'Waiting for activity…',
  feedNow: 'now',
  feedMin: (m: number) => `${m} min`,
  feedHour: (h: number) => `${h} h`,
};

export const translations = { es, en } as const;
export type T = typeof es;
