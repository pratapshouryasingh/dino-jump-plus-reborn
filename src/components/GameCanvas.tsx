
import { useEffect, useRef } from 'react';
import { GameState, Dinosaur, Obstacle } from '@/hooks/useGameEngine';

interface GameCanvasProps {
  gameState: GameState;
  dinosaur: Dinosaur;
  obstacles: Obstacle[];
  onJump: () => void;
  onStart: () => void;
  onReset: () => void;
}

export const GameCanvas = ({ gameState, dinosaur, obstacles, onJump, onStart, onReset }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 300;
  const GROUND_Y = 240;

  const drawDinosaur = (ctx: CanvasRenderingContext2D) => {
    const { x, y, width, height, animationFrame, isJumping } = dinosaur;
    
    ctx.fillStyle = '#10B981'; // Emerald green
    ctx.fillRect(x, y, width, height);
    
    // Add simple animation frames
    ctx.fillStyle = '#065F46'; // Darker green for details
    if (!isJumping && Math.floor(animationFrame) === 0) {
      ctx.fillRect(x + 5, y + height - 10, 8, 8); // Leg 1
      ctx.fillRect(x + 20, y + height - 10, 8, 8); // Leg 2
    } else if (!isJumping) {
      ctx.fillRect(x + 10, y + height - 10, 8, 8); // Leg 1
      ctx.fillRect(x + 25, y + height - 10, 8, 8); // Leg 2
    }
    
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 30, y + 10, 6, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 32, y + 12, 2, 2);
  };

  const drawObstacles = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#DC2626'; // Red
    obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      // Add cactus details
      ctx.fillStyle = '#B91C1C';
      ctx.fillRect(obstacle.x + 2, obstacle.y + 5, 4, 15);
      ctx.fillRect(obstacle.x + 11, obstacle.y + 8, 4, 12);
      ctx.fillStyle = '#DC2626';
    });
  };

  const drawGround = (ctx: CanvasRenderingContext2D) => {
    // Ground line
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 47);
    ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 47);
    ctx.stroke();
    
    // Ground dots pattern
    ctx.fillStyle = '#059669';
    for (let i = 0; i < CANVAS_WIDTH; i += 20) {
      if (Math.random() > 0.7) {
        ctx.fillRect(i, GROUND_Y + 48, 2, 2);
      }
    }
  };

  const drawGameOverlay = (ctx: CanvasRenderingContext2D) => {
    if (gameState === 'waiting') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PRESS SPACE TO START', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      
      ctx.font = '16px sans-serif';
      ctx.fillText('Jump over obstacles and beat your high score!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(220, 38, 38, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      
      ctx.font = '18px sans-serif';
      ctx.fillText('Press SPACE to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      gradient.addColorStop(0, '#3B82F6');
      gradient.addColorStop(1, '#1E40AF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw game elements
      drawGround(ctx);
      drawDinosaur(ctx);
      drawObstacles(ctx);
      drawGameOverlay(ctx);
      
      requestAnimationFrame(render);
    };

    render();
  }, [gameState, dinosaur, obstacles]);

  const handleCanvasClick = () => {
    if (gameState === 'waiting' || gameState === 'gameOver') {
      onStart();
    } else if (gameState === 'playing') {
      onJump();
    }
  };

  return (
    <div className="w-full flex justify-center mb-6">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-white/20 rounded-lg bg-gradient-to-b from-blue-400 to-blue-600 cursor-pointer hover:border-white/40 transition-colors shadow-lg"
        onClick={handleCanvasClick}
      />
    </div>
  );
};
