import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowUpDown, Settings, Wallet, RefreshCw } from 'lucide-react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import ERC20_ABI from '../abis/ERC20.json';
import AMM_ABI from '../abis/ArcFXAMM.json';

/* 
  ARCFX TERMINAL - REAL-TIME SYNC v3.0
  - Live Blockchain Data Integration
  - Decimal Handling (USDC 6, EURC 18)
  - 506px Fixed Height
*/

const TOKENS = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: CONTRACT_ADDRESSES.mUSDC,
    decimals: 6,
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    color: "bg-blue-500"
  },
  EURC: {
    symbol: "EURC",
    name: "Euro Coin",
    address: CONTRACT_ADDRESSES.mEURC,
    decimals: 18,
    icon: "https://cryptologos.cc/logos/euro-coin-eurc-logo.png",
    color: "bg-indigo-600"
  }
};

export const SwapCard = () => {
  const { address, isConnected } = useAccount();
  const [fromToken, setFromToken] = useState(TOKENS.USDC);
  const [toToken, setToToken] = useState(TOKENS.EURC);
  const [amount, setAmount] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Fetch Balances
  const { data: fromBalance, refetch: refetchFromBalance } = useReadContract({
    address: fromToken.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: toBalance, refetch: refetchToBalance } = useReadContract({
    address: toToken.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // 2. Fetch AMM Reserves
  const { data: reserves, refetch: refetchReserves } = useReadContract({
    address: CONTRACT_ADDRESSES.AMM as `0x${string}`,
    abi: AMM_ABI,
    functionName: 'getReserves',
  });

  // 3. Calculate Rate
  const [resA, resB] = (reserves as [bigint, bigint]) || [0n, 0n];
  const rate = resA > 0n 
    ? Number(formatUnits(resB, 18)) / Number(formatUnits(resA, 6)) 
    : 1.08; // fallback to market rate

  const quote = amount && !isNaN(parseFloat(amount))
    ? (parseFloat(amount) * (fromToken.symbol === 'USDC' ? rate : 1/rate)).toFixed(4)
    : '0.00';

  // 4. Swap Execution
  const { writeContract: swapWrite, data: swapHash } = useWriteContract();
  const { isLoading: isSwapping, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({ hash: swapHash });

  useEffect(() => {
    if (isSwapSuccess) {
      refetchFromBalance();
      refetchToBalance();
      refetchReserves();
      setAmount('');
    }
  }, [isSwapSuccess]);

  const handleSwap = async () => {
    if (!amount || !address) return;
    const amountIn = parseUnits(amount, fromToken.decimals);
    
    swapWrite({
      address: CONTRACT_ADDRESSES.AMM as `0x${string}`,
      abi: AMM_ABI,
      functionName: 'swap',
      args: [fromToken.address, amountIn, 0n], // minAmountOut = 0 for simplicity
    });
  };

  const handleSwitch = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchReserves(), refetchFromBalance(), refetchToBalance()]);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="flex flex-col h-[506px] w-full max-w-[480px] bg-[#111111] border border-white/[0.05] rounded-[32px] overflow-hidden shadow-2xl relative">
      {/* HEADER */}
      <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          Swap
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </h2>
        <button className="p-2 rounded-xl hover:bg-white/5 transition-all text-white/20 hover:text-white">
          <Settings size={20} />
        </button>
      </div>

      {/* BODY */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        {/* FROM BOX */}
        <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-[24px] p-6 flex flex-col justify-center group hover:bg-white/[0.05] transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Pay</span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
              <Wallet size={12} className="text-blue-400" />
              <span>Balance: {fromBalance ? Number(formatUnits(fromBalance as bigint, fromToken.decimals)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}</span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" 
              className="bg-transparent text-4xl font-bold text-white outline-none w-full placeholder:text-white/5"
            />
            <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <img src={fromToken.icon} alt={fromToken.symbol} className="w-7 h-7 rounded-full shadow-lg" />
              <span className="font-bold text-lg">{fromToken.symbol}</span>
              <ChevronDown size={16} className="text-white/30" />
            </button>
          </div>
        </div>

        {/* SWITCH DIVIDER */}
        <div className="relative h-2 flex items-center justify-center">
          <div className="absolute inset-x-8 h-px bg-white/[0.05]" />
          <button 
            onClick={handleSwitch}
            className="absolute z-10 p-3 rounded-xl bg-[#1a1a1a] border border-white/[0.1] text-blue-400 hover:text-white hover:border-blue-500/50 transition-all shadow-2xl hover:scale-110 active:rotate-180 duration-500"
          >
            <ArrowUpDown size={18} />
          </button>
        </div>

        {/* TO BOX */}
        <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-[24px] p-6 flex flex-col justify-center group hover:bg-white/[0.05] transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Receive</span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
              <Wallet size={12} className="text-emerald-400" />
              <span>Balance: {toBalance ? Number(formatUnits(toBalance as bigint, toToken.decimals)).toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}</span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="text-4xl font-bold text-white/90">
              {quote}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <img src={toToken.icon} alt={toToken.symbol} className="w-7 h-7 rounded-full shadow-lg" />
              <span className="font-bold text-lg">{toToken.symbol}</span>
              <ChevronDown size={16} className="text-white/30" />
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-white/[0.01]">
        <button 
          onClick={handleSwap}
          disabled={!isConnected || !amount || isSwapping}
          className="w-full h-14 rounded-[20px] bg-white text-black font-black text-lg hover:bg-white/90 transition-all shadow-xl disabled:opacity-20 disabled:cursor-not-allowed mb-4 flex items-center justify-center gap-2"
        >
          {isSwapping ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              SWAPPING...
            </>
          ) : isConnected ? (
            "SWAP"
          ) : (
            "CONNECT WALLET"
          )}
        </button>

        <div className="flex justify-between items-center px-2">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 text-[11px] font-bold text-white/20 hover:text-white transition-all group"
          >
            <RefreshCw size={12} className={`group-hover:text-blue-400 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            1 {fromToken.symbol} = {rate.toFixed(4)} {toToken.symbol}
          </button>
          <div className="text-[11px] font-bold text-white/20 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-white/20" />
            GAS: $0.01
          </div>
        </div>
      </div>
    </div>
  );
};
