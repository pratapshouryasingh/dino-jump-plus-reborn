import { GameState } from '@/hooks/useGameEngine';

interface GameUIProps {
  score: number;
  highScore: number;
  gameState: GameState;
}

export const GameUI = ({ score, highScore, gameState }: GameUIProps) => {
  const statusText = {
    waiting: 'READY',
    playing: 'RUNNING',
    gameOver: 'CRASHED'
  };

  const statusColor = {
    waiting: 'text-blue-400',
    playing: 'text-green-400',
    gameOver: 'text-red-400'
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-white gap-4">
      <div className="flex gap-8 text-center">
        <div>
          <div className="text-sm opacity-70 uppercase tracking-wide">Score</div>
          <div className="text-2xl font-bold text-yellow-400">{score.toString().padStart(5, '0')}</div>
        </div>
        <div>
          <div className="text-sm opacity-70 uppercase tracking-wide">High Score</div>
          <div className="text-2xl font-bold text-green-400">{highScore.toString().padStart(5, '0')}</div>
        </div>
      </div>
      <div className="text-center md:text-right">
        <div className="text-sm opacity-70 uppercase tracking-wide">Status</div>
        <div className={`text-lg font-semibold ${statusColor[gameState]}`}>
          {statusText[gameState]}
        </div>
      </div>
    </div>
  );
};
