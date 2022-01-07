import http from 'http';
import app from './app.js';
// Using port at server or local server at port 5000
const port = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(port);
