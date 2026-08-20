'use client';
import { useState, useEffect } from 'react';
import { SEASON_GENESIS_MS, SEASON_DURATION_MS } from '@/constants/marks';

export interface SeasonInfo {
  number: number;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  endsAt: Date;
  label: string; // "3d 12h 45m"
}

function computeSeason(): SeasonInfo {
  const now = Date.now();
  const elapsed = now - SEASON_GENESIS_MS;
  const number = Math.floor(elapsed / SEASON_DURATION_MS) + 1;
  const endsAt = new Date(SEASON_GENESIS_MS + number * SEASON_DURATION_MS);
  const remaining = Math.max(0, endsAt.getTime() - now);

  const totalSeconds = Math.floor(remaining / 1000);
  const daysLeft = Math.floor(totalSeconds / 86400);
  const hoursLeft = Math.floor((totalSeconds % 86400) / 3600);
  const minutesLeft = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];
  if (daysLeft > 0) parts.push(`${daysLeft}d`);
  if (hoursLeft > 0 || daysLeft > 0) parts.push(`${hoursLeft}h`);
  parts.push(`${minutesLeft}m`);

  return { number, daysLeft, hoursLeft, minutesLeft, endsAt, label: parts.join(' ') };
}

export function useSeasonCountdown(): SeasonInfo {
  const [info, setInfo] = useState<SeasonInfo>(computeSeason);

  useEffect(() => {
    const id = setInterval(() => setInfo(computeSeason()), 30_000);
    return () => clearInterval(id);
  }, []);

  return info;
}
