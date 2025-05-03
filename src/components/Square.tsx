"use client"

import Piece from "./Piece"
import type { PieceType, Player, Position } from "@/lib/shogi"
import "@/styles/Square.scss"

interface SquareProps {
  piece: null | { type: PieceType; player: Player; promoted: boolean }
  position: Position
  isSelected: boolean
  isDropTarget: boolean
  onClick: () => void
}

export default function Square({ piece, position, isSelected, isDropTarget, onClick }: SquareProps) {
  const squareClasses = ["square", isSelected ? "square--selected" : "", isDropTarget ? "square--drop-target" : ""]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={squareClasses} onClick={onClick}>
      {piece && <Piece type={piece.type} player={piece.player} promoted={piece.promoted} />}
    </div>
  )
}
