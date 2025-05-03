"use client"

import { useState, useEffect } from "react"
import Board from "./Board"
import CapturedPieces from "./CapturedPieces"
import GameStatus from "./GameStatus"
import { initialBoard, type PieceType, type Position, type Player } from "./../lib/shogi"
import "./../styles/ShogiGame.scss"

export default function ShogiGame() {
  const [board, setBoard] = useState(initialBoard())
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player>("sente")
  const [capturedPieces, setCapturedPieces] = useState<{
    sente: PieceType[]
    gote: PieceType[]
  }>({
    sente: [],
    gote: [],
  })
  const [gameStatus, setGameStatus] = useState<"playing" | "checkmate" | "draw">("playing")
  const [dropMode, setDropMode] = useState<{
    active: boolean
    piece: PieceType | null
    player: Player | null
  }>({
    active: false,
    piece: null,
    player: null,
  })

  // ゲームの勝敗判定
  useEffect(() => {
    // 王が盤上にいるか確認
    const senteKingExists = board.some((row) =>
      row.some((square) => square && square.type === "king" && square.player === "sente"),
    )

    const goteKingExists = board.some((row) =>
      row.some((square) => square && square.type === "king" && square.player === "gote"),
    )

    if (!senteKingExists) {
      setGameStatus("checkmate")
    } else if (!goteKingExists) {
      setGameStatus("checkmate")
    }
  }, [board])

  // 駒を選択する
  const handleSquareClick = (row: number, col: number) => {
    // ゲーム終了時は何もしない
    if (gameStatus !== "playing") return

    // 駒を打つモードの場合
    if (dropMode.active && dropMode.piece && dropMode.player) {
      // 空のマスのみ駒を打てる
      if (!board[row][col]) {
        const newBoard = [...board]
        newBoard[row][col] = { type: dropMode.piece, player: dropMode.player, promoted: false }

        // 持ち駒から削除
        const newCapturedPieces = { ...capturedPieces }
        const index = newCapturedPieces[dropMode.player].findIndex((p) => p === dropMode.piece)
        if (index !== -1) {
          newCapturedPieces[dropMode.player].splice(index, 1)
        }

        setBoard(newBoard)
        setCapturedPieces(newCapturedPieces)
        setDropMode({ active: false, piece: null, player: null })
        setCurrentPlayer(currentPlayer === "sente" ? "gote" : "sente")
        return
      }
      // 駒を打てない場合はドロップモードをキャンセル
      setDropMode({ active: false, piece: null, player: null })
      return
    }

    // 駒が選択されていない場合
    if (selectedPiece === null) {
      // 空のマスを選択した場合は何もしない
      if (!board[row][col]) return

      // 相手の駒を選択した場合は何もしない
      if (board[row][col]?.player !== currentPlayer) return

      // 自分の駒を選択
      setSelectedPiece({ row, col })
    }
    // 駒が既に選択されている場合
    else {
      const fromRow = selectedPiece.row
      const fromCol = selectedPiece.col

      // 同じマスを選択した場合は選択解除
      if (fromRow === row && fromCol === col) {
        setSelectedPiece(null)
        return
      }

      // 自分の駒を選択した場合は選択し直し
      if (board[row][col]?.player === currentPlayer) {
        setSelectedPiece({ row, col })
        return
      }

      // 駒の移動が有効かチェック（簡易版）
      const piece = board[fromRow][fromCol]
      if (piece && isValidMove(fromRow, fromCol, row, col, piece, board)) {
        const newBoard = [...board]

        // 相手の駒を取る場合
        if (newBoard[row][col] && newBoard[row][col]?.player !== currentPlayer) {
          const capturedPiece = newBoard[row][col]
          if (capturedPiece) {
            // 成っている駒は元に戻す
            const basicType = capturedPiece.promoted ? getUnpromotedType(capturedPiece.type) : capturedPiece.type

            // 持ち駒に追加
            const newCapturedPieces = { ...capturedPieces }
            newCapturedPieces[currentPlayer].push(basicType)
            setCapturedPieces(newCapturedPieces)
          }
        }

        // 駒を移動
        newBoard[row][col] = newBoard[fromRow][fromCol]
        newBoard[fromRow][fromCol] = null

        // 成りの処理（簡易版）
        const canPromote = canPromotePiece(fromRow, fromCol, row, col, piece, currentPlayer)
        if (canPromote && window.confirm("駒を成りますか？")) {
          if (newBoard[row][col]) {
            newBoard[row][col] = {
              ...newBoard[row][col],
              promoted: true,
              type: getPromotedType(newBoard[row][col]?.type || "pawn"),
            }
          }
        }

        setBoard(newBoard)
        setSelectedPiece(null)
        setCurrentPlayer(currentPlayer === "sente" ? "gote" : "sente")
      } else {
        // 無効な移動の場合は選択解除
        setSelectedPiece(null)
      }
    }
  }

  // 持ち駒をクリックした時の処理
  const handleCapturedPieceClick = (piece: PieceType, player: Player) => {
    // 現在のプレイヤーの持ち駒のみ使用可能
    if (player !== currentPlayer || gameStatus !== "playing") return

    setDropMode({
      active: true,
      piece,
      player,
    })
  }

  // ゲームをリセットする
  const resetGame = () => {
    setBoard(initialBoard())
    setSelectedPiece(null)
    setCurrentPlayer("sente")
    setCapturedPieces({ sente: [], gote: [] })
    setGameStatus("playing")
    setDropMode({ active: false, piece: null, player: null })
  }

  return (
    <div className="shogi-game">
      <div className="shogi-game__container">
        <CapturedPieces pieces={capturedPieces.gote} player="gote" onPieceClick={handleCapturedPieceClick} />

        <Board
          board={board}
          selectedPiece={selectedPiece}
          currentPlayer={currentPlayer}
          onSquareClick={handleSquareClick}
          dropMode={dropMode.active}
        />

        <CapturedPieces pieces={capturedPieces.sente} player="sente" onPieceClick={handleCapturedPieceClick} />
      </div>

      <GameStatus
        currentPlayer={currentPlayer}
        gameStatus={gameStatus}
        winner={gameStatus === "checkmate" ? (currentPlayer === "sente" ? "gote" : "sente") : null}
        onReset={resetGame}
      />
    </div>
  )
}

// 駒の移動が有効かチェックする関数（簡易版）
function isValidMove(
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: { type: PieceType; player: Player; promoted: boolean },
  board: (null | { type: PieceType; player: Player; promoted: boolean })[][],
): boolean {
  // 基本的な移動範囲チェック（簡易版）
  // 実際の将棋では駒ごとに複雑な移動ルールがあります

  // 移動先に自分の駒がある場合は無効
  if (board[toRow][toCol]?.player === piece.player) return false

  const rowDiff = toRow - fromRow
  const colDiff = toCol - fromCol

  // 先手と後手で方向が逆
  const direction = piece.player === "sente" ? -1 : 1

  switch (piece.type) {
    case "pawn":
      // 成っていない歩の場合
      if (!piece.promoted) {
        return colDiff === 0 && rowDiff === direction
      }
      // 成り金の動き
      return (
        Math.abs(rowDiff) <= 1 &&
        Math.abs(colDiff) <= 1 &&
        !(rowDiff === direction && Math.abs(colDiff) === 1) &&
        !(rowDiff === -direction && colDiff === 0)
      )

    case "lance":
      // 香車は前方向にのみ何マスでも進める
      if (!piece.promoted) {
        return colDiff === 0 && rowDiff * direction > 0 && !hasObstacleBetween(fromRow, fromCol, toRow, toCol, board)
      }
      // 成り金の動き
      return (
        Math.abs(rowDiff) <= 1 &&
        Math.abs(colDiff) <= 1 &&
        !(rowDiff === direction && Math.abs(colDiff) === 1) &&
        !(rowDiff === -direction && colDiff === 0)
      )

    case "knight":
      // 桂馬は前方の2マス先の左右に進める
      if (!piece.promoted) {
        return rowDiff === 2 * direction && Math.abs(colDiff) === 1
      }
      // 成り金の動き
      return (
        Math.abs(rowDiff) <= 1 &&
        Math.abs(colDiff) <= 1 &&
        !(rowDiff === direction && Math.abs(colDiff) === 1) &&
        !(rowDiff === -direction && colDiff === 0)
      )

    case "silver":
      // 銀将は斜め前方と真後ろに進める
      if (!piece.promoted) {
        return (
          (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) ||
          (rowDiff === direction && colDiff === 0) ||
          (rowDiff === -direction && colDiff === 0)
        )
      }
      // 成り金の動き
      return (
        Math.abs(rowDiff) <= 1 &&
        Math.abs(colDiff) <= 1 &&
        !(rowDiff === direction && Math.abs(colDiff) === 1) &&
        !(rowDiff === -direction && colDiff === 0)
      )

    case "gold":
      // 金将は斜め後ろ以外に進める
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1 && !(rowDiff === -direction && Math.abs(colDiff) === 1)

    case "king":
      // 王将は周囲1マスに進める
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1

    case "rook":
      // 飛車は縦横に何マスでも進める
      if (!piece.promoted) {
        return (
          ((rowDiff !== 0 && colDiff === 0) || (rowDiff === 0 && colDiff !== 0)) &&
          !hasObstacleBetween(fromRow, fromCol, toRow, toCol, board)
        )
      }
      // 龍王は飛車の動き + 斜め1マス
      return (
        (((rowDiff !== 0 && colDiff === 0) || (rowDiff === 0 && colDiff !== 0)) &&
          !hasObstacleBetween(fromRow, fromCol, toRow, toCol, board)) ||
        (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1)
      )

    case "bishop":
      // 角行は斜めに何マスでも進める
      if (!piece.promoted) {
        return (
          Math.abs(rowDiff) === Math.abs(colDiff) &&
          rowDiff !== 0 &&
          !hasObstacleBetween(fromRow, fromCol, toRow, toCol, board)
        )
      }
      // 龍馬は角行の動き + 上下左右1マス
      return (
        (Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff !== 0 &&
        !hasObstacleBetween(fromRow, fromCol, toRow, toCol, board)
      ) || ((Math.abs(rowDiff) === 1 && colDiff === 0) || (rowDiff === 0 && Math.abs(colDiff) === 1)));

    // 成駒の場合
    case "promotedPawn":
    case "promotedLance":
    case "promotedKnight":
    case "promotedSilver":
      // 成り金の動き
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1 && !(rowDiff === -direction && Math.abs(colDiff) === 1)

    case "promotedRook":
      // 龍王の動き
      return (
        (((rowDiff !== 0 && colDiff === 0) || (rowDiff === 0 && colDiff !== 0)) &&
          !hasObstacleBetween(fromRow, fromCol, toRow, toCol, board)) ||
        (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1)
      )

    case "promotedBishop":
      // 龍馬の動き
      return (
        (Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff !== 0 &&
        !hasObstacleBetween(fromRow, fromCol, toRow, toCol, board)
      ) || ((Math.abs(rowDiff) === 1 && colDiff === 0) || (rowDiff === 0 && Math.abs(colDiff) === 1)));

    default:
      return false
  }
}

// 2点間に障害物があるかチェックする関数
function hasObstacleBetween(
  fromRow: number, 
  fromCol: number, 
  toRow: number, 
  toCol: number, 
  board: (null | { type: PieceType, player: Player, promoted: boolean })[][]
): boolean {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  
  // 縦方向の移動
  if (colDiff === 0) {
    const step = rowDiff > 0 ? 1 : -1;
    for (let r = fromRow + step; r !== toRow; r += step) {
      if (board[r][fromCol]) return true;
    }
  }
  // 横方向の移動
  else if (rowDiff === 0) {
    const step = colDiff > 0 ? 1 : -1;
    for (let c = fromCol + step; c !== toCol; c += step) {
      if (board[fromRow][c]) return true;
    }
  }
  // 斜め方向の移動
  else if (Math.abs(rowDiff) === Math.abs(colDiff)) {
    const rowStep = rowDiff > 0 ? 1 : -1;
    const colStep = colDiff > 0 ? 1 : -1;
    for (
      let r = fromRow + rowStep, c = fromCol + colStep;
      r !== toRow;
      r += rowStep, c += colStep
    ) {
      if (board[r][c]) return true;
    }
  }
  
  return false;
}

// 駒が成れるかチェックする関数
function canPromotePiece(
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: { type: PieceType; player: Player; promoted: boolean },
  currentPlayer: Player,
): boolean {
  // 既に成っている駒は成れない
  if (piece.promoted) return false

  // 成れない駒（金、王）
  if (piece.type === "gold" || piece.type === "king") return false

  // 敵陣または自陣の奥3段に入るか、そこから出る場合に成れる
  const promotionZoneSente = [0, 1, 2] // 先手の場合、0,1,2行目が敵陣
  const promotionZoneGote = [6, 7, 8] // 後手の場合、6,7,8行目が敵陣

  if (currentPlayer === "sente") {
    return promotionZoneSente.includes(toRow) || promotionZoneSente.includes(fromRow)
  } else {
    return promotionZoneGote.includes(toRow) || promotionZoneGote.includes(fromRow)
  }
}

// 成った時の駒の種類を返す関数
function getPromotedType(type: PieceType): PieceType {
  switch (type) {
    case "pawn":
      return "promotedPawn"
    case "lance":
      return "promotedLance"
    case "knight":
      return "promotedKnight"
    case "silver":
      return "promotedSilver"
    case "rook":
      return "promotedRook"
    case "bishop":
      return "promotedBishop"
    default:
      return type
  }
}

// 成駒から元の駒の種類を返す関数
function getUnpromotedType(type: PieceType): PieceType {
  switch (type) {
    case "promotedPawn":
      return "pawn"
    case "promotedLance":
      return "lance"
    case "promotedKnight":
      return "knight"
    case "promotedSilver":
      return "silver"
    case "promotedRook":
      return "rook"
    case "promotedBishop":
      return "bishop"
    default:
      return type
  }
}
