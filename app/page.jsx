'use client';

import { useState, useEffect } from 'react';
import ConnectAndPlay from '@/components/ConnectAndPlay';
import Board from '@/components/Board';
import Leaderboard from '@/components/Leaderboard';
import TokenChart from '@/components/TokenChart';
import supabase from '@/lib/supabaseClient';

import '@/app/globals.css';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GA_ENABLED = process.env.NEXT_PUBLIC_GA_ENABLED === 'true';

export default function Page() {
  const [account, setAccount] = useState(null);
  const [gameMessage, setGameMessage] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    if (!GA_ENABLED || !GA_MEASUREMENT_ID) return;

    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);
  }, []);

  useEffect(() => {
    const saveGame = async () => {
      if (!gameData || !account) return;

      try {
        const { error } = await supabase.from('games').insert([gameData]);
        if (error) {
          console.error('Supabase insert error:', error.message);
          setGameMessage('Error saving game data. Transaction aborted.');
        } else {
          console.log('Game saved successfully');
        }
      } catch (e) {
        console.error('Unexpected error saving game:', e);
        setGameMessage('Unexpected error. Try again.');
      }
    };

    saveGame();
  }, [gameData]);

  return (
    <main className="flex flex-col items-center w-full px-4 pt-10 pb-20 text-lg font-mono text-white bg-black">
      <div className="w-full max-w-3xl mx-auto">
      <section className="mb-6">
        <p className="text-base">
          Master Math, Mine MM3, and Shape the Future with PoV & PoA.
        </p>
      </section>
        {/* Game Board */}
        <div className="mb-12">
          {account && (
            <p className="text-base text-gray-500 text-center mb-2">
              Connected as: {account}
            </p>
          )}
          <Board
            account={account}
            setGameMessage={setGameMessage}
            setGameCompleted={setGameCompleted}
            setGameData={setGameData}
          />
          {gameMessage && (
            <div className="text-yellow-400 font-bold text-center mt-6 whitespace-pre-line animate-fade-in">
              {gameMessage}
            </div>
          )}
        </div>

        {/* Connect & Play */}
        <div className="mb-12">
          <ConnectAndPlay
            account={account}
            setAccount={setAccount}
            gameCompleted={gameCompleted}
            gameData={gameData}
          />
        </div>

        {/* Token Chart */}
        <div className="mb-16">
          <TokenChart />
        </div>

        {/* Leaderboard */}
        <div className="mb-16">
          <Leaderboard itemsPerPage={10} />
        </div>
      </div>
    </main>
  );
}
