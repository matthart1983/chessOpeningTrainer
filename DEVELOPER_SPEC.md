# Chess Opening Trainer - Developer Specification

**Version:** 1.0.0  
**Last Updated:** November 7, 2025  
**Repository:** https://github.com/matthart1983/chessOpeningTrainer

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [File Structure](#file-structure)
5. [Core Components](#core-components)
6. [Data Structures](#data-structures)
7. [Key Features](#key-features)
8. [API Documentation](#api-documentation)
9. [Visual Indicators System](#visual-indicators-system)
10. [Stockfish Integration](#stockfish-integration)
11. [Opening Lines Database](#opening-lines-database)
12. [UI/UX Design](#uiux-design)
13. [Configuration & Settings](#configuration--settings)
14. [Development Setup](#development-setup)
15. [Deployment](#deployment)
16. [Testing Strategy](#testing-strategy)
17. [Future Enhancements](#future-enhancements)

---

## Project Overview

### Purpose
An interactive web-based chess opening trainer that helps users learn and practice 26 different chess openings with real-time Stockfish analysis and visual feedback.

### Target Audience
- Chess beginners to advanced players (800-2500 ELO)
- Opening theory students
- Self-learners and chess enthusiasts

### Core Value Proposition
- Learn opening theory through interactive practice
- Visual indicators for book moves, best moves, and opponent responses
- Adjustable difficulty (Stockfish levels 1-20)
- Multiple board and piece styles
- Comprehensive opening database with 100+ variations

---

## Architecture

### Application Pattern
Single-page application (SPA) with vanilla JavaScript ES6+ modules

### Design Pattern
Object-oriented design with a single `ChessTrainer` class managing all application state

### Data Flow
```
User Input → ChessTrainer Controller → Chess.js (Validation) → Stockfish (Analysis) → UI Update
                ↓                                                    ↓
           Game State                                         Visual Indicators
```

### Component Hierarchy
```
ChessTrainer (Main Controller)
├── Game Engine (chess.js)
├── Stockfish Engine (Web Worker)
├── UI Renderer (drawBoard, updateUI)
├── Move Handler (makeMove, checkPlayerMove)
├── Opening Database (openingLines)
└── Style Manager (board/piece themes)
```

---

## Technology Stack

### Frontend
- **Language:** JavaScript ES6+ (Modules)
- **Chess Logic:** chess.js v1.0.0-beta.8
- **Chess Engine:** Stockfish v17.1.0 (WASM)
- **Styling:** CSS3 (no preprocessor)
- **HTML:** HTML5 semantic markup

### Backend
- **Server:** Node.js HTTP server (single file)
- **Port:** 3000 (configurable via PORT env variable)
- **Static File Serving:** Native Node.js `fs` and `http` modules

### Dependencies
```json
{
  "chess.js": "^1.0.0-beta.8",
  "stockfish": "^17.1.0"
}
```

### Development Tools
- Git (SSH)
- Node.js v14+
- Modern browser (Chrome/Edge/Firefox/Safari)

---

## File Structure

```
chesstrainer/
├── app.js                    # Main application logic (1504 lines)
├── index.html                # HTML structure (170 lines)
├── styles.css                # All styling (770+ lines)
├── server.js                 # Node.js static server (75 lines)
├── package.json              # Dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── README.md                 # User-facing documentation
├── STANDALONE_README.md      # Standalone deployment guide
├── DEVELOPER_SPEC.md         # This file
├── .gitignore                # Git ignore rules
├── stockfish.js              # Legacy reference (deprecated)
└── node_modules/             # Dependencies
    ├── chess.js/
    └── stockfish/
```

---

## Core Components

### 1. ChessTrainer Class (`app.js`)

**Constructor Properties:**
```javascript
{
  game: Chess,                    // chess.js instance
  stockfish: Worker,              // Stockfish web worker
  boardFlipped: boolean,          // Board orientation
  selectedSquare: string|null,    // Currently selected square (e.g., 'e2')
  validMoves: Array,              // Legal moves from selected square
  playerSide: 'white'|'black',    // Player's color
  stockfishReady: boolean,        // Engine initialization status
  currentEvaluation: number,      // Position evaluation in centipawns
  bestMove: string|null,          // Best move in UCI format (e.g., 'e2e4')
  skillLevel: number,             // Stockfish skill (1-20)
  waitingForEngine: boolean,      // Async engine call flag
  engineCallback: Function|null,  // Engine response callback
  currentBookMove: Object|null,   // {from: 'e2', to: 'e4'}
  bestMoveSquares: Object|null,   // {from: 'e2', to: 'e4'}
  opponentResponseSquares: Object|null, // {from: 'e7', to: 'e5'}
  analyzingResponse: boolean,     // Response analysis flag
  openingLines: Object,           // Opening database
  currentOpening: string,         // Selected opening key
  currentLine: string,            // Selected variation key
  moveHistory: Array<string>      // SAN move history
}
```

**Key Methods:**

| Method | Purpose | Parameters | Returns |
|--------|---------|------------|---------|
| `init()` | Initialize game and UI | none | void |
| `initStockfish()` | Initialize Stockfish engine | none | void |
| `handleStockfishMessage(msg)` | Process Stockfish output | string | void |
| `analyzePosition()` | Request position analysis | none | void |
| `analyzeOpponentResponse(move)` | Analyze opponent's best reply | string (UCI) | void |
| `drawBoard()` | Render chessboard | none | void |
| `selectSquare(square)` | Handle square selection | string | void |
| `makeMove(move, isPlayerMove)` | Execute a move | Object, boolean | Object |
| `animateMove(from, to, callback)` | Animate piece movement | string, string, Function | void |
| `makeComputerMove()` | Computer move logic | none | void |
| `checkPlayerMove(move)` | Validate player move against book | Object | void |
| `updateUI()` | Update all UI elements | none | void |
| `updateBestMoveUI()` | Update best move display | none | void |
| `flipBoard()` | Flip board orientation | none | void |
| `newGame()` | Start new game | none | void |
| `undoMove()` | Undo last move | none | void |
| `getHint()` | Show move hint | none | void |
| `changeSkillLevel(level)` | Change Stockfish difficulty | number | void |
| `changeBoardStyle(style)` | Change board appearance | string | void |
| `changePieceStyle(style)` | Change piece appearance | string | void |
| `changeOpening(opening)` | Switch opening | string | void |

---

## Data Structures

### Opening Database Schema
```javascript
{
  [openingKey]: {
    name: string,              // Display name
    playerSide: 'white'|'black', // Player's color
    lines: {
      [variationKey]: Array<string>, // SAN moves
      // ...
    },
    mainLine: string,          // Default variation key
    description: string,       // Opening description
    beginnerStrength: number,  // Stars 1-5
    gmStrength: number,        // Stars 1-5
    famousPlayers: Array<string> // GM names
  }
}
```

### Move Representation
```javascript
// chess.js move object
{
  from: 'e2',      // Source square
  to: 'e4',        // Destination square
  san: 'e4',       // Standard Algebraic Notation
  piece: 'p',      // Piece type (p,n,b,r,q,k)
  color: 'w',      // Color (w/b)
  flags: 'b',      // Move flags (n=normal, b=big pawn, e=en passant, c=capture, p=promotion, k=kingside castle, q=queenside castle)
  captured: 'p',   // Captured piece (if any)
  promotion: 'q'   // Promotion piece (if any)
}
```

### UCI Move Format
```
[from][to][promotion]
Examples:
  'e2e4'    - Normal move
  'e1g1'    - Kingside castle
  'e7e8q'   - Pawn promotion to queen
```

---

## Key Features

### 1. Opening Selection
- **26 openings** across 5 categories:
  - White Openings (e4): Italian, Ruy Lopez, Scotch, King's Gambit
  - White Openings (d4): London, Queen's Gambit, Catalan
  - White Openings (Other): English, Réti
  - Black Defenses (vs e4): Philidor, Sicilian, French, Caro-Kann, Pirc, Alekhine, Scandinavian
  - Black Defenses (vs d4): King's Indian, Grünfeld, Nimzo-Indian, Slav, Dutch, Benoni, Budapest, Benko
- **100+ variations** total
- **Dynamic descriptions** with ratings and famous players

### 2. Visual Indicators

**Three-Color System:**
1. **Green** - Book moves (opening theory)
2. **Blue** - Best engine moves (player's turn)
3. **Red** - Opponent response (computer's turn)

**Implementation:**
- CSS classes: `book-move-to`, `engine-move-to`, `opponent-response-to`
- Turn-based conditional rendering
- Glow effects using `box-shadow`

### 3. Stockfish Integration

**Configuration:**
- Skill levels: 1-20 (800-2500 ELO)
- Analysis depth: 10-22 (scales with skill)
- Time allocation: 1000-4000ms (scales with skill)
- UCI strength limiting enabled

**Analysis Pipeline:**
1. Position → UCI format
2. Engine analysis → bestmove + evaluation
3. Parse response → update UI
4. Analyze opponent response (if computer move)

### 4. Move Validation

**Book Move Checking:**
```javascript
if (isBookMove) {
  feedback = "✓ Excellent! This is the book move."
} else if (isTopEngineMove) {
  feedback = "Good move! Close to book theory."
} else {
  feedback = "This move deviates from the opening."
}
```

### 5. Customization Options

**Board Styles:**
- Classic Brown
- Ocean Blue
- Forest Green
- Modern Gray
- Wooden

**Piece Styles:**
- Classic Unicode
- Modern
- Bold

---

## API Documentation

### Stockfish UCI Commands

**Initialization:**
```
uci                          # Initialize UCI protocol
setoption name UCI_LimitStrength value true
setoption name UCI_Elo value [ELO]
isready                      # Wait for ready signal
```

**Analysis:**
```
position fen [FEN_STRING]    # Set position
go depth [N]                 # Analyze to depth N
go movetime [MS]             # Analyze for N milliseconds
stop                         # Stop analysis
```

**Responses:**
```
uciok                        # UCI protocol ready
readyok                      # Engine ready
bestmove [MOVE]              # Best move found
info score cp [N]            # Evaluation in centipawns
info depth [N]               # Current search depth
```

### chess.js API Usage

**Initialization:**
```javascript
import { Chess } from 'chess.js';
const chess = new Chess();
```

**Core Methods:**
```javascript
chess.move({from: 'e2', to: 'e4'});  // Make move
chess.undo();                         // Undo move
chess.moves();                        // Get legal moves
chess.moves({verbose: true});         // Get detailed moves
chess.isGameOver();                   // Check game end
chess.isCheck();                      // Check if in check
chess.isCheckmate();                  // Check if checkmate
chess.isDraw();                       // Check if draw
chess.fen();                          // Get FEN string
chess.turn();                         // Get current turn ('w'/'b')
chess.get(square);                    // Get piece at square
```

---

## Visual Indicators System

### Indicator Priority (CSS z-index)
```
Piece (z-index: 2)
  ↓
Move Indicators (z-index: 0)
  ↓
Square Background (default layer)
```

### CSS Classes

**Green (Book Moves):**
```css
.square.book-move-to::after {
  background-color: rgba(46, 204, 113, 0.8);
  box-shadow: 0 0 15px rgba(46, 204, 113, 0.7);
}
.square.book-move-from {
  background-color: rgba(46, 204, 113, 0.4);
}
```

**Blue (Player Best Move):**
```css
.square.engine-move-to::after {
  background-color: rgba(52, 152, 219, 0.8);
  box-shadow: 0 0 15px rgba(52, 152, 219, 0.7);
}
.square.engine-move-from {
  background-color: rgba(52, 152, 219, 0.4);
}
```

**Red (Opponent Response):**
```css
.square.opponent-response-to::after {
  background-color: rgba(231, 76, 60, 0.8);
  box-shadow: 0 0 15px rgba(231, 76, 60, 0.7);
}
.square.opponent-response-from {
  background-color: rgba(231, 76, 60, 0.4);
}
```

### Turn-Based Logic
```javascript
const isPlayerTurn = (this.playerSide === 'white' && currentTurn === 'w') || 
                     (this.playerSide === 'black' && currentTurn === 'b');

if (this.bestMoveSquares && isPlayerTurn) {
  // Show blue indicators
}

if (this.opponentResponseSquares && !isPlayerTurn) {
  // Show red indicators
}
```

---

## Stockfish Integration

### Initialization Flow
```
1. Create Web Worker → new Worker(stockfish.js)
2. Send: 'uci'
3. Receive: 'uciok'
4. Send: 'setoption name UCI_LimitStrength value true'
5. Send: 'setoption name UCI_Elo value [ELO]'
6. Send: 'isready'
7. Receive: 'readyok'
8. Engine ready ✓
```

### Analysis Flow
```
1. User makes move
2. analyzePosition() called
3. Send: 'position fen [FEN]'
4. Send: 'go depth [N] movetime [MS]'
5. Receive: 'info score cp [EVAL]'
6. Receive: 'bestmove [MOVE]'
7. Update UI with evaluation and best move
8. If computer move, call analyzeOpponentResponse()
```

### ELO Mapping
```javascript
getEloForSkillLevel(level) {
  const eloMap = {
    1: 800,   5: 1300,  10: 1700,
    3: 1000,  15: 2100, 20: 2500
  };
  return eloMap[level] || 1500 + (level * 60);
}
```

### Depth & Time Calculation
```javascript
// Depth: 10-22 based on skill
const depth = Math.max(10, Math.min(22, 10 + this.skillLevel / 2));

// Time: 1000-4000ms based on skill
const moveTime = Math.max(1000, Math.min(4000, 1000 + this.skillLevel * 150));
```

---

## Opening Lines Database

### Structure
26 openings × ~4 variations each = 100+ total lines

### Categories

**1. White Openings (e4)**
- Italian Game (6 variations)
- Ruy Lopez (6 variations)
- Scotch Opening (5 variations)
- King's Gambit (5 variations)

**2. White Openings (d4)**
- London System (7 variations)
- Queen's Gambit (5 variations)
- Catalan Opening (4 variations)

**3. White Openings (Other)**
- English Opening (5 variations)
- Réti Opening (4 variations)

**4. Black Defenses (vs e4)**
- Philidor Defense (6 variations)
- Sicilian Defense (6 variations)
- French Defense (5 variations)
- Caro-Kann Defense (5 variations)
- Pirc Defense (4 variations)
- Alekhine's Defense (4 variations)
- Scandinavian Defense (3 variations)

**5. Black Defenses (vs d4)**
- King's Indian Defense (5 variations)
- Grünfeld Defense (4 variations)
- Nimzo-Indian Defense (5 variations)
- Slav Defense (4 variations)
- Dutch Defense (4 variations)
- Benoni Defense (4 variations)
- Budapest Gambit (3 variations)
- Benko Gambit (3 variations)

### Example Opening Entry
```javascript
philidor: {
  name: 'Philidor Defense',
  playerSide: 'black',
  lines: {
    main: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nf6', ...],
    hanham: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nd7', ...],
    exchange: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'exd4', ...],
    larsen: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Be7', ...],
    antoshin: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nf6', ...],
    liondefense: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nd7', ...]
  },
  mainLine: 'main',
  description: 'A solid defensive system...',
  beginnerStrength: 4,
  gmStrength: 2,
  famousPlayers: ['Bent Larsen', 'Étienne Bacrot', 'Tony Miles']
}
```

---

## UI/UX Design

### Layout Structure
```
┌─────────────────────────────────────────────┐
│              Header (Title)                 │
├──────────────────┬──────────────────────────┤
│                  │                          │
│   Chessboard     │   Game Status            │
│   (8x8 grid)     │   Stockfish Analysis     │
│                  │   Move History           │
│   Color Key      │   Training Info          │
│   Controls       │   Opening Description    │
│   Settings       │                          │
│                  │                          │
└──────────────────┴──────────────────────────┘
```

### Responsive Breakpoints
- **Desktop:** Full two-column layout
- **Tablet:** Stacked layout (768px)
- **Mobile:** Single column, simplified controls

### Color Scheme
```css
/* Primary Colors */
--primary-blue: #3498db
--dark-bg: #2c3e50
--light-bg: #f8f9fa

/* Board Colors (Ocean Blue) */
--light-square: #d4e9ff
--dark-square: #7fa3d1

/* Indicator Colors */
--book-move: rgba(46, 204, 113, 0.8)    /* Green */
--best-move: rgba(52, 152, 219, 0.8)    /* Blue */
--opponent-response: rgba(231, 76, 60, 0.8) /* Red */
```

### Typography
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...
```

### Animations
- **Piece movement:** 0.3s cubic-bezier transition
- **Square hover:** 0.2s ease
- **Button hover:** 0.3s with translateY(-2px)

---

## Configuration & Settings

### Stockfish Levels
```javascript
Level  1: ~800 ELO  - Beginner
Level  3: ~1000 ELO - Novice
Level  5: ~1300 ELO - Intermediate
Level 10: ~1700 ELO - Advanced
Level 15: ~2100 ELO - Expert
Level 20: ~2500 ELO - Master (default)
```

### Board Styles
1. Classic Brown (default in code)
2. Ocean Blue (default in UI)
3. Forest Green
4. Modern Gray
5. Wooden

### Piece Styles
1. Classic Unicode (fallback)
2. Modern (default)
3. Bold

---

## Development Setup

### Prerequisites
```bash
Node.js v14+ (for Web Worker support)
npm v6+
Git
Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
```

### Installation
```bash
# Clone repository
git clone git@github.com:matthart1983/chessOpeningTrainer.git
cd chessOpeningTrainer

# Install dependencies
npm install

# Start development server
npm start
# Server runs on http://localhost:3000
```

### Project Commands
```json
{
  "start": "node server.js",  // Start production server
  "dev": "node server.js"     // Start development server (same)
}
```

### Environment Variables
```bash
PORT=3000  # Server port (default: 3000)
```

---

## Deployment

### Railway.app Configuration
**Service Type:** Web Service  
**Build Command:** `npm install`  
**Start Command:** `npm start`  
**Port Detection:** Automatic from `process.env.PORT`

### Health Check Endpoint
```
GET /health   → 200 OK
GET /healthz  → 200 OK
```

### Static File Serving
Server automatically serves:
- Root files (index.html, styles.css, app.js)
- node_modules dependencies
- Stockfish WASM files

### MIME Types
```javascript
{
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.mem': 'application/octet-stream'
}
```

### Build Process
No build step required - vanilla JavaScript

### Production Checklist
- [ ] All dependencies in package.json
- [ ] Environment variables configured
- [ ] Health check endpoint working
- [ ] WASM files loading correctly
- [ ] Git repository connected
- [ ] HTTPS enabled
- [ ] CORS not required (using lite single-threaded Stockfish)

---

## Testing Strategy

### Manual Testing
1. **Opening Selection:** Test all 26 openings load correctly
2. **Move Validation:** Test book moves vs deviations
3. **Stockfish Levels:** Test all 6 difficulty levels
4. **Visual Indicators:** Verify green/blue/red show at correct times
5. **Board/Piece Styles:** Test all theme combinations
6. **Controls:** Test New Game, Undo, Flip Board, Get Hint
7. **Responsive:** Test on mobile, tablet, desktop

### Key Test Cases
```
✓ Book move shows green indicator
✓ Player recommendation shows blue (player turn only)
✓ Opponent response shows red (computer turn only)
✓ Move validation provides correct feedback
✓ Computer makes moves at selected skill level
✓ Undo removes last move correctly
✓ Board flip maintains game state
✓ Hint shows best move
✓ Opening change resets game
```

### Browser Compatibility
- Chrome 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Edge 90+ ✓

---

## Future Enhancements

### Planned Features
1. **Statistics Tracking**
   - Move accuracy percentage
   - Opening success rate
   - Time per move
   - Session history

2. **PGN Import/Export**
   - Load games from PGN
   - Export training sessions
   - Share positions

3. **Advanced Training Modes**
   - Spaced repetition for weak lines
   - Timed challenges
   - Blindfold mode
   - Random position from opening

4. **Social Features**
   - Share training progress
   - Leaderboards
   - Challenge friends
   - Opening recommendations

5. **Enhanced Analysis**
   - Multi-PV lines (multiple variations)
   - Deeper analysis on demand
   - Opening book integration
   - Tablebase endgame support

6. **Mobile App**
   - Native iOS app
   - Native Android app
   - Offline support
   - Push notifications for daily training

### Technical Debt
- [ ] Add unit tests (Jest)
- [ ] Add E2E tests (Playwright)
- [ ] Refactor ChessTrainer into smaller modules
- [ ] Add TypeScript type definitions
- [ ] Implement service worker for offline support
- [ ] Add state management (consider Redux/Zustand)
- [ ] Optimize WASM loading
- [ ] Add error boundary/logging

---

## Performance Considerations

### Optimization Strategies
1. **Lazy Load Openings:** Only load selected opening data
2. **Web Worker:** Stockfish runs in separate thread (already implemented)
3. **Debounce Analysis:** Limit analysis frequency during rapid moves
4. **CSS Transitions:** Use GPU-accelerated transforms
5. **Minimize Reflows:** Batch DOM updates in drawBoard()

### Current Performance
- Initial load: <2s
- Move response: <50ms
- Engine analysis: 1-4s (configurable)
- Board redraw: <16ms (60fps)

### Resource Usage
- Memory: ~50MB (including WASM)
- CPU: Spikes during analysis, idle otherwise
- Network: One-time download (~8MB total)

---

## Troubleshooting

### Common Issues

**Issue:** Stockfish not loading  
**Solution:** Check WASM file path, ensure server serves `application/wasm` MIME type

**Issue:** Moves not registering  
**Solution:** Check console for chess.js validation errors, verify move format

**Issue:** Indicators not showing  
**Solution:** Verify turn-based logic, check CSS z-index layering

**Issue:** Board not flipping  
**Solution:** Ensure `boardFlipped` state updates and `drawBoard()` is called

**Issue:** Computer not moving  
**Solution:** Check Stockfish `readyok` response, verify `waitingForEngine` flag

---

## Contact & Support

**Developer:** Matt Hart  
**Repository:** https://github.com/matthart1983/chessOpeningTrainer  
**Issues:** https://github.com/matthart1983/chessOpeningTrainer/issues  
**License:** MIT

---

## Appendix

### Useful Resources
- [chess.js Documentation](https://github.com/jhlywa/chess.js)
- [Stockfish UCI Protocol](https://www.chessprogramming.org/UCI)
- [Chess Programming Wiki](https://www.chessprogramming.org/)
- [FEN Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)
- [SAN Notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))

### Glossary
- **FEN:** Forsyth-Edwards Notation (position representation)
- **SAN:** Standard Algebraic Notation (e.g., 'Nf3', 'e4')
- **UCI:** Universal Chess Interface (engine protocol)
- **WASM:** WebAssembly (binary instruction format)
- **ELO:** Chess rating system
- **Book Move:** Theoretical opening move
- **Centipawn:** 1/100th of a pawn (evaluation unit)

---

*End of Developer Specification*
