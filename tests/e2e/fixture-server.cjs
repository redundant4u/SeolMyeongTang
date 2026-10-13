const http = require('node:http');
const post = {
    Title: 'Test article',
    SK: 'demo',
    CreatedAt: '2026-01-01',
    Tags: ['test'],
    Content: '# Article body\n\n`inline code`',
};

http.createServer((req, res) => {
    const path = new URL(req.url, 'http://localhost').pathname;
    const body = path === '/post' ? [post] : path === '/post/demo' ? post : null;
    res.writeHead(body ? 200 : 404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
}).listen(4318, '127.0.0.1');
