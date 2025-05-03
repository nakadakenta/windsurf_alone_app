"use client"

import Square from "./Square.tsx";
import type { PieceType, Player, Position } from "./../lib/shogi";
import "./../styles/Board.scss"

interface BoardProps {
  board: (null | { type: PieceType; player: Player; promoted: boolean })[][]
  selectedPiece: Position | null
  currentPlayer: Player
  onSquareClick: (row: number, col: number) => void
  dropMode: boolean
}

export default function Board({ board, selectedPiece, currentPlayer, onSquareClick, dropMode }: BoardProps) {
  return (
    <div className="board">
      <div className="board__column-labels">
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="board__label">
              {9 - i}
            </div>
          ))}
      </div>

      <div className="board__grid">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board__row">
            {row.map((square, colIndex) => {
              const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex
              const isValidDropTarget = dropMode && !square

              return (
                <Square
                  key={colIndex}
                  piece={square}
                  position={{ row: rowIndex, col: colIndex }}
                  isSelected={isSelected}
                  isDropTarget={isValidDropTarget}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                />
              )
            })}
          </div>
        ))}

        <div className="board__row-labels">
          {["一", "二", "三", "四", "五", "六", "七", "八", "九"].map((label, i) => (
            <div key={i} className="board__label">
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
