// ✅ Enhanced Dino Jump+ Game Files (Responsive, Polished, Feature-Rich)

// ------------ ✅ GameCanvas.tsx ------------
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

  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 550;
  const GROUND_Y = 240; // synced with engine

  const drawDinosaur = (ctx: CanvasRenderingContext2D) => {
    const { x, y, width, height, animationFrame, isJumping } = dinosaur;

    ctx.fillStyle = '#10B981';
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = '#065F46';
    if (!isJumping && Math.floor(animationFrame) === 0) {
      ctx.fillRect(x + 5, y + height - 10, 8, 8);
      ctx.fillRect(x + 20, y + height - 10, 8, 8);
    } else if (!isJumping) {
      ctx.fillRect(x + 10, y + height - 10, 8, 8);
      ctx.fillRect(x + 25, y + height - 10, 8, 8);
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 30, y + 10, 6, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 32, y + 12, 2, 2);
  };

  const drawObstacles = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#DC2626';
    obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.fillStyle = '#B91C1C';
      ctx.fillRect(obstacle.x + 2, obstacle.y + 5, 4, 15);
      ctx.fillRect(obstacle.x + 11, obstacle.y + 8, 4, 12);
      ctx.fillStyle = '#DC2626';
    });
  };

  const drawGround = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 47);
    ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 47);
    ctx.stroke();

    ctx.fillStyle = '#059669';
    for (let i = 0; i < CANVAS_WIDTH; i += 20) {
      if (Math.random() > 0.7) ctx.fillRect(i, GROUND_Y + 48, 2, 2);
    }
  };

  const drawGameOverlay = (ctx: CanvasRenderingContext2D) => {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';

    if (gameState === 'waiting') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('TAP / CLICK / SPACE TO START', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = '#DC2626';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '18px sans-serif';
      ctx.fillText('Tap or press SPACE to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bg.addColorStop(0, '#3B82F6');
      bg.addColorStop(1, '#1E40AF');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawGround(ctx);
      drawDinosaur(ctx);
      drawObstacles(ctx);
      drawGameOverlay(ctx);

      requestAnimationFrame(render);
    };

    render();
  }, [gameState, dinosaur, obstacles]);

  const handleCanvasClick = () => {
    if (gameState === 'waiting' || gameState === 'gameOver') onStart();
    else if (gameState === 'playing') onJump();
  };

  return (
    <div className="w-full flex justify-center mb-6">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-white/20 rounded-lg bg-blue-600 cursor-pointer hover:border-white/40 transition shadow-md"
        onClick={handleCanvasClick}
      />
    </div>
  );
};
