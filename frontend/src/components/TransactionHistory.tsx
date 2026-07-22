import React, { useEffect, useState, useCallback } from 'react';
import { ExternalLink, RefreshCw, Zap, Star, History, Loader2, ArrowRightLeft, Coins, Droplets } from 'lucide-react';
import { useAccount, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESSES, TOKENS } from '../config/contracts';
import { parseAbiItem, formatUnits } from 'viem';

interface Transaction {
  id: string;
  type: string;
  asset: string;
  amount: string;
  status: 'Confirmed';
  hash: string;
  timestamp: number;
}

export const TransactionHistory = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [logs, setLogs] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Unified fetch function
  const fetchLogs = useCallback(async () => {
    if (!address || !publicClient) return;
    setIsLoading(true);
    
    try {
      const currentBlock = await publicClient.getBlockNumber();
      const fromBlock = currentBlock > 100000n ? currentBlock - 100000n : 0n;

      // 3. Robust Pool Discovery & Scanning
      let poolAddresses: `0x${string}`[] = [
        '0x599C8D44A68C69772B53835B17743d56B0866d00',
        '0x4CF995166442654fA723fF7d8065f4262143728E' // Add the one from the user's screenshot
      ];

      try {
        const factoryAddr = CONTRACT_ADDRESSES.FACTORY as `0x${string}`;
        const len = await publicClient.readContract({
          address: factoryAddr,
          abi: [{ name: 'allPoolsLength', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] }],
          functionName: 'allPoolsLength'
        }) as bigint;
        
        const count = Number(len > 10n ? 10n : len); // Scan last 10 pools for speed
        const poolPromises = Array.from({ length: count }, (_, i) => 
          publicClient.readContract({
            address: factoryAddr,
            abi: [{ name: 'allPools', type: 'function', stateMutability: 'view', inputs: [{ type: 'uint256' }], outputs: [{ type: 'address' }] }],
            functionName: 'allPools',
            args: [BigInt(Number(len) - 1 - i)]
          })
        );
        const discovered = await Promise.all(poolPromises);
        poolAddresses = Array.from(new Set([...poolAddresses, ...discovered as `0x${string}`[]]));
      } catch (e) { console.warn("Pool discovery failed, using fallbacks"); }
      
      const queries = [
        publicClient.getLogs({
          address: CONTRACT_ADDRESSES.ARC_POINTS as `0x${string}`,
          event: parseAbiItem('event PointsEarned(address indexed user, uint256 amount, string reason)'),
          fromBlock,
          toBlock: 'latest'
        }),
        publicClient.getLogs({
          address: CONTRACT_ADDRESSES.ARC_POINTS as `0x${string}`,
          event: parseAbiItem('event CheckedIn(address indexed user, uint256 timestamp, uint256 pointsEarned, uint256 streak)'),
          fromBlock,
          toBlock: 'latest'
        }),
        ...TOKENS.slice(0, 3).map(token => publicClient.getLogs({
          address: token.addr as `0x${string}`,
          event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
          fromBlock,
          toBlock: 'latest'
        })),
        ...poolAddresses.map(pool => publicClient.getLogs({
          address: pool as `0x${string}`,
          event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
          fromBlock, toBlock: 'latest'
        }))
      ];

      const results = await Promise.allSettled(queries);
      const allLogs: Transaction[] = [];
      const userAddr = address.toLowerCase();

      results.forEach((res, idx) => {
        if (res.status === 'fulfilled' && res.value) {
          (res.value as any[]).forEach(l => {
            const hash = l.transactionHash;
            // Point Events
            if (idx === 0 && l.args.user?.toLowerCase() === userAddr) {
              allLogs.push({ id: `p-${hash}-${l.logIndex}`, type: l.args.reason || 'Points Reward', asset: 'STABLR POINTS', amount: `+${l.args.amount.toString()}`, status: 'Confirmed', hash, timestamp: Date.now() - 60000 });
            } else if (idx === 1 && l.args.user?.toLowerCase() === userAddr) {
              allLogs.push({ id: `c-${hash}-${l.logIndex}`, type: 'Daily Check-in', asset: 'STABLR POINTS', amount: `+${l.args.pointsEarned.toString()}`, status: 'Confirmed', hash, timestamp: Number(l.args.timestamp) * 1000 });
            } 
            // Token Transfers (USDC/EURC/TRYC)
            else if (idx >= 2 && idx < 5) {
              const from = l.args.from?.toLowerCase();
              const to = l.args.to?.toLowerCase();
              if (from === userAddr || to === userAddr) {
                const token = TOKENS.find(t => t.addr.toLowerCase() === l.address.toLowerCase());
                const isOut = from === userAddr;
                allLogs.push({ id: `t-${hash}-${l.logIndex}`, type: isOut ? 'Transfer Out' : 'Transfer In', asset: token?.symbol || 'Token', amount: `${isOut ? '-' : '+'}${parseFloat(formatUnits(l.args.value, token?.decimals || 18)).toFixed(5)}`, status: 'Confirmed', hash, timestamp: Date.now() - 120000 });
              }
            }
            // Liquidity Events (LP Token Transfers)
            else if (idx >= 5) {
              const from = l.args.from?.toLowerCase();
              const to = l.args.to?.toLowerCase();
              if (from === userAddr || to === userAddr) {
                const isMint = from === '0x0000000000000000000000000000000000000000';
                const isBurn = to === '0x0000000000000000000000000000000000000000';
                if (isMint || isBurn) {
                  allLogs.push({ 
                    id: `l-${hash}-${l.logIndex}`, 
                    type: isMint ? 'Add Liquidity' : 'Remove Liquidity', 
                    asset: 'Pool LP', 
                    amount: isMint ? '+LP Token' : '-LP Token', 
                    status: 'Confirmed', 
                    hash, 
                    timestamp: Date.now() - 30000 
                  });
                }
              }
            }
          });
        }
      });

      const localKey = `arc_history_${userAddr}`;
      const localHistory = JSON.parse(localStorage.getItem(localKey) || '[]');
      
      // PRIORITY MERGE: If a local transaction exists with a specific hash, keep its labels (Type/Asset)
      const mergedMap = new Map();
      
      // 1. First add on-chain logs (Baseline)
      allLogs.forEach(tx => mergedMap.set(tx.hash.toLowerCase(), tx));
      
      // 2. Then overlay local history (Local labels like "Add Liquidity" have priority)
      localHistory.forEach((tx: Transaction) => {
        const hashKey = tx.hash.toLowerCase();
        const existing = mergedMap.get(hashKey);
        if (existing) {
          // Keep the local metadata if it's more descriptive
          if (tx.type.includes('Liquidity') || tx.type.includes('Swap') || tx.type.includes('Limit')) {
             mergedMap.set(hashKey, { ...existing, ...tx, id: existing.id });
          }
        } else {
          mergedMap.set(hashKey, tx);
        }
      });

      const finalLogs = Array.from(mergedMap.values())
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 15);

      setLogs(finalLogs);
      localStorage.setItem(localKey, JSON.stringify(finalLogs));
    } catch (err) {
      console.error("Critical error in history fetch:", err);
      if (address) {
        const localKey = `arc_history_${address.toLowerCase()}`;
        setLogs(JSON.parse(localStorage.getItem(localKey) || '[]').slice(0, 10));
      }
    } finally {
      setIsLoading(false);
    }
  }, [address, publicClient]);

  // Listen for new transactions to update local history
  useEffect(() => {
    if (!address) return;
    const userAddr = address.toLowerCase();
    const localKey = `arc_history_${userAddr}`;

    const handleNewTx = (event: any) => {
      const { state, type, asset, amount, txHash } = event.detail;
      if (state === 'success' || state === 'Confirmed') {
        const newTx: Transaction = {
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: type || 'Platform Action',
          asset: asset || (type === 'check-in' ? 'STABLR POINTS' : 'Token'),
          amount: amount || (type === 'check-in' ? '+50' : 'Confirmed'),
          status: 'Confirmed',
          hash: txHash || `0x-tmp-${Date.now()}`,
          timestamp: Date.now()
        };
        
        setLogs(prev => {
          const currentLocal = JSON.parse(localStorage.getItem(localKey) || '[]');
          const merged = [newTx, ...currentLocal, ...prev];
          const unique = Array.from(new Map(merged.map(item => [item.hash.toLowerCase(), item])).values())
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 15);
          
          localStorage.setItem(localKey, JSON.stringify(unique));
          return unique;
        });
      }
    };

    window.addEventListener('arc-transaction', handleNewTx);
    return () => window.removeEventListener('arc-transaction', handleNewTx);
  }, [address]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="w-full animate-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
            <History size={16} className="text-white/40" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Transaction History</h3>
            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Real-time Arc Testnet logs</span>
          </div>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
          Refresh
        </button>
      </div>

      <div className="premium-card overflow-hidden border border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] border-b border-white/5 bg-white/[0.01]">
                <th className="px-4 py-5">Activity</th>
                <th className="px-4 py-5">Asset</th>
                <th className="px-4 py-5 text-center">Quantity / Status</th>
                <th className="px-4 py-5 text-center">State</th>
                <th className="px-4 py-5 text-right">ArcScan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {logs.length > 0 ? logs.map((tx) => (
                <tr key={tx.id} className="group hover:bg-white/[0.02] transition-all duration-300">
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center min-w-[36px] h-9 rounded-lg bg-white/5 border border-white/5 text-[8px] font-bold text-white/30 uppercase tracking-tighter">
                        {(() => {
                          const diff = (Date.now() - tx.timestamp) / 1000;
                          if (diff < 60) return 'Now';
                          if (diff < 3600) return `${Math.floor(diff/60)}m`;
                          if (diff < 86400) return `${Math.floor(diff/3600)}h`;
                          return `${Math.floor(diff/86400)}d`;
                        })()}
                        <span className="opacity-40 text-[7px]">ago</span>
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${
                        tx.type.includes('Check-in') ? 'text-blue-400' :
                        tx.type.includes('Liquidity') ? 'text-blue-500' :
                        tx.type.includes('Stake') || tx.type.includes('Unstake') ? 'text-purple-400' :
                        tx.type.includes('Approval') ? 'text-cyan-400' :
                        tx.type.includes('Swap') || tx.type.includes('Exchanged') ? 'text-orange-500' :
                        tx.type.includes('Limit') ? 'text-amber-400' :
                        tx.type.includes('Faucet') ? 'text-blue-500' :
                        'text-white'
                      }`}>{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <span className={`text-[11px] font-black uppercase tracking-tighter ${
                      tx.asset === 'STABLR POINTS' ? 'text-blue-400' : 'text-white'
                    }`}>{tx.asset}</span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span className={`text-[12px] font-black tabular-nums ${
                      tx.amount.startsWith('+') ? 'text-emerald-400' : 
                      tx.amount.startsWith('-') ? 'text-rose-400' : 'text-white'
                    }`}>
                      {tx.amount.split(' / ').map(p => {
                        const n = parseFloat(p.replace(/[+-]/g, ''));
                        if (isNaN(n)) return p;
                        const pref = p.startsWith('+') ? '+' : (p.startsWith('-') ? '-' : '');
                        return `${pref}${n.toLocaleString(undefined, { maximumFractionDigits: 5 })}`;
                      }).join(' / ')}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Confirmed</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-right">
                    <a 
                      href={`https://testnet.arcscan.app/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/5 text-white/20 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all group/link"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Loader2 size={32} className={isLoading ? "animate-spin" : ""} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                        {isLoading ? "Scanning Blockchain..." : "No Recent Transactions Found"}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
