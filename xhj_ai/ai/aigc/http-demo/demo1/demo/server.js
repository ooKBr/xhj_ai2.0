const http = require('http');
const https = require('https');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const PROXY_PORT = 3000;

// Allowed origins for CORS (Live Server)
const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:5501',
  'http://localhost:5501'
];

function setCORSHeaders(res, origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res, req.headers.origin);
    res.writeHead(204);
    res.end();
    return;
  }

  // Only accept POST /api/chat
  if (req.method !== 'POST' || req.url !== '/api/chat') {
    setCORSHeaders(res, req.headers.origin);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  // Read request body
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const deepseekUrl = new URL(DEEPSEEK_API_URL);

    const options = {
      hostname: deepseekUrl.hostname,
      path: deepseekUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const proxyReq = https.request(options, (proxyRes) => {
      // Forward DeepSeek response back to browser
      let responseBody = '';
      proxyRes.on('data', chunk => { responseBody += chunk; });
      proxyRes.on('end', () => {
        setCORSHeaders(res, req.headers.origin);
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'application/json'
        });
        res.end(responseBody);
      });
    });

    proxyReq.on('error', (err) => {
      setCORSHeaders(res, req.headers.origin);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy error: ' + err.message }));
    });

    proxyReq.write(body);
    proxyReq.end();
  });
});

server.listen(PROXY_PORT, () => {
  console.log(`Proxy server running on http://127.0.0.1:${PROXY_PORT}`);
  console.log(`Proxying POST /api/chat -> ${DEEPSEEK_API_URL}`);
});
