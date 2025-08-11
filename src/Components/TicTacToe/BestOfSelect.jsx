import React from 'react';
import './TicTacToe.css';

const BestOfSelect = ({ bestOf, onBestOfChange, isMatchActive, resetGame }) => {
  const handleBestOfChange = (e) => {
    onBestOfChange(Number(e.target.value));
    resetGame(); // Reset game when bestOf changes
  };

  return (
    <div className="best-of-select">
      <label>
        Best of:
        <select
          value={bestOf}
          onChange={handleBestOfChange}
          disabled={isMatchActive}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </label>
    </div>
  );
};

export default BestOfSelect;