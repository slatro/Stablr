import React from "react";
import { Header } from "./components/Header";
import { SwapCard } from "./components/SwapCard";
import { TransactionPanel } from "./components/TransactionPanel";
import { TrendingUp, ShieldCheck, Globe, Zap, ArrowUpRight } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      <div className="bg-glow" />
      <Header />
      
      {/* Top Ticker */}
      <div className="h-10 bg-white/[0.02] border-b border-white/[0.05] flex items-center overflow-hidden">
        <div className="flex items-center gap-8 animate-infinite-scroll whitespace-nowrap px-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
              <span className="text-blue-400">#SWAP</span>
              <span>0x71...3912 swapped 500 mEURC for 542.4 mUSDC</span>
              <span className="text-white/10">•</span>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center relative py-12 px-6">
        {/* Decorative Background Beams */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[120%] bg-blue-500/5 blur-[120px] rotate-12" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[120%] bg-purple-500/5 blur-[120px] -rotate-12" />
        </div>

        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 items-start">
          
          {/* Left Panel: Market Stats */}
          <aside className="hidden lg:flex flex-col gap-6 animate-fade-in-left">
            <div className="premium-card p-5 space-y-4">
              <div className="flex items-center gap-2 text-white/40 mb-2">
                <TrendingUp size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Market Overview</span>
              </div>
              <div className="space-y-4">
                {[
                  { asset: "mUSDC", price: "$1.00", change: "+0.01%", color: "text-emerald-400" },
                  { asset: "mEURC", price: "$1.08", change: "-0.04%", color: "text-rose-400" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-xs font-bold text-white/60">{item.asset}</span>
                    <div className="flex items-end justify-between">
                      <span className="text-lg font-bold font-mono">{item.price}</span>
                      <span className={`text-[10px] font-bold ${item.color}`}>{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="premium-card p-5">
              <div className="flex items-center gap-2 text-white/40 mb-4">
                <Globe size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Arc Ecosystem</span>
              </div>
              <div className="space-y-3">
                <p className="text-[11px] leading-relaxed text-white/40">
                  Experience institutional-grade settlement on the Arc Testnet with sub-second finality.
                </p>
                <a href="#" className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  Explore Arcscan <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </aside>

          {/* Center: Main Swap Card */}
          <div className="flex flex-col items-center gap-8">
            <div className="text-center space-y-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
                <Zap size={12} className="text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">V2.0 Protocol Active</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                ArcFX Exchange
              </h1>
              <p className="text-text-muted font-medium max-w-sm mx-auto">
                The most elegant way to swap stablecoins on the Arc Network.
              </p>
            </div>
            <div className="w-full max-w-[480px]">
              <SwapCard />
            </div>
          </div>

          {/* Right Panel: Protocol Health */}
          <aside className="hidden lg:flex flex-col gap-6 animate-fade-in-right">
            <div className="premium-card p-5 space-y-4">
              <div className="flex items-center gap-2 text-white/40 mb-2">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Security & TVL</span>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/[0.05] text-center">
                <span className="text-[10px] font-bold text-white/40 uppercase block mb-1">Total TVL</span>
                <span className="text-2xl font-extrabold font-mono text-white">$12,450,230</span>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/40">Audit Status</span>
                  <span className="text-emerald-400 font-bold">Simulated</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/40">Open Source</span>
                  <span className="text-white font-bold">Verified</span>
                </div>
              </div>
            </div>

            <div className="premium-card p-5 bg-gradient-to-br from-white/[0.03] to-transparent">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-3">Live Feed</span>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1" />
                    <div>
                      <p className="text-white/60 font-medium">New liquidity added to mUSDC/mEURC pool.</p>
                      <span className="text-white/20">4 mins ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>

        {/* Transaction History Section */}
        <div className="w-full max-w-7xl mt-20">
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                <TrendingUp size={16} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Recent Ecosystem Activity</h2>
            </div>
            <div className="h-px flex-1 bg-white/[0.05] mx-8" />
            <button className="text-xs font-bold text-blue-400 hover:text-white transition-colors uppercase tracking-widest">
              View All Transactions
            </button>
          </div>
          <TransactionPanel />
        </div>
      </main>

      <footer className="py-12 px-8 border-t border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">ArcFX Protocol</span>
            </div>
            <p className="text-[10px] text-white/20 font-medium max-w-xs">
              Institutional-grade stablecoin settlement layer built on the Arc Network. Optimized for efficiency and security.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Resources</span>
              <div className="flex flex-col gap-2 text-[11px] font-bold text-white/20">
                <a href="#" className="hover:text-white transition-colors">Whitepaper</a>
                <a href="#" className="hover:text-white transition-colors">Documentation</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Network</span>
              <div className="flex flex-col gap-2 text-[11px] font-bold text-white/20">
                <a href="#" className="hover:text-white transition-colors">Arcscan</a>
                <a href="#" className="hover:text-white transition-colors">Bridge</a>
                <a href="#" className="hover:text-white transition-colors">Faucet</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
