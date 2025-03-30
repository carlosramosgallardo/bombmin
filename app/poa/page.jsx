'use client';

import { useState, useEffect } from 'react';
import { WagmiConfig, createConfig, http, useAccount } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import supabase from '@/lib/supabaseClient';
import { checkContributorEligibility } from '@/app/pov/lib/contributors';

const chains = [mainnet];
const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
  },
});

export default function PoAPage() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <PoAClientComponent />
    </WagmiConfig>
  );
}

function PoAClientComponent() {
  const { address, isConnected } = useAccount();
  const [question, setQuestion] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [canAsk, setCanAsk] = useState(false);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [hasCreatedPoll, setHasCreatedPoll] = useState(false);

  useEffect(() => {
    async function checkEligibilityAndPoll() {
      if (isConnected && address) {
        // Check contributor eligibility as before.
        const eligible = await checkContributorEligibility(address);
        setCanAsk(eligible);
        setEligibilityChecked(true);

        // Query the polls table to see if a poll already exists for this wallet.
        const { data, error } = await supabase
          .from('polls')
          .select('id')
          .eq('wallet_address', address)
          .maybeSingle();

        if (error) {
          console.error('Error checking poll existence:', error);
        } else if (data) {
          setHasCreatedPoll(true);
        }
      }
    }
    checkEligibilityAndPoll();
  }, [isConnected, address]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected || !address) {
      setStatusMessage('Please connect your wallet to create a poll.');
      return;
    }

    // Validate that the question has a maximum of 20 words.
    const wordCount = question.trim().split(/\s+/).length;
    if (wordCount > 20) {
      setStatusMessage('The question must not exceed 20 words.');
      return;
    }

    // Enforce one poll per wallet by checking if a poll already exists.
    if (hasCreatedPoll) {
      setStatusMessage('Only one poll per wallet is allowed.');
      return;
    }

    // Insert the new poll along with the wallet address.
    try {
      const { error } = await supabase
        .from('polls')
        .insert([{ question, wallet_address: address }]);

      if (error) {
        setStatusMessage('Error submitting your poll.');
        console.error(error);
      } else {
        setStatusMessage('Poll created successfully!');
        setQuestion('');
        setHasCreatedPoll(true);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setStatusMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen w-full px-4 pt-10 pb-20 text-sm font-mono text-gray-200 bg-black">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl font-bold mb-8">Proof of Ask</h1>

        {eligibilityChecked && !canAsk && (
          <p className="text-xs text-gray-500 text-center italic tracking-wide mb-4">
            {address}: You must have mined at least 0.00001 MM3 to create a poll.
          </p>
        )}

        {eligibilityChecked && canAsk && (
          <>
            {hasCreatedPoll ? (
              <p className="text-xs text-gray-500 text-center italic tracking-wide mb-4">
                Only one poll per wallet is allowed.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <textarea
                  className="w-full max-w-md p-2 rounded border border-blue-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Write your yes/no question (max. 20 words). Only one poll per wallet is allowed."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                />
                <button
                  type="submit"
                  className="mt-4 px-6 py-2 rounded-lg bg-[#22d3ee] text-white hover:bg-[#1dbbe0] transition"
                >
                  Submit Poll
                </button>
              </form>
            )}
          </>
        )}

        {statusMessage && (
          <p className="mt-4 text-sm text-gray-300">{statusMessage}</p>
        )}
      </div>
    </main>
  );
}
