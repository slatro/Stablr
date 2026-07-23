const { execSync } = require('child_process');

try {
  const FACTORY = "0xEc75012654E1153bFf8a1a3AE5C409F8a9d0f62c";
  const cmdFactory = `curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"address":"${FACTORY}","fromBlock":"0x0","toBlock":"latest"}],"id":1}' https://rpc.testnet.arc.network/`;
  const factoryOutput = JSON.parse(execSync(cmdFactory).toString());
  
  if (!factoryOutput.result || factoryOutput.result.length === 0) {
    console.log("No pools created by old factory");
    process.exit(0);
  }
  
  let totalSwaps = 0;
  for (const log of factoryOutput.result) {
    // extract pool address (it's the second non-indexed param, so it's in data or topics depending on abi, but in PoolCreated pool is data[0])
    // data is 0x000...poolAddress000...param
    const poolAddr = "0x" + log.data.slice(26, 66);
    const cmdPool = `curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"address":"${poolAddr}","fromBlock":"0x0","toBlock":"latest"}],"id":1}' https://rpc.testnet.arc.network/`;
    try {
       const poolOutput = JSON.parse(execSync(cmdPool).toString());
       if (poolOutput.result) {
           totalSwaps += poolOutput.result.length;
       }
    } catch(e) {}
  }
  
  console.log("Total logs in old factory pools:", totalSwaps);
} catch (e) {
  console.error("Error", e);
}
