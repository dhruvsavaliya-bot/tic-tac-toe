import React from 'react';
import './TicTacToe.css';

const HistorySidebar = ({
  isOpen,
  toggleSidebar,
  gameHistory,
  searchGame,
  onSearchChange,
  loadGame,
  deleteGame,
  deleteAllHistory,
  playerXName,
  playerOName,
  isDarkTheme,
  filteredHistory
}) => {
  return (
    <aside
      className={`history-sidebar ${isOpen ? "open" : ""} ${
        isDarkTheme ? "dark" : "light"
      }`}
    >
      <h2>Game History</h2>
      <input
        type="text"
        className="search-game-input"
        placeholder="Search Game Number"
        value={searchGame}
        onChange={onSearchChange}
      />
      {gameHistory.length > 0 && (
        <button className="delete-all-btn" onClick={deleteAllHistory}>
          Delete All History
        </button>
      )}
      <ul>
        {filteredHistory.length === 0 && <li>No games found.</li>}
        {filteredHistory.map((game, index) => {
          // Ensure originalIndex is derived correctly if filteredHistory is a subset
          const originalIndex = gameHistory.findIndex(gh => gh === game);
          return (
            <li key={originalIndex}>
              <button
                className="history-game-btn"
                onClick={() => loadGame(originalIndex)}
              >
                Game {originalIndex + 1}:{" "}
                {game.winner
                  ? game.winner === "draw"
                    ? "Draw"
                    : game.winner === "x"
                    ? playerXName + " Wins"
                    : playerOName + " Wins"
                  : "In Progress"}
              </button>
              <button
                className="delete-history-btn"
                onClick={() => deleteGame(originalIndex)}
                aria-label={`Delete game ${originalIndex + 1}`}
              >
                X
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default HistorySidebar;