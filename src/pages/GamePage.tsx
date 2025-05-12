
import React from 'react';
import GameBoard from '@/components/GameBoard';

const GamePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-primary/40">
      <GameBoard />
    </div>
  );
};

export default GamePage;
