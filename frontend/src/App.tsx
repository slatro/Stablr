import React, { useState } from 'react';
import { Header } from './components/Header';
import { SwapCard } from './components/SwapCard';
import { Dashboard } from './components/Dashboard';
import { Logo } from './components/Logo';
import { Github as GithubIcon, Twitter as TwitterIcon, MessageCircle as DiscordIcon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [slippage, setSlippage] = useState('0.5');

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 selection:text-blue-200">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto px-4 pt-32 pb-20 relative min-h-[calc(100vh-140px)]">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && <Dashboard />}

        {/* Swap Tab */}
        {activeTab === 'swap' && (
          <div className="flex flex-col items-center justify-center pt-8 animate-in fade-in zoom-in-95 duration-500">
            <SwapCard slippage={slippage} setSlippage={setSlippage} />
          </div>
        )}

        {/* Pools Tab */}
        {activeTab === 'pools' && (
          <div className="flex flex-col items-center justify-center pt-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="premium-card p-12 text-center max-w-lg">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 text-blue-400">
                <Logo size={40} hideText />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-4">Liquidity Pools</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                ArcFX liquidity pools are currently undergoing a security audit. 
                Public pool management will be enabled in the next protocol update.
              </p>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-8" />
              <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.02] bg-black/40 backdrop-blur-3xl py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo size={20} />
            <p className="text-white/20 text-[10px] font-medium tracking-widest uppercase">
              The Next Generation of Global FX
            </p>
          </div>
          
          <div className="flex items-center gap-8 text-white/30">
            <a href="#" className="hover:text-white transition-colors"><TwitterIcon size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><GithubIcon size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><DiscordIcon size={18} /></a>
          </div>
          
          <div className="text-[10px] font-bold text-white/10 uppercase tracking-widest">
            © 2026 ArcFX Protocol. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
