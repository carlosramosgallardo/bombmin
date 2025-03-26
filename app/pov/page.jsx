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
    <main className="flex flex-col items-center min-h-screen w-full px-4 pt-10 pb-20 text-sm font-mono text-gray-200 bg-black">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-8">🗳️ Proof of Vote</h1>

        {pollData.length === 0 ? (
          <p className="text-gray-400">Loading poll data...</p>
        ) : (
          pollData.map((poll) => (
            <div key={poll.id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">{poll.question}</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleVote(poll.id, 'yes')}
                  className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleVote(poll.id, 'no')}
                  className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
                >
                  No
                </button>
              </div>
            </div>
          ))
        )}

        {statusMessage && (
          <p className="mt-4 text-sm text-gray-300">{statusMessage}</p>
        )}
      <Link href="/" className="text-blue-400 underline mt-10 inline-block">← Back</Link>
      </div>
    </main>
  );
}
