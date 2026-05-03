import React, { useState } from 'react';
import { ArrowUpDown, Settings, ChevronDown } from 'lucide-react';

export const SwapCard = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const AssetOne = () => (
    <div className="p-3.5 rounded-[20px] bg-white/[0.02] border border-white/[0.05]">
      <div className="flex justify-between mb-2 px-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/40">
        <span>{isFlipped ? 'Receive' : 'Pay'}</span>
        <span className="text-white/80">Balance: 2,450.00</span>
      </div>
      <div className="flex items-center gap-3">
        <input 
          type="number" 
          placeholder="0.0" 
          value={isFlipped ? toAmount : fromAmount}
          onChange={(e) => isFlipped ? setToAmount(e.target.value) : setFromAmount(e.target.value)}
          className="swap-input !text-lg !py-1.5"
        />
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-white hover:bg-blue-500/20 transition-all shrink-0">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shadow-lg">€</div>
          <span className="font-bold text-xs tracking-tight">mEURC</span>
          <ChevronDown size={12} className="text-white/40" />
        </button>
      </div>
    </div>
  );

  const AssetTwo = () => (
    <div className="p-3.5 rounded-[20px] bg-white/[0.02] border border-white/[0.05]">
      <div className="flex justify-between mb-2 px-1 text-[9px] font-extrabold uppercase tracking-[0.2em] text-white/40">
        <span>{isFlipped ? 'Pay' : 'Receive'}</span>
        <span className="text-white/80">Balance: 1,200.00</span>
      </div>
      <div className="flex items-center gap-3">
        <input 
          type="number" 
          placeholder="0.0" 
          value={isFlipped ? fromAmount : toAmount}
          readOnly={!isFlipped}
          className={`swap-input !text-lg !py-1.5 ${!isFlipped ? 'opacity-70' : ''}`}
        />
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.05] text-white hover:bg-white/[0.08] transition-all shrink-0">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold shadow-lg">$</div>
          <span className="font-bold text-xs tracking-tight">mUSDC</span>
          <ChevronDown size={12} className="text-white/40" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="premium-card p-5 flex flex-col justify-between h-[500px] relative overflow-hidden max-w-[440px]">
      <div className="space-y-3">
        {/* Subtle inner glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white uppercase tracking-tighter">SWAP</h3>
          <button className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-white/40 hover:text-white transition-all">
            <Settings size={16} />
          </button>
        </div>

        <div className="space-y-1 relative">
          {!isFlipped ? <AssetOne /> : <AssetTwo />}
          
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button 
              onClick={handleFlip}
              className="w-8 h-8 rounded-xl bg-[#081121] border border-white/[0.1] flex items-center justify-center text-blue-400 shadow-2xl hover:scale-110 transition-transform active:rotate-180 duration-300"
            >
              <ArrowUpDown size={14} />
            </button>
          </div>

          <div className="pt-1">
            {!isFlipped ? <AssetTwo /> : <AssetOne />}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="btn-premium w-full py-3.5 text-[11px] uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          SWAP
        </button>

        <div className="text-center">
          <p className="text-[7px] font-extrabold text-white/10 uppercase tracking-[0.4em]">
            Powered by Arc Settlement Network
          </p>
        </div>
      </div>
    </div>
  );
};
