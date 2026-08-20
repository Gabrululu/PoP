'use client';
import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { injected } from 'wagmi/connectors';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect }                     = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { ready, authenticated, login, logout: privyLogout } = usePrivy();

  const isMiniPay =
    typeof window !== 'undefined' &&
    !!(window as unknown as { ethereum?: { isMiniPay?: boolean } }).ethereum?.isMiniPay;

  // MiniPay: auto-connect via injected (no UI needed)
  useEffect(() => {
    if (isMiniPay && !isConnected) {
      connect({ connector: injected() });
    }
  }, [isMiniPay, isConnected, connect]);

  // Login: MiniPay → injected, browser → Privy modal
  const connectWallet = () => {
    if (isMiniPay) {
      connect({ connector: injected() });
    } else {
      login(); // opens Privy modal: email / Google / wallet
    }
  };

  const disconnect = () => {
    wagmiDisconnect();
    if (authenticated) privyLogout();
  };

  return {
    address,
    isConnected,
    isReady: ready,
    authenticated,
    isMiniPay,
    chain,
    connectWallet,
    disconnect,
  };
}
