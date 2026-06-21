# ORION — Web3 Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/web3-dashboard-amber?logo=ethereum" alt="Web3 Dashboard">
  <img src="https://img.shields.io/badge/Three.js-3D-brightgreen" alt="Three.js">
  <img src="https://img.shields.io/badge/Chart.js-visualization-F2715B" alt="Chart.js">
  <img src="https://img.shields.io/badge/Ethers.js-wallet-2535A0" alt="Ethers.js">
</p>

![ORION Dashboard](screenshot.png)

> A visually immersive, real-time Web3 dashboard with an interactive 3D torus knot background, multi-chain portfolio tracking, live gas and price data, and wallet connection support.

---

## Features

- **Connect Wallet** — MetaMask & WalletConnect integration via Ethers.js
- **Portfolio Value** — Real-time USD valuation of your connected wallet
- **Real ERC-20 Balances** — Fetch actual token balances from the blockchain
- **Multi-Chain** — Ethereum, Polygon, BSC, Arbitrum, and Optimism
- **Live Gas Tracker** — Current gas prices (Slow / Average / Fast) via Etherscan API
- **Price Ticker** — Live prices for 14 major cryptocurrencies via CoinGecko API
- **Recent Transactions** — View your latest on-chain activity
- **Interactive 3D Background** — Rotating torus knot rendered with Three.js in gold/amber tones
- **Portfolio Chart** — Allocation breakdown powered by Chart.js
- **Dark UI** — Polished dark theme optimized for readability
- **Fully Responsive** — Works on desktop, tablet, and mobile

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Vanilla HTML / CSS / JS** | Core application structure and styling |
| **Three.js** | Interactive 3D torus knot background animation |
| **Chart.js** | Portfolio allocation donut chart |
| **Ethers.js** | Wallet connection (MetaMask + WalletConnect) and blockchain interaction |
| **CoinGecko API** | Real-time cryptocurrency price data |
| **Etherscan API** | Gas price estimates and transaction history |

---

## Getting Started

### 1. Open the Dashboard

Simply open `index.html` in any modern web browser:

```bash
open index.html
```

No build tools or package managers required — this is a vanilla frontend project.

### 2. Connect Your Wallet

- Click the **"Connect Wallet"** button
- Choose **MetaMask** (browser extension) or **WalletConnect** (mobile wallet scan)
- Approve the connection request in your wallet
- Your portfolio and transaction data will load automatically

### 3. Get an Etherscan API Key

Some features (gas tracker, transaction history) require an Etherscan API key:

1. Go to [https://etherscan.io/myapikey](https://etherscan.io/myapikey)
2. Sign up or log in
3. Create a free API key
4. Add it to the dashboard configuration (see below)

---

## Configuration

### Etherscan API Key

Add your Etherscan API key in `js/config.js` (or wherever API keys are configured in the project):

```js
const ETHERSCAN_API_KEY = 'YOUR_API_KEY_HERE';
```

> **Note:** The free tier offers 5 calls/second — sufficient for dashboard use.

### WalletConnect Project ID

If using WalletConnect, configure your Project ID (register at [https://cloud.walletconnect.com](https://cloud.walletconnect.com)):

```js
const WALLETCONNECT_PROJECT_ID = 'YOUR_PROJECT_ID';
```

---

## Project Structure

```
ORION-web3-dashboard/
├── index.html          # Main entry point
├── css/
│   └── style.css       # Styles and dark theme
├── js/
│   ├── app.js          # Core application logic
│   ├── config.js       # API keys and constants
│   ├── wallet.js       # Wallet connection (Ethers.js + WalletConnect)
│   ├── portfolio.js    # Portfolio balance fetching
│   ├── prices.js       # CoinGecko price ticker
│   ├── gas.js          # Etherscan gas tracker
│   ├── transactions.js # Transaction history
│   └── three-bg.js     # Three.js 3D background
├── README.md           # This file
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

---

## Acknowledgements & Links

- [Three.js](https://threejs.org/) — 3D graphics library
- [Chart.js](https://www.chartjs.org/) — Simple yet flexible JavaScript charting
- [Ethers.js](https://docs.ethers.org/) — Complete Ethereum wallet implementation
- [WalletConnect](https://walletconnect.com/) — Open protocol for connecting wallets
- [CoinGecko API](https://www.coingecko.com/en/api) — Free cryptocurrency data
- [Etherscan API](https://etherscan.io/apis) — Ethereum blockchain explorer API

---

## License

Licensed under the [MIT License](LICENSE). © 2026 whyuardi.
