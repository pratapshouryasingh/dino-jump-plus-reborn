import { GameState } from '@/hooks/useGameEngine';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Zap, Pause } from 'lucide-react';

interface MobileControlsProps {
  gameState: GameState;
  onJump: () => void;
  onStart: () => void;
  onReset: () => void;
  onPause?: () => void;
}

export const MobileControls = ({ gameState, onJump, onStart, onReset, onPause }: MobileControlsProps) => {
  const handleJumpTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    onJump();
  };

  if (gameState === 'waiting') {
    return (
      <div className="flex justify-center">
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
        >
          <Play className="mr-2 h-5 w-5" />
          Start Game
        </Button>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="flex justify-center gap-4">
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
        >
          <Play className="mr-2 h-5 w-5" />
          Play Again
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="border-white/20 text-white hover:bg-white/10 px-6 py-4 text-lg font-semibold rounded-xl"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      <Button
        onTouchStart={handleJumpTouchStart}
        onClick={onJump}
        size="lg"
        className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-lg active:scale-95"
      >
        <Zap className="mr-2 h-6 w-6" />
        JUMP
      </Button>
      {onPause && (
        <Button
          onClick={onPause}
          variant="ghost"
          className="text-white px-4 py-2"
        >
          <Pause className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};
