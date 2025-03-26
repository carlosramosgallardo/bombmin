'use client';

import { useState, useEffect } from 'react';
import { WagmiConfig, createConfig, useAccount, useConnect, useWalletClient } from 'wagmi'; // Aquí solo importamos lo necesario
import { BrowserProvider, parseEther } from 'ethers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';
import Web3Modal from '@web3modal/wagmi/react';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [], // Otras configuraciones necesarias
  // Incluye las configuraciones adicionales necesarias para wagmi
});

export default function ConnectAndPlayContent({ gameCompleted, gameData }) {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: walletClient } = useWalletClient();
  const [statusMessage, setStatusMessage] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handleMobileConnect = () => {
    const walletConnect = connectors.find((c) => c.id === 'walletConnect');
    if (walletConnect) {
      connect({ connector: walletConnect });
    } else {
      open(); // Fallback to modal
    }
  };

  const handlePay = async () => {
    if (!isConnected || !address) {
      setStatusMessage('Please connect your wallet first.');
      return;
    }

    if (!gameCompleted || !gameData) {
      setStatusMessage('❌ You must complete a round before sending a donation.');
      return;
    }

    const fullGameData = {
      ...gameData,
      wallet: address,
    };

    try {
      setIsPaying(true);

      const { error } = await supabase.from('games').insert([fullGameData]);
      if (error) {
        console.error('❌ Supabase insert error:', error.message);
        setStatusMessage('❌ Error saving game data. Transaction aborted.');
        return;
      }

      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
        value: parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE),
      });

      setStatusMessage('🟢 Donation sent and game data saved!');
    } catch (err) {
      console.error('❌ Transaction error:', err);
      setStatusMessage('❌ Transaction cancelled or failed.');
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    // Aquí puedes hacer cualquier configuración adicional que necesites para el modal
    createWeb3Modal({
      wagmiConfig,
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      chains: [], // configura las chains necesarias
    });
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="text-center my-4 space-y-4">
        {!isConnected ? (
          <button
            onClick={handleMobileConnect}
            className="px-4 py-2 mt-2 ml-2 rounded bg-black text-white hover:bg-gray-900 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={handlePay}
            disabled={isPaying}
            className={`px-4 py-2 mt-2 ml-2 rounded transition ${
              isPaying
                ? 'bg-slate-700 cursor-not-allowed text-white'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isPaying ? 'Processing...' : 'Power up MathsMine3 with your donation!'}
          </button>
        )}

        {statusMessage && <p className="text-sm text-red-500 mt-2">{statusMessage}</p>}
      </div>
    </WagmiConfig>
  );
}
