const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Proxy pacientes requests to Node.js backend
app.use('/api/v1/pacientes', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
}));

// Proxy medicos requests to PHP backend
app.use('/api/v1/medicos', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
}));

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Pacientes API -> http://localhost:3001');
  console.log('Medicos API -> http://localhost:3002');
});
