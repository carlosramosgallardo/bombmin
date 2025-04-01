'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { WagmiConfig, createConfig, http, useAccount } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import supabase from '@/lib/supabaseClient';
import { checkContributorEligibility } from './lib/contributors';

const chains = [mainnet];
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
  const [resultsData, setResultsData] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [canVote, setCanVote] = useState(false);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);

  useEffect(() => {
    const fetchPollsAndVotes = async () => {
      try {
        // Consulta la tabla polls incluyendo el campo wallet_address.
        const { data: polls, error: pollError } = await supabase
          .from('polls')
          .select('id, question, wallet_address')
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (pollError) throw pollError;

        // Consulta la tabla poll_votes para obtener los votos.
        const { data: votes, error: votesError } = await supabase
          .from('poll_votes')
          .select('*');

        if (votesError) throw votesError;

        // Agrupar los votos por poll_id.
        const groupedVotes = votes.reduce((acc, vote) => {
          if (!acc[vote.poll_id]) acc[vote.poll_id] = [];
          acc[vote.poll_id].push(vote);
          return acc;
        }, {});

        setPollData(polls);
        setResultsData(groupedVotes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPollsAndVotes();
  }, []);

  useEffect(() => {
    async function checkEligibility() {
      if (isConnected && address) {
        const eligible = await checkContributorEligibility(address);
        setCanVote(eligible);
        setEligibilityChecked(true);
      }
    }
    checkEligibility();
  }, [isConnected, address]);

  const handleVote = async (pollId, vote) => {
    if (!isConnected || !address) {
      setStatusMessage('Connect your wallet to vote.');
      return;
    }

    try {
      const { error } = await supabase
        .from('poll_votes')
        .insert([{ poll_id: pollId, wallet_address: address, vote }]);

      if (error) {
        if (error.code === '23505') {
          setStatusMessage('You have already voted in this poll.');
        } else {
          setStatusMessage('Error submitting your vote.');
        }
        console.error(error);
      } else {
        setStatusMessage('Vote submitted successfully!');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setStatusMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full px-4 pt-10 pb-20 text-sm font-mono bg-black">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-8 text-white">Proof of Vote</h1>

        {pollData.length === 0 ? (
          <p className="text-gray-400">Loading poll data...</p>
        ) : (
          <>
            {eligibilityChecked &&
              (!canVote ? (
                <p className="text-base text-gray-400 italic tracking-wide mb-4">
                  Connected as {address}. You must have mined at least 0.00001 MM3 to vote.
                </p>
              ) : (
                <p className="text-base text-gray-400 italic tracking-wide mb-4">
                  Connected as: {address}
                </p>
              ))}

            {pollData.map((poll, index) => {
              // Obtenemos los votos para cada poll.
              const votes = resultsData[poll.id] || [];
              const totalVotes = votes.length;
              // Contabilizamos votos para "yes" y "no".
              const voteCounts = votes.reduce((acc, v) => {
                acc[v.vote] = (acc[v.vote] || 0) + 1;
                return acc;
              }, {});

              return (
                <div
                  key={poll.id}
                  className="mb-16 p-6 bg-[#0b0f19] border border-[#22d3ee] rounded-lg shadow-lg"
                >
                  <h2 className="text-lg font-medium mb-1 text-white">{poll.question}</h2>
                  <p className="text-base text-[#22d3ee] mb-4">
                    Created by: {poll.wallet_address}
                  </p>

                  {eligibilityChecked && canVote && (
                    <div className="flex justify-center gap-4 mb-4">
                      <button
                        onClick={() => handleVote(poll.id, 'yes')}
                        className="px-6 py-2 rounded-lg bg-[#22d3ee] text-black hover:bg-[#1dbbe0] transition"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleVote(poll.id, 'no')}
                        className="px-6 py-2 rounded-lg bg-[#1e86d1] text-black hover:bg-[#1a7ebd] transition"
                      >
                        No
                      </button>
                    </div>
                  )}

                  {totalVotes > 0 && (
                    <div className="space-y-2 mt-6">
                      {['yes', 'no'].map((option) => {
                        const count = voteCounts[option] || 0;
                        const percentage = ((count / totalVotes) * 100).toFixed(1);
                        return (
                          <div key={option} className="text-left">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize text-blue-100">{option}</span>
                              <span className="text-blue-100">
                                {count} votes ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded h-3">
                              <div
                                className={`h-3 rounded ${
                                  option === 'yes' ? 'bg-[#22d3ee]' : 'bg-[#1e86d1]'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {index < pollData.length - 1 && (
                    <div className="w-full border-t border-gray-700/50 my-12 opacity-50" />
                  )}
                </div>
              );
            })}
          </>
        )}

        {statusMessage && (
          <p className="mt-4 text-sm text-gray-300">{statusMessage}</p>
        )}
      </div>
    </main>
  );
}
