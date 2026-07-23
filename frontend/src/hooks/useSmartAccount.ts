import { useState, useEffect, useCallback } from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { createSmartAccountClient } from 'permissionless';
import { SimpleSmartAccount } from 'permissionless/accounts/simple';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { http, defineChain, type Hex } from 'viem';

const PIMLICO_API_KEY = import.meta.env.VITE_PIMLICO_API_KEY;
const PIMLICO_RPC = `https://api.pimlico.io/v2/5042002/rpc?apikey=${PIMLICO_API_KEY}`;

// EntryPoint v0.7 is supported on Arc Testnet (verified via eth_supportedEntryPoints)
const ENTRY_POINT = {
  address: '0x0000000071727De22E5E9d8BAf0edAc6f37da032' as `0x${string}`,
  version: '0.7' as const,
};

// Arc Testnet chain definition for viem/permissionless
const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USD Coin', symbol: 'USDC', decimals: 6 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
  },
});

export const useSmartAccount = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [smartAccountClient, setSmartAccountClient] = useState<any>(null);
  const [isGaslessEnabled, setIsGaslessEnabled] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const initSmartAccount = async () => {
      if (!walletClient || !publicClient || !PIMLICO_API_KEY) return;
      if (isInitializing || smartAccountClient) return;

      setIsInitializing(true);

      try {
        const pimlicoClient = createPimlicoClient({
          transport: http(PIMLICO_RPC),
          entryPoint: ENTRY_POINT,
        });

        const simpleAccount = await SimpleSmartAccount.toSimpleSmartAccount({
          client: publicClient as any,
          owner: walletClient as any,
          entryPoint: ENTRY_POINT,
        });

        const client = createSmartAccountClient({
          account: simpleAccount,
          entryPoint: ENTRY_POINT,
          chain: arcTestnet,
          bundlerTransport: http(PIMLICO_RPC),
          paymaster: pimlicoClient,
        });

        setSmartAccountClient(client);
        console.log(
          '%c⚡ Pimlico Smart Account Ready',
          'color: #7c3aed; font-weight: bold',
          '\nSmart Account Address:', simpleAccount.address,
          '\nBundler:', PIMLICO_RPC.replace(PIMLICO_API_KEY, 'pim_***')
        );
      } catch (error: any) {
        console.error('%c❌ Pimlico init failed:', 'color: red', error?.message);
      } finally {
        setIsInitializing(false);
      }
    };

    initSmartAccount();
  }, [walletClient?.account?.address]);

  /**
   * Sends a real ERC-4337 UserOperation via Pimlico bundler.
   * Visible in https://dashboard.pimlico.io under "User Operations".
   */
  const sendGaslessTransaction = useCallback(async (
    to: `0x${string}`,
    data: Hex,
    value: bigint = 0n
  ): Promise<Hex> => {
    if (!smartAccountClient) {
      throw new Error('Pimlico smart account not initialized');
    }

    console.log('%c📤 Submitting UserOperation via Pimlico...', 'color: #7c3aed; font-weight: bold', { to });

    try {
      const txHash = await smartAccountClient.sendTransaction({ to, data, value });
      console.log('%c✅ UserOperation confirmed on-chain!', 'color: #059669; font-weight: bold', 'Hash:', txHash);
      return txHash as Hex;
    } catch (error: any) {
      console.error('%c❌ PIMLICO HATA DETAYI:', 'color: red; font-size: 14px; font-weight: bold');
      console.error('Message:', error?.message);
      console.error('Code:', error?.code);
      console.error('Details:', error?.details);
      console.error('Cause:', error?.cause);
      console.error('Full error:', JSON.stringify(error, null, 2));
      throw error;
    }
  }, [smartAccountClient]);

  return {
    smartAccountClient,
    isGaslessEnabled,
    setIsGaslessEnabled,
    sendGaslessTransaction,
    isInitializing,
  };
};
