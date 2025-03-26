'use client';

import { useState } from 'react';
import { WagmiConfig, createConfig } from 'wagmi'; // Aquí solo importamos lo necesario
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { BrowserProvider, parseEther } from 'ethers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [],
  // Otras configuraciones necesarias
});

createWeb3Modal({ wagmiConfig, projectId, chains });

export default function ConnectAndPlayContent({ gameCompleted, gameData }) {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: walletClient } = useWalletClient();
  const [statusMessage, setStatusMessage] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handleMobileConnect = () => {
    const walletConnect = connectors.find(c => c.id === 'walletConnect');
    if (walletConnect) {
      connect({ connector: walletConnect });
    } else {
      open(); // fallback to modal
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

  return (
    <WagmiConfig config={wagmiConfig}> {/* Aquí solo envuelves el componente en WagmiConfig */}
      <div className="text-center my-4 space-y-4">
        {/* El resto del código */}
      </div>
    </WagmiConfig>
  );
}
