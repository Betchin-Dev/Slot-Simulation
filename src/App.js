import React, { useState, useEffect } from 'react';
import './App.css';
import useSound from 'use-sound'; 
import spinSoundFile from './spin-sound.mp3';
import winSoundFile from './win-sound.wav';

const symbols = ['🍒', '🍇', '🍊', '🍋', '🍉', '🍍'];

const App = () => {
  const [slots, setSlots] = useState(Array(9).fill(0));
  const [rolling, setRolling] = useState(false);
  const [score, setScore] = useState(0);
  const [winningCombination, setWinningCombination] = useState([]);

  const [playSpinSound, { stop: stopSpinSound }] = useSound(spinSoundFile);
  const [playWinSound, { stop: stopWinSound }] = useSound(winSoundFile);

  useEffect(() => {
    // Preload the audio files
    new Audio(spinSoundFile).preload = 'auto';
    new Audio(winSoundFile).preload = 'auto';
  }, []);

  useEffect(() => {
    if (rolling) {
      // Play spin sound when rolling starts
      playSpinSound();
    } else {
      // Stop the spin sound when rolling stops
      stopSpinSound();
    }
  }, [rolling, playSpinSound, stopSpinSound]);

  useEffect(() => {
    if (winningCombination.length > 0) {
      // Play win sound when winning combination is detected
      playWinSound();
      // Increase score when winning
      setScore(prevScore => prevScore + 10); // Assuming each win gives 10 points
    } else {
      // Stop the win sound when no winning combination
      stopWinSound();
    }
  }, [winningCombination, playWinSound, stopWinSound]);

  const spin = () => {
    if (!rolling) {
      setRolling(true);
      setWinningCombination([]);

      const spinIntervals = Array(9).fill().map((_, index) => {
        return setInterval(() => {
          setSlots(prevSlots => {
            const newSlots = [...prevSlots];
            newSlots[index] = Math.floor(Math.random() * symbols.length);
            return newSlots;
          });
        }, 100);
      });

      setTimeout(() => {
        spinIntervals.forEach(interval => clearInterval(interval));
        const combination = checkWinning();
        if (combination.length > 0) {
          setWinningCombination(combination);
        }
        setRolling(false);
      }, 3000);
    }
  };

  const checkWinning = () => {
    const lines = [
      [0, 1, 2], // Horizontal lines
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // Vertical lines
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // Diagonal lines
      [2, 4, 6]
    ];
  
    for (const line of lines) {
      const [a, b, c] = line;
      if (slots[a] !== 0 && slots[a] === slots[b] && slots[a] === slots[c]) {
        return line;
      }
    }
    // No winning combination found
    return [];
  };

  return (
    <div className="app">
      <h1>Slot Simulation Game</h1>
      <div className="score">Score: {score}</div>
      {winningCombination.length > 0 && (
        <div className="win-text">You win!</div>
      )}
      {[0, 1, 2].map(row => (
        <div key={row} className={`slots ${rolling ? 'rolling' : ''}`}>
          {[0, 1, 2].map(col => (
            <div key={col} className={`slot ${winningCombination.includes(row * 3 + col) ? 'winning' : ''}`}>
              {symbols[slots[row * 3 + col]]}
            </div>
          ))}
        </div>
      ))}
      <button className="spin-btn" onClick={spin} disabled={rolling}>
        {rolling ? 'Spinning...' : 'Spin'}
      </button>
    </div>
  );
};

export default App;
