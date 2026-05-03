import React from 'react';

export const ActivityTicker = ({ isMinimal = false }: { isMinimal?: boolean }) => {
  const transactions = [
    { hash: "0x71...3912", type: "SWAP", details: "1.2K MEURC → 1.3K MUSDC" },
    { hash: "0xA4...9281", type: "SWAP", details: "500 MUSDC → 460 MEURC" },
    { hash: "0xB2...1102", type: "MINT", details: "2.5K MUSDC" },
    { hash: "0xF1...5542", type: "SWAP", details: "8.2K MEURC → 8.9K MUSDC" },
    { hash: "0xE3...7721", type: "LIQUIDITY", details: "1.0K MUSDC / 0.9K MEURC" },
    { hash: "0xD4...2291", type: "SWAP", details: "300 MUSDC → 275 MEURC" },
  ];

  // Duplicate for seamless loop
  const displayTxs = [...transactions, ...transactions, ...transactions, ...transactions];

  return (
    <div className={`w-full overflow-hidden ${isMinimal ? 'bg-transparent border-0 py-0' : 'bg-white/[0.02] border-y border-white/[0.05] backdrop-blur-md py-2.5'} relative`}>
      <div className="flex whitespace-nowrap animate-ticker">
        {displayTxs.map((tx, i) => (
          <div key={i} className="flex items-center gap-3 px-8 border-r border-white/5 last:border-r-0">
            <span className="text-[10px] font-black text-blue-500 tracking-[0.2em]">#{tx.type}</span>
            <span className="text-[10px] font-mono font-bold text-white/60 tracking-tight uppercase">
              {tx.hash}
            </span>
            <span className="text-[10px] font-bold text-white/90 tracking-tight uppercase">
              {tx.details}
            </span>
            <div className="w-1 h-1 rounded-full bg-emerald-500/50 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
