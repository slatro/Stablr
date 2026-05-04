import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { WalletModal } from './WalletModal';
import { NetworkInfoModal } from './NetworkInfoModal';
import { ARC_TESTNET_CONFIG } from '../config/contracts';
import { Copy, LogOut, Check, ChevronDown, AlertCircle } from 'lucide-react';

export const Header = () => {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-switch to Arc Testnet
  useEffect(() => {
    if (isConnected && chainId !== ARC_TESTNET_CONFIG.chainId) {
      const timer = setTimeout(() => {
        switchChain({ chainId: ARC_TESTNET_CONFIG.chainId });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, chainId, switchChain]);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSignOut = () => {
    disconnect();
    setIsConfirmOpen(false);
    setIsDropdownOpen(false);
  };

  const handleConnectClick = () => {
    if (isConnected) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      setIsNetworkModalOpen(true);
    }
  };

  const handleNetworkConfirm = () => {
    setIsNetworkModalOpen(false);
    setIsWalletModalOpen(true);
  };

  return (
    <>
      <header className="h-20 flex items-center justify-between px-8 border-b border-white/[0.05] relative z-[50]">
        <div className="flex items-center gap-12">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="nav-link active">Swap</a>
            <a href="#" className="nav-link">Pools</a>
            <a href="#" className="nav-link">Stake</a>
            <a href="#" className="nav-link">Docs</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">Arc Testnet</span>
          </div>
          
          {isConnected ? (
            <div className="relative flex items-center gap-2">
              <button 
                onClick={handleConnectClick}
                className="h-11 px-5 rounded-2xl text-xs font-bold transition-all duration-300 border bg-white/5 text-white border-white/10 hover:bg-white/10 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <button 
                onClick={() => setIsConfirmOpen(true)}
                className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all"
              >
                <LogOut size={16} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute top-[calc(100%+12px)] right-0 w-64 premium-card p-4 animate-in fade-in slide-in-from-top-2 duration-300 shadow-2xl">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">Your Wallet</div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-4">
                      <span className="text-[11px] font-mono text-white/60 truncate mr-2">
                        {address}
                      </span>
                      <button 
                        onClick={handleCopy}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-blue-400 transition-all"
                      >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => setIsConfirmOpen(true)}
                      className="w-full py-2.5 rounded-xl bg-red-400/5 border border-red-400/10 text-red-400 font-bold text-[11px] hover:bg-red-400/10 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut size={14} />
                      SIGN OUT
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              onClick={handleConnectClick}
              className="h-11 px-6 rounded-2xl bg-white text-black font-bold text-xs hover:bg-white/90 shadow-xl shadow-white/5 transition-all"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsConfirmOpen(false)} />
          <div className="relative w-full max-w-[340px] premium-card p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Sign Out?</h2>
            <p className="text-sm text-white/40 mb-8 leading-relaxed">Are you sure you want to disconnect your wallet? You will need to reconnect to trade.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 h-12 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-all"
              >
                CANCEL
              </button>
              <button 
                onClick={handleSignOut}
                className="flex-1 h-12 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-400 transition-all"
              >
                SIGN OUT
              </button>
            </div>
          </div>
        </div>
      )}

      <NetworkInfoModal 
        isOpen={isNetworkModalOpen} 
        onClose={() => setIsNetworkModalOpen(false)} 
        onConfirm={handleNetworkConfirm}
      />
      
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </>
  );
};
