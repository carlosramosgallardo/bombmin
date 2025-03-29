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

    // Pre-game countdown: 3 seconds
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
    // Escoge aleatoriamente un patrón entre aritmético, geométrico o alterno
    const patternType = ['aritmético', 'geométrico', 'alterno'][Math.floor(Math.random() * 3)];
  
    let sequence = [];
    let answer;
    
    if (patternType === 'aritmético') {
      const first = Math.floor(Math.random() * 20) + 1;
      const diff = Math.floor(Math.random() * 10) + 1;
      // Genera 4 números y el quinto es el que se debe adivinar
      for (let i = 0; i < 4; i++) {
        sequence.push(first + diff * i);
      }
      answer = first + diff * 4;
    }
    
    if (patternType === 'geométrico') {
      const first = Math.floor(Math.random() * 10) + 1;
      const factor = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < 4; i++) {
        sequence.push(first * Math.pow(factor, i));
      }
      answer = first * Math.pow(factor, 4);
    }
    
    if (patternType === 'alterno') {
      // Ejemplo: posición impar aumenta en 1, posición par es el doble del anterior
      const start = Math.floor(Math.random() * 10) + 1;
      sequence.push(start);
      for (let i = 1; i < 4; i++) {
        if (i % 2 === 0) {
          // posición par: duplicar el número anterior
          sequence.push(sequence[i - 1] * 2);
        } else {
          // posición impar: incrementar en 1 el valor anterior
          sequence.push(sequence[i - 1] + 1);
        }
      }
      // Calcula el siguiente número siguiendo la misma lógica
      if (sequence.length % 2 === 0) {
        answer = sequence[sequence.length - 1] + 1;
      } else {
        answer = sequence[sequence.length - 1] * 2;
      }
    }
    
    // Guarda el problema y la respuesta correcta.
    // Por simplicidad, guardamos el patrón y la secuencia en lugar de dos números y una operación.
    setProblem({ sequence, answer, patternType });
    setUserAnswer('');
    setElapsedTime(0);
    setGameCompleted(false);
    setGameData(null);
  };
  
  const checkAnswer = () => {
    if (!problem || isDisabled) return;

    clearInterval(solveIntervalRef.current);
    const totalTime = elapsedTime;
    const correct = parseInt(userAnswer, 10) === problem.result;

    let miningAmount = 0;

    if (correct) {
      if (totalTime <= 5000) {
        // Positive reward based on speed
        miningAmount = PARTICIPATION_PRICE * ((5000 - totalTime) / 5000);
      } else {
        // Penalty for slow answer (up to -10% of token value)
        const overTime = Math.min(totalTime - 5000, 5000);
        const penaltyRatio = overTime / 5000;
        miningAmount = -PARTICIPATION_PRICE * 0.10 * penaltyRatio;
      }

      const displayAmount =
        Math.abs(miningAmount) < 0.00000001
          ? '< 0.00000001'
          : miningAmount.toFixed(8);

      const message =
        miningAmount >= 0
          ? `Inject Value now: ${displayAmount}`
          : `Inject Value now: ${displayAmount}`;

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
    <div className="text-center mt-4">
  {problem && (
    <>
      <p className="text-xl">
        {problem.num1} {problem.operation} {problem.num2} = ?
      </p>
      <p className="text-sm text-gray-400">
        Time elapsed: <span className="text-yellow-300">{preGameCountdown > 0 ? 0 : elapsedTime} ms</span>
      </p>

      {preGameCountdown > 0 && (
        <p className="text-gray-500 mt-2">Please wait {preGameCountdown} second(s)...</p>
      )}

      <div className="flex justify-center items-center gap-2 mt-4">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-24 border border-gray-300 px-2 py-1 rounded text-black text-center"
          disabled={isDisabled}
          placeholder="Answer"
        />
        <button
          onClick={checkAnswer}
          className={`px-4 py-1 rounded ${
            isDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'
          }`}
          disabled={isDisabled}
        >
          Submit
        </button>
      </div>
    </>
  )}
</div>

  );
}
