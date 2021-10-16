import React, { useState } from "react";

import Board from "./components/Board";

type XO = "X" | "O";

type HistoryT = {
  squares: XO[];
  playedRow: number;
  playedCol: number;
};

const calculateWinner = (squares: XO[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const Game: React.FC = () => {
  const [history, setHistory] = useState<HistoryT[]>([
    {
      squares: Array(9).fill(null),
      playedRow: -1,
      playedCol: -1,
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [ascendingSort, setAscendingSort] = useState(true);

  const handleClick = (i: number) => {
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(
      currentHistory.concat([
        {
          squares: squares,
          playedRow: Math.floor(i / 3) + 1,
          playedCol: Math.floor(i % 3) + 1,
        },
      ])
    );
    setStepNumber(currentHistory.length);
    setXIsNext((prev: boolean) => !prev);
  };

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const toggleSortHandler = () => {
    setAscendingSort((prevState) => !prevState);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((step: HistoryT, move: number) => {
    const desc = move
      ? `Go to move #${move}, played row #${step.playedRow}, column#${step.playedCol}`
      : "Go to game start";
    return (
      <li key={move}>
        <button
          className={move === stepNumber ? "bold-button" : ""}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });

  if (!ascendingSort) {
    moves.reverse();
  }

  let status: string;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i: number) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div className={winner ? "winner" : "player-status"}>{status}</div>
        <button className="ASC-sort-btn" onClick={toggleSortHandler}>
          Ascending Sort
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;