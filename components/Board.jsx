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
    const gameTypes = ['arithmetic', 'geometric', 'missingAngle', 'equation', 'missingFactor', 'digitSum'];
    const randomGame = gameTypes[Math.floor(Math.random() * gameTypes.length)];
  
    let sequence = [];
    let answer;
    let patternType = randomGame;
  
    if (randomGame === 'arithmetic') {
      const start = Math.floor(Math.random() * 50) + 1;
      const step = Math.floor(Math.random() * 10) + 1;
      for (let i = 0; i < 4; i++) {
        sequence.push(start + i * step);
      }
      answer = start + 4 * step;
    }
  
    if (randomGame === 'geometric') {
      const base = Math.floor(Math.random() * 5) + 2;
      const ratio = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < 4; i++) {
        sequence.push(base * Math.pow(ratio, i));
      }
      answer = base * Math.pow(ratio, 4);
    }
  
    if (randomGame === 'missingAngle') {
      const a = Math.floor(Math.random() * 80) + 20;
      const b = Math.floor(Math.random() * (180 - a - 20)) + 10;
      const c = 180 - a - b;
      sequence = [`A triangle has angles ${a}° and ${b}°. What is the missing angle?`];
      answer = c;
    }
  
    if (randomGame === 'equation') {
      const x = Math.floor(Math.random() * 20) + 1;
      const m = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10);
      const result = m * x + b;
      sequence = [`Solve for x: ${m}x + ${b} = ${result}`];
      answer = x;
    }
  
    if (randomGame === 'missingFactor') {
      const a = Math.floor(Math.random() * 12) + 1;
      const b = Math.floor(Math.random() * 12) + 1;
      const hideLeft = Math.random() < 0.5;
      const product = a * b;
  
      sequence = hideLeft
        ? [`? × ${b} = ${product}`]
        : [`${a} × ? = ${product}`];
  
      answer = hideLeft ? a : b;
    }
  
    if (randomGame === 'digitSum') {
      const num = Math.floor(Math.random() * 9000) + 1000;
      const sum = num
        .toString()
        .split('')
        .reduce((acc, d) => acc + parseInt(d), 0);
      sequence = [`What is the sum of the digits of ${num}?`];
      answer = sum;
    }
  
    setProblem({ sequence, answer, patternType });
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
    // Compara la respuesta del usuario con problem.answer
    const correct = parseInt(userAnswer, 10) === problem.answer;

    let miningAmount = 0;

    if (correct) {
      if (totalTime <= 5000) {
        // Recompensa positiva basada en la velocidad
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

      const message = `Inject Value now: ${displayAmount}`;
      setGameMessage(message);
    } else {
      setGameMessage('❌ Incorrect! No mining reward.');
    }

    finalizeGame(correct, miningAmount);
  };

  const finalizeGame = (isCorrect, miningAmount) => {
    setIsDisabled(true);
    setGameCompleted(true);

    // Guarda los datos del juego.
    // En este ejemplo, se almacena la secuencia y el valor correcto para referencia.
    setGameData({
      wallet: account,
      problem: problem.sequence.join(', ') + ' , ?',
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
            {problem.sequence.join(', ')} , ?
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
