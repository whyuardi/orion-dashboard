// ORION Dashboard — Config
// Chain configs, token addresses, ERC-20 ABIs, constants

// ===================================================================
//  STATE
// ===================================================================
const state = {
  address: null,
  provider: null,
  signer: null,
  chainId: 1,
  etherscanApiKey: '',
};
let portfolioChart = null;

// Chain config
const CHAINS = {
  1:    { name: 'Ethereum Mainnet', shortName: 'Ethereum', rpc: 'https://eth.llamarpc.com', explorer: 'https://etherscan.io', currency: 'ETH', color: '#627eea' },
  137:  { name: 'Polygon Mainnet', shortName: 'Polygon', rpc: 'https://polygon.llamarpc.com', explorer: 'https://polygonscan.com', currency: 'MATIC', color: '#8247e5' },
  56:   { name: 'BNB Chain', shortName: 'BNB Chain', rpc: 'https://binance.llamarpc.com', explorer: 'https://bscscan.com', currency: 'BNB', color: '#f0b90b' },
  42161: { name: 'Arbitrum One', shortName: 'Arbitrum', rpc: 'https://arbitrum.llamarpc.com', explorer: 'https://arbiscan.io', currency: 'ETH', color: '#2d374b' },
  10:   { name: 'Optimism', shortName: 'Optimism', rpc: 'https://optimism.llamarpc.com', explorer: 'https://optimistic.etherscan.io', currency: 'ETH', color: '#ff0420' },
};

// Tokens per chain (address, symbol, name, decimals, coingeckoId)
const TOKENS = {
  1: [
    { addr: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', sym: 'USDC', name: 'USD Coin', dec: 6, cg: 'usd-coin', color: '#2775CA' },
    { addr: '0xdAC17F958D2ee523a2206206994597C13D831ec7', sym: 'USDT', name: 'Tether', dec: 6, cg: 'tether', color: '#26A17B' },
    { addr: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', sym: 'WBTC', name: 'Wrapped Bitcoin', dec: 8, cg: 'wrapped-bitcoin', color: '#F7931A' },
    { addr: '0x514910771AF9Ca656af840dff83E8264EcF986CA', sym: 'LINK', name: 'Chainlink', dec: 18, cg: 'chainlink', color: '#375BD2' },
    { addr: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', sym: 'UNI', name: 'Uniswap', dec: 18, cg: 'uniswap', color: '#FF007A' },
    { addr: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', sym: 'MATIC', name: 'Polygon', dec: 18, cg: 'polygon', color: '#8247e5' },
    { addr: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', sym: 'PEPE', name: 'Pepe', dec: 18, cg: 'pepe', color: '#2E8B57' },
  ],
  137: [
    { addr: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', sym: 'USDC', name: 'USD Coin', dec: 6, cg: 'usd-coin', color: '#2775CA' },
    { addr: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', sym: 'USDT', name: 'Tether', dec: 6, cg: 'tether', color: '#26A17B' },
    { addr: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', sym: 'WETH', name: 'Wrapped Ether', dec: 18, cg: 'ethereum', color: '#627eea' },
    { addr: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', sym: 'WMATIC', name: 'Wrapped Matic', dec: 18, cg: 'polygon', color: '#8247e5' },
  ],
  56: [
    { addr: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', sym: 'USDC', name: 'USD Coin', dec: 18, cg: 'usd-coin', color: '#2775CA' },
    { addr: '0x55d398326f99059fF775485246999027B3197955', sym: 'USDT', name: 'Tether', dec: 18, cg: 'tether', color: '#26A17B' },
    { addr: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', sym: 'WETH', name: 'Wrapped Ether', dec: 18, cg: 'ethereum', color: '#627eea' },
    { addr: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', sym: 'WBTC', name: 'Wrapped Bitcoin', dec: 18, cg: 'wrapped-bitcoin', color: '#F7931A' },
  ],
  42161: [
    { addr: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', sym: 'USDC', name: 'USD Coin', dec: 6, cg: 'usd-coin', color: '#2775CA' },
    { addr: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', sym: 'USDT', name: 'Tether', dec: 6, cg: 'tether', color: '#26A17B' },
    { addr: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', sym: 'WBTC', name: 'Wrapped Bitcoin', dec: 8, cg: 'wrapped-bitcoin', color: '#F7931A' },
  ],
  10: [
    { addr: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', sym: 'USDC', name: 'USD Coin', dec: 6, cg: 'usd-coin', color: '#2775CA' },
    { addr: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', sym: 'USDT', name: 'Tether', dec: 6, cg: 'tether', color: '#26A17B' },
    { addr: '0x68f180fcCe6836688e9084f035309E29Bf0A2095', sym: 'WBTC', name: 'Wrapped Bitcoin', dec: 8, cg: 'wrapped-bitcoin', color: '#F7931A' },
  ],
};

// ERC-20 minimal ABI
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

// Scroll listener for 3D parallax
let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; }, {passive:true});

// ===================================================================
