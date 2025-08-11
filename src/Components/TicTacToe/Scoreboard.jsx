import React from 'react';
import './TicTacToe.css';

const Scoreboard = ({ scores, playerXName, playerOName }) => {
  return (
    <div className="scoreboard">
      <p>
        {playerXName} (X): {scores.x}
      </p>
      <p>
        {playerOName} (O): {scores.o}
      </p>
    </div>
  );
};

export default Scoreboard;