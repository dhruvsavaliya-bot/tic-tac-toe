import React from 'react';
import './TicTacToe.css';

const ModeSelect = ({ isSinglePlayer, onModeChange, resetGame }) => {
  const handleModeChange = (isSingle) => {
    onModeChange(isSingle);
    resetGame(); // Reset game when mode changes
  };

  return (
    <div className="mode-select">
      <label>
        <input
          type="radio"
          checked={!isSinglePlayer}
          onChange={() => handleModeChange(false)}
        />
        Two Player
      </label>
      <label>
        <input
          type="radio"
          checked={isSinglePlayer}
          onChange={() => handleModeChange(true)}
        />
        Single Player (vs AI)
      </label>
    </div>
  );
};

export default ModeSelect;