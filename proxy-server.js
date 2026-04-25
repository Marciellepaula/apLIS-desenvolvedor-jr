const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy pacientes requests to Node.js backend (port 3001)
app.use('/api/v1/pacientes', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/pacientes': '/api/v1/pacientes'
  }
}));

// Proxy medicos requests to PHP backend (port 3002)
app.use('/api/v1/medicos', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/v1/medicos': '/api/v1/medicos'
  }
}));

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log('Pacientes API -> http://localhost:3001');
  console.log('Medicos API -> http://localhost:3002');
});
