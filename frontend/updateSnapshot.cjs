const fs = require('fs');
const { execSync } = require('child_process');
const { decodeEventLog } = require('viem');

// We use the pools from the factory
const FACTORY = "0x24a93D7ac6fE6176C86E065fa1B3B651Cc9DB5FA";

const poolCreatedAbi = {
  type: 'event',
  name: 'PoolCreated',
  inputs: [
    { type: 'address', name: 'token0', indexed: true },
    { type: 'address', name: 'token1', indexed: true },
    { type: 'address', name: 'pool' },
    { type: 'uint256', name: 'param' }
  ]
};

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

async function main() {
  console.log("Fetching factory pools from Arcscan...");
  let pools = [];
  try {
    const factoryLogsCmd = `curl -s "https://testnet.arcscan.app/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${FACTORY}"`;
    const factoryOutput = execSync(factoryLogsCmd).toString();
    const factoryData = JSON.parse(factoryOutput);
    
    if (factoryData.result && Array.isArray(factoryData.result)) {
      for (const log of factoryData.result) {
        try {
          const decoded = decodeEventLog({
            abi: [poolCreatedAbi],
            data: log.data,
            topics: log.topics
          });
          pools.push(decoded.args.pool.toLowerCase());
        } catch(e) {}
      }
    }
  } catch (err) {
    console.error("Failed to fetch factory pools");
  }

  console.log(`Found ${pools.length} pools. Fetching swaps...`);

  let allSwaps = [];
  let maxBlock = 0;

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
            
            const bn = parseInt(log.blockNumber, 16);
            if (bn > maxBlock) maxBlock = bn;

            allSwaps.push({
              pool,
              blockNumber: bn,
              args: {
                amount0In: decoded.args.amount0In.toString(),
                amount1In: decoded.args.amount1In.toString(),
                amount0Out: decoded.args.amount0Out.toString(),
                amount1Out: decoded.args.amount1Out.toString(),
                sender: decoded.args.sender,
                to: decoded.args.to
              }
            });
          } catch(e) {}
        }
      }
    } catch(e) {}
  }

  const snapshot = {
    lastBlock: maxBlock,
    swaps: allSwaps
  };

  fs.writeFileSync('src/config/volumeSnapshot.json', JSON.stringify(snapshot, null, 2));
  console.log(`Snapshot saved with ${allSwaps.length} swaps up to block ${maxBlock}.`);
}

main();
