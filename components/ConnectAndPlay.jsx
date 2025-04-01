'use client';

import { useState, useEffect } from 'react';
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

function ConnectAndPlayContent({ gameCompleted, gameData, account, setAccount }) {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: walletClient } = useWalletClient();

  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDonating, setIsDonating] = useState(false);

  useEffect(() => {
    if (isConnected && address && setAccount) {
      setAccount(address);
    }
  }, [isConnected, address, setAccount]);

  const isEligible = gameCompleted && gameData?.is_correct === true;

  const handleMobileConnect = () => {
    const walletConnect = connectors.find(c => c.id === 'walletConnect');
    if (walletConnect) {
      connect({ connector: walletConnect });
    } else {
      open();
    }
  };

  const handleGameSubmit = async () => {
    if (!isConnected || !address) {
      setStatusMessage('Connect your wallet first to save your play.');
      return;
    }

    if (!isEligible) {
      setStatusMessage('Answer correctly before submitting your play.');
      return;
    }

    try {
      setIsProcessing(true);

      const fullGameData = {
        ...gameData,
        wallet: address,
      };

      const { error } = await supabase.from('games').insert([fullGameData]);
      if (error) {
        console.error('Supabase insert error:', error.message);
        setStatusMessage('Oops! Could not save your play.');
        return;
      }

      setStatusMessage('Your play has been recorded. Thank you for shaping the system.');
    } catch (err) {
      console.error('Error saving play:', err);
      setStatusMessage('A glitch in the grid. Play was not saved.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDonation = async () => {
    if (!isConnected || !address) {
      setStatusMessage('Connect your wallet before donating.');
      return;
    }

    try {
      setIsDonating(true);

      if (!walletClient?.transport?.request) {
        setStatusMessage('This wallet does not support symbolic donations.');
        return;
      }

      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_ADMIN_WALLET,
        value: parseEther(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE),
      });

      setStatusMessage('Signal received. A ripple echoes through the field.');
    } catch (err) {
      console.error('Donation failed:', err);
      setStatusMessage('Even hesitation shapes the system. Donation aborted.');
    } finally {
      setIsDonating(false);
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
        <>
          <button
            onClick={handleGameSubmit}
            disabled={!isEligible || isProcessing}
            className={`px-4 py-2 mt-2 ml-2 rounded transition ${
              !isEligible || isProcessing
                ? 'bg-slate-700 cursor-not-allowed text-white'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isProcessing ? 'Saving...' : 'Mine MM3'}
          </button>

          <button
            onClick={handleDonation}
            disabled={isDonating}
            className={`px-4 py-2 mt-2 ml-2 rounded transition ${
              isDonating
                ? 'bg-slate-700 cursor-wait text-white'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isDonating ? 'Rippling...' : 'Symbolic Disturbance'}
          </button>
        </>
      )}

      {statusMessage && (
        <p className="text-sm text-indigo-500 mt-2">{statusMessage}</p>
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
