const { createProxyMiddleware } = require('http-proxy-middleware');

// https://www.npmjs.com/package/http-proxy-middleware

// ★ 새로 경로 추가할 때 마다 []여기 배열 안에 '/경로' 추가해줘야함 ★
module.exports = function (app){
    app.use(
        createProxyMiddleware(['/api','/uploads'], {
            target: 'http://localhost:3001',
            changeOrigin: true
        })
    )
};
