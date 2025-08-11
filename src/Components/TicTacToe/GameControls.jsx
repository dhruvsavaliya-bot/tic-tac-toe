import React from 'react';
import { motion } from 'framer-motion';
import './TicTacToe.css';

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
  },
};

const GameControls = ({
  onResetMatch,
  onToggleTheme,
  onUndoMove,
  onRedoMove,
  isDarkTheme,
  canUndo,
  canRedo,
  isLocked
}) => {
  return (
    <div className="controls">
      <motion.button
        className="reset"
        onClick={onResetMatch}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        Reset Match
      </motion.button>
      <button className="theme-toggle" onClick={onToggleTheme}>
        {isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <button onClick={onUndoMove} disabled={!canUndo || isLocked}>
        Undo
      </button>
      <button onClick={onRedoMove} disabled={!canRedo || isLocked}>
        Redo
      </button>
    </div>
  );
};

export default GameControls;