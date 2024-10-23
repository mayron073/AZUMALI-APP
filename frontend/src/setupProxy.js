const { createProxyMiddleware } = require('http-proxy-middleware');
const backendUrl = process.env.REACT_APP_BACKEND_URL;

module.exports = function(app) {
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://192.168.1.65:4000',
      changeOrigin: true,
      ws: true, // Habilita WebSocket
    })
  );
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.1.65:4000',
      changeOrigin: true,
    })
  );
};
