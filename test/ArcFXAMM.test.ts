import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

describe("ArcFXAMM - Stablr StableSwap Suite", function () {
  let owner: any;
  let user: any;
  let usdc: any;
  let eurc: any;
  let amm: any;

  const MINT_AMOUNT_USDC = ethers.parseUnits("1000000", 6);
  const MINT_AMOUNT_EURC = ethers.parseUnits("1000000", 18);
  
  const LIQUIDITY_USDC = ethers.parseUnits("1000", 6);    // 1,000 USDC
  const LIQUIDITY_EURC = ethers.parseUnits("1000", 18);   // 1,000 EURC

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();

    const MockEURC = await ethers.getContractFactory("MockEURC");
    eurc = await MockEURC.deploy();

    const ArcFXAMM = await ethers.getContractFactory("ArcFXAMM");
    amm = await ArcFXAMM.deploy(await usdc.getAddress(), await eurc.getAddress());

    // Minting
    await usdc.mint(owner.address, MINT_AMOUNT_USDC);
    await eurc.mint(owner.address, MINT_AMOUNT_EURC);
    await usdc.mint(user.address, MINT_AMOUNT_USDC);
    await eurc.mint(user.address, MINT_AMOUNT_EURC);

    // Approvals
    await usdc.approve(await amm.getAddress(), MINT_AMOUNT_USDC);
    await eurc.approve(await amm.getAddress(), MINT_AMOUNT_EURC);
    await usdc.connect(user).approve(await amm.getAddress(), MINT_AMOUNT_USDC);
    await eurc.connect(user).approve(await amm.getAddress(), MINT_AMOUNT_EURC);
  });

  describe("1. Deployment & Metadata", function () {
    it("Should correctly set token addresses and decimals", async function () {
      expect(await amm.token0()).to.equal(await usdc.getAddress());
      expect(await amm.token1()).to.equal(await eurc.getAddress());
      expect(await amm.decimals0()).to.equal(6);
      expect(await amm.decimals1()).to.equal(18);
    });
  });

  describe("2. Liquidity & Stableswap Pricing Math", function () {
    beforeEach(async function () {
      await amm.addLiquidity(LIQUIDITY_USDC, LIQUIDITY_EURC, owner.address);
    });

    it("Should compute StableSwap out amounts with low slippage", async function () {
      const amountIn = ethers.parseUnits("100", 6); // 100 USDC (6 decimals)
      
      const expectedOut = await amm.getAmountOut(amountIn, await usdc.getAddress());
      
      // With constant product, swapping 10% of liquidity gives high slippage (10% slippage).
      // With StableSwap curve, swapping 100 USDC into 1000/1000 pool should yield very close to 100 EURC (less than 1% slippage).
      // Let's verify that expectedOut is close to 100 EURC (98-100 EURC)
      expect(expectedOut).to.be.gt(ethers.parseUnits("98", 18));
      expect(expectedOut).to.be.lt(ethers.parseUnits("100", 18));
    });

    it("Should execute stable swap successfully", async function () {
      const amountIn = ethers.parseUnits("50", 6); // 50 USDC
      const expectedOut = await amm.getAmountOut(amountIn, await usdc.getAddress());

      const initialEurc = await eurc.balanceOf(user.address);
      await amm.connect(user).swap(await usdc.getAddress(), amountIn, 0, user.address);
      const finalEurc = await eurc.balanceOf(user.address);

      expect(finalEurc - initialEurc).to.equal(expectedOut);
    });
  });
});
