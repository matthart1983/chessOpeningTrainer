// Stockfish.js wrapper for CDN loading
(function() {
    // Use Stockfish from CDN
    const stockfishPath = 'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js';
    
    // Create a Web Worker if available
    if (typeof Worker !== 'undefined') {
        try {
            // Try to use the Web Worker version
            window.STOCKFISH = function() {
                const worker = new Worker(stockfishPath);
                return worker;
            };
        } catch (e) {
            console.log('Web Worker not available, using fallback');
            useFallback();
        }
    } else {
        useFallback();
    }
    
    function useFallback() {
        // Fallback: Load stockfish.js synchronously
        const script = document.createElement('script');
        script.src = stockfishPath;
        script.async = false;
        document.head.appendChild(script);
        
        script.onload = function() {
            console.log('Stockfish loaded');
        };
        
        script.onerror = function() {
            console.error('Failed to load Stockfish from CDN');
            // Create a mock Stockfish for demo purposes
            window.STOCKFISH = function() {
                return {
                    postMessage: function(msg) {
                        console.log('Mock Stockfish:', msg);
                        if (msg === 'isready') {
                            setTimeout(() => {
                                if (this.onmessage) {
                                    this.onmessage({data: 'readyok'});
                                }
                            }, 100);
                        }
                    },
                    onmessage: null
                };
            };
        };
    }
})();
