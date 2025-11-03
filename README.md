# Chess Opening Trainer

A comprehensive web-based chess training application featuring 26 major chess openings with over 100 variations. Includes integrated Stockfish engine for real-time move analysis, visual indicators for optimal moves, and multiple board styles.

## Features

- **26 Chess Openings**: From Italian Game to Sicilian Defense, covering all major opening systems
- **100+ Variations**: Deep opening theory with 15-19 moves per variation
- **Interactive Chess Board**: Click-to-move interface with smooth animations
- **Triple Indicator System**: 
  - 🟢 Green: Opening book moves
  - 🔵 Blue: Stockfish best move recommendation
  - 🔴 Red: Opponent's best response
- **Stockfish Integration**: Real-time position analysis with adjustable strength (800-2500 ELO)
- **Visual Customization**: 5 board styles and 3 piece styles
- **Training Feedback**: Instant feedback comparing your moves to opening theory
- **Move History**: Complete game record with notation
- **Position Evaluation**: Live Stockfish evaluation and depth
- **Hint System**: Visual and textual move suggestions
- **Undo Functionality**: Take back moves to explore variations
- **Board Flipping**: Play from either perspective

## About the Openings

This trainer includes 26 major chess openings with over 100 variations. Below are descriptions of each opening system:

### White Openings with e4

**Italian Game**
One of the oldest openings, focusing on rapid development with Bc4 targeting f7. Leads to open, tactical positions with chances for both sides. Includes the aggressive Evans Gambit and solid Giuoco Piano variations.

**Ruy Lopez (Spanish Opening)**
The most classical e4 opening, applying pressure on e5 via Bb5. Rich in strategic complexity with numerous variations from the solid Closed to the sharp Marshall Attack. A favorite at all levels.

**Scotch Opening**
An aggressive opening with early d4, leading to open positions and tactical play. White gains space and development at the cost of pawn structure. Popular at the highest levels for its direct approach.

**King's Gambit**
A romantic, aggressive gambit sacrificing the f-pawn for rapid development and attacking chances. Requires precise play from both sides. The Falkbeer Counter-Gambit offers Black an interesting alternative.

### White Openings with d4

**London System**
A reliable system-based opening where White develops harmoniously with Bf4, e3, and Bd3. Solid and flexible, suitable for players seeking comfortable positions without extensive memorization.

**Queen's Gambit Declined**
One of the most solid defenses to d4, maintaining the central pawn. Black aims for a solid position with potential counterplay. Features the Orthodox, Tartakower, and Cambridge Springs variations.

**Catalan Opening**
A hybrid opening combining Queen's Gambit with g3-Bg2 fianchetto. White exerts long-term pressure on the queenside while maintaining flexibility. Popular in high-level chess for its strategic richness.

### White Openings (Flank)

**English Opening**
A flexible system opening starting with c4. Can transpose to many positions or maintain its own character. Offers White excellent control and flexibility with various pawn structures.

**Réti Opening**
A hypermodern opening with Nf3 and g3, controlling the center from afar. Named after Richard Réti, it often leads to unique pawn structures and strategic maneuvering.

### Black Defenses vs e4

**Philidor Defense**
A solid, classical defense with 1...e5 2.Nf3 d6. Black maintains a strong point on e5 while preparing gradual development. Leads to closed, strategic positions favoring solid positional play.

**Sicilian Defense**
The most popular defense to e4 at all levels. Black fights for the initiative with asymmetrical pawn structures. Features aggressive variations like the Najdorf and Dragon, offering sharp tactical battles.

**French Defense**
A strategic opening where Black accepts a cramped position in exchange for a solid structure. Leads to closed positions with typical pawn tension on d5-e6 vs e5. Rich in strategic ideas.

**Caro-Kann Defense**
Similar to the French but more solid, avoiding the weakness of the light-squared bishop. Black achieves a sound position with good piece coordination. Popular among players seeking reliable equality.

**Pirc Defense**
A hypermodern defense with ...d6, ...Nf6, and ...g6, allowing White to build a strong center which Black will later undermine. Leads to complex, dynamic positions.

**Alekhine's Defense**
An ultra-hypermodern defense where Black invites White to build a massive pawn center (with e4-e5-d4-c4-f4) then attempts to undermine it. Named after World Champion Alexander Alekhine.

**Scandinavian Defense**
Black immediately challenges White's e-pawn with 1...d5. Leads to quick development and clear plans. One of the oldest recorded openings, dating back to the 15th century.

### Black Defenses vs d4

**King's Indian Defense**
An aggressive, hypermodern defense where Black allows White to build a strong center, then counterattacks on the kingside. Features sharp tactical battles and opposite-side castling.

**Grünfeld Defense**
Black allows White to build the ideal pawn center (d4-e4) then immediately attacks it with ...d5. Highly tactical and theory-heavy, popular at the highest levels.

**Nimzo-Indian Defense**
One of the most reliable defenses to d4, pinning the Nc3 with ...Bb4. Black achieves quick development and fights for central control. Multiple variations from positional to sharp.

**Slav Defense**
A solid defense supporting the d5-pawn with ...c6 instead of ...e6. Maintains flexibility and avoids locking in the light-squared bishop. The Semi-Slav adds ...e6 for extra complexity.

**Dutch Defense**
An aggressive defense with 1...f5, immediately fighting for e4. Leads to unbalanced positions with Black's kingside weaknesses balanced by attacking chances. The Leningrad and Stonewall are main systems.

**Benoni Defense**
A dynamic defense with ...c5, leading to asymmetrical pawn structures. Black gets active piece play and attacking chances on the queenside in exchange for space disadvantage.

**Budapest Gambit**
An aggressive gambit with 1.d4 Nf6 2.c4 e5, sacrificing a pawn for rapid development and attacking chances. Less theoretically sound but dangerous in practical play.

**Benko Gambit**
A positional gambit where Black sacrifices the b-pawn for long-term pressure on White's queenside. Features characteristic play with ...a6-b5 and pressure on the long diagonal.

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

## Complete Opening List

**White Openings (e4):**
- Italian Game (5 variations)
- Ruy Lopez (6 variations)
- Scotch Opening (5 variations)
- King's Gambit (5 variations)

**White Openings (d4):**
- London System (7 variations)
- Queen's Gambit Declined (4 variations)
- Catalan Opening (3 variations)

**White Openings (Flank):**
- English Opening (4 variations)
- Réti Opening (3 variations)

**Black Defenses vs e4:**
- Philidor Defense (6 variations)
- Sicilian Defense (5 variations)
- French Defense (4 variations)
- Caro-Kann Defense (4 variations)
- Pirc Defense (3 variations)
- Alekhine's Defense (3 variations)
- Scandinavian Defense (3 variations)

**Black Defenses vs d4:**
- King's Indian Defense (4 variations)
- Grünfeld Defense (3 variations)
- Nimzo-Indian Defense (4 variations)
- Slav Defense (4 variations)
- Dutch Defense (3 variations)
- Benoni Defense (3 variations)
- Budapest Gambit (3 variations)
- Benko Gambit (3 variations)

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
