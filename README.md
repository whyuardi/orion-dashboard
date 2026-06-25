<div align="center">

# 🌌 ORION Dashboard

**Real-Time Multi-Chain Crypto Portfolio Dashboard**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Ethers.js](https://img.shields.io/badge/Ethers.js-6.13-2535A0?logo=ethereum)](https://docs.ethers.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r134-000?logo=threedotjs)](https://threejs.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?logo=chartdotjs)](https://www.chartjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-whyuardi/orion--dashboard-181717?logo=github)](https://github.com/whyuardi/orion-dashboard)

[✨ Features](#-features) • [📦 Tech Stack](#-tech-stack) • [🚀 Getting Started](#-getting-started) • [⚙️ Configuration](#️-configuration) • [📁 Project Structure](#-project-structure) • [🌐 Deployment](#-deployment) • [📸 Screenshots](#-screenshots) • [📄 License](#-license)

</div>

---

A visually immersive, real-time cryptocurrency portfolio dashboard built with **zero build tools** — pure vanilla HTML, CSS, and JavaScript. Connect your wallet across **5 EVM-compatible chains**, track live ERC-20 balances, monitor gas prices, and enjoy an interactive **3D torus knot** rendered with Three.js.

No bundlers. No frameworks. Just open `index.html` and go.

---

## ✨ Features

### 🔌 Wallet Connection
| Method | Support |
|--------|---------|
| **MetaMask** | Full browser extension integration via Ethers.js `BrowserProvider` |
| **WalletConnect** | QR-code based mobile wallet pairing (configurable Project ID) |
| **Injected Wallets** | Rabby, Trust Wallet, OKX Wallet, and any `window.ethereum` provider |

Wallet state is **persisted to `localStorage`** — reconnect automatically on page load.

### ⛓️ Multi-Chain Support
Switch networks on the fly with one click — the dashboard fetches balances and transactions from the active chain:

| Chain | ID | RPC Provider |
|-------|----|-------------|
| **Ethereum** | `1` | `eth.llamarpc.com` |
| **Polygon** | `137` | `polygon.llamarpc.com` |
| **BNB Chain** | `56` | `binance.llamarpc.com` |
| **Arbitrum One** | `42161` | `arbitrum.llamarpc.com` |
| **Optimism** | `10` | `optimism.llamarpc.com` |

### 💰 Real ERC-20 Balances
Fetches **on-chain token balances** via `ethers.Contract` calls — no third-party indexing required. Tracks major assets per chain:

**Ethereum:** USDC, USDT, WBTC, LINK, UNI, MATIC, PEPE  
**Polygon:** USDC, USDT, WETH, WMATIC  
**BNB Chain:** USDC, USDT, WETH, WBTC  
**Arbitrum:** USDC, USDT, WBTC  
**Optimism:** USDC, USDT, WBTC

### 📊 Portfolio Valuation
- Real-time **USD valuation** of all holdings aggregated from CoinGecko prices
- **24-hour price change** indicators (green ▲ / red ▼)
- **Chart.js donut chart** showing allocation breakdown with interactive tooltips and custom legend
- Staggered fade-in animations on token rows

### ⛽ Live Gas Tracker
- **Etherscan Gas Oracle** (primary) — Slow / Standard / Fast estimates in Gwei
- **RPC fallback** — uses `provider.getFeeData()` when the Etherscan API is unavailable
- Refresh button for on-demand updates

### 📈 Price Ticker
Live scrolling ticker for **14 major cryptocurrencies**:

> BTC • ETH • SOL • ADA • AVAX • DOT • LINK • MATIC • UNI • LTC • DOGE • PEPE • NEAR • APT

- **CoinGecko API** as primary data source
- **Hardcoded fallback prices** when the API is unreachable
- Seamless infinite-scroll CSS animation

### 🕐 Recent Transactions
- Fetches the **10 most recent transactions** via Etherscan-compatible explorer APIs (Etherscan, Polygonscan, BscScan, Arbiscan, Optimistic Etherscan)
- Color-coded **Send** (red) / **Receive** (green) badges
- Clickable transaction hashes linking to the block explorer
- Relative timestamps ("2m ago", "3h ago")
- **Fallback sample transactions** when the API key is missing

### 🎨 Interactive 3D Background
A mesmerizing real-time scene built with **Three.js r134**:

- **Gold/amber torus knot** with physically-based rendering (metalness, clearcoat, emissive glow)
- **Wireframe overlay** with subtle transparency
- **1,200 ambient particles** on a spherical field with additive blending
- **Drag to rotate** — click and drag the scene to view the knot from any angle
- **Scroll parallax** — the knot shifts downward and the camera pulls back as you scroll
- **Pulsing emissive glow** synchronized with a sine wave
- **Respects `prefers-reduced-motion`** — 3D scene is disabled for accessibility

### 🦴 Skeleton Loading
Shimmer-animated skeleton placeholders appear while data loads, then smoothly transition to live content. All major panels (stats, tokens, transactions) use skeletons.

### 🔄 Auto-Refresh
Dashboard refreshes all data every **30 seconds** — prices, balances, gas, and transactions stay current without manual intervention.

### 🎯 Responsive & Accessible
- Fully responsive grid layout (4-column → 2-column → single column)
- Dark theme optimized for long viewing sessions
- Keyboard-navigable modals and dropdowns
- `prefers-reduced-motion` media query support

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **HTML5** | — | Application structure and semantic markup |
| **CSS3** | — | Custom properties, grid layout, animations, dark theme |
| **JavaScript** | ES2020+ | Application logic, async data fetching, DOM manipulation |
| **Ethers.js** | 6.13.5 (CDN) | Wallet connection, provider/signer, ERC-20 contract calls |
| **Three.js** | r134 (CDN) | Interactive 3D torus knot, particles, parallax effects |
| **Chart.js** | 4.4.7 (CDN) | Portfolio allocation donut chart with tooltips |
| **CoinGecko API** | v3 (free) | Real-time cryptocurrency prices and 24h changes |
| **Etherscan API** | v1 (free) | Gas price oracle and transaction history |
| **Phosphor Icons** | 2.1.1 (CDN) | Bold-style UI icons throughout the dashboard |
| **JetBrains Mono** | Google Fonts | Monospace font for data, addresses, and code elements |
| **Outfit** | Google Fonts | Sans-serif font for headings and body text |
| **localStorage** | Web API | Wallet address and chain ID persistence |

### Zero Build Tools

This project uses **no bundlers, no transpilers, no package managers**. Every dependency is loaded via CDN with `<script>` and `<link>` tags. To run it, simply open `index.html` in any modern browser.

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- [MetaMask](https://metamask.org/) browser extension (recommended)
- (Optional) An [Etherscan API key](https://etherscan.io/myapikey) for gas and transaction data

### 1. Clone the Repository
```bash
git clone https://github.com/whyuardi/orion-dashboard.git
cd orion-dashboard
```

### 2. Open the Dashboard
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows (Command Prompt)
start index.html
```

That's it. **No `npm install`, no build step, no dev server.** The dashboard loads all dependencies from CDNs at runtime.

### 3. Connect Your Wallet
1. Click the **Connect Wallet** button in the top-right corner
2. Choose your preferred connection method:
   - **MetaMask** — Browser extension
   - **WalletConnect** — Scan QR code with your mobile wallet
   - **Injected Wallet** — Rabby, Trust Wallet, OKX, etc.
3. Approve the connection in your wallet
4. Your portfolio, balances, and transactions load automatically

> 💡 **Pro tip:** After connecting once, the dashboard persists your wallet address and selected chain to `localStorage`. Refresh the page and you'll be reconnected instantly.

### 4. Switch Chains
Click the chain selector button (defaults to **Ethereum**) and pick any supported network. If the chain isn't in your wallet yet, the dashboard will prompt MetaMask to add it automatically.

---

## ⚙️ Configuration

### 🔑 Etherscan API Key
The gas tracker and transaction history features call Etherscan-compatible APIs. Set your key for full functionality:

1. Register at [etherscan.io](https://etherscan.io/myapikey) and create a free API key
2. Open `js/config.js` and set it in the `state` object:

```js
const state = {
  // ... existing properties
  etherscanApiKey: 'YOUR_ETHERSCAN_API_KEY',
};
```

> **Free tier:** 5 calls/second — more than sufficient for personal dashboard use.

> **No API key?** The dashboard gracefully degrades: gas prices fall back to RPC estimates, and transactions show sample data.

### 🔗 WalletConnect Project ID
To enable WalletConnect v2, you'll need a Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com):

1. Sign up at [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create a new project and copy your **Project ID**
3. The connection flow in `app.js` (`connectWalletConnect()`) is ready for integration — pass your Project ID to the WalletConnect SDK

```js
// In js/app.js — connectWalletConnect() function
const walletConnectProvider = new WalletConnectProvider.default({
  projectId: 'YOUR_PROJECT_ID',
  // ...
});
```

### 🌐 Custom RPC Endpoints
Chain RPC URLs are defined in `js/config.js` inside the `CHAINS` object. You can replace any `llamarpc.com` URL with your own RPC endpoint:

```js
const CHAINS = {
  1: {
    name: 'Ethereum Mainnet',
    rpc: 'https://eth.llamarpc.com',  // ← Replace with your RPC
    // ...
  },
  // ...
};
```

### 🪙 Adding Custom Tokens
Token lists are organized by chain in `TOKENS` within `js/config.js`. To add a token:

```js
TOKENS: {
  1: [
    // ... existing tokens
    {
      addr: '0x...',           // Token contract address
      sym: 'YOUR',             // Ticker symbol
      name: 'Your Token Name', // Human-readable name
      dec: 18,                 // Decimals (call token.decimals())
      cg: 'your-coingecko-id', // CoinGecko ID for pricing
      color: '#FF0000',        // Color for chart and icon
    },
  ],
}
```

---

## 📁 Project Structure

```
orion-dashboard/
├── index.html              # Main entry point — imports all CSS/JS via <link> and <script>
│
├── css/
│   └── style.css           # All styles: dark theme, grid layout, responsive breakpoints,
│                           # skeleton animations, ticker, modals, toasts, utilities
│
├── js/
│   ├── config.js           # Application state, chain configs (5 networks), ERC-20 token
│   │                       # addresses per chain, minimal ERC-20 ABI, scroll listener
│   │
│   ├── app.js              # Core logic (~680 lines): wallet connect/disconnect, chain
│   │                       # switching, ETH + ERC-20 balance fetching, gas tracker,
│   │                       # price ticker, transactions, Chart.js donut chart,
│   │                       # localStorage persistence, auto-refresh (30s interval),
│   │                       # toast notifications, skeleton loading, UI updates
│   │
│   └── scene.js            # Three.js scene (~145 lines): torus knot mesh with PBR
│                           # material, wireframe overlay, 1,200 star particles,
│                           # drag-to-rotate with momentum, scroll parallax,
│                           # pulsing emissive glow, responsive resize
│
├── README.md               # This file
├── LICENSE                  # MIT License
└── .gitignore               # Node artifacts, screenshots, environment files
```

### File-by-File Breakdown

| File | Lines | Role |
|------|-------|------|
| `index.html` | 278 | HTML structure with CDN imports, semantic dashboard layout, wallet modal, toast container |
| `css/style.css` | 388 | Complete CSS design system with custom properties, responsive breakpoints, skeleton shimmer keyframes, ticker scroll animation |
| `js/config.js` | 71 | State object, 5-chain configuration map, token lists per chain (with addresses, decimals, CoinGecko IDs), ERC-20 ABI |
| `js/app.js` | 676 | All application logic — wallet connection, chain switching, data fetching, Chart.js integration, price ticker, transaction list, localStorage persistence, auto-refresh |
| `js/scene.js` | 145 | Three.js scene initialization with torus knot, lights, particles, drag interaction, scroll parallax |

---

## 🌐 Deployment

This is a **fully static site** — no server needed. You can deploy it anywhere static files are served.

### GitHub Pages (Recommended)

1. Push the repository to GitHub:
   ```bash
   git remote add origin https://github.com/whyuardi/orion-dashboard.git
   git push -u origin main
   ```

2. Go to your repository **Settings → Pages**

3. Under **Branch**, select `main` and save with `/` (root) as the folder

4. Your dashboard will be live at `https://whyuardi.github.io/orion-dashboard/`

### Other Static Hosts

| Platform | Instructions |
|----------|-------------|
| **Netlify** | Drag-and-drop the project folder onto [netlify.com](https://netlify.com) |
| **Vercel** | Import the repo — Vercel auto-detects it as a static project |
| **Cloudflare Pages** | Connect your GitHub repo and deploy with default settings |
| **Any Web Server** | Copy all files to your server's web root directory |

> ⚠️ **WalletConnect note:** When deploying to a custom domain, update your WalletConnect Project ID's allowed origins in the [WalletConnect Cloud dashboard](https://cloud.walletconnect.com).

---

## 📸 Screenshots

<div align="center">

### Dashboard Overview
<img src="https://via.placeholder.com/800x450/0d0d1a/f59e0b?text=ORION+Dashboard+Preview" alt="Dashboard Preview" width="100%" style="border-radius:8px;border:1px solid rgba(255,255,255,0.1);margin-bottom:20px" />

### Wallet Connection
<img src="https://via.placeholder.com/600x350/0d0d1a/627eea?text=Connect+Wallet+Modal" alt="Connect Wallet" width="60%" style="border-radius:8px;border:1px solid rgba(255,255,255,0.1);margin-bottom:20px" />

### Portfolio Allocation Chart
<img src="https://via.placeholder.com/600x350/0d0d1a/10b981?text=Portfolio+Allocation+Chart" alt="Portfolio Chart" width="60%" style="border-radius:8px;border:1px solid rgba(255,255,255,0.1);margin-bottom:20px" />

</div>

> **📷 Replace the placeholder images above** with actual screenshots of the dashboard for a polished README. You can capture screenshots by opening `index.html` in your browser and using your OS screenshot tool.

---

## 🤝 Contributing

Contributions are welcome! This is a vanilla JS project intentionally kept simple — no build tools, no framework churn.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Open `index.html` in your browser to test
5. Commit and push (`git commit -m 'feat: add amazing feature'`)
6. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

Copyright © 2026 [whyuardi](https://github.com/whyuardi)

---

<div align="center">

**Built with** ❤️ and **zero build tools**

[![Ethers.js](https://img.shields.io/badge/powered%20by-Ethers.js-2535A0?logo=ethereum)](https://docs.ethers.org/)
[![Three.js](https://img.shields.io/badge/powered%20by-Three.js-000?logo=threedotjs)](https://threejs.org/)
[![Chart.js](https://img.shields.io/badge/powered%20by-Chart.js-FF6384?logo=chartdotjs)](https://www.chartjs.org/)
[![CoinGecko](https://img.shields.io/badge/powered%20by-CoinGecko-2D9CDB)](https://www.coingecko.com/en/api)

</div>
