import { useState, useEffect } from 'react';

export default function App() {
  const BOARD_SIZE = 5;
  
  // 駒の種類と表示
  const PIECES = {
    KING_1: { type: 'king', player: 1, symbol: '王', japanese: '王', english: 'King' },
    ROOK_1: { type: 'rook', player: 1, symbol: '飛', japanese: '飛車', english: 'Rook' },
    BISHOP_1: { type: 'bishop', player: 1, symbol: '角', japanese: '角', english: 'Bishop' },
    KING_2: { type: 'king', player: 2, symbol: '玉', japanese: '玉', english: 'King' },
    ROOK_2: { type: 'rook', player: 2, symbol: '飛', japanese: '飛車', english: 'Rook' },
    BISHOP_2: { type: 'bishop', player: 2, symbol: '角', japanese: '角', english: 'Bishop' },
  };
  
  // ゲームの状態
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'checkmate', 'draw'
  const [winner, setWinner] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [language, setLanguage] = useState('japanese');
  const [capturedPieces, setCapturedPieces] = useState({ 1: [], 2: [] });
  
  // CSS スタイル
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: '#fffaeb',
      minHeight: '100vh',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
    },
    button: {
      backgroundColor: '#b45309',
      color: 'white',
      fontWeight: 'bold',
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
    },
    blueButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: 'bold',
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
    },
    statusContainer: {
      marginBottom: '16px',
    },
    statusText: {
      fontSize: '18px',
      fontWeight: '600',
    },
    gameOverText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#dc2626',
    },
    gameLayout: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    capturedContainer: {
      width: '64px',
      marginRight: '8px',
    },
    capturedRightContainer: {
      width: '64px',
      marginLeft: '8px',
    },
    capturedTitle: {
      textAlign: 'center',
      marginBottom: '4px',
    },
    capturedPieces: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    capturedPiece: {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fef3c7',
      border: '1px solid #92400e',
      marginBottom: '4px',
    },
    capturedText1: {
      color: 'black',
    },
    capturedText2: {
      color: '#dc2626',
    },
    board: {
      border: '4px solid #92400e',
      backgroundColor: '#fde68a',
    },
    row: {
      display: 'flex',
    },
    cell: {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid #92400e',
      cursor: 'pointer',
    },
    cellSelected: {
      backgroundColor: '#93c5fd',
    },
    cellValidMove: {
      backgroundColor: '#bbf7d0',
    },
    piece: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
    },
    piece1: {
      backgroundColor: 'white',
      color: 'black',
    },
    piece2: {
      backgroundColor: '#374151',
      color: 'white',
      transform: 'rotate(180deg)',
    },
    rulesContainer: {
      marginTop: '24px',
      padding: '16px',
      backgroundColor: '#fef3c7',
      borderRadius: '4px',
      border: '1px solid #92400e',
      maxWidth: '500px',
    },
    rulesTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    rulesList: {
      listStyleType: 'disc',
      marginLeft: '20px',
    },
    rulesItem: {
      marginBottom: '4px',
    },
  };
  
  // ボードの初期化
  useEffect(() => {
    initializeBoard();
  }, []);
  
  // ランダムに駒を配置する
  const randomizeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    // プレイヤー1の駒をランダムに配置（最下段）
    const player1Pieces = [PIECES.KING_1, PIECES.ROOK_1, PIECES.BISHOP_1];
    const player1Positions = shuffle([0, 1, 2, 3, 4]).slice(0, 3);
    
    player1Positions.forEach((col, index) => {
      newBoard[BOARD_SIZE - 1][col] = player1Pieces[index];
    });
    
    // プレイヤー2の駒をランダムに配置（最上段）
    const player2Pieces = [PIECES.KING_2, PIECES.ROOK_2, PIECES.BISHOP_2];
    const player2Positions = shuffle([0, 1, 2, 3, 4]).slice(0, 3);
    
    player2Positions.forEach((col, index) => {
      newBoard[0][col] = player2Pieces[index];
    });
    
    setBoard(newBoard);
    setCurrentPlayer(1);
    setSelectedPiece(null);
    setValidMoves([]);
    setGameStatus('playing');
    setWinner(null);
    setCapturedPieces({ 1: [], 2: [] });
  };
  
  // 推奨配置でボードを初期化
  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    // プレイヤー1の駒を配置（下側）
    newBoard[BOARD_SIZE - 1][2] = PIECES.KING_1;
    newBoard[BOARD_SIZE - 1][1] = PIECES.ROOK_1;
    newBoard[BOARD_SIZE - 1][3] = PIECES.BISHOP_1;
    
    // プレイヤー2の駒を配置（上側）
    newBoard[0][2] = PIECES.KING_2;
    newBoard[0][1] = PIECES.ROOK_2;
    newBoard[0][3] = PIECES.BISHOP_2;
    
    setBoard(newBoard);
    setCurrentPlayer(1);
    setSelectedPiece(null);
    setValidMoves([]);
    setGameStatus('playing');
    setWinner(null);
    setCapturedPieces({ 1: [], 2: [] });
  };
  
  // 配列をシャッフルするヘルパー関数
  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // 駒の有効な移動先を計算
  const calculateValidMoves = (row, col) => {
    const piece = board[row][col];
    if (!piece || piece.player !== currentPlayer) return [];
    
    const moves = [];
    
    switch (piece.type) {
      case 'king':
        // 王の動き: 周囲の8マス
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (isValidPosition(newRow, newCol) && 
                (!board[newRow][newCol] || board[newRow][newCol].player !== currentPlayer)) {
              moves.push([newRow, newCol]);
            }
          }
        }
        break;
        
      case 'rook':
        // 飛車の動き: 上下左右
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (const [dr, dc] of directions) {
          let newRow = row + dr;
          let newCol = col + dc;
          
          while (isValidPosition(newRow, newCol)) {
            if (!board[newRow][newCol]) {
              moves.push([newRow, newCol]);
            } else {
              if (board[newRow][newCol].player !== currentPlayer) {
                moves.push([newRow, newCol]);
              }
              break;
            }
            
            newRow += dr;
            newCol += dc;
          }
        }
        break;
        
      case 'bishop':
        // 角の動き: 斜め
        const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        
        for (const [dr, dc] of bishopDirections) {
          let newRow = row + dr;
          let newCol = col + dc;
          
          while (isValidPosition(newRow, newCol)) {
            if (!board[newRow][newCol]) {
              moves.push([newRow, newCol]);
            } else {
              if (board[newRow][newCol].player !== currentPlayer) {
                moves.push([newRow, newCol]);
              }
              break;
            }
            
            newRow += dr;
            newCol += dc;
          }
        }
        break;
    }
    
    return moves;
  };
  
  // 位置がボード内かどうかをチェック
  const isValidPosition = (row, col) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };
  
  // マスがクリックされたときの処理
  const handleSquareClick = (row, col) => {
    if (gameStatus !== 'playing') return;
    
    // 既に選択された駒がある場合
    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece;
      
      // 有効な移動先かどうかを確認
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
      
      if (isValidMove) {
        // 駒を移動
        movePiece(selectedRow, selectedCol, row, col);
      }
      
      // 選択状態をリセット
      setSelectedPiece(null);
      setValidMoves([]);
      
    } else {
      // 駒を選択
      const piece = board[row][col];
      
      if (piece && piece.player === currentPlayer) {
        setSelectedPiece([row, col]);
        setValidMoves(calculateValidMoves(row, col));
      }
    }
  };
  
  // 駒を移動する
  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = [...board.map(row => [...row])];
    const movingPiece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];
    
    // 駒を移動
    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = null;
    
    // 駒が取られた場合
    if (capturedPiece) {
      const newCapturedPieces = { ...capturedPieces };
      newCapturedPieces[currentPlayer].push(capturedPiece);
      setCapturedPieces(newCapturedPieces);
      
      // 王が取られた場合、ゲーム終了
      if (capturedPiece.type === 'king') {
        setGameStatus('checkmate');
        setWinner(currentPlayer);
      }
    }
    
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };
  
  // 言語を切り替える
  const toggleLanguage = () => {
    setLanguage(language === 'japanese' ? 'english' : 'japanese');
  };
  
  // ゲームをリセットする
  const resetGame = () => {
    initializeBoard();
  };
  
  // セルのスタイルを計算する
  const getCellStyle = (rowIndex, colIndex) => {
    const isSelected = selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex;
    const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
    
    let cellStyle = { ...styles.cell };
    
    if (isSelected) {
      cellStyle = { ...cellStyle, ...styles.cellSelected };
    } else if (isValidMove) {
      cellStyle = { ...cellStyle, ...styles.cellValidMove };
    }
    
    return cellStyle;
  };
  
  // 駒のスタイルを計算する
  const getPieceStyle = (piece) => {
    let pieceStyle = { ...styles.piece };
    
    if (piece.player === 1) {
      pieceStyle = { ...pieceStyle, ...styles.piece1 };
    } else {
      pieceStyle = { ...pieceStyle, ...styles.piece2 };
    }
    
    return pieceStyle;
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {language === 'japanese' ? 'シンプル5x5将棋' : 'Simple 5x5 Shogi'}
      </h1>
      
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={resetGame}
        >
          {language === 'japanese' ? '推奨配置で開始' : 'Start with Recommended Layout'}
        </button>
        <button
          style={styles.button}
          onClick={randomizeBoard}
        >
          {language === 'japanese' ? 'ランダム配置で開始' : 'Start with Random Layout'}
        </button>
        <button
          style={styles.blueButton}
          onClick={toggleLanguage}
        >
          {language === 'japanese' ? 'English' : '日本語'}
        </button>
      </div>
      
      <div style={styles.statusContainer}>
        <div style={styles.statusText}>
          {language === 'japanese' 
            ? `現在のプレイヤー: ${currentPlayer === 1 ? '先手' : '後手'}`
            : `Current Player: ${currentPlayer === 1 ? 'First' : 'Second'}`}
        </div>
        
        {gameStatus === 'checkmate' && (
          <div style={styles.gameOverText}>
            {language === 'japanese'
              ? `ゲーム終了！ ${winner === 1 ? '先手' : '後手'}の勝ち！`
              : `Game Over! ${winner === 1 ? 'First' : 'Second'} player wins!`}
          </div>
        )}
      </div>
      
      <div style={styles.gameLayout}>
        {/* プレイヤー2の取った駒 */}
        <div style={styles.capturedContainer}>
          <div style={styles.capturedTitle}>
            {language === 'japanese' ? '後手の取った駒' : 'Player 2 Captures'}
          </div>
          <div style={styles.capturedPieces}>
            {capturedPieces[2].map((piece, index) => (
              <div key={index} style={styles.capturedPiece}>
                <span style={styles.capturedText1}>{piece.symbol}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 将棋盤 */}
        <div style={styles.board}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} style={styles.row}>
              {row.map((piece, colIndex) => (
                <div
                  key={colIndex}
                  style={getCellStyle(rowIndex, colIndex)}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece && (
                    <div style={getPieceStyle(piece)}>
                      {piece.symbol}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* プレイヤー1の取った駒 */}
        <div style={styles.capturedRightContainer}>
          <div style={styles.capturedTitle}>
            {language === 'japanese' ? '先手の取った駒' : 'Player 1 Captures'}
          </div>
          <div style={styles.capturedPieces}>
            {capturedPieces[1].map((piece, index) => (
              <div key={index} style={styles.capturedPiece}>
                <span style={styles.capturedText2}>{piece.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={styles.rulesContainer}>
        <h2 style={styles.rulesTitle}>
          {language === 'japanese' ? 'ゲームのルール' : 'Game Rules'}
        </h2>
        <ul style={styles.rulesList}>
          <li style={styles.rulesItem}>
            {language === 'japanese' 
              ? '各プレイヤーは王、飛車、角の3つの駒を持ちます'
              : 'Each player has 3 pieces: King, Rook, and Bishop'}
          </li>
          <li style={styles.rulesItem}>
            {language === 'japanese'
              ? '王：上下左右と斜めのいずれの方向にも1マス動けます'
              : 'King: Can move 1 square in any direction'}
          </li>
          <li style={styles.rulesItem}>
            {language === 'japanese'
              ? '飛車：上下左右の方向に何マスでも動けます'
              : 'Rook: Can move any number of squares horizontally or vertically'}
          </li>
          <li style={styles.rulesItem}>
            {language === 'japanese'
              ? '角：斜めの方向に何マスでも動けます'
              : 'Bishop: Can move any number of squares diagonally'}
          </li>
          <li style={styles.rulesItem}>
            {language === 'japanese'
              ? '相手の王を取ることが勝利条件です'
              : 'The goal is to capture the opponent\'s King'}
          </li>
          <li style={styles.rulesItem}>
            {language === 'japanese'
              ? '取った駒はゲームから除外されます（持ち駒として使えません）'
              : 'Captured pieces are removed from the game (no drops)'}
          </li>
        </ul>
      </div>
    </div>
  );
};
