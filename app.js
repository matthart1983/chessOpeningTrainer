// Chess Training App with Stockfish Integration
class ChessTrainer {
    constructor() {
        this.game = null;
        this.stockfish = null;
        this.boardFlipped = false; // Will be set based on opening
        this.selectedSquare = null;
        this.validMoves = [];
        this.playerSide = 'black'; // Will be set based on opening
        this.stockfishReady = false;
        this.currentEvaluation = 0;
        this.bestMove = null;
        this.lastAnalyzedFen = null; // Store the FEN of the last analyzed position
        this.skillLevel = 20; // Default skill level
        this.waitingForEngine = false;
        this.engineCallback = null;
        this.currentBookMove = null; // Stores the next book move (e.g., {from: 'e2', to: 'e4'})
        this.bestMoveSquares = null; // Stores the best engine move (e.g., {from: 'e2', to: 'e4'})
        this.opponentResponseSquares = null; // Stores opponent's best response to engine move
        this.analyzingResponse = false; // Flag to track if we're analyzing opponent's response
        
        // Opening lines
        this.openingLines = {
            philidor: {
                name: 'Philidor Defense',
                playerSide: 'black',
                lines: {
                    main: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nf6', 'Nc3', 'Nbd7', 'Bc4', 'Be7', 'O-O', 'O-O', 'Qe2', 'c6', 'a4', 'Qc7', 'Rd1', 'h6', 'h3'],
                    hanham: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nd7', 'Bc4', 'c6', 'O-O', 'Be7', 'dxe5', 'dxe5', 'Ng5', 'Bxg5', 'Qh5', 'Qe7', 'Bxg5', 'Qxg5'],
                    exchange: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'exd4', 'Nxd4', 'Nf6', 'Nc3', 'Be7', 'Be2', 'O-O', 'O-O', 'c6', 'f4', 'Nbd7', 'Bf3', 'Nc5'],
                    larsen: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'Be7', 'd4', 'Nf6', 'dxe5', 'dxe5', 'Qxd8+', 'Bxd8', 'Nxe5', 'Be6', 'Bxe6', 'fxe6'],
                    antoshin: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nf6', 'Nc3', 'Nbd7', 'Bc4', 'Be7', 'O-O', 'O-O', 'Re1', 'c6', 'a4', 'a5', 'h3', 'Qc7'],
                    liondefense: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Nd7', 'Bc4', 'Ngf6', 'Ng5', 'd5', 'exd5', 'h6', 'Nf3', 'e4', 'Qe2', 'Bb4+'],
                },
                mainLine: 'main'
            },
            london: {
                name: 'London System',
                playerSide: 'white',
                lines: {
                    main: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'e6', 'Nf3', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'c5', 'c3', 'Nc6', 'Nbd2', 'Qe7', 'Ne5', 'Nd7', 'Nxd7', 'Bxd7'],
                    nf6first: ['d4', 'Nf6', 'Bf4', 'e6', 'e3', 'd5', 'Nf3', 'Bd6', 'Bg3', 'O-O', 'Bd3', 'c5', 'c3', 'Nc6', 'Nbd2', 'b6', 'Ne5'],
                    c5response: ['d4', 'd5', 'Bf4', 'c5', 'e3', 'Nc6', 'Nf3', 'Nf6', 'c3', 'Qb6', 'Qb3', 'c4', 'Qc2', 'Bf5', 'Qc1', 'e6', 'Nbd2'],
                    kingsindian: ['d4', 'Nf6', 'Bf4', 'g6', 'Nf3', 'Bg7', 'e3', 'O-O', 'Be2', 'd6', 'h3', 'Nbd7', 'O-O', 'Qe8', 'c4', 'e5'],
                    qgd: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6', 'Qb3', 'c4', 'Qc2', 'Bf5', 'Qb1', 'e6', 'Nbd2'],
                    grunfeld: ['d4', 'Nf6', 'Bf4', 'g6', 'Nf3', 'Bg7', 'e3', 'd5', 'Be2', 'O-O', 'O-O', 'c5', 'c3', 'Nc6', 'Nbd2', 'Qb6'],
                    benoni: ['d4', 'Nf6', 'Bf4', 'c5', 'e3', 'cxd4', 'exd4', 'd5', 'Nf3', 'Nc6', 'c3', 'Bg4', 'Nbd2', 'e6', 'Be2'],
                },
                mainLine: 'main'
            },
            italian: {
                name: 'Italian Game',
                playerSide: 'white',
                lines: {
                    main: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'O-O', 'Nbd2', 'a6', 'Bb3', 'Ba7', 'h3', 'Ne7', 'Re1', 'Ng6'],
                    giuoco_piano: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4', 'cxd4', 'Bb4+', 'Bd2', 'Bxd2+', 'Nbxd2', 'd5', 'exd5', 'Nxd5', 'O-O'],
                    evans_gambit: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bxb4', 'c3', 'Ba5', 'd4', 'exd4', 'O-O', 'dxc3', 'Qb3', 'Qf6', 'e5', 'Qg6', 'Nxc3'],
                    two_knights: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Na5', 'Bb5+', 'c6', 'dxc6', 'bxc6', 'Be2', 'h6', 'Nf3', 'e4', 'Ne5'],
                    classical: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4', 'cxd4', 'Bb4+', 'Nc3', 'Nxe4', 'O-O', 'Bxc3', 'bxc3', 'd5'],
                },
                mainLine: 'main'
            },
            ruylopez: {
                name: 'Ruy Lopez',
                playerSide: 'white',
                lines: {
                    closed: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'd4', 'Bg4', 'Be3', 'exd4'],
                    berlin: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Nxe4', 'd4', 'Nd6', 'Bxc6', 'dxc6', 'dxe5', 'Nf5', 'Qxd8+', 'Kxd8', 'Nc3', 'Ke8', 'h3'],
                    exchange: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Bxc6', 'dxc6', 'O-O', 'f6', 'd4', 'exd4', 'Nxd4', 'c5', 'Nb3', 'Qxd1', 'Rxd1', 'Bg4', 'f3', 'Be6'],
                    marshall: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'O-O', 'c3', 'd5', 'exd5', 'Nxd5', 'Nxe5', 'Nxe5', 'Rxe5'],
                    breyer: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3', 'Nb8', 'd4', 'Nbd7'],
                    chigorin: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3', 'Na5', 'Bc2', 'c5', 'd4'],
                },
                mainLine: 'closed'
            },
            scotch: {
                name: 'Scotch Opening',
                playerSide: 'white',
                lines: {
                    main: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6', 'Nxc6', 'bxc6', 'e5', 'Qe7', 'Qe2', 'Nd5', 'c4', 'Ba6', 'b3', 'g6', 'f4', 'Bg7'],
                    classical: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Bc5', 'Be3', 'Qf6', 'c3', 'Nge7', 'Bc4', 'Ne5', 'Be2', 'Qg6', 'O-O', 'd6', 'Kh1'],
                    mieses: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6', 'Nxc6', 'bxc6', 'e5', 'Qe7', 'Qe2', 'Nd5', 'c4', 'Nf4', 'Qe4', 'Ng6', 'Bd3'],
                    steinitz: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Qh4', 'Nc3', 'Bb4', 'Be2', 'Qxe4', 'Nb5', 'Bxc3+', 'bxc3', 'Kd8', 'O-O', 'a6'],
                    scotchgambit: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Bc4', 'Nf6', 'e5', 'd5', 'Bb5', 'Ne4', 'Nxd4', 'Bc5', 'Be3', 'Bd7', 'Bxc6', 'bxc6'],
                },
                mainLine: 'main'
            },
            kingsgambit: {
                name: "King's Gambit",
                playerSide: 'white',
                lines: {
                    accepted: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'h4', 'g4', 'Ne5', 'Nf6', 'Bc4', 'd5', 'exd5', 'Bd6', 'd4', 'Nh5', 'Nc3', 'Qe7'],
                    falkbeer: ['e4', 'e5', 'f4', 'd5', 'exd5', 'e4', 'd3', 'Nf6', 'Nd2', 'exd3', 'Bxd3', 'Nxd5', 'Ngf3', 'Bd6', 'Qe2+', 'Qe7', 'Qxe7+', 'Bxe7'],
                    declined: ['e4', 'e5', 'f4', 'Bc5', 'Nf3', 'd6', 'c3', 'Nf6', 'd4', 'exd4', 'cxd4', 'Bb4+', 'Bd2', 'Bxd2+', 'Nbxd2', 'Nxe4', 'Bd3', 'Nxd2', 'Qxd2'],
                    modern: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'd5', 'exd5', 'Nf6', 'Bb5+', 'c6', 'dxc6', 'Nxc6', 'd4', 'Bd6', 'O-O', 'O-O', 'Bxc6', 'bxc6'],
                    fischer: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'd6', 'd4', 'g5', 'h4', 'g4', 'Ng1', 'Bh6', 'Nc3', 'c6', 'Nge2', 'Qf6', 'Nf4'],
                },
                mainLine: 'accepted'
            },
            sicilian: {
                name: 'Sicilian Defense',
                playerSide: 'black',
                lines: {
                    najdorf: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be3', 'e5', 'Nb3', 'Be6', 'f3', 'Be7', 'Qd2', 'O-O', 'O-O-O'],
                    dragon: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'Bd7', 'O-O-O'],
                    sveshnikov: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'e5', 'Ndb5', 'd6', 'Bg5', 'a6', 'Na3', 'b5', 'Nd5', 'Be7'],
                    classical: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'Nc6', 'Be2', 'e5', 'Nb3', 'Be7', 'O-O', 'O-O', 'Be3', 'Be6'],
                    accelerated_dragon: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'g6', 'Nc3', 'Bg7', 'Be3', 'Nf6', 'Bc4', 'O-O', 'Bb3', 'd6'],
                },
                mainLine: 'najdorf'
            },
            french: {
                name: 'French Defense',
                playerSide: 'black',
                lines: {
                    winawer: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4', 'e5', 'c5', 'a3', 'Bxc3+', 'bxc3', 'Ne7', 'Qg4', 'O-O', 'Bd3', 'Nbc6', 'Qh5'],
                    classical: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e5', 'Nfd7', 'Bxe7', 'Qxe7', 'f4', 'O-O', 'Nf3', 'c5', 'Qd2'],
                    tarrasch: ['e4', 'e6', 'd4', 'd5', 'Nd2', 'Nf6', 'e5', 'Nfd7', 'Bd3', 'c5', 'c3', 'Nc6', 'Ne2', 'cxd4', 'cxd4', 'f6', 'exf6', 'Nxf6'],
                    advance: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6', 'a3', 'c4', 'Nbd2', 'Na5', 'Be2', 'Bd7', 'O-O'],
                },
                mainLine: 'winawer'
            },
            carokann: {
                name: 'Caro-Kann Defense',
                playerSide: 'black',
                lines: {
                    classical: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'h4', 'h6', 'Nf3', 'Nd7', 'h5', 'Bh7', 'Bd3', 'Bxd3', 'Qxd3'],
                    advance: ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5', 'Nf3', 'e6', 'Be2', 'Nd7', 'O-O', 'Ne7', 'Nbd2', 'h6', 'Nb3', 'Bg6', 'Nfd2'],
                    exchange: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5', 'Bd3', 'Nc6', 'c3', 'Nf6', 'Bf4', 'Bg4', 'Qb3', 'Na5', 'Qa4+', 'Bd7', 'Qc2'],
                    panov: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5', 'c4', 'Nf6', 'Nc3', 'Nc6', 'Bg5', 'e6', 'Nf3', 'Be7', 'c5', 'O-O', 'Bb5'],
                },
                mainLine: 'classical'
            },
            kingsindian: {
                name: "King's Indian Defense",
                playerSide: 'black',
                lines: {
                    classical: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5', 'O-O', 'Nc6', 'd5', 'Ne7', 'Ne1', 'Nd7', 'Be3'],
                    samisch: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'f3', 'O-O', 'Be3', 'e5', 'Nge2', 'c6', 'Qd2', 'Nbd7', 'Rd1'],
                    four_pawns: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'f4', 'O-O', 'Nf3', 'c5', 'd5', 'e6', 'Be2', 'exd5', 'cxd5'],
                    fianchetto: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'g3', 'O-O', 'Bg2', 'd6', 'Nf3', 'Nbd7', 'O-O', 'e5', 'e4', 'c6', 'h3'],
                },
                mainLine: 'classical'
            },
            grunfeld: {
                name: 'Grünfeld Defense',
                playerSide: 'black',
                lines: {
                    exchange: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'cxd5', 'Nxd5', 'e4', 'Nxc3', 'bxc3', 'Bg7', 'Nf3', 'c5', 'Rb1', 'O-O', 'Be2'],
                    russian: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'Nf3', 'Bg7', 'Qb3', 'dxc4', 'Qxc4', 'O-O', 'e4', 'Bg4', 'Be3', 'Nfd7', 'Qb3'],
                    classical: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'Nf3', 'Bg7', 'Qb3', 'dxc4', 'Qxc4', 'O-O', 'e4', 'Na6', 'Be2', 'c5', 'O-O'],
                },
                mainLine: 'exchange'
            },
            nimzoindian: {
                name: 'Nimzo-Indian Defense',
                playerSide: 'black',
                lines: {
                    classical: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'Qc2', 'O-O', 'a3', 'Bxc3+', 'Qxc3', 'b6', 'Bg5', 'Bb7', 'f3', 'd5', 'cxd5'],
                    rubinstein: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3', 'O-O', 'Bd3', 'd5', 'Nf3', 'c5', 'O-O', 'Nc6', 'a3', 'Bxc3', 'bxc3'],
                    samisch: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'a3', 'Bxc3+', 'bxc3', 'c5', 'f3', 'd5', 'cxd5', 'Nxd5', 'dxc5', 'f5', 'e4'],
                    leningrad: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'Bg5', 'h6', 'Bh4', 'c5', 'd5', 'b5', 'dxe6', 'fxe6', 'cxb5', 'd5', 'e3'],
                },
                mainLine: 'classical'
            },
            queensgambit: {
                name: "Queen's Gambit Declined",
                playerSide: 'black',
                lines: {
                    orthodox: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'Nbd7', 'Rc1', 'c6', 'Bd3', 'dxc4', 'Bxc4'],
                    tartakower: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'h6', 'Bh4', 'b6', 'cxd5', 'Nxd5', 'Bxe7', 'Qxe7'],
                    exchange: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5', 'Bg5', 'Be7', 'e3', 'c6', 'Bd3', 'Nbd7', 'Qc2', 'O-O', 'Nge2'],
                    cambridge_springs: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Nbd7', 'e3', 'c6', 'Nf3', 'Qa5', 'Nd2', 'Bb4', 'Qc2', 'O-O'],
                },
                mainLine: 'orthodox'
            },
            slav: {
                name: 'Slav Defense',
                playerSide: 'black',
                lines: {
                    main: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'dxc4', 'a4', 'Bf5', 'e3', 'e6', 'Bxc4', 'Bb4', 'O-O', 'O-O', 'Qe2'],
                    exchange: ['d4', 'd5', 'c4', 'c6', 'cxd5', 'cxd5', 'Nc3', 'Nf6', 'Nf3', 'Nc6', 'Bf4', 'Bf5', 'e3', 'e6', 'Bd3', 'Bxd3', 'Qxd3'],
                    semi_slav: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'e6', 'e3', 'Nbd7', 'Qc2', 'Bd6', 'Bd3', 'O-O', 'O-O', 'dxc4', 'Bxc4'],
                    chameleon: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'a6', 'c5', 'Nbd7', 'Bf4', 'Nh5', 'Bd2', 'Nhf6', 'Qc2', 'g6', 'e4'],
                },
                mainLine: 'main'
            },
            dutch: {
                name: 'Dutch Defense',
                playerSide: 'black',
                lines: {
                    leningrad: ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'g6', 'Nf3', 'Bg7', 'O-O', 'O-O', 'c4', 'd6', 'Nc3', 'Qe8', 'd5', 'Na6', 'Rb1'],
                    stonewall: ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'e6', 'Nf3', 'Be7', 'O-O', 'O-O', 'c4', 'd5', 'b3', 'c6', 'Ba3', 'Bxa3', 'Nxa3'],
                    classical: ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'e6', 'Nf3', 'Be7', 'O-O', 'O-O', 'c4', 'd6', 'Nc3', 'Qe8', 'Qc2', 'Qh5', 'b3'],
                },
                mainLine: 'leningrad'
            },
            benoni: {
                name: 'Benoni Defense',
                playerSide: 'black',
                lines: {
                    modern: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6', 'Nc3', 'exd5', 'cxd5', 'd6', 'e4', 'g6', 'Nf3', 'Bg7', 'Be2', 'O-O', 'O-O'],
                    fianchetto: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6', 'Nc3', 'exd5', 'cxd5', 'd6', 'Nf3', 'g6', 'g3', 'Bg7', 'Bg2', 'O-O', 'O-O'],
                    classical: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6', 'Nc3', 'exd5', 'cxd5', 'd6', 'e4', 'g6', 'Nf3', 'Bg7', 'Be2', 'O-O', 'O-O', 'Re8'],
                },
                mainLine: 'modern'
            },
            pirc: {
                name: 'Pirc Defense',
                playerSide: 'black',
                lines: {
                    austrian: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'f4', 'Bg7', 'Nf3', 'O-O', 'Bd3', 'Na6', 'O-O', 'c5', 'd5', 'Rb8', 'Qe1'],
                    classical: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'Nf3', 'Bg7', 'Be2', 'O-O', 'O-O', 'Bg4', 'Be3', 'Nc6', 'Qd2', 'e5', 'dxe5'],
                    sveshnikov: ['e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'g3', 'Bg7', 'Bg2', 'O-O', 'Nge2', 'c6', 'O-O', 'Qa5', 'h3', 'e5', 'Be3'],
                },
                mainLine: 'austrian'
            },
            alekhine: {
                name: "Alekhine's Defense",
                playerSide: 'black',
                lines: {
                    four_pawns: ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6', 'c4', 'Nb6', 'f4', 'dxe5', 'fxe5', 'Nc6', 'Be3', 'Bf5', 'Nc3', 'e6', 'Nf3'],
                    modern: ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6', 'Nf3', 'Bg4', 'Be2', 'e6', 'O-O', 'Be7', 'c4', 'Nb6', 'Nc3', 'O-O', 'Be3'],
                    exchange: ['e4', 'Nf6', 'e5', 'Nd5', 'd4', 'd6', 'c4', 'Nb6', 'exd6', 'cxd6', 'Nc3', 'g6', 'Be3', 'Bg7', 'Rc1', 'O-O', 'b3'],
                },
                mainLine: 'four_pawns'
            },
            scandinavian: {
                name: 'Scandinavian Defense',
                playerSide: 'black',
                lines: {
                    main: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6', 'Nf3', 'Bf5', 'Bc4', 'e6', 'Bd2', 'c6', 'Nd5', 'Qd8', 'Nxf6+', 'Qxf6'],
                    modern: ['e4', 'd5', 'exd5', 'Nf6', 'd4', 'Nxd5', 'Nf3', 'Bg4', 'Be2', 'e6', 'O-O', 'Be7', 'c4', 'Nb6', 'Nc3', 'O-O', 'Be3'],
                    portuguese: ['e4', 'd5', 'exd5', 'Nf6', 'd4', 'Bg4', 'f3', 'Bf5', 'Bb5+', 'Nbd7', 'c4', 'e6', 'Nc3', 'exd5', 'cxd5', 'Bd6'],
                },
                mainLine: 'main'
            },
            budapest: {
                name: 'Budapest Gambit',
                playerSide: 'black',
                lines: {
                    main: ['d4', 'Nf6', 'c4', 'e5', 'dxe5', 'Ng4', 'Bf4', 'Nc6', 'Nf3', 'Bb4+', 'Nbd2', 'Qe7', 'e3', 'Ngxe5', 'Nxe5', 'Nxe5', 'Be2'],
                    fajarowicz: ['d4', 'Nf6', 'c4', 'e5', 'dxe5', 'Ne4', 'Nf3', 'Bb4+', 'Nbd2', 'Nc6', 'a3', 'Bxd2+', 'Qxd2', 'Nc5', 'b4', 'Ne6'],
                    adler: ['d4', 'Nf6', 'c4', 'e5', 'dxe5', 'Ng4', 'Nf3', 'Bc5', 'e3', 'Nc6', 'Nc3', 'Ngxe5', 'Nxe5', 'Nxe5', 'Be2', 'O-O'],
                },
                mainLine: 'main'
            },
            benko: {
                name: 'Benko Gambit',
                playerSide: 'black',
                lines: {
                    accepted: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'b5', 'cxb5', 'a6', 'bxa6', 'g6', 'Nc3', 'Bxa6', 'e4', 'Bxf1', 'Kxf1', 'd6', 'Nf3', 'Bg7', 'g3'],
                    declined: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'b5', 'cxb5', 'a6', 'b6', 'e6', 'Nc3', 'exd5', 'Nxd5', 'Nxd5', 'Qxd5', 'Nc6', 'Qd1'],
                    fianchetto: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'b5', 'cxb5', 'a6', 'bxa6', 'g6', 'Nc3', 'Bxa6', 'Nf3', 'd6', 'g3', 'Bg7', 'Bg2', 'Nbd7'],
                },
                mainLine: 'accepted'
            },
            catalanopening: {
                name: 'Catalan Opening',
                playerSide: 'white',
                lines: {
                    open: ['d4', 'Nf6', 'c4', 'e6', 'g3', 'd5', 'Bg2', 'dxc4', 'Nf3', 'Nc6', 'Qa4', 'Bd7', 'Qxc4', 'Na5', 'Qd3', 'c5', 'O-O'],
                    closed: ['d4', 'Nf6', 'c4', 'e6', 'g3', 'd5', 'Bg2', 'Be7', 'Nf3', 'O-O', 'O-O', 'dxc4', 'Qc2', 'a6', 'Qxc4', 'b5', 'Qc2'],
                    classical: ['d4', 'Nf6', 'c4', 'e6', 'g3', 'd5', 'Bg2', 'Be7', 'Nf3', 'O-O', 'O-O', 'Nbd7', 'Qc2', 'c6', 'Nbd2', 'b6', 'e4'],
                },
                mainLine: 'open'
            },
            englishopening: {
                name: 'English Opening',
                playerSide: 'white',
                lines: {
                    symmetrical: ['c4', 'c5', 'Nc3', 'Nc6', 'g3', 'g6', 'Bg2', 'Bg7', 'Nf3', 'Nf6', 'O-O', 'O-O', 'd4', 'cxd4', 'Nxd4', 'Nxd4', 'Qxd4'],
                    reversed_sicilian: ['c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6', 'g3', 'd5', 'cxd5', 'Nxd5', 'Bg2', 'Nb6', 'O-O', 'Be7', 'd3', 'O-O'],
                    four_knights: ['c4', 'Nf6', 'Nc3', 'e5', 'Nf3', 'Nc6', 'g3', 'd5', 'cxd5', 'Nxd5', 'Bg2', 'Nb6', 'O-O', 'Be7', 'd3', 'O-O'],
                    hedgehog: ['c4', 'c5', 'Nf3', 'Nf6', 'g3', 'b6', 'Bg2', 'Bb7', 'O-O', 'e6', 'Nc3', 'Be7', 'd4', 'cxd4', 'Qxd4', 'd6'],
                },
                mainLine: 'symmetrical'
            },
            reti: {
                name: 'Réti Opening',
                playerSide: 'white',
                lines: {
                    main: ['Nf3', 'd5', 'g3', 'Nf6', 'Bg2', 'e6', 'O-O', 'Be7', 'd3', 'O-O', 'Nbd2', 'c5', 'e4', 'Nc6', 'c3', 'b6', 'Re1'],
                    kings_indian: ['Nf3', 'Nf6', 'g3', 'g6', 'b3', 'Bg7', 'Bb2', 'O-O', 'Bg2', 'd6', 'O-O', 'e5', 'd3', 'Nc6', 'Nbd2', 'h6'],
                    reversed_benoni: ['Nf3', 'Nf6', 'c4', 'c5', 'Nc3', 'e6', 'g3', 'b6', 'Bg2', 'Bb7', 'O-O', 'Be7', 'd4', 'cxd4', 'Qxd4'],
                },
                mainLine: 'main'
            }
        };
        
        // Opening descriptions
        this.openingDescriptions = {
            philidor: "A solid opening (1.e4 e5 2.Nf3 d6) that prioritizes a strong pawn center and flexible piece development. Named after François-André Danican Philidor, it emphasizes pawn structure over rapid piece activity. The Philidor is known for being solid but passive, often leading to cramped positions for Black. It's an excellent choice for positional players who prefer defensive setups with counterattacking opportunities.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐ (Easy to learn, solid structure)<br><strong>GM Strength:</strong> ⭐⭐ (Passive, limited winning chances)<br><strong>Famous Players:</strong> François-André Philidor, Bent Larsen, Étienne Bacrot",
            
            italian: "One of the oldest recorded chess openings (1.e4 e5 2.Nf3 Nc6 3.Bc4), originating from Italian chess studies in the 16th century. The Italian Game aims for rapid development and central control, targeting the f7 square. It leads to open, tactical positions with opportunities for both sides. Modern variations include the Giuoco Piano (\"Quiet Game\") and the aggressive Evans Gambit, offering diverse strategic plans from classical maneuvering to sharp tactical battles.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐⭐ (Clear development, easy principles)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐ (Solid and flexible, used at all levels)<br><strong>Famous Players:</strong> Anatoly Karpov, Viswanathan Anand, Magnus Carlsen, Fabiano Caruana",
            
            ruylopez: "Named after 16th-century Spanish priest Ruy López de Segura, this is one of the most popular and deeply analyzed chess openings (1.e4 e5 2.Nf3 Nc6 3.Bb5). The Ruy Lopez aims to pressure Black's center and create long-term positional advantages. It features numerous variations including the solid Closed Defense, the Berlin Wall (popularized by Kramnik), and the sharp Marshall Attack. The opening rewards deep preparation and strategic understanding.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Complex theory, strategic depth)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐⭐ (Most popular 1.e4 opening at top level)<br><strong>Famous Players:</strong> Bobby Fischer, Garry Kasparov, Vladimir Kramnik, Magnus Carlsen",
            
            scotch: "An aggressive opening (1.e4 e5 2.Nf3 Nc6 3.d4) that immediately challenges Black's central pawn. The Scotch leads to open positions with active piece play and tactical opportunities. Popular with players like Kasparov, it avoids the heavy theory of the Ruy Lopez while maintaining White's initiative. The opening often results in imbalanced positions where both sides have chances for active play, making it ideal for players who prefer direct confrontation.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐ (Clear plans, active play)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐ (Sound and aggressive, Kasparov's weapon)<br><strong>Famous Players:</strong> Garry Kasparov, Alexander Morozevich, Sergey Karjakin, Hikaru Nakamura",
            
            kingsgambit: "One of the oldest and most romantic openings (1.e4 e5 2.f4), dating back to the 16th century. The King's Gambit sacrifices material for rapid development and attacking chances against the enemy king. While modern defensive techniques have reduced its popularity at the highest level, it remains a dangerous weapon for aggressive players. The opening can lead to wild tactical positions where calculation and courage are rewarded.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Risky, requires tactical skill)<br><strong>GM Strength:</strong> ⭐⭐ (Unsound against best defense)<br><strong>Famous Players:</strong> Paul Morphy, Adolf Anderssen, Boris Spassky, David Bronstein",
            
            london: "A solid and reliable opening system (1.d4 followed by 2.Bf4 and 3.e3) that became popular at the London 1922 tournament. The London System is known for its straightforward development scheme and flexible pawn structure. It's popular at all levels because it leads to playable positions against virtually any Black setup, requires less memorization than sharp variations, and offers White a safe, positional game with long-term pressure.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐⭐ (Easy system, low theory)<br><strong>GM Strength:</strong> ⭐⭐⭐ (Solid but limited winning chances)<br><strong>Famous Players:</strong> Magnus Carlsen, Gata Kamsky, Levon Aronian, Vladimir Kramnik",
            
            queensgambit: "Despite its name, the Queen's Gambit (1.d4 d5 2.c4) is not a true gambit as Black cannot hold the pawn safely. It's one of the oldest and most respected openings, aiming for central control and piece development. The Queen's Gambit Declined is particularly solid, leading to rich positional battles. This opening rewards strategic understanding, proper piece placement, and long-term planning. It remains popular at all levels of chess.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐ (Solid principles, clear structure)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐⭐ (Classical and highly respected)<br><strong>Famous Players:</strong> José Raúl Capablanca, Mikhail Botvinnik, Anatoly Karpov, Viswanathan Anand",
            
            catalanopening: "A sophisticated opening (1.d4 Nf6 2.c4 e6 3.g3) combining ideas from the Queen's Gambit and the fianchetto of the light-squared bishop. Developed in the 1920s, the Catalan creates subtle pressure on Black's queenside. It's a favorite of world champions for its flexibility and long-term positional advantages. The opening often leads to complex strategic battles where understanding pawn structures and piece coordination is crucial.<br><br><strong>Beginner Strength:</strong> ⭐⭐ (Subtle plans, positional complexity)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐⭐ (World champions' favorite)<br><strong>Famous Players:</strong> Vladimir Kramnik, Viswanathan Anand, Magnus Carlsen, Ding Liren",
            
            englishopening: "A flexible opening (1.c4) named after Howard Staunton, who used it during the 1843 match in England. The English Opening transposes into many different pawn structures and can lead to reversed Sicilian or King's Indian formations. It's popular among positional players who prefer to dictate the game's character based on Black's response. The opening allows White to avoid main-line theory while maintaining flexibility.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Flexible but requires broad knowledge)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐ (Highly flexible, used frequently)<br><strong>Famous Players:</strong> Mikhail Botvinnik, Tigran Petrosian, Anatoly Karpov, Fabiano Caruana",
            
            reti: "A hypermodern opening (1.Nf3) named after Czech grandmaster Richard Réti, who revolutionized opening theory in the 1920s. The Réti Opening controls the center from a distance rather than occupying it with pawns. It's extremely flexible and can transpose into various openings including the English, King's Indian Attack, or Catalan. The Réti rewards players with broad opening knowledge and positional understanding.<br><br><strong>Beginner Strength:</strong> ⭐⭐ (Transpositional complexity)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐ (Flexible, avoids main lines)<br><strong>Famous Players:</strong> Richard Réti, David Bronstein, Bent Larsen, Maxime Vachier-Lagrave",
            
            sicilian: "The most popular defense to 1.e4 at all levels (1.e4 c5), creating immediate imbalance and fighting for the initiative. The Sicilian Defense leads to asymmetrical positions where Black has excellent winning chances. With numerous variations like the Najdorf, Dragon, and Sveshnikov, it offers rich tactical and strategic possibilities. The Sicilian is the weapon of choice for players seeking complex positions and counterattacking opportunities.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Complex, sharp positions)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐⭐ (Most popular defense to 1.e4)<br><strong>Famous Players:</strong> Bobby Fischer, Garry Kasparov, Viswanathan Anand, Magnus Carlsen",
            
            french: "A solid defensive system (1.e4 e6) that leads to strategic, closed positions. The French Defense creates a rigid pawn structure where both sides have clear plans. Black often gets a space disadvantage but gains counterplay on the queenside and center. It's favored by positional players who understand pawn structures and strategic maneuvering. The French has been employed by world champions and remains popular at all levels.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐ (Clear structure, solid plans)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐ (Reliable and strategically rich)<br><strong>Famous Players:</strong> Mikhail Botvinnik, Viktor Korchnoi, Wolfgang Uhlmann, Evgeny Bareev",
            
            carokann: "A reliable defense (1.e4 c6) known for its solidity and fewer tactical complications compared to the Sicilian. The Caro-Kann leads to positions where Black maintains a solid structure and often equalizes comfortably. It's popular among players who want to avoid sharp tactical battles while maintaining winning chances. The opening has been trusted by world champions and is considered one of Black's most dependable responses to 1.e4.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐⭐ (Solid, safe, easy to learn)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐ (Reliable equalizer)<br><strong>Famous Players:</strong> Anatoly Karpov, Mikhail Tal, Ulf Andersson, Fabiano Caruana",
            
            kingsindian: "A dynamic and aggressive defense (1.d4 Nf6 2.c4 g6 3.Nc3 Bg7) where Black allows White a large pawn center, planning to undermine and attack it later. The King's Indian Defense leads to opposite-side castling and fierce attacking races. It's a favorite of aggressive players and has been employed by world champions like Fischer, Kasparov, and Radjabov. The opening requires precise calculation and attacking intuition.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Complex attacking plans)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐⭐ (Sharp and double-edged)<br><strong>Famous Players:</strong> Bobby Fischer, Garry Kasparov, David Bronstein, Teimour Radjabov",
            
            grunfeld: "A hypermodern defense (1.d4 Nf6 2.c4 g6 3.Nc3 d5) that immediately challenges White's center. Named after Austrian grandmaster Ernst Grünfeld, it leads to sharp, double-edged positions where Black often sacrifices the center for piece activity. The Grünfeld requires precise play and tactical awareness. It's been a weapon of world champions like Fischer, Kasparov, and many modern elite players.<br><br><strong>Beginner Strength:</strong> ⭐⭐ (Tactical complexity, theory-heavy)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐⭐ (Top-level favorite)<br><strong>Famous Players:</strong> Bobby Fischer, Garry Kasparov, Vasily Smyslov, Peter Svidler",
            
            nimzoindian: "A sophisticated defense (1.d4 Nf6 2.c4 e6 3.Nc3 Bb4) named after Aron Nimzowitsch, a pioneer of hypermodern chess theory. The Nimzo-Indian pins White's knight and exerts pressure on e4, often leading to strategic battles over central control. It's one of Black's most reliable defenses against 1.d4, offering rich positional play. The opening rewards strategic understanding and has been employed by virtually every world champion.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Strategic complexity)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐⭐ (Universal defense)<br><strong>Famous Players:</strong> Tigran Petrosian, Anatoly Karpov, Garry Kasparov, Vladimir Kramnik",
            
            slav: "A solid defense (1.d4 d5 2.c4 c6) that supports the d5 pawn while keeping the light-squared bishop active. The Slav Defense offers Black a reliable path to equality with fewer structural weaknesses than the Queen's Gambit Declined. It's popular at all levels for its soundness and strategic clarity. The Slav has many variations ranging from quiet positional play to sharp tactical battles.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐ (Solid and clear)<br><strong>GM Strength:</strong> ⭐⭐⭐⭐ (Reliable and sound)<br><strong>Famous Players:</strong> Vladimir Kramnik, Viswanathan Anand, Peter Leko, Levon Aronian",
            
            dutch: "An aggressive defense (1.d4 f5) that immediately stakes a claim to the e4 square and prepares kingside expansion. The Dutch Defense leads to unbalanced positions where Black seeks attacking chances on the kingside while White often targets the weakened king position. It's favored by players seeking complex, fighting positions. The opening requires careful handling but rewards aggressive, attacking play.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Weakening, risky structure)<br><strong>GM Strength:</strong> ⭐⭐⭐ (Sharp but committal)<br><strong>Famous Players:</strong> Mikhail Botvinnik, Bent Larsen, Simon Williams, Hikaru Nakamura",
            
            benoni: "A sharp, counterattacking defense (1.d4 Nf6 2.c4 c5) that creates immediate tension and asymmetrical pawn structures. The Benoni Defense leads to positions where both sides attack on opposite flanks. Black accepts a cramped position for active piece play and queenside counterplay. It's popular among aggressive players who enjoy complex, tactical positions. The Modern Benoni remains a fighting weapon at all levels.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Complex pawn structures)<br><strong>GM Strength:</strong> ⭐⭐⭐ (Fighting but challenging)<br><strong>Famous Players:</strong> Mikhail Tal, Garry Kasparov, Veselin Topalov, Vugar Gashimov",
            
            budapest: "An aggressive gambit (1.d4 Nf6 2.c4 e5) where Black immediately sacrifices a pawn for rapid development and attacking chances. The Budapest Gambit is relatively rare at the highest level but can be a dangerous surprise weapon. It leads to sharp tactical positions where Black gets active piece play and attacking opportunities if White is unprepared. The gambit requires accurate play from both sides.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐ (Active play, surprise weapon)<br><strong>GM Strength:</strong> ⭐⭐ (Unsound with best play)<br><strong>Famous Players:</strong> Rudolf Spielmann, Savielly Tartakower, Baadur Jobava (occasional use)",
            
            benko: "A positional pawn sacrifice (1.d4 Nf6 2.c4 c5 3.d5 b5) where Black gives up the b-pawn for long-term queenside pressure and open files. The Benko Gambit (also called Volga Gambit) offers Black excellent compensation through active piece play and strategic pressure. It's popular among players who understand positional compensation and enjoy strategic maneuvering. The Benko can lead to long, complex strategic battles.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Positional understanding needed)<br><strong>GM Strength:</strong> ⭐⭐⭐ (Interesting but limited)<br><strong>Famous Players:</strong> Pal Benko, Veselin Topalov, Boris Gelfand, Michael Adams",
            
            pirc: "A flexible, hypermodern defense (1.e4 d6 2.d4 Nf6 3.Nc3 g6) where Black allows White to establish a pawn center before counterattacking. The Pirc Defense often transposes into similar positions as the King's Indian Defense. It's known for its flexibility and ability to create complex, asymmetrical positions. The opening rewards players who understand pawn breaks and tactical opportunities in closed positions.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐ (Flexible but passive early)<br><strong>GM Strength:</strong> ⭐⭐⭐ (Solid sideline)<br><strong>Famous Players:</strong> Vasja Pirc, Anatoly Karpov, Zurab Azmaiparashvili, Gata Kamsky",
            
            alekhine: "A provocative defense (1.e4 Nf6) named after world champion Alexander Alekhine, where Black's knight invites White's pawns forward. Alekhine's Defense leads to positions where Black aims to demonstrate that White's extended pawn center is a target rather than a strength. It's a sharp, complex opening that requires precise play. The Alekhine is favored by players seeking unbalanced positions with mutual chances.<br><br><strong>Beginner Strength:</strong> ⭐⭐ (Risky, counterintuitive)<br><strong>GM Strength:</strong> ⭐⭐⭐ (Sharp surprise weapon)<br><strong>Famous Players:</strong> Alexander Alekhine, Levon Aronian, Alexei Shirov, Michael Adams",
            
            scandinavian: "One of the oldest recorded openings (1.e4 d5), immediately challenging White's central pawn. The Scandinavian Defense leads to early queen development after 2.exd5 Qxd5, giving White a small lead in development. However, Black gets a solid position with clear development plans. It's popular at club level for its straightforward ideas and reduced theoretical burden. The Scandinavian offers Black a reliable path to playable positions.<br><br><strong>Beginner Strength:</strong> ⭐⭐⭐⭐ (Simple, straightforward)<br><strong>GM Strength:</strong> ⭐⭐ (Passive, limited potential)<br><strong>Famous Players:</strong> Matthias Wahls, Sergey Tiviakov, Jonny Hector, Julio Granda Zuniga"
        };
        
        this.currentOpening = 'philidor';
        this.currentLine = 'main';
        this.moveHistory = [];
        
        this.init();
    }
    
    async init() {
        // Wait a moment for chess.js to load
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Initialize chess.js
        if (typeof Chess === 'undefined') {
            console.error('Chess.js not loaded!');
            alert('Chess library failed to load. Please check your internet connection and refresh.');
            return;
        }
        
        try {
            this.game = new Chess();
            console.log('Chess.js initialized:', this.game);
        } catch (e) {
            console.error('Failed to create Chess instance:', e);
            alert('Failed to initialize chess engine');
            return;
        }
        
        // Initialize Stockfish
        this.initStockfish();
        
        // Apply default styles
        this.setBoardStyle('blue');
        this.setPieceStyle('modern');
        
        // Draw initial board
        this.drawBoard();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Set initial opening
        this.setOpening(this.currentOpening);
        
        // Update UI
        this.updateUI();
    }
    
    initStockfish() {
        try {
            // Initialize Stockfish engine
            if (typeof STOCKFISH === 'function') {
                this.stockfish = STOCKFISH();
                console.log('Stockfish worker created');
            } else {
                console.log('Stockfish not available');
                this.stockfishReady = true;
                return;
            }
            
            this.stockfish.onmessage = (event) => {
                const message = event.data ? event.data : event;
                this.handleStockfishMessage(message);
            };
            
            this.stockfish.onerror = (error) => {
                console.error('Stockfish worker error:', error);
            };
            
            // Initialize engine with UCI protocol
            this.stockfish.postMessage('uci');
            
        } catch (error) {
            console.error('Error initializing Stockfish:', error);
            this.stockfishReady = true; // Continue without Stockfish
        }
    }
    
    handleStockfishMessage(message) {
        // Convert message to string if it's not already
        const msg = typeof message === 'string' ? message : String(message);
        console.log('Stockfish:', msg);
        
        if (msg === 'uciok') {
            console.log('UCI protocol initialized');
            // Configure Stockfish
            if (this.skillLevel < 25) {
                // Use strength limiting for levels 1-20
                this.stockfish.postMessage('setoption name UCI_LimitStrength value true');
                this.stockfish.postMessage(`setoption name UCI_Elo value ${this.getEloForSkillLevel(this.skillLevel)}`);
            } else {
                // Level 25: Full strength, no limiting
                this.stockfish.postMessage('setoption name UCI_LimitStrength value false');
            }
            this.stockfish.postMessage('isready');
        } else if (msg === 'readyok') {
            this.stockfishReady = true;
            console.log('Stockfish is ready at skill level', this.skillLevel);
        } else if (msg.includes('bestmove')) {
            const match = msg.match(/bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
            if (match) {
                const moveStr = match[1];
                console.log('Best move received:', moveStr, 'waitingForEngine:', this.waitingForEngine, 'analyzingResponse:', this.analyzingResponse);
                
                // If we were analyzing opponent's response
                if (this.analyzingResponse) {
                    console.log('Setting opponent response squares:', moveStr);
                    this.analyzingResponse = false;
                    this.opponentResponseSquares = {
                        from: moveStr.substring(0, 2),
                        to: moveStr.substring(2, 4)
                    };
                    this.drawBoard(); // Redraw to show opponent response indicator
                } else {
                    // This is the main best move
                    this.bestMove = moveStr;
                    console.log('Setting best move for player recommendation:', moveStr);
                    
                    // Parse the best move squares for highlighting
                    this.bestMoveSquares = {
                        from: moveStr.substring(0, 2),
                        to: moveStr.substring(2, 4)
                    };
                    
                    // Clear opponent response squares when showing player recommendation
                    this.opponentResponseSquares = null;
                    
                    this.updateBestMoveUI();
                    this.drawBoard(); // Redraw to show engine move indicator
                    
                    // If we're waiting for the engine, call the callback
                    if (this.waitingForEngine && this.engineCallback) {
                        console.log('Computer will play move:', moveStr);
                        this.waitingForEngine = false;
                        const callback = this.engineCallback;
                        this.engineCallback = null;
                        callback(this.bestMove);
                    }
                }
            }
        } else if (msg.includes('info') && msg.includes('score')) {
            this.parseEvaluation(msg);
        }
    }
    
    getEloForSkillLevel(level) {
        // Map skill levels to ELO
        const eloMap = {
            1: 800,
            3: 1000,
            5: 1300,
            10: 1700,
            15: 2100,
            20: 2500,
            25: 3500  // Maximum strength (not actually limited by ELO)
        };
        return eloMap[level] || 1500;
    }
    
    parseEvaluation(message) {
        // Convert to string if needed
        const msg = typeof message === 'string' ? message : String(message);
        
        // Parse centipawn evaluation
        const cpMatch = msg.match(/score cp (-?\d+)/);
        if (cpMatch) {
            this.currentEvaluation = parseInt(cpMatch[1]) / 100;
            this.updateEvaluationUI();
        }
        
        // Parse mate score
        const mateMatch = msg.match(/score mate (-?\d+)/);
        if (mateMatch) {
            const mateIn = parseInt(mateMatch[1]);
            this.currentEvaluation = mateIn > 0 ? 999 : -999;
            this.updateEvaluationUI();
        }
        
        // Parse depth
        const depthMatch = msg.match(/depth (\d+)/);
        if (depthMatch) {
            document.getElementById('depth').textContent = depthMatch[1];
        }
    }
    
    analyzePosition() {
        if (!this.stockfishReady || !this.stockfish) {
            console.log('Stockfish not ready, skipping analysis');
            return;
        }
        
        const fen = this.game.fen();
        this.lastAnalyzedFen = fen; // Cache the position being analyzed
        console.log('Analyzing position:', fen);
        this.stockfish.postMessage(`position fen ${fen}`);
        
        // Adjust search depth and time based on skill level
        // Higher skill = deeper search and more time
        const depth = Math.max(10, Math.min(22, Math.floor(this.skillLevel) + 2));
        const time = Math.max(1000, this.skillLevel * 200); // Time in milliseconds (1000ms to 5000ms)
        
        console.log(`Requesting analysis: depth ${depth}, time ${time}ms, skill level ${this.skillLevel}`);
        this.stockfish.postMessage(`go depth ${depth} movetime ${time}`);
    }
    
    analyzeOpponentResponse(bestMove) {
        if (!this.stockfishReady || !this.stockfish) return;
        
        // Don't analyze response if it's the player's turn (we want to analyze computer's moves)
        const currentTurn = this.game.turn();
        const analyzeThis = (this.playerSide === 'white' && currentTurn === 'b') || 
                           (this.playerSide === 'black' && currentTurn === 'w');
        
        if (!analyzeThis) {
            // Only analyze opponent's response when it's the opponent's move
            return;
        }
        
        // Create a temporary game to analyze the position after the best move
        const tempGame = new Chess(this.game.fen());
        
        // Try to make the best move in UCI format
        const from = bestMove.substring(0, 2);
        const to = bestMove.substring(2, 4);
        const promotion = bestMove.length > 4 ? bestMove[4] : undefined;
        
        try {
            // Verify the move is legal before analyzing
            const move = tempGame.move({ from, to, promotion });
            
            if (!move) {
                console.error('Illegal move for opponent response analysis:', bestMove);
                this.analyzingResponse = false;
                return;
            }
            
            // Now analyze the opponent's best response
            const newFen = tempGame.fen();
            this.analyzingResponse = true;
            
            this.stockfish.postMessage(`position fen ${newFen}`);
            
            // Quick analysis for opponent's response (shorter time)
            const depth = Math.max(8, Math.min(18, Math.floor(this.skillLevel)));
            const time = Math.max(500, this.skillLevel * 100);
            
            this.stockfish.postMessage(`go depth ${depth} movetime ${time}`);
        } catch (e) {
            console.error('Error analyzing opponent response:', e);
            this.analyzingResponse = false;
        }
    }
    
    drawBoard() {
        const board = document.getElementById('chessboard');
        board.innerHTML = '';
        
        const squares = this.game.board();
        
        // Draw from top to bottom (row 0 = top of screen, row 7 = bottom of screen)
        for (let screenRow = 0; screenRow < 8; screenRow++) {
            for (let screenCol = 0; screenCol < 8; screenCol++) {
                // When boardFlipped = true (Black at bottom):
                // - screenRow 0 (top) should show rank 1 (white pieces)
                // - screenRow 7 (bottom) should show rank 8 (black pieces)
                // - screenCol 0 (left) should show file h
                // - screenCol 7 (right) should show file a
                
                // When boardFlipped = false (White at bottom):
                // - screenRow 0 (top) should show rank 8 (black pieces)
                // - screenRow 7 (bottom) should show rank 1 (white pieces)
                // - screenCol 0 (left) should show file a
                // - screenCol 7 (right) should show file h
                
                let file, rank;
                
                if (this.boardFlipped) {
                    // Black at bottom
                    rank = screenRow + 1; // screenRow 0 -> rank 1, screenRow 7 -> rank 8
                    file = String.fromCharCode(104 - screenCol); // screenCol 0 -> 'h', screenCol 7 -> 'a'
                } else {
                    // White at bottom
                    rank = 8 - screenRow; // screenRow 0 -> rank 8, screenRow 7 -> rank 1
                    file = String.fromCharCode(97 + screenCol); // screenCol 0 -> 'a', screenCol 7 -> 'h'
                }
                
                const squareName = file + rank;
                const square = this.game.get(squareName);
                const squareElement = document.createElement('div');
                
                squareElement.className = 'square ' + ((screenRow + screenCol) % 2 === 0 ? 'light' : 'dark');
                squareElement.dataset.square = squareName;
                
                if (square) {
                    squareElement.textContent = this.getPieceSymbol(square);
                }
                
                // Highlight book move squares with green indicator
                if (this.currentBookMove) {
                    // Highlight the destination square
                    if (squareName === this.currentBookMove.to) {
                        squareElement.classList.add('book-move-to');
                        if (square) {
                            squareElement.classList.add('has-piece');
                        }
                    }
                    // Highlight the source square (piece to move)
                    if (squareName === this.currentBookMove.from) {
                        squareElement.classList.add('book-move-from');
                    }
                }
                
                // Highlight engine best move with blue indicator (only when it's player's turn)
                const currentTurn = this.game.turn();
                const isPlayerTurn = (this.playerSide === 'white' && currentTurn === 'w') || 
                                    (this.playerSide === 'black' && currentTurn === 'b');
                
                if (this.bestMoveSquares && isPlayerTurn) {
                    // Highlight the destination square
                    if (squareName === this.bestMoveSquares.to) {
                        squareElement.classList.add('engine-move-to');
                        if (square) {
                            squareElement.classList.add('has-piece-engine');
                        }
                    }
                    // Highlight the source square (piece to move)
                    if (squareName === this.bestMoveSquares.from) {
                        squareElement.classList.add('engine-move-from');
                    }
                }
                
                // Highlight opponent's best response with red indicator (only when it's computer's turn)
                if (this.opponentResponseSquares && !isPlayerTurn) {
                    // Highlight the destination square
                    if (squareName === this.opponentResponseSquares.to) {
                        squareElement.classList.add('opponent-response-to');
                        if (square) {
                            squareElement.classList.add('has-piece-opponent');
                        }
                    }
                    // Highlight the source square (piece to move)
                    if (squareName === this.opponentResponseSquares.from) {
                        squareElement.classList.add('opponent-response-from');
                    }
                }
                
                // Add coordinate labels on bottom-left square of each file and rank
                if (screenRow === 7) {
                    // Add file label (a-h) at bottom of each column
                    const fileLabel = document.createElement('span');
                    fileLabel.className = 'coordinate-label file-label';
                    fileLabel.textContent = file;
                    squareElement.appendChild(fileLabel);
                }
                
                if (screenCol === 0) {
                    // Add rank label (1-8) at left of each row
                    const rankLabel = document.createElement('span');
                    rankLabel.className = 'coordinate-label rank-label';
                    rankLabel.textContent = rank;
                    squareElement.appendChild(rankLabel);
                }
                
                squareElement.addEventListener('click', () => this.onSquareClick(squareName));
                board.appendChild(squareElement);
            }
        }
        
        this.highlightValidMoves();
    }
    
    getPieceSymbol(piece) {
        const symbols = {
            'wp': '♙', 'wn': '♘', 'wb': '♗', 'wr': '♖', 'wq': '♕', 'wk': '♔',
            'bp': '♟', 'bn': '♞', 'bb': '♝', 'br': '♜', 'bq': '♛', 'bk': '♚'
        };
        return symbols[piece.color + piece.type] || '';
    }
    
    onSquareClick(square) {
        console.log('=== CLICK ===');
        console.log('Clicked square:', square);
        console.log('Turn:', this.game.turn());
        console.log('Player side:', this.playerSide);
        console.log('Board position:', this.game.fen());
        
        // Only allow player moves on their turn
        if ((this.game.turn() === 'w' && this.playerSide === 'black') ||
            (this.game.turn() === 'b' && this.playerSide === 'white')) {
            console.log('Not player turn, blocking move');
            return;
        }
        
        if (this.selectedSquare === null) {
            // Select a piece
            const piece = this.game.get(square);
            console.log('Piece at', square, ':', piece);
            console.log('Expected color:', this.game.turn());
            
            if (piece && piece.color === this.game.turn()) {
                this.selectedSquare = square;
                this.validMoves = this.game.moves({ square: square, verbose: true });
                console.log('Selected! Valid moves:', this.validMoves);
                this.highlightValidMoves();
            } else {
                console.log('Cannot select - wrong piece or empty square');
            }
        } else {
            // Try to make a move
            const move = this.validMoves.find(m => m.to === square);
            
            if (move) {
                // Check if this is a pawn promotion
                if (move.promotion) {
                    this.showPromotionDialog(move);
                } else {
                    this.makeMove(move, true); // true = player move
                    this.selectedSquare = null;
                    this.validMoves = [];
                    this.drawBoard();
                }
            } else {
                // Select a different piece
                const piece = this.game.get(square);
                if (piece && piece.color === this.game.turn()) {
                    this.selectedSquare = square;
                    this.validMoves = this.game.moves({ square: square, verbose: true });
                    this.highlightValidMoves();
                } else {
                    this.selectedSquare = null;
                    this.validMoves = [];
                    this.drawBoard();
                }
            }
        }
    }
    
    highlightValidMoves() {
        // Clear previous highlights
        document.querySelectorAll('.square').forEach(sq => {
            sq.classList.remove('selected', 'valid-move', 'capture');
        });
        
        // Highlight selected square
        if (this.selectedSquare) {
            const selectedElement = document.querySelector(`[data-square="${this.selectedSquare}"]`);
            if (selectedElement) {
                selectedElement.classList.add('selected');
            }
        }
        
        // Highlight valid moves
        this.validMoves.forEach(move => {
            const element = document.querySelector(`[data-square="${move.to}"]`);
            if (element) {
                element.classList.add('valid-move');
                if (move.captured) {
                    element.classList.add('capture');
                }
            }
        });
    }
    
    makeMove(move, isPlayerMove = false) {
        const result = this.game.move(move);
        if (result) {
            // Animate the move
            this.animateMove(result.from, result.to, () => {
                this.moveHistory.push(result.san);
                this.updateUI();
                
                // Only analyze position for player recommendations on player's turn
                const currentTurn = this.game.turn();
                const isPlayerTurn = (this.playerSide === 'white' && currentTurn === 'w') || 
                                    (this.playerSide === 'black' && currentTurn === 'b');
                
                if (isPlayerTurn) {
                    // Analyze position to show player recommendations
                    this.analyzePosition();
                }
                
                // Only check player move feedback for actual player moves
                if (isPlayerMove) {
                    this.checkPlayerMove(result);
                } else {
                    // This is a computer move, analyze opponent's response (what the player should do next)
                    const moveStr = result.from + result.to + (result.promotion || '');
                    this.analyzeOpponentResponse(moveStr);
                }
                
                this.drawBoard();
                
                // If game is not over and it's computer's turn, make computer move
                const gameOver = this.game.isGameOver ? this.game.isGameOver() : this.game.game_over();
                if (!gameOver && this.game.turn() !== this.playerSide.charAt(0)) {
                    setTimeout(() => this.makeComputerMove(), 300);
                }
            });
        }
        return result;
    }
    
    animateMove(from, to, callback) {
        const fromSquare = document.querySelector(`[data-square="${from}"]`);
        const toSquare = document.querySelector(`[data-square="${to}"]`);
        
        if (!fromSquare || !toSquare) {
            callback();
            return;
        }
        
        // Get the piece being moved (only the first character, which is the piece symbol)
        const pieceSymbols = ['♙', '♘', '♗', '♖', '♕', '♔', '♟', '♞', '♝', '♜', '♛', '♚'];
        let piece = '';
        for (let symbol of pieceSymbols) {
            if (fromSquare.textContent.includes(symbol)) {
                piece = symbol;
                break;
            }
        }
        
        if (!piece) {
            callback();
            return;
        }
        
        // Create animated piece element
        const animatedPiece = document.createElement('div');
        animatedPiece.className = 'animated-piece';
        animatedPiece.textContent = piece;
        
        // Get positions
        const fromRect = fromSquare.getBoundingClientRect();
        const toRect = toSquare.getBoundingClientRect();
        
        // Set initial position
        animatedPiece.style.left = fromRect.left + 'px';
        animatedPiece.style.top = fromRect.top + 'px';
        animatedPiece.style.width = fromRect.width + 'px';
        animatedPiece.style.height = fromRect.height + 'px';
        
        document.body.appendChild(animatedPiece);
        
        // Temporarily hide the piece on the board (redraw without it)
        fromSquare.style.opacity = '0.3';
        
        // Animate to destination
        requestAnimationFrame(() => {
            animatedPiece.style.left = toRect.left + 'px';
            animatedPiece.style.top = toRect.top + 'px';
        });
        
        // Clean up after animation
        setTimeout(() => {
            if (document.body.contains(animatedPiece)) {
                document.body.removeChild(animatedPiece);
            }
            fromSquare.style.opacity = '1';
            callback();
        }, 250);
    }
    
    checkPlayerMove(move) {
        const moveNumber = Math.floor(this.moveHistory.length / 2);
        const isBlackMove = this.moveHistory.length % 2 === 0;
        
        // Check if we're still in the opening phase
        const opening = this.openingLines[this.currentOpening];
        const expectedMoves = opening.lines[this.currentLine];
        const maxBookMoves = expectedMoves.length;
        
        if (this.moveHistory.length <= maxBookMoves) {
            const expectedMove = expectedMoves[this.moveHistory.length - 1];
            
            // Check if move matches expected move (compare both SAN and UCI notation)
            const moveSan = move.san;
            const moveUci = move.from + move.to + (move.promotion || '');
            const expectedUci = expectedMove ? expectedMove.toLowerCase() : '';
            
            const isCorrectMove = expectedMove && (
                moveSan === expectedMove || 
                moveUci === expectedUci ||
                moveSan.replace(/[+#]/, '') === expectedMove  // Remove check/checkmate symbols
            );
            
            if (isCorrectMove) {
                this.showFeedback(`✓ Excellent! That's the main line of the ${opening.name}.`, 'success');
            } else if (expectedMove) {
                // Check if it's a reasonable alternative
                const isReasonable = this.isReasonablePhilidorMove(move);
                if (isReasonable) {
                    this.showFeedback('This is a playable alternative, but ' + expectedMove + ' is the main line.', 'info');
                } else {
                    this.showFeedback(`That move deviates from the ${opening.name} principles. Consider ${expectedMove} instead.`, 'warning');
                }
            } else {
                // No expected move in book for this position
                this.showFeedback(`Developing move. Keep following ${opening.name} principles!`, 'info');
            }
        } else {
            this.showFeedback('You\'re out of the opening book. Continue developing your pieces!', 'info');
        }
    }
    
    isReasonablePhilidorMove(move) {
        // Basic checks for reasonable opening moves
        if (this.currentOpening === 'philidor') {
            const developmentMoves = ['Nf6', 'Nd7', 'Be7', 'Nbd7', 'O-O', 'c6', 'Qe7'];
            return developmentMoves.includes(move.san);
        } else if (this.currentOpening === 'london') {
            const developmentMoves = ['d4', 'Bf4', 'e3', 'Nf3', 'Bd3', 'Nbd2', 'O-O', 'c3'];
            return developmentMoves.includes(move.san);
        }
        return false;
    }
    
    makeComputerMove() {
        console.log('=== makeComputerMove called ===');
        const gameOver = this.game.isGameOver ? this.game.isGameOver() : this.game.game_over();
        if (gameOver) {
            console.log('Game is over, not making move');
            return;
        }
        
        const moveNumber = Math.floor(this.moveHistory.length / 2);
        console.log('Move number:', moveNumber, 'Move history length:', this.moveHistory.length);
        
        // For lower skill levels, sometimes deviate from book moves
        const shouldUseBook = this.skillLevel >= 15 || Math.random() > (20 - this.skillLevel) / 30;
        
        // Get max book moves for current line
        const opening = this.openingLines[this.currentOpening];
        const expectedMoves = opening.lines[this.currentLine];
        const maxBookMoves = expectedMoves.length;
        
        // Play from the opening book (if high skill or lucky)
        if (this.moveHistory.length < maxBookMoves && shouldUseBook) {
            const bookMove = expectedMoves[this.moveHistory.length];
            
            if (bookMove) {
                const moves = this.game.moves({ verbose: true });
                const move = moves.find(m => 
                    m.san === bookMove || 
                    m.from + m.to === bookMove.toLowerCase() ||
                    m.san.replace(/[+#]/, '') === bookMove
                );
                
                if (move) {
                    setTimeout(() => {
                        this.makeMove(move);
                        this.drawBoard();
                    }, 300);
                    return;
                }
            }
        }
        
        // Use Stockfish to get best move
        if (this.stockfishReady && this.stockfish) {
            this.waitingForEngine = true;
            
            // Set up callback for when engine responds
            this.engineCallback = (bestMove) => {
                const moves = this.game.moves({ verbose: true });
                const move = moves.find(m => 
                    m.from + m.to === bestMove.substring(0, 4)
                );
                
                if (move) {
                    setTimeout(() => {
                        this.makeMove(move);
                        this.drawBoard();
                    }, 300);
                } else {
                    console.error('Could not find move:', bestMove);
                    this.makeRandomMove();
                }
            };
            
            // Request analysis
            this.analyzePosition();
            
            // Timeout fallback (in case engine doesn't respond)
            // Extended timeout: 20 seconds for slower engines
            setTimeout(() => {
                if (this.waitingForEngine) {
                    console.warn('Engine timeout after 20 seconds');
                    this.waitingForEngine = false;
                    this.engineCallback = null;
                    
                    // Try to use cached best move if it's from the current position
                    const currentFen = this.game.fen();
                    if (this.bestMove && this.lastAnalyzedFen === currentFen) {
                        console.log('Using cached best move from current position:', this.bestMove);
                        const moves = this.game.moves({ verbose: true });
                        const move = moves.find(m => 
                            m.from + m.to === this.bestMove.substring(0, 4)
                        );
                        
                        if (move) {
                            console.log('Cached move is legal, using it');
                            setTimeout(() => {
                                this.makeMove(move);
                                this.drawBoard();
                            }, 300);
                            return;
                        } else {
                            console.log('Cached move is not legal in current position');
                        }
                    } else if (this.bestMove) {
                        console.log('Cached move exists but is from a different position (stale)');
                    }
                    
                    // Fallback to random move if no valid cached move available
                    console.warn('No valid cached move available, making random move');
                    this.makeRandomMove();
                }
            }, 20000); // 20 second timeout (increased from 8 seconds)
        } else {
            // Fallback: random legal move
            this.makeRandomMove();
        }
    }
    
    makeRandomMove() {
        const moves = this.game.moves({ verbose: true });
        if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            setTimeout(() => {
                this.makeMove(randomMove);
                this.drawBoard();
            }, 300);
        }
    }
    
    updateUI() {
        // Update side to move
        document.getElementById('sideToMove').textContent = 
            this.game.turn() === 'w' ? 'White' : 'Black';
        
        // Update move number
        const fullMoves = Math.ceil(this.moveHistory.length / 2);
        document.getElementById('moveNumber').textContent = fullMoves;
        
        // Update position description
        const moveCount = this.moveHistory.length;
        const opening = this.openingLines[this.currentOpening];
        const maxBookMoves = opening.lines[this.currentLine].length;
        
        let positionText = 'Starting position';
        if (moveCount > 0 && moveCount <= 4) {
            positionText = 'Opening moves';
        } else if (moveCount >= 5 && moveCount <= 10) {
            positionText = `Early ${opening.name}`;
        } else if (moveCount > 10 && moveCount <= maxBookMoves) {
            positionText = `${opening.name} development`;
        } else if (moveCount > maxBookMoves && moveCount <= maxBookMoves + 6) {
            positionText = 'Leaving book moves';
        } else {
            positionText = 'Middle game';
        }
        document.getElementById('position').textContent = positionText;
        
        // Update move history
        this.updateMoveHistory();
        
        // Update next book move hint
        this.updateNextBookMove();
        
        // Check for game over
        try {
            const gameOver = this.game.isGameOver ? this.game.isGameOver() : 
                             this.game.game_over ? this.game.game_over() : false;
            
            if (gameOver) {
                const inCheckmate = this.game.isCheckmate ? this.game.isCheckmate() :
                                   this.game.in_checkmate ? this.game.in_checkmate() : false;
                const inDraw = this.game.isDraw ? this.game.isDraw() :
                              this.game.in_draw ? this.game.in_draw() : false;
                const inStalemate = this.game.isStalemate ? this.game.isStalemate() :
                                   this.game.in_stalemate ? this.game.in_stalemate() : false;
                
                let result, feedbackType;
                
                if (inCheckmate) {
                    const winner = this.game.turn() === 'w' ? 'Black' : 'White';
                    const youWon = (winner === 'Black' && this.playerSide === 'black') || 
                                   (winner === 'White' && this.playerSide === 'white');
                    
                    if (youWon) {
                        result = '🎉 Checkmate! You win! 🎉';
                        feedbackType = 'success';
                    } else {
                        result = '💀 Checkmate! You lose.';
                        feedbackType = 'error';
                    }
                } else if (inStalemate) {
                    result = '🤝 Stalemate - Draw!';
                    feedbackType = 'info';
                } else if (inDraw) {
                    result = '🤝 Draw!';
                    feedbackType = 'info';
                } else {
                    result = 'Game Over';
                    feedbackType = 'info';
                }
                
                this.showFeedback(result, feedbackType);
                
                // Show a styled modal overlay
                this.showGameOverModal(result, feedbackType);
            }
        } catch (e) {
            console.error('Error checking game over:', e);
        }
    }
    
    updateMoveHistory() {
        const historyElement = document.getElementById('moveHistory');
        historyElement.innerHTML = '';
        
        for (let i = 0; i < this.moveHistory.length; i += 2) {
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = this.moveHistory[i];
            const blackMove = this.moveHistory[i + 1] || '';
            
            const movePair = document.createElement('div');
            movePair.className = 'move-pair';
            movePair.textContent = `${moveNumber}. ${whiteMove} ${blackMove}`;
            historyElement.appendChild(movePair);
        }
        
        historyElement.scrollTop = historyElement.scrollHeight;
    }
    
    updateNextBookMove() {
        const nextMoveElement = document.getElementById('nextBookMove');
        
        const opening = this.openingLines[this.currentOpening];
        const expectedMoves = opening.lines[this.currentLine];
        const maxBookMoves = expectedMoves.length;
        
        // Only show next move if we're still in opening book
        if (this.moveHistory.length >= maxBookMoves) {
            nextMoveElement.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">Out of opening book - play your best moves!</p>';
            this.currentBookMove = null;
            return;
        }
        
        const nextMoveIndex = this.moveHistory.length;
        const nextMove = expectedMoves[nextMoveIndex];
        
        if (nextMove) {
            const isPlayerTurn = (this.game.turn() === 'w' && this.playerSide === 'white') ||
                                (this.game.turn() === 'b' && this.playerSide === 'black');
            
            const moveNumber = Math.floor(nextMoveIndex / 2) + 1;
            const moveColor = nextMoveIndex % 2 === 0 ? 'White' : 'Black';
            
            // Parse the book move to get from/to squares for highlighting
            // Always show the book move indicator when it's the player's turn
            if (isPlayerTurn) {
                // Try to find the move in legal moves
                const legalMoves = this.game.moves({ verbose: true });
                const bookMoveObj = legalMoves.find(m => m.san === nextMove);
                
                if (bookMoveObj) {
                    this.currentBookMove = {
                        from: bookMoveObj.from,
                        to: bookMoveObj.to,
                        san: nextMove
                    };
                    console.log('Book move highlighted:', nextMove, 'from', bookMoveObj.from, 'to', bookMoveObj.to);
                } else {
                    console.warn('Could not find book move in legal moves:', nextMove);
                    this.currentBookMove = null;
                }
            } else {
                this.currentBookMove = null;
            }
            
            if (isPlayerTurn) {
                nextMoveElement.innerHTML = `
                    <p style="margin: 10px 0 5px 0;"><strong>📖 Next Book Move:</strong></p>
                    <p style="font-size: 1.2em; color: #3498db; font-weight: bold; margin: 5px 0;">
                        ${moveNumber}${nextMoveIndex % 2 === 0 ? '.' : '...'} ${nextMove}
                    </p>
                    <p style="font-size: 0.9em; color: #7f8c8d; font-style: italic;">
                        (Your turn - Try to find this move!)
                    </p>
                `;
            } else {
                nextMoveElement.innerHTML = `
                    <p style="margin: 10px 0 5px 0;"><strong>📖 Expected ${moveColor} Response:</strong></p>
                    <p style="font-size: 1.1em; color: #7f8c8d; margin: 5px 0;">
                        ${moveNumber}${nextMoveIndex % 2 === 0 ? '.' : '...'} ${nextMove}
                    </p>
                `;
            }
        } else {
            nextMoveElement.innerHTML = '';
            this.currentBookMove = null;
        }
    }
    
    updateEvaluationUI() {
        const evalElement = document.getElementById('evaluation');
        
        if (Math.abs(this.currentEvaluation) > 900) {
            const mateIn = this.currentEvaluation > 0 ? 
                Math.round((1000 - this.currentEvaluation) / 2) : 
                Math.round((-1000 - this.currentEvaluation) / 2);
            evalElement.textContent = `M${Math.abs(mateIn)}`;
        } else {
            const sign = this.currentEvaluation >= 0 ? '+' : '';
            evalElement.textContent = sign + this.currentEvaluation.toFixed(2);
        }
        
        evalElement.className = '';
        if (this.currentEvaluation > 0) {
            evalElement.classList.add('positive');
        } else if (this.currentEvaluation < 0) {
            evalElement.classList.add('negative');
        }
    }
    
    updateBestMoveUI() {
        if (this.bestMove) {
            const from = this.bestMove.substring(0, 2);
            const to = this.bestMove.substring(2, 4);
            const promotion = this.bestMove.length > 4 ? this.bestMove[4] : '';
            
            let displayMove = from + '-' + to;
            if (promotion) {
                displayMove += '=' + promotion.toUpperCase();
            }
            
            document.getElementById('bestMove').textContent = displayMove;
        }
    }
    
    showFeedback(message, type) {
        const feedbackElement = document.getElementById('feedback');
        feedbackElement.textContent = message;
        feedbackElement.className = 'feedback ' + type;
    }
    
    showGameOverModal(message, type) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'game-over-modal ' + type;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'game-over-message';
        messageDiv.textContent = message;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'game-over-buttons';
        
        const newGameBtn = document.createElement('button');
        newGameBtn.textContent = 'New Game';
        newGameBtn.className = 'btn btn-primary';
        newGameBtn.onclick = () => {
            document.body.removeChild(overlay);
            this.newGame();
        };
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Review Game';
        closeBtn.className = 'btn btn-secondary';
        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
        };
        
        buttonContainer.appendChild(newGameBtn);
        buttonContainer.appendChild(closeBtn);
        
        modal.appendChild(messageDiv);
        modal.appendChild(buttonContainer);
        overlay.appendChild(modal);
        
        document.body.appendChild(overlay);
        
        // Animate in
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
    }
    
    showPromotionDialog(move) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay promotion-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'promotion-modal';
        
        const title = document.createElement('h2');
        title.textContent = 'Choose Promotion Piece';
        title.style.marginBottom = '20px';
        title.style.color = '#2c3e50';
        
        const pieceContainer = document.createElement('div');
        pieceContainer.className = 'promotion-pieces';
        
        const pieces = [
            { type: 'q', symbol: move.color === 'w' ? '♕' : '♛', name: 'Queen' },
            { type: 'r', symbol: move.color === 'w' ? '♖' : '♜', name: 'Rook' },
            { type: 'b', symbol: move.color === 'w' ? '♗' : '♝', name: 'Bishop' },
            { type: 'n', symbol: move.color === 'w' ? '♘' : '♞', name: 'Knight' }
        ];
        
        pieces.forEach(piece => {
            const btn = document.createElement('button');
            btn.className = 'promotion-piece-btn';
            btn.innerHTML = `<span class="piece-symbol">${piece.symbol}</span><br><span class="piece-name">${piece.name}</span>`;
            btn.onclick = () => {
                document.body.removeChild(overlay);
                // Make the move with promotion
                const promotionMove = {
                    from: move.from,
                    to: move.to,
                    promotion: piece.type
                };
                this.makeMove(promotionMove, true); // true = player move
                this.selectedSquare = null;
                this.validMoves = [];
                this.drawBoard();
            };
            pieceContainer.appendChild(btn);
        });
        
        modal.appendChild(title);
        modal.appendChild(pieceContainer);
        overlay.appendChild(modal);
        
        document.body.appendChild(overlay);
        
        // Animate in
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
    }
    
    setupEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => {
            this.newGame();
        });
        
        document.getElementById('flipBoard').addEventListener('click', () => {
            this.boardFlipped = !this.boardFlipped;
            this.drawBoard();
        });
        
        document.getElementById('getHint').addEventListener('click', () => {
            this.getHint();
        });
        
        document.getElementById('undoMove').addEventListener('click', () => {
            this.undoMove();
        });
        
        document.getElementById('skillLevel').addEventListener('change', (e) => {
            this.setSkillLevel(parseInt(e.target.value));
        });
        
        document.getElementById('openingChoice').addEventListener('change', (e) => {
            this.setOpening(e.target.value);
        });
        
        document.getElementById('boardStyle').addEventListener('change', (e) => {
            this.setBoardStyle(e.target.value);
        });
        
        document.getElementById('pieceStyle').addEventListener('change', (e) => {
            this.setPieceStyle(e.target.value);
        });
    }
    
    setOpening(openingKey) {
        this.currentOpening = openingKey;
        const opening = this.openingLines[openingKey];
        this.playerSide = opening.playerSide;
        this.currentLine = opening.mainLine;
        
        // Set board orientation
        this.boardFlipped = (this.playerSide === 'black');
        
        // Reset and start new game
        this.game.reset();
        this.moveHistory = [];
        this.selectedSquare = null;
        this.validMoves = [];
        this.drawBoard();
        this.updateUI();
        
        // Update UI to show which side player is
        const colorDisplay = this.playerSide === 'white' ? '♙ White' : '♟ Black';
        const playerColorSpan = document.getElementById('playerColor');
        if (playerColorSpan) {
            playerColorSpan.textContent = colorDisplay;
        }
        
        // Update opening description
        this.updateOpeningDescription(openingKey);
        
        this.showFeedback(`Training ${opening.name} as ${this.playerSide.charAt(0).toUpperCase() + this.playerSide.slice(1)}`, 'info');
        
        // If player is white, they start; if black, computer starts
        if (this.playerSide === 'black') {
            setTimeout(() => this.makeComputerMove(), 300);
        }
    }
    
    updateOpeningDescription(openingKey) {
        const description = this.openingDescriptions[openingKey];
        const opening = this.openingLines[openingKey];
        const descriptionDiv = document.getElementById('openingDescription');
        
        if (description && descriptionDiv) {
            descriptionDiv.innerHTML = `
                <p class="info-text">
                    <strong>${opening.name}:</strong> ${description}
                </p>
            `;
        }
    }
    
    setSkillLevel(level) {
        this.skillLevel = level;
        
        if (this.stockfish && this.stockfishReady) {
            if (level < 25) {
                // Use strength limiting for levels 1-20
                const elo = this.getEloForSkillLevel(level);
                this.stockfish.postMessage('setoption name UCI_LimitStrength value true');
                this.stockfish.postMessage(`setoption name UCI_Elo value ${elo}`);
                this.showFeedback(`Stockfish level set to ${level} (~${elo} ELO)`, 'info');
            } else {
                // Level 25: Full strength, no limiting
                this.stockfish.postMessage('setoption name UCI_LimitStrength value false');
                this.showFeedback(`Stockfish level set to ${level} (Maximum Strength - Super GM)`, 'info');
            }
        }
        
        console.log('Skill level set to:', level, level < 25 ? 'ELO: ' + this.getEloForSkillLevel(level) : 'Maximum Strength');
    }
    
    newGame() {
        this.game.reset();
        this.moveHistory = [];
        this.selectedSquare = null;
        this.validMoves = [];
        this.currentEvaluation = 0;
        this.bestMove = null;
        
        this.drawBoard();
        this.updateUI();
        this.analyzePosition();
        
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        
        // White starts
        this.makeComputerMove();
    }
    
    getHint() {
        if (this.bestMove) {
            this.showFeedback(`Stockfish suggests: ${this.bestMove}`, 'info');
        } else {
            this.analyzePosition();
            setTimeout(() => {
                if (this.bestMove) {
                    this.showFeedback(`Stockfish suggests: ${this.bestMove}`, 'info');
                } else {
                    this.showFeedback('Analyzing position...', 'info');
                }
            }, 1000);
        }
    }
    
    undoMove() {
        if (this.moveHistory.length >= 2) {
            // Undo both player and computer moves
            this.game.undo();
            this.game.undo();
            this.moveHistory.pop();
            this.moveHistory.pop();
            
            this.selectedSquare = null;
            this.validMoves = [];
            
            this.drawBoard();
            this.updateUI();
            this.analyzePosition();
            
            this.showFeedback('Last move undone', 'info');
        }
    }
    
    setBoardStyle(style) {
        const board = document.getElementById('chessboard');
        // Remove all board style classes
        board.classList.remove('board-classic', 'board-blue', 'board-green', 'board-gray', 'board-wood');
        // Add new style class
        if (style !== 'classic') {
            board.classList.add('board-' + style);
        }
    }
    
    setPieceStyle(style) {
        const board = document.getElementById('chessboard');
        // Remove all piece style classes
        board.classList.remove('pieces-classic', 'pieces-modern', 'pieces-bold');
        // Add new style class
        if (style !== 'classic') {
            board.classList.add('pieces-' + style);
        }
    }
}

// Initialize the app when the page loads
window.addEventListener('load', () => {
    new ChessTrainer();
});
