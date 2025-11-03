# Chess Philidor Defense Trainer

A web-based chess training application focused on learning the Philidor Defense opening (1.e4 e5 2.Nf3 d6), with integrated Stockfish engine for move analysis and recommendations.

## Features

- **Interactive Chess Board**: Click-to-move interface with visual feedback for valid moves
- **Philidor Defense Focus**: Learn the main lines and variations of the Philidor Defense
- **Stockfish Integration**: Real-time position analysis and move suggestions
- **Training Feedback**: Get instant feedback on your moves compared to opening theory
- **Move History**: Track all moves played in the game
- **Position Evaluation**: See Stockfish's evaluation of the current position
- **Hint System**: Request hints when stuck
- **Undo Functionality**: Take back moves to try different variations

## Philidor Defense Overview

The Philidor Defense is a solid chess opening that begins with:
1. e4 e5
2. Nf3 d6

Key ideas:
- Maintain a solid pawn structure
- Control the center with pawns
- Develop pieces harmoniously
- Prepare castling kingside

## Setup Instructions

1. **Install Node.js** (if not already installed)

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Server**:
   ```bash
   npm start
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000`

## How to Use

1. **Start a New Game**: Click "New Game" to begin
2. **Play as Black**: You play as Black, defending with the Philidor Defense
3. **Make Moves**: Click a piece to select it, then click a valid square to move
4. **Get Hints**: Click "Get Hint" to see Stockfish's recommended move
5. **Undo Moves**: Click "Undo Move" to take back the last move pair
6. **Flip Board**: Click "Flip Board" to change perspective

## Training Variations

The trainer includes several Philidor Defense lines:
- **Main Line**: 1.e4 e5 2.Nf3 d6 3.d4 Nf6
- **Hanham Variation**: 1.e4 e5 2.Nf3 d6 3.d4 Nd7
- **Exchange Variation**: 1.e4 e5 2.Nf3 d6 3.d4 exd4 4.Nxd4 Nf6
- **Larsen Variation**: 1.e4 e5 2.Nf3 d6 3.Bc4 Be7

## Technologies Used

- **chess.js**: Chess logic and move validation
- **Stockfish.js**: Chess engine for position analysis
- **Vanilla JavaScript**: No frameworks needed
- **CSS Grid**: Responsive chessboard layout
- **Node.js**: Simple HTTP server

## Files Structure

```
chesstrainer/
├── index.html          # Main HTML file
├── styles.css          # Styling and layout
├── app.js              # Chess logic and Stockfish integration
├── server.js           # Simple HTTP server
├── package.json        # Dependencies
└── README.md           # This file
```

## License

MIT License - Feel free to use and modify for your chess training!
