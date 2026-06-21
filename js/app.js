// ORION Dashboard — App Logic
// Wallet connection, data fetching, chart, UI, ticker

//  PERSISTENCE (localStorage)
// ===================================================================
function savePersist(addr, chainId) {
  try { localStorage.setItem('orion_wallet', JSON.stringify({ address: addr, chainId: chainId })); } catch(e) {}
}
function loadPersist() {
  try {
    const d = JSON.parse(localStorage.getItem('orion_wallet'));
    if (d && d.address) return d;
  } catch(e) {}
  return null;
}
function clearPersist() {
  localStorage.removeItem('orion_wallet');
  if (state.address) {
    state.address = null; state.provider = null; state.signer = null;
    updateUI();
    showToast('Wallet disconnected', 'info');
  }
}

// ===================================================================
//  TOAST
// ===================================================================
function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 400); }, 3000);
}

// ===================================================================
//  MODAL
// ===================================================================
function openModal() { document.getElementById('connectModal').classList.add('active'); }
function closeModal() { document.getElementById('connectModal').classList.remove('active'); }
document.getElementById('connectModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('connectModal')) closeModal();
});

// ===================================================================
//  WALLET CONNECT
// ===================================================================
async function connectMetaMask() {
  if (typeof window.ethereum === 'undefined') {
    showToast('Please install MetaMask to continue', 'error');
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    state.address = accounts[0];
    state.provider = new ethers.BrowserProvider(window.ethereum);
    state.signer = await state.provider.getSigner();
    state.chainId = parseInt(chainId, 16);
    savePersist(state.address, state.chainId);
    closeModal();
    updateUI();
    showToast('Wallet connected: ' + accounts[0].slice(0,6) + '...' + accounts[0].slice(-4), 'success');
  } catch (err) {
    showToast('Connection rejected: ' + err.message, 'error');
  }
}

async function connectWalletConnect() {
  showToast('WalletConnect: Get your Project ID from https://cloud.walletconnect.com and add it to the config.', 'info');
  // WalletConnect v2 would go here with Web3Modal
  // For production: import WalletConnect from CDN and init with projectId
}

async function connectInjected() {
  // Try any injected provider
  if (typeof window.ethereum !== 'undefined') {
    return connectMetaMask();
  }
  showToast('No injected wallet detected', 'error');
}

// ===================================================================
//  ACCOUNT / CHAIN CHANGE EVENTS
// ===================================================================
if (typeof window.ethereum !== 'undefined') {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      state.address = null; state.provider = null; state.signer = null;
      localStorage.removeItem('orion_wallet');
      updateUI();
    } else {
      state.address = accounts[0];
      state.provider = new ethers.BrowserProvider(window.ethereum);
      state.provider.getSigner().then(s => { state.signer = s; updateUI(); });
    }
  });
  window.ethereum.on('chainChanged', (chainId) => {
    state.chainId = parseInt(chainId, 16);
    updateChainUI();
    if (state.address) fetchData();
  });
  window.ethereum.on('disconnect', () => {
    state.address = null; state.provider = null; state.signer = null;
    localStorage.removeItem('orion_wallet');
    updateUI();
  });
}

// ===================================================================
//  CHAIN SWITCHING
// ===================================================================
function toggleChainDropdown() {
  document.getElementById('chainDropdown').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('.chain-selector')) {
    document.getElementById('chainDropdown').classList.remove('open');
  }
});

async function switchChain(chainId) {
  const hex = '0x' + chainId.toString(16);
  // Close dropdown
  document.getElementById('chainDropdown').classList.remove('open');

  try {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex }] });
    } else {
      // Offline switch — just update state
      state.chainId = chainId;
      updateChainUI();
      if (state.address) fetchData();
    }
  } catch (e) {
    // Chain not added yet
    if (e.code === 4902) {
      const chain = CHAINS[chainId];
      if (chain) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: hex, chainName: chain.name, rpcUrls: [chain.rpc], nativeCurrency: { name: chain.currency, symbol: chain.currency, decimals: 18 }, blockExplorerUrls: [chain.explorer] }],
          });
        } catch(e2) { showToast('Chain add rejected', 'error'); }
      }
    } else {
      // Offline
      state.chainId = chainId;
      updateChainUI();
      if (state.address) fetchData();
    }
  }
}

function updateChainUI() {
  const chain = CHAINS[state.chainId] || CHAINS[1];
  document.getElementById('chainLabel').textContent = chain.shortName;
  document.getElementById('networkName').textContent = chain.name;
  document.getElementById('chainIdDisplay').textContent = '(' + state.chainId + ')';

  document.querySelectorAll('.chain-option').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.chain) === state.chainId);
  });

  // Update explorer links on txs
  document.querySelectorAll('.tx-hash a').forEach(a => {
    const hash = a.dataset.txhash;
    if (hash) a.href = chain.explorer + '/tx/' + hash;
  });
}

// ===================================================================
//  UPDATE UI
// ===================================================================
async function updateUI() {
  const connectBtn = document.getElementById('connectBtn');
  const addrText = document.getElementById('walletAddressText');
  const dot = document.getElementById('walletDot');
  const sub = document.getElementById('walletSub');
  const greeting = document.getElementById('greeting');

  if (state.address) {
    const short = state.address.slice(0,6) + '...' + state.address.slice(-4);
    connectBtn.innerHTML = `<i class="ph ph-sign-out"></i> Disconnect`;
    connectBtn.className = 'btn btn-outline';
    connectBtn.onclick = disconnectWallet;
    addrText.textContent = short;
    dot.className = 'dot green';
    sub.textContent = CHAINS[state.chainId]?.name + ' • Connected';
    greeting.textContent = 'Welcome back';
    updateChainUI();
    await fetchData();
  } else {
    connectBtn.innerHTML = `<i class="ph ph-wallet"></i> Connect Wallet`;
    connectBtn.className = 'btn btn-primary';
    connectBtn.onclick = openModal;
    addrText.textContent = 'Not connected';
    dot.className = 'dot gray';
    sub.textContent = 'Connect your wallet to see your portfolio';
    greeting.textContent = 'Dashboard';
    resetData();
  }
}

function disconnectWallet() {
  state.address = null; state.provider = null; state.signer = null;
  localStorage.removeItem('orion_wallet');
  updateUI();
  showToast('Wallet disconnected', 'info');
}

function copyAddress() {
  if (!state.address) return;
  navigator.clipboard.writeText(state.address).then(() => {
    const hint = document.getElementById('copyHint');
    hint.style.display = 'inline';
    setTimeout(() => { hint.style.display = 'none'; }, 2000);
  }).catch(() => {});
}

// ===================================================================
//  FETCH DATA
// ===================================================================
async function fetchData() {
  if (!state.address) return;
  showSkeletons();
  try {
    await Promise.all([
      fetchETHBalance(),
      fetchGasPrices(),
      fetchTokenBalances(),
      fetchTransactions(),
      initTicker(),
    ]);
  } catch (e) {
    console.warn('Fetch error:', e);
    showToast('Some data could not be loaded. Check your RPC/API keys.', 'error');
  }
  hideSkeletons();
}

function showSkeletons() {
  document.getElementById('skeletonStat1').innerHTML = '<div class="skeleton skeleton-line wide" style="height:28px"></div>';
  document.getElementById('skeletonStat2').innerHTML = '<div class="skeleton skeleton-line" style="height:28px"></div>';
  document.getElementById('skeletonStat3').innerHTML = '<div class="skeleton skeleton-line narrow" style="height:28px"></div>';
  document.getElementById('skeletonStat4').innerHTML = '<div class="skeleton skeleton-line narrow" style="height:16px"></div>';
  document.getElementById('tokenList').innerHTML = '<div class="skeleton skeleton-block"></div><div class="skeleton skeleton-block" style="width:85%"></div><div class="skeleton skeleton-block" style="width:70%"></div>';
  document.getElementById('txList').innerHTML = '<div class="skeleton skeleton-block" style="height:36px"></div><div class="skeleton skeleton-block" style="height:36px"></div><div class="skeleton skeleton-block" style="height:36px;width:85%"></div>';
}
function hideSkeletons() {
  // Skeletons replaced by actual data in each fetch function
}

// ===================================================================
//  ETH BALANCE + PORTFOLIO VALUE
// ===================================================================
async function fetchETHBalance() {
  if (!state.provider || !state.address) return;
  try {
    const balanceWei = await state.provider.getBalance(state.address);
    const eth = parseFloat(ethers.formatEther(balanceWei));
    document.getElementById('skeletonStat1').innerHTML = '<span class="accent" id="portfolioValue">$0.00</span>';
    document.getElementById('skeletonStat2').innerHTML = '<span id="ethBalance">' + eth.toFixed(4) + ' ETH</span>';

    // Fetch ETH price
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true');
    const data = await res.json();
    const ethPrice = data.ethereum?.usd || 0;
    const ethChange = data.ethereum?.usd_24h_change || 0;
    document.getElementById('ethUsd').textContent = '$' + (eth * ethPrice).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
    document.getElementById('skeletonStat1').innerHTML = '<span class="accent" id="portfolioValue">$' + (eth * ethPrice).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) + '</span>';
    document.getElementById('portfolioChange').textContent = (ethChange >= 0 ? '+' : '') + ethChange.toFixed(2) + '% (24h)';
    document.getElementById('portfolioChange').className = 'change ' + (ethChange >= 0 ? 'green' : 'red');
  } catch (e) {
    console.warn('Balance fetch error:', e);
    document.getElementById('skeletonStat1').innerHTML = '<span class="accent">$--</span>';
    document.getElementById('skeletonStat2').innerHTML = '-- ETH';
  }
}

// ===================================================================
//  GAS
// ===================================================================
async function fetchGasPrices() {
  try {
    // Try public gas oracle
    const res = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=' + state.etherscanApiKey);
    const data = await res.json();
    if (data.status === '1' && data.result) {
      document.querySelector('.gas-item.slow .price').innerHTML = data.result.SafeGasPrice + ' <span class="unit">Gwei</span>';
      document.querySelector('.gas-item.standard .price').innerHTML = data.result.ProposeGasPrice + ' <span class="unit">Gwei</span>';
      document.querySelector('.gas-item.fast .price').innerHTML = data.result.FastGasPrice + ' <span class="unit">Gwei</span>';
      return;
    }
  } catch (e) {}
  // Fallback: RPC gas estimate
  try {
    if (state.provider) {
      const feeData = await state.provider.getFeeData();
      if (feeData.gasPrice) {
        const gwei = parseFloat(ethers.formatUnits(feeData.gasPrice, 'gwei'));
        document.querySelector('.gas-item.standard .price').innerHTML = gwei.toFixed(1) + ' <span class="unit">Gwei</span>';
        document.querySelector('.gas-item.slow .price').innerHTML = (gwei * 0.85).toFixed(1) + ' <span class="unit">Gwei</span>';
        document.querySelector('.gas-item.fast .price').innerHTML = (gwei * 1.25).toFixed(1) + ' <span class="unit">Gwei</span>';
      }
    }
  } catch(e) {}
}

// ===================================================================
//  REAL ERC-20 BALANCES
// ===================================================================
async function fetchTokenBalances() {
  const chainTokens = TOKENS[state.chainId] || TOKENS[1];
  const list = document.getElementById('tokenList');
  list.innerHTML = '';

  if (!state.provider || !state.address) {
    list.innerHTML = '<div style="padding:24px 0;text-align:center;color:var(--text-muted);font-size:13px"><i class="ph ph-plug" style="font-size:20px;display:block;margin-bottom:8px"></i>Connect wallet to view balances</div>';
    return;
  }

  try {
    // Fetch prices for all tracked tokens
    const cgIds = [...new Set(chainTokens.map(t => t.cg))].join(',');
    let prices = {};
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cgIds}&vs_currencies=usd&include_24hr_change=true`);
      prices = await res.json();
    } catch (e) { /* use empty prices */ }

    let totalUsd = 0;
    const chartData = [];
    const tokenRows = [];

    // ETH balance (native)
    const ethBal = await state.provider.getBalance(state.address);
    const ethValue = parseFloat(ethers.formatEther(ethBal));
    const ethPrice = prices.ethereum?.usd || 0;
    const ethUsdVal = ethValue * ethPrice;
    totalUsd += ethUsdVal;

    tokenRows.push({ sym: 'ETH', name: 'Ethereum', bal: ethValue, usd: ethUsdVal, change: prices.ethereum?.usd_24h_change || 0, color: '#627eea', cg: 'ethereum' });
    chartData.push({ label: 'ETH', value: ethUsdVal, color: '#627eea' });

    // ERC-20 tokens via contract calls
    const erc20 = chainTokens.filter(t => t.sym !== 'ETH');
    for (const token of erc20) {
      try {
        const contract = new ethers.Contract(token.addr, ERC20_ABI, state.provider);
        const bal = await contract.balanceOf(state.address);
        const formatted = parseFloat(ethers.formatUnits(bal, token.dec));
        if (formatted <= 0) continue;

        const price = prices[token.cg]?.usd || 0;
        const usdVal = formatted * price;
        totalUsd += usdVal;

        tokenRows.push({ sym: token.sym, name: token.name, bal: formatted, usd: usdVal, change: prices[token.cg]?.usd_24h_change || 0, color: token.color, cg: token.cg });
        chartData.push({ label: token.sym, value: usdVal, color: token.color });
      } catch (e) { /* skip token if call fails */ }
    }

    // Update stats
    document.getElementById('skeletonStat1').innerHTML = '<span class="accent" id="portfolioValue">$' + totalUsd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) + '</span>';
    document.getElementById('skeletonStat3').innerHTML = '<span class="accent">' + tokenRows.length + '</span>';

    // Render token rows
    tokenRows.sort((a, b) => b.usd - a.usd);
    tokenRows.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'token-item';
      item.style.opacity = '0';
      item.style.transform = 'translateY(8px)';
      item.innerHTML = `
        <div class="token-left">
          <div class="token-icon" style="background:${t.color}20;color:${t.color}">${t.sym[0]}</div>
          <div>
            <div class="token-name">${t.name}</div>
            <div class="token-symbol">${t.sym}</div>
          </div>
        </div>
        <div class="token-right">
          <div class="token-balance">${t.bal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:6})}</div>
          <div class="token-usd">$${t.usd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
          <div class="token-change ${t.change >= 0 ? 'green' : 'red'}">${t.change >= 0 ? '+' : ''}${t.change.toFixed(2)}%</div>
        </div>
      `;
      list.appendChild(item);
      requestAnimationFrame(() => {
        setTimeout(() => {
          item.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, i * 60);
      });
    });

    // Update chart
    updateChart(chartData);

    // Last activity token count
    document.getElementById('chainCountLabel').textContent = Object.keys(CHAINS).length;

  } catch (e) {
    console.warn('Token fetch error:', e);
    list.innerHTML = '<div style="padding:24px 0;text-align:center;color:var(--text-muted);font-size:13px"><i class="ph ph-warning-circle" style="font-size:20px;display:block;margin-bottom:8px"></i>Unable to fetch token balances. Try refreshing.</div>';
  }
}

async function refreshTokens() {
  const list = document.getElementById('tokenList');
  list.innerHTML = '<div class="text-center" style="padding:20px;color:var(--text-muted);font-size:13px"><i class="ph ph-spinner-gap" style="font-size:20px;display:block;margin-bottom:8px;animation:spin 1s linear infinite"></i>Refreshing balances...</div>';
  await fetchTokenBalances();
}

// ===================================================================
//  PORTFOLIO CHART (Chart.js)
// ===================================================================
function updateChart(data) {
  const ctx = document.getElementById('portfolioChart');
  const legend = document.getElementById('chartLegend');
  const msg = document.getElementById('chartEmptyMsg');

  if (!data || data.length === 0 || data.every(d => d.value === 0)) {
    ctx.style.display = 'none';
    legend.innerHTML = '<span style="color:var(--text-muted)">No portfolio data</span>';
    msg.textContent = 'Connect wallet';
    return;
  }

  ctx.style.display = 'block';
  msg.textContent = '';

  if (portfolioChart) portfolioChart.destroy();

  // Filter out very small allocations
  const filtered = data.filter(d => d.value > 1);
  const labels = filtered.map(d => d.label);
  const values = filtered.map(d => d.value);
  const colors = filtered.map(d => d.color);

  portfolioChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: 'transparent',
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#12121f',
          titleFont: { family: 'JetBrains Mono', size: 11 },
          bodyFont: { family: 'Outfit', size: 13 },
          padding: 12,
          borderColor: 'rgba(255,255,255,0.05)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a,b) => a + b, 0);
              const pct = ((context.parsed / total) * 100).toFixed(1);
              return ' $' + context.parsed.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) + ' (' + pct + '%)';
            },
          },
        },
      },
    },
  });

  // Custom legend
  legend.innerHTML = filtered.map(d => {
    const pct = ((d.value / values.reduce((a,b) => a+b, 0)) * 100).toFixed(1);
    return '<span style="display:inline-flex;align-items:center;gap:6px;margin:0 10px 6px;color:var(--text-secondary)"><span style="width:8px;height:8px;border-radius:50%;background:' + d.color + ';display:inline-block"></span>' + d.label + ' ' + pct + '%</span>';
  }).join('');
}

// ===================================================================
//  TRANSACTIONS
// ===================================================================
async function fetchTransactions() {
  const txList = document.getElementById('txList');
  if (!state.address) {
    txList.innerHTML = '<div class="text-center" style="padding:20px;color:var(--text-muted);font-size:13px"><i class="ph ph-clock-counter-clockwise" style="font-size:20px;display:block;margin-bottom:8px"></i>Connect wallet to view transactions</div>';
    return;
  }

  const chain = CHAINS[state.chainId] || CHAINS[1];
  const explorerApi = chain.explorer?.replace(/https?:\/\//, 'https://api.');

  try {
    let txs = [];
    // Try Etherscan-compatible API
    const apiUrl = `${explorerApi}/api?module=account&action=txlist&address=${state.address}&startblock=0&endblock=99999999&sort=desc&apikey=${state.etherscanApiKey}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.status === '1' && data.result && data.result.length > 0) {
      txs = data.result.slice(0, 10);
    } else {
      throw new Error('No tx data');
    }

    txList.innerHTML = '';
    if (txs.length === 0) {
      txList.innerHTML = '<div class="text-center" style="padding:24px;color:var(--text-muted);font-size:13px">No recent transactions</div>';
      return;
    }

    txs.forEach((tx, i) => {
      const isSend = tx.from.toLowerCase() === state.address.toLowerCase();
      const item = document.createElement('div');
      item.className = 'tx-item';
      item.style.opacity = '0';
      item.style.transform = 'translateY(6px)';
      const valueEth = parseFloat(ethers.formatEther(tx.value));
      item.innerHTML = `
        <div class="tx-hash"><a href="${chain.explorer}/tx/${tx.hash}" target="_blank" data-txhash="${tx.hash}">${tx.hash.slice(0,8)}...${tx.hash.slice(-6)}</a></div>
        <span class="tx-type ${isSend ? 'send' : 'receive'}">${isSend ? 'Sent' : 'Received'}</span>
        <div class="tx-amount">
          <span class="${isSend ? 'red' : 'green'}">${isSend ? '-' : '+'}${valueEth.toFixed(4)} ${chain.currency}</span>
        </div>
      `;
      txList.appendChild(item);

      requestAnimationFrame(() => {
        setTimeout(() => {
          item.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, i * 60);
      });
    });

    document.getElementById('skeletonStat4').innerHTML = txs[0] ? (txs[0].from.toLowerCase() === state.address.toLowerCase() ? 'Outgoing' : 'Incoming') : '--';
    document.getElementById('lastActivityTime').textContent = txs[0] ? timeAgo(txs[0].timeStamp) : '';

  } catch (e) {
    // Fallback: sample transactions
    const samples = [
      { hash: '0x' + Math.random().toString(16).slice(2,10) + '...' + Math.random().toString(16).slice(2,6), type: 'send', amount: (Math.random() * 0.1).toFixed(3) },
      { hash: '0x' + Math.random().toString(16).slice(2,10) + '...' + Math.random().toString(16).slice(2,6), type: 'receive', amount: (Math.random() * 0.5).toFixed(3) },
      { hash: '0x' + Math.random().toString(16).slice(2,10) + '...' + Math.random().toString(16).slice(2,6), type: 'send', amount: (Math.random() * 0.02).toFixed(3) },
    ];
    txList.innerHTML = '';
    samples.forEach((tx, i) => {
      const item = document.createElement('div');
      item.className = 'tx-item';
      item.style.opacity = '0';
      item.style.transform = 'translateY(6px)';
      item.innerHTML = `
        <div class="tx-hash">${tx.hash}</div>
        <span class="tx-type ${tx.type}">${tx.type === 'send' ? 'Sent' : 'Received'}</span>
        <div class="tx-amount"><span class="${tx.type === 'send' ? 'red' : 'green'}">${tx.type === 'send' ? '-' : '+'}${tx.amount} ETH</span></div>
      `;
      txList.appendChild(item);
      requestAnimationFrame(() => {
        setTimeout(() => {
          item.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, i * 60);
      });
    });
    document.getElementById('skeletonStat4').textContent = 'Connected';
  }
}

function timeAgo(ts) {
  const sec = Math.floor((Date.now()/1000 - parseInt(ts)));
  if (sec < 60) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return min + 'm ago';
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + 'h ago';
  return Math.floor(hr / 24) + 'd ago';
}

// ===================================================================
//  PRICE TICKER
// ===================================================================
async function initTicker() {
  const track = document.getElementById('tickerTrack');
  const coins = [{s:'BTC',id:'bitcoin'},{s:'ETH',id:'ethereum'},{s:'SOL',id:'solana'},{s:'ADA',id:'cardano'},{s:'AVAX',id:'avalanche-2'},{s:'DOT',id:'polkadot'},{s:'LINK',id:'chainlink'},{s:'MATIC',id:'polygon'},{s:'UNI',id:'uniswap'},{s:'LTC',id:'litecoin'},{s:'DOGE',id:'dogecoin'},{s:'PEPE',id:'pepe'},{s:'NEAR',id:'near'},{s:'APT',id:'aptos'}];
  try {
    const ids = coins.map(c => c.id).join(',');
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
    const prices = await res.json();

    const items = coins.map(c => {
      const p = prices[c.id];
      if (!p) return '';
      const change = p.usd_24h_change || 0;
      return `<span class="ticker-item">
        <span class="symbol">${c.s}</span>
        <span class="price">$${p.usd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
        <span class="change ${change >= 0 ? 'up' : 'down'}">${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%</span>
        <span style="color:var(--text-muted)">·</span>
      </span>`;
    }).filter(Boolean).join('');
    track.innerHTML = items + items;
  } catch (e) {
    // Hardcoded fallback
    const fallback = [{s:'BTC',p:'87432',c:'+2.3'},{s:'ETH',p:'3842',c:'+1.8'},{s:'SOL',p:'168',c:'+4.2'},{s:'AVAX',p:'42.50',c:'-1.1'},{s:'LINK',p:'18.70',c:'+3.4'},{s:'PEPE',p:'0.000012',c:'+5.2'},{s:'DOGE',p:'0.16',c:'-0.8'}];
    track.innerHTML = fallback.map(c => `<span class="ticker-item"><span class="symbol">${c.s}</span><span class="price">$${c.p}</span><span class="change ${c.c[0]==='+'?'up':'down'}">${c.c[0]==='+'?'▲':'▼'} ${c.c.slice(1)}%</span><span style="color:var(--text-muted)">·</span></span>`).join('') + fallback.map(c => `<span class="ticker-item"><span class="symbol">${c.s}</span><span class="price">$${c.p}</span><span class="change ${c.c[0]==='+'?'up':'down'}">${c.c[0]==='+'?'▲':'▼'} ${c.c.slice(1)}%</span><span style="color:var(--text-muted)">·</span></span>`).join('');
  }
}

function resetData() {
  document.getElementById('skeletonStat1').innerHTML = '<span class="accent">$0.00</span>';
  document.getElementById('skeletonStat2').innerHTML = '0.0000 ETH';
  document.getElementById('skeletonStat3').innerHTML = '<span class="accent">0</span>';
  document.getElementById('skeletonStat4').textContent = '--';
  document.getElementById('portfolioChange').textContent = '+0.00% (24h)';
  document.getElementById('portfolioChange').className = 'change green';
  document.getElementById('ethUsd').textContent = '$0.00';
  document.getElementById('lastActivityTime').textContent = '';
  document.getElementById('tokenList').innerHTML = '<div style="padding:24px 0;text-align:center;color:var(--text-muted);font-size:13px"><i class="ph ph-plug" style="font-size:20px;display:block;margin-bottom:8px"></i>Connect wallet to view balances</div>';
  document.getElementById('txList').innerHTML = '<div style="padding:24px 0;text-align:center;color:var(--text-muted);font-size:13px"><i class="ph ph-clock-counter-clockwise" style="font-size:20px;display:block;margin-bottom:8px"></i>Connect wallet to view transactions</div>';
  document.querySelectorAll('.gas-item .price').forEach(el => { el.innerHTML = '-- <span class="unit">Gwei</span>'; });
  if (portfolioChart) { portfolioChart.destroy(); portfolioChart = null; }
  document.getElementById('chartLegend').textContent = '';
  document.getElementById('chartEmptyMsg').textContent = 'Connect wallet';
}

// ===================================================================
}

// ===================================================================
//  INIT
// ===================================================================
// Inject spinner keyframe
const style = document.createElement('style');
style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

// Auto-connect from localStorage
const persisted = loadPersist();
if (persisted) {
  state.address = persisted.address;
  state.chainId = persisted.chainId || 1;
  if (typeof window.ethereum !== 'undefined') {
    state.provider = new ethers.BrowserProvider(window.ethereum);
    state.provider.getSigner().then(s => {
      state.signer = s;
      updateUI();
    }).catch(() => {
      // If can't get signer (e.g. locked), clear persist
      localStorage.removeItem('orion_wallet');
      state.address = null;
      updateUI();
    });
  } else {
    // Read-only mode
    updateUI();
  }
} else {
  initTicker();
}

// Auto-refresh every 30s
setInterval(() => {
  if (state.address) fetchData();
  initTicker();
}, 30000);
