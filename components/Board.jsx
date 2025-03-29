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
    const gameTypes = ['aritmetica', 'geometrica', 'factores', 'angulo', 'ecuacion', 'producto'];
    const randomGame = gameTypes[Math.floor(Math.random() * gameTypes.length)];
  
    let sequence = [];
    let answer;
    let patternType = randomGame;
  
    if (randomGame === 'aritmetica') {
      const first = Math.floor(Math.random() * 20) + 1;
      const diff = Math.floor(Math.random() * 10) + 1;
      for (let i = 0; i < 4; i++) {
        sequence.push(first + diff * i);
      }
      answer = first + diff * 4;
    }
  
    if (randomGame === 'geometrica') {
      const first = Math.floor(Math.random() * 10) + 1;
      const factor = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < 4; i++) {
        sequence.push(first * Math.pow(factor, i));
      }
      answer = first * Math.pow(factor, 4);
    }
  
    if (randomGame === 'factores') {
      const num = Math.floor(Math.random() * 100) + 20;
      let count = 0;
      let n = num;
      for (let i = 2; i <= n; i++) {
        while (n % i === 0) {
          count++;
          n /= i;
        }
      }
      sequence = [`¿Cuántos factores primos tiene ${num}?`];
      answer = count;
    }
  
    if (randomGame === 'angulo') {
      const angle1 = Math.floor(Math.random() * 80) + 30;
      const angle2 = Math.floor(Math.random() * (180 - angle1 - 30)) + 20;
      const missing = 180 - angle1 - angle2;
      sequence = [`Triángulo con ángulos ${angle1}° y ${angle2}°. ¿Cuánto falta?`];
      answer = missing;
    }
  
    if (randomGame === 'ecuacion') {
      const x = Math.floor(Math.random() * 10) + 1;
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const c = a * x + b;
      sequence = [`Resuelve: ${a}x + ${b} = ${c}`];
      answer = x;
    }
  
    if (randomGame === 'producto') {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const product = a * b;
      const hideLeft = Math.random() < 0.5;
  
      if (hideLeft) {
        sequence = [`? x ${b} = ${product}`];
        answer = a;
      } else {
        sequence = [`${a} x ? = ${product}`];
        answer = b;
      }
    }
  
    // Guardar problema
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
