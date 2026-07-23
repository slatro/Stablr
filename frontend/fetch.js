import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  transport: http('https://rpc.testnet.arc.network')
});

async function run() {
  const currentBlock = await client.getBlockNumber();
  console.log("Current block:", currentBlock);
  
  try {
     const logs = await client.getLogs({
        fromBlock: currentBlock - 10000n,
        toBlock: currentBlock
     });
     console.log(logs.length, "logs found");
  } catch(e) {
     console.error("Error fetching logs:", e);
  }
}

run();
