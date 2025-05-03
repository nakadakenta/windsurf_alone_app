export type PieceType =
  | "pawn"
  | "lance"
  | "knight"
  | "silver"
  | "gold"
  | "king"
  | "rook"
  | "bishop"
  | "promotedPawn"
  | "promotedLance"
  | "promotedKnight"
  | "promotedSilver"
  | "promotedRook"
  | "promotedBishop"

export type Player = "sente" | "gote"

export interface Position {
  row: number
  col: number
}

// 初期盤面を生成する関数
export function initialBoard(): (null | { type: PieceType; player: Player; promoted: boolean })[][] {
  // 9x9の盤面を作成
  const board = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null))

  // 先手の駒を配置
  board[8][0] = { type: "lance", player: "sente", promoted: false }
  board[8][1] = { type: "knight", player: "sente", promoted: false }
  board[8][2] = { type: "silver", player: "sente", promoted: false }
  board[8][3] = { type: "gold", player: "sente", promoted: false }
  board[8][4] = { type: "king", player: "sente", promoted: false }
  board[8][5] = { type: "gold", player: "sente", promoted: false }
  board[8][6] = { type: "silver", player: "sente", promoted: false }
  board[8][7] = { type: "knight", player: "sente", promoted: false }
  board[8][8] = { type: "lance", player: "sente", promoted: false }

  board[7][1] = { type: "rook", player: "sente", promoted: false }
  board[7][7] = { type: "bishop", player: "sente", promoted: false }

  // 先手の歩を配置
  for (let i = 0; i < 9; i++) {
    board[6][i] = { type: "pawn", player: "sente", promoted: false }
  }

  // 後手の駒を配置
  board[0][0] = { type: "lance", player: "gote", promoted: false }
  board[0][1] = { type: "knight", player: "gote", promoted: false }
  board[0][2] = { type: "silver", player: "gote", promoted: false }
  board[0][3] = { type: "gold", player: "gote", promoted: false }
  board[0][4] = { type: "king", player: "gote", promoted: false }
  board[0][5] = { type: "gold", player: "gote", promoted: false }
  board[0][6] = { type: "silver", player: "gote", promoted: false }
  board[0][7] = { type: "knight", player: "gote", promoted: false }
  board[0][8] = { type: "lance", player: "gote", promoted: false }

  board[1][1] = { type: "bishop", player: "gote", promoted: false }
  board[1][7] = { type: "rook", player: "gote", promoted: false }

  // 後手の歩を配置
  for (let i = 0; i < 9; i++) {
    board[2][i] = { type: "pawn", player: "gote", promoted: false }
  }

  return board
}
