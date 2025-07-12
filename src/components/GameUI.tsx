
import { GameState } from '@/hooks/useGameEngine';

interface GameUIProps {
  score: number;
  highScore: number;
  gameState: GameState;
}

export const GameUI = ({ score, highScore, gameState }: GameUIProps) => {
  return (
    <div className="flex justify-between items-center mb-4 text-white">
      <div className="flex gap-8">
        <div className="text-center">
          <div className="text-sm opacity-70 uppercase tracking-wide">Score</div>
          <div className="text-2xl font-bold text-yellow-400">
            {score.toString().padStart(5, '0')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-70 uppercase tracking-wide">High Score</div>
          <div className="text-2xl font-bold text-green-400">
            {highScore.toString().padStart(5, '0')}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-sm opacity-70 uppercase tracking-wide">Status</div>
        <div className={`text-lg font-semibold ${
          gameState === 'playing' ? 'text-green-400' : 
          gameState === 'gameOver' ? 'text-red-400' : 
          'text-blue-400'
        }`}>
          {gameState === 'playing' ? 'RUNNING' : 
           gameState === 'gameOver' ? 'CRASHED' : 
           'READY'}
        </div>
      </div>
    </div>
  );
};
