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
    const generateNewProblem = () => {
      const gameTypes = ['normal', 'primes', 'hex', 'mixed', 'divisionClean'];
      const randomGame = gameTypes[Math.floor(Math.random() * gameTypes.length)];
    
      let sequence = [];
      let answer;
      let patternType = randomGame;
    
      const getRandomPrime = () => {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
        return primes[Math.floor(Math.random() * primes.length)];
      };
    
      const getRandomOperator = () => {
        return ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
      };
    
      const emojiByType = {
        normal: '🧠',
        primes: '🧬',
        hex: '👾',
        mixed: '🔀',
        divisionClean: '📏'
      };
    
      const formatMathProblem = (a, op, b, type) => {
        let left = a;
        let right = b;
        let operator = op;
    
        if (op === '*') operator = '×';
        if (op === '/') operator = '÷';
        if (op === '+') operator = '+';
        if (op === '-') operator = '−';
    
        // Handle hex
        if (type === 'hex' || type === 'mixed') {
          if (type === 'hex') {
            left = `𝙷𝚎𝚡(0x${a.toString(16).toUpperCase()})`;
            right = `𝙷𝚎𝚡(0x${b.toString(16).toUpperCase()})`;
          } else {
            left = `𝙷𝚎𝚡(0x${a.toString(16).toUpperCase()})`;
            right = `𝓟(${b})`;
          }
        }
    
        // Handle primes
        if (type === 'primes') {
          left = `𝓟(${a})`;
          right = `𝓟(${b})`;
        }
    
        const emoji = emojiByType[type] || '🧠';
        return `${emoji} Solve:   ${left}  ${operator}  ${right}  =  ?`;
      };
    
      // GAME TYPES
      if (randomGame === 'normal') {
        const a = Math.floor(Math.random() * 50) + 1;
        const b = Math.floor(Math.random() * 50) + 1;
        const op = getRandomOperator();
        let expr = `${a} ${op} ${b}`;
        answer = eval(expr);
        if (op === '/') answer = Math.floor(answer);
        sequence = [formatMathProblem(a, op, b, randomGame)];
      }
    
      if (randomGame === 'primes') {
        const a = getRandomPrime();
        const b = getRandomPrime();
        const op = getRandomOperator();
        let expr = `${a} ${op} ${b}`;
        answer = eval(expr);
        if (op === '/') answer = Math.floor(answer);
        sequence = [formatMathProblem(a, op, b, randomGame)];
      }
    
      if (randomGame === 'hex') {
        const a = Math.floor(Math.random() * 15) + 1;
        const b = Math.floor(Math.random() * 15) + 1;
        const op = getRandomOperator();
        answer = eval(`${a} ${op} ${b}`);
        if (op === '/') answer = Math.floor(answer);
        sequence = [formatMathProblem(a, op, b, randomGame)];
      }
    
      if (randomGame === 'mixed') {
        const a = Math.floor(Math.random() * 15) + 1;
        const b = getRandomPrime();
        const op = getRandomOperator();
        answer = eval(`${a} ${op} ${b}`);
        if (op === '/') answer = Math.floor(answer);
        sequence = [formatMathProblem(a, op, b, randomGame)];
      }
    
      if (randomGame === 'divisionClean') {
        const b = Math.floor(Math.random() * 12) + 1;
        const a = b * (Math.floor(Math.random() * 10) + 1);
        answer = a / b;
        sequence = [formatMathProblem(a, '/', b, randomGame)];
      }
    
      answer = Math.floor(answer); // ensure integer
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
