import type { PieceType, Player } from "@/lib/shogi"
import "@/styles/Piece.scss"

interface PieceProps {
  type: PieceType
  player: Player
  promoted: boolean
}

export default function Piece({ type, player, promoted }: PieceProps) {
  const pieceClasses = ["piece", `piece--${type}`, `piece--${player}`, promoted ? "piece--promoted" : ""]
    .filter(Boolean)
    .join(" ")

  return <div className={pieceClasses}>{getPieceCharacter(type, promoted)}</div>
}

// 駒の文字を返す関数
function getPieceCharacter(type: PieceType, promoted: boolean): string {
  if (promoted) {
    switch (type) {
      case "pawn":
      case "promotedPawn":
        return "と"
      case "lance":
      case "promotedLance":
        return "成香"
      case "knight":
      case "promotedKnight":
        return "成桂"
      case "silver":
      case "promotedSilver":
        return "成銀"
      case "rook":
      case "promotedRook":
        return "龍"
      case "bishop":
      case "promotedBishop":
        return "馬"
      default:
        return ""
    }
  }

  switch (type) {
    case "pawn":
      return "歩"
    case "lance":
      return "香"
    case "knight":
      return "桂"
    case "silver":
      return "銀"
    case "gold":
      return "金"
    case "king":
      return "王"
    case "rook":
      return "飛"
    case "bishop":
      return "角"
    default:
      return ""
  }
}
