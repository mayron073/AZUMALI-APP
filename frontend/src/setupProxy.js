const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://192.168.1.58:4000',
      changeOrigin: true,
      ws: true, // Habilita WebSocket
    })
  );
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.1.58:4000',
      changeOrigin: true,
    })
  );
};
