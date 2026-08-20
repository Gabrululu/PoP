'use client';
import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { CANVAS_ADDRESS, CANVAS_ABI } from '@/lib/contracts';

export interface FreeClaimInfo {
  canClaim: boolean;
  availableAt: Date;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  countdown: string; // "14h 32m"
  refetch: () => void;
}

export function useFreeClaimStatus(): FreeClaimInfo {
  const { address } = useAccount();
  const [now, setNow] = useState(() => Date.now());

  const { data, refetch } = useReadContract({
    address: CANVAS_ADDRESS,
    abi: CANVAS_ABI,
    functionName: 'freeClaimStatus',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 60_000 },
  });

  // Tick every second for the countdown
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const result = data as [boolean, bigint] | undefined;
  const canClaimOnChain = result?.[0] ?? false;
  const availableAtMs = result ? Number(result[1]) * 1000 : now;

  const remaining = Math.max(0, availableAtMs - now);
  const totalSecs = Math.floor(remaining / 1000);
  const hoursLeft   = Math.floor(totalSecs / 3600);
  const minutesLeft = Math.floor((totalSecs % 3600) / 60);
  const secondsLeft = totalSecs % 60;

  const parts: string[] = [];
  if (hoursLeft > 0)   parts.push(`${hoursLeft}h`);
  if (minutesLeft > 0 || hoursLeft > 0) parts.push(`${minutesLeft}m`);
  if (hoursLeft === 0) parts.push(`${secondsLeft}s`);

  return {
    canClaim: canClaimOnChain || !address, // show as available if not connected (will prompt login)
    availableAt: new Date(availableAtMs),
    hoursLeft,
    minutesLeft,
    secondsLeft,
    countdown: parts.join(' ') || '0s',
    refetch,
  };
}
