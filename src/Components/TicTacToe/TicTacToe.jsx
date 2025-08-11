import React, { useRef, useState, useEffect } from "react";
import "./TicTacToe.css";
// Child components
import Board from "./Board";
import PlayerInput from "./PlayerInput";
import ModeSelect from "./ModeSelect";
import BestOfSelect from "./BestOfSelect";
import Scoreboard from "./Scoreboard";
import GameInfo from "./GameInfo";
import GameControls from "./GameControls";
import HistorySidebar from "./HistorySidebar";
import DifficultySelect from "./DifficultySelect";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);
  const [lock, setLock] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [scores, setScores] = useState({ x: 0, o: 0 });

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  const [history, setHistory] = useState([]); // For undo/redo of current game moves
  const [future, setFuture] = useState([]); // For redo
  const [playerX, setPlayerX] = useState("Player X");
  const [playerO, setPlayerO] = useState("Player O");
  const [winner, setWinner] = useState(null); // 'x', 'o', or 'draw' for current round
  const [gameHistory, setGameHistory] = useState([]); // For storing completed games
  const [searchGame, setSearchGame] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [bestOf, setBestOf] = useState(3);
  const [round, setRound] = useState(1);
  const [matchWinner, setMatchWinner] = useState(null); // 'x' or 'o' for overall match

  const [isSinglePlayer, setIsSinglePlayer] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState("hard"); // easy, medium, hard

  const titleRef = useRef(null); // Still used for the main title
  const [animateIndex, setAnimateIndex] = useState(null); // For square animation

  // Helper to check win condition without setting state
  const checkWinConditionPure = (currentBoard, player) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        currentBoard[a] === player &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return true;
      }
    }
    return false;
  };

  const makeAIMove = () => {
    if (lock || winner || isXTurn || !isSinglePlayer) return;

    const aiPlayer = 'o';
    const humanPlayer = 'x';
    const currentBoardState = [...board]; // Use a copy for simulation

    const availableIndices = currentBoardState
      .map((val, idx) => (val === "" ? idx : null))
      .filter((i) => i !== null);

    if (availableIndices.length === 0) return;

    let bestMove = null;

    if (aiDifficulty === "easy") {
      // Easy: Purely random move
      if (availableIndices.length > 0) {
        bestMove = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }
    } else if (aiDifficulty === "medium") {
      // Medium: Win if possible, then block, then random
      // 1. Check if AI can win
      for (const index of availableIndices) {
        const tempBoard = [...currentBoardState];
        tempBoard[index] = aiPlayer;
        if (checkWinConditionPure(tempBoard, aiPlayer)) {
          bestMove = index;
          break;
        }
      }
      // 2. If AI cannot win, check if player can win (and block)
      if (bestMove === null) {
        for (const index of availableIndices) {
          const tempBoard = [...currentBoardState];
          tempBoard[index] = humanPlayer;
          if (checkWinConditionPure(tempBoard, humanPlayer)) {
            bestMove = index;
            break;
          }
        }
      }
      // 3. Fallback to random
      if (bestMove === null && availableIndices.length > 0) {
        bestMove = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }
    } else { // Hard difficulty (and default)
      // 1. Check if AI can win
      for (const index of availableIndices) {
        const tempBoard = [...currentBoardState];
        tempBoard[index] = aiPlayer;
        if (checkWinConditionPure(tempBoard, aiPlayer)) {
          bestMove = index;
          break;
        }
      }

      // 2. If AI cannot win, check if player can win (and block)
      if (bestMove === null) {
        for (const index of availableIndices) {
          const tempBoard = [...currentBoardState];
          tempBoard[index] = humanPlayer;
          if (checkWinConditionPure(tempBoard, humanPlayer)) {
            bestMove = index;
            break;
          }
        }
      }
      
      // 3. Strategic moves: Center
      if (bestMove === null) {
        if (availableIndices.includes(4) && currentBoardState[4] === "") {
          bestMove = 4;
        }
      }

      // 4. Strategic moves: Corners
      if (bestMove === null) {
        const corners = [0, 2, 6, 8];
        const availableStrategicCorners = corners.filter(corner => availableIndices.includes(corner) && currentBoardState[corner] === "");
        if (availableStrategicCorners.length > 0) {
          bestMove = availableStrategicCorners[Math.floor(Math.random() * availableStrategicCorners.length)];
        }
      }
      
      // 5. Strategic moves: Sides
      if (bestMove === null) {
        const sides = [1, 3, 5, 7];
        const availableStrategicSides = sides.filter(side => availableIndices.includes(side) && currentBoardState[side] === "");
        if (availableStrategicSides.length > 0) {
            bestMove = availableStrategicSides[Math.floor(Math.random() * availableStrategicSides.length)];
        }
      }

      // 6. Fallback to any available random move if no strategic move found yet
      if (bestMove === null && availableIndices.length > 0) {
        bestMove = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      }
    }

    if (bestMove !== null) {
      setTimeout(() => {
        handleClick(bestMove, true);
      }, 500);
    }
  };

  useEffect(() => {
    if (isSinglePlayer && !isXTurn && !winner && !lock) {
      makeAIMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, isXTurn, winner, lock, isSinglePlayer]); // Added lock and isSinglePlayer

  const checkWin = (currentBoard) => {
    // winPatterns is now defined at the component scope
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        const winnerPlayer = currentBoard[a];
        setWinner(winnerPlayer);
        setLock(true);
        const newScores = {
          ...scores,
          [winnerPlayer]: scores[winnerPlayer] + 1,
        };
        setScores(newScores);

        const requiredWins = Math.ceil(bestOf / 2);
        if (newScores[winnerPlayer] >= requiredWins) {
          setMatchWinner(winnerPlayer);
          // Game ends, don't auto-reset for next round
        } else {
          setTimeout(() => {
            resetBoardForNextRound(newScores); // Pass the updated scores for this round
          }, 1500);
        }
        return true; // Winner found
      }
    }

    if (!currentBoard.includes("")) {
      setWinner("draw");
      setLock(true);
      setTimeout(() => {
        resetBoardForNextRound(scores); // Pass current scores for a draw
      }, 1500);
      return true; // Draw
    }
    return false; // No winner yet
  };

  const handleClick = (index, isAIMove = false) => {
    if (lock || board[index] !== "" || winner) return;
    if (!isAIMove && isSinglePlayer && !isXTurn) return; // Prevent player move when AI's turn

    const newBoard = [...board];
    newBoard[index] = isXTurn ? "x" : "o";
    
    setHistory([...history, board]); // Save current board state before the move
    setBoard(newBoard);
    setFuture([]); // Clear future states on new move
    setAnimateIndex(index);

    if (!checkWin(newBoard)) {
      setIsXTurn(!isXTurn);
    }
  };
  
  const handleAnimationEnd = () => {
    setAnimateIndex(null);
  };

  const resetBoardForNextRound = (concludedRoundScores) => {
    setGameHistory(prevGameHistory => [...prevGameHistory, { board, winner, scores: concludedRoundScores, round, bestOf, playerX, playerO }]);
    setBoard(Array(9).fill(""));
    setIsXTurn(true); // X always starts the new round
    setLock(false);
    setWinner(null);
    setHistory([]);
    setFuture([]);
    setRound((prev) => prev + 1);
    // Don't reset matchWinner here, it's reset by resetGame
  };

  const resetGame = () => { // Resets the entire match
    if (board.some(cell => cell !== "") || winner) { // Save current game if it has started
        setGameHistory(prevGameHistory => [...prevGameHistory, { board, winner, scores, round, bestOf, playerX, playerO }]);
    }
    setBoard(Array(9).fill(""));
    setIsXTurn(true);
    setLock(false);
    setWinner(null);
    setHistory([]);
    setFuture([]);
    setScores({ x: 0, o: 0 });
    setRound(1);
    setMatchWinner(null);
    // Player names are not reset here, they persist
  };

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const undoMove = () => {
    if (history.length === 0 || lock || (isSinglePlayer && !isXTurn)) return; // Prevent undo during AI thinking or if AI just moved
    
    const lastBoardState = history[history.length - 1];
    setFuture([board, ...future]); // Current board becomes a future state
    setBoard(lastBoardState);
    setHistory(history.slice(0, -1));
    setIsXTurn(!isXTurn); // Toggle turn back
    setWinner(null); // Clear winner status
    setLock(false); // Unlock board
    
    // If it was AI's turn (meaning player just undid AI's move), AI might need to re-evaluate
    // For simplicity, we don't trigger AI move here. Player can make their move.
  };

  const redoMove = () => {
    if (future.length === 0 || lock || (isSinglePlayer && isXTurn)) return; // Prevent redo if player's turn in single player
    
    const nextBoardState = future[0];
    setHistory([...history, board]); // Current board becomes a past state
    setBoard(nextBoardState);
    setFuture(future.slice(1));
    setIsXTurn(!isXTurn); // Toggle turn
    setWinner(null);
    setLock(false);
    // Check win after redo
    checkWin(nextBoardState);
  };
  
  const handlePlayerXChange = (e) => setPlayerX(e.target.value);
  const handlePlayerOChange = (e) => {
    if (!isSinglePlayer) {
      setPlayerO(e.target.value);
    }
  };

  const handleModeChange = (isSingle) => {
    setIsSinglePlayer(isSingle);
    setPlayerO(isSingle ? "Computer" : "Player O"); // Reset Player O name
    resetGame(); // Reset game state when mode changes
  };
  
  const handleBestOfChange = (value) => {
    setBestOf(value);
    resetGame();
  };

  const handleDifficultyChange = (newDifficulty) => {
    setAiDifficulty(newDifficulty);
    resetGame(); // Reset game when difficulty changes
  };

  const loadGame = (index) => {
    const gameToLoad = gameHistory[index];
    if (gameToLoad) {
      setBoard(gameToLoad.board);
      setWinner(gameToLoad.winner);
      // Determine whose turn it was based on 'x' and 'o' counts
      const xCount = gameToLoad.board.filter(cell => cell === 'x').length;
      const oCount = gameToLoad.board.filter(cell => cell === 'o').length;
      setIsXTurn(xCount <= oCount);
      setLock(!!gameToLoad.winner); // Lock if there was a winner
      setScores(gameToLoad.scores || {x:0, o:0}); // Restore scores
      setRound(gameToLoad.round || 1);
      setBestOf(gameToLoad.bestOf || 3);
      setPlayerX(gameToLoad.playerX || "Player X");
      setPlayerO(gameToLoad.playerO || "Player O");
      setMatchWinner(null); // Reset match winner when loading an old game
      setHistory([]); // Clear current game's undo/redo history
      setFuture([]);
      setIsHistoryOpen(false); // Close sidebar
    }
  };

  const deleteGame = (index) => {
    setGameHistory(gameHistory.filter((_, i) => i !== index));
  };

  const deleteAllHistory = () => {
    setGameHistory([]);
  };

  const filteredGameHistory = gameHistory.filter((_, index) => {
    if (searchGame === "") return true;
    return (index + 1).toString().includes(searchGame);
  });
  
  const handleSearchChange = (e) => setSearchGame(e.target.value.replace(/\D/, ""));

  const toggleSidebar = () => setIsHistoryOpen(!isHistoryOpen);

  const winnerCells = (() => {
    if (!winner || winner === "draw") return [];
    // winPatterns is now defined at the component scope
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] === winner) {
        return pattern;
      }
    }
    return [];
  })();


  return (
    <div className={`container ${isDarkTheme ? "dark" : "light"}`}>
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-expanded={isHistoryOpen}
      >
        {isHistoryOpen ? (
          <span role="img" aria-label="hide">❌</span>
        ) : (
          <span role="img" aria-label="show">👁️</span>
        )}
      </button>

      <h1 className="title" ref={titleRef}>
        Tic Tac Toe Game In <span>React</span>
      </h1>

      <PlayerInput
        playerX={playerX}
        playerO={playerO}
        onPlayerXChange={handlePlayerXChange}
        onPlayerOChange={handlePlayerOChange}
        isSinglePlayer={isSinglePlayer}
      />

      <ModeSelect
        isSinglePlayer={isSinglePlayer}
        onModeChange={handleModeChange}
        resetGame={resetGame}
      />

      {isSinglePlayer && (
        <DifficultySelect
          currentDifficulty={aiDifficulty}
          onDifficultyChange={handleDifficultyChange}
          resetGame={resetGame}
        />
      )}

      <BestOfSelect
        bestOf={bestOf}
        onBestOfChange={handleBestOfChange}
        isMatchActive={matchWinner !== null}
        resetGame={resetGame} // Pass resetGame to BestOfSelect
      />

      <Scoreboard scores={scores} playerXName={playerX} playerOName={playerO} />

      <GameInfo
        round={round}
        bestOf={bestOf}
        matchWinner={matchWinner}
        winner={winner}
        playerXName={playerX}
        playerOName={playerO}
      />
      
      <Board
        squares={board}
        onClick={handleClick}
        winnerCells={winnerCells}
        animateIndex={animateIndex}
        onAnimationEnd={handleAnimationEnd}
      />

      <GameControls
        onResetMatch={resetGame}
        onToggleTheme={toggleTheme}
        onUndoMove={undoMove}
        onRedoMove={redoMove}
        isDarkTheme={isDarkTheme}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        isLocked={lock}
      />

      <HistorySidebar
        isOpen={isHistoryOpen}
        toggleSidebar={toggleSidebar}
        gameHistory={gameHistory} // Pass the full gameHistory
        searchGame={searchGame}
        onSearchChange={handleSearchChange}
        loadGame={loadGame}
        deleteGame={deleteGame}
        deleteAllHistory={deleteAllHistory}
        playerXName={playerX}
        playerOName={playerO}
        isDarkTheme={isDarkTheme}
        filteredHistory={filteredGameHistory} // Pass the filtered history
      />
    </div>
  );
};

export default TicTacToe;
