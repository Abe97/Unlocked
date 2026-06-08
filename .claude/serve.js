const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..');

const mime = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.gif': 'image/gif', '.webm': 'video/webm',
  '.mp4': 'video/mp4', '.otf': 'font/otf', '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  const urlPath = req.url === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(dir, urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(8080, () => console.log('Serving on http://localhost:8080'));
