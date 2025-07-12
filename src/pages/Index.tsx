
import { useState, useEffect } from 'react';
import { GameCanvas } from '@/components/GameCanvas';
import { GameUI } from '@/components/GameUI';
import { MobileControls } from '@/components/MobileControls';
import { useGameEngine } from '@/hooks/useGameEngine';

const Index = () => {
  const {
    gameState,
    score,
    highScore,
    startGame,
    jump,
    resetGame,
    dinosaur,
    obstacles
  } = useGameEngine();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'waiting' || gameState === 'gameOver') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, startGame, jump]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-blue-600 to-blue-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wider">
            DINO JUMP<span className="text-yellow-400">+</span>
          </h1>
          <p className="text-blue-200 text-lg">
            The modern Chrome Dino experience
          </p>
        </div>

        {/* Game Container */}
        <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10">
          <GameUI score={score} highScore={highScore} gameState={gameState} />
          <GameCanvas 
            gameState={gameState}
            dinosaur={dinosaur}
            obstacles={obstacles}
            onJump={jump}
            onStart={startGame}
            onReset={resetGame}
          />
          <MobileControls 
            gameState={gameState}
            onJump={jump}
            onStart={startGame}
            onReset={resetGame}
          />
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 text-blue-200">
          <p className="text-sm opacity-80">
            Press <kbd className="px-2 py-1 bg-white/10 rounded">SPACE</kbd> to jump • Touch screen for mobile
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
