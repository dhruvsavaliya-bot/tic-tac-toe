import React from 'react';
import './TicTacToe.css'; // Assuming styles are general enough

const DifficultySelect = ({ currentDifficulty, onDifficultyChange, resetGame }) => {
  const handleDifficultyChange = (e) => {
    onDifficultyChange(e.target.value);
    resetGame(); // Reset game when difficulty changes
  };

  return (
    <div className="difficulty-select">
      <label htmlFor="ai-difficulty">AI Difficulty: </label>
      <select
        id="ai-difficulty"
        value={currentDifficulty}
        onChange={handleDifficultyChange}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
};

export default DifficultySelect;