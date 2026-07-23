import { ethers } from "hardhat";

const FAUCET_ADDRESS = "0x256B553b2Db34a0B10536cB4628610aFF4E1e7f6";
const TOKENS = [
  { addr: "0xeD7cb772b49448027901546870425579596faaE1", symbol: "aUSDC", decimals: 6, sendAmount: "50000" },
  { addr: "0x429a1D105558f4727453d2a17dF17ac9d5be1EA9", symbol: "aEURC", decimals: 18, sendAmount: "50000" },
  { addr: "0x8DD16a98A3f5d767d5D08bEECbEa1Cd8CF2832ee", symbol: "aTRYC", decimals: 18, sendAmount: "2000000" },
  { addr: "0x6374151C499DADc9A54650D25CdFF3B5688652Ba", symbol: "aGBPC", decimals: 18, sendAmount: "50000" },
  { addr: "0x7b765B44C9AF5EBb191296A05C8b9df5085f1f09", symbol: "aJPYC", decimals: 18, sendAmount: "10000000" },
];

const ERC20_ABI = [
  "function balanceOf(address) external view returns (uint256)",
  "function transfer(address, uint256) external returns (bool)",
  "function owner() external view returns (address)",
];

const MINTABLE_ABI = [
  "function mint(address to, uint256 amount) external",
  "function owner() external view returns (address)",
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Signer:", signer.address);

  for (const t of TOKENS) {
    console.log(`\n=== ${t.symbol} (${t.addr}) ===`);
    const erc20 = new ethers.Contract(t.addr, ERC20_ABI, signer);
    
    // Check owner
    try {
      const owner = await erc20.owner();
      console.log(`Owner: ${owner}`);
    } catch(e) { console.log("No owner() fn"); }

    // Check signer balance
    try {
      const bal = await erc20.balanceOf(signer.address);
      console.log(`Signer balance: ${ethers.formatUnits(bal, t.decimals)}`);
    } catch(e: any) { console.log("balanceOf error:", e.message?.slice(0,60)); }

    // Check faucet balance
    try {
      const faucetBal = await erc20.balanceOf(FAUCET_ADDRESS);
      console.log(`Faucet balance: ${ethers.formatUnits(faucetBal, t.decimals)}`);
    } catch(e: any) { console.log("faucetBalance error:", e.message?.slice(0,60)); }

    // Try to mint to faucet
    const mintable = new ethers.Contract(t.addr, MINTABLE_ABI, signer);
    const faucetNeed = ethers.parseUnits(t.sendAmount, t.decimals);
    try {
      console.log(`Minting ${t.sendAmount} ${t.symbol} to faucet...`);
      const tx = await mintable.mint(FAUCET_ADDRESS, faucetNeed);
      await tx.wait();
      console.log(`✅ Minted! tx: ${tx.hash}`);
    } catch (mintErr: any) {
      console.log(`❌ Mint failed: ${mintErr.message?.slice(0, 100)}`);
      // Try transfer from signer balance
      try {
        const signerBal = await erc20.balanceOf(signer.address);
        if (signerBal >= faucetNeed) {
          console.log(`Transferring from signer...`);
          const tx = await erc20.transfer(FAUCET_ADDRESS, faucetNeed);
          await tx.wait();
          console.log(`✅ Transferred! tx: ${tx.hash}`);
        } else {
          console.log(`❌ Not enough balance to transfer. Signer has: ${ethers.formatUnits(signerBal, t.decimals)}`);
        }
      } catch (transferErr: any) {
        console.log(`❌ Transfer also failed: ${transferErr.message?.slice(0, 80)}`);
      }
    }
  }

  console.log("\n✅ Done!");
}

main().catch(console.error);
