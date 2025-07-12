
import { useState, useEffect, useCallback, useRef } from 'react';

export type GameState = 'waiting' | 'playing' | 'gameOver';

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Dinosaur extends GameObject {
  velocityY: number;
  isJumping: boolean;
  animationFrame: number;
}

export interface Obstacle extends GameObject {
  speed: number;
}

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('dinoJumpHighScore');
    return saved ? parseInt(saved) : 0;
  });

  const gameLoopRef = useRef<number>();
  const dinoRef = useRef<Dinosaur>({
    x: 100,
    y: 200,
    width: 44,
    height: 47,
    velocityY: 0,
    isJumping: false,
    animationFrame: 0
  });
  const obstaclesRef = useRef<Obstacle[]>([]);
  const gameSpeedRef = useRef(4);
  const scoreRef = useRef(0);

  const CANVAS_HEIGHT = 300;
  const GROUND_Y = 240;
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    scoreRef.current = 0;
    gameSpeedRef.current = 4;
    
    // Reset dinosaur
    dinoRef.current = {
      x: 100,
      y: GROUND_Y,
      width: 44,
      height: 47,
      velocityY: 0,
      isJumping: false,
      animationFrame: 0
    };
    
    // Clear obstacles
    obstaclesRef.current = [];
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !dinoRef.current.isJumping) {
      dinoRef.current.velocityY = JUMP_FORCE;
      dinoRef.current.isJumping = true;
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState('waiting');
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  }, []);

  const checkCollision = (rect1: GameObject, rect2: GameObject): boolean => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    // Update dinosaur physics
    const dino = dinoRef.current;
    dino.velocityY += GRAVITY;
    dino.y += dino.velocityY;

    // Ground collision
    if (dino.y >= GROUND_Y) {
      dino.y = GROUND_Y;
      dino.velocityY = 0;
      dino.isJumping = false;
    }

    // Update animation frame
    dino.animationFrame = (dino.animationFrame + 0.2) % 2;

    // Update obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      obstacle.x -= gameSpeedRef.current;
      return obstacle.x + obstacle.width > 0;
    });

    // Spawn new obstacles
    if (Math.random() < 0.008) {
      obstaclesRef.current.push({
        x: 800,
        y: GROUND_Y - 30,
        width: 17,
        height: 35,
        speed: gameSpeedRef.current
      });
    }

    // Check collisions
    for (const obstacle of obstaclesRef.current) {
      if (checkCollision(dino, obstacle)) {
        setGameState('gameOver');
        const newScore = scoreRef.current;
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('dinoJumpHighScore', newScore.toString());
        }
        return;
      }
    }

    // Update score
    scoreRef.current += 0.1;
    setScore(Math.floor(scoreRef.current));

    // Increase speed over time
    gameSpeedRef.current = Math.min(4 + scoreRef.current * 0.005, 12);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, highScore]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  return {
    gameState,
    score,
    highScore,
    startGame,
    jump,
    resetGame,
    dinosaur: dinoRef.current,
    obstacles: obstaclesRef.current
  };
};
