'use client';
import { useWallet } from '@/hooks/useWallet';
import { useLang } from '@/contexts/LangContext';

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const { connectWallet, isMiniPay } = useWallet();
  const { T } = useLang();

  const handleConnect = () => {
    connectWallet();
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.6)' }}
      />
      <div
        className="slide-up"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          margin: '0 auto',
          width: '100%',
          maxWidth: '390px',
          background: '#1a1a2e',
          borderTop: '0.5px solid #35d07f',
          borderRadius: '16px 16px 0 0',
          padding: '24px 20px 36px',
          zIndex: 90,
        }}
      >
        <div style={{ width: 36, height: 4, background: '#2a2a4a', borderRadius: 2, margin: '0 auto 20px' }} />

        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🎨</div>
          <div style={{ fontSize: 16, color: '#e0e0f0', fontWeight: 500, marginBottom: 6 }}>
            {T.langToggle === 'EN' ? 'Conecta para pintar' : 'Connect to paint'}
          </div>
          <div style={{ fontSize: 13, color: '#5a5a8a', lineHeight: 1.6 }}>
            {T.langToggle === 'EN'
              ? 'Cada píxel se guarda permanentemente\nen la blockchain de Celo'
              : 'Every pixel is permanently saved\non the Celo blockchain'}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {/* Email / Google via Privy */}
          {!isMiniPay && (
            <button
              onClick={handleConnect}
              style={{
                width: '100%',
                padding: '14px',
                background: '#35d07f',
                color: '#0c0c14',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>✉️</span>
              {T.langToggle === 'EN' ? 'Continuar con email o Google' : 'Continue with email or Google'}
            </button>
          )}

          {/* MetaMask / injected */}
          <button
            onClick={handleConnect}
            style={{
              width: '100%',
              padding: '14px',
              background: '#1a1a2e',
              color: '#e0e0f0',
              border: '0.5px solid #2a2a4a',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>🦊</span>
            {isMiniPay
              ? T.miniPay
              : T.langToggle === 'EN'
                ? 'Conectar wallet (MetaMask, etc.)'
                : 'Connect wallet (MetaMask, etc.)'}
          </button>
        </div>

        {/* Fine print */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: '#3a3a5a' }}>
            {T.langToggle === 'EN'
              ? 'Sin cuenta de crypto necesaria · Gas pagado en cUSD'
              : 'No crypto account needed · Gas paid in cUSD'}
          </span>
        </div>
      </div>
    </>
  );
}
