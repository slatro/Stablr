const fs = require('fs');
const { decodeEventLog } = require('viem');
const data = JSON.parse(fs.readFileSync('factory_logs.json', 'utf8'));

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

const pools = [];
if (data.result && Array.isArray(data.result)) {
  for (const log of data.result) {
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
fs.writeFileSync('pools.json', JSON.stringify(pools));
console.log("Pools found:", pools.length);
