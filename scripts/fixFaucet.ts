import { ethers } from "hardhat";

const FAUCET_ADDRESS = "0x256B553b2Db34a0B10536cB4628610aFF4E1e7f6";
const TOKENS = [
  { addr: "0xeD7cb772b49448027901546870425579596faaE1", symbol: "aUSDC", decimals: 6, amount: "100" },
  { addr: "0x429a1D105558f4727453d2a17dF17ac9d5be1EA9", symbol: "aEURC", decimals: 18, amount: "90" },
  { addr: "0x8DD16a98A3f5d767d5D08bEECbEa1Cd8CF2832ee", symbol: "aTRYC", decimals: 18, amount: "3000" },
  { addr: "0x6374151C499DADc9A54650D25CdFF3B5688652Ba", symbol: "aGBPC", decimals: 18, amount: "80" },
  { addr: "0x7b765B44C9AF5EBb191296A05C8b9df5085f1f09", symbol: "aJPYC", decimals: 18, amount: "15000" },
];

const FAUCET_ABI = [
  "function claim() external",
  "function tokens(uint256) external view returns (address)",
  "function amounts(uint256) external view returns (uint256)",
  "function setTokensAndAmounts(address[] calldata, uint256[] calldata) external",
  "function lastFaucetTime(address) external view returns (uint256)",
  "function COOLDOWN() external view returns (uint256)",
  "function getNextAvailableTime(address) external view returns (uint256)"
];

const ERC20_ABI = [
  "function balanceOf(address) external view returns (uint256)",
  "function transfer(address, uint256) external returns (bool)",
  "function decimals() external view returns (uint8)"
];

const MINTABLE_ABI = [
  "function mint(address to, uint256 amount) external",
  "function minters(address) external view returns (bool)",
  "function owner() external view returns (address)"
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Signer:", signer.address);

  const faucet = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);

  // 1. Check current tokens in faucet
  console.log("\n=== Checking Faucet Token Config ===");
  let tokenCount = 0;
  try {
    for (let i = 0; i < 10; i++) {
      try {
        const t = await faucet.tokens(i);
        const a = await faucet.amounts(i);
        console.log(`Token[${i}]: ${t}, amount: ${a.toString()}`);
        tokenCount++;
      } catch (e) {
        break;
      }
    }
  } catch (e) {
    console.log("Could not read tokens array:", e);
  }

  if (tokenCount === 0) {
    console.log("No tokens configured! Setting tokens and amounts...");
    const addrs = TOKENS.map(t => t.addr);
    const amts = TOKENS.map(t => ethers.parseUnits(t.amount, t.decimals));
    const tx = await faucet.setTokensAndAmounts(addrs, amts);
    await tx.wait();
    console.log("✅ setTokensAndAmounts done. tx:", tx.hash);
  }

  // 2. Check if faucet can mint each token
  console.log("\n=== Checking Mint Permissions & Balances ===");
  for (const t of TOKENS) {
    try {
      const mintable = new ethers.Contract(t.addr, MINTABLE_ABI, signer);
      const isMinter = await mintable.minters(FAUCET_ADDRESS);
      const erc20 = new ethers.Contract(t.addr, ERC20_ABI, signer);
      const bal = await erc20.balanceOf(FAUCET_ADDRESS);
      const neededAmount = ethers.parseUnits(t.amount, t.decimals);
      console.log(`${t.symbol}: isMinter=${isMinter}, faucetBalance=${ethers.formatUnits(bal, t.decimals)}`);
      
      if (!isMinter && bal < neededAmount) {
        console.log(`  → Sending ${t.amount} ${t.symbol} to faucet...`);
        try {
          const sendTx = await erc20.transfer(FAUCET_ADDRESS, neededAmount * 100n); // send 100x to last longer
          await sendTx.wait();
          console.log(`  ✅ Sent ${t.symbol} to faucet`);
        } catch (err: any) {
          console.log(`  ❌ Transfer failed for ${t.symbol}: ${err.message?.slice(0, 100)}`);
          // Try minting directly to faucet as owner
          try {
            const mintTx = await mintable.mint(FAUCET_ADDRESS, neededAmount * 100n);
            await mintTx.wait();
            console.log(`  ✅ Minted ${t.symbol} to faucet`);
          } catch (mintErr: any) {
            console.log(`  ❌ Mint also failed: ${mintErr.message?.slice(0, 100)}`);
          }
        }
      }
    } catch (e: any) {
      console.log(`${t.symbol}: Error - ${e.message?.slice(0, 80)}`);
    }
  }

  // 3. Cooldown check for signer
  const nextTime = await faucet.getNextAvailableTime(signer.address);
  const now = Math.floor(Date.now() / 1000);
  console.log(`\n=== Cooldown for ${signer.address} ===`);
  console.log(`Next available: ${new Date(Number(nextTime) * 1000).toISOString()}`);
  console.log(`Can claim now: ${Number(nextTime) <= now}`);
}

main().catch(console.error);
