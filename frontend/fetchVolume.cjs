const fs = require('fs');
const { execSync } = require('child_process');
const { decodeEventLog } = require('viem');

const pools = JSON.parse(fs.readFileSync('pools.json', 'utf8'));

const swapAbi = {
  type: 'event',
  name: 'Swap',
  inputs: [
    { type: 'address', name: 'sender', indexed: true },
    { type: 'uint256', name: 'amount0In' },
    { type: 'uint256', name: 'amount1In' },
    { type: 'uint256', name: 'amount0Out' },
    { type: 'uint256', name: 'amount1Out' },
    { type: 'address', name: 'to', indexed: true }
  ]
};

const KNOWN_PRICES = {
  USDC: 1.0,
  aUSDC: 1.0,
  aEURC: 1.08,
  aTRYC: 0.031,
  aGBPC: 1.25,
  aJPYC: 0.0065,
  astUSDC: 1.0,
  EURC: 1.08
};

// Simplified: just count total logs for now to test if they exist!
let totalSwaps = 0;
let lastBlock = 0;

for (const pool of pools) {
  try {
    const cmd = `curl -s "https://testnet.arcscan.app/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${pool}"`;
    const output = execSync(cmd).toString();
    const data = JSON.parse(output);
    
    if (data.result && Array.isArray(data.result)) {
      for (const log of data.result) {
        try {
          const decoded = decodeEventLog({
            abi: [swapAbi],
            data: log.data,
            topics: log.topics
          });
          totalSwaps++;
          const bn = parseInt(log.blockNumber, 16);
          if (bn > lastBlock) lastBlock = bn;
        } catch(e) {}
      }
    }
  } catch(e) {
    console.log("Error fetching pool", pool);
  }
}

console.log("Total real swaps found:", totalSwaps);
console.log("Latest block:", lastBlock);
