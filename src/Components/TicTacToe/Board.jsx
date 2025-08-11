import React from 'react';
import { motion } from 'framer-motion';
import Square from './Square';
import './TicTacToe.css';

const boardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
      duration: 0.5
    }
  },
};

const Board = ({ squares, onClick, winnerCells, animateIndex, onAnimationEnd }) => {
  const renderSquare = (i) => {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinningSquare={winnerCells && winnerCells.includes(i)}
        isAnimated={animateIndex === i}
      />
    );
  };

  return (
    <motion.div
      className="board"
      variants={boardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="row1">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="row2">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="row3">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </motion.div>
  );
};

export default Board;