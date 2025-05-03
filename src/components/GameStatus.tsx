"use client"

import type { Player } from "@/lib/shogi"
import { Button } from "@/components/ui/button"
import "@/styles/GameStatus.scss"

interface GameStatusProps {
  currentPlayer: Player
  gameStatus: "playing" | "checkmate" | "draw"
  winner: Player | null
  onReset: () => void
}

export default function GameStatus({ currentPlayer, gameStatus, winner, onReset }: GameStatusProps) {
  return (
    <div className="game-status">
      {gameStatus === "playing" ? (
        <div className="game-status__current">
          <span className="game-status__label">手番: </span>
          <span className="game-status__value">{currentPlayer === "sente" ? "先手" : "後手"}</span>
        </div>
      ) : gameStatus === "checkmate" ? (
        <div className="game-status__result">
          <span className="game-status__label">勝者: </span>
          <span className="game-status__value">{winner === "sente" ? "先手" : "後手"}</span>
        </div>
      ) : (
        <div className="game-status__result">
          <span className="game-status__value">引き分け</span>
        </div>
      )}

      <Button onClick={onReset} className="game-status__reset">
        ゲームをリセット
      </Button>
    </div>
  )
}
