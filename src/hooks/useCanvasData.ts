'use client';
import { useState } from 'react';
import { useReadContract, useWatchContractEvent } from 'wagmi';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { CANVAS_ADDRESS, USDM_ADDRESS, USDM_DECIMALS, CANVAS_ABI, ERC20_ABI } from '@/lib/contracts';
import { FeedItem } from '@/types';
import { PALETTE, shortAddr } from '@/constants';

export function useUSDmBalance() {
  const { address } = useAccount();

  const { data: raw, refetch } = useReadContract({
    address: USDM_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10_000 },
  });

  const balance = raw ? Number(formatUnits(raw as bigint, USDM_DECIMALS)) : null;
  return { balance, refetch };
}

export function useTotalPainted() {
  const { data } = useReadContract({
    address: CANVAS_ADDRESS,
    abi: CANVAS_ABI,
    functionName: 'totalPainted',
    query: { refetchInterval: 15_000 },
  });
  return data ? Number(data) : 0;
}

export function usePixelEvents() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [livePainted, setLivePainted] = useState(0);

  useWatchContractEvent({
    address: CANVAS_ADDRESS,
    abi: CANVAS_ABI,
    eventName: 'PixelPainted',
    onLogs(logs) {
      const newItems: FeedItem[] = logs.map(log => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyLog = log as any;
        const painter     = (anyLog.args?.painter ?? '0x0000000000000000000000000000000000000000') as `0x${string}`;
        const x           = Number(anyLog.args?.x ?? 0);
        const y           = Number(anyLog.args?.y ?? 0);
        const colorIndex  = Number(anyLog.args?.colorIndex ?? 0);
        return {
          id: `${log.transactionHash}-${log.logIndex}`,
          address: shortAddr(painter),
          x,
          y,
          color: PALETTE[colorIndex] ?? PALETTE[0],
          timestamp: Date.now(),
        };
      });
      setFeed(prev => [...newItems, ...prev].slice(0, 20));
      setLivePainted(prev => prev + newItems.length);
    },
  });

  return { feed, livePainted };
}
