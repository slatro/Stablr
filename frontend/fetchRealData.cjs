const fs = require('fs');
const { execSync } = require('child_process');

function curlRpc(method, params) {
  const data = JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 });
  const cmd = `curl -s -X POST -H "Content-Type: application/json" --data '${data}' https://rpc.testnet.arc.network/`;
  try {
    const res = execSync(cmd).toString();
    return JSON.parse(res);
  } catch (e) {
    return { result: null };
  }
}

async function main() {
  console.log("Fetching REAL on-chain data using RPC...");
  
  const blockRes = curlRpc("eth_blockNumber", []);
  const currentBlock = blockRes.result ? parseInt(blockRes.result, 16) : 0;
  
  const FACTORY_ADDRESS = "0x24a93D7ac6fE6176C86E065fa1B3B651Cc9DB5FA";
  const OLD_FACTORY = "0xEc75012654E1153bFf8a1a3AE5C409F8a9d0f62c";

  const pools = new Set();
  const tokens = {
    "0xed7cb772b49448027901546870425579596faae1": 6, // aUSDC
    "0x429a1d105558f4727453d2a17df17ac9d5be1ea9": 18, // aEURC
    "0x8dd16a98a3f5d767d5d08beecbea1cd8cf2832ee": 18, // aTRYC
    "0x6374151c499dadc9a54650d25cdff3b5688652ba": 18, // aGBPC
    "0x7b765b44c9af5ebb191296a05c8b9df5085f1f09": 18, // aJPYC
    "0x3554d4d10682fdc680a2cb64ada35f8e7a297a32": 6, // astUSDC
    "0x3600000000000000000000000000000000000000": 6, // USDC Native
    "0x89b50855aa3be2f677cd6303cec089b5f319d72a": 6 // EURC Native
  };
  const poolToken0 = {};

  const getPools = (factory) => {
    const logsRes = curlRpc("eth_getLogs", [{
      address: factory,
      topics: ["0xebbbe9dc3a19d2f959ac76ac0372b4983cdfb945f5d6aef4873c36fabb2ba8aa"],
      fromBlock: "0x0",
      toBlock: "latest"
    }]);
    if (logsRes.result) {
      for (const log of logsRes.result) {
        const t0 = "0x" + log.topics[1].slice(26);
        const pool = "0x" + log.data.slice(26, 66);
        pools.add(pool.toLowerCase());
        poolToken0[pool.toLowerCase()] = t0.toLowerCase();
      }
    }
  };

  getPools(FACTORY_ADDRESS);
  getPools(OLD_FACTORY);
  
  console.log(`Found ${pools.size} pools across factories.`);

  let totalVolume = 0;
  const dailyVolumes = new Map();

  for (const pool of Array.from(pools)) {
    console.log(`Fetching swaps for pool ${pool}...`);
    const logsRes = curlRpc("eth_getLogs", [{
      address: pool,
      topics: ["0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"],
      fromBlock: "0x0",
      toBlock: "latest"
    }]);
    
    if (logsRes.result) {
      for (const log of logsRes.result) {
        const t0Addr = poolToken0[pool];
        const decimals = tokens[t0Addr] || 6;
        
        const dataStr = log.data.replace("0x", "");
        if (dataStr.length >= 256) {
           const amount0In = BigInt("0x" + dataStr.slice(0, 64));
           const amount0Out = BigInt("0x" + dataStr.slice(128, 192));
           const amount0 = amount0In > 0n ? amount0In : amount0Out;
           const usdValue = Number(amount0) / (10 ** decimals);
           if (isFinite(usdValue) && usdValue < 10000000) {
              totalVolume += usdValue;
              
              const logBlock = parseInt(log.blockNumber, 16);
              const blockDiff = currentBlock - logBlock;
              const ageMs = blockDiff * 2000;
              const date = new Date(Date.now() - ageMs).toISOString().split('T')[0];
              dailyVolumes.set(date, (dailyVolumes.get(date) || 0) + usdValue);
           }
        }
      }
    }
  }

  const sortedDates = Array.from(dailyVolumes.entries()).sort((a,b) => a[0].localeCompare(b[0]));
  const chartValues = sortedDates.slice(-7).map(e => Math.round(e[1]));
  while (chartValues.length < 7) chartValues.unshift(0);

  const snapshot = {
    description: "REAL ON-CHAIN SNAPSHOT DIRECTLY FROM RPC",
    snapshotBlock: currentBlock,
    baseTvl: 0,
    baseVolume: totalVolume,
    baseChart: chartValues
  };

  fs.writeFileSync('src/config/historicalData.json', JSON.stringify(snapshot, null, 2));
  console.log(`Saved REAL snapshot. Volume = $${totalVolume}`);
}

main().catch(console.error);
