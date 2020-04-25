
const fs = require('fs');

const requestBody = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>This is test page</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>')
        return res.end();
    }

    if(url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
            console.log("sjfkasj", body)
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            console.log("======", parsedBody, message);
            fs.writeFileSync('message.txt', message);
            res.setHeader('Location', '/');
            res.statusCode = 302
            return res.end();
        });
    }
    // res.setHeader('Content-Type', 'text/html');
    // res.write('<html>');
    // res.write('<head><title>This is test page</title></head>');
    // res.write('<body>Hello world!!</body>');
    // res.write('</html>')
    // res.end();
}

module.exports = requestBody;