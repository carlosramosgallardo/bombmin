'use client';

import { useState, useEffect } from 'react';
import { WagmiConfig, createConfig, useAccount } from 'wagmi';
import supabase from '@/lib/supabaseClient';
import { mainnet } from 'wagmi/chains';
import { http } from 'wagmi/transports';

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

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

        setPollData(data || []);
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
        .insert([{ poll_id: pollId, wallet_address: address.toLowerCase(), vote }]);

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
        {pollData.length === 0 ? (
          <p>Loading poll data...</p>
        ) : (
          pollData.map((poll) => (
            <div key={poll.id} className="mb-6">
              <h2 className="text-xl mb-2">{poll.question}</h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleVote(poll.id, 'yes')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleVote(poll.id, 'no')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  No
                </button>
              </div>
            </div>
          ))
        )}
        {statusMessage && (
          <p className="mt-4 text-yellow-400 font-semibold">{statusMessage}</p>
        )}
      </div>
    </WagmiConfig>
  );
}
