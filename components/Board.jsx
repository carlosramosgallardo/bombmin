'use client';

import { useState, useEffect, useRef } from 'react';

export default function Board({ account, setGameMessage, setGameCompleted, setGameData }) {
  const [problem, setProblem] = useState(null); // Ahora contendrá { masked, answer, source }
  const [userAnswer, setUserAnswer] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [isDisabled, setIsDisabled] = useState(true);

  // Puedes usar el precio de participación si deseas mantener la lógica de recompensa
  const PARTICIPATION_PRICE = parseFloat(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE);
  const preGameIntervalRef = useRef(null);
  const solveIntervalRef = useRef(null);

  useEffect(() => {
    // Se carga la frase (problem) desde el JSON
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

    // Cuenta regresiva pre-juego: 3 segundos
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

  const startSolveTimer = () => {
    setIsDisabled(false);
    const startTime = Date.now();

    solveIntervalRef.current = setInterval(() => {
      const timePassed = Date.now() - startTime;
      setElapsedTime(timePassed);

      if (timePassed >= 10000) { // Límite de 10 segundos para adivinar
        clearInterval(solveIntervalRef.current);
        setGameMessage('⏳ Time exceeded! No reward.');
        finalizeGame(false, 0);
      }
    }, 100);
  };

  const checkAnswer = () => {
    if (!problem || isDisabled) return;

    clearInterval(solveIntervalRef.current);
    const totalTime = elapsedTime;
    // Comparamos ignorando espacios y mayúsculas/minúsculas
    const correct = userAnswer.trim().toLowerCase() === problem.answer.trim().toLowerCase();

    let reward = 0;

    if (correct) {
      if (totalTime <= 5000) {
        // Recompensa positiva basada en la rapidez
        reward = PARTICIPATION_PRICE * ((5000 - totalTime) / 5000);
      } else {
        // Penalización por respuesta lenta (hasta -10% del valor)
        const overTime = Math.min(totalTime - 5000, 5000);
        const penaltyRatio = overTime / 5000;
        reward = -PARTICIPATION_PRICE * 0.10 * penaltyRatio;
      }

      const displayReward =
        Math.abs(reward) < 0.00000001
          ? '< 0.00000001'
          : reward.toFixed(8);

      const message = account
        ? `Inject MM3 now: ${displayReward}`
        : `Connect your wallet to proceed with injecting MM3: ${displayReward}.`;
      setGameMessage(message);
    } else {
      setGameMessage('❌ Incorrect! No reward.');
    }

    finalizeGame(correct, reward);
  };

  const finalizeGame = (isCorrect, reward) => {
    setIsDisabled(true);
    setGameCompleted(true);

    setGameData({
      wallet: account,
      problem: problem.masked, // Guardamos la frase con la palabra oculta
      user_answer: userAnswer,
      is_correct: isCorrect,
      time_ms: elapsedTime,
      reward: reward,
    });
  };

  return (
    <div className="w-full mt-10 bg-gray-900 p-4 rounded-xl shadow-lg text-center">
      <div className="bg-[#0b0f19] p-4 rounded-xl">
        {problem && (
          <>
            <p className="text-xl font-serif text-[#22d3ee]">
              {problem.masked}
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
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-64 border border-[#22d3ee] bg-transparent px-2 py-1 rounded text-[#22d3ee] text-center font-serif focus:outline-none"
                disabled={isDisabled}
                placeholder="Your guess"
              />
              <button
                onClick={checkAnswer}
                className={`px-4 py-1 rounded font-serif border border-[#22d3ee] ${
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
