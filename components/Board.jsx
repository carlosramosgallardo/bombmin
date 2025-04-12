'use client';

import { useState, useEffect, useRef } from 'react';

function generateMathProblem() {
  const operations = ['+', '-', '*', '/'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let a = Math.floor(Math.random() * 20) + 1;
  let b = Math.floor(Math.random() * 20) + 1;
  if (op === '/') {
    a = a * b; // ensure divisible
  }
  const question = `${a} ${op} ${b}`;
  const answer = eval(question).toString();
  return {
    masked: `${question} = [MASK]`,
    answer,
    source: 'generated',
    image: null
  };
}

export default function Board({ account, setGameMessage, setGameCompleted, setGameData }) {
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [gameCompleted, setLocalGameCompleted] = useState(false);
  const [gameMessage, setLocalGameMessage] = useState(null);
  const [isFading, setIsFading] = useState(false);
  const inputRef = useRef(null);

  const PARTICIPATION_PRICE = parseFloat(process.env.NEXT_PUBLIC_PARTICIPATION_PRICE);
  const preGameIntervalRef = useRef(null);
  const solveIntervalRef = useRef(null);

  const fetchPhrase = async () => {
    setIsRefreshing(true);
    try {
      let chosen;
      if (Math.random() < 0.3) {
        chosen = generateMathProblem();
      } else {
        const res = await fetch('/math_phrases.json');
        const phrases = await res.json();
        chosen = phrases[Math.floor(Math.random() * phrases.length)];
      }
      setProblem(chosen);
      setUserAnswer('');
      setElapsedTime(0);
      setPreGameCountdown(3);
      setIsDisabled(true);
      setLocalGameCompleted(false);
      setGameCompleted(false);
      setLocalGameMessage(null);

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
    } catch (error) {
      console.error('Error fetching phrase:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchPhrase();
    return () => {
      clearInterval(preGameIntervalRef.current);
      clearInterval(solveIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    if (!gameMessage) return;
    setIsFading(false);
    const fadeTimer = setTimeout(() => setIsFading(true), 3500);
    const removeTimer = setTimeout(() => setLocalGameMessage(null), 4000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [gameMessage]);

  const showMessage = (msg, type = 'info', isToastOnly = false) => {
    if (!isToastOnly) setGameMessage(msg);
    setLocalGameMessage({ msg, type });
  };

  const startSolveTimer = () => {
    setIsDisabled(false);
    const startTime = Date.now();
    solveIntervalRef.current = setInterval(() => {
      const timePassed = Date.now() - startTime;
      setElapsedTime(timePassed);
      if (timePassed >= 10000) {
        clearInterval(solveIntervalRef.current);
        showMessage('Time exceeded! No mining reward.', 'info', true);
        finalizeGame(false, 0);
      }
    }, 100);
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
      const displayAmount = Math.abs(miningAmount) < 0.00000001 ? '< 0.00000001' : miningAmount.toFixed(8);
      const message = account
        ? `Inject MM3 now: ${displayAmount}`
        : `Connect your wallet to proceed with injecting MM3: ${displayAmount}.`;
      showMessage(message, 'success');
    } else {
      showMessage('Incorrect! No mining reward.', 'error', true);
    }

    finalizeGame(correct, miningAmount);
  };

  const finalizeGame = (isCorrect, miningAmount) => {
    setIsDisabled(true);
    setLocalGameCompleted(true);
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
      {/* ... UI unchanged ... */}
    </>
  );
}