const fetch = require('node-fetch');

async function test() {
  const res = await fetch('https://testnet.arcscan.app/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x24a93D7ac6fE6176C86E065fa1B3B651Cc9DB5FA');
  const data = await res.json();
  console.log("Factory logs count:", data.result ? data.result.length : 0);
  
  if (data.result && data.result.length > 0) {
      console.log("First log:", data.result[0]);
  }
}
test();
