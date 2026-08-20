'use client';
import { useState, useCallback, useMemo } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import {
  CANVAS_ADDRESS, USDM_ADDRESS, PIXEL_PRICE,
  FEE_CURRENCY, CANVAS_ABI, ERC20_ABI,
} from '@/lib/contracts';
import { getAttributionSuffix } from '@/lib/attribution-tag';

export type PaintStatus = 'idle' | 'approving' | 'painting' | 'claiming' | 'confirmed' | 'error';

function isMiniPayEnv(): boolean {
  return typeof window !== 'undefined' &&
    !!(window as unknown as { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay;
}

export function usePaintPixel() {
  const { address } = useAccount();
  const [status, setStatus] = useState<PaintStatus>('idle');
  const [lastTxHash, setLastTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync: writeApprove }    = useWriteContract();
  const { writeContractAsync: writePaint }      = useWriteContract();
  const { writeContractAsync: writeFreeClaim }  = useWriteContract();

  const { refetch: refetchAllowance } = useReadContract({
    address: USDM_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CANVAS_ADDRESS] : undefined,
    query: { enabled: !!address },
  });

  const { isLoading: isWaiting } = useWaitForTransactionReceipt({ hash: lastTxHash });

  const feeCurrencyArgs = useMemo(() => (isMiniPayEnv() ? { feeCurrency: FEE_CURRENCY } : {}), []);
  const dataSuffix = getAttributionSuffix();
  const tagArgs = useMemo(() => (dataSuffix ? { dataSuffix } : {}), [dataSuffix]);

  // Paid paint
  const paint = useCallback(async (x: number, y: number, colorIndex: number) => {
    if (!address) return;
    setStatus('idle');

    try {
      const { data: currentAllowance } = await refetchAllowance();
      const allowance = (currentAllowance as bigint | undefined) ?? 0n;

      if (allowance < PIXEL_PRICE) {
        setStatus('approving');
        const approveTx = await writeApprove({
          address: USDM_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [CANVAS_ADDRESS, PIXEL_PRICE * 100n],
          ...feeCurrencyArgs,
          ...tagArgs,
        });
        setLastTxHash(approveTx);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      setStatus('painting');
      const paintTx = await writePaint({
        address: CANVAS_ADDRESS,
        abi: CANVAS_ABI,
        functionName: 'paintPixel',
        args: [x, y, colorIndex],
        ...feeCurrencyArgs,
        ...tagArgs,
      });
      setLastTxHash(paintTx);
      setStatus('confirmed');
      return paintTx;
    } catch (err) {
      console.error('paintPixel error:', err);
      setStatus('error');
    }
  }, [address, refetchAllowance, writeApprove, writePaint, feeCurrencyArgs, tagArgs]);

  // Free daily claim — no USDm needed
  const freeClaim = useCallback(async (x: number, y: number, colorIndex: number) => {
    if (!address) return;
    setStatus('claiming');

    try {
      const claimTx = await writeFreeClaim({
        address: CANVAS_ADDRESS,
        abi: CANVAS_ABI,
        functionName: 'freeClaimPixel',
        args: [x, y, colorIndex],
        ...feeCurrencyArgs,
        ...tagArgs,
      });
      setLastTxHash(claimTx);
      setStatus('confirmed');
      return claimTx;
    } catch (err) {
      console.error('freeClaim error:', err);
      setStatus('error');
    }
  }, [address, writeFreeClaim, feeCurrencyArgs, tagArgs]);

  const reset = () => setStatus('idle');

  return { paint, freeClaim, status, isWaiting, reset };
}
