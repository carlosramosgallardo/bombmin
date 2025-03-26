'use client';

import { useEffect, useState } from 'react';
import { WagmiConfig, createConfig, http, useAccount } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import supabase from '@/lib/supabaseClient';

const chains = [mainnet];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
  },
});

export default function PoVPage() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <PoVClientComponent />
    </WagmiConfig>
  );
}

function PoVClientComponent() {
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
    <div className="pov-container">
      <h1 className="text-3xl font-bold">Proof of Vote (PoV)</h1>
      <div>
        {pollData.length === 0 ? (
          <p>Loading poll data...</p>
        ) : (
          pollData.map((poll) => (
            <div key={poll.id}>
              <h2>{poll.question}</h2>
              <button onClick={() => handleVote(poll.id, 'yes')}>Yes</button>
              <button onClick={() => handleVote(poll.id, 'no')}>No</button>
            </div>
          ))
        )}
      </div>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}
