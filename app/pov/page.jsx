'use client';

import { useState, useEffect } from 'react';
import {
  WagmiConfig,
  createConfig,
  useAccount,
} from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import supabase from '@/lib/supabaseClient';

const chains = [mainnet];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: {
      rpcUrls: {
        default: {
          http: ['https://rpc.ankr.com/eth'],
        },
      },
    },
  },
});

createWeb3Modal({ wagmiConfig, projectId, chains });

export default function PoVPage() {
  const { address, isConnected } = useAccount();
  const [pollData, setPollData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    async function fetchPolls() {
      try {
        const { data, error } = await supabase
          .from('polls')
          .select('id, question, created_at')
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setPollData(data);
      } catch (error) {
        console.error('Error fetching polls', error);
      }
    }

    fetchPolls();
  }, []);

  const handleVote = async (pollId, vote) => {
    if (!isConnected || !address) {
      setStatusMessage('Please connect your wallet first.');
      return;
    }

    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert([{ poll_id: pollId, wallet_address: address, vote }]);

      if (error) {
        setStatusMessage('Error submitting your vote.');
        console.error(error);
      } else {
        setStatusMessage('Vote submitted successfully!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setStatusMessage('An error occurred. Please try again.');
    }
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="pov-container p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">Proof of Vote (PoV)</h1>
        <div className="space-y-4">
          {pollData.length === 0 ? (
            <p>Loading poll data...</p>
          ) : (
            pollData.map((poll) => (
              <div key={poll.id} className="border-b border-gray-700 pb-4">
                <h2 className="text-xl font-semibold">{poll.question}</h2>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleVote(poll.id, 'yes')}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleVote(poll.id, 'no')}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                  >
                    No
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {statusMessage && (
          <p className="text-yellow-400 font-semibold mt-6">{statusMessage}</p>
        )}
      </div>
    </WagmiConfig>
  );
}
