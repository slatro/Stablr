import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Settings, ChevronDown, Wallet, Edit2, RefreshCw } from 'lucide-react';

/* 
  ARCFX TERMINAL - FINAL SEAL v2.7
  - Implementation: Strict 506px Total Height for the SwapCard stack.
  - Alignment: Synchronized with the 506px chart height.
  - Theme: Imperial Cream (#FDF5E6).
*/

export const SwapCard = ({ slippage, setSlippage }: { slippage: string, setSlippage: (val: string) => void }) => {
  const [fromAmount, setFromAmount] = useState('10');
  const [toAmount, setToAmount] = useState('11.73');
  const [isEditingSlippage, setIsEditingSlippage] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rate, setRate] = useState(1.1733); 
  const [isSwapped, setIsSwapped] = useState(false);

  const fetchLiveRate = async () => {
    try {
      const response = await fetch('https://api.coinbase.com/v2/prices/EUR-USD/spot');
      const data = await response.json();
      if (data?.data?.amount) {
        setRate(parseFloat(data.data.amount));
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  useEffect(() => {
    fetchLiveRate();
    const interval = setInterval(handleRefresh, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isNaN(parseFloat(fromAmount))) {
      const currentRate = isSwapped ? (1 / rate) : rate;
      setToAmount((parseFloat(fromAmount) * currentRate).toFixed(4));
    }
  }, [fromAmount, rate, isSwapped]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLiveRate();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSwapTokens = () => {
    setIsSwapped(!isSwapped);
    const temp = fromAmount;
    setFromAmount(toAmount);
    setToAmount(temp);
  };

  const TokenBox = ({ type, amount, setAmount, symbol, name, iconColor, isReadOnly }: any) => {
    const finalUsdValue = symbol === 'mEURC' ? (parseFloat(amount || '0') * rate).toFixed(2) : (parseFloat(amount || '0') * 1.0).toFixed(2);

    return (
      <div className="flex flex-col gap-1.5 mb-1">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-wider">
            <Wallet size={10} style={{ color: '#FDF5E6' }} />
            <span>{type}: 0x2EE5...1704</span>
          </div>
          <div className="text-[9px] font-bold text-white/30 flex items-center gap-1">
            <Settings size={9} /> {type === 'From' ? '2,450.00' : '1,200.00'}
          </div>
        </div>
        
        <div className="bg-white/10 border border-white/[0.12] backdrop-blur-md rounded-[12px] p-3 flex items-center justify-between hover:bg-white/[0.15] transition-all group">
          <button className="flex items-center gap-3 px-2 py-0.5 rounded-[12px] hover:bg-white/5 transition-all">
            <div className={`w-7 h-7 rounded-full ${iconColor} flex items-center justify-center shadow-lg shadow-black/20`}>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="font-bold text-base text-white">{symbol}</span>
                <ChevronDown size={12} className="text-white/30" />
              </div>
              <div className="text-[9px] font-medium text-white/20">{name}</div>
            </div>
          </button>

          <div className="text-right">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              readOnly={isReadOnly}
              className={`bg-transparent text-xl font-bold text-white text-right outline-none w-28 placeholder-white/10 ${isReadOnly ? 'opacity-60' : ''}`}
            />
            <div className="text-[9px] font-medium text-white/10">~{finalUsdValue} USD</div>
          </div>
    refetchReserves();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex flex-col h-[506px] w-full max-w-[480px] justify-between">
      {/* HEADER CARD */}
      <div className="premium-card p-3.5 md:p-4 flex items-center justify-center relative shrink-0">
        <h1 className="text-sm md:text-base font-black text-white pl-2 text-shadow-premium">Swap</h1>
        <button className="absolute right-4 p-1.5 rounded-xl hover:bg-white/[0.05] transition-all text-white/20 hover:text-white">
          <Settings size={18} />
        </button>
      </div>

      {/* INPUT SECTION */}
      <div className="flex-1 flex flex-col gap-2 my-[5px]">
        {/* FROM */}
        <div className="premium-card p-4 md:p-6 flex-1 flex flex-col justify-center group hover:border-blue-500/20 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">You Sell</span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
              <Wallet size={10} />
              <span>Balance: {fromBalance ? Number(formatUnits(fromBalance as bigint, fromToken.decimals)).toFixed(2) : "0.00"}</span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" 
              className="bg-transparent text-2xl md:text-4xl font-black text-white outline-none w-full placeholder:text-white/5"
            />
            <button className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all group/btn">
              <img src={fromToken.icon} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
              <span className="font-black text-sm">{fromToken.symbol}</span>
              <ChevronDown size={14} className="text-white/20 group-hover/btn:text-white" />
            </button>
          </div>
        </div>

        {/* SWITCH BUTTON */}
        <div className="relative h-2 flex items-center justify-center z-10">
          <button 
            onClick={handleSwitch}
            className="absolute p-2.5 rounded-xl bg-[#111827] border-4 border-[#0a0a0a] text-blue-500 hover:text-white transition-all shadow-xl hover:scale-110 active:rotate-180 duration-500"
          >
            <ArrowUpDown size={16} strokeWidth={3} />
          </button>
        </div>

        {/* TO */}
        <div className="premium-card p-4 md:p-6 flex-1 flex flex-col justify-center group hover:border-emerald-500/20 transition-all">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">You Buy</span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
              <Wallet size={10} />
              <span>Balance: {toBalance ? Number(formatUnits(toBalance as bigint, toToken.decimals)).toFixed(2) : "0.00"}</span>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="text-2xl md:text-4xl font-black text-white/90">
              {quote}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all group/btn">
              <img src={toToken.icon} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
              <span className="font-black text-sm">{toToken.symbol}</span>
              <ChevronDown size={14} className="text-white/20 group-hover/btn:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER CARD */}
      <div className="premium-card p-4 flex flex-col gap-4 shrink-0">
        <div className="flex justify-between items-center px-2">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Price Impact</span>
          <span className="text-[10px] font-black text-emerald-500 tracking-widest">&lt; 0.01%</span>
        </div>

        <button 
          onClick={handleSwap}
          disabled={!isConnected || !amount || isSwapping}
          className="w-full py-2 md:py-2.5 rounded-[12px] bg-gradient-to-b from-blue-600 to-[#111827] hover:from-blue-500 hover:to-[#1f2937] text-white font-black text-sm md:text-base transition-all shadow-xl active:scale-95 text-shadow-premium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSwapping ? "Swapping..." : isConnected ? "Swap" : "Connect Wallet"}
        </button>

        <div className="flex justify-between items-center px-2">
          <button onClick={handleRefresh} className="flex items-center gap-1.5 text-[9px] font-bold text-white/20 tracking-tight hover:text-blue-400 transition-colors">
            <RefreshCw size={10} className={`text-blue-500/60 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className={isRefreshing ? 'animate-pulse text-white' : ''}>
              1 {fromToken.symbol} ≈ {rate.toFixed(4)} {toToken.symbol}
            </span>
          </button>
          <div className="flex items-center gap-1 text-[9px] font-bold text-white/20 uppercase tracking-widest">
            Fee <span className="text-white/40">0.0025 USDC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
