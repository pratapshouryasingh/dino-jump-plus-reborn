import { useState, useEffect, useCallback, useRef } from 'react';

export type GameState = 'waiting' | 'playing' | 'paused' | 'gameOver';
export type GameMode = 'easy' | 'normal' | 'hard';

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Dinosaur extends GameObject {
  velocityY: number;
  isJumping: boolean;
  isCrouching: boolean;
  animationFrame: number;
}

export interface Obstacle extends GameObject {
  speed: number;
}

export interface GameEngineOptions {
  mode?: GameMode;
  onJump?: () => void;
  onGameOver?: () => void;
  onScoreMilestone?: (milestone: number) => void;
}

export const useGameEngine = ({
  mode = 'normal',
  onJump,
  onGameOver,
  onScoreMilestone,
}: GameEngineOptions = {}) => {
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
    isCrouching: false,
    animationFrame: 0
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const gameSpeedRef = useRef(4);
  const scoreRef = useRef(0);
  const lastMilestoneRef = useRef(0);

  const CANVAS_HEIGHT = 300;
  const GROUND_Y = 240;
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;

  const getBaseSpeed = () => {
    switch (mode) {
      case 'easy': return 3;
      case 'hard': return 5;
      default: return 4;
    }
  };

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    scoreRef.current = 0;
    gameSpeedRef.current = getBaseSpeed();
    lastMilestoneRef.current = 0;

    dinoRef.current = {
      x: 100,
      y: GROUND_Y,
      width: 44,
      height: 47,
      velocityY: 0,
      isJumping: false,
      isCrouching: false,
      animationFrame: 0
    };

    obstaclesRef.current = [];
  }, [mode]);

  const jump = useCallback(() => {
    if (gameState === 'playing' && !dinoRef.current.isJumping) {
      dinoRef.current.velocityY = JUMP_FORCE;
      dinoRef.current.isJumping = true;
      if (onJump) onJump();
    }
  }, [gameState, onJump]);

  const crouch = useCallback((state: boolean) => {
    if (gameState === 'playing') {
      dinoRef.current.isCrouching = state;
      dinoRef.current.height = state ? 30 : 47;
    }
  }, [gameState]);

  const pauseGame = useCallback(() => {
    setGameState('paused');
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  }, []);

  const resumeGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const resetGame = useCallback(() => {
    setGameState('waiting');
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
  }, []);

  const checkCollision = (rect1: GameObject, rect2: GameObject): boolean => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const dino = dinoRef.current;

    // Apply gravity
    dino.velocityY += GRAVITY;
    dino.y += dino.velocityY;

    if (dino.y >= GROUND_Y) {
      dino.y = GROUND_Y;
      dino.velocityY = 0;
      dino.isJumping = false;
    }

    // Update animation
    dino.animationFrame = (dino.animationFrame + 0.2) % 2;

    // Move obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      obstacle.x -= gameSpeedRef.current;
      return obstacle.x + obstacle.width > 0;
    });

    // Spawn obstacles
    const last = obstaclesRef.current.at(-1);
    const shouldSpawn = !last || last.x < 600;
    if (shouldSpawn && Math.random() < 0.01) {
      obstaclesRef.current.push({
        x: 800,
        y: GROUND_Y - 30,
        width: 17,
        height: 35,
        speed: gameSpeedRef.current
      });
    }

    // Collision check
    for (const obstacle of obstaclesRef.current) {
      if (checkCollision(dino, obstacle)) {
        setGameState('gameOver');
        const finalScore = scoreRef.current;
        setScore(Math.floor(finalScore));
        if (finalScore > highScore) {
          setHighScore(Math.floor(finalScore));
          localStorage.setItem('dinoJumpHighScore', Math.floor(finalScore).toString());
        }
        if (onGameOver) onGameOver();
        return;
      }
    }

    // Scoring and speed
    scoreRef.current += 0.1;
    const currentScore = Math.floor(scoreRef.current);
    setScore(currentScore);

    if (currentScore >= lastMilestoneRef.current + 100) {
      lastMilestoneRef.current = currentScore;
      if (onScoreMilestone) onScoreMilestone(currentScore);
    }

    const baseSpeed = getBaseSpeed();
    const speedBoost = currentScore >= 100 ? 3 : 0;
    gameSpeedRef.current = Math.min(baseSpeed + currentScore * 0.005 + speedBoost, 15);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, highScore, onGameOver, onScoreMilestone]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, gameLoop]);

  return {
    gameState,
    score,
    highScore,
    dinosaur: dinoRef.current,
    obstacles: obstaclesRef.current,
    startGame,
    jump,
    crouch,
    pauseGame,
    resumeGame,
    resetGame
  };
};
