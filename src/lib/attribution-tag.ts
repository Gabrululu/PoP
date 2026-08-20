import type { Hex } from 'viem';
import { toDataSuffix, codeFromHostname } from '@celo/attribution-tags';

let cached: Hex | null = null;

export function getAttributionSuffix(): Hex | undefined {
  if (typeof window === 'undefined') return undefined;
  if (cached) return cached;
  try {
    cached = toDataSuffix(codeFromHostname(window.location.hostname)) as Hex;
    return cached;
  } catch {
    return undefined;
  }
}
