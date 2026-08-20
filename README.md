# Proof of Pixel

A collaborative pixel-art canvas on Celo — every pixel costs **0.01 USDm**. Built for **Proof of Ship**.

Proof of Pixel is a 512×512 shared canvas where anyone can paint a pixel by paying a small fee in USDm (Mento's Celo dollar), or claim one pixel for free every 24 hours. 80% of every paid pixel flows into a seasonal prize pool that's split among the top painters on the leaderboard.

## Features

- **Pay-to-paint canvas** — paint any of the 262,144 pixels for 0.01 USDm.
- **Free daily claim** — one free pixel per wallet every 24 hours, no USDm required.
- **Prize pool & leaderboard** — 80% of paid-pixel revenue accumulates in an on-chain prize pool, distributed to the top painters at the end of each season.
- **Territorial marks** — register a named, colored zone on the canvas (official Celo mark + user-created marks).
- **Live feed & reclaim toasts** — see pixels being painted in real time and get notified when someone overwrites one of yours.
- **MiniPay support** — auto-connects via the injected provider when opened inside MiniPay, with USDm used as the gas fee currency.
- **Wallet login via Privy** — email, Google, or external wallet, with an embedded wallet created on first login.
- **Bilingual UI** — Spanish/English toggle.

## Tech stack

**App**
- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- [wagmi](https://wagmi.sh) + [viem](https://viem.sh) for on-chain reads/writes
- [Privy](https://privy.io) for wallet auth (`@privy-io/react-auth`, `@privy-io/wagmi`)
- [TanStack Query](https://tanstack.com/query) for data fetching/caching
- Tailwind CSS v4
- [`@celo/attribution-tags`](https://www.npmjs.com/package/@celo/attribution-tags) for ERC-8021 attribution tagging on transactions

**Contracts**
- Solidity `^0.8.28`, built and tested with [Foundry](https://book.getfoundry.sh/)

## Project structure

```
src/
  app/            Next.js app router entry (layout, page, global styles)
  components/     UI screens and widgets (canvas, leaderboard, stats, marks, login, etc.)
  contexts/       React contexts (Web3Provider: Privy + wagmi + React Query, LangContext)
  hooks/          On-chain data hooks (paint, leaderboard, free claim, balances, wallet)
  lib/            Contract addresses/ABIs, wagmi config, attribution tag helper
  constants/      Palette, canvas dimensions, territorial marks config
  i18n/           ES/EN translation strings
  types/          Shared TypeScript types
  abis/           Generated contract ABIs

contracts/
  src/PixelCanvas.sol       Main contract
  script/Deploy.s.sol       Foundry deploy script
  test/PixelCanvas.t.sol    Foundry tests
```

## The contract

`PixelCanvas.sol` is a single collaborative-canvas contract:

- `WIDTH × HEIGHT` = 512 × 512 pixels, 8 colors (`MAX_COLOR = 7`).
- `paintPixel(x, y, colorIndex)` — pulls `PIXEL_PRICE` (0.01 USDm) via `transferFrom`, records the pixel, and routes 80% of the payment into `prizePool`.
- `paintBatch(...)` — same as above for up to 500 pixels in one transaction.
- `freeClaimPixel(x, y, colorIndex)` — one free paint per address every `FREE_COOLDOWN` (24h); counts toward the leaderboard but not the prize pool.
- `seedPrizePool(amount)` / `distributePrize(winners, amounts)` — owner-only functions to top up and pay out the seasonal prize pool.
- `getPixel`, `freeClaimStatus`, `painterPixels`, `totalPainted` — public views used by the frontend for the canvas, countdown, and leaderboard.

Deployed on **Celo Sepolia** (chain ID `11142220`):

| Contract | Address |
|---|---|
| `PixelCanvas` | `0xa89fb8A3f72C77cA15cfb8a1903f6Ef4D48bed82` |
| USDm (cUSD adapter) | `0x765DE816845861e75A25fCA122bb6898B8B1282a` |

RPC: `https://forno.celo-sepolia.celo-testnet.org` · Explorer: [Blockscout](https://celo-sepolia.blockscout.com)

## Getting started

Requires [pnpm](https://pnpm.io).

```bash
pnpm install
```

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
pnpm build   # production build
pnpm start   # run the production build
pnpm lint    # eslint
```

## Working on the contracts

The `contracts/` directory is a standalone [Foundry](https://book.getfoundry.sh/) project.

```bash
cd contracts
forge build
forge test
```

To deploy, create `contracts/.env` (see `contracts/.env.example`):

```bash
PRIVATE_KEY=0x...          # deployer wallet (testnet only)
CELOSCAN_API_KEY=...       # from https://celoscan.io/myapikey, for verification
```

Then run:

```bash
forge script script/Deploy.s.sol --rpc-url celo_sepolia --broadcast --verify
```

RPC endpoints and the Celoscan verifier are pre-configured in `foundry.toml` for both `celo_sepolia` and `celo` (mainnet).
