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

  // ✅ Solo si respuesta fue correcta
  const isEligible = gameCompleted && gameData?.is_correct === true;

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

    if (!isEligible) {
      setStatusMessage('You must answer correctly to send a pulse.');
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
        console.error('Supabase insert error:', error.message);
        setStatusMessage('Error saving game data. Transaction aborted.');
        return;
      }

      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
        value: parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE),
      });

      setStatusMessage('Signal sent. The token has been disturbed.');
    } catch (err) {
      console.error('Even hesitation shapes the system. Token field disturbed.', err);
      setStatusMessage('Even hesitation shapes the system. Token field disturbed.');
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
          disabled={!isEligible || isPaying}
          className={`px-4 py-2 mt-2 ml-2 rounded transition ${
            !isEligible || isPaying
              ? 'bg-slate-700 cursor-not-allowed text-white'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          {isPaying ? 'Processing...' : 'Inject value'}
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
