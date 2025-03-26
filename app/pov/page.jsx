'use client';

import { useState, useEffect } from 'react';
import { WagmiConfig, createConfig } from 'wagmi'; // Asegúrate de importar solo lo necesario
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabaseClient'; // Ya lo estás importando

const wagmiConfig = createConfig({
  chains: [],
  // ...otras configuraciones de wagmi
});

export default function PoVPage() {
  const { address, isConnected } = useAccount();
  const [pollData, setPollData] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    async function fetchPolls() {
      try {
        // Obtener las encuestas activas desde Supabase directamente
        const { data, error } = await supabase
          .from('polls') // Asegúrate de que la tabla se llame 'polls'
          .select('id, question, created_at')
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setPollData(data);
      } catch (error) {
        console.error('Error fetching polls', error);
      }
    }

    fetchPolls();
  }, []); // Se ejecutará solo una vez al cargar el componente

  const handleVote = async (pollId, vote) => {
    if (!isConnected || !address) {
      setStatusMessage('Please connect your wallet first.');
      return;
    }

    try {
      const { data, error } = await supabase
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
    <WagmiConfig config={wagmiConfig}> {/* Solo envuelve el contenido principal aquí */}
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
    </WagmiConfig>
  );
}
