
export const ARC_TESTNET_CONFIG = {
  chainId: 5042002,
  hexChainId: "0x4CEF72",
  chainName: "Arc Testnet",
  rpcUrl: "https://rpc.testnet.arc.network",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  blockExplorerUrl: "https://testnet.arcscan.app",
};

export const CONTRACT_ADDRESSES = {
  mUSDC: "0x6DFb8915F8113E23A4EC5bb8Ab36B44eb0DE1f28",
  mEURC: "0xA68D3ef7e14BB0FAD89F0AB98bC479e38C81efc5",
  AMM: "0x40eAa768683fD6e87e6bF15b33150fb69a54214b",
} as const;
