import React from 'react';
import { motion } from 'framer-motion';
import circle_icon from "../Assets/circle.png";
import cross_icon from "../Assets/cross.png";
import './TicTacToe.css'; // Assuming styles are general enough or will be adjusted

const markVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
};

const Square = ({ value, onClick, isWinningSquare }) => {
  return (
    <div
      className={`boxes ${isWinningSquare ? "win" : ""}`}
      onClick={onClick}
    >
      {value === "x" && (
        <motion.img
          src={cross_icon}
          alt="X"
          variants={markVariants}
          initial="hidden"
          animate="visible"
          key={`cross-${Date.now()}`} // Add key to re-trigger animation on change
        />
      )}
      {value === "o" && (
        <motion.img
          src={circle_icon}
          alt="O"
          variants={markVariants}
          initial="hidden"
          animate="visible"
          key={`circle-${Date.now()}`} // Add key to re-trigger animation on change
        />
      )}
    </div>
  );
};

export default Square;