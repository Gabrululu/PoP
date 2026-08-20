import { parseUnits } from 'viem';
import PixelCanvasAbi from '@/abis/PixelCanvas.json';

export const CANVAS_ADDRESS = '0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82' as const;
export const USDM_ADDRESS   = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const;

export const PIXEL_PRICE    = parseUnits('0.01', 18); // 0.01 USDm
export const USDM_DECIMALS  = 18;

// USDm feeCurrency for gas abstraction (same address — token == adapter for USDm)
export const FEE_CURRENCY   = USDM_ADDRESS;

export const CANVAS_ABI = PixelCanvasAbi as typeof PixelCanvasAbi;

export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'account', type: 'address' }],
    outputs: [{ name: '',        type: 'uint256'  }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }],
    outputs: [{ name: '',      type: 'uint256'  }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs:  [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }],
    outputs: [{ name: '',        type: 'bool'    }],
  },
] as const;
