'use client';

import { useState, useEffect, useRef } from 'react';

export default function Board({ account, setGameMessage, setGameCompleted, setGameData }) {
  // problem contiene { masked, answer, source }
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [isDisabled, setIsDisabled] = useState(true);

  // Se utiliza el precio de participación para calcular el minado
  const PARTICIPATION_PRICE = parseFloat(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE);
  const preGameIntervalRef = useRef(null);
  const solveIntervalRef = useRef(null);

  useEffect(() => {
    // Se carga aleatoriamente una frase (problem) desde un JSON de frases
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

      if (timePassed >= 10000) { // Límite de 10 segundos
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
    // Validación de la respuesta sin considerar mayúsculas o espacios extra
    const correct = userAnswer.trim().toLowerCase() === problem.answer.trim().toLowerCase();
    let miningAmount = 0;

    if (correct) {
      if (totalTime <= 5000) {
        // Recompensa positiva proporcional a la rapidez
        miningAmount = PARTICIPATION_PRICE * ((5000 - totalTime) / 5000);
      } else {
        // Penalización por respuesta lenta (hasta -10% del valor)
        const overTime = Math.min(totalTime - 5000, 5000);
        const penaltyRatio = overTime / 5000;
        miningAmount = -PARTICIPATION_PRICE * 0.10 * penaltyRatio;
      }

      const displayAmount =
        Math.abs(miningAmount) < 0.00000001 ? '< 0.00000001' : miningAmount.toFixed(8);
      const message = account
        ? `Inject MM3 now: ${displayAmount}`
        : `Connect your wallet to proceed with injecting MM3: ${displayAmount}.`;
      setGameMessage(message);
    } else {
      setGameMessage('❌ Incorrect! No mining reward.');
    }

    finalizeGame(correct, miningAmount);
  };

  const finalizeGame = (isCorrect, miningAmount) => {
    setIsDisabled(true);
    setGameCompleted(true);

    // Se inserta en la BBDD el valor calculado en la columna "mining_reward"
    setGameData({
      wallet: account,
      problem: problem.masked, // La frase con la palabra oculta
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
