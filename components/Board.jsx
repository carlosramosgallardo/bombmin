'use client';

import { useState, useEffect, useRef } from 'react';

export default function Board({ account, setGameMessage, setGameCompleted, setGameData }) {
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [isDisabled, setIsDisabled] = useState(true);
  const [gameMessage, setLocalGameMessage] = useState('');
  const [isFading, setIsFading] = useState(false);

  const PARTICIPATION_PRICE = parseFloat(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE);
  const preGameIntervalRef = useRef(null);
  const solveIntervalRef = useRef(null);

  useEffect(() => {
    const fetchPhrase = async () => {
      try {
        const res = await fetch('/math_phrases.json');
        const phrases = await res.json();
        const chosen = phrases[Math.floor(Math.random() * phrases.length)];
        setProblem(chosen);
      } catch (error) {
        console.error('Error fetching phrase:', error);
      }
    };

    fetchPhrase();

    preGameIntervalRef.current = setInterval(() => {
      setPreGameCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(preGameIntervalRef.current);
          startSolveTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(preGameIntervalRef.current);
      clearInterval(solveIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!gameMessage) return;

    setIsFading(false);
    const fadeTimer = setTimeout(() => setIsFading(true), 3500);
    const removeTimer = setTimeout(() => setLocalGameMessage(''), 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [gameMessage]);

  const startSolveTimer = () => {
    setIsDisabled(false);
    const startTime = Date.now();
    solveIntervalRef.current = setInterval(() => {
      const timePassed = Date.now() - startTime;
      setElapsedTime(timePassed);

      if (timePassed >= 10000) {
        clearInterval(solveIntervalRef.current);
        showMessage('⏳ Time exceeded! No mining reward.');
        finalizeGame(false, 0);
      }
    }, 100);
  };

  const showMessage = (msg) => {
    setLocalGameMessage(msg);
    setGameMessage(msg);
  };

  const checkAnswer = () => {
    if (!problem || isDisabled) return;

    clearInterval(solveIntervalRef.current);
    const totalTime = elapsedTime;
    const correct = userAnswer.trim().toLowerCase() === problem.answer.trim().toLowerCase();
    let miningAmount = 0;

    if (correct) {
      if (totalTime <= 5000) {
        miningAmount = PARTICIPATION_PRICE * ((5000 - totalTime) / 5000);
      } else {
        const overTime = Math.min(totalTime - 5000, 5000);
        const penaltyRatio = overTime / 5000;
        miningAmount = -PARTICIPATION_PRICE * 0.10 * penaltyRatio;
      }

      const displayAmount =
        Math.abs(miningAmount) < 0.00000001 ? '< 0.00000001' : miningAmount.toFixed(8);
      const message = account
        ? `Inject MM3 now: ${displayAmount}`
        : `Connect your wallet to proceed with injecting MM3: ${displayAmount}.`;
      showMessage(message);
    } else {
      showMessage('❌ Incorrect! No mining reward.');
    }

    finalizeGame(correct, miningAmount);
  };

  const finalizeGame = (isCorrect, miningAmount) => {
    setIsDisabled(true);
    setGameCompleted(true);

    setGameData({
      wallet: account,
      problem: problem.masked,
      user_answer: userAnswer,
      is_correct: isCorrect,
      time_ms: elapsedTime,
      mining_reward: miningAmount,
    });
  };

  return (
    <>
      <div className="w-full mt-10 bg-gray-900 p-4 rounded-xl shadow-lg text-center">
        <div className="bg-[#0b0f19] p-4 rounded-xl">
          {problem && (
            <>
              <div className="text-base font-mono text-[#22d3ee] flex flex-wrap justify-center items-center gap-1">
                {problem.masked.split('___').map((part, index, arr) => (
                  <span key={index}>
                    {part}
                    {index < arr.length - 1 && (
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="inline-block w-32 px-2 py-1 mx-1 border-b-2 border-yellow-400 text-center font-mono text-yellow-200 bg-white/10 backdrop-blur-md placeholder-[#64748b] italic tracking-wider transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:shadow-[0_0_20px_rgba(253,224,71,0.6)] hover:shadow-[0_0_15px_rgba(253,224,71,0.4)] animate-pulse hover:scale-105"
                        placeholder="fill the gap"
                        disabled={isDisabled}
                      />
                    )}
                  </span>
                ))}
              </div>

              <p className="text-sm text-[#22d3ee] mt-2">
                Time elapsed:{' '}
                <span className="text-yellow-300">
                  {preGameCountdown > 0 ? 0 : elapsedTime} ms
                </span>
              </p>

              {preGameCountdown > 0 && (
                <p className="mt-2 text-[#22d3ee]">
                  Please wait {preGameCountdown} second(s)...
                </p>
              )}

              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={checkAnswer}
                  className={`px-4 py-1 mx-2 rounded-xl font-mono text-sm transition-all duration-300 ease-in-out border-2 ${
                    isDisabled
                      ? 'bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-yellow-300 text-[#0b0f19] border-yellow-400 shadow-[0_0_15px_rgba(253,224,71,0.4)] hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(253,224,71,0.6)] hover:scale-105'
                  }`}
                  disabled={isDisabled}
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mensaje de resultado tipo toast */}
      {gameMessage && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#0f172a] border border-yellow-400 text-yellow-300 px-4 py-2 rounded-xl shadow-xl font-mono text-sm z-50 transition-opacity duration-500 ${
            isFading ? 'opacity-0 translate-y-2' : 'opacity-100'
          }`}
        >
          {gameMessage}
        </div>
      )}
    </>
  );
}
