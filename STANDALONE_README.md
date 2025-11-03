# Chess Philidor Defense Trainer - Standalone Version

A web-based chess training application focused on learning the Philidor Defense opening (1.e4 e5 2.Nf3 d6), with integrated Stockfish engine for move analysis and recommendations.

## Quick Start (No Installation Required)

1. **Download or Clone** this repository

2. **Open index.html** directly in your web browser (Chrome, Firefox, or Edge recommended)
   - Simply double-click `index.html`
   - OR right-click → "Open with" → Choose your browser

3. **Start Training!**
   - The app will load chess.js from CDN
   - Stockfish will load for analysis
   - Begin playing as Black with the Philidor Defense

## Alternative: Run with Local Server

If you prefer to run with a local server:

### Option 1: Python (if installed)
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

### Option 2: Node.js (if installed)
```bash
npm install
npm start
```

### Option 3: PHP (if installed)
```bash
php -S localhost:3000
```

Then open `http://localhost:3000` in your browser.

## Features

- **Interactive Chess Board**: Click-to-move interface with visual feedback
- **Philidor Defense Focus**: Learn the main lines (Main, Hanham, Exchange, Larsen variations)
- **Stockfish Integration**: Real-time position analysis and best move suggestions
- **Training Feedback**: Instant feedback comparing your moves to opening theory
- **Move History**: Complete game notation tracking
- **Position Evaluation**: Live centipawn evaluation
- **Hint System**: Request Stockfish recommendations
- **Undo Functionality**: Take back moves to explore alternatives
- **Flip Board**: View from either side

## How to Play

1. **You play as Black** - The computer plays White
2. **Respond to 1.e4 with 1...e5**
3. **After 2.Nf3, play 2...d6** (The Philidor Defense!)
4. **Follow the main line**: 3.d4 Nf6 is the most common continuation
5. **Get feedback** on each move - green for correct, yellow for alternatives

## Philidor Defense Main Lines

### Main Line
```
1. e4 e5
2. Nf3 d6
3. d4 Nf6
```

### Hanham Variation
```
1. e4 e5
2. Nf3 d6
3. d4 Nd7
```

### Exchange Variation
```
1. e4 e5
2. Nf3 d6
3. d4 exd4
4. Nxd4 Nf6
```

### Larsen Variation
```
1. e4 e5
2. Nf3 d6
3. Bc4 Be7
```

## Strategic Ideas

**For Black:**
- Maintain pawn on e5 to control center
- Develop Nf6 to attack e4 and control d5
- Often play ...Nbd7 rather than ...Nc6
- Castle kingside for safety
- Prepare ...c6 or ...c5 for counterplay

**Key Principles:**
- Solid pawn structure
- Flexible piece placement
- Counter-attack opportunities
- Less theoretical than other defenses

## Keyboard Shortcuts

- **N**: New Game
- **F**: Flip Board
- **H**: Get Hint
- **U**: Undo Move

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (Not supported)

## Technologies

- **chess.js**: Chess move validation and game logic
- **Stockfish.js**: Chess engine (via Web Worker)
- **Pure JavaScript**: No frameworks
- **CSS Grid**: Responsive design

## Troubleshooting

**Board not loading?**
- Check browser console for errors
- Ensure internet connection (for CDN libraries)
- Try a different browser

**Stockfish not working?**
- Wait a few seconds for the engine to initialize
- Check that Web Workers are supported
- Analysis will still work without Stockfish

**Pieces not moving?**
- Make sure it's your turn (you play Black)
- Click the piece first, then the destination square
- Only legal moves are allowed

## Files

```
chesstrainer/
├── index.html       # Main HTML page
├── styles.css       # All styling
├── app.js           # Chess logic and UI
├── stockfish.js     # Stockfish wrapper
├── server.js        # Optional Node.js server
├── package.json     # Optional npm dependencies
└── README.md        # This file
```

## License

MIT License - Free to use and modify!

## Learn More About Philidor Defense

The Philidor Defense is named after François-André Danican Philidor (1726-1795), a French chess master and one of the strongest players of his era. The opening emphasizes:

- **Solid structure over immediate development**
- **Central pawn control with d6 and e5**
- **Flexibility in piece placement**
- **Long-term strategic understanding**

While less popular at top levels today, it remains a practical weapon for club players who prefer solid, less theoretical positions.

## Contributing

Feel free to fork, modify, and enhance! Some ideas:
- Add more opening variations
- Include puzzles and exercises
- Track user statistics
- Add opening quiz mode
- Support for other openings

Enjoy learning the Philidor Defense! 🎯♟️
