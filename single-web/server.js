const http = require('http');

const server = http.createServer((request, response) => {
  // 當你的 server 接收到 request 的時候做什麼事
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/html;charset=utf-8');
  response.end('<html><head>simple server</head><body><h1>hello world!</h1></body></html>');
  // response.end('hello server');
});

server.listen(3001, (err, result) => {
  console.log('Server listening on 3001');
});
