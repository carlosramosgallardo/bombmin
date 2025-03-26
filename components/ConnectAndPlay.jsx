'use client';

import { useState } from 'react';
import {
  createWeb3Modal,
  useWeb3Modal,
} from '@web3modal/wagmi/react';
import {
  WagmiConfig,
  createConfig,
  useAccount,
  useConnect,
  useWalletClient,
  http,
} from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { BrowserProvider, parseEther } from 'ethers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import supabase from '@/lib/supabaseClient';

const queryClient = new QueryClient();
const chains = [mainnet];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
  },
});

createWeb3Modal({ wagmiConfig, projectId, chains });

function ConnectAndPlayContent({ gameCompleted, gameData }) {
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
      wallet: address, // 🔑 usa la wallet actual conectada
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

  const isAndroid = typeof window !== 'undefined' && /android/i.test(navigator.userAgent);

  return (
    <div className="text-center my-4 space-y-4">
      {!isConnected ? (
        <button
          onClick={isAndroid ? handleMobileConnect : open}
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

      {statusMessage && (
        <p className="text-sm text-red-500 mt-2">{statusMessage}</p>
      )}
    </div>
  );
}

export default function ConnectAndPlay(props) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectAndPlayContent {...props} />
      </QueryClientProvider>
    </WagmiConfig>
  );
}