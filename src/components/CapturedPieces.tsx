"use client"

import Piece from "./Piece"
import type { PieceType, Player } from "@/lib/shogi"
import "@/styles/CapturedPieces.scss"

interface CapturedPiecesProps {
  pieces: PieceType[]
  player: Player
  onPieceClick: (piece: PieceType, player: Player) => void
}

export default function CapturedPieces({ pieces, player, onPieceClick }: CapturedPiecesProps) {
  // 駒の種類ごとに数を集計
  const pieceCounts: Record<PieceType, number> = {} as Record<PieceType, number>

  pieces.forEach((piece) => {
    pieceCounts[piece] = (pieceCounts[piece] || 0) + 1
  })

  return (
    <div className={`captured-pieces captured-pieces--${player}`}>
      <div className="captured-pieces__title">{player === "sente" ? "先手の持ち駒" : "後手の持ち駒"}</div>
      <div className="captured-pieces__container">
        {Object.entries(pieceCounts).map(([pieceType, count]) => (
          <div
            key={pieceType}
            className="captured-pieces__item"
            onClick={() => onPieceClick(pieceType as PieceType, player)}
          >
            <Piece type={pieceType as PieceType} player={player} promoted={false} />
            {count > 1 && <span className="captured-pieces__count">{count}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

