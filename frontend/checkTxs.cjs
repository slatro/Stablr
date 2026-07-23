const { execSync } = require('child_process');

function getTxCount(address) {
  try {
     const cmd = `curl -s "https://testnet.arcscan.app/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10000"`;
     const output = JSON.parse(execSync(cmd).toString());
     return output.result ? output.result.length : 0;
  } catch(e) { return 0; }
}

console.log("Points:", getTxCount("0x0d08131435cf890e8B4426EA3E0e3B4425c3b33e"));
console.log("Staking:", getTxCount("0x3554D4d10682fdc680A2cb64ADa35f8E7a297a32"));
console.log("Faucet:", getTxCount("0x256B553b2Db34a0B10536cB4628610aFF4E1e7f6"));
