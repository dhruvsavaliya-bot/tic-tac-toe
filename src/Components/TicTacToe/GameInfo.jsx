import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TicTacToe.css';

const announcementVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring' } },
  exit: { opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.3 } },
};

const GameInfo = ({ round, bestOf, matchWinner, winner, playerXName, playerOName }) => {
  return (
    <>
      <div className="round-info">
        {!matchWinner && (
          <p>
            Round {round} / {bestOf}
          </p>
        )}
        <AnimatePresence>
          {matchWinner && (
            <motion.p
              className="match-winner"
              variants={announcementVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="matchWinner"
            >
              Match Winner: {matchWinner === "x" ? playerXName : playerOName} 🎉
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {winner && !matchWinner && (
          <motion.p
            className="result"
            variants={announcementVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="roundWinner"
          >
            {winner === "draw"
              ? "Round Draw!"
              : `${winner === "x" ? playerXName : playerOName} Wins This Round!`}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameInfo;