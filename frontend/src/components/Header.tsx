import React from 'react';
import { Wallet, ChevronDown, Menu, Activity, Globe, Zap } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const navItems = [
    { label: 'Dashboard', id: 'dashboard' },
    { label: 'Swap', id: 'swap' },
    { label: 'Pools', id: 'pools' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
      <div className="container mx-auto flex items-center justify-between gap-6 pointer-events-auto">
        
        {/* Logo Section */}
        <div className="flex items-center gap-10">
          <button onClick={() => setActiveTab('dashboard')}>
            <Logo />
          </button>
          
          <nav className="hidden md:flex items-center gap-1 bg-black/40 backdrop-blur-2xl border border-white/[0.05] p-1.5 rounded-2xl shadow-2xl">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  activeTab === item.id 
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 px-6 py-2.5 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/[0.05] shadow-xl">
             <div className="flex items-center gap-2">
               <Activity size={12} className="text-blue-400" />
               <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Network</span>
               <span className="text-[10px] font-bold text-white">Arc Testnet</span>
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex items-center gap-2">
               <Globe size={12} className="text-emerald-400" />
               <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Gas</span>
               <span className="text-[10px] font-bold text-white">0.001 Gwei</span>
             </div>
          </div>

          <button 
            onClick={() => isConnected ? disconnect() : connect({ connector: connectors[0] })}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 shadow-2xl group ${
              isConnected 
                ? "bg-black/60 border-white/10 hover:border-red-500/50 hover:bg-red-500/5" 
                : "bg-blue-600 border-blue-400/50 hover:bg-blue-500 hover:scale-[1.02] active:scale-95"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-white animate-pulse"}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {isConnected 
                ? `${address?.slice(0, 6)}...${address?.slice(-4)}` 
                : "Connect Wallet"
              }
            </span>
            {isConnected && <ChevronDown size={14} className="text-white/20 group-hover:text-red-500 transition-colors" />}
          </button>
          
          <button className="md:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
