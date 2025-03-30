'use client';

import { useState, useEffect, useRef } from 'react';

export default function Board({ account, setGameMessage, setGameCompleted, setGameData }) {
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [isDisabled, setIsDisabled] = useState(true);

  const PARTICIPATION_PRICE = parseFloat(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE);
  const preGameIntervalRef = useRef(null);
  const solveIntervalRef = useRef(null);

  useEffect(() => {
    generateNewProblem();

    // Pre-game countdown: 3 segundos
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

  const generateNewProblem = () => {
    const num1 = Math.floor(Math.random() * 50) + 10;
    const num2 = Math.floor(Math.random() * 20) + 5;
    const operation = ['+', '-', '*'][Math.floor(Math.random() * 3)];

    let result;
    if (operation === '+') result = num1 + num2;
    if (operation === '-') result = num1 - num2;
    if (operation === '*') result = num1 * num2;

    setProblem({ num1, num2, operation, result });
    setUserAnswer('');
    setElapsedTime(0);
    setGameCompleted(false);
    setGameData(null);
  };

  const startSolveTimer = () => {
    setIsDisabled(false);
    const startTime = Date.now();

    solveIntervalRef.current = setInterval(() => {
      const timePassed = Date.now() - startTime;
      setElapsedTime(timePassed);

      if (timePassed >= 10000) {
        clearInterval(solveIntervalRef.current);
        setGameMessage('⏳ Time exceeded! No mining reward.');
        finalizeGame(false, 0);
      }
    }, 100);
  };

  const checkAnswer = () => {
    if (!problem || isDisabled) return;

    clearInterval(solveIntervalRef.current);
    const totalTime = elapsedTime;
    const correct = parseInt(userAnswer, 10) === problem.result;

    let miningAmount = 0;

    if (correct) {
      if (totalTime <= 5000) {
        // Recompensa positiva basada en la rapidez
        miningAmount = PARTICIPATION_PRICE * ((5000 - totalTime) / 5000);
      } else {
        // Penalización por respuesta lenta (hasta -10% del valor del token)
        const overTime = Math.min(totalTime - 5000, 5000);
        const penaltyRatio = overTime / 5000;
        miningAmount = -PARTICIPATION_PRICE * 0.10 * penaltyRatio;
      }

      const displayAmount =
        Math.abs(miningAmount) < 0.00000001
          ? '< 0.00000001'
          : miningAmount.toFixed(8);

      // Si no hay wallet conectada, muestra mensaje alternativo
      const message = account
      ? `Inject MM3 now: ${displayAmount}`
      : `Connect your wallet to proceed with injecting MM3: ${displayAmount}`;    
      setGameMessage(message);
    } else {
      setGameMessage('❌ Incorrect! No mining reward.');
    }

    finalizeGame(correct, miningAmount);
  };

  const finalizeGame = (isCorrect, miningAmount) => {
    setIsDisabled(true);
    setGameCompleted(true);

    setGameData({
      wallet: account,
      problem: `${problem.num1} ${problem.operation} ${problem.num2}`,
      user_answer: userAnswer,
      is_correct: isCorrect,
      time_ms: elapsedTime,
      mining_reward: miningAmount,
    });
  };

  return (
    <div className="w-full mt-10 bg-gray-900 p-4 rounded-xl shadow-lg text-center">
      <div className="bg-[#0b0f19] p-4 rounded-xl">
        {problem && (
          <>
            <p className="text-xl font-mono text-[#22d3ee]">
              {problem.num1} {problem.operation} {problem.num2} = ?
            </p>
            <p className="text-sm text-[#22d3ee]">
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
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-24 border border-[#22d3ee] bg-transparent px-2 py-1 rounded text-[#22d3ee] text-center font-mono focus:outline-none"
                disabled={isDisabled}
                placeholder="Answer"
              />
              <button
                onClick={checkAnswer}
                className={`px-4 py-1 rounded font-mono border border-[#22d3ee] ${
                  isDisabled
                    ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                    : 'bg-[#22d3ee] text-[#0b0f19] hover:bg-[#1e293b]'
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
  );
}
