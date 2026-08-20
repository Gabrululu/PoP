'use client';
import { useEffect, useState } from 'react';
import { usePublicClient, useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { formatUnits, parseAbiItem } from 'viem';
import { CANVAS_ADDRESS, CANVAS_ABI, USDM_DECIMALS } from '@/lib/contracts';

export interface LeaderEntry {
  address: `0x${string}`;
  pixels: number;
  rank: number;
}

const CHUNK = 45_000n;

export function useLeaderboard() {
  const [leaders, setLeaders]         = useState<LeaderEntry[]>([]);
  const [loading, setLoading]         = useState(true);
  const { address }                   = useAccount();
  const client                        = usePublicClient();

  const { data: prizePoolRaw, refetch: refetchPool } = useReadContract({
    address: CANVAS_ADDRESS,
    abi: CANVAS_ABI,
    functionName: 'prizePool',
    query: { refetchInterval: 15_000 },
  });

  const { data: platformSeededRaw } = useReadContract({
    address: CANVAS_ADDRESS,
    abi: CANVAS_ABI,
    functionName: 'platformSeeded',
    query: { refetchInterval: 30_000 },
  });

  const prizePoolUsd = prizePoolRaw !== undefined
    ? Number(formatUnits(prizePoolRaw as bigint, USDM_DECIMALS))
    : 0;

  const platformSeededUsd = platformSeededRaw !== undefined
    ? Number(formatUnits(platformSeededRaw as bigint, USDM_DECIMALS))
    : 0;

  // Read user's own pixel count
  const { data: myPixelsRaw } = useReadContract({
    address: CANVAS_ADDRESS,
    abi: CANVAS_ABI,
    functionName: 'painterPixels',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const myPixels = myPixelsRaw ? Number(myPixelsRaw as bigint) : 0;

  useEffect(() => {
    if (!client) return;

    let cancelled = false;

    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const latestBlock = await client!.getBlockNumber();
        const fromBlock   = latestBlock > 200_000n ? latestBlock - 200_000n : 0n;

        // Paginate getLogs in 45k-block chunks
        const pixelEvent = parseAbiItem(
          'event PixelPainted(address indexed painter, uint16 indexed x, uint16 indexed y, uint8 colorIndex, uint256 timestamp)'
        );

        const counts: Record<string, number> = {};
        for (let from = fromBlock; from <= latestBlock; from += CHUNK + 1n) {
          const to = from + CHUNK > latestBlock ? latestBlock : from + CHUNK;
          const logs = await client!.getLogs({
            address: CANVAS_ADDRESS,
            event: pixelEvent,
            fromBlock: from,
            toBlock: to,
          });
          for (const log of logs) {
            const painter = (log as { args?: { painter?: string } }).args?.painter;
            if (painter) counts[painter.toLowerCase()] = (counts[painter.toLowerCase()] ?? 0) + 1;
          }
        }

        if (cancelled) return;

        const sorted = Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([addr, pixels], i) => ({
            address: addr as `0x${string}`,
            pixels,
            rank: i + 1,
          }));

        setLeaders(sorted);
      } catch (e) {
        console.error('leaderboard fetch error:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60_000);

    return () => { cancelled = true; clearInterval(interval); };
  }, [client]);

  // Find connected user's rank
  const myRank = address
    ? leaders.findIndex(l => l.address.toLowerCase() === address.toLowerCase()) + 1
    : 0;

  return { leaders, prizePoolUsd, platformSeededUsd, myPixels, myRank, loading, refetchPool };
}
