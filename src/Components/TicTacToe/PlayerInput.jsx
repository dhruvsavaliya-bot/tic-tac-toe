import React from 'react';
import './TicTacToe.css'; // Assuming styles are general enough

const PlayerInput = ({ playerX, playerO, onPlayerXChange, onPlayerOChange, isSinglePlayer }) => {
  return (
    <div className="player-inputs">
      <input
        value={playerX}
        onChange={onPlayerXChange}
        placeholder="Player X Name"
      />
      <input
        value={playerO}
        onChange={onPlayerOChange}
        placeholder={isSinglePlayer ? "Computer" : "Player O Name"}
        disabled={isSinglePlayer} // Computer name shouldn't be editable by user
      />
    </div>
  );
};

export default PlayerInput;