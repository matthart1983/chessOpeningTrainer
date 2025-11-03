const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.mem': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
  console.log('Request:', req.method, req.url);
  
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Allow serving from node_modules
  if (!filePath.startsWith('./node_modules/') && !fs.existsSync(filePath)) {
    // Try to find in node_modules if not found in root
    const nodeModulesPath = './node_modules' + req.url;
    if (fs.existsSync(nodeModulesPath)) {
      filePath = nodeModulesPath;
    }
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.error('File not found:', req.url, 'Tried:', filePath);
        res.writeHead(404);
        res.end('File not found: ' + req.url);
      } else {
        console.error('Server error:', error);
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      console.log('Serving:', filePath, 'as', contentType);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server is ready to accept connections`);
});
